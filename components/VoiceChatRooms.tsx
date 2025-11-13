import { useState } from 'react';

const CHAT_ROOMS = [
  { id: 'warzone', name: 'WARZONE', emoji: '🎯' },
  { id: 'roblox', name: 'ROBLOX', emoji: '🎮' },
  { id: 'minecraft', name: 'MINECRAFT', emoji: '⛏️' },
  { id: 'music', name: 'MUSIC', emoji: '🎵' },
  { id: 'sports', name: 'SPORTS', emoji: '⚽' },
  { id: 'cars', name: 'CARS', emoji: '🏎️' },
  { id: 'girls', name: 'GIRLS', emoji: '👧' },
  { id: 'boys', name: 'BOYS', emoji: '👦' },
  { id: '67', name: '67', emoji: '🔥' }
];

export function VoiceChatRooms() {
  const [screenName, setScreenName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showRoomSelection, setShowRoomSelection] = useState(false);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (screenName.trim()) {
      setShowRoomSelection(true);
    }
  };

  const joinRoom = (roomId: string) => {
    if (!screenName.trim()) return;
    setSelectedRoom(roomId);
    setHasJoined(true);
  };

  const leaveRoom = () => {
    setSelectedRoom(null);
    setHasJoined(false);
    setShowRoomSelection(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="text-center p-8 matrix-font">
      <h1 className="mega-glow-yellow text-4xl mb-8 matrix-title">VOICE CHAT ROOMS</h1>
      
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
              </div>

              {/* CHAT ROOMS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {CHAT_ROOMS.map((room) => (
                  <div
                    key={room.id}
                    className="relative transform hover:scale-105 transition-transform duration-300"
                  >
                    <button
                      onClick={() => joinRoom(room.id)}
                      className={`w-full h-full p-8 rounded-2xl border-4 font-bold text-2xl transition-all duration-300 ${
                        room.id === '67'
                          ? 'bg-gradient-to-br from-red-500 to-yellow-500 text-white border-yellow-400 shadow-lg shadow-red-500/50 hover:shadow-xl hover:shadow-red-500/70'
                          : 'bg-gradient-to-br from-gray-900 to-black text-yellow-400 border-yellow-500 shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/50'
                      } hover:brightness-110`}
                    >
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <span className="text-5xl">{room.emoji}</span>
                        <span className={room.id === '67' ? "text-4xl font-black" : "text-3xl"}>
                          {room.name}
                        </span>
                      </div>
                    </button>
                    
                    {room.id === '67' && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
                        HOT
                      </div>
                    )}
                  </div>
                ))}
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

          <div className="flex gap-4 justify-center">
            <button
              onClick={toggleMute}
              className="super-arcade-button text-xl"
            >
              {isMuted ? '🔇 UNMUTE' : '🎤 MUTE'}
            </button>

            <button
              onClick={leaveRoom}
              className="super-arcade-button text-xl"
            >
              🚪 LEAVE ROOM
            </button>
          </div>

          <div className="fun-ad-container">
            <h3 className="text-2xl text-yellow-300 mb-4">USERS IN ROOM</h3>
            <div className="space-y-2">
              <div className="p-4 bg-black border-2 border-yellow-400 rounded-lg text-yellow-300 text-xl"
                   style={{boxShadow: '0 0 15px #ffff00'}}>
                {screenName} {isMuted ? '🔇' : '🎤'} (YOU)
              </div>
              <div className="p-4 bg-black border-2 border-yellow-400 rounded-lg text-yellow-300 text-xl"
                   style={{boxShadow: '0 0 15px #ffff00'}}>
                CoolGamer 🎤
              </div>
              <div className="p-4 bg-black border-2 border-yellow-400 rounded-lg text-yellow-300 text-xl"
                   style={{boxShadow: '0 0 15px #ffff00'}}>
                ProPlayer 🔇
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
