export function Marketplace() {
  const products = [
    { id: 1, name: 'Neon Line T-Shirt', price: '$24.99', image: '👕', featured: true },
    { id: 2, name: 'Gaming Headset', price: '$59.99', image: '🎧', featured: false },
    { id: 3, name: 'Limited Edition Hoodie', price: '$44.99', image: '🧥', featured: true },
    { id: 4, name: 'Gamer Mouse Pad', price: '$19.99', image: '🖱️', featured: false },
    { id: 5, name: 'Collector Pin Set', price: '$14.99', image: '📌', featured: false },
    { id: 6, name: 'Premium Water Bottle', price: '$29.99', image: '💧', featured: true },
  ];

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900">
      {/* Floating emojis background */}
      <div className="fixed inset-0 pointer-events-none">
        {['👕', '🎁', '🛍️', '🎨', '🌟', '💫', '🚀', '🔥'].map((emoji, index) => (
          <div
            key={index}
            className="absolute animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 15}px`,
              animationDelay: `${index * 0.5}s`,
              animationDuration: `${15 + (index % 10)}s`
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-6xl text-yellow-400 mb-4 animate-pulse">🛍️ MERCH SHOP 🛍️</h1>
          <p className="text-white text-xl">Get your official Neon Line merchandise!</p>
        </div>

        {/* In-content Ad */}
        <div className="text-center mb-8">
          <div className="ad-container inline-block bg-black/50 p-4 rounded-lg">
            <ins className="adsbygoogle"
              style={{display: 'block'}}
              data-ad-client="ca-pub-3940256099942544"
              data-ad-slot="300x250"
              data-ad-format="auto"
              data-full-width-responsive="true"></ins>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {products.map(product => (
            <div key={product.id} className={`bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 text-center transform hover:scale-105 transition-all duration-300 border-4 ${
              product.featured ? 'border-yellow-400 hover:shadow-[0_0_30px_#f59e0b]' : 'border-purple-500 hover:shadow-[0_0_30px_#a855f7]'
            }`}>
              <div className="text-6xl mb-4">{product.image}</div>
              <h3 className="text-xl text-white font-bold mb-2">{product.name}</h3>
              <p className="text-2xl text-yellow-400 font-bold mb-4">{product.price}</p>
              {product.featured && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm mb-4 inline-block">
                  🔥 BEST SELLER
                </span>
              )}
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded font-bold text-lg transition-colors duration-300">
                ADD TO CART
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-block bg-yellow-400/20 border-2 border-yellow-400 rounded-lg p-6">
            <p className="text-yellow-400 text-lg font-bold">New items added weekly! 🎁</p>
          </div>
        </div>
      </div>
    </div>
  );
}
