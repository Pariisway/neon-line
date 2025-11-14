import { useState } from 'react';
import { AgoraVoiceChat } from './components/AgoraVoiceChat';
import { ArcadeRoom } from './components/ArcadeRoom';
import { Marketplace } from './components/Marketplace';

type Page = 'voice-chat' | 'arcade' | 'marketplace';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('voice-chat');

  const renderPage = () => {
    switch (currentPage) {
      case 'voice-chat':
        return <AgoraVoiceChat />;
      case 'arcade':
        return <ArcadeRoom />;
      case 'marketplace':
        return <Marketplace />;
      default:
        return <AgoraVoiceChat />;
    }
  };

  return (
    <div className="App">
      {/* Navigation Bar */}
      <nav className="nav-container">
        <div className="nav-content">
          <div className="nav-logo">
            <h1 className="text-yellow-400 text-2xl font-bold">NEON LINE</h1>
          </div>
          <div className="nav-links">
            <button 
              className={`nav-link ${currentPage === 'voice-chat' ? 'active' : ''}`}
              onClick={() => setCurrentPage('voice-chat')}
            >
              🎧 Voice Chat
            </button>
            <button 
              className={`nav-link ${currentPage === 'arcade' ? 'active' : ''}`}
              onClick={() => setCurrentPage('arcade')}
            >
              🎮 Arcade
            </button>
            <button 
              className={`nav-link ${currentPage === 'marketplace' ? 'active' : ''}`}
              onClick={() => setCurrentPage('marketplace')}
            >
              🛒 Marketplace
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      {renderPage()}
    </div>
  );
}

export default App;
