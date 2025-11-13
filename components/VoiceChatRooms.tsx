import { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ScreenNameModal } from './ScreenNameModal';

interface Room {
  id: string;
  name: string;
  user_count: number;
  is_active: boolean;
}

interface PeerConnection {
  pc: RTCPeerConnection;
  userId: string;
  screenName: string;
}

interface User {
  id: string;
  screenName: string;
}

export function VoiceChatRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usersInRoom, setUsersInRoom] = useState<User[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [showScreenNameModal, setShowScreenNameModal] = useState(false);
  const [pendingRoomId, setPendingRoomId] = useState<string | null>(null);
  const [localScreenName, setLocalScreenName] = useState('');
  
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Map<string, PeerConnection>>(new Map());
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const localUserIdRef = useRef<string>(Math.random().toString(36).substr(2, 9));
  const channelRef = useRef<any>(null);

  // WebRTC Configuration
  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ]
  };

  // Load default rooms
  useEffect(() => {
    const defaultRooms: Room[] = [
      { id: 'general', name: 'General Voice Chat', users: 12, is_active: true },
      { id: 'gaming', name: 'Gaming Lounge', users: 8, is_active: true },
      { id: 'strategy', name: 'Strategy Talk', users: 5, is_active: true },
      { id: 'casual', name: 'Casual Hangout', users: 7, is_active: true },
      { id: 'competitive', name: 'Competitive', users: 3, is_active: true },
      { id: 'newbies', name: 'New Players', users: 6, is_active: true }
    ];
    setRooms(defaultRooms);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      leaveVoiceChat();
    };
  }, []);

  // Initialize WebRTC Peer Connection
  const createPeerConnection = (userId: string, screenName: string): RTCPeerConnection => {
    const pc = new RTCPeerConnection(rtcConfig);

    // Add local stream to connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    // Handle incoming remote stream - FIXED AUDIO HANDLING
    pc.ontrack = (event) => {
      console.log('🎧 Received remote audio stream from:', userId, screenName);
      const [remoteStream] = event.streams;
      
      // Create and manage audio element properly
      let audioElement = audioElementsRef.current.get(userId);
      if (!audioElement) {
        audioElement = document.createElement('audio');
        audioElement.autoplay = true;
        audioElement.setAttribute('data-user-id', userId);
        audioElement.style.display = 'none';
        document.body.appendChild(audioElement);
        audioElementsRef.current.set(userId, audioElement);
      }
      
      // Set the stream and ensure it plays
      audioElement.srcObject = remoteStream;
      
      // Force play in case of autoplay restrictions
      audioElement.play().catch(error => {
        console.log('Audio play failed, trying with user gesture:', error);
      });
      
      console.log('🔊 Audio element created for:', screenName);
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'webrtc-signal',
          payload: {
            type: 'ice-candidate',
            candidate: event.candidate,
            targetUserId: userId,
            senderId: localUserIdRef.current,
            senderName: localScreenName,
            roomId: activeRoom
          }
        });
      }
    };

    // Track connection state
    pc.onconnectionstatechange = () => {
      console.log('Connection state with', screenName, ':', pc.connectionState);
    };

    peerConnectionsRef.current.set(userId, { pc, userId, screenName });
    return pc;
  };

  // Setup PUBLIC signaling channel
  const setupSignaling = async (roomId: string) => {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured - running in local test mode');
      setConnectionStatus('connected');
      return;
    }

    try {
      console.log('🔗 Setting up public signaling channel for room:', roomId);
      
      const channel = supabase.channel(`voice-room-${roomId}`);
      
      // Handle incoming WebRTC signals
      channel.on('broadcast', { event: 'webrtc-signal' }, ({ payload }) => {
        console.log('📨 Received signal:', payload.type, 'from:', payload.senderName);
        handleSignalingMessage(payload);
      });

      // Subscribe to channel
      channel.subscribe((status) => {
        console.log('Channel subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Connected to public voice chat channel');
          channelRef.current = channel;
          setConnectionStatus('connected');
          
          // Announce our presence
          channel.send({
            type: 'broadcast',
            event: 'webrtc-signal',
            payload: {
              type: 'user-joined',
              userId: localUserIdRef.current,
              screenName: localScreenName,
              roomId: roomId,
              timestamp: Date.now()
            }
          });
        }
      });

    } catch (error) {
      console.error('Error setting up signaling:', error);
      setError('Failed to connect to voice chat');
      leaveVoiceChat();
    }
  };

  // Handle incoming signaling messages
  const handleSignalingMessage = async (message: any) => {
    if (message.senderId === localUserIdRef.current) return;

    try {
      switch (message.type) {
        case 'user-joined':
          console.log('👤 User joined room:', message.screenName);
          const newUser = { id: message.userId, screenName: message.screenName };
          setUsersInRoom(prev => {
            const exists = prev.find(u => u.id === message.userId);
            return exists ? prev : [...prev, newUser];
          });
          // Create offer to establish connection
          setTimeout(() => createOffer(message.userId, message.screenName), 1000);
          break;

        case 'offer':
          await handleOffer(message.offer, message.senderId, message.senderName);
          break;

        case 'answer':
          await handleAnswer(message.answer, message.senderId, message.senderName);
          break;

        case 'ice-candidate':
          await handleIceCandidate(message.candidate, message.senderId, message.senderName);
          break;

        case 'user-left':
          console.log('👤 User left:', message.screenName);
          setUsersInRoom(prev => prev.filter(user => user.id !== message.userId));
          closePeerConnection(message.userId);
          break;
      }
    } catch (error) {
      console.error('Error handling signal:', error);
    }
  };

  // Close peer connection and cleanup audio
  const closePeerConnection = (userId: string) => {
    const peerData = peerConnectionsRef.current.get(userId);
    if (peerData) {
      peerData.pc.close();
      peerConnectionsRef.current.delete(userId);
    }

    // Remove audio element
    const audioElement = audioElementsRef.current.get(userId);
    if (audioElement) {
      audioElement.remove();
      audioElementsRef.current.delete(userId);
    }
  };

  // Create WebRTC offer
  const createOffer = async (targetUserId: string, targetScreenName: string) => {
    if (peerConnectionsRef.current.has(targetUserId)) {
      console.log('Already connected to:', targetScreenName);
      return;
    }

    console.log('Creating WebRTC offer for:', targetScreenName);
    const pc = createPeerConnection(targetUserId, targetScreenName);
    
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'webrtc-signal',
          payload: {
            type: 'offer',
            offer: offer,
            targetUserId: targetUserId,
            senderId: localUserIdRef.current,
            senderName: localScreenName,
            roomId: activeRoom
          }
        });
        console.log('📤 Offer sent to:', targetScreenName);
      }
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  // Handle incoming offer
  const handleOffer = async (offer: RTCSessionDescriptionInit, senderId: string, senderName: string) => {
    console.log('📥 Handling offer from:', senderName);
    
    if (peerConnectionsRef.current.has(senderId)) {
      console.log('Already processing offer from:', senderName);
      return;
    }

    const pc = createPeerConnection(senderId, senderName);
    
    try {
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'webrtc-signal',
          payload: {
            type: 'answer',
            answer: answer,
            targetUserId: senderId,
            senderId: localUserIdRef.current,
            senderName: localScreenName,
            roomId: activeRoom
          }
        });
        console.log('📤 Answer sent to:', senderName);
      }
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  // Handle incoming answer
  const handleAnswer = async (answer: RTCSessionDescriptionInit, senderId: string, senderName: string) => {
    console.log('📥 Handling answer from:', senderName);
    const peerData = peerConnectionsRef.current.get(senderId);
    if (peerData) {
      try {
        await peerData.pc.setRemoteDescription(answer);
        console.log('✅ WebRTC connection established with:', senderName);
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    }
  };

  // Handle ICE candidate
  const handleIceCandidate = async (candidate: RTCIceCandidateInit, senderId: string, senderName: string) => {
    const peerData = peerConnectionsRef.current.get(senderId);
    if (peerData) {
      try {
        await peerData.pc.addIceCandidate(candidate);
        console.log('✅ ICE candidate added for:', senderName);
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    }
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

  // Join voice chat room
  const joinVoiceChat = async (roomId: string, screenName: string) => {
    setIsConnecting(true);
    setConnectionStatus('connecting');
    setError(null);

    try {
      // 1. Get microphone access
      console.log('🎤 Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1
        } 
      });
      
      localStreamRef.current = stream;
      console.log('✅ Microphone access granted');

      // 2. Setup PUBLIC signaling
      await setupSignaling(roomId);

      // 3. Set active room and add ourselves to users list
      setActiveRoom(roomId);
      setUsersInRoom([{ id: localUserIdRef.current, screenName }]);

      console.log('🎉 Successfully joined public voice chat as:', screenName);

    } catch (error) {
      console.error('❌ Error joining voice chat:', error);
      let errorMessage = 'Failed to join voice chat. ';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = '🎤 Microphone permission denied. Please allow microphone access.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = '🔍 No microphone found. Please check your audio devices.';
        } else {
          errorMessage += error.message;
        }
      }
      
      setError(errorMessage);
      setConnectionStatus('disconnected');
      leaveVoiceChat();
    } finally {
      setIsConnecting(false);
      setPendingRoomId(null);
    }
  };

  // Leave voice chat
  const leaveVoiceChat = () => {
    console.log('🚪 Leaving voice chat room');
    
    // Notify others that we're leaving
    if (channelRef.current && activeRoom) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'webrtc-signal',
        payload: {
          type: 'user-left',
          userId: localUserIdRef.current,
          screenName: localScreenName,
          roomId: activeRoom,
          timestamp: Date.now()
        }
      });
    }

    // Close all peer connections and cleanup audio
    peerConnectionsRef.current.forEach(({ pc }, userId) => {
      pc.close();
      closePeerConnection(userId);
    });
    peerConnectionsRef.current.clear();

    // Clear all audio elements
    audioElementsRef.current.forEach((audioElement) => {
      audioElement.remove();
    });
    audioElementsRef.current.clear();

    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Leave signaling channel
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    setActiveRoom(null);
    setIsMuted(false);
    setUsersInRoom([]);
    setConnectionStatus('disconnected');
    setLocalScreenName('');
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setIsMuted(!isMuted);
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
          <p className="text-white text-xl">Open Public Chat - No Login Required!</p>
          
          {/* Status Indicators */}
          <div className="mt-4 space-y-2 max-w-2xl mx-auto">
            <div className="bg-green-900 border border-green-400 rounded-lg p-3">
              <p className="text-green-400">✅ Public Voice Chat - Anyone Can Join!</p>
            </div>
            <div className="bg-blue-900 border border-blue-400 rounded-lg p-2">
              <p className="text-blue-400">
                {localScreenName && `👤 ${localScreenName} | `}
                Status: {connectionStatus === 'connected' ? '✅ Connected' : 
                       connectionStatus === 'connecting' ? '🔄 Connecting...' : '🔴 Disconnected'}
              </p>
            </div>
          </div>
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
              🔊 You are in public voice chat!
            </p>
            
            {/* Users in Room */}
            <div className="mb-4">
              <p className="text-blue-300 text-sm mb-2">
                👥 {usersInRoom.length} users in room:
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
              <p className="text-white mb-2">Setting up public chat room</p>
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
                zIndex: 1001,
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

        {/* Debug Info */}
        <div className="max-w-4xl mx-auto mt-12 bg-gray-800 border border-yellow-400 rounded-lg p-6">
          <h3 className="text-2xl text-yellow-400 mb-4 text-center">Voice Chat Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="text-green-400 text-lg mb-2">✅ Audio Debug</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Check browser console for connection logs</li>
                <li>• Ensure microphone permissions are granted</li>
                <li>• Audio elements created for each user</li>
                <li>• WebRTC connections established</li>
              </ul>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="text-blue-400 text-lg mb-2">🎯 Testing Tips</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>1. Open two browser tabs</li>
                <li>2. Use different screen names</li>
                <li>3. Join same room in both</li>
                <li>4. Check console for "Audio element created"</li>
                <li>5. Speak - you should hear in other tab!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
