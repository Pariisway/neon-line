import { useState } from 'react';

export function ArcadeRoom() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const games = [
    { 
      id: 'sift-heads-assault-2', 
      name: 'Sift Heads Assault 2', 
      players: 156, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/sift-heads-assault-2',
      description: 'Epic shooting action',
      category: 'Action',
      icon: '🔫'
    },
    { 
      id: 'mana-blade', 
      name: 'Mana Blade', 
      players: 89, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/mmo/mana-blade',
      description: 'Magical RPG adventure',
      category: 'RPG',
      icon: '⚔️'
    },
    { 
      id: 'super-frog', 
      name: 'Super Frog', 
      players: 203, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/action/super-frog',
      description: 'Jump and run adventure',
      category: 'Platform',
      icon: '🐸'
    },
    { 
      id: 'overlords-new-mansion', 
      name: 'Overlords New Mansion', 
      players: 67, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/action/overlords-new-mansion',
      description: 'Strategic mansion building',
      category: 'Strategy',
      icon: '🏰'
    },
    { 
      id: 'wacky-dungeons', 
      name: 'Wacky Dungeons', 
      players: 124, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/clicker/wacky-dungeons',
      description: 'Crazy dungeon crawling',
      category: 'Adventure',
      icon: '🏰'
    },
    { 
      id: 'escape-the-bathroom', 
      name: 'Escape The Bathroom', 
      players: 98, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/puzzle/escape-the-bathroom',
      description: 'Puzzle escape game',
      category: 'Puzzle',
      icon: '🚪'
    },
    { 
      id: 'fast-warrior', 
      name: 'Fast Warrior', 
      players: 145, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/clicker/fast-warrior',
      description: 'Quick combat action',
      category: 'Action',
      icon: '⚡'
    },
    { 
      id: 'its-raining-monkeys', 
      name: 'Its Raining Monkeys', 
      players: 112, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/funny/its-raining-monkeys',
      description: 'Funny monkey madness',
      category: 'Funny',
      icon: '🐒'
    },
    { 
      id: 'skillfiteio', 
      name: 'Skillfite.io', 
      players: 234, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/io/skillfiteio',
      description: 'Multiplayer battle arena',
      category: 'IO',
      icon: '🎯'
    },
    { 
      id: 'raven-star', 
      name: 'Raven Star', 
      players: 78, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/action/raven-star',
      description: 'Space adventure',
      category: 'Action',
      icon: '⭐'
    },
    { 
      id: 'heart-break', 
      name: 'Heart Break', 
      players: 91, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/action/heart-break',
      description: 'Emotional action game',
      category: 'Action',
      icon: '💔'
    },
    { 
      id: 'robot-invasion', 
      name: 'Robot Invasion', 
      players: 167, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/clicker/robot-invasion',
      description: 'Defend against robots',
      category: 'Clicker',
      icon: '🤖'
    },
    { 
      id: 'rafting-adventures', 
      name: 'Rafting Adventures', 
      players: 134, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/action/rafting-adventures',
      description: 'Water rafting excitement',
      category: 'Adventure',
      icon: '🛶'
    },
    { 
      id: 'ships-3d-io', 
      name: 'Ships 3D.io', 
      players: 189, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/io/ships-3d-io',
      description: '3D ship battles',
      category: 'IO',
      icon: '🚢'
    },
    { 
      id: 'gatdamio', 
      name: 'Gatdam.io', 
      players: 156, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/io/gatdamio',
      description: 'Intense IO combat',
      category: 'IO',
      icon: '🎮'
    },
    { 
      id: 'adventure-driver', 
      name: 'Adventure Driver', 
      players: 122, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/car/adventure-driver',
      description: 'Epic driving adventure',
      category: 'Racing',
      icon: '🏎️'
    },
    { 
      id: 'astro-sheriff', 
      name: 'Astro Sheriff', 
      players: 88, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/action/astro-sheriff',
      description: 'Space law enforcement',
      category: 'Action',
      icon: '👨‍🚀'
    },
    { 
      id: 'dustbound-demo', 
      name: 'Dustbound Demo', 
      players: 76, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/action/dustbound-demo',
      description: 'Post-apocalyptic adventure',
      category: 'Action',
      icon: '🏜️'
    },
    { 
      id: 'car-eats-car-undersea', 
      name: 'Car Eats Car Undersea', 
      players: 198, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/car/car-eats-car-undersea-adventure',
      description: 'Underwater car battles',
      category: 'Racing',
      icon: '🐠'
    },
    { 
      id: 'sniper-team', 
      name: 'Sniper Team', 
      players: 145, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/shooting/sniper-team',
      description: 'Precision shooting',
      category: 'Shooting',
      icon: '🎯'
    },
    { 
      id: 'lost-island-3', 
      name: 'Lost Island 3', 
      players: 112, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/shooting/lost-island-3',
      description: 'Island survival shooter',
      category: 'Shooting',
      icon: '🏝️'
    },
    { 
      id: 'space', 
      name: 'Space Adventure', 
      players: 167, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/action/space',
      description: 'Cosmic exploration',
      category: 'Action',
      icon: '🚀'
    },
    { 
      id: 'getaway-driver-3d', 
      name: 'Getaway Driver 3D', 
      players: 178, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/car/getaway-driver-3d',
      description: 'High-speed escapes',
      category: 'Racing',
      icon: '🏃‍♂️'
    },
    { 
      id: 'max-dirt-bike', 
      name: 'Max Dirt Bike', 
      players: 134, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/car/max-dirt-bike',
      description: 'Extreme bike stunts',
      category: 'Racing',
      icon: '🏍️'
    },
    { 
      id: 'turkey-to-go', 
      name: 'Turkey To Go', 
      players: 99, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/action/turkey-to-go',
      description: 'Funny turkey adventure',
      category: 'Funny',
      icon: '🦃'
    },
    { 
      id: 'evio', 
      name: 'Evio', 
      players: 223, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/io-games/evio',
      description: 'Evolution IO battles',
      category: 'IO',
      icon: '🧬'
    },
    { 
      id: 'mini-putt', 
      name: 'Mini Putt', 
      players: 87, 
      status: 'Online',
      embedUrl: 'https://www.addictinggames.com/embed/sports/mini-putt',
      description: 'Miniature golf fun',
      category: 'Sports',
      icon: '⛳'
    }
  ];

  const categories = ['All', 'Action', 'IO', 'Racing', 'Shooting', 'Puzzle', 'Adventure', 'Funny', 'Sports', 'RPG', 'Strategy', 'Clicker', 'Platform'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          <p className="text-white text-xl">26+ AWESOME GAMES READY TO PLAY!</p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="🔍 Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-gray-800 text-white p-3 rounded-lg border-2 border-yellow-400 focus:outline-none focus:border-yellow-300"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-800 text-white p-3 rounded-lg border-2 border-purple-500 focus:outline-none focus:border-purple-400"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="text-center">
            <span className="text-green-400 font-bold">
              {filteredGames.length} games found • {selectedCategory} • {searchTerm ? `Search: "${searchTerm}"` : 'All games'}
            </span>
          </div>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredGames.map(game => (
            <div 
              key={game.id} 
              className="bg-gray-900/80 backdrop-blur-sm border-4 border-yellow-400 rounded-lg p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-[0_0_30px_#f59e0b] cursor-pointer"
              onClick={() => setSelectedGame(game.id)}
            >
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

        {/* Selected Game Modal */}
        {selectedGame && (
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
                    <h4 className="text-2xl text-yellow-400 mb-2">Game Coming Soon!</h4>
                    <p className="text-gray-400">This game will be available shortly</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <div className="inline-block bg-yellow-400/20 border-2 border-yellow-400 rounded-lg p-6">
            <p className="text-yellow-400 text-lg font-bold">26 Games Loaded • More Coming Soon! 🚀</p>
          </div>
        </div>
      </div>
    </div>
  );
}
