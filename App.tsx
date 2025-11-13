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
            
            {/* MAIN ARCADE AREA */}
            <div className="main-arcade-area">
              
              {/* THREE GIANT ARCADE BUTTONS - RIGHT IN THE MIDDLE */}
              <div className="arcade-button-grid">
                {/* VOICE CHAT BUTTON */}
                <button 
                  className="super-arcade-button"
                  onClick={() => setCurrentPage('voice-chat')}
                >
                  🎤 VOICE CHAT
                </button>

                {/* ARCADE BUTTON */}
                <button 
                  className="super-arcade-button"
                  onClick={() => setCurrentPage('arcade')}
                >
                  🎮 ARCADE GAMES
                </button>

                {/* MERCH SHOP BUTTON */}
                <button 
                  className="super-arcade-button"
                  onClick={() => setCurrentPage('merch-shop')}
                >
                  👕 MERCH SHOP
                </button>
              </div>

              {/* TOP AD */}
              <div className="fun-ad-container">
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1184595877548269" crossOrigin="anonymous"></script>
                <ins className="adsbygoogle"
                     style={{display: 'block'}}
                     data-ad-client="ca-pub-1184595877548269"
                     data-ad-slot="1234567890"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
              </div>

              {/* BOTTOM AD */}
              <div className="fun-ad-container">
                <ins className="adsbygoogle"
                     style={{display: 'block'}}
                     data-ad-client="ca-pub-1184595877548269"
                     data-ad-slot="0987654321"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
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
            WHERE FRIENDS NEVER DIE!
          </h2>
          <p className="text-yellow-300 text-xl mt-6 font-bold">
            🚀 THE COOLEST SPOT FOR KIDS! 🚀
          </p>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1">
          {renderPage()}
        </main>

        {/* FUN FOOTER */}
        <footer className="fun-footer">
          <p className="mega-glow-yellow text-2xl font-bold">
            🤘 PLAY EVERY DAY! 🤘
          </p>
          <p className="text-red-400 text-lg mt-2">
            Chat with Friends • Play Awesome Games • Get Cool Stuff
          </p>
        </footer>
      </div>
    </div>
  );
}
