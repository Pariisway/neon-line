import { useState } from 'react';

export function VoiceChatRooms() {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [clickTest, setClickTest] = useState(0);

  const rooms = [
    { id: 'general', name: 'General Voice Chat', users: 12, icon: '🎤' },
    { id: 'gaming', name: 'Gaming Lounge', users: 8, icon: '🎮' },
    { id: 'strategy', name: 'Strategy Talk', users: 5, icon: '🧠' },
  ];

  const handleRoomClick = (roomId: string) => {
    console.log('Room clicked:', roomId);
    setActiveRoom(roomId);
    setClickTest(prev => prev + 1);
    
    // Simulate voice chat join
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          console.log('Microphone access granted for room:', roomId);
          stream.getTracks().forEach(track => track.stop()); // Clean up
        })
        .catch(error => {
          console.log('Microphone access needed for voice chat');
        });
    }
  };

  return (
    <div className="main-content voice-chat-container">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-4xl text-yellow-400 mb-4">VOICE CHAT ROOMS</h2>
          <p className="text-white text-xl">Click any room to test voice chat!</p>
          <p className="text-green-400 mt-2">Clicks: {clickTest} | Room: {activeRoom || 'None'}</p>
        </div>

        <div className="rooms-grid">
          {rooms.map(room => (
            <div 
              key={room.id}
              className={`room-card ${activeRoom === room.id ? 'active' : ''}`}
              onClick={() => handleRoomClick(room.id)}
            >
              <div className="text-4xl mb-4">{room.icon}</div>
              <h3 className="text-2xl text-white font-bold mb-2">{room.name}</h3>
              <div className="text-green-400 mb-4">👥 {room.users} online</div>
              <div className="w-full bg-yellow-600 text-white py-3 rounded font-bold text-center">
                {activeRoom === room.id ? '✅ CONNECTED' : 'JOIN CHAT'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
