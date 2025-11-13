import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { VoiceChatRooms } from './components/VoiceChatRooms';
import { ArcadeRoom } from './components/ArcadeRoom';
import { Marketplace } from './components/Marketplace';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');

  // Create floating stars
  useEffect(() => {
    const stars = document.querySelector('.stars');
    if (stars) {
      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${Math.random() * 3 + 1}px`;
        star.style.height = star.style.width;
        star.style.animationDelay = `${Math.random() * 3}s`;
        stars.appendChild(star);
      }
    }
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'voice-chat':
        return <VoiceChatRooms />;
      case 'arcade':
        return <ArcadeRoom />;
      case 'marketplace':
        return <Marketplace />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  const pageTitles = {
    'home': '🎮 WELCOME TO NEON ARCADE! 🎮',
    'voice-chat': '🎤 VOICE CHAT ROOMS 🎤',
    'arcade': '🕹️ ARCADE GAMES 🕹️',
    'marketplace': '💰 GAME MARKETPLACE 💰'
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="space-bg"></div>
      <div className="stars"></div>
      
      {/* Floating Game Characters */}
      <div className="floating-characters">
        <div className="character" style={{ left: '10%', top: '20%', animationDelay: '0s' }}>👾</div>
        <div className="character" style={{ left: '85%', top: '30%', animationDelay: '1s' }}>🚀</div>
        <div className="character" style={{ left: '15%', top: '70%', animationDelay: '2s' }}>🛸</div>
        <div className="character" style={{ left: '80%', top: '60%', animationDelay: '3s' }}>🎯</div>
        <div className="character" style={{ left: '50%', top: '10%', animationDelay: '4s' }}>⭐</div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="text-center py-6 px-4">
          <h1 className="neon-glow text-5xl md:text-6xl font-bold mb-4">
            NEON ARCADE
          </h1>
          <p className="neon-glow-purple text-xl mb-2">The Coolest Gaming Spot for Kids!</p>
        </header>

        {/* Navigation */}
        <nav className="flex justify-center flex-wrap gap-4 py-4 px-4 bg-black/30 backdrop-blur-sm">
          {['home', 'voice-chat', 'arcade', 'marketplace'].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`arcade-button ${currentPage === page ? 'neon-glow-green' : ''}`}
            >
              {page.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </nav>

        {/* Page Title */}
        <div className="text-center py-6 px-4">
          <h2 className="neon-glow-purple text-3xl md:text-4xl font-bold">
            {pageTitles[currentPage as keyof typeof pageTitles]}
          </h2>
        </div>

        {/* Top Ad */}
        <div className="flex justify-center px-4 py-4">
          <div className="ad-container max-w-4xl w-full text-center">
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1184595877548269" crossOrigin="anonymous"></script>
            <ins className="adsbygoogle"
                 style={{display: 'block'}}
                 data-ad-client="ca-pub-1184595877548269"
                 data-ad-slot="1234567890"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 flex justify-center px-4 py-6">
          <div className="arcade-container max-w-6xl w-full p-6 md:p-8">
            {renderPage()}
          </div>
        </main>

        {/* Bottom Ad */}
        <div className="flex justify-center px-4 py-6">
          <div className="ad-container max-w-4xl w-full text-center">
            <ins className="adsbygoogle"
                 style={{display: 'block'}}
                 data-ad-client="ca-pub-1184595877548269"
                 data-ad-slot="0987654321"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 px-4 mt-8 bg-black/30 backdrop-blur-sm">
          <p className="neon-glow-green text-lg">Made with ❤️ for awesome kids!</p>
          <p className="text-blue-300 mt-2">Play safe and have fun! 🎮</p>
        </footer>
      </div>
    </div>
  );
}
