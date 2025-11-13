import { Link, useLocation } from 'wouter';

export function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-b-4 border-yellow-400 shadow-2xl shadow-yellow-500/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition-transform duration-300">
              <div className="text-yellow-400 text-3xl">⚡</div>
              <span className="text-2xl font-bold text-yellow-400 matrix-font mega-glow-yellow">
                THE NEON LINE
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-8">
            <Link href="/">
              <div className={`cursor-pointer text-xl font-bold transition-all duration-300 px-4 py-2 rounded-lg ${
                location === '/' 
                  ? 'text-yellow-400 mega-glow-yellow bg-yellow-400/10' 
                  : 'text-gray-400 hover:text-yellow-300 hover:bg-yellow-400/5'
              }`}>
                HOME
              </div>
            </Link>
            
            <Link href="/voice-chat">
              <div className={`cursor-pointer text-xl font-bold transition-all duration-300 px-4 py-2 rounded-lg ${
                location === '/voice-chat' 
                  ? 'text-yellow-400 mega-glow-yellow bg-yellow-400/10' 
                  : 'text-gray-400 hover:text-yellow-300 hover:bg-yellow-400/5'
              }`}>
                VOICE CHAT
              </div>
            </Link>
            
            <Link href="/games">
              <div className={`cursor-pointer text-xl font-bold transition-all duration-300 px-4 py-2 rounded-lg ${
                location === '/games' 
                  ? 'text-yellow-400 mega-glow-yellow bg-yellow-400/10' 
                  : 'text-gray-400 hover:text-yellow-300 hover:bg-yellow-400/5'
              }`}>
                GAMES
              </div>
            </Link>

            <Link href="/marketplace">
              <div className={`cursor-pointer text-xl font-bold transition-all duration-300 px-4 py-2 rounded-lg ${
                location === '/marketplace' 
                  ? 'text-yellow-400 mega-glow-yellow bg-yellow-400/10' 
                  : 'text-gray-400 hover:text-yellow-300 hover:bg-yellow-400/5'
              }`}>
                MERCH SHOP
              </div>
            </Link>
          </div>

          {/* Right Side - User Status */}
          <div className="text-green-400 matrix-font text-lg mega-glow-green">
            🔴 LIVE NOW
          </div>
        </div>
      </div>
    </nav>
  );
}
