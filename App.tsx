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
    <div className="min-h-screen bg-black">
      {/* 90s Laser Grid Background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.3) 2px, transparent 2px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.3) 2px, transparent 2px),
            linear-gradient(rgba(255, 0, 255, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 0, 255, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
          backgroundPosition: '0 0, 0 0, -1px -1px, -1px -1px'
        }}
      />

      {/* Gradient Orbs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />
        {renderPage()}
      </div>
    </div>
  );
}
