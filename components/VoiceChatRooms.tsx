import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Users, Radio, LogOut } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const CHAT_ROOMS = [
  { id: 'roblox', name: 'Roblox', emoji: '🎮' },
  { id: 'fortnite', name: 'Fortnite', emoji: '🏰' },
  { id: 'minecraft', name: 'Minecraft', emoji: '⛏️' },
  { id: 'warzone', name: 'WarZone', emoji: '🎯' },
  { id: 'general', name: 'General Chat', emoji: '💬' },
  { id: 'lounge', name: 'Chill Lounge', emoji: '🛋️' },
];

interface User {
  id: string;
  screenName: string;
  isMuted: boolean;
}

export function VoiceChatRooms() {
  const [screenName, setScreenName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const supabaseRef = useRef<any>(null);
  const channelRef = useRef<any>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const userIdRef = useRef<string>(crypto.randomUUID());

  useEffect(() => {
    supabaseRef.current = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey
    );
  }, []);

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }, 
        video: false 
      });
      localStreamRef.current = stream;
      stream.getAudioTracks()[0].enabled = !isMuted;
      return stream;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
      return null;
    }
  };

  const createPeerConnection = (userId: string, stream: MediaStream) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Add local stream tracks
    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
    });

    // Handle incoming remote stream
    pc.ontrack = (event) => {
      const remoteAudio = new Audio();
      remoteAudio.srcObject = event.streams[0];
      remoteAudio.play().catch(e => console.error('Error playing remote audio:', e));
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'ice-candidate',
          payload: {
            candidate: event.candidate,
            from: userIdRef.current,
            to: userId
          }
        });
      }
    };

    peerConnectionsRef.current.set(userId, pc);
    return pc;
  };

  const joinRoom = async (roomId: string) => {
    if (!screenName.trim()) {
      alert('Please enter a screen name first!');
      return;
    }

    setIsConnecting(true);
    setSelectedRoom(roomId);

    const stream = await startLocalStream();
    if (!stream) {
      setIsConnecting(false);
      setSelectedRoom(null);
      return;
    }

    const channel = supabaseRef.current.channel(`voice-room-${roomId}`, {
      config: {
        broadcast: { self: true },
        presence: { key: userIdRef.current }
      }
    });

    // Handle presence sync
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const userList: User[] = [];
      
      Object.keys(state).forEach(key => {
        const presences = state[key];
        presences.forEach((presence: any) => {
          userList.push({
            id: presence.id,
            screenName: presence.screenName,
            isMuted: presence.isMuted
          });
        });
      });
      
      setUsers(userList);
    });

    // Handle presence join
    channel.on('presence', { event: 'join' }, ({ newPresences }: any) => {
      newPresences.forEach((presence: any) => {
        if (presence.id !== userIdRef.current) {
          // Create offer for new user
          const pc = createPeerConnection(presence.id, stream);
          pc.createOffer()
            .then(offer => pc.setLocalDescription(offer))
            .then(() => {
              channel.send({
                type: 'broadcast',
                event: 'offer',
                payload: {
                  offer: pc.localDescription,
                  from: userIdRef.current,
                  to: presence.id
                }
              });
            });
        }
      });
    });

    // Handle WebRTC signaling
    channel.on('broadcast', { event: 'offer' }, async ({ payload }: any) => {
      if (payload.to === userIdRef.current) {
        const pc = createPeerConnection(payload.from, stream);
        await pc.setRemoteDescription(payload.offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        
        channel.send({
          type: 'broadcast',
          event: 'answer',
          payload: {
            answer: pc.localDescription,
            from: userIdRef.current,
            to: payload.from
          }
        });
      }
    });

    channel.on('broadcast', { event: 'answer' }, async ({ payload }: any) => {
      if (payload.to === userIdRef.current) {
        const pc = peerConnectionsRef.current.get(payload.from);
        if (pc) {
          await pc.setRemoteDescription(payload.answer);
        }
      }
    });

    channel.on('broadcast', { event: 'ice-candidate' }, async ({ payload }: any) => {
      if (payload.to === userIdRef.current) {
        const pc = peerConnectionsRef.current.get(payload.from);
        if (pc) {
          await pc.addIceCandidate(payload.candidate);
        }
      }
    });

    await channel.subscribe(async (status: string) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          id: userIdRef.current,
          screenName: screenName.trim(),
          isMuted: isMuted
        });
        setHasJoined(true);
        setIsConnecting(false);
      }
    });

    channelRef.current = channel;
  };

  const leaveRoom = async () => {
    // Close all peer connections
    peerConnectionsRef.current.forEach(pc => pc.close());
    peerConnectionsRef.current.clear();

    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Unsubscribe from channel
    if (channelRef.current) {
      await channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    setSelectedRoom(null);
    setHasJoined(false);
    setUsers([]);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
      
      // Update presence
      if (channelRef.current) {
        channelRef.current.track({
          id: userIdRef.current,
          screenName: screenName.trim(),
          isMuted: !audioTrack.enabled
        });
      }
    }
  };

  return (
    <div className="text-center p-8">
      <h1 className="mega-glow-yellow text-4xl mb-8">🎤 VOICE CHAT ROOMS</h1>
      
      {!hasJoined ? (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="fun-ad-container">
            <p className="text-yellow-300 text-xl mb-4">
              Enter your screen name and join a voice chat room!
            </p>
            
            <div className="mb-6">
              <input
                type="text"
                value={screenName}
                onChange={(e) => setScreenName(e.target.value)}
                placeholder="Enter your cool screen name..."
                className="w-full max-w-md p-4 bg-black border-2 border-yellow-400 rounded-lg text-white text-xl text-center"
                style={{boxShadow: '0 0 15px #ffff00'}}
                maxLength={20}
              />
            </div>
          </div>

          {/* Room Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CHAT_ROOMS.map((room) => (
              <button
                key={room.id}
                onClick={() => joinRoom(room.id)}
                disabled={isConnecting || !screenName.trim()}
                className="super-arcade-button text-2xl"
                style={{
                  background: 'linear-gradient(145deg, #222, #000)',
                  border: '4px solid #ff0033',
                  boxShadow: '0 0 30px #ff0033, inset 0 0 20px rgba(255, 0, 51, 0.2), 0 10px 0 rgba(255, 0, 51, 0.3)',
                  color: '#ff0033'
                }}
              >
                {room.emoji} {room.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="fun-ad-container">
            <h2 className="text-3xl text-green-400 mb-4">
              🎧 IN VOICE ROOM: {CHAT_ROOMS.find(r => r.id === selectedRoom)?.name?.toUpperCase()}
            </h2>
            <p className="text-yellow-300 text-lg">
              Connected as: <strong>{screenName}</strong>
            </p>
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={toggleMute}
              className="super-arcade-button text-xl"
              style={{
                background: isMuted 
                  ? 'linear-gradient(145deg, #333, #111)' 
                  : 'linear-gradient(145deg, #222, #000)',
                border: isMuted ? '4px solid #ff0033' : '4px solid #ffff00',
                boxShadow: isMuted 
                  ? '0 0 30px #ff0033, inset 0 0 20px rgba(255, 0, 51, 0.2)' 
                  : '0 0 30px #ffff00, inset 0 0 20px rgba(255, 255, 0, 0.2)',
                color: isMuted ? '#ff0033' : '#ffff00'
              }}
            >
              {isMuted ? '🔇 UNMUTE' : '🎤 MUTE'}
            </button>

            <button
              onClick={leaveRoom}
              className="super-arcade-button text-xl"
              style={{
                background: 'linear-gradient(145deg, #222, #000)',
                border: '4px solid #ff0033',
                boxShadow: '0 0 30px #ff0033, inset 0 0 20px rgba(255, 0, 51, 0.2)',
                color: '#ff0033'
              }}
            >
              🚪 LEAVE ROOM
            </button>
          </div>

          {/* Users List */}
          <div className="fun-ad-container">
            <h3 className="text-2xl text-yellow-300 mb-4">👥 USERS IN ROOM ({users.length})</h3>
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="p-4 bg-black border-2 border-yellow-400 rounded-lg text-yellow-300 text-xl"
                  style={{boxShadow: '0 0 15px #ffff00'}}
                >
                  {user.screenName} {user.isMuted ? '🔇' : '🎤'}
                </div>
              ))}
              {users.length === 0 && (
                <p className="text-yellow-300 text-lg">
                  Waiting for friends to join...
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Ads */}
      <div className="fun-ad-container mt-8">
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1184595877548269" crossOrigin="anonymous"></script>
        <ins className="adsbygoogle"
             style={{display: 'block'}}
             data-ad-client="ca-pub-1184595877548269"
             data-ad-slot="voice-chat-top"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    </div>
  );
}
