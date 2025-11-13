import { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
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
            
            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center py-12">
              <div className="text-center">
                {/* Three Main Option Icons */}
                <div className="icons-grid">
                  {/* Voice Chat Icon */}
                  <div 
                    className="tron-icon icon-voice"
                    onClick={() => setCurrentPage('voice-chat')}
                  >
                    <h3 className="tron-glow text-2xl font-bold mb-2">VOICE CHAT</h3>
                    <p className="text-tron-white opacity-80">Connect with players worldwide</p>
                  </div>

                  {/* Arcade Icon */}
                  <div 
                    className="tron-icon icon-arcade"
                    onClick={() => setCurrentPage('arcade')}
                  >
                    <h3 className="tron-glow text-2xl font-bold mb-2">ARCADE</h3>
                    <p className="text-tron-white opacity-80">Play awesome games</p>
                  </div>

                  {/* Merch Shop Icon */}
                  <div 
                    className="tron-icon icon-merch"
                    onClick={() => setCurrentPage('merch-shop')}
                  >
                    <h3 className="tron-glow text-2xl font-bold mb-2">MERCH SHOP</h3>
                    <p className="text-tron-white opacity-80">Get cool gear</p>
                  </div>
                </div>

                {/* Centered AdSense - Top */}
                <div className="ad-container max-w-4xl mx-auto mt-8">
                  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1184595877548269" crossOrigin="anonymous"></script>
                  <ins className="adsbygoogle"
                       style={{display: 'block'}}
                       data-ad-client="ca-pub-1184595877548269"
                       data-ad-slot="1234567890"
                       data-ad-format="auto"
                       data-full-width-responsive="true"></ins>
                </div>

                {/* Centered AdSense - Bottom */}
                <div className="ad-container max-w-4xl mx-auto mt-8">
                  <ins className="adsbygoogle"
                       style={{display: 'block'}}
                       data-ad-client="ca-pub-1184595877548269"
                       data-ad-slot="0987654321"
                       data-ad-format="auto"
                       data-full-width-responsive="true"></ins>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-tron-darker text-white relative overflow-hidden">
      {/* Tron Grid Background */}
      <div className="tron-grid-bg"></div>
      <div className="scan-line"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header with "THE NEON LINE" */}
        <header className="text-center py-8 px-4 border-b-2 border-tron-blue">
          <h1 className="tron-glow tron-text text-5xl md:text-7xl font-black tracking-wider">
            THE NEON LINE
          </h1>
          <p className="tron-glow-orange text-lg md:text-xl mt-4 tracking-widest">
            ENTER THE GRID
          </p>
        </header>

        {/* Main Content */}
        {renderPage()}

        {/* Footer */}
        <footer className="text-center py-6 px-4 border-t-2 border-tron-blue mt-auto">
          <p className="tron-glow text-sm tracking-wider">
            THE NEON LINE © 2024 | PREPARE FOR THE ULTIMATE DIGITAL EXPERIENCE
          </p>
        </footer>
      </div>
    </div>
  );
}
