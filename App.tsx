import { useState } from 'react';
import { VoiceChatRooms } from './components/VoiceChatRooms';
import { ArcadeRoom } from './components/ArcadeRoom';
import { Marketplace } from './components/Marketplace';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');

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
            {/* Tron Grid Background */}
            <div className="tron-grid-bg"></div>
            <div className="scan-line"></div>
            
            {/* Main Content Area - Icons pushed to middle */}
            <div className="content-area">
              {/* Three Main Option Icons - Now Clickable! */}
              <div className="icons-grid">
                {/* Voice Chat Icon */}
                <div 
                  className="tron-icon icon-voice"
                  onClick={() => setCurrentPage('voice-chat')}
                  style={{ cursor: 'pointer' }}
                >
                  <h3 className="tron-glow text-3xl font-bold mb-3">VOICE CHAT</h3>
                  <p className="text-tron-white opacity-80 text-lg">Connect with players worldwide</p>
                </div>

                {/* Arcade Icon */}
                <div 
                  className="tron-icon icon-arcade"
                  onClick={() => setCurrentPage('arcade')}
                  style={{ cursor: 'pointer' }}
                >
                  <h3 className="tron-glow text-3xl font-bold mb-3">ARCADE</h3>
                  <p className="text-tron-white opacity-80 text-lg">Play awesome games</p>
                </div>

                {/* Merch Shop Icon */}
                <div 
                  className="tron-icon icon-merch"
                  onClick={() => setCurrentPage('merch-shop')}
                  style={{ cursor: 'pointer' }}
                >
                  <h3 className="tron-glow text-3xl font-bold mb-3">MERCH SHOP</h3>
                  <p className="text-tron-white opacity-80 text-lg">Get cool gear</p>
                </div>
              </div>

              {/* Centered AdSense - Top */}
              <div className="ad-container">
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1184595877548269" crossOrigin="anonymous"></script>
                <ins className="adsbygoogle"
                     style={{display: 'block'}}
                     data-ad-client="ca-pub-1184595877548269"
                     data-ad-slot="1234567890"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
              </div>

              {/* Centered AdSense - Bottom */}
              <div className="ad-container">
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
      {/* Tron Grid Background */}
      <div className="tron-grid-bg"></div>
      <div className="scan-line"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header with "THE NEON LINE" - Top Center */}
        <header className="main-header">
          <h1 className="tron-glow tron-text text-6xl md:text-8xl font-black tracking-widest">
            THE NEON LINE
          </h1>
          <p className="tron-glow-red text-xl md:text-2xl mt-6 tracking-wider">
            ENTER THE GRID
          </p>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {renderPage()}
        </main>

        {/* Footer */}
        <footer className="text-center py-8 px-4 border-t-2 border-tron-orange mt-auto">
          <p className="tron-glow text-sm tracking-wider">
            THE NEON LINE © 2024 | ENTER THE GRID
          </p>
        </footer>
      </div>
    </div>
  );
}
