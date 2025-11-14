import { useState, useEffect, useRef } from 'react';
import { ScreenNameModal } from './ScreenNameModal';

interface User {
  uid: number;
  screenName: string;
  isYou?: boolean;
}

export function AgoraVoiceChat() {
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
  const [agoraReady, setAgoraReady] = useState(false);

  const agoraClientRef = useRef<any>(null);
  const localAudioTrackRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>(0);

  const rooms = [
    { id: 'general', name: 'General Voice Chat', icon: '🎤' },
    { id: 'gaming', name: 'Gaming Lounge', icon: '🎮' },
    { id: 'strategy', name: 'Strategy Talk', icon: '🧠' },
    { id: 'casual', name: 'Casual Hangout', icon: '☕' },
    { id: 'competitive', name: 'Competitive', icon: '⚡' },
    { id: 'newbies', name: 'New Players', icon: '👋' }
  ];

  // 🔑 YOUR REAL AGORA APP ID - MUST BE IN QUOTES!
  const AGORA_APP_ID = '19383786453e4bae98ee25658adf5a4c';

  // Initialize Agora
  useEffect(() => {
    const initAgora = async () => {
      try {
        const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
        
        agoraClientRef.current = AgoraRTC.createClient({
          mode: 'rtc',
          codec: 'vp8'
        });

        // Handle user published
        agoraClientRef.current.on('user-published', async (user: any, mediaType: string) => {
          console.log('User published:', user.uid, mediaType);
          
          if (mediaType === 'audio') {
            try {
              await agoraClientRef.current.subscribe(user, 'audio');
              const remoteAudioTrack = user.audioTrack;
              remoteAudioTrack.play();
              console.log('Playing remote audio from:', user.uid);
              
              setUsersInRoom(prev => {
                const exists = prev.find(u => u.uid === user.uid);
                if (!exists) {
                  return [...prev, {
                    uid: user.uid,
                    screenName: `User${user.uid}`,
                    isYou: false
                  }];
                }
                return prev;
              });
              
            } catch (subscribeError) {
              console.error('Subscribe error:', subscribeError);
            }
          }
        });

        // Handle user left
        agoraClientRef.current.on('user-left', (user: any) => {
          console.log('User left:', user.uid);
          setUsersInRoom(prev => prev.filter(u => u.uid !== user.uid));
        });

        setAgoraReady(true);
        console.log('Agora client ready');
        
      } catch (error) {
        console.error('Agora init failed:', error);
        setError('Voice system failed to initialize');
      }
    };

    initAgora();

    return () => {
      leaveVoiceChat();
    };
  }, []);

  const setupAudioMonitoring = async (audioTrack: any) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const mediaStream = new MediaStream([audioTrack.getMediaStreamTrack()]);
      const source = audioContext.createMediaStreamSource(mediaStream);
      
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
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
    analyserRef.current = null;
  };

  const joinVoiceChat = async (roomId: string, screenName: string) => {
    if (!agoraReady || !agoraClientRef.current) {
      setError('Voice system not ready');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      console.log('Joining Agora room:', roomId);

      const token = null;
      const uid = Math.floor(Math.random() * 100000);

      await agoraClientRef.current.join(AGORA_APP_ID, roomId, token, uid);
      console.log('Joined Agora channel:', roomId, 'as user:', uid);

      localAudioTrackRef.current = await (await import('agora-rtc-sdk-ng')).default.createMicrophoneAudioTrack();
      await agoraClientRef.current.publish([localAudioTrackRef.current]);
      console.log('Local audio published');

      await setupAudioMonitoring(localAudioTrackRef.current);

      setUsersInRoom([{ 
        uid: uid, 
        screenName: screenName,
        isYou: true 
      }]);

      setActiveRoom(roomId);
      setLocalScreenName(screenName);

    } catch (error) {
      console.error('Error joining voice chat:', error);
      if (error instanceof Error) {
        setError(`Failed: ${error.message}`);
      }
      leaveVoiceChat();
    } finally {
      setIsConnecting(false);
      setPendingRoomId(null);
    }
  };

  const leaveVoiceChat = async () => {
    console.log('Leaving voice chat');
    
    try {
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
        localAudioTrackRef.current.close();
        localAudioTrackRef.current = null;
      }

      if (agoraClientRef.current) {
        await agoraClientRef.current.leave();
      }

      stopAudioMonitoring();
      
      setActiveRoom(null);
      setIsMuted(false);
      setUsersInRoom([]);
      
    } catch (error) {
      console.error('Error leaving voice chat:', error);
    }
  };

  const toggleMute = async () => {
    if (localAudioTrackRef.current) {
      if (isMuted) {
        await localAudioTrackRef.current.setEnabled(true);
      } else {
        await localAudioTrackRef.current.setEnabled(false);
      }
      setIsMuted(!isMuted);
    }
  };

  const handleScreenNameConfirm = (screenName: string) => {
    setLocalScreenName(screenName);
    setShowScreenNameModal(false);
    if (pendingRoomId) {
      joinVoiceChat(pendingRoomId, screenName);
    }
  };

  const startJoinProcess = (roomId: string) => {
    if (isConnecting || activeRoom || !agoraReady) return;
    setPendingRoomId(roomId);
    setShowScreenNameModal(true);
  };

  return (
    <div className="main-content voice-chat-container">
      <div className="container">
        <ScreenNameModal 
          isOpen={showScreenNameModal}
          onConfirm={handleScreenNameConfirm}
          defaultName={localScreenName}
        />

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
          <p className="text-white text-xl">Real Agora Voice Chat</p>
          
          <div className={`max-w-md mx-auto mt-4 p-3 rounded-lg ${
            agoraReady ? 'text-green-400' : 'text-yellow-400'
          } bg-gray-800`}>
            <div className="flex items-center justify-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                agoraReady ? 'bg-green-400 animate-pulse' : 'bg-yellow-400 animate-pulse'
              }`}></div>
              <span>{agoraReady ? 'Voice System Ready' : 'Initializing...'}</span>
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

        {activeRoom && (
          <div className="max-w-2xl mx-auto mb-8 bg-green-900 border-4 border-green-400 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🎧</div>
            <h3 className="text-2xl text-white font-bold mb-2">
              {rooms.find(r => r.id === activeRoom)?.name}
            </h3>
            
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
            
            <div className="mb-4">
              <p className="text-blue-300 text-sm mb-2">
                👥 Users in room: {usersInRoom.length}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {usersInRoom.map(user => (
                  <span key={user.uid} className={`px-3 py-1 rounded text-sm ${
                    user.isYou ? 'bg-yellow-600' : 'bg-blue-600'
                  }`}>
                    {user.screenName} {user.isYou ? '(You)' : ''}
                  </span>
                ))}
                {usersInRoom.length === 0 && (
                  <span className="text-gray-400">No users in room</span>
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

        <div className="rooms-grid">
          {rooms.map(room => (
            <div 
              key={room.id}
              className={`room-card ${activeRoom === room.id ? 'active' : ''} ${
                !agoraReady ? 'opacity-50' : ''
              }`}
              onClick={() => !activeRoom && !isConnecting && agoraReady && startJoinProcess(room.id)}
            >
              <div className="text-4xl mb-4">{room.icon}</div>
              <h3 className="text-2xl text-white font-bold mb-2">{room.name}</h3>
              <div className="text-green-400 mb-4">
                👥 {activeRoom === room.id ? usersInRoom.length : 0} online
              </div>

              <button 
                className={`w-full py-3 rounded font-bold text-lg ${
                  activeRoom === room.id 
                    ? 'bg-green-600 text-white' 
                    : (activeRoom || isConnecting || !agoraReady) 
                      ? 'bg-gray-600 text-gray-400' 
                      : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }`}
                disabled={activeRoom || isConnecting || !agoraReady}
              >
                {activeRoom === room.id 
                  ? '✅ IN CHAT' 
                  : isConnecting 
                    ? '🔄 JOINING...' 
                    : !agoraReady
                      ? 'LOADING...'
                      : activeRoom 
                        ? 'IN ANOTHER ROOM' 
                        : 'JOIN CHAT'
                }
              </button>
            </div>
          ))}
        </div>

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
