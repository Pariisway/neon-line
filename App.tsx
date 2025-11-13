import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 text-white">
      <header className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-4">
          Neon Line
        </h1>
        <p className="text-center text-xl text-blue-200">
          Welcome to your new project
        </p>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-semibold mb-4">Project Ready</h2>
          <p className="mb-4">
            Your React application is successfully deployed! 
            Add your components from the Figma Make project here.
          </p>
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
            <p className="text-green-200">
              ✅ Successfully connected to Netlify!
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
