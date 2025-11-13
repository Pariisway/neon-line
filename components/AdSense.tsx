import React from 'react';

interface AdSenseProps {
  slot: string;
}

export function AdSense({ slot }: AdSenseProps) {
  return (
    <div className="ad-container my-4">
      <ins className="adsbygoogle"
           style={{display: 'block'}}
           data-ad-client="ca-pub-1184595877548269"
           data-ad-slot={slot}
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  );
}
