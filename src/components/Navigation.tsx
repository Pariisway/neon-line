import { useState } from 'react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-purple-900 to-blue-900 border-b-4 border-yellow-400 shadow-2xl fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 group cursor-pointer"
            onClick={() => onPageChange('arcade')}
          >
            <span className="text-4xl group-hover:scale-110 transition-transform duration-300">🎮</span>
            <div>
              <span className="text-2xl font-bold text-white">NEON ARCADE</span>
              <div className="text-xs text-yellow-300">Voice Chat Enabled</div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
                currentPage === 'arcade' 
                  ? 'bg-yellow-500 text-white shadow-lg' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white hover:scale-105'
              }`}
              onClick={() => onPageChange('arcade')}
            >
              🎯 Arcade
            </button>
            <button 
              className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
                currentPage === 'voice-chat' 
                  ? 'bg-yellow-500 text-white shadow-lg' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white hover:scale-105'
              }`}
              onClick={() => onPageChange('voice-chat')}
            >
              🎤 Voice Chat
            </button>
            <button 
              className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
                currentPage === 'marketplace' 
                  ? 'bg-yellow-500 text-white shadow-lg' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white hover:scale-105'
              }`}
              onClick={() => onPageChange('marketplace')}
            >
              🛍️ Shop
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white bg-white/10 p-3 rounded-lg hover:bg-white/20 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20 bg-purple-900 rounded-b-2xl">
            <div className="flex flex-col space-y-3">
              <button 
                className={`px-4 py-3 rounded-lg font-bold text-lg text-center transition-all duration-300 ${
                  currentPage === 'arcade' 
                    ? 'bg-yellow-500 text-white shadow-lg' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
                onClick={() => {
                  onPageChange('arcade');
                  setIsMenuOpen(false);
                }}
              >
                🎯 Arcade
              </button>
              <button 
                className={`px-4 py-3 rounded-lg font-bold text-lg text-center transition-all duration-300 ${
                  currentPage === 'voice-chat' 
                    ? 'bg-yellow-500 text-white shadow-lg' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
                onClick={() => {
                  onPageChange('voice-chat');
                  setIsMenuOpen(false);
                }}
              >
                🎤 Voice Chat
              </button>
              <button 
                className={`px-4 py-3 rounded-lg font-bold text-lg text-center transition-all duration-300 ${
                  currentPage === 'marketplace' 
                    ? 'bg-yellow-500 text-white shadow-lg' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
                onClick={() => {
                  onPageChange('marketplace');
                  setIsMenuOpen(false);
                }}
              >
                🛍️ Shop
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
