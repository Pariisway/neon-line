export function NetworkTroubleshoot() {
  return (
    <div className="mt-6 bg-red-900/50 border-2 border-red-400 rounded-lg p-4">
      <h4 className="text-red-300 font-bold text-lg mb-3">🚨 Voice Chat Blocked by Network</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="bg-red-800/50 p-3 rounded">
          <p className="text-red-200 font-bold mb-2">📱 MOBILE HOTSPOT</p>
          <ul className="text-red-100 space-y-1">
            <li>• Turn on phone mobile data</li>
            <li>• Enable hotspot</li>
            <li>• Connect computer</li>
            <li>• Refresh page</li>
          </ul>
        </div>
        
        <div className="bg-yellow-800/50 p-3 rounded">
          <p className="text-yellow-200 font-bold mb-2">🌐 ALTERNATIVE NETWORKS</p>
          <ul className="text-yellow-100 space-y-1">
            <li>• Coffee shop WiFi</li>
            <li>• Library WiFi</li>
            <li>• Friend's house</li>
            <li>• School/work WiFi</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-3 p-2 bg-blue-900/50 rounded text-center">
        <p className="text-blue-300 text-sm">
          💡 This is a network issue - the code is working perfectly!
        </p>
      </div>
    </div>
  );
}
