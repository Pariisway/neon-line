export function ArcadeRoom() {
  const games = [
    { id: 1, name: 'Space Invaders', players: 124, status: 'Online' },
    { id: 2, name: 'Puzzle Quest', players: 89, status: 'Online' },
    { id: 3, name: 'Racing Extreme', players: 67, status: 'Maintenance' },
    { id: 4, name: 'Battle Arena', players: 203, status: 'Online' },
    { id: 5, name: 'Adventure World', players: 45, status: 'Online' },
    { id: 6, name: 'Strategy Masters', players: 78, status: 'Online' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl text-yellow-400 mb-4 mega-glow-yellow">ARCADE GAMES</h2>
          <p className="text-white text-xl">Choose your game and start playing!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {games.map(game => (
            <div key={game.id} className="bg-gray-900 border-4 border-yellow-400 rounded-lg p-6 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-2xl text-white font-bold mb-2">{game.name}</h3>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-green-400">👥 {game.players}</span>
                <span className={`${game.status === 'Online' ? 'text-green-400' : 'text-red-400'}`}>
                  {game.status === 'Online' ? '🟢 Online' : '🔴 Maintenance'}
                </span>
              </div>
              <button 
                className={`w-full py-3 rounded font-bold ${
                  game.status === 'Online' 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                }`}
                disabled={game.status !== 'Online'}
              >
                {game.status === 'Online' ? 'PLAY NOW' : 'COMING SOON'}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="adsense-banner max-w-4xl mx-auto">
            <p className="text-yellow-400 text-lg">More games coming soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
