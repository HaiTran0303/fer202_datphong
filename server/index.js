import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules - Test comment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:5173', // Updated to Vite's default client origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'] // Allow more methods for API
}));

// Middleware to parse JSON bodies
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Updated to Vite's default client origin
    methods: ['GET', 'POST']
  }
});

const SOCKET_PORT = process.env.SOCKET_PORT || 3002;
const API_PORT = process.env.API_PORT || 3001; // For API endpoints

const DB_PATH = path.join(__dirname, '../db.json');

// Helper function to read db.json
const readDb = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading db.json:', error);
    return { posts: [], users: [], connections: [], messages: [], notifications: [], settings: [], blogs: [], constants: {} };
  }
};

// Helper function to write to db.json
const writeDb = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to db.json:', error);
  }
};

const usersMap = new Map(); // userId -> socketId mapping

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('registerUser', (userId) => {
    console.log(`User ${userId} registered with socket ${socket.id}`);
    socket.userId = userId; // Store userId directly on the socket object
    usersMap.set(userId, socket.id); // Store in map
  });

  socket.on('joinRoom', (roomName) => {
    socket.join(roomName);
    console.log(`User ${socket.id} joined room: ${roomName}`);
  });

  socket.on('leaveRoom', (roomName) => {
    socket.leave(roomName);
    console.log(`User ${socket.id} left room: ${roomName}`);
  });

  socket.on('sendMessage', (data) => {
    const db = readDb(); // Read db here as we need to write to it
    const { conversationId, message, senderId, time } = data; // Destructure all data sent from client
    const newMessage = {
      id: Date.now().toString(),
      conversationId: conversationId,
      senderId: senderId,
      content: message,
      timestamp: time || new Date().toLocaleTimeString(), // Use provided time or generate
    };
    db.messages.push(newMessage); // Store messages in db.json
    writeDb(db); // Write to db.json
    // Emit message to all clients in the conversation room, including the sender
    io.to(conversationId).emit('receiveMessage', newMessage); 
  });

  socket.on('sendConnectionRequest', (data) => {
    const db = readDb();
    const { senderId, receiverId, postId, message } = data;

    // Basic validation
    if (!senderId || !receiverId || !postId) {
      socket.emit('connectionRequestFailed', 'Missing required fields.');
      return;
    }

    // Check if a connection request already exists or if they are already connected
    const existingConnection = db.connections.find(
      conn => (conn.senderId === senderId && conn.receiverId === receiverId && conn.postId === postId) ||
              (conn.senderId === receiverId && conn.receiverId === senderId && conn.postId === postId && conn.status === 'accepted')
    );

    if (existingConnection) {
      socket.emit('connectionRequestFailed', 'Yêu cầu kết nối đã tồn tại hoặc đã được kết nối.');
      return;
    }

    // Check rejection count if sender has been rejected 3 times for this post
    const rejectionCount = db.connections.filter(
      conn => conn.senderId === senderId && conn.receiverId === receiverId && conn.postId === postId && conn.status === 'rejected'
    ).length;

    if (rejectionCount >= 3) {
      socket.emit('connectionRequestFailed', 'Bạn đã bị từ chối 3 lần cho bài đăng này và không thể gửi thêm yêu cầu.');
      return;
    }

    const newConnection = {
      id: Date.now().toString(), // Simple unique ID
      senderId: senderId, // Ensure senderId is explicitly set
      receiverId: receiverId, // Ensure receiverId is explicitly set
      postId,
      message,
      status: 'pending', // pending, accepted, rejected
      createdAt: new Date().toISOString(),
      rejectionCount: 0 // Initialize rejection count for new requests
    };
    console.log('Server: newConnection object being saved:', newConnection); // NEW LOG

    db.connections.push(newConnection);
    console.log('Server: Before writing db.json (connections post):', db.connections); // NEW LOG
    writeDb(db);
    console.log('Server: After writing db.json (connections post).'); // NEW LOG

    // Notify receiver
    const receiverSocketId = usersMap.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newConnectionRequest', newConnection);
    }
    
    socket.emit('connectionRequestSent', newConnection);

    // Create a notification for the receiver
    const senderUser = db.users.find(u => u.id === senderId);
    console.log('Sender User for Notification:', senderUser); // Add this line for debugging
    const notification = {
      id: Date.now().toString() + '-notify',
      userId: receiverId,
      type: 'connection_request',
      message: `${senderUser?.fullName || 'Người dùng'} đã gửi lời mời kết nối`,
      isRead: false,
      createdAt: new Date().toISOString(),
      relatedEntity: {
        type: 'connection',
        id: newConnection.id
      },
      fromUser: { // Include sender's info directly
        id: senderUser?.id,
        fullName: senderUser?.fullName,
        avatar: senderUser?.avatar // Assuming avatar is available on user object
      }
    };
    db.notifications.push(notification);
    writeDb(db);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newNotification', notification); // Emit notification to receiver
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    // Remove user from map on disconnect
    if (socket.userId) {
      usersMap.delete(socket.userId);
    }
  });
});

