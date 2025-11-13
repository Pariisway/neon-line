import { useState, useEffect, useRef } from 'react';

export function VoiceChatRooms() {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [webRTCSupported, setWebRTCSupported] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Check WebRTC support
  useEffect(() => {
    const checkWebRTC = () => {
      const supported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      setWebRTCSupported(supported);
    };
    
    checkWebRTC();
  }, []);

  // Clean up stream when component unmounts or room changes
  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
      }
    };
  }, []);

  const rooms = [
    { id: 'general', name: 'General Voice Chat', users: 12, icon: '🎤' },
    { id: 'gaming', name: 'Gaming Lounge', users: 8, icon: '🎮' },
    { id: 'strategy', name: 'Strategy Talk', users: 5, icon: '🧠' },
    { id: 'casual', name: 'Casual Hangout', users: 7, icon: '☕' },
    { id: 'competitive', name: 'Competitive', users: 3, icon: '⚡' },
    { id: 'newbies', name: 'New Players', users: 6, icon: '👋' }
  ];

  const joinVoiceChat = async (roomId: string) => {
    // Prevent multiple clicks
    if (isLoading || activeRoom) return;
    
    if (!webRTCSupported) {
      setError('Voice chat is not supported in your browser. Please use Chrome, Firefox, or Edge.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      localStreamRef.current = stream;
      setActiveRoom(roomId);
      setIsMuted(false);
      
      console.log('Voice chat connected for room:', roomId);
      
      // In a real app, you'd connect to WebRTC servers here
      // For demo, we'll simulate successful connection
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      let errorMessage = 'Failed to access microphone. ';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage += 'Please allow microphone permissions and try again.';
        } else if (error.name === 'NotFoundError') {
          errorMessage += 'No microphone found. Please check your audio devices.';
        } else if (error.name === 'NotSupportedError') {
          errorMessage += 'Your browser does not support audio capture.';
        } else {
          errorMessage += error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const leaveVoiceChat = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    setActiveRoom(null);
    setIsMuted(false);
    setError(null);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setIsMuted(!isMuted);
  };

  const handleRoomClick = (roomId: string) => {
    if (!activeRoom && !isLoading) {
      joinVoiceChat(roomId);
    }
  };

  const getRoomCardClass = (roomId: string) => {
    let baseClass = 'voice-room-card';
    
    if (activeRoom === roomId) {
      return `${baseClass} active`;
    }
    
    if (activeRoom || isLoading) {
      return `${baseClass} disabled`;
    }
    
    return baseClass;
  };

  const getButtonText = (roomId: string) => {
    if (activeRoom === roomId) {
      return '✅ CONNECTED';
    }
    
    if (activeRoom) {
      return 'IN ANOTHER ROOM';
    }
    
    if (isLoading) {
      return 'CONNECTING...';
    }
    
    return 'JOIN VOICE CHAT';
  };

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl text-yellow-400 mb-4 mega-glow-yellow">VOICE CHAT ROOMS</h2>
          <p className="text-white text-xl">Click any room to start voice chatting!</p>
          
          {/* WebRTC Status */}
          <div className={`mt-4 p-3 rounded-lg ${webRTCSupported ? 'bg-green-900 border border-green-400' : 'bg-red-900 border border-red-400'}`}>
            {webRTCSupported ? (
              <p className="text-green-400">✅ WebRTC Voice Chat Supported - Click any room to join!</p>
            ) : (
              <p className="text-red-400">❌ WebRTC Not Supported - Voice chat unavailable</p>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 bg-red-900 border-2 border-red-400 rounded-lg p-4">
            <p className="text-red-300 text-center">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded mx-auto block"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Active Room Status */}
        {activeRoom && (
          <div className="active-room-status">
            <div className="connection-status">
              <div className="status-dot"></div>
              <h3 className="text-2xl text-white font-bold">
                Connected to: {rooms.find(r => r.id === activeRoom)?.name}
              </h3>
            </div>
            <p className="text-green-300 mb-4">🎤 You are now in voice chat! Speak and others will hear you.</p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={toggleMute}
                className={`room-button mute ${isMuted ? 'bg-red-600' : 'bg-yellow-600'}`}
              >
                {isMuted ? '🔇 MUTED - Click to Unmute' : '🔊 SPEAKING - Click to Mute'}
              </button>
              <button 
                onClick={leaveVoiceChat}
                className="room-button leave"
              >
                🚪 Leave Voice Chat
              </button>
            </div>
          </div>
        )}

        {/* Voice Chat Rooms Grid */}
        <div className="voice-room-grid">
          {rooms.map(room => (
            <div 
              key={room.id}
              className={getRoomCardClass(room.id)}
              onClick={() => handleRoomClick(room.id)}
            >
              <div className="flex flex-col items-center">
                <div className="room-icon">{room.icon}</div>
                <h3 className="room-name">{room.name}</h3>
                <div className="room-users">👥 {room.users} gamers online</div>
              </div>
              
              <button 
                className={`room-button ${activeRoom === room.id ? 'leave' : 'join'} ${(activeRoom && activeRoom !== room.id) || isLoading ? 'disabled' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoomClick(room.id);
                }}
                disabled={(activeRoom && activeRoom !== room.id) || isLoading}
              >
                {getButtonText(room.id)}
              </button>
            </div>
          ))}
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 border-4 border-yellow-400 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">🎤</div>
              <h3 className="text-2xl text-yellow-400 mb-4">Connecting to Voice Chat...</h3>
              <p className="text-white">Please allow microphone permissions when prompted</p>
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
              </div>
            </div>
          </div>
        )}

        {/* Voice Chat Instructions */}
        <div className="mt-12 max-w-4xl mx-auto bg-gray-800 border border-yellow-400 rounded-lg p-6">
          <h3 className="text-2xl text-yellow-400 mb-4 text-center">How Voice Chat Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-3xl mb-2">1️⃣</div>
              <p className="text-white font-bold">Click Any Room</p>
              <p className="text-gray-300 text-sm">Choose your preferred chat room</p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-3xl mb-2">2️⃣</div>
              <p className="text-white font-bold">Allow Microphone Access</p>
              <p className="text-gray-300 text-sm">Click "Allow" when your browser asks for permission</p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-3xl mb-2">3️⃣</div>
              <p className="text-white font-bold">Start Talking!</p>
              <p className="text-gray-300 text-sm">Others in the room can hear you instantly</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-900 border border-blue-400 rounded">
            <h4 className="text-blue-300 text-lg mb-2">💡 Troubleshooting Tips</h4>
            <ul className="text-gray-300 text-sm text-left list-disc list-inside space-y-1">
              <li>If you don't see a permission popup, check your browser's address bar for a microphone icon</li>
              <li>Ensure your microphone is connected and not muted</li>
              <li>Try refreshing the page if connections fail</li>
              <li>Use headphones to avoid echo for other users</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
