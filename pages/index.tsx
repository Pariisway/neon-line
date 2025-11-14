import { ArcadeRoom } from '../components/ArcadeRoom';

export default function Home() {
  return (
    <div>
      {/* Top AdSense Banner */}
      <div className="ad-container text-center py-4 bg-gray-900 border-b-2 border-yellow-400">
        <ins className="adsbygoogle"
          style={{display: 'block'}}
          data-ad-client="ca-pub-3940256099942544"
          data-ad-slot="728x90"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
      </div>

      <ArcadeRoom />
      
      {/* Bottom AdSense Banner */}
      <div className="ad-container text-center py-4 bg-gray-900 border-t-2 border-yellow-400">
        <ins className="adsbygoogle"
          style={{display: 'block'}}
          data-ad-client="ca-pub-3940256099942544"
          data-ad-slot="728x90"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
      </div>
    </div>
  );
}
