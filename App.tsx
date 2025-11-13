import { useState, useEffect } from 'react';
import { VoiceChatRooms } from './components/VoiceChatRooms';
import { ArcadeRoom } from './components/ArcadeRoom';
import { Marketplace } from './components/Marketplace';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');

  // Create floating emojis
  useEffect(() => {
    const container = document.querySelector('.floating-emojis');
    if (container) {
      const emojis = ['🎮', '👾', '🚀', '⭐', '🎯', '👻', '🦄', '🐲', '🤖', '🎪', '🎨', '🌈'];
      for (let i = 0; i < 20; i++) {
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
  }, []);

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
            
            {/* PREMIUM HOME PAGE ADS - MOST EXPENSIVE */}
            <div className="ad-leaderboard mt-8">
              <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1184595877548269"></script>
              <ins className="adsbygoogle"
                   style={{display: 'inline-block', width: '728px', height: '90px'}}
                   data-ad-client="ca-pub-1184595877548269"
                   data-ad-slot="9999999999"></ins>
            </div>
            
            {/* MAIN ARCADE AREA */}
            <div className="main-arcade-area">
              
              {/* THREE GIANT ARCADE BUTTONS */}
              <div className="arcade-button-grid">
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

              {/* MEDIUM RECTANGLE AD */}
              <div className="ad-medium-rectangle">
                <ins className="adsbygoogle"
                     style={{display: 'inline-block', width: '300px', height: '250px'}}
                     data-ad-client="ca-pub-1184595877548269"
                     data-ad-slot="8888888888"></ins>
              </div>

              {/* LARGE RECTANGLE AD */}
              <div className="ad-large-rectangle">
                <ins className="adsbygoogle"
                     style={{display: 'inline-block', width: '336px', height: '280px'}}
                     data-ad-client="ca-pub-1184595877548269"
                     data-ad-slot="7777777777"></ins>
              </div>
            </div>

            {/* BOTTOM BANNER AD */}
            <div className="ad-banner mb-8">
              <ins className="adsbygoogle"
                   style={{display: 'inline-block', width: '468px', height: '60px'}}
                   data-ad-client="ca-pub-1184595877548269"
                   data-ad-slot="6666666666"></ins>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden matrix-font">
      {/* ANIMATED BACKGROUND */}
      <div className="particle-bg"></div>
      <div className="floating-emojis"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* MEGA HEADER */}
        <header className="mega-header">
          <h1 className="mega-title mega-glow-red">
            THE NEON LINE
          </h1>
          <h2 className="mega-subtitle mega-glow-yellow">
            WHERE FRIENDS NEVER DIE
          </h2>
          <p className="text-yellow-300 text-xl mt-6">
            THE ULTIMATE GAMING DESTINATION
          </p>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1">
          {renderPage()}
        </main>

        {/* FUN FOOTER */}
        <footer className="fun-footer">
          <p className="mega-glow-yellow text-2xl">
            PLAY EVERY DAY
          </p>
          <p className="text-red-400 text-lg mt-2">
            CHAT WITH FRIENDS • PLAY AWESOME GAMES • GET COOL STUFF
          </p>
        </footer>
      </div>
    </div>
  );
}
