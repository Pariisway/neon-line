import { useState, useEffect } from 'react';
import { Route, Switch } from 'wouter';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { VoiceChatRooms } from './components/VoiceChatRooms';
import { GamesPage } from './components/GamesPage';
import { Marketplace } from './components/Marketplace';

function App() {
  // Create floating emojis
  useEffect(() => {
    const container = document.querySelector('.floating-emojis');
    if (container) {
      const emojis = ['🎮', '👾', '🚀', '⭐', '🎯', '👻', '🦄', '🐲', '🤖', '🎪', '🎨', '🌈'];
      for (let i = 0; i < 15; i++) {
        const emoji = document.createElement('div');
        emoji.className = 'floating-emoji';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = `${Math.random() * 100}%`;
        emoji.style.top = `${Math.random() * 100}%`;
        emoji.style.animationDelay = `${Math.random() * 8}s`;
        emoji.style.color = i % 2 === 0 ? '#ffff00' : '#ff0033';
        container.appendChild(emoji);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden matrix-font">
      {/* ANIMATED BACKGROUND */}
      <div className="particle-bg"></div>
      <div className="floating-emojis"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <Navigation />
        
        {/* Main Content with padding for fixed nav */}
        <div className="flex-1 pt-20">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/voice-chat" component={VoiceChatRooms} />
            <Route path="/games" component={GamesPage} />
            <Route path="/marketplace" component={Marketplace} />
            <Route>404 - Page Not Found</Route>
          </Switch>
        </div>

        {/* Footer */}
        <footer className="fun-footer mt-auto">
          <p className="mega-glow-yellow text-2xl">
            PLAY EVERY DAY
          </p>
          <p className="text-red-400 text-lg mt-2">
            CHAT WITH FRIENDS • PLAY AWESOME GAMES • GET COOL STUFF
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
