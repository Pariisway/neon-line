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
      case 'marketplace':
        return <Marketplace />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'voice-chat': return 'VOICE CHAT ROOMS';
      case 'arcade': return 'ARCADE GAMES';
      case 'marketplace': return 'MARKETPLACE';
      default: return 'WELCOME TO THE NEON LINE';
    }
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono relative crt-effect">
      {/* Background Elements */}
      <div className="laser-grid"></div>
      <div className="scan-lines"></div>
      
      {/* Floating orbs */}
      <div className="fixed top-20 left-10 w-4 h-4 bg-cyan-400 rounded-full opacity-60 animate-pulse"></div>
      <div className="fixed top-40 right-20 w-6 h-6 bg-pink-400 rounded-full opacity-40 animate-bounce"></div>
      <div className="fixed bottom-32 left-1/4 w-3 h-3 bg-green-400 rounded-full opacity-50 animate-ping"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* MAIN HEADER - CENTERED */}
        <div className="text-center py-8 border-b border-cyan-500/30">
          <h1 className="neon-text text-6xl font-bold mb-4 tracking-wider">
            THE NEON LINE
          </h1>
          <p className="neon-text-pink text-xl mb-2">90s Cyber Arcade Experience</p>
        </div>

        {/* NAVIGATION MENU - CENTERED */}
        <div className="flex justify-center space-x-8 py-6 border-b border-cyan-500/20 bg-black/80">
          <button 
            onClick={() => setCurrentPage('home')}
            className={`neon-button ${currentPage === 'home' ? 'bg-cyan-500/20' : ''}`}
          >
            🏠 HOME
          </button>
          <button 
            onClick={() => setCurrentPage('voice-chat')}
            className={`neon-button ${currentPage === 'voice-chat' ? 'bg-cyan-500/20' : ''}`}
          >
            🎤 VOICE CHAT
          </button>
          <button 
            onClick={() => setCurrentPage('arcade')}
            className={`neon-button ${currentPage === 'arcade' ? 'bg-cyan-500/20' : ''}`}
          >
            🎮 ARCADE
          </button>
          <button 
            onClick={() => setCurrentPage('marketplace')}
            className={`neon-button ${currentPage === 'marketplace' ? 'bg-cyan-500/20' : ''}`}
          >
            💰 MARKETPLACE
          </button>
        </div>

        {/* PAGE TITLE - CENTERED */}
        <div className="text-center py-6">
          <h2 className="neon-text-green text-4xl font-bold tracking-wider">
            {getPageTitle()}
          </h2>
        </div>

        {/* TOP AD - CENTERED */}
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

        {/* MAIN CONTENT - CENTERED */}
        <div className="flex-1 flex justify-center px-4 py-6">
          <div className="content-section max-w-6xl w-full">
            {renderPage()}
          </div>
        </div>

        {/* BOTTOM AD - CENTERED */}
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

        {/* FOOTER */}
        <footer className="text-center py-8 border-t border-cyan-500/30 mt-8">
          <p className="neon-text-pink">© 2024 THE NEON LINE - 90s Cyber Arcade</p>
        </footer>
      </div>
    </div>
  );
}
