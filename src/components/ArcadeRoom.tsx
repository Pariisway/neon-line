import { useState } from 'react';

export function ArcadeRoom() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);

  // Empty games array - you'll add your games here
  const games = [
    // Add your games here following the format below:
    // { 
    //   id: 'game-id', 
    //   name: 'Game Name', 
    //   players: 100, 
    //   status: 'Online',
    //   embedUrl: 'https://game-embed-url.com',
    //   previewUrl: 'https://path-to-preview-image-or-gif.gif',
    //   description: 'Game description',
    //   category: 'Action',
    //   icon: '🎮'
    // },
  ];

  const categories = ['All', 'Action', 'IO', 'Sports', 'Puzzle', 'Adventure', 'Racing'];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900">
      {/* Floating emojis background */}
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
          <h1 className="text-6xl md:text-8xl text-yellow-400 mb-4 animate-pulse">
            🎮 NEO ARCADE 🎮
          </h1>
          <p className="text-white text-xl">ADD YOUR GAMES WITH HOVER PREVIEWS!</p>
        </div>

        {/* Instructions Section */}
        <div className="max-w-4xl mx-auto mb-8 bg-gray-900/80 border-4 border-yellow-400 rounded-lg p-6">
          <h2 className="text-2xl text-yellow-400 mb-4 text-center">🎯 HOW TO ADD GAMES</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
            <div>
              <h3 className="text-green-400 font-bold mb-2">1. Find Working Embed URLs</h3>
              <ul className="text-sm space-y-1">
                <li>• Use <span className="text-yellow-400">Poki.com</span> games</li>
                <li>• Look for "Embed" or "Share" buttons</li>
                <li>• Test URLs in browser first</li>
                <li>• Avoid AddictingGames (blocks embeds)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-green-400 font-bold mb-2">2. Get Preview GIFs/Images</h3>
              <ul className="text-sm space-y-1">
                <li>• Use <span className="text-yellow-400">Giphy.com</span></li>
                <li>• Search "game-name gameplay"</li>
                <li>• Use <span className="text-yellow-400">Imgur.com</span></li>
                <li>• Record short gameplay clips</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-900/50 rounded-lg">
            <h3 className="text-blue-400 font-bold mb-2">📝 Game Format Template:</h3>
            <pre className="text-xs text-white bg-black p-3 rounded overflow-x-auto">
{`{
  id: 'unique-game-id',
  name: 'Game Name',
  players: 100,
  status: 'Online',
  embedUrl: 'https://real-working-embed-url.com',
  previewUrl: 'https://path-to-preview-gif.gif',
  description: 'Game description here',
  category: 'Action',
  icon: '🎮'
}`}
            </pre>
          </div>
        </div>

        {/* Example Game Card with Hover Preview */}
        <div className="max-w-sm mx-auto mb-8">
          <h3 className="text-yellow-400 text-center mb-4">🎮 EXAMPLE GAME CARD</h3>
          <div 
            className="bg-gray-900/80 backdrop-blur-sm border-4 border-yellow-400 rounded-lg p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-[0_0_30px_#f59e0b] cursor-pointer relative"
            onMouseEnter={() => setHoveredGame('example')}
            onMouseLeave={() => setHoveredGame(null)}
          >
            {/* Hover Preview */}
            {hoveredGame === 'example' && (
              <div className="absolute -top-40 left-1/2 transform -translate-x-1/2 w-64 h-32 bg-black border-2 border-yellow-400 rounded-lg z-50">
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center rounded">
                  <span className="text-white font-bold">🎥 GAME PREVIEW GIF</span>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-400 rotate-45"></div>
              </div>
            )}
            
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-2xl text-white font-bold mb-2">Example Game</h3>
            <p className="text-gray-300 text-sm mb-3">Hover to see preview</p>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-green-400">👥 100</span>
              <span className="text-purple-400 bg-purple-900/50 px-2 py-1 rounded">Action</span>
              <span className="text-green-400">🟢 Online</span>
            </div>
            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded font-bold text-lg transition-colors duration-300">
              PLAY NOW
            </button>
          </div>
        </div>

        {/* Game Grid - Will show when you add games */}
        {games.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {games.map(game => (
              <div 
                key={game.id} 
                className="bg-gray-900/80 backdrop-blur-sm border-4 border-yellow-400 rounded-lg p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-[0_0_30px_#f59e0b] cursor-pointer relative"
                onMouseEnter={() => setHoveredGame(game.id)}
                onMouseLeave={() => setHoveredGame(null)}
                onClick={() => setSelectedGame(game.id)}
              >
                {/* Hover Preview */}
                {hoveredGame === game.id && game.previewUrl && (
                  <div className="absolute -top-44 left-1/2 transform -translate-x-1/2 w-72 h-36 bg-black border-2 border-yellow-400 rounded-lg z-50 overflow-hidden">
                    <img 
                      src={game.previewUrl} 
                      alt={`${game.name} preview`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-400 rotate-45"></div>
                  </div>
                )}
                
                <div className="text-4xl mb-4">{game.icon}</div>
                <h3 className="text-2xl text-white font-bold mb-2">{game.name}</h3>
                <p className="text-gray-300 text-sm mb-3">{game.description}</p>
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-green-400">👥 {game.players}</span>
                  <span className="text-purple-400 bg-purple-900/50 px-2 py-1 rounded">{game.category}</span>
                  <span className="text-green-400">🟢 Online</span>
                </div>
                <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded font-bold text-lg transition-colors duration-300">
                  PLAY NOW
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🕹️</div>
            <h3 className="text-2xl text-yellow-400 mb-4">No Games Added Yet</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Follow the instructions above to add games with hover previews. 
              When you add games, they'll appear here with cool preview animations when players hover over them!
            </p>
          </div>
        )}

        {/* Game Modal */}
        {selectedGame && games.find(g => g.id === selectedGame) && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border-4 border-yellow-400 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h3 className="text-2xl text-white font-bold">
                  {games.find(g => g.id === selectedGame)?.name}
                </h3>
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="text-white hover:text-yellow-400 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-4">
                {games.find(g => g.id === selectedGame)?.embedUrl ? (
                  <div className="aspect-video bg-black rounded">
                    <iframe 
                      src={games.find(g => g.id === selectedGame)?.embedUrl}
                      className="w-full h-full rounded"
                      allowFullScreen
                      title={games.find(g => g.id === selectedGame)?.name}
                    />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🚧</div>
                    <h4 className="text-2xl text-yellow-400 mb-2">Game Embed Needed</h4>
                    <p className="text-gray-400">Add a working embed URL to this game</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <div className="inline-block bg-yellow-400/20 border-2 border-yellow-400 rounded-lg p-6">
            <p className="text-yellow-400 text-lg font-bold">Ready to add your games! 🚀</p>
          </div>
        </div>
      </div>
    </div>
  );
}
