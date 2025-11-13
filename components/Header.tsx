import { Gamepad2, ShoppingBag, Radio } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header className="relative border-b-2 border-cyan-500/50 bg-black/50 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-magenta-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/50">
              <Radio className="w-6 h-6 text-black" />
            </div>
            <h1 
              className="text-2xl tracking-wider cursor-pointer hover:text-cyan-400 transition-colors"
              onClick={() => onNavigate('home')}
              style={{
                fontFamily: 'monospace',
                textShadow: '0 0 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.3)'
              }}
            >
              THE LAST NEON
            </h1>
          </div>
          
          <nav className="flex gap-6">
            <button
              onClick={() => onNavigate('voice-chat')}
              className={`flex items-center gap-2 px-4 py-2 rounded border transition-all ${
                currentPage === 'voice-chat'
                  ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 shadow-lg shadow-cyan-500/30'
                  : 'border-cyan-500/30 text-cyan-400 hover:border-cyan-500 hover:bg-cyan-500/10'
              }`}
            >
              <Radio className="w-4 h-4" />
              Voice Rooms
            </button>
            
            <button
              onClick={() => onNavigate('arcade')}
              className={`flex items-center gap-2 px-4 py-2 rounded border transition-all ${
                currentPage === 'arcade'
                  ? 'border-magenta-500 bg-magenta-500/20 text-magenta-300 shadow-lg shadow-magenta-500/30'
                  : 'border-magenta-500/30 text-magenta-400 hover:border-magenta-500 hover:bg-magenta-500/10'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              Arcade
            </button>
            
            <button
              onClick={() => onNavigate('marketplace')}
              className={`flex items-center gap-2 px-4 py-2 rounded border transition-all ${
                currentPage === 'marketplace'
                  ? 'border-yellow-500 bg-yellow-500/20 text-yellow-300 shadow-lg shadow-yellow-500/30'
                  : 'border-yellow-500/30 text-yellow-400 hover:border-yellow-500 hover:bg-yellow-500/10'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Merch
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
