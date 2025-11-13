import { Link } from 'wouter';

export function HomePage() {
  return (
    <div className="text-center p-8 matrix-font">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12 pt-8">
          <h1 className="mega-title mega-glow-red mb-6">
            THE NEON LINE
          </h1>
          <h2 className="mega-subtitle mega-glow-yellow mb-8">
            WHERE FRIENDS NEVER DIE
          </h2>
          <p className="text-yellow-300 text-2xl mb-12">
            THE ULTIMATE GAMING DESTINATION
          </p>
        </div>

        {/* Premium Home Page Ads */}
        <div className="ad-leaderboard mb-12">
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1184595877548269"></script>
          <ins className="adsbygoogle"
               style={{display: 'inline-block', width: '728px', height: '90px'}}
               data-ad-client="ca-pub-1184595877548269"
               data-ad-slot="9999999999"></ins>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Link href="/voice-chat">
            <div className="cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-gray-900 to-black border-4 border-yellow-500 rounded-2xl p-8 shadow-2xl shadow-yellow-500/30 hover:shadow-3xl hover:shadow-yellow-500/50 h-64 flex flex-col justify-center">
                <div className="text-6xl mb-4">🎤</div>
                <h2 className="text-3xl text-yellow-400 mb-4">VOICE CHAT</h2>
                <p className="text-gray-300 text-lg">
                  Join live voice chats with gamers worldwide
                </p>
              </div>
            </div>
          </Link>

          <Link href="/games">
            <div className="cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-gray-900 to-black border-4 border-green-500 rounded-2xl p-8 shadow-2xl shadow-green-500/30 hover:shadow-3xl hover:shadow-green-500/50 h-64 flex flex-col justify-center">
                <div className="text-6xl mb-4">🎮</div>
                <h2 className="text-3xl text-green-400 mb-4">GAMES</h2>
                <p className="text-gray-300 text-lg">
                  Play classic and modern browser games
                </p>
              </div>
            </div>
          </Link>

          <Link href="/marketplace">
            <div className="cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-gray-900 to-black border-4 border-red-500 rounded-2xl p-8 shadow-2xl shadow-red-500/30 hover:shadow-3xl hover:shadow-red-500/50 h-64 flex flex-col justify-center">
                <div className="text-6xl mb-4">👕</div>
                <h2 className="text-3xl text-red-400 mb-4">MERCH SHOP</h2>
                <p className="text-gray-300 text-lg">
                  Get awesome gaming gear and merch
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Additional Ads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="ad-medium-rectangle">
            <ins className="adsbygoogle"
                 style={{display: 'inline-block', width: '300px', height: '250px'}}
                 data-ad-client="ca-pub-1184595877548269"
                 data-ad-slot="8888888888"></ins>
          </div>
          <div className="ad-large-rectangle">
            <ins className="adsbygoogle"
                 style={{display: 'inline-block', width: '336px', height: '280px'}}
                 data-ad-client="ca-pub-1184595877548269"
                 data-ad-slot="7777777777"></ins>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="feature-card p-6 bg-black/50 border-2 border-yellow-400 rounded-xl">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl text-yellow-400 mb-2">LIGHTNING FAST</h3>
            <p className="text-gray-400">Instant voice connections</p>
          </div>
          <div className="feature-card p-6 bg-black/50 border-2 border-yellow-400 rounded-xl">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl text-yellow-400 mb-2">SAFE SPACE</h3>
            <p className="text-gray-400">Moderated 24/7</p>
          </div>
          <div className="feature-card p-6 bg-black/50 border-2 border-yellow-400 rounded-xl">
            <div className="text-4xl mb-4">🌎</div>
            <h3 className="text-xl text-yellow-400 mb-2">GLOBAL</h3>
            <p className="text-gray-400">Gamers worldwide</p>
          </div>
        </div>

        {/* Bottom Banner Ad */}
        <div className="ad-banner mb-8">
          <ins className="adsbygoogle"
               style={{display: 'inline-block', width: '468px', height: '60px'}}
               data-ad-client="ca-pub-1184595877548269"
               data-ad-slot="6666666666"></ins>
        </div>
      </div>
    </div>
  );
}
