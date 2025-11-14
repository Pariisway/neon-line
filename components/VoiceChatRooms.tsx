import { useState, useEffect, useRef } from 'react';
import { ScreenNameModal } from './ScreenNameModal';

interface User {
  id: string;
  screenName: string;
}

export function VoiceChatRooms() {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usersInRoom, setUsersInRoom] = useState<User[]>([]);
  const [showScreenNameModal, setShowScreenNameModal] = useState(false);
  const [pendingRoomId, setPendingRoomId] = useState<string | null>(null);
  const [localScreenName, setLocalScreenName] = useState('');
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('default');
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>(0);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  const rooms = [
    { id: 'general', name: 'General Voice Chat', users: 12, icon: '🎤' },
    { id: 'gaming', name: 'Gaming Lounge', users: 8, icon: '🎮' },
    { id: 'strategy', name: 'Strategy Talk', users: 5, icon: '🧠' },
    { id: 'casual', name: 'Casual Hangout', users: 7, icon: '☕' },
    { id: 'competitive', name: 'Competitive', users: 3, icon: '⚡' },
    { id: 'newbies', name: 'New Players', users: 6, icon: '👋' }
  ];

  // Add debug message
  const addDebug = (message: string) => {
    console.log(`🔧 ${message}`);
    setDebugLog(prev => [...prev.slice(-10), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Get available audio devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        addDebug('Getting audio devices...');
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter(device => device.kind === 'audioinput');
        setAudioDevices(audioDevices);
        addDebug(`Found ${audioDevices.length} audio devices`);
      } catch (error) {
        console.error('Error getting audio devices:', error);
        addDebug('Error getting audio devices');
      }
    };
    
    getDevices();
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      stopAudioMonitoring();
      leaveVoiceChat();
    };
  }, []);

  // Setup audio monitoring and visualization - FIXED VERSION
  const setupAudioMonitoring = (stream: MediaStream) => {
    try {
      addDebug('Setting up audio monitoring...');
      
      // Check if stream has audio tracks
      if (stream.getAudioTracks().length === 0) {
        addDebug('❌ No audio tracks in stream');
        setError('Microphone has no audio tracks. Try a different microphone.');
        return;
      }

      const audioTrack = stream.getAudioTracks()[0];
      addDebug(`Audio track: ${audioTrack.label}, enabled: ${audioTrack.enabled}, readyState: ${audioTrack.readyState}`);

      // Create audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) {
        addDebug('❌ AudioContext not supported');
        setError('Audio processing not supported in this browser.');
        return;
      }

      audioContextRef.current = new AudioContext();
      
      // Wait for audio context to be ready
      if (audioContextRef.current.state === 'suspended') {
        addDebug('Audio context suspended, waiting for user interaction...');
        // Audio context will resume when user interacts (clicks mute/unmute)
      }

      // Create analyser node
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;
      
      // Connect microphone to analyser
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyser);
      
      addDebug('✅ Audio monitoring setup complete');
      
      // Start monitoring audio levels
      monitorAudioLevels();
      
    } catch (error) {
      console.error('Error setting up audio monitoring:', error);
      addDebug(`❌ Audio monitoring error: ${error}`);
      setError(`Audio processing failed: ${error}`);
    }
  };

  // Monitor audio levels for visualization - FIXED VERSION
  const monitorAudioLevels = () => {
    if (!analyserRef.current) {
      addDebug('❌ No analyser for audio monitoring');
      return;
    }
    
    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let frameCount = 0;
    
    const checkAudio = () => {
      try {
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const level = Math.min(average / 128, 1); // Normalize to 0-1
        
        setAudioLevel(level);
        setIsSpeaking(level > 0.1); // Consider speaking if level > 10%
        
        // Log first few frames and then occasionally
        frameCount++;
        if (frameCount <= 10 || frameCount % 50 === 0) {
          addDebug(`Audio level: ${level.toFixed(3)} (${Math.round(level * 100)}%) - Speaking: ${level > 0.1}`);
        }
        
        animationRef.current = requestAnimationFrame(checkAudio);
      } catch (error) {
        console.error('Error in audio monitoring:', error);
        addDebug(`❌ Audio monitoring loop error: ${error}`);
        stopAudioMonitoring();
      }
    };
    
    animationRef.current = requestAnimationFrame(checkAudio);
    addDebug('✅ Audio level monitoring started');
  };

  // Stop audio monitoring
  const stopAudioMonitoring = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = 0;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setAudioLevel(0);
    setIsSpeaking(false);
    addDebug('Audio monitoring stopped');
  };

  // Handle screen name confirmation
  const handleScreenNameConfirm = (screenName: string) => {
    setLocalScreenName(screenName);
    setShowScreenNameModal(false);
    
    if (pendingRoomId) {
      joinVoiceChat(pendingRoomId, screenName);
    }
  };

  // Start joining process
  const startJoinProcess = (roomId: string) => {
    if (isConnecting || activeRoom) return;
    
    setPendingRoomId(roomId);
    setShowScreenNameModal(true);
  };

  // Create self-test: loop audio back to yourself - FIXED VERSION
  const createSelfTest = (stream: MediaStream) => {
    try {
      addDebug('Setting up self-test audio...');
      
      // Create audio element that plays our own microphone
      if (!remoteAudioRef.current) {
        remoteAudioRef.current = document.createElement('audio');
        remoteAudioRef.current.autoplay = true;
        remoteAudioRef.current.style.display = 'none';
        remoteAudioRef.current.volume = 0.5; // Lower volume to avoid feedback
        document.body.appendChild(remoteAudioRef.current);
        addDebug('Created audio element for self-test');
      }
      
      // Play our own audio back (self-test)
      remoteAudioRef.current.srcObject = stream;
      
      // Handle audio element events
      remoteAudioRef.current.onloadedmetadata = () => {
        addDebug('Self-test audio metadata loaded');
      };
      
      remoteAudioRef.current.onplay = () => {
        addDebug('✅ Self-test audio playing - you should hear yourself');
      };
      
      remoteAudioRef.current.onerror = (e) => {
        addDebug(`❌ Self-test audio error: ${e}`);
      };
      
      addDebug('Self-test setup complete');
      
      // Add a test user to show in the UI
      setUsersInRoom([
        { id: 'local', screenName: localScreenName },
        { id: 'test', screenName: 'Your Voice (Self-Test)' }
      ]);
      
    } catch (error) {
      console.error('Error creating self-test:', error);
      addDebug(`❌ Self-test error: ${error}`);
      setError('Cannot play audio back. Check your speaker settings.');
    }
  };

  // Join voice chat - FIXED VERSION
  const joinVoiceChat = async (roomId: string, screenName: string) => {
    setIsConnecting(true);
    setError(null);
    addDebug(`Starting join process for room: ${roomId}`);

    try {
      addDebug('🎤 Requesting microphone access...');
      
      // Get microphone access with selected device
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          ...(selectedDevice !== 'default' && { deviceId: { exact: selectedDevice } })
        }
      };

      addDebug(`Using constraints: ${JSON.stringify(constraints)}`);
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      localStreamRef.current = stream;
      addDebug('✅ Microphone access granted');
      
      const tracks = stream.getAudioTracks();
      addDebug(`Found ${tracks.length} audio tracks`);
      
      tracks.forEach((track, index) => {
        const settings = track.getSettings();
        addDebug(`Track ${index}: ${track.label} - enabled: ${track.enabled}, muted: ${track.muted}, readyState: ${track.readyState}`);
        addDebug(`Track ${index} settings: ${JSON.stringify(settings)}`);
      });

      // Setup audio monitoring and visualization
      setupAudioMonitoring(stream);
      
      // Create self-test (play audio back to yourself)
      createSelfTest(stream);

      setActiveRoom(roomId);
      addDebug(`🎉 Joined voice chat as: ${screenName}`);

    } catch (error) {
      console.error('❌ Error joining voice chat:', error);
      let errorMessage = 'Failed to join voice chat. ';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = '🎤 Microphone permission denied. Please allow microphone access in your browser settings.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = '🔍 No microphone found. Please check your audio devices.';
        } else if (error.name === 'NotSupportedError') {
          errorMessage = '🌐 WebRTC not supported in your browser.';
        } else if (error.name === 'OverconstrainedError') {
          errorMessage = '⚙️ Cannot use selected microphone. Try a different device.';
        } else {
          errorMessage += error.message;
        }
      }
      
      setError(errorMessage);
      addDebug(`❌ Join error: ${errorMessage}`);
      leaveVoiceChat();
    } finally {
      setIsConnecting(false);
      setPendingRoomId(null);
    }
  };

  // Leave voice chat
  const leaveVoiceChat = () => {
    addDebug('🚪 Leaving voice chat');
    
    // Stop audio monitoring
    stopAudioMonitoring();
    
    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        addDebug(`Stopping track: ${track.label}`);
        track.stop();
      });
      localStreamRef.current = null;
    }

    // Remove remote audio
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
      remoteAudioRef.current.remove();
      remoteAudioRef.current = null;
      addDebug('Removed self-test audio');
    }

    setActiveRoom(null);
    setIsMuted(false);
    setUsersInRoom([]);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const tracks = localStreamRef.current.getAudioTracks();
      tracks.forEach(track => {
        track.enabled = !track.enabled;
        addDebug(`Track ${track.label} muted: ${!track.enabled}`);
      });
    }
    setIsMuted(!isMuted);
    addDebug(`Microphone ${!isMuted ? 'muted' : 'unmuted'}`);
  };

  // Test audio - play a test sound
  const testAudio = () => {
    try {
      addDebug('Playing test tone...');
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 440;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      addDebug('🔊 Playing test tone (440Hz)');
      
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
        addDebug('🔇 Test tone stopped');
      }, 1000);
    } catch (error) {
      console.error('Error playing test tone:', error);
      addDebug(`❌ Test tone error: ${error}`);
      setError('Cannot play test audio. Check speaker settings.');
    }
  };

  // Audio level bar color based on level
  const getAudioBarColor = () => {
    if (audioLevel > 0.7) return 'bg-red-500';
    if (audioLevel > 0.4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Clear debug log
  const clearDebugLog = () => {
    setDebugLog([]);
  };

  return (
    <div className="main-content voice-chat-container">
      <div className="container">
        <ScreenNameModal 
          isOpen={showScreenNameModal}
          onConfirm={handleScreenNameConfirm}
          defaultName={localScreenName}
        />

        <div className="text-center mb-8">
          <h2 className="text-4xl text-yellow-400 mb-4">VOICE CHAT ROOMS</h2>
          <p className="text-white text-xl">Audio Debug Version</p>
          
          <div className="mt-4 space-y-2 max-w-2xl mx-auto">
            <div className="bg-yellow-900 border border-yellow-400 rounded-lg p-3">
              <p className="text-yellow-400">🔧 DEBUG MODE - Check logs below for audio issues</p>
            </div>
          </div>
        </div>

        {/* Audio Device Selection */}
        {audioDevices.length > 0 && (
          <div className="max-w-md mx-auto mb-6 bg-gray-800 border border-blue-400 rounded-lg p-4">
            <label className="text-blue-400 block mb-2">🎤 Select Microphone:</label>
            <select 
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-blue-400 rounded text-white"
            >
              <option value="default">Default Microphone</option>
              {audioDevices.map(device => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Microphone ${audioDevices.indexOf(device) + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Test Audio Button */}
        <div className="text-center mb-6">
          <button 
            onClick={testAudio}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold mb-2"
          >
            🔊 Test Audio Output
          </button>
          <p className="text-gray-400 text-sm">Click to check if your speakers work (should hear beep)</p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 bg-red-900 border-2 border-red-400 rounded-lg p-4">
            <p className="text-red-300 text-center">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded mx-auto block"
            >
              Dismiss
            </button>
          </div>
        )}

        {activeRoom && (
          <div className="max-w-2xl mx-auto mb-8 bg-green-900 border-4 border-green-400 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🎧</div>
            <h3 className="text-2xl text-white font-bold mb-2">
              {rooms.find(r => r.id === activeRoom)?.name}
            </h3>
            
            {/* Audio Level Visualization */}
            <div className="mb-4">
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className={`text-lg font-bold ${isSpeaking ? 'text-green-400' : 'text-gray-400'}`}>
                  {isSpeaking ? '🎤 SPEAKING' : '🔇 SILENT'}
                </div>
                <div className="w-32 bg-gray-700 rounded-full h-4">
                  <div 
                    className={`h-4 rounded-full transition-all ${getAudioBarColor()}`}
                    style={{ width: `${audioLevel * 100}%` }}
                  ></div>
                </div>
                <div className="text-blue-400 text-sm font-mono">
                  {Math.round(audioLevel * 100)}%
                </div>
              </div>
              <p className="text-yellow-300 text-sm">
                💡 Speak into microphone - bar should move | Self-test: You should hear yourself
              </p>
            </div>
            
            {/* Users in Room */}
            <div className="mb-4">
              <p className="text-blue-300 text-sm mb-2">
                👥 Users in room:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {usersInRoom.map(user => (
                  <span key={user.id} className="bg-blue-600 px-2 py-1 rounded text-xs">
                    {user.screenName}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
              <button 
                onClick={toggleMute}
                className={`px-6 py-3 rounded-lg font-bold text-lg ${
                  isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'
                } text-white`}
              >
                {isMuted ? '🔇 MUTED' : '🔊 SPEAKING'}
              </button>
              <button 
                onClick={leaveVoiceChat}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg"
              >
                🚪 LEAVE CHAT
              </button>
            </div>
          </div>
        )}

        {isConnecting && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 border-4 border-yellow-400 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">🎤</div>
              <h3 className="text-2xl text-yellow-400 mb-4">Joining Voice Chat...</h3>
              <p className="text-white mb-2">Setting up microphone and audio monitoring</p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
            </div>
          </div>
        )}

        <div className="rooms-grid" style={{ zIndex: 1000 }}>
          {rooms.map(room => (
            <div 
              key={room.id}
              className={`room-card clickable ${activeRoom === room.id ? 'active' : ''}`}
              style={{ 
                cursor: (activeRoom || isConnecting) ? 'default' : 'pointer',
                opacity: (activeRoom && activeRoom !== room.id) || isConnecting ? 0.6 : 1
              }}
              onClick={() => {
                if (!activeRoom && !isConnecting) {
                  startJoinProcess(room.id);
                }
              }}
            >
              <div className="text-4xl mb-4">🎤</div>
              <h3 className="text-2xl text-white font-bold mb-2">{room.name}</h3>
              <div className="text-green-400 mb-4">👥 {room.users} online</div>

              <button 
                className={`w-full py-3 rounded font-bold text-lg ${
                  activeRoom === room.id 
                    ? 'bg-green-600 text-white' 
                    : (activeRoom || isConnecting) 
                      ? 'bg-gray-600 text-gray-400' 
                      : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }`}
                style={{ zIndex: 1002 }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!activeRoom && !isConnecting) {
                    startJoinProcess(room.id);
                  }
                }}
              >
                {activeRoom === room.id 
                  ? '✅ IN CHAT' 
                  : isConnecting 
                    ? '🔄 JOINING...' 
                    : activeRoom 
                      ? 'IN ANOTHER ROOM' 
                      : 'JOIN CHAT'
                }
              </button>
            </div>
          ))}
        </div>

        {/* Debug Log */}
        <div className="max-w-4xl mx-auto mt-12 bg-gray-800 border border-yellow-400 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl text-yellow-400">🔧 Debug Log</h3>
            <button 
              onClick={clearDebugLog}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
            >
              Clear Log
            </button>
          </div>
          <div className="bg-black p-4 rounded h-48 overflow-y-auto font-mono text-sm">
            {debugLog.length === 0 ? (
              <p className="text-gray-500">No debug messages yet. Join a room to see audio diagnostics.</p>
            ) : (
              debugLog.map((log, index) => (
                <div key={index} className="text-green-400 border-b border-gray-700 py-1">
                  {log}
                </div>
              ))
            )}
          </div>
          
          {/* Current Status */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-700 p-2 rounded">
              <div className="text-gray-400">Audio Level</div>
              <div className="text-white font-mono">{Math.round(audioLevel * 100)}%</div>
            </div>
            <div className="bg-gray-700 p-2 rounded">
              <div className="text-gray-400">Speaking</div>
              <div className={isSpeaking ? 'text-green-400' : 'text-red-400'}>
                {isSpeaking ? 'YES' : 'NO'}
              </div>
            </div>
            <div className="bg-gray-700 p-2 rounded">
              <div className="text-gray-400">Microphone</div>
              <div className={localStreamRef.current ? 'text-green-400' : 'text-red-400'}>
                {localStreamRef.current ? 'CONNECTED' : 'DISCONNECTED'}
              </div>
            </div>
            <div className="bg-gray-700 p-2 rounded">
              <div className="text-gray-400">Room</div>
              <div className="text-white">{activeRoom || 'None'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
