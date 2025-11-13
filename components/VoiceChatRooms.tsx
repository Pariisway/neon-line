import { useState, useEffect } from 'react';

export function VoiceChatRooms() {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [webRTCSupported, setWebRTCSupported] = useState<boolean>(true);

  // Check WebRTC support
  useEffect(() => {
    const checkWebRTC = () => {
      const supported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      setWebRTCSupported(supported);
      
      if (!supported) {
        console.warn('WebRTC not supported in this browser');
      }
    };
    
    checkWebRTC();
  }, []);

  const rooms = [
    { id: 'general', name: 'General Voice Chat', users: 0 },
    { id: 'gaming', name: 'Gaming Lounge', users: 0 },
    { id: 'strategy', name: 'Strategy Talk', users: 0 },
    { id: 'casual', name: 'Casual Hangout', users: 0 },
    { id: 'competitive', name: 'Competitive', users: 0 }
  ];

  const joinVoiceChat = async (roomId: string) => {
    if (!webRTCSupported) {
      alert('Voice chat is not supported in your browser. Please use Chrome, Firefox, or Edge.');
      return;
    }

    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setActiveRoom(roomId);
      console.log('Voice chat connected for room:', roomId);
      
      // In a real app, you'd connect to WebRTC servers here
      // For now, we'll just show the connection status
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access your microphone. Please check permissions.');
    }
  };

  const leaveVoiceChat = () => {
    setActiveRoom(null);
    setIsMuted(false);
    // In real app, disconnect from WebRTC here
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In real app, toggle audio track here
  };

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl text-yellow-400 mb-4 mega-glow-yellow">VOICE CHAT ROOMS</h2>
          <p className="text-white text-xl">Talk with fellow gamers in real-time!</p>
          
          {/* WebRTC Status */}
          <div className={`mt-4 p-3 rounded-lg ${webRTCSupported ? 'bg-green-900 border border-green-400' : 'bg-red-900 border border-red-400'}`}>
            {webRTCSupported ? (
              <p className="text-green-400">✅ WebRTC Voice Chat Supported</p>
            ) : (
              <p className="text-red-400">❌ WebRTC Not Supported - Voice chat unavailable</p>
            )}
          </div>
        </div>

        {/* Voice Chat Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {rooms.map(room => (
            <div 
              key={room.id}
              className={`bg-gray-900 border-4 rounded-lg p-6 text-center transition-all duration-300 ${
                activeRoom === room.id 
                  ? 'border-green-500 bg-green-900 transform scale-105' 
                  : 'border-yellow-400 hover:border-yellow-300 hover:transform hover:scale-105'
              }`}
            >
              <div className="text-4xl mb-4">🎤</div>
              <h3 className="text-2xl text-white font-bold mb-2">{room.name}</h3>
              
              <div className="flex justify-center items-center gap-2 mb-4">
                <span className="text-green-400">●</span>
                <span className="text-gray-300">Online: {room.users}</span>
              </div>

              {activeRoom === room.id ? (
                <div className="space-y-3">
                  <div className="bg-green-600 text-white py-2 rounded font-bold">
                    🎧 CONNECTED
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={toggleMute}
                      className={`flex-1 py-2 rounded font-bold ${
                        isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'
                      }`}
                    >
                      {isMuted ? '🔇 MUTED' : '🔊 UNMUTED'}
                    </button>
                    <button 
                      onClick={leaveVoiceChat}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded font-bold"
                    >
                      LEAVE
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => joinVoiceChat(room.id)}
                  disabled={!webRTCSupported}
                  className={`w-full py-3 rounded font-bold ${
                    webRTCSupported 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {webRTCSupported ? 'JOIN VOICE CHAT' : 'NOT AVAILABLE'}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Voice Chat Instructions */}
        <div className="mt-12 max-w-4xl mx-auto bg-gray-800 border border-yellow-400 rounded-lg p-6">
          <h3 className="text-2xl text-yellow-400 mb-4 text-center">How to Use Voice Chat</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-3xl mb-2">1️⃣</div>
              <p className="text-white">Click "JOIN VOICE CHAT" on any room</p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-3xl mb-2">2️⃣</div>
              <p className="text-white">Allow microphone permissions when prompted</p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-3xl mb-2">3️⃣</div>
              <p className="text-white">Start talking with other gamers!</p>
            </div>
          </div>
        </div>

        {/* Technical Info */}
        {!webRTCSupported && (
          <div className="mt-6 max-w-2xl mx-auto bg-red-900 border border-red-400 rounded-lg p-4">
            <h4 className="text-red-400 text-lg mb-2">WebRTC Support Required</h4>
            <p className="text-gray-300 text-sm">
              Voice chat requires WebRTC support. Please use a modern browser like Chrome, Firefox, or Edge. 
              Ensure your browser has microphone permissions enabled.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
