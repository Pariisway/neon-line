import { useState, useEffect } from 'react';
import { ShoppingCart, User, LogIn, LogOut, Package } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { AdSense } from './AdSense';

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  sellerId: string;
  createdAt: string;
}

export function Marketplace() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [cart, setCart] = useState<string[]>([]);

  const supabase = createClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey
  );

  useEffect(() => {
    checkSession();
    fetchItems();
    initDemoItems();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      setAccessToken(session.access_token);
      setIsLoggedIn(true);
      fetchProfile(session.access_token);
    }
  };

  const fetchProfile = async (token: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-418b4969/profile`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const initDemoItems = async () => {
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-418b4969/init-demo-items`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );
    } catch (error) {
      console.error('Error initializing demo items:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-418b4969/marketplace/items`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleSignUp = async (formData: any) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-418b4969/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        alert('Account created! Please sign in.');
        setIsSignUp(false);
      } else {
        alert(data.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Failed to create account');
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (data.session?.access_token) {
        setAccessToken(data.session.access_token);
        setIsLoggedIn(true);
        setShowAuth(false);
        fetchProfile(data.session.access_token);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Failed to sign in');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setAccessToken(null);
    setUserProfile(null);
    setCart([]);
  };

  const addToCart = (itemId: string) => {
    if (!isLoggedIn) {
      alert('Please sign in to add items to cart');
      setShowAuth(true);
      return;
    }
    setCart([...cart, itemId]);
    alert('Added to cart!');
  };

  const checkout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    const total = cart.reduce((sum, itemId) => {
      const item = items.find(i => i.id === itemId);
      return sum + (item?.price || 0);
    }, 0);

    alert(`Checkout successful! Total: $${total.toFixed(2)}\n\nShipping to:\n${userProfile?.name}\n${userProfile?.address}\n${userProfile?.city}, ${userProfile?.state} ${userProfile?.zip}`);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <AdSense slot="marketplace-top" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 
              className="text-4xl mb-2"
              style={{
                fontFamily: 'monospace',
                textShadow: '0 0 20px rgba(255, 255, 0, 0.8), 0 0 40px rgba(255, 255, 0, 0.5)'
              }}
            >
              MERCH STORE
            </h2>
            <p className="text-yellow-400/70">Official The Last Neon merchandise</p>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500 rounded">
                  <User className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400">{userProfile?.name || 'User'}</span>
                </div>
                <button
                  onClick={() => alert(`Cart: ${cart.length} items`)}
                  className="relative px-4 py-2 bg-cyan-500/20 border border-cyan-500 text-cyan-400 rounded hover:bg-cyan-500/30 transition-all"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-magenta-500 rounded-full text-xs flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded hover:bg-red-500/30 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="flex items-center gap-2 px-6 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400 transition-all"
              >
                <LogIn className="w-5 h-5" />
                Sign In / Sign Up
              </button>
            )}
          </div>
        </div>

        {showAuth && !isLoggedIn && (
          <AuthModal
            isSignUp={isSignUp}
            setIsSignUp={setIsSignUp}
            onSignUp={handleSignUp}
            onSignIn={handleSignIn}
            onClose={() => setShowAuth(false)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-black/50 border-2 border-yellow-500/30 rounded-lg overflow-hidden hover:border-yellow-500 transition-all"
            >
              <div className="aspect-square bg-gradient-to-br from-yellow-500/10 to-black">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-16 h-16 text-yellow-400/30" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl mb-2">{item.name}</h3>
                <p className="text-yellow-400/70 text-sm mb-4">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl text-yellow-400">${item.price.toFixed(2)}</span>
                  <button
                    onClick={() => addToCart(item.id)}
                    className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400 transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isLoggedIn && cart.length > 0 && (
          <div className="fixed bottom-8 right-8 bg-black border-2 border-cyan-500 rounded-lg p-6 shadow-2xl shadow-cyan-500/50">
            <h3 className="text-xl mb-4">Cart ({cart.length} items)</h3>
            <div className="text-2xl text-cyan-400 mb-4">
              Total: ${cart.reduce((sum, id) => {
                const item = items.find(i => i.id === id);
                return sum + (item?.price || 0);
              }, 0).toFixed(2)}
            </div>
            <button
              onClick={checkout}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-magenta-500 text-black rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
            >
              Checkout
            </button>
          </div>
        )}
      </div>

      <div className="mt-8">
        <AdSense slot="marketplace-bottom" />
      </div>
    </div>
  );
}

function AuthModal({ isSignUp, setIsSignUp, onSignUp, onSignIn, onClose }: any) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      onSignUp(formData);
    } else {
      onSignIn(formData.email, formData.password);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black border-2 border-yellow-500 rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl text-yellow-400">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h3>
          <button
            onClick={onClose}
            className="text-yellow-400 hover:text-yellow-300"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-yellow-400 mb-2">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 bg-black/50 border border-yellow-500/50 rounded text-white focus:border-yellow-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-yellow-400 mb-2">Password *</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 bg-black/50 border border-yellow-500/50 rounded text-white focus:border-yellow-500 focus:outline-none"
            />
          </div>

          {isSignUp && (
            <>
              <div>
                <label className="block text-yellow-400 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-yellow-500/50 rounded text-white focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-yellow-400 mb-2">Street Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-yellow-500/50 rounded text-white focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-yellow-400 mb-2">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 bg-black/50 border border-yellow-500/50 rounded text-white focus:border-yellow-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-yellow-400 mb-2">State *</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2 bg-black/50 border border-yellow-500/50 rounded text-white focus:border-yellow-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-yellow-400 mb-2">ZIP Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full px-4 py-2 bg-black/50 border border-yellow-500/50 rounded text-white focus:border-yellow-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-yellow-400 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-black/50 border border-yellow-500/50 rounded text-white focus:border-yellow-500 focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full px-6 py-3 bg-yellow-500 text-black rounded hover:bg-yellow-400 transition-all"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}
