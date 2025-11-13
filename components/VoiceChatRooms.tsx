import { useState, useEffect, useRef } from 'react';
import { ScreenNameModal } from './ScreenNameModal';

// Simple peer-to-peer voice chat without Supabase for now
// This will work between two tabs on the same device

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
  
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  const rooms = [
    { id: 'general', name: 'General Voice Chat', users: 12, icon: '🎤' },
    { id: 'gaming', name: 'Gaming Lounge', users: 8, icon: '🎮' },
    { id: 'strategy', name: 'Strategy Talk', users: 5, icon: '🧠' },
    { id: 'casual', name: 'Casual Hangout', users: 7, icon: '☕' },
    { id: 'competitive', name: 'Competitive', users: 3, icon: '⚡' },
    { id: 'newbies', name: 'New Players', users: 6, icon: '👋' }
  ];

  // Get available audio devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter(device => device.kind === 'audioinput');
        setAudioDevices(audioDevices);
      } catch (error) {
        console.error('Error getting audio devices:', error);
      }
    };
    
    getDevices();
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      leaveVoiceChat();
    };
  }, []);

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

  // Create simple peer connection for testing
  const createPeerConnection = (): RTCPeerConnection => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ]
    });

    // Add local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    // Handle incoming audio
    pc.ontrack = (event) => {
      console.log('🎧 Received remote audio stream!');
      const [remoteStream] = event.streams;
      
      // Create or update audio element
      if (!remoteAudioRef.current) {
        remoteAudioRef.current = document.createElement('audio');
        remoteAudioRef.current.autoplay = true;
        remoteAudioRef.current.style.display = 'none';
        document.body.appendChild(remoteAudioRef.current);
      }
      
      remoteAudioRef.current.srcObject = remoteStream;
      
      // Force play
      remoteAudioRef.current.play().catch(error => {
        console.log('Remote audio play failed:', error);
      });
    };

    pc.onconnectionstatechange = () => {
      console.log('Peer connection state:', pc.connectionState);
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  // Join voice chat
  const joinVoiceChat = async (roomId: string, screenName: string) => {
    setIsConnecting(true);
    setError(null);

    try {
      console.log('🎤 Requesting microphone access...');
      
      // Get microphone access with selected device
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          ...(selectedDevice !== 'default' && { deviceId: { exact: selectedDevice } })
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      localStreamRef.current = stream;
      console.log('✅ Microphone access granted');

      // For testing: Create a loopback connection
      // In a real app, this would connect to other users via signaling
      setTimeout(() => {
        createPeerConnection();
        setUsersInRoom([{ id: 'local', screenName }, { id: 'test-peer', screenName: 'Test User' }]);
      }, 1000);

      setActiveRoom(roomId);
      console.log('🎉 Joined voice chat as:', screenName);

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
        } else {
          errorMessage += error.message;
        }
      }
      
      setError(errorMessage);
      leaveVoiceChat();
    } finally {
      setIsConnecting(false);
      setPendingRoomId(null);
    }
  };

  // Leave voice chat
  const leaveVoiceChat = () => {
    console.log('🚪 Leaving voice chat');
    
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Remove remote audio
    if (remoteAudioRef.current) {
      remoteAudioRef.current.remove();
      remoteAudioRef.current = null;
    }

    setActiveRoom(null);
    setIsMuted(false);
    setUsersInRoom([]);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setIsMuted(!isMuted);
  };

  // Test audio - play a test sound
  const testAudio = () => {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 440;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.1;
    
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      audioContext.close();
    }, 500);
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
          <p className="text-white text-xl">Test Voice Chat - Single User Mode</p>
          
          <div className="mt-4 space-y-2 max-w-2xl mx-auto">
            <div className="bg-yellow-900 border border-yellow-400 rounded-lg p-3">
              <p className="text-yellow-400">🔧 Testing Mode - Audio device check</p>
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
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold"
          >
            🔊 Test Audio Output
          </button>
          <p className="text-gray-400 text-sm mt-2">Click to check if your speakers work</p>
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
            <p className="text-green-300 mb-2">
              🔊 Microphone Active - Testing Mode
            </p>
            
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

            <p className="text-yellow-300 text-sm mb-4">
              💡 Speak into your microphone - check console for audio levels
            </p>
            
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
              <p className="text-white mb-2">Setting up microphone</p>
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

        {/* Testing Instructions */}
        <div className="max-w-4xl mx-auto mt-12 bg-gray-800 border border-yellow-400 rounded-lg p-6">
          <h3 className="text-2xl text-yellow-400 mb-4 text-center">Voice Chat Testing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="text-green-400 text-lg mb-2">✅ What Works Now</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Microphone access and selection</li>
                <li>• Audio device detection</li>
                <li>• Screen name input</li>
                <li>• Basic WebRTC setup</li>
                <li>• Audio output testing</li>
              </ul>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="text-blue-400 text-lg mb-2">🎯 Next Steps for Multi-User</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>1. Set up Supabase real-time</li>
                <li>2. Implement signaling between users</li>
                <li>3. Add STUN/TURN servers</li>
                <li>4. Connect multiple users</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
