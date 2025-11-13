export function ArcadeRoom() {
  const games = [
    { id: 'snake', name: 'SNAKE', emoji: '🐍' },
    { id: 'tetris', name: 'TETRIS', emoji: '🧊' },
    { id: 'pong', name: 'PONG', emoji: '🏓' },
    { id: 'racer', name: 'NEON RACER', emoji: '🏎️' },
    { id: 'space', name: 'SPACE INVADERS', emoji: '👾' },
    { id: 'puzzle', name: 'MATRIX PUZZLE', emoji: '🧩' }
  ];

  return (
    <div className="text-center p-8 matrix-font">
      <h1 className="mega-glow-yellow text-4xl mb-8 matrix-title">ARCADE GAMES</h1>
      
      {/* Top Leaderboard Ad */}
      <div className="ad-leaderboard">
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1184595877548269"></script>
        <ins className="adsbygoogle"
             style={{display: 'inline-block', width: '728px', height: '90px'}}
             data-ad-client="ca-pub-1184595877548269"
             data-ad-slot="1234567890"></ins>
      </div>

      <div className="max-w-6xl mx-auto">
        <p className="text-yellow-300 text-xl mb-8">
          SELECT A GAME TO PLAY INSTANTLY IN YOUR BROWSER
        </p>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="relative transform hover:scale-105 transition-transform duration-300"
            >
              <button
                className="w-full h-full p-8 rounded-2xl border-4 font-bold text-2xl transition-all duration-300 bg-gradient-to-br from-gray-900 to-black text-yellow-400 border-yellow-500 shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/50 hover:brightness-110"
              >
                <div className="flex flex-col items-center justify-center space-y-4">
                  <span className="text-5xl">{game.emoji}</span>
                  <span className="text-3xl">{game.name}</span>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Medium Rectangle Ad */}
        <div className="ad-medium-rectangle mt-8">
          <ins className="adsbygoogle"
               style={{display: 'inline-block', width: '300px', height: '250px'}}
               data-ad-client="ca-pub-1184595877548269"
               data-ad-slot="2345678901"></ins>
        </div>

        <div className="fun-ad-container mt-8">
          <p className="text-green-400 text-lg">
            MORE GAMES COMING SOON! CHECK BACK DAILY FOR NEW ADDITIONS!
          </p>
        </div>
      </div>
    </div>
  );
}
