import { useState, useEffect, useRef } from 'react';
import { ScreenNameModal } from './ScreenNameModal';

interface User {
  id: string;
  screenName: string;
  isYou?: boolean;
}

export function RealVoiceChatRooms() {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usersInRoom, setUsersInRoom] = useState<User[]>([]);
  const [showScreenNameModal, setShowScreenNameModal] = useState(false);
  const [pendingRoomId, setPendingRoomId] = useState<string | null>(null);
  const [localScreenName, setLocalScreenName] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [roomStats, setRoomStats] = useState<{[key: string]: number}>({});
  const [serverStatus, setServerStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  
  const localStreamRef = useRef<MediaStream | null>(null);
  const localUserIdRef = useRef<string>(Math.random().toString(36).substr(2, 9));
  const wsRef = useRef<WebSocket | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  // REAL rooms - no fake user counts
  const rooms = [
    { id: 'general', name: 'General Voice Chat', icon: '🎤' },
    { id: 'gaming', name: 'Gaming Lounge', icon: '🎮' },
    { id: 'strategy', name: 'Strategy Talk', icon: '🧠' },
    { id: 'casual', name: 'Casual Hangout', icon: '☕' },
    { id: 'competitive', name: 'Competitive', icon: '⚡' },
    { id: 'newbies', name: 'New Players', icon: '👋' }
  ];

  // WebSocket connection with automatic port detection
  useEffect(() => {
    const connectWebSocket = (port = 8081, attempt = 1) => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.hostname}:${port}`;
        
        console.log(`🔌 Connecting to WebSocket (attempt ${attempt}):`, wsUrl);
        setServerStatus('connecting');
        
        wsRef.current = new WebSocket(wsUrl);
        
        wsRef.current.onopen = () => {
          console.log('✅ Connected to signaling server on port', port);
          setServerStatus('connected');
          setError(null);
          
          // Rejoin room if we were in one
          if (activeRoom && localScreenName) {
            console.log('🔄 Rejoining room after reconnect');
            wsRef.current?.send(JSON.stringify({
              type: 'join-room',
              roomId: activeRoom,
              userId: localUserIdRef.current,
              screenName: localScreenName
            }));
          }
        };
        
        wsRef.current.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            console.log('📨 Received:', message.type);
            handleSignalingMessage(message);
          } catch (e) {
            console.error('Error parsing message:', e);
          }
        };
        
        wsRef.current.onclose = (event) => {
          console.log('🔌 Disconnected from signaling server:', event.code, event.reason);
          setServerStatus('disconnected');
          
          if (activeRoom) {
            setError('Connection lost. Reconnecting...');
            // Try to reconnect with exponential backoff
            const nextAttempt = Math.min(attempt + 1, 5);
            const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
            
            reconnectTimeoutRef.current = setTimeout(() => {
              // Try next port if this one failed
              const nextPort = port === 8081 ? 8082 : 8081;
              connectWebSocket(nextPort, nextAttempt);
            }, delay);
          }
        };
        
        wsRef.current.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          if (attempt >= 2) {
            setError('Voice server not found. Make sure the server is running on port 8081 or 8082.');
          }
        };
      } catch (error) {
        console.error('WebSocket connection failed:', error);
        setServerStatus('disconnected');
      }
    };
    
    connectWebSocket();
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Handle signaling messages
  const handleSignalingMessage = async (message: any) => {
    switch (message.type) {
      case 'user-joined':
        if (message.userId && message.userId !== localUserIdRef.current) {
          console.log('👤 User joined:', message.userId, message.screenName);
          setUsersInRoom(prev => {
            const exists = prev.find(u => u.id === message.userId);
            if (!exists) {
              return [...prev, {
                id: message.userId,
                screenName: message.screenName || 'User'
              }];
            }
            return prev;
          });
          await createOffer(message.userId);
        }
        break;
        
      case 'user-left':
        if (message.userId) {
          console.log('👤 User left:', message.userId);
          closePeerConnection(message.userId);
          setUsersInRoom(prev => prev.filter(user => user.id !== message.userId));
        }
        break;
        
      case 'room-users':
        // Update room user counts from server
        if (message.roomId === activeRoom) {
          const remoteUsers = message.users.map((user: any) => ({
            id: user.id,
            screenName: user.screenName
          }));
          
          // Include yourself
          const allUsers = [
            { id: localUserIdRef.current, screenName: localScreenName, isYou: true },
            ...remoteUsers
          ];
          
          setUsersInRoom(allUsers);
          console.log('👥 Room users updated:', allUsers);
        }
        break;
        
      case 'room-stats':
        setRoomStats(message.stats);
        console.log('📊 Room stats updated:', message.stats);
        break;
        
      case 'offer':
        if (message.userId && message.offer) {
          console.log('📞 Received offer from:', message.userId);
          await handleOffer(message.userId, message.offer);
        }
        break;
        
      case 'answer':
        if (message.userId && message.answer) {
          console.log('📞 Received answer from:', message.userId);
          await handleAnswer(message.userId, message.answer);
        }
        break;
        
      case 'ice-candidate':
        if (message.userId && message.candidate) {
          await handleIceCandidate(message.userId, message.candidate);
        }
        break;
    }
  };

  // WebRTC Functions (same as before, but simplified for brevity)
  const createPeerConnection = (userId: string): RTCPeerConnection => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }
    
    pc.ontrack = (event) => {
      console.log('🎧 Received remote stream from:', userId);
      const remoteStream = event.streams[0];
      const audioElement = document.createElement('audio');
      audioElement.srcObject = remoteStream;
      audioElement.autoplay = true;
      audioElement.style.display = 'none';
      audioElement.setAttribute('data-user-id', userId);
      document.body.appendChild(audioElement);
    };
    
    pc.onicecandidate = (event) => {
      if (event.candidate && wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'ice-candidate',
          userId: localUserIdRef.current,
          target: userId,
          candidate: event.candidate.toJSON()
        }));
      }
    };
    
    return pc;
  };

  const createOffer = async (userId: string) => {
    const pc = createPeerConnection(userId);
    peerConnectionsRef.current.set(userId, pc);
    
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'offer',
          userId: localUserIdRef.current,
          target: userId,
          offer: offer
        }));
      }
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const handleOffer = async (userId: string, offer: RTCSessionDescriptionInit) => {
    const pc = createPeerConnection(userId);
    peerConnectionsRef.current.set(userId, pc);
    
    try {
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'answer',
          userId: localUserIdRef.current,
          target: userId,
          answer: answer
        }));
      }
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  const handleAnswer = async (userId: string, answer: RTCSessionDescriptionInit) => {
    const pc = peerConnectionsRef.current.get(userId);
    if (pc) {
      await pc.setRemoteDescription(answer);
    }
  };

  const handleIceCandidate = async (userId: string, candidate: RTCIceCandidateInit) => {
    const pc = peerConnectionsRef.current.get(userId);
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const closePeerConnection = (userId: string) => {
    const pc = peerConnectionsRef.current.get(userId);
    if (pc) {
      pc.close();
      peerConnectionsRef.current.delete(userId);
      const audioElement = document.querySelector(`audio[data-user-id="${userId}"]`);
      if (audioElement) {
        audioElement.remove();
      }
    }
  };

  // Audio monitoring
  const setupAudioMonitoring = (stream: MediaStream) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyser);
      monitorAudioLevels();
    } catch (error) {
      console.error('Audio monitoring error:', error);
    }
  };

  const monitorAudioLevels = () => {
    if (!analyserRef.current) return;
    
    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const checkAudio = () => {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      const level = Math.min(average / 128, 1);
      
      setAudioLevel(level);
      setIsSpeaking(level > 0.1);
      animationRef.current = requestAnimationFrame(checkAudio);
    };
    
    animationRef.current = requestAnimationFrame(checkAudio);
  };

  const stopAudioMonitoring = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  // Join voice chat
  const joinVoiceChat = async (roomId: string, screenName: string) => {
    if (serverStatus !== 'connected') {
      setError('Cannot join - server not connected. Check if server is running.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      console.log('🎤 Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      localStreamRef.current = stream;
      setupAudioMonitoring(stream);

      // Join room via signaling server
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'join-room',
          roomId: roomId,
          userId: localUserIdRef.current,
          screenName: screenName
        }));
      }

      setActiveRoom(roomId);
      setUsersInRoom([{ id: localUserIdRef.current, screenName, isYou: true }]);
      console.log('✅ Joined room:', roomId);

    } catch (error) {
      console.error('❌ Error joining voice chat:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setError('Microphone permission denied. Please allow microphone access.');
        } else {
          setError('Failed to access microphone. Please check your audio settings.');
        }
      }
      leaveVoiceChat();
    } finally {
      setIsConnecting(false);
      setPendingRoomId(null);
    }
  };

  // Leave voice chat
  const leaveVoiceChat = () => {
    console.log('🚪 Leaving voice chat');
    
    peerConnectionsRef.current.forEach((pc, userId) => {
      pc.close();
    });
    peerConnectionsRef.current.clear();
    
    document.querySelectorAll('audio[data-user-id]').forEach(audio => {
      audio.remove();
    });
    
    stopAudioMonitoring();
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    setActiveRoom(null);
    setIsMuted(false);
    setUsersInRoom([]);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setIsMuted(!isMuted);
  };

  const handleScreenNameConfirm = (screenName: string) => {
    setLocalScreenName(screenName);
    setShowScreenNameModal(false);
    if (pendingRoomId) {
      joinVoiceChat(pendingRoomId, screenName);
    }
  };

  const startJoinProcess = (roomId: string) => {
    if (isConnecting || activeRoom) return;
    setPendingRoomId(roomId);
    setShowScreenNameModal(true);
  };

  // Get real user count for room
  const getRealUserCount = (roomId: string) => {
    return roomStats[roomId] || 0;
  };

  // Server status indicator
  const getServerStatusColor = () => {
    switch (serverStatus) {
      case 'connected': return 'text-green-400';
      case 'connecting': return 'text-yellow-400';
      case 'disconnected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getServerStatusText = () => {
    switch (serverStatus) {
      case 'connected': return 'Server Connected';
      case 'connecting': return 'Connecting to Server...';
      case 'disconnected': return 'Server Disconnected';
      default: return 'Unknown Status';
    }
  };

  return (
    <div className="main-content voice-chat-container">
      <div className="container">
        <ScreenNameModal 
          isOpen={showScreenNameModal}
          onConfirm={handleScreenNameConfirm}
          defaultName={localScreenName}
        />

        {/* AdSense at Top */}
        <div className="ad-container mb-8 text-center">
          <ins className="adsbygoogle"
            style={{display: 'block'}}
            data-ad-client="ca-pub-3940256099942544"
            data-ad-slot="1234567890"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl text-yellow-400 mb-4">VOICE CHAT ROOMS</h1>
          <p className="text-white text-xl">Real Multi-User Voice Chat</p>
          
          {/* Server Status */}
          <div className={`max-w-md mx-auto mt-4 p-3 rounded-lg ${getServerStatusColor()} bg-gray-800`}>
            <div className="flex items-center justify-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                serverStatus === 'connected' ? 'bg-green-400 animate-pulse' :
                serverStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'
              }`}></div>
              <span>{getServerStatusText()}</span>
            </div>
          </div>

          {error && (
            <div className="max-w-2xl mx-auto mt-4 bg-red-900 border-2 border-red-400 rounded-lg p-4">
              <p className="text-red-300 text-center">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="mt-2 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded mx-auto block"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* Active Room Display */}
        {activeRoom && (
          <div className="max-w-2xl mx-auto mb-8 bg-green-900 border-4 border-green-400 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🎧</div>
            <h3 className="text-2xl text-white font-bold mb-2">
              {rooms.find(r => r.id === activeRoom)?.name}
            </h3>
            
            {/* Audio Level */}
            <div className="mb-4">
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className={`text-lg font-bold ${isSpeaking ? 'text-green-400' : 'text-gray-400'}`}>
                  {isSpeaking ? '🎤 SPEAKING' : '🔇 SILENT'}
                </div>
                <div className="w-32 bg-gray-700 rounded-full h-4">
                  <div 
                    className={`h-4 rounded-full transition-all ${
                      audioLevel > 0.7 ? 'bg-red-500' : audioLevel > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${audioLevel * 100}%` }}
                  ></div>
                </div>
                <div className="text-blue-400 text-sm font-mono">
                  {Math.round(audioLevel * 100)}%
                </div>
              </div>
            </div>
            
            {/* REAL Users in Room */}
            <div className="mb-4">
              <p className="text-blue-300 text-sm mb-2">
                👥 Users in room: {usersInRoom.length}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {usersInRoom.map(user => (
                  <span key={user.id} className={`px-3 py-1 rounded text-sm ${
                    user.isYou ? 'bg-yellow-600' : 'bg-blue-600'
                  }`}>
                    {user.screenName} {user.isYou ? '(You)' : ''}
                  </span>
                ))}
                {usersInRoom.length === 1 && (
                  <span className="text-gray-400 text-sm">(Waiting for others to join...)</span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
              <button 
                onClick={toggleMute}
                className={`px-6 py-3 rounded-lg font-bold text-lg ${
                  isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'
                } text-white`}
              >
                {isMuted ? '🔇 MUTED' : '🔊 UNMUTED'}
              </button>
              <button 
                onClick={leaveVoiceChat}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg"
              >
                🚪 LEAVE CHAT
              </button>
            </div>
          </div>
        )}

        {isConnecting && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 border-4 border-yellow-400 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">🎤</div>
              <h3 className="text-2xl text-yellow-400 mb-4">Joining Voice Chat...</h3>
              <p className="text-white mb-2">Setting up microphone and audio</p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
            </div>
          </div>
        )}

        {/* REAL Room Grid - No Fake User Counts */}
        <div className="rooms-grid">
          {rooms.map(room => (
            <div 
              key={room.id}
              className={`room-card ${activeRoom === room.id ? 'active' : ''} ${
                serverStatus !== 'connected' ? 'opacity-50' : ''
              }`}
              onClick={() => !activeRoom && !isConnecting && serverStatus === 'connected' && startJoinProcess(room.id)}
            >
              <div className="text-4xl mb-4">{room.icon}</div>
              <h3 className="text-2xl text-white font-bold mb-2">{room.name}</h3>
              <div className="text-green-400 mb-4">
                👥 {getRealUserCount(room.id)} online
              </div>

              <button 
                className={`w-full py-3 rounded font-bold text-lg ${
                  activeRoom === room.id 
                    ? 'bg-green-600 text-white' 
                    : (activeRoom || isConnecting || serverStatus !== 'connected') 
                      ? 'bg-gray-600 text-gray-400' 
                      : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }`}
                disabled={activeRoom || isConnecting || serverStatus !== 'connected'}
              >
                {activeRoom === room.id 
                  ? '✅ IN CHAT' 
                  : isConnecting 
                    ? '🔄 JOINING...' 
                    : serverStatus !== 'connected'
                      ? 'SERVER OFFLINE'
                      : activeRoom 
                        ? 'IN ANOTHER ROOM' 
                        : 'JOIN CHAT'
                }
              </button>
            </div>
          ))}
        </div>

        {/* Server Instructions */}
        <div className="max-w-4xl mx-auto mt-12 bg-gray-800 border border-yellow-400 rounded-lg p-6">
          <h3 className="text-2xl text-yellow-400 mb-4">🚀 Voice Server Setup</h3>
          <div className="bg-black p-4 rounded font-mono text-sm text-green-400">
            <div># Start the voice server (in terminal):</div>
            <div className="ml-4">node server/signaling-server.js</div>
            <div className="mt-2 text-blue-400"># Server will try ports 8081 and 8082 automatically</div>
            <div className="mt-2 text-green-400"># When server shows "Ready for real voice connections"</div>
            <div className="ml-4"># Refresh this page and join a room!</div>
          </div>
        </div>

        {/* AdSense at Bottom */}
        <div className="ad-container mt-8 text-center">
          <ins className="adsbygoogle"
            style={{display: 'block'}}
            data-ad-client="ca-pub-3940256099942544"
            data-ad-slot="0987654321"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
        </div>
      </div>
    </div>
  );
}
