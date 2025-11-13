import { Link, useLocation } from 'wouter';
export function Navigation() {
  const [location] = useLocation();
  const navItem = (path: string, label: string) => (
    <Link href={path}>
      <div className={\`cursor-pointer text-xl font-bold transition-all duration-300 px-4 py-2 rounded-lg \${location === path
        ? 'text-yellow-400 mega-glow-yellow bg-yellow-400/10'
        : 'text-gray-400 hover:text-yellow-300 hover:bg-yellow-400/5'}\`}>
        {label}
      </div>
    </Link>
  );
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 border-b-4 border-yellow-400 shadow-yellow-500/50">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-20 px-6">
        <Link href="/">
          <div className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition-transform duration-300">
            <div className="text-yellow-400 text-3xl">⚡</div>
            <span className="text-2xl font-bold text-yellow-400 matrix-font">THE NEON LINE</span>
          </div>
        </Link>
        <div className="flex space-x-8">
          {navItem('/', 'HOME')}
          {navItem('/voice-chat', 'VOICE CHAT')}
          {navItem('/games', 'GAMES')}
          {navItem('/marketplace', 'MERCH SHOP')}
        </div>
        <div className="text-green-400 matrix-font text-lg">🔴 LIVE NOW</div>
      </div>
    </nav>
  );
}
