import { useState, useEffect } from 'react';

export function VoiceChatRooms() {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [webRTCSupported, setWebRTCSupported] = useState<boolean>(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  // Check WebRTC support
  useEffect(() => {
    const checkWebRTC = () => {
      const supported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      setWebRTCSupported(supported);
    };
    
    checkWebRTC();
  }, []);

  // Clean up stream when component unmounts
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [localStream]);

  const rooms = [
    { id: 'general', name: 'General Voice Chat', users: 12, icon: '🎤' },
    { id: 'gaming', name: 'Gaming Lounge', users: 8, icon: '🎮' },
    { id: 'strategy', name: 'Strategy Talk', users: 5, icon: '🧠' },
    { id: 'casual', name: 'Casual Hangout', users: 7, icon: '☕' },
    { id: 'competitive', name: 'Competitive', users: 3, icon: '⚡' },
    { id: 'newbies', name: 'New Players', users: 6, icon: '👋' }
  ];

  const joinVoiceChat = async (roomId: string) => {
    if (!webRTCSupported || activeRoom) {
      return;
    }

    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      setLocalStream(stream);
      setActiveRoom(roomId);
      
      // Create audio element to hear yourself (optional)
      const audio = new Audio();
      audio.srcObject = stream;
      audio.play().catch(e => console.log('Auto-play prevented:', e));
      
      console.log('Voice chat connected for room:', roomId);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          alert('Microphone permission denied. Please allow microphone access to use voice chat.');
        } else if (error.name === 'NotFoundError') {
          alert('No microphone found. Please check your audio devices.');
        } else {
          alert('Error accessing microphone: ' + error.message);
        }
      }
    }
  };

  const leaveVoiceChat = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setActiveRoom(null);
    setIsMuted(false);
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setIsMuted(!isMuted);
  };

  const getRoomCardClass = (roomId: string) => {
    if (activeRoom === roomId) return 'voice-room-card active';
    if (activeRoom && activeRoom !== roomId) return 'voice-room-card disabled';
    return 'voice-room-card';
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

        {/* Active Room Status */}
        {activeRoom && (
          <div className="active-room-status">
            <div className="connection-status">
              <div className="status-dot"></div>
              <h3 className="text-2xl text-white font-bold">
                Connected to: {rooms.find(r => r.id === activeRoom)?.name}
              </h3>
            </div>
            <p className="text-green-300 mb-4">You are now in voice chat! Others can hear you.</p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={toggleMute}
                className={`room-button mute ${isMuted ? 'bg-red-600' : 'bg-yellow-600'}`}
              >
                {isMuted ? '🔇 MUTED' : '🔊 SPEAKING'}
              </button>
              <button 
                onClick={leaveVoiceChat}
                className="room-button leave"
              >
                🚪 LEAVE CHAT
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
              onClick={() => joinVoiceChat(room.id)}
            >
              <div>
                <div className="room-icon">{room.icon}</div>
                <h3 className="room-name">{room.name}</h3>
                <div className="room-users">👥 {room.users} gamers online</div>
              </div>
              
              {activeRoom === room.id ? (
                <button className="room-button leave" onClick={(e) => { e.stopPropagation(); leaveVoiceChat(); }}>
                  ✅ CONNECTED
                </button>
              ) : (
                <button 
                  className={`room-button join ${!webRTCSupported || activeRoom ? 'disabled' : ''}`}
                  onClick={(e) => e.stopPropagation()}
                  disabled={!webRTCSupported || activeRoom !== null}
                >
                  {activeRoom ? 'IN ANOTHER ROOM' : 'JOIN VOICE CHAT'}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Voice Chat Instructions */}
        <div className="mt-12 max-w-4xl mx-auto bg-gray-800 border border-yellow-400 rounded-lg p-6">
          <h3 className="text-2xl text-yellow-400 mb-4 text-center">How Voice Chat Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-3xl mb-2">1️⃣</div>
              <p className="text-white font-bold">Click any room</p>
              <p className="text-gray-300 text-sm">Choose your preferred chat room</p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-3xl mb-2">2️⃣</div>
              <p className="text-white font-bold">Allow microphone access</p>
              <p className="text-gray-300 text-sm">Click "Allow" when prompted</p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-3xl mb-2">3️⃣</div>
              <p className="text-white font-bold">Start talking!</p>
              <p className="text-gray-300 text-sm">Others in the room can hear you</p>
            </div>
          </div>
        </div>

        {/* Connection Tips */}
        {!activeRoom && (
          <div className="mt-8 max-w-2xl mx-auto bg-blue-900 border border-blue-400 rounded-lg p-4">
            <h4 className="text-blue-400 text-lg mb-2">💡 Pro Tip</h4>
            <p className="text-gray-300 text-sm">
              If you don't see the microphone permission popup, check your browser's address bar for a microphone icon 
              or look in your browser settings to allow permissions for this site.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
