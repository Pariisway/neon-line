const WebSocket = require('ws');

function startServer(port = 8081) {
  const wss = new WebSocket.Server({ port }, (error) => {
    if (error) {
      if (error.code === 'EADDRINUSE') {
        console.log(`❌ Port ${port} is busy, trying ${port + 1}...`);
        startServer(port + 1);
        return;
      }
      console.error('❌ Server error:', error);
      process.exit(1);
    }
    
    console.log(`🎧 Voice Chat Signaling Server started on port ${port}`);
    console.log('✅ Ready for real voice connections');
    console.log(`🔗 Frontend should connect to: ws://localhost:${port}`);
  });

  // REAL room tracking - no fake data
  const rooms = new Map();
  const users = new Map();

  wss.on('connection', (ws) => {
    console.log('🔌 New client connected');
    
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        console.log('📨 Message:', message.type, 'from:', message.userId);
        
        switch (message.type) {
          case 'join-room':
            handleJoinRoom(ws, message);
            break;
            
          case 'offer':
          case 'answer':
          case 'ice-candidate':
            forwardToUser(message.target, message);
            break;
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('🔌 Client disconnected');
      handleUserDisconnect(ws);
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  function handleJoinRoom(ws, message) {
    const { roomId, userId, screenName } = message;
    
    // Store user info
    users.set(userId, { ws, roomId, screenName });
    ws.userId = userId;
    
    // Add to room
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(userId);
    
    console.log(`👤 ${screenName} (${userId}) joined room ${roomId}`);
    console.log(`📊 Room ${roomId} now has ${rooms.get(roomId).size} users`);
    
    // Notify all users in room about new user
    broadcastToRoom(roomId, {
      type: 'user-joined',
      userId: userId,
      screenName: screenName
    }, userId);
    
    // Send current room users to the new user
    const roomUsers = Array.from(rooms.get(roomId) || [])
      .filter(id => id !== userId)
      .map(id => {
        const user = users.get(id);
        return user ? { id, screenName: user.screenName } : null;
      })
      .filter(Boolean);
    
    ws.send(JSON.stringify({
      type: 'room-users',
      roomId: roomId,
      users: roomUsers
    }));
    
    // Update room stats for everyone
    broadcastRoomStats();
  }

  function handleUserDisconnect(ws) {
    if (!ws.userId) return;
    
    const user = users.get(ws.userId);
    if (user) {
      const { roomId } = user;
      
      // Remove from room
      if (roomId && rooms.has(roomId)) {
        rooms.get(roomId).delete(ws.userId);
        console.log(`👤 User ${ws.userId} left room ${roomId}`);
        console.log(`📊 Room ${roomId} now has ${rooms.get(roomId).size} users`);
        
        if (rooms.get(roomId).size === 0) {
          rooms.delete(roomId);
          console.log(`🗑️  Room ${roomId} deleted (empty)`);
        }
      }
      
      // Remove user
      users.delete(ws.userId);
      
      // Notify room
      if (roomId) {
        broadcastToRoom(roomId, {
          type: 'user-left',
          userId: ws.userId
        });
        broadcastRoomStats();
      }
    }
  }

  function forwardToUser(targetUserId, message) {
    const targetUser = users.get(targetUserId);
    if (targetUser && targetUser.ws.readyState === WebSocket.OPEN) {
      targetUser.ws.send(JSON.stringify(message));
    }
  }

  function broadcastToRoom(roomId, message, excludeUserId = null) {
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      console.log(`📢 Broadcasting to room ${roomId} (${room.size} users)`);
      
      room.forEach(userId => {
        if (userId !== excludeUserId) {
          const user = users.get(userId);
          if (user && user.ws.readyState === WebSocket.OPEN) {
            user.ws.send(JSON.stringify(message));
          }
        }
      });
    }
  }

  function broadcastRoomStats() {
    const stats = {};
    rooms.forEach((userIds, roomId) => {
      stats[roomId] = userIds.size;
    });
    
    console.log('📊 Room stats:', stats);
    
    // Broadcast to all connected clients
    users.forEach((user) => {
      if (user.ws.readyState === WebSocket.OPEN) {
        user.ws.send(JSON.stringify({
          type: 'room-stats',
          stats: stats
        }));
      }
    });
  }

  // Clean up dead connections periodically
  setInterval(() => {
    let cleaned = 0;
    users.forEach((user, userId) => {
      if (user.ws.readyState === WebSocket.CLOSED) {
        handleUserDisconnect(user.ws);
        cleaned++;
      }
    });
    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} dead connections`);
    }
  }, 30000);

  return wss;
}

// Start the server
const server = startServer(8081);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\\n🛑 Shutting down server gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
