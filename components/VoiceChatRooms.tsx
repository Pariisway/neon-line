import { useState } from 'react';

export function VoiceChatRooms() {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{text: string, user: string}[]>([
    { text: "Welcome to the chat! 👋", user: "System" },
    { text: "Hey everyone! 🎮", user: "Gamer123" },
    { text: "Ready to play some games? 🚀", user: "ProPlayer" }
  ]);

  const rooms = [
    { id: 'general', name: 'General Chat', users: 12 },
    { id: 'gaming', name: 'Gaming Discussion', users: 8 },
    { id: 'tech', name: 'Tech Talk', users: 5 },
    { id: 'music', name: 'Music & Fun', users: 7 },
    { id: 'help', name: 'Help & Support', users: 3 }
  ];

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, user: 'You' }]);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl text-yellow-400 mb-4 mega-glow-yellow">VOICE CHAT ROOMS</h2>
          <p className="text-white text-xl">Join the conversation with fellow gamers!</p>
        </div>

        <div className="chat-container">
          <div className="chat-rooms">
            <h3 className="text-2xl text-green-400 mb-4 text-center">Available Rooms</h3>
            <div className="room-list">
              {rooms.map(room => (
                <div 
                  key={room.id}
                  className={`room-item ${activeRoom === room.id ? 'border-4 border-yellow-400' : ''}`}
                  onClick={() => setActiveRoom(room.id)}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-lg">{room.name}</span>
                    <span className="text-yellow-400">👥 {room.users}</span>
                  </div>
                  <div className="text-sm text-gray-300 mt-2">
                    {activeRoom === room.id ? '🎧 Connected' : 'Click to join'}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-900 rounded-lg">
              <h4 className="text-yellow-400 text-lg mb-2">Voice Controls</h4>
              <div className="flex gap-4">
                <button className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600">
                  🎤 Mute
                </button>
                <button className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600">
                  🔊 Speaker
                </button>
                <button className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                  📞 Call
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border-4 border-purple-500">
            <h3 className="text-2xl text-purple-400 mb-4 text-center">
              {activeRoom ? `Chat: ${rooms.find(r => r.id === activeRoom)?.name}` : 'Select a Room'}
            </h3>
            
            <div className="h-96 overflow-y-auto mb-4 bg-black p-4 rounded border-2 border-gray-700">
              {messages.map((msg, index) => (
                <div key={index} className="mb-2">
                  <span className={msg.user === 'You' ? 'text-green-400 font-bold' : 'text-blue-400 font-bold'}>
                    {msg.user}:
                  </span>
                  <span className="text-white ml-2">{msg.text}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-gray-800 text-white p-3 rounded border-2 border-yellow-400"
                disabled={!activeRoom}
              />
              <button 
                onClick={sendMessage}
                disabled={!activeRoom}
                className="bg-yellow-500 text-black p-3 rounded font-bold hover:bg-yellow-600 disabled:opacity-50"
              >
                Send
              </button>
            </div>

            {!activeRoom && (
              <p className="text-center text-gray-400 mt-4">
                Please select a chat room to start messaging
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
