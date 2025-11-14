import { useState, useEffect } from 'react';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  color: string;
}

export function ArcadePage() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [emojis, setEmojis] = useState<Array<{id: number, emoji: string, x: number, y: number, size: number}>>([]);

  const games: Game[] = [
    {
      id: 'retro-pong',
      title: 'Retro Pong',
      description: 'Classic ping pong action with modern twist',
      icon: '🎮',
      category: 'Arcade',
      color: 'from-red-500 to-yellow-500'
    },
    {
      id: 'space-invaders', 
      title: 'Space Invaders',
      description: 'Defend Earth from alien invasion',
      icon: '👾',
      category: 'Shooter',
      color: 'from-green-500 to-blue-500'
    },
    {
      id: 'racing',
      title: 'Racing Extreme',
      description: 'High-speed racing action',
      icon: '🏎️',
      category: 'Racing', 
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'puzzle',
      title: 'Brain Teaser',
      description: 'Challenge your mind with puzzles',
      icon: '🧩',
      category: 'Puzzle',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'adventure',
      title: 'Epic Adventure',
      description: 'Explore mysterious worlds',
      icon: '🗡️',
      category: 'Adventure',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'sports',
      title: 'Sports Mania', 
      description: 'All your favorite sports games',
      icon: '🏀',
      category: 'Sports',
      color: 'from-teal-500 to-green-500'
    }
  ];

  // Create floating emojis
  useEffect(() => {
    const emojiList = ['🎮', '👾', '🎯', '🎪', '🕹️', '🎲', '🎨', '🚀', '🌟', '💫', '🎪', '🎳'];
    const newEmojis = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
      x: Math.random() * 100,
      y: Math.random() * 100, 
      size: Math.random() * 20 + 10
    }));
    setEmojis(newEmojis);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 relative overflow-hidden">
      {/* Floating emojis background */}
      <div className="absolute inset-0 pointer-events-none">
        {emojis.map((emoji) => (
          <div
            key={emoji.id}
            className="absolute animate-float opacity-20"
            style={{
              left: `${emoji.x}%`,
              top: `${emoji.y}%`,
              fontSize: `${emoji.size}px`,
              animationDelay: `${emoji.id * 0.5}s`,
              animationDuration: `${15 + (emoji.id % 10)}s`
            }}
          >
            {emoji.emoji}
          </div>
        ))}
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-400 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-pink-400 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/2 w-28 h-28 bg-cyan-400 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 animate-bounce">
            🎮 ARCADE 🎮
          </h1>
          <p className="text-xl text-yellow-300 mb-2">Welcome to the Ultimate Gaming Experience!</p>
          <p className="text-lg text-gray-300">Choose your game and start playing instantly</p>
        </div>

        {/* Top Ad */}
        <div className="text-center mb-12">
          <div className="ad-container inline-block bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <ins className="adsbygoogle"
              style={{display: 'block'}}
              data-ad-client="ca-pub-3940256099942544"
              data-ad-slot="728x90"
              data-ad-format="auto"
              data-full-width-responsive="true"></ins>
          </div>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {games.map((game) => (
            <div
              key={game.id}
              className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
              onClick={() => setSelectedGame(game)}
            >
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl p-6 text-center hover:border-yellow-400 hover:shadow-2xl transition-all duration-300">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {game.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {game.title}
                </h3>
                <p className="text-yellow-300 text-sm mb-3">
                  {game.category}
                </p>
                <p className="text-gray-300 text-sm mb-4">
                  {game.description}
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 group-hover:from-yellow-400 group-hover:to-orange-400 text-white py-3 px-6 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg">
                  PLAY NOW
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Game */}
        {selectedGame && (
          <div className="mb-12">
            <div className="bg-white/10 backdrop-blur-sm border-2 border-yellow-400 rounded-xl p-8 shadow-2xl">
              <button
                onClick={() => setSelectedGame(null)}
                className="mb-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-lg transition-colors duration-300"
              >
                ← Back to Games
              </button>
              
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedGame.icon}</div>
                <h2 className="text-4xl font-bold text-white mb-4">{selectedGame.title}</h2>
                <p className="text-yellow-300 text-xl mb-6">{selectedGame.description}</p>
                
                {/* Game content area */}
                <div className="bg-black/50 rounded-lg p-8 mb-6">
                  <div className="text-5xl mb-4">🎯</div>
                  <p className="text-gray-300 text-lg mb-4">Game loading soon...</p>
                  <p className="text-gray-400">This game will be embedded here in the final version</p>
                </div>

                {/* Game Ad */}
                <div className="ad-container mb-6">
                  <ins className="adsbygoogle"
                    style={{display: 'block'}}
                    data-ad-client="ca-pub-3940256099942544"
                    data-ad-slot="300x250"
                    data-ad-format="auto"
                    data-full-width-responsive="true"></ins>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Ad */}
        <div className="text-center">
          <div className="ad-container inline-block bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <ins className="adsbygoogle"
              style={{display: 'block'}}
              data-ad-client="ca-pub-3940256099942544"
              data-ad-slot="728x90"
              data-ad-format="auto"
              data-full-width-responsive="true"></ins>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-400">More games coming soon! 🚀</p>
        </div>
      </div>
    </div>
  );
}
