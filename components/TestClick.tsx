import { useState } from 'react';

export function TestClick() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div 
        className="bg-red-500 p-8 rounded-lg text-white text-center cursor-pointer"
        onClick={() => {
          console.log('TEST CLICK WORKED!');
          setClickCount(prev => prev + 1);
          alert(`Click worked! Count: ${clickCount + 1}`);
        }}
      >
        <h2 className="text-2xl mb-4">CLICK THIS BOX</h2>
        <p>If this works, clicks are working.</p>
        <p>Clicks: {clickCount}</p>
      </div>
    </div>
  );
}
