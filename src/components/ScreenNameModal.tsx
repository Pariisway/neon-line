import { useState } from 'react';

interface ScreenNameModalProps {
  isOpen: boolean;
  onConfirm: (screenName: string) => void;
  defaultName?: string;
}

export function ScreenNameModal({ isOpen, onConfirm, defaultName = '' }: ScreenNameModalProps) {
  const [screenName, setScreenName] = useState(defaultName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (screenName.trim()) {
      onConfirm(screenName.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 border-4 border-yellow-400 rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl text-yellow-400 mb-4 text-center">Enter Your Screen Name</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={screenName}
            onChange={(e) => setScreenName(e.target.value)}
            placeholder="Enter your screen name..."
            className="w-full p-3 bg-gray-700 border-2 border-yellow-400 rounded-lg text-white text-center text-lg mb-4"
            autoFocus
            maxLength={20}
          />
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => onConfirm(`Player${Math.floor(Math.random() * 1000)}`)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold"
            >
              Random Name
            </button>
            <button
              type="submit"
              disabled={!screenName.trim()}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-bold disabled:opacity-50"
            >
              Join Chat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
