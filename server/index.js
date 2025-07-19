import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios'; // Import axios to talk to json-server

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:5173', // Updated to Vite's default client origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] // Allow more methods for API
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
const JSON_SERVER_URL = 'http://localhost:3001'; // JSON Server runs on this port

// Helper functions to read/write db.json are no longer needed for direct file access
// They will be replaced by axios calls to JSON_SERVER_URL
/*
const DB_PATH = path.join(__dirname, '../db.json');
const readDb = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading db.json:', error);
    return { posts: [], users: [], connections: [], messages: [], notifications: [], settings: [], blogs: [], constants: {} };
  }
};
const writeDb = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to db.json:', error);
  }
};
*/

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

  socket.on('sendMessage', async (data) => {
    const { conversationId, senderId, content, timestamp } = data;
    const newMessage = {
      id: Date.now().toString(),
      conversationId: conversationId,
      senderId: senderId,
      content: content,
      timestamp: timestamp, 
    };
    try {
      // Save message to json-server
      await axios.post(`${JSON_SERVER_URL}/messages`, newMessage);
      // Emit message to all clients in the conversation room, including the sender
      io.to(conversationId).emit('receiveMessage', newMessage); 
    } catch (error) {
      console.error('Error sending message via socket:', error.response?.data || error.message);
      socket.emit('sendMessageFailed', 'Failed to send message.');
    }
  });

  socket.on('sendConnectionRequest', async (data) => {
    const { senderId, receiverId, postId, message } = data;

    // Basic validation
    if (!senderId || !receiverId || !postId) {
      socket.emit('connectionRequestFailed', 'Missing required fields.');
      return;
    }

    try {
      // Check if a connection request already exists or if they are already connected
      const existingConnections = await axios.get(`${JSON_SERVER_URL}/connections?senderId=${senderId}&receiverId=${receiverId}&postId=${postId}`);
      const existingConnection = existingConnections.data.find(
        conn => (conn.senderId === senderId && conn.receiverId === receiverId && conn.postId === postId) ||
                (conn.senderId === receiverId && conn.receiverId === senderId && conn.postId === postId && conn.status === 'accepted')
      );

      if (existingConnection) {
        socket.emit('connectionRequestFailed', 'Yêu cầu kết nối đã tồn tại hoặc đã được kết nối.');
        return;
      }

      // Check rejection count if sender has been rejected 3 times for this post
      const rejectedConnections = await axios.get(`${JSON_SERVER_URL}/connections?senderId=${senderId}&receiverId=${receiverId}&postId=${postId}&status=rejected`);
      const rejectionCount = rejectedConnections.data.length;

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
      
      // Save new connection to json-server
      const savedConnection = await axios.post(`${JSON_SERVER_URL}/connections`, newConnection);

      // Create a notification for the receiver
      const senderUserRes = await axios.get(`${JSON_SERVER_URL}/users/${senderId}`);
      const senderUser = senderUserRes.data;
      
      const notification = {
        id: Date.now().toString() + '-notify',
        userId: receiverId,
        type: 'connection_request',
        message: `${senderUser?.fullName || 'Người dùng'} đã gửi lời mời kết nối`,
        isRead: false,
        createdAt: new Date().toISOString(),
        relatedEntity: {
          type: 'connection',
          id: savedConnection.data.id // Use ID from saved connection
        },
        fromUser: { // Include sender's info directly
          id: senderUser?.id,
          fullName: senderUser?.fullName,
          avatar: senderUser?.avatar // Assuming avatar is available on user object
        }
      };
      // Save notification to json-server
      await axios.post(`${JSON_SERVER_URL}/notifications`, notification);

      // Notify receiver via socket
      const receiverSocketId = usersMap.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('newConnectionRequest', savedConnection.data);
        io.to(receiverSocketId).emit('newNotification', notification);
      }
      
      socket.emit('connectionRequestSent', savedConnection.data);

    } catch (error) {
      console.error('Error sending connection request via socket:', error.response?.data || error.message);
      socket.emit('connectionRequestFailed', 'Có lỗi xảy ra khi gửi lời mời. Vui lòng thử lại.');
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    // Remove user from map on disconnect
    if (socket.userId) {
      usersMap.delete(socket.userId);
    }
  });

  // Handle connection status updates via socket
  socket.on('updateConnectionStatus', async (data) => {
    const { connectionId, status } = data;
    try {
      const connectionRes = await axios.get(`${JSON_SERVER_URL}/connections/${connectionId}`);
      const connection = connectionRes.data;

      if (!connection) {
        console.warn(`Connection with ID ${connectionId} not found for status update.`);
        return;
      }

      let updatedConnection = { ...connection, status: status };

      if (status === 'accepted') {
        const firstMessage = {
          id: Date.now().toString() + '-first-msg',
          conversationId: connection.id,
          senderId: connection.senderId,
          content: connection.message,
          timestamp: new Date().toISOString(),
        };
        await axios.post(`${JSON_SERVER_URL}/messages`, firstMessage); // Save first message
        updatedConnection.firstMessage = firstMessage; // Add to object for socket emit

        // Create notification for sender
        const receiverUserRes = await axios.get(`${JSON_SERVER_URL}/users/${connection.receiverId}`);
        const receiverUser = receiverUserRes.data;
        const notification = {
          id: Date.now().toString() + '-notify-accept',
          userId: connection.senderId,
          type: 'connection_accepted',
          message: `${receiverUser?.fullName || 'Người dùng'} đã chấp nhận lời mời kết nối của bạn`,
          isRead: false,
          createdAt: new Date().toISOString(),
          relatedEntity: { type: 'connection', id: connection.id },
          fromUser: { id: receiverUser?.id, fullName: receiverUser?.fullName, avatar: receiverUser?.avatar }
        };
        await axios.post(`${JSON_SERVER_URL}/notifications`, notification);
        const senderSocketId = usersMap.get(connection.senderId);
        if (senderSocketId) io.to(senderSocketId).emit('newNotification', notification);
      } else if (status === 'rejected') {
        updatedConnection.rejectionCount = (connection.rejectionCount || 0) + 1;
        // Create notification for sender
        const senderUserRes = await axios.get(`${JSON_SERVER_URL}/users/${connection.senderId}`);
        const senderUser = senderUserRes.data;
        const notification = {
          id: Date.now().toString() + '-notify-reject',
          userId: connection.senderId,
          type: 'connection_rejected',
          message: `${senderUser?.fullName || 'Người dùng'} đã từ chối lời mời kết nối của bạn`,
          isRead: false,
          createdAt: new Date().toISOString(),
          relatedEntity: { type: 'connection', id: connection.id },
          fromUser: { id: senderUser?.id, fullName: senderUser?.fullName, avatar: senderUser?.avatar }
        };
        await axios.post(`${JSON_SERVER_URL}/notifications`, notification);
        const senderSocketId = usersMap.get(connection.senderId);
        if (senderSocketId) io.to(senderSocketId).emit('newNotification', notification);
      } else if (status === 'cancelled') {
        // Create notification for receiver
        const receiverUserRes = await axios.get(`${JSON_SERVER_URL}/users/${connection.receiverId}`);
        const receiverUser = receiverUserRes.data;
        const notification = {
          id: Date.now().toString() + '-notify-cancel',
          userId: connection.receiverId,
          type: 'connection_cancelled',
          message: `${receiverUser?.fullName || 'Người dùng'} đã hủy lời mời kết nối`,
          isRead: false,
          createdAt: new Date().toISOString(),
          relatedEntity: { type: 'connection', id: connection.id },
          fromUser: { id: receiverUser?.id, fullName: receiverUser?.fullName, avatar: receiverUser?.avatar }
        };
        await axios.post(`${JSON_SERVER_URL}/notifications`, notification);
        const receiverSocketId = usersMap.get(connection.receiverId);
        if (receiverSocketId) io.to(receiverSocketId).emit('newNotification', notification);
      }

      // Update connection status on json-server
      await axios.patch(`${JSON_SERVER_URL}/connections/${connectionId}`, { status: updatedConnection.status, rejectionCount: updatedConnection.rejectionCount });

      // Emit status update to both sender and receiver
      const senderSocketId = usersMap.get(connection.senderId);
      const receiverSocketId = usersMap.get(connection.receiverId);

      if (status === 'accepted') {
        if (senderSocketId) io.to(senderSocketId).emit('connectionAccepted', updatedConnection);
        if (receiverSocketId) io.to(receiverSocketId).emit('connectionAccepted', updatedConnection);
      } else if (status === 'rejected') {
        if (senderSocketId) io.to(senderSocketId).emit('connectionRejected', updatedConnection);
        if (receiverSocketId) io.to(receiverSocketId).emit('connectionRejected', updatedConnection);
      } else if (status === 'cancelled') {
        if (senderSocketId) io.to(senderSocketId).emit('connectionCancelled', updatedConnection);
        if (receiverSocketId) io.to(receiverSocketId).emit('connectionCancelled', updatedConnection);
      }
    } catch (error) {
      console.error('Error updating connection status via socket:', error.response?.data || error.message);
      socket.emit('updateConnectionStatusFailed', 'Failed to update connection status.');
    }
  });
});

server.listen(SOCKET_PORT, () => {
  console.log(`Socket.IO server listening on port ${SOCKET_PORT}`);
});
