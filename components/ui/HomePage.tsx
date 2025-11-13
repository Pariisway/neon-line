import { Radio, Gamepad2, ShoppingBag, Zap } from 'lucide-react';
import { AdSense } from './AdSense';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <AdSense slot="home-top" />
      
      {/* Hero Section */}
      <div className="relative">
        {/* Animated grid background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }}
        />
        
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center mb-16">
            <div className="mb-8 flex justify-center">
              <div 
                className="w-32 h-32 bg-gradient-to-br from-cyan-500 via-magenta-500 to-yellow-500 rounded-full flex items-center justify-center animate-pulse"
                style={{
                  boxShadow: '0 0 60px rgba(0, 255, 255, 0.6), 0 0 100px rgba(255, 0, 255, 0.4)'
                }}
              >
                <Zap className="w-16 h-16 text-black" />
              </div>
            </div>
            
            <h1 
              className="text-6xl md:text-8xl mb-6 tracking-wider"
              style={{
                fontFamily: 'monospace',
                textShadow: '0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(255, 0, 255, 0.6), 0 0 60px rgba(255, 255, 0, 0.4)',
                background: 'linear-gradient(90deg, #00ffff, #ff00ff, #ffff00, #00ffff)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradientShift 3s ease infinite'
              }}
            >
              THE LAST NEON
            </h1>
            
            <p className="text-2xl text-cyan-400/80 mb-4">
              Where the 90s Never Died
            </p>
            <p className="text-lg text-magenta-400/60 max-w-2xl mx-auto">
              Voice chat with gamers • Play arcade classics • Shop exclusive merch
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Radio className="w-12 h-12" />}
              title="VOICE ROOMS"
              description="Join live voice chat rooms for your favorite games. No login required!"
              color="cyan"
              onClick={() => onNavigate('voice-chat')}
              rooms={['Roblox', 'Fortnite', 'Minecraft', 'WarZone', 'General', 'Lounge']}
            />
            
            <FeatureCard
              icon={<Gamepad2 className="w-12 h-12" />}
              title="ARCADE"
              description="Play retro-inspired HTML5 games. Beat high scores and challenge friends!"
              color="magenta"
              onClick={() => onNavigate('arcade')}
              rooms={['Neon Clicker', 'Memory Grid', 'Reaction Time', 'Color Match']}
            />
            
            <FeatureCard
              icon={<ShoppingBag className="w-12 h-12" />}
              title="MERCH STORE"
              description="Exclusive The Last Neon merchandise. Support the community!"
              color="yellow"
              onClick={() => onNavigate('marketplace')}
              rooms={['T-Shirts', 'Hoodies', 'Stickers', 'Accessories']}
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <StatCard number="6" label="Chat Rooms" />
          <StatCard number="6" label="Games" />
          <StatCard number="24/7" label="Online" />
          <StatCard number="$0" label="To Play" />
        </div>
      </div>

      <AdSense slot="home-bottom" />

      <style>{`
        @keyframes gridMove {
          0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
          100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}

function FeatureCard({ icon, title, description, color, onClick, rooms }: any) {
  const colorMap: Record<string, any> = {
    cyan: {
      border: 'border-cyan-500',
      bg: 'from-cyan-500/10 to-black',
      text: 'text-cyan-400',
      shadow: 'shadow-cyan-500/30',
      hover: 'hover:border-cyan-400 hover:shadow-cyan-500/50'
    },
    magenta: {
      border: 'border-magenta-500',
      bg: 'from-magenta-500/10 to-black',
      text: 'text-magenta-400',
      shadow: 'shadow-magenta-500/30',
      hover: 'hover:border-magenta-400 hover:shadow-magenta-500/50'
    },
    yellow: {
      border: 'border-yellow-500',
      bg: 'from-yellow-500/10 to-black',
      text: 'text-yellow-400',
      shadow: 'shadow-yellow-500/30',
      hover: 'hover:border-yellow-400 hover:shadow-yellow-500/50'
    }
  };

  const colors = colorMap[color];

  return (
    <button
      onClick={onClick}
      className={`p-8 rounded-lg border-2 ${colors.border} ${colors.hover} bg-gradient-to-b ${colors.bg} transition-all hover:scale-105 shadow-lg ${colors.shadow} text-left group`}
    >
      <div className={`${colors.text} mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      
      <h3 
        className="text-2xl mb-3 tracking-wider"
        style={{ fontFamily: 'monospace' }}
      >
        {title}
      </h3>
      
      <p className={`${colors.text} opacity-70 mb-4`}>
        {description}
      </p>

      <div className="space-y-1">
        {rooms.slice(0, 4).map((room: string, i: number) => (
          <div key={i} className={`text-xs ${colors.text} opacity-50`}>
            • {room}
          </div>
        ))}
      </div>

      <div className={`mt-6 inline-block px-4 py-2 border ${colors.border} rounded ${colors.text}`}>
        Enter →
      </div>
    </button>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center p-6 bg-black/50 border border-cyan-500/30 rounded-lg">
      <div 
        className="text-4xl mb-2"
        style={{
          fontFamily: 'monospace',
          textShadow: '0 0 10px rgba(0, 255, 255, 0.6)'
        }}
      >
        {number}
      </div>
      <div className="text-cyan-400/70">{label}</div>
    </div>
  );
}
