import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Users, Radio, LogOut } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { AdSense } from './AdSense';

const CHAT_ROOMS = [
  { id: 'roblox', name: 'Roblox', color: 'from-red-500 to-orange-500' },
  { id: 'fortnite', name: 'Fortnite', color: 'from-purple-500 to-blue-500' },
  { id: 'minecraft', name: 'Minecraft', color: 'from-green-500 to-lime-500' },
  { id: 'warzone', name: 'WarZone', color: 'from-yellow-500 to-red-500' },
  { id: 'general', name: 'General Chat', color: 'from-cyan-500 to-magenta-500' },
  { id: 'lounge', name: 'Chill Lounge', color: 'from-blue-500 to-purple-500' },
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
    <div className="min-h-screen bg-black text-white">
      <AdSense slot="voice-chat-top" />
      
      <div className="container mx-auto px-4 py-8">
        {!hasJoined ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 
                className="text-4xl mb-4"
                style={{
                  fontFamily: 'monospace',
                  textShadow: '0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(255, 0, 255, 0.5)'
                }}
              >
                VOICE CHAT ROOMS
              </h2>
              <p className="text-cyan-400/70">Connect with gamers around the world. No login required - just pick a name and join!</p>
            </div>

            <div className="mb-8 flex justify-center">
              <div className="w-full max-w-md">
                <label className="block text-cyan-400 mb-2">Enter Your Screen Name:</label>
                <input
                  type="text"
                  value={screenName}
                  onChange={(e) => setScreenName(e.target.value)}
                  placeholder="CoolGamer123"
                  className="w-full px-4 py-3 bg-black/50 border-2 border-cyan-500/50 rounded focus:border-cyan-500 focus:outline-none text-white placeholder:text-cyan-400/30"
                  maxLength={20}
                  onKeyDown={(e) => e.key === 'Enter' && selectedRoom && joinRoom(selectedRoom)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CHAT_ROOMS.map((room) => (
                <button
                  key={room.id}
                  onClick={() => joinRoom(room.id)}
                  disabled={isConnecting || !screenName.trim()}
                  className={`p-6 rounded-lg border-2 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isConnecting && selectedRoom === room.id
                      ? 'border-white bg-white/10'
                      : 'border-cyan-500/30 hover:border-cyan-500 bg-black/30'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.6)), linear-gradient(135deg, ${
                      room.color.includes('red') ? 'rgba(255,0,0,0.1)' :
                      room.color.includes('purple') ? 'rgba(128,0,255,0.1)' :
                      room.color.includes('green') ? 'rgba(0,255,0,0.1)' :
                      room.color.includes('yellow') ? 'rgba(255,255,0,0.1)' :
                      room.color.includes('cyan') ? 'rgba(0,255,255,0.1)' :
                      'rgba(0,128,255,0.1)'
                    }, transparent)`
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Radio className="w-6 h-6 text-cyan-400" />
                    <Users className="w-5 h-5 text-cyan-400/50" />
                  </div>
                  <h3 className="text-xl mb-1">{room.name}</h3>
                  <p className="text-sm text-cyan-400/50">
                    {isConnecting && selectedRoom === room.id ? 'Connecting...' : 'Click to join'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/50 border-2 border-cyan-500/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl text-cyan-400">
                    {CHAT_ROOMS.find(r => r.id === selectedRoom)?.name}
                  </h3>
                  <p className="text-cyan-400/50">Connected as: {screenName}</p>
                </div>
                <button
                  onClick={leaveRoom}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded hover:bg-red-500/30 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Leave Room
                </button>
              </div>

              <div className="flex gap-4 mb-6">
                <button
                  onClick={toggleMute}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-lg border-2 transition-all ${
                    isMuted
                      ? 'border-red-500 bg-red-500/20 text-red-400'
                      : 'border-green-500 bg-green-500/20 text-green-400'
                  }`}
                >
                  {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  {isMuted ? 'Unmute' : 'Mute'}
                </button>
              </div>

              <div>
                <h4 className="text-cyan-400 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Users in Room ({users.length})
                </h4>
                <div className="space-y-2">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-black/30 border border-cyan-500/20 rounded"
                    >
                      <span className="text-white">{user.screenName}</span>
                      {user.isMuted ? (
                        <MicOff className="w-4 h-4 text-red-400" />
                      ) : (
                        <Mic className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                  ))}
                  {users.length === 0 && (
                    <p className="text-cyan-400/50 text-center py-4">
                      Waiting for others to join...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8">
        <AdSense slot="voice-chat-bottom" />
      </div>
    </div>
  );
}
