import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const CHAT_ROOMS = [
  { id: 'warzone', name: 'WARZONE', emoji: '🎯', users: 12 },
  { id: 'roblox', name: 'ROBLOX', emoji: '🎮', users: 25 },
  { id: 'minecraft', name: 'MINECRAFT', emoji: '⛏️', users: 18 },
  { id: 'music', name: 'MUSIC', emoji: '🎵', users: 8 },
  { id: 'sports', name: 'SPORTS', emoji: '⚽', users: 15 },
  { id: 'cars', name: 'CARS', emoji: '🏎️', users: 9 },
  { id: 'girls', name: 'GIRLS', emoji: '👧', users: 11 },
  { id: 'boys', name: 'BOYS', emoji: '👦', users: 13 },
  { id: '67', name: '67', emoji: '🔥', users: 67, special: true },
  { id: 'gaming', name: 'GAMING', emoji: '🎲', users: 22 },
  { id: 'anime', name: 'ANIME', emoji: '🌟', users: 7 },
  { id: 'memes', name: 'MEMES', emoji: '😂', users: 31 }
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
  const [showRoomSelection, setShowRoomSelection] = useState(false);
  
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

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (screenName.trim()) {
      setShowRoomSelection(true);
    }
  };

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

    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
    });

    pc.ontrack = (event) => {
      const remoteAudio = new Audio();
      remoteAudio.srcObject = event.streams[0];
      remoteAudio.play().catch(e => console.error('Error playing remote audio:', e));
    };

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
    if (!screenName.trim()) return;

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

    channel.on('presence', { event: 'join' }, ({ newPresences }: any) => {
      newPresences.forEach((presence: any) => {
        if (presence.id !== userIdRef.current) {
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
    peerConnectionsRef.current.forEach(pc => pc.close());
    peerConnectionsRef.current.clear();

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    if (channelRef.current) {
      await channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    setSelectedRoom(null);
    setHasJoined(false);
    setUsers([]);
    setShowRoomSelection(false);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
      
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
    <div className="text-center p-8 matrix-font">
      <h1 className="mega-glow-yellow text-4xl mb-8 matrix-title">VOICE CHAT ROOMS</h1>
      
      {/* Top Leaderboard Ad */}
      <div className="ad-leaderboard">
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1184595877548269"></script>
        <ins className="adsbygoogle"
             style={{display: 'inline-block', width: '728px', height: '90px'}}
             data-ad-client="ca-pub-1184595877548269"
             data-ad-slot="1234567890"></ins>
      </div>
      
      {!hasJoined ? (
        <div className="space-y-6 max-w-6xl mx-auto">
          {!showRoomSelection ? (
            <div className="fun-ad-container">
              <p className="text-yellow-300 text-xl mb-4">
                ENTER YOUR SCREEN NAME TO JOIN VOICE CHAT
              </p>
              
              <form onSubmit={handleNameSubmit} className="space-y-4">
                <input
                  type="text"
                  value={screenName}
                  onChange={(e) => setScreenName(e.target.value)}
                  placeholder="ENTER YOUR COOL SCREEN NAME..."
                  className="matrix-input"
                  maxLength={20}
                />
                
                <button type="submit" className="join-button">
                  CONTINUE TO CHAT ROOMS
                </button>
              </form>
            </div>
          ) : (
            <>
              <div className="fun-ad-container">
                <p className="text-yellow-300 text-xl mb-4">
                  WELCOME: <span className="mega-glow-red">{screenName}</span>
                </p>
                <p className="text-green-400 text-lg">SELECT A CHAT ROOM TO JOIN</p>
                <p className="text-cyan-400 text-sm mt-2">{CHAT_ROOMS.length} ACTIVE ROOMS AVAILABLE</p>
              </div>

              {/* Medium Rectangle Ad */}
              <div className="ad-medium-rectangle">
                <ins className="adsbygoogle"
                     style={{display: 'inline-block', width: '300px', height: '250px'}}
                     data-ad-client="ca-pub-1184595877548269"
                     data-ad-slot="2345678901"></ins>
              </div>

              {/* CHAT ROOMS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                {CHAT_ROOMS.map((room) => (
                  <div
                    key={room.id}
                    className={`relative ${
                      room.special 
                        ? 'transform hover:scale-110 transition-transform duration-300' 
                        : 'transform hover:scale-105 transition-transform duration-300'
                    }`}
                  >
                    <button
                      onClick={() => joinRoom(room.id)}
                      disabled={isConnecting}
                      className={`w-full h-full p-6 rounded-2xl border-4 font-bold text-2xl transition-all duration-300 ${
                        room.special
                          ? 'bg-gradient-to-br from-red-500 to-yellow-500 text-white border-yellow-400 shadow-lg shadow-red-500/50 hover:shadow-xl hover:shadow-red-500/70'
                          : 'bg-gradient-to-br from-gray-900 to-black text-yellow-400 border-yellow-500 shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/50'
                      } ${isConnecting ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'}`}
                    >
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <span className="text-4xl">{room.emoji}</span>
                        <span className={room.special ? "text-3xl font-black" : ""}>
                          {room.name}
                        </span>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                            {room.users} ONLINE
                          </span>
                        </div>
                      </div>
                    </button>
                    
                    {room.special && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                        POPULAR
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Banner Ad */}
              <div className="ad-banner mt-8">
                <ins className="adsbygoogle"
                     style={{display: 'inline-block', width: '468px', height: '60px'}}
                     data-ad-client="ca-pub-1184595877548269"
                     data-ad-slot="3456789012"></ins>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="fun-ad-container">
            <h2 className="text-3xl text-green-400 mb-4">
              🎧 IN VOICE ROOM: {CHAT_ROOMS.find(r => r.id === selectedRoom)?.name?.toUpperCase()}
            </h2>
            <p className="text-yellow-300 text-lg">
              CONNECTED AS: <strong className="mega-glow-red">{screenName}</strong>
            </p>
          </div>

          {/* Banner Ad */}
          <div className="ad-banner">
            <ins className="adsbygoogle"
                 style={{display: 'inline-block', width: '468px', height: '60px'}}
                 data-ad-client="ca-pub-1184595877548269"
                 data-ad-slot="3456789012"></ins>
          </div>

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

          <div className="fun-ad-container">
            <h3 className="text-2xl text-yellow-300 mb-4">USERS IN ROOM ({users.length})</h3>
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
                  WAITING FOR FRIENDS TO JOIN...
                </p>
              )}
            </div>
          </div>

          {/* Large Rectangle Ad */}
          <div className="ad-large-rectangle">
            <ins className="adsbygoogle"
                 style={{display: 'inline-block', width: '336px', height: '280px'}}
                 data-ad-client="ca-pub-1184595877548269"
                 data-ad-slot="4567890123"></ins>
          </div>
        </div>
      )}
    </div>
  );
}
