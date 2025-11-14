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
      {/* Global Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black z-0"></div>
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] z-0"></div>

      {/* Navigation Bar */}
      <nav className="relative z-50 bg-gray-900 bg-opacity-90 border-b border-cyan-400 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-yellow-400 neon-text">
                NEON LINE
              </h1>
            </div>

            {/* Navigation Links */}
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentPage('voice-chat')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  currentPage === 'voice-chat'
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                    : 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800'
                }`}
              >
                🎧 Voice Chat
              </button>
              <button
                onClick={() => setCurrentPage('arcade')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  currentPage === 'arcade'
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
                    : 'text-gray-300 hover:text-green-400 hover:bg-gray-800'
                }`}
              >
                🎮 Arcade
              </button>
              <button
                onClick={() => setCurrentPage('marketplace')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  currentPage === 'marketplace'
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/50'
                    : 'text-gray-300 hover:text-purple-400 hover:bg-gray-800'
                }`}
              >
                🛒 Marketplace
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="relative z-50 bg-gray-900 bg-opacity-90 border-t border-cyan-400 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2024 Neon Line. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
