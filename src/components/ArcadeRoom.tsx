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
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900">
      {/* Floating emojis background - NON-BLOCKING */}
      <div className="fixed inset-0 pointer-events-none">
        {['🎮', '👾', '🎯', '🕹️', '🚀', '🌟', '💫', '🎪'].map((emoji, index) => (
          <div
            key={index}
            className="absolute animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 15}px`,
              animationDelay: `${index * 0.5}s`,
              animationDuration: `${15 + (index % 10)}s`
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-6xl text-yellow-400 mb-4 animate-pulse">🎮 NEO ARCADE 🎮</h2>
          <p className="text-white text-xl">Choose your game and start playing!</p>
        </div>

        {/* In-content Ad */}
        <div className="text-center mb-8">
          <div className="ad-container inline-block">
            <ins className="adsbygoogle"
              style={{display: 'block'}}
              data-ad-client="ca-pub-3940256099942544"
              data-ad-slot="300x250"
              data-ad-format="auto"
              data-full-width-responsive="true"></ins>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {games.map(game => (
            <div key={game.id} className="bg-gray-900/80 backdrop-blur-sm border-4 border-yellow-400 rounded-lg p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-[0_0_30px_#f59e0b]">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-2xl text-white font-bold mb-2">{game.name}</h3>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-green-400">👥 {game.players}</span>
                <span className={`${game.status === 'Online' ? 'text-green-400' : 'text-red-400'}`}>
                  {game.status === 'Online' ? '🟢 Online' : '🔴 Maintenance'}
                </span>
              </div>
              <button 
                className={`w-full py-3 rounded font-bold text-lg ${
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
          <div className="inline-block bg-yellow-400/20 border-2 border-yellow-400 rounded-lg p-6">
            <p className="text-yellow-400 text-lg font-bold">More games coming soon! 🚀</p>
          </div>
        </div>
      </div>
    </div>
  );
}
