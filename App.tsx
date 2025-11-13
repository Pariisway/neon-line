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

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono relative crt-effect">
      {/* Background Elements */}
      <div className="laser-grid"></div>
      <div className="scan-lines"></div>
      
      {/* Floating orbs */}
      <div className="fixed top-20 left-10 w-4 h-4 bg-cyan-400 rounded-full opacity-60 animate-pulse"></div>
      <div className="fixed top-40 right-20 w-6 h-6 bg-pink-400 rounded-full opacity-40 animate-bounce"></div>
      <div className="fixed bottom-32 left-1/4 w-3 h-3 bg-green-400 rounded-full opacity-50 animate-ping"></div>

      <div className="relative z-10 container-center">
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />
        
        {/* Top Ad */}
        <div className="ad-container max-w-4xl mx-auto">
          <ins className="adsbygoogle"
               style={{display: 'block', textAlign: 'center'}}
               data-ad-client="ca-pub-1184595877548269"
               data-ad-slot="1234567890"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>

        {/* Main Content */}
        <div className="content-section max-w-6xl">
          {renderPage()}
        </div>

        {/* Bottom Ad */}
        <div className="ad-container max-w-4xl mx-auto">
          <ins className="adsbygoogle"
               style={{display: 'block', textAlign: 'center'}}
               data-ad-client="ca-pub-1184595877548269"
               data-ad-slot="0987654321"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>
      </div>
    </div>
  );
}
