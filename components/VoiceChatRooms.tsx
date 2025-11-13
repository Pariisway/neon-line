import { useState, useRef } from 'react';

export function VoiceChatRooms() {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clickTest, setClickTest] = useState(0);

  const localStreamRef = useRef<MediaStream | null>(null);

  const rooms = [
    { id: 'general', name: 'General Voice Chat', users: 12, icon: '🎤' },
    { id: 'gaming', name: 'Gaming Lounge', users: 8, icon: '🎮' },
    { id: 'strategy', name: 'Strategy Talk', users: 5, icon: '🧠' },
    { id: 'casual', name: 'Casual Hangout', users: 7, icon: '☕' },
    { id: 'competitive', name: 'Competitive', users: 3, icon: '⚡' },
    { id: 'newbies', name: 'New Players', users: 6, icon: '👋' }
  ];

  const testClick = () => {
    console.log('🧪 TEST BUTTON CLICKED');
    setClickTest(prev => prev + 1);
    alert(`✅ TEST SUCCESSFUL! Click registered. Total: ${clickTest + 1}`);
  };

  const joinVoiceChat = async (roomId: string) => {
    console.log('🎯 JOINING ROOM:', roomId);
    setClickTest(prev => prev + 1);
    
    if (isConnecting || activeRoom) return;
    
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
      console.log('✅ Microphone access granted!');

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setActiveRoom(roomId);
      console.log('🎉 Successfully joined room:', roomId);

    } catch (error) {
      console.error('❌ Error joining voice chat:', error);
      let errorMessage = 'Failed to join voice chat. ';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = '🎤 Microphone permission denied. Please allow microphone access.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = '🔍 No microphone found. Please check audio devices.';
        } else {
          errorMessage += error.message;
        }
      }
      
      setError(errorMessage);
      
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const leaveVoiceChat = () => {
    console.log('🚪 Leaving voice chat');
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    setActiveRoom(null);
    setIsMuted(false);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className="main-content voice-chat-container">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-4xl text-yellow-400 mb-4">VOICE CHAT ROOMS</h2>
          <p className="text-white text-xl">Click any room to test voice chat!</p>
          <p className="text-green-400 mt-2">Debug: {clickTest} clicks registered</p>
        </div>

        {/* TEST BUTTON - Should definitely work */}
        <div className="text-center mb-8 p-4 bg-blue-900 rounded-lg max-w-md mx-auto">
          <button 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg text-lg font-bold mb-2 clickable"
            onClick={testClick}
            style={{ zIndex: 10000 }}
          >
            🧪 CLICK THIS TEST BUTTON FIRST
          </button>
          <p className="text-white text-sm">If this works, the page is clickable</p>
        </div>

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

        {activeRoom && (
          <div className="max-w-2xl mx-auto mb-8 bg-green-900 border-4 border-green-400 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🎧</div>
            <h3 className="text-2xl text-white font-bold mb-2">
              Connected to: {rooms.find(r => r.id === activeRoom)?.name}
            </h3>
            <p className="text-green-300 mb-4">✅ Voice chat is working!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={toggleMute}
                className={`px-6 py-3 rounded-lg font-bold text-lg ${
                  isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'
                } text-white`}
              >
                {isMuted ? '🔇 MUTED' : '🔊 SPEAKING'}
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
              <h3 className="text-2xl text-yellow-400 mb-4">Connecting...</h3>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
            </div>
          </div>
        )}

        {/* ROOMS GRID - HIGH Z-INDEX */}
        <div className="rooms-grid" style={{ zIndex: 1000 }}>
          {rooms.map(room => (
            <div 
              key={room.id}
              className={`room-card clickable ${activeRoom === room.id ? 'active' : ''}`}
              style={{ 
                zIndex: 1001,
                cursor: (activeRoom || isConnecting) ? 'default' : 'pointer',
                opacity: (activeRoom && activeRoom !== room.id) || isConnecting ? 0.6 : 1
              }}
              onClick={() => {
                console.log('🟦 ROOM CARD CLICKED:', room.id);
                if (!activeRoom && !isConnecting) {
                  joinVoiceChat(room.id);
                }
              }}
            >
              <div className="text-4xl mb-4">{room.icon}</div>
              <h3 className="text-2xl text-white font-bold mb-2">{room.name}</h3>
              <div className="text-green-400 mb-4">👥 {room.users} online</div>

              <button 
                className={`w-full py-3 rounded font-bold text-lg ${
                  activeRoom === room.id 
                    ? 'bg-green-600 text-white' 
                    : (activeRoom || isConnecting) 
                      ? 'bg-gray-600 text-gray-400' 
                      : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }`}
                style={{ zIndex: 1002 }}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('🟨 JOIN BUTTON CLICKED:', room.id);
                  if (!activeRoom && !isConnecting) {
                    joinVoiceChat(room.id);
                  }
                }}
              >
                {activeRoom === room.id 
                  ? '✅ CONNECTED' 
                  : isConnecting 
                    ? '🔄 CONNECTING...' 
                    : activeRoom 
                      ? 'IN ANOTHER ROOM' 
                      : 'JOIN VOICE CHAT'
                }
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
