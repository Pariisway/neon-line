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
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl text-yellow-400 mb-4 mega-glow-yellow">MERCH SHOP</h2>
          <p className="text-white text-xl">Get your official Neon Line merchandise!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {products.map(product => (
            <div key={product.id} className={`bg-gray-900 border-4 rounded-lg p-6 text-center transform hover:scale-105 transition-all duration-300 ${
              product.featured ? 'border-yellow-400' : 'border-purple-500'
            }`}>
              <div className="text-6xl mb-4">{product.image}</div>
              <h3 className="text-xl text-white font-bold mb-2">{product.name}</h3>
              <p className="text-2xl text-yellow-400 font-bold mb-4">{product.price}</p>
              {product.featured && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm mb-4 inline-block">
                  🔥 BEST SELLER
                </span>
              )}
              <button className="w-full bg-purple-600 text-white py-3 rounded font-bold hover:bg-purple-700">
                ADD TO CART
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="adsense-banner max-w-4xl mx-auto">
            <p className="text-yellow-400 text-lg">New items added weekly!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
