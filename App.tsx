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
    <div className="min-h-screen bg-black text-cyan-400 font-mono relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500 rounded-full mix-blend-screen opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-green-500 rounded-full mix-blend-screen opacity-15 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-yellow-500 rounded-full mix-blend-screen opacity-10 animate-spin"></div>
      </div>

      <div className="relative z-10">
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />
        
        {/* Ad Container - Top */}
        <div className="container mx-auto px-4 mt-4">
          <div className="ad-container rounded-lg pulse-glow">
            <ins className="adsbygoogle"
                 style={{display: 'block'}}
                 data-ad-client="ca-pub-1184595877548269"
                 data-ad-slot="1234567890"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
          </div>
        </div>

        {renderPage()}

        {/* Ad Container - Bottom */}
        <div className="container mx-auto px-4 mt-8 mb-8">
          <div className="ad-container rounded-lg pulse-glow">
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
