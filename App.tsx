import { useState } from 'react';
import { VoiceChatRooms } from './components/VoiceChatRooms';
import { ArcadeRoom } from './components/ArcadeRoom';
import { Marketplace } from './components/Marketplace';

// Simple Navigation
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
          <div className="main-content">
            <header className="mega-header">
              <h1 className="mega-title">THE NEON LINE</h1>
              <h2 className="mega-subtitle">WHERE FRIENDS NEVER DIE</h2>
            </header>
            
            <div className="text-center py-12">
              <h2 className="text-3xl text-yellow-400 mb-8">CHOOSE YOUR DESTINATION</h2>
              
              <div className="rooms-grid">
                <button 
                  className="room-card"
                  onClick={() => setCurrentPage('voice-chat')}
                >
                  <div className="text-4xl mb-4">🎤</div>
                  <h3 className="text-2xl text-white font-bold mb-2">VOICE CHAT</h3>
                  <p className="text-green-400">Click to test rooms</p>
                </button>

                <button 
                  className="room-card"
                  onClick={() => setCurrentPage('arcade')}
                >
                  <div className="text-4xl mb-4">🎮</div>
                  <h3 className="text-2xl text-white font-bold mb-2">ARCADE GAMES</h3>
                  <p className="text-green-400">Your games here</p>
                </button>

                <button 
                  className="room-card"
                  onClick={() => setCurrentPage('merch-shop')}
                >
                  <div className="text-4xl mb-4">👕</div>
                  <h3 className="text-2xl text-white font-bold mb-2">MERCH SHOP</h3>
                  <p className="text-green-400">Your products here</p>
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white matrix-font">
      {/* REMOVED: floating-emojis and particle-bg that were blocking clicks */}
      
      <TopNavigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {renderPage()}

      <footer className="fun-footer">
        <p className="text-yellow-300 text-2xl">PLAY EVERY DAY</p>
        <p className="text-red-400 text-lg mt-2">CHAT • GAMES • MERCH</p>
      </footer>
    </div>
  );
}
