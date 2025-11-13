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
      case 'merch-store':
        return <Marketplace />;
      default:
        return (
          <div>
            {/* Header Section */}
            <header className="main-header">
              <h1 className="neon-text text-5xl md:text-7xl font-bold">THE LAST NEON</h1>
              <p className="tagline text-xl md:text-2xl">Where the 90s Never Died</p>
              <p className="text-lg text-gray-400 mt-4">
                Voice chat with gamers - Play arcade classics - Shop exclusive merch
              </p>
            </header>

            {/* Main Content */}
            <div className="section">
              {/* Three Main Features */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Voice Rooms Card */}
                <div className="feature-card">
                  <h2 className="section-title">VOICE ROOMS</h2>
                  <p className="text-gray-300 mb-4">
                    Join live voice chat rooms for your favorite games. No login required!
                  </p>
                  <ul className="feature-list">
                    <li>• Robins</li>
                    <li>• Portlets</li>
                    <li>• Network1</li>
                  </ul>
                  <button 
                    className="enter-button"
                    onClick={() => setCurrentPage('voice-chat')}
                  >
                    Enter →
                  </button>
                </div>

                {/* Arcade Card */}
                <div className="feature-card">
                  <h2 className="section-title">ARCADE</h2>
                  <p className="text-gray-300 mb-4">
                    Play retro-inspired HTML5 games. Beat high scores and challenge friends!
                  </p>
                  <ul className="feature-list">
                    <li>• More classes</li>
                    <li>• Money card</li>
                    <li>• Needless time</li>
                    <li>• Other needs</li>
                  </ul>
                  <button 
                    className="enter-button"
                    onClick={() => setCurrentPage('arcade')}
                  >
                    Enter →
                  </button>
                </div>

                {/* Merch Store Card */}
                <div className="feature-card">
                  <h2 className="section-title">MERCH STORE</h2>
                  <p className="text-gray-300 mb-4">
                    Exclusive The Last Neon merchandise. Support the community!
                  </p>
                  <ul className="feature-list">
                    <li>• Tokbits</li>
                    <li>• Modals</li>
                    <li>• Slaves</li>
                    <li>• Accounts</li>
                  </ul>
                  <button 
                    className="enter-button"
                    onClick={() => setCurrentPage('merch-store')}
                  >
                    Enter →
                  </button>
                </div>
              </div>

              {/* Stats Section */}
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="neon-cyan text-3xl font-bold">6</div>
                  <div className="text-gray-400">Chat Rooms</div>
                </div>
                <div className="stat-item">
                  <div className="neon-cyan text-3xl font-bold">6</div>
                  <div className="text-gray-400">Games</div>
                </div>
                <div className="stat-item">
                  <div className="neon-cyan text-3xl font-bold">24/7</div>
                  <div className="text-gray-400">Online</div>
                </div>
                <div className="stat-item">
                  <div className="neon-cyan text-3xl font-bold">$0</div>
                  <div className="text-gray-400">To Play</div>
                </div>
              </div>

              {/* AdSense Placements - Centered */}
              <div className="ad-container my-8 p-6 border border-cyan-500 rounded text-center">
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1184595877548269" crossOrigin="anonymous"></script>
                <ins className="adsbygoogle"
                     style={{display: 'block'}}
                     data-ad-client="ca-pub-1184595877548269"
                     data-ad-slot="1234567890"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
              </div>

              <div className="ad-container my-8 p-6 border border-cyan-500 rounded text-center">
                <ins className="adsbygoogle"
                     style={{display: 'block'}}
                     data-ad-client="ca-pub-1184595877548269"
                     data-ad-slot="0987654321"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
              </div>
            </div>

            {/* Footer */}
            <footer className="footer">
              <p>About Internet</p>
              <p className="text-sm mt-2">Google Adsense.com, home before</p>
              <p className="text-sm">Fully Live Adsense will buy (US$10.00000)</p>
            </footer>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {renderPage()}
    </div>
  );
}
