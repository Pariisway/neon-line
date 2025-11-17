import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { ArcadeRoom } from './components/ArcadeRoom';
import { VoiceChatRooms } from './components/VoiceChatRooms';
import { Marketplace } from './components/Marketplace';
import { AdSenseBanner } from './components/AdSenseBanner';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('arcade');

  const renderPage = () => {
    switch (currentPage) {
      case 'voice-chat':
        return <VoiceChatRooms />;
      case 'marketplace':
        return <Marketplace />;
      case 'arcade':
      default:
        return <ArcadeRoom />;
    }
  };

  return (
    <div className="App">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      
      {/* Top AdSense Banner */}
      <div className="text-center py-4 bg-gray-900 border-b-4 border-yellow-400">
        <AdSenseBanner slot="728x90" format="auto" responsive={true} />
      </div>

      {renderPage()}
      
      {/* Bottom AdSense Banner */}
      <div className="text-center py-4 bg-gray-900 border-t-4 border-yellow-400">
        <AdSenseBanner slot="728x90_bottom" format="auto" responsive={true} />
      </div>
    </div>
  );
}

export default App;
// Build fix
