import { useEffect, useRef } from 'react';

interface AdSenseBannerProps {
  slot: string;
  format?: string;
  responsive?: boolean;
}

export function AdSenseBanner({ slot, format = 'auto', responsive = true }: AdSenseBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Wait for the ad container to be in DOM
    if (adRef.current && (window as any).adsbygoogle) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (error) {
        console.log('AdSense load error:', error);
      }
    }
  }, []);

  return (
    <div ref={adRef} className="ad-container">
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3940256099942544"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      ></ins>
    </div>
  );
}
