import { useEffect, useRef } from 'react';

interface AdSenseBannerProps {
  slot: string;
}

export function AdSenseBanner({ slot }: AdSenseBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && containerRef.current) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        try {
          if (containerRef.current && !containerRef.current.querySelector('ins')) {
            containerRef.current.innerHTML = `
              <ins class="adsbygoogle"
                   style="display:block"
                   data-ad-client="ca-pub-1184595877548269"
                   data-ad-slot="${slot}"
                   data-ad-format="auto"
                   data-full-width-responsive="true"></ins>
              <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
              </script>
            `;
          }
        } catch (error) {
          console.error('AdSense error:', error);
        }
      }, 1000);
    }
  }, [slot]);

  if (process.env.NODE_ENV !== 'production') {
    return (
      <div className="bg-gray-700 text-white p-4 text-center rounded">
        🎯 AdSense Banner ({slot}) - Would show in production
      </div>
    );
  }

  return <div ref={containerRef} />;
}
