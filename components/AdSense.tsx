export function AdSense({ slot = "header" }: { slot?: string }) {
  return (
    <div className="w-full bg-black/30 border border-cyan-500/30 p-4 flex items-center justify-center backdrop-blur-sm">
      <div className="text-cyan-400/50 text-center">
        <div className="text-xs">Advertisement</div>
        <div className="text-xs mt-1">Google AdSense Slot: {slot}</div>
        <div className="text-[10px] mt-1 text-cyan-400/30">
          Insert your AdSense code here (ca-pub-XXXXXXX)
        </div>
      </div>
    </div>
  );
}