// Generic API Endpoints for all resources in db.json
app.get('/:resourceName', (req, res) => {
  const db = readDb();
  const resourceName = req.params.resourceName;
  let data = db[resourceName];

  if (!data) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  // Handle filtering by userId for notifications and connections
  if (req.query.userId && (resourceName === 'notifications' || resourceName === 'connections')) {
    data = data.filter(item => item.userId === req.query.userId || item.receiverId === req.query.userId || item.senderId === req.query.userId);
  }

  // Handle sorting
  if (req.query._sort && req.query._order) {
    const sortBy = req.query._sort;
    const orderBy = req.query._order.toLowerCase(); // 'asc' or 'desc'
    data.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return orderBy === 'asc' ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return orderBy === 'asc' ? 1 : -1;
      return 0;
    });
  }

  res.json(data);
});

// Generic API Endpoint for single resource by ID
app.get('/:resourceName/:id', (req, res) => {
  const db = readDb();
  const resourceName = req.params.resourceName;
  const id = req.params.id;
  const data = db[resourceName];

  if (!data) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  const item = data.find(item => item.id === id);

  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// New API endpoint to get messages by conversationId
app.get('/messages/:conversationId', (req, res) => {
  const db = readDb();
  const conversationId = req.params.conversationId;
  console.log(`Fetching messages for conversationId: ${conversationId}`); // Add this log
  const messages = db.messages.filter(msg => msg.conversationId === conversationId);
  console.log(`Found ${messages.length} messages for conversationId: ${conversationId}`); // Add this log
  res.json(messages);
});

// Specific API Endpoints (keep existing ones for POST/PUT/DELETE if they do more than generic)
// connections POST and PUT are already specific, so they will override the generic ones for those methods.
// messages GET is now handled by generic GET.
// connections GET is now handled by generic GET.

app.post('/connections', (req, res) => {
  const db = readDb();
  const { senderId, receiverId, postId, message } = req.body;

  if (!senderId || !receiverId || !postId) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  // Check if a connection request already exists or if they are already connected
  const existingConnection = db.connections.find(
    conn => (conn.senderId === senderId && conn.receiverId === receiverId && conn.postId === postId) ||
            (conn.senderId === receiverId && conn.receiverId === senderId && conn.postId === postId && conn.status === 'accepted')
  );

  if (existingConnection) {
    return res.status(409).json({ message: 'Yêu cầu kết nối đã tồn tại hoặc đã được kết nối.' });
  }

  // Check rejection count if sender has been rejected 3 times for this post
  const rejectionCount = db.connections.filter(
    conn => conn.senderId === senderId && conn.receiverId === receiverId && conn.postId === postId && conn.status === 'rejected'
  ).length;

  if (rejectionCount >= 3) {
    return res.status(403).json({ message: 'Bạn đã bị từ chối 3 lần cho bài đăng này và không thể gửi thêm yêu cầu.' });
  }

  const newConnection = {
    id: Date.now().toString(),
    senderId,
    receiverId,
    postId,
    message,
    status: 'pending',
    createdAt: new Date().toISOString(),
    rejectionCount: 0
  };

  db.connections.push(newConnection);
  writeDb(db);

  // Notify receiver (if connected via socket) - this part is handled by socket event above, but good to have API for consistency
  const senderUser = db.users.find(u => u.id === senderId);
  const notification = {
    id: Date.now().toString() + '-notify',
    userId: receiverId,
    type: 'connection_request',
    message: `${senderUser?.fullName || 'Người dùng'} đã gửi lời mời kết nối`,
    isRead: false,
    createdAt: new Date().toISOString(),
    relatedEntity: {
      type: 'connection',
      id: newConnection.id
    }
  };
  db.notifications.push(notification);
  writeDb(db);
  const receiverSocketId = usersMap.get(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit('newNotification', notification);
  }

  res.status(201).json(newConnection);
});

app.put('/connections/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const { status } = req.body; // 'accepted' or 'rejected'
  console.log(`Server: PUT /connections/${id} received with status: ${status}`); // NEW LOG

  const connectionIndex = db.connections.findIndex(conn => conn.id === id);
  console.log(`Server: connectionIndex for ID ${id}: ${connectionIndex}`); // NEW LOG

  if (connectionIndex === -1) {
    console.log(`Server: Connection with ID ${id} not found.`); // NEW LOG
    return res.status(404).json({ message: 'Connection request not found.' });
  }

  const connection = db.connections[connectionIndex];

  if (status === 'accepted') {
    connection.status = 'accepted';

    // Create the first message from the connection request message
    const firstMessage = {
      id: Date.now().toString() + '-first-msg',
      conversationId: connection.id,
      senderId: connection.senderId, // The sender of the connection request is the author of the first message
      content: connection.message, // The message from the connection request
      timestamp: new Date().toISOString(),
    };
    db.messages.push(firstMessage); // Save the first message to db.json

    const receiverUser = db.users.find(u => u.id === connection.receiverId); // Get receiver user details
    const notification = {
      id: Date.now().toString() + '-notify-accept',
      userId: connection.senderId, // Notification for the sender
      type: 'connection_accepted',
      message: `${receiverUser?.fullName || 'Người dùng'} đã chấp nhận lời mời kết nối của bạn`, // Message uses receiver's name
      isRead: false,
      createdAt: new Date().toISOString(),
      relatedEntity: {
        type: 'connection',
        id: connection.id,
        conversationId: connection.id // Assuming connection.id can serve as conversationId
      },
      fromUser: { // Include receiver's info (the one who accepted)
        id: receiverUser?.id,
        fullName: receiverUser?.fullName,
        avatar: receiverUser?.avatar
      }
    };
    db.notifications.push(notification);
    writeDb(db);
    const senderSocketId = usersMap.get(connection.senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit('newNotification', notification); // Emit notification to sender
      io.to(senderSocketId).emit('connectionAccepted', { ...connection, firstMessage }); // Send first message with connection
    }

  } else if (status === 'rejected') {
    connection.status = 'rejected';
    connection.rejectionCount = (connection.rejectionCount || 0) + 1; // Increment rejection count
    
    const senderUser = db.users.find(u => u.id === connection.senderId);
    const notification = {
      id: Date.now().toString() + '-notify-reject',
      userId: connection.senderId,
      type: 'connection_rejected',
      message: `${senderUser?.fullName || 'Người dùng'} đã từ chối lời mời kết nối của bạn`,
      isRead: false,
      createdAt: new Date().toISOString(),
      relatedEntity: {
        type: 'connection',
        id: connection.id
      }
    };
    db.notifications.push(notification);
    writeDb(db);
    const senderSocketId = usersMap.get(connection.senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit('newNotification', notification); // Emit notification to sender
      // Optionally, emit a socket event to update the sender's UI immediately
      io.to(senderSocketId).emit('connectionRejected', connection);
    }

  } else {
    return res.status(400).json({ message: 'Invalid status provided.' });
  }

  writeDb(db);
  res.json(connection);
});

// Serve static files (if needed, e.g., for serving db.json directly or other assets)
// app.use('/api', jsonServer.router(DB_PATH)); // If you want to keep json-server routing

// The main API server will now run on port 3001
app.listen(API_PORT, () => {
  console.log(`API server listening on port ${API_PORT}`);
});

server.listen(SOCKET_PORT, () => {
  console.log(`Socket.IO server listening on port ${SOCKET_PORT}`);
});
