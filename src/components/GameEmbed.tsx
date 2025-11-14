import { useState } from 'react';

interface GameEmbedProps {
  gameId: string;
  title: string;
  description: string;
  embedUrl?: string;
}

export function GameEmbed({ gameId, title, description, embedUrl }: GameEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="game-container bg-gray-800 rounded-lg p-6 mb-8">
      <div className="text-center mb-4">
        <h2 className="text-2xl text-white font-bold mb-2">{title}</h2>
        <p className="text-gray-300">{description}</p>
      </div>

      {/* Ad above game */}
      <div className="ad-container mb-4 text-center">
        <ins className="adsbygoogle"
          style={{display: 'block'}}
          data-ad-client="ca-pub-3940256099942544"
          data-ad-slot="GAME_TOP"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
      </div>

      {/* Game area */}
      <div className="game-area bg-black rounded-lg p-4 mb-4">
        {embedUrl ? (
          <div className="relative" style={{ paddingBottom: '75%' }}> {/* 4:3 aspect ratio */}
            <iframe 
              src={embedUrl}
              className="absolute top-0 left-0 w-full h-full rounded"
              onLoad={() => setIsLoading(false)}
              allowFullScreen
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl text-white font-bold mb-2">Game Coming Soon!</h3>
            <p className="text-gray-400">This game will be embedded here soon</p>
          </div>
        )}
        
        {isLoading && embedUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <div className="text-white text-xl">Loading Game...</div>
          </div>
        )}
      </div>

      {/* Ad below game */}
      <div className="ad-container mt-4 text-center">
        <ins className="adsbygoogle"
          style={{display: 'block'}}
          data-ad-client="ca-pub-3940256099942544"
          data-ad-slot="GAME_BOTTOM"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
      </div>
    </div>
  );
}
