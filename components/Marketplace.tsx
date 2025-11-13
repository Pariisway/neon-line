export function Marketplace() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl text-yellow-400 mb-4">Merch Shop</h2>
        <p className="text-white">Cool merchandise coming soon...</p>
        <button 
          className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
          onClick={() => window.location.reload()}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
