import { useState, useEffect } from 'react';
import { VoiceChatRooms } from './components/VoiceChatRooms';
import { ArcadeRoom } from './components/ArcadeRoom';
import { Marketplace } from './components/Marketplace';

// Top Navigation Component
function TopNavigation({ currentPage, setCurrentPage }: { currentPage: string, setCurrentPage: (page: string) => void }) {
  return (
    <nav className="top-nav">
      <ul className="nav-menu">
        <li>
          <button 
            className="nav-button"
            onClick={() => setCurrentPage('home')}
          >
            🏠 HOME
          </button>
        </li>
        <li>
          <button 
            className="nav-button"
            onClick={() => setCurrentPage('voice-chat')}
          >
            🎤 CHAT
          </button>
        </li>
        <li>
          <button 
            className="nav-button"
            onClick={() => setCurrentPage('arcade')}
          >
            🎮 GAMES
          </button>
        </li>
        <li>
          <button 
            className="nav-button"
            onClick={() => setCurrentPage('merch-shop')}
          >
            👕 SHOP
          </button>
        </li>
      </ul>
    </nav>
  );
}

// AdSense Component
function AdSenseBanner() {
  return (
    <div className="adsense-banner">
      <div className="text-white text-sm font-bold mb-1">Advertisement</div>
      <div className="bg-gray-800 p-2 rounded-lg text-white text-xs">
        <p className="text-yellow-400">AdSense Placement</p>
        <p>Your ad could be here!</p>
      </div>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Create floating emojis - fewer on mobile
  useEffect(() => {
    const container = document.querySelector('.floating-emojis');
    if (container) {
      container.innerHTML = ''; // Clear existing
      const emojis = ['🎮', '👾', '🚀', '⭐', '🎯', '👻'];
      const emojiCount = isMobile ? 8 : 20;
      
      for (let i = 0; i < emojiCount; i++) {
        const emoji = document.createElement('div');
        emoji.className = 'floating-emoji';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = `${Math.random() * 100}%`;
        emoji.style.top = `${Math.random() * 100}%`;
        emoji.style.animationDelay = `${Math.random() * 8}s`;
        emoji.style.color = i % 2 === 0 ? '#ffff00' : '#ff0033';
        container.appendChild(emoji);
      }
    }
  }, [isMobile]);

  const renderPage = () => {
    switch (currentPage) {
      case 'voice-chat':
        return <VoiceChatRooms />;
      case 'arcade':
        return <ArcadeRoom />;
      case 'merch-shop':
        return <Marketplace />;
      default:
        return (
          <div className="min-h-screen flex flex-col">
            {/* ANIMATED BACKGROUND */}
            <div className="particle-bg"></div>
            <div className="floating-emojis"></div>
            
            {/* ADVERTISEMENT BANNER */}
            <AdSenseBanner />
            
            {/* MAIN ARCADE AREA */}
            <div className="main-arcade-area">
              <div className="center-content w-full px-4">
                <h2 className="text-2xl md:text-3xl text-yellow-400 mb-6 md:mb-8 mega-glow-yellow">
                  CHOOSE YOUR DESTINATION
                </h2>
                
                {/* THREE GIANT ARCADE BUTTONS */}
                <div className="arcade-button-grid w-full">
                  <button 
                    className="super-arcade-button"
                    onClick={() => setCurrentPage('voice-chat')}
                  >
                    🎤 VOICE CHAT
                  </button>

                  <button 
                    className="super-arcade-button"
                    onClick={() => setCurrentPage('arcade')}
                  >
                    🎮 ARCADE GAMES
                  </button>

                  <button 
                    className="super-arcade-button"
                    onClick={() => setCurrentPage('merch-shop')}
                  >
                    👕 MERCH SHOP
                  </button>
                </div>
              </div>
            </div>
            
            {/* BOTTOM ADVERTISEMENT */}
            <AdSenseBanner />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden matrix-font">
      {/* ANIMATED BACKGROUND */}
      <div className="particle-bg"></div>
      <div className="floating-emojis"></div>

      {/* TOP NAVIGATION */}
      <TopNavigation currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* MEGA HEADER - Only show on home page */}
        {currentPage === 'home' && (
          <header className="mega-header">
            <h1 className="mega-title mega-glow-red">
              THE NEON LINE
            </h1>
            <h2 className="mega-subtitle mega-glow-yellow">
              WHERE FRIENDS NEVER DIE
            </h2>
            <p className="text-yellow-300 text-sm md:text-xl mt-4 md:mt-6">
              THE ULTIMATE GAMING DESTINATION
            </p>
          </header>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1">
          {renderPage()}
        </main>

        {/* FUN FOOTER */}
        <footer className="fun-footer">
          <p className="mega-glow-yellow text-lg md:text-2xl">
            PLAY EVERY DAY
          </p>
          <p className="text-red-400 text-sm md:text-lg mt-2">
            CHAT • GAMES • MERCH
          </p>
          <div className="mt-3">
            <AdSenseBanner />
          </div>
        </footer>
      </div>
    </div>
  );
}
