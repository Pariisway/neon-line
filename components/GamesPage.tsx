export function GamesPage() {
  const games = [
    { id: 'snake', name: 'SNAKE', emoji: '🐍', color: 'from-green-500 to-lime-500' },
    { id: 'tetris', name: 'TETRIS', emoji: '🧊', color: 'from-blue-500 to-cyan-500' },
    { id: 'pong', name: 'PONG', emoji: '🏓', color: 'from-yellow-500 to-orange-500' },
    { id: 'racer', name: 'NEON RACER', emoji: '🏎️', color: 'from-red-500 to-pink-500' },
    { id: 'space', name: 'SPACE INVADERS', emoji: '👾', color: 'from-purple-500 to-indigo-500' },
    { id: 'puzzle', name: 'MATRIX PUZZLE', emoji: '🧩', color: 'from-pink-500 to-rose-500' }
  ];

  return (
    <div className="text-center p-8 matrix-font">
      <h1 className="mega-glow-yellow text-4xl mb-8 matrix-title">GAMES ARCADE</h1>
      
      {/* Leaderboard Ad */}
      <div className="ad-leaderboard mb-8">
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
                className={`w-full h-full p-8 rounded-2xl border-4 font-bold text-2xl transition-all duration-300 bg-gradient-to-br ${game.color} text-white border-white shadow-2xl shadow-current hover:shadow-3xl hover:shadow-current hover:brightness-110`}
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
