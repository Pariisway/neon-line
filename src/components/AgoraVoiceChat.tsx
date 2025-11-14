export function AgoraVoiceChat() {
  return (
    <div className="main-content">
      <div className="container">
        <div className="text-center mb-8">
          <h1 className="text-4xl text-yellow-400 mb-4">VOICE CHAT ROOMS</h1>
          <p className="text-white text-xl mb-6">Real Multi-User Voice Chat - Coming Soon!</p>
          
          <div className="max-w-2xl mx-auto bg-blue-900 border-2 border-blue-400 rounded-lg p-8">
            <div className="text-6xl mb-4">🎤</div>
            <h2 className="text-2xl text-white font-bold mb-4">Feature in Development</h2>
            <p className="text-blue-200 mb-4">
              We're working on bringing you amazing voice chat rooms where you can talk with other players in real-time!
            </p>
            <div className="bg-yellow-900 border border-yellow-400 rounded p-4">
              <p className="text-yellow-200 font-bold">In the meantime:</p>
              <p className="text-yellow-100">🎮 Play our awesome games in the Arcade!</p>
              <p className="text-yellow-100">🏆 Compete for high scores</p>
              <p className="text-yellow-100">⭐ Enjoy ad-free gaming experience</p>
            </div>
          </div>
        </div>

        {/* Ads to start monetizing */}
        <div className="ad-container text-center mb-8">
          <ins className="adsbygoogle"
            style={{display: 'block'}}
            data-ad-client="ca-pub-3940256099942544"
            data-ad-slot="1234567890"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
        </div>

        <div className="text-center">
          <a href="/arcade" className="bg-yellow-600 hover:bg-yellow-700 text-white text-xl font-bold py-4 px-8 rounded-lg inline-block">
            🎮 GO TO ARCADE
          </a>
        </div>
      </div>
    </div>
  );
}
