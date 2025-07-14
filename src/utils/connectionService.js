import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  getDoc,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Collections
const CONNECTIONS_COLLECTION = 'connections';
const MESSAGES_COLLECTION = 'messages';
const NOTIFICATIONS_COLLECTION = 'notifications';

// Connection Service
export const connectionService = {
  // Gửi lời mời kết nối
  async sendConnectionRequest(fromUserId, toUserId, postId, message = '') {
    try {
      if (!db) {
        console.warn('Firebase not initialized - using mock data');
        return {
          id: `mock-connection-${Date.now()}`,
          fromUserId,
          toUserId,
          postId,
          message,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
      }

      const connectionData = {
        fromUserId,
        toUserId,
        postId,
        message,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, CONNECTIONS_COLLECTION), connectionData);
      
      // Tạo thông báo cho người nhận
      await this.createNotification(toUserId, 'connection_request', {
        fromUserId,
        connectionId: docRef.id,
        postId,
        message
      });

      // Tạo tin nhắn đầu tiên (tích hợp với gửi tin nhắn)
      await addDoc(collection(db, MESSAGES_COLLECTION), {
        connectionId: docRef.id,
        fromUserId,
        toUserId,
        postId,
        content: message,
        type: 'text',
        createdAt: serverTimestamp(),
        isSystem: true // đánh dấu là tin nhắn hệ thống (lời mời)
      });

      return {
        id: docRef.id,
        ...connectionData
      };
    } catch (error) {
      console.error('Error sending connection request:', error);
      throw error;
    }
  },

  // Lấy danh sách lời mời đã gửi
  async getSentConnections(userId) {
    try {
      if (!db) {
        return [];
      }

      const q = query(
        collection(db, CONNECTIONS_COLLECTION),
        where('fromUserId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const connections = [];

      for (const doc of querySnapshot.docs) {
        const connection = { id: doc.id, ...doc.data() };
        
        // Lấy thông tin người nhận
        const toUserDoc = await getDoc(doc(db, 'users', connection.toUserId));
        if (toUserDoc.exists()) {
          connection.toUser = toUserDoc.data();
        }

        // Lấy thông tin bài đăng
        const postDoc = await getDoc(doc(db, 'posts', connection.postId));
        if (postDoc.exists()) {
          connection.post = { id: postDoc.id, ...postDoc.data() };
        }

        connections.push(connection);
      }

      return connections;
    } catch (error) {
      console.error('Error getting sent connections:', error);
      return [];
    }
  },

  // Lấy danh sách lời mời đã nhận
  async getReceivedConnections(userId) {
    try {
      if (!db) {
        return [];
      }

      const q = query(
        collection(db, CONNECTIONS_COLLECTION),
        where('toUserId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const connections = [];

      for (const doc of querySnapshot.docs) {
        const connection = { id: doc.id, ...doc.data() };
        
        // Lấy thông tin người gửi
        const fromUserDoc = await getDoc(doc(db, 'users', connection.fromUserId));
        if (fromUserDoc.exists()) {
          connection.fromUser = fromUserDoc.data();
        }

        // Lấy thông tin bài đăng
        const postDoc = await getDoc(doc(db, 'posts', connection.postId));
        if (postDoc.exists()) {
          connection.post = { id: postDoc.id, ...postDoc.data() };
        }

        connections.push(connection);
      }

      return connections;
    } catch (error) {
      console.error('Error getting received connections:', error);
      return [];
    }
  },

  // Chấp nhận lời mời kết nối
  async acceptConnection(connectionId) {
    try {
      if (!db) {
        console.warn('Firebase not initialized - using mock data');
        return { success: true };
      }

      const connectionRef = doc(db, CONNECTIONS_COLLECTION, connectionId);
      const connectionDoc = await getDoc(connectionRef);
      
      if (!connectionDoc.exists()) {
        throw new Error('Connection not found');
      }

      const connection = connectionDoc.data();
      
      // Cập nhật trạng thái
      await updateDoc(connectionRef, {
        status: 'accepted',
        updatedAt: serverTimestamp()
      });

      // Tạo thông báo cho người gửi
      await this.createNotification(connection.fromUserId, 'connection_accepted', {
        toUserId: connection.toUserId,
        connectionId,
        postId: connection.postId
      });

      return { success: true };
    } catch (error) {
      console.error('Error accepting connection:', error);
      throw error;
    }
  },

  // Từ chối lời mời kết nối
  async declineConnection(connectionId) {
    try {
      if (!db) {
        console.warn('Firebase not initialized - using mock data');
        return { success: true };
      }

      const connectionRef = doc(db, CONNECTIONS_COLLECTION, connectionId);
      const connectionDoc = await getDoc(connectionRef);
      
      if (!connectionDoc.exists()) {
        throw new Error('Connection not found');
      }

      const connection = connectionDoc.data();
      
      // Cập nhật trạng thái
      await updateDoc(connectionRef, {
        status: 'declined',
        updatedAt: serverTimestamp()
      });

      // Tạo thông báo cho người gửi
      await this.createNotification(connection.fromUserId, 'connection_declined', {
        toUserId: connection.toUserId,
        connectionId,
        postId: connection.postId
      });

      return { success: true };
    } catch (error) {
      console.error('Error declining connection:', error);
      throw error;
    }
  },

  // Hủy lời mời kết nối
  async cancelConnection(connectionId) {
    try {
      if (!db) {
        console.warn('Firebase not initialized - using mock data');
        return { success: true };
      }

      const connectionRef = doc(db, CONNECTIONS_COLLECTION, connectionId);
      const connectionDoc = await getDoc(connectionRef);
      
      if (!connectionDoc.exists()) {
        throw new Error('Connection not found');
      }

      const connection = connectionDoc.data();
      
      // Xóa lời mời
      await deleteDoc(connectionRef);

      // Tạo thông báo cho người nhận
      await this.createNotification(connection.toUserId, 'connection_cancelled', {
        fromUserId: connection.fromUserId,
        connectionId,
        postId: connection.postId
      });

      return { success: true };
    } catch (error) {
      console.error('Error cancelling connection:', error);
      throw error;
    }
  },

  // Tạo thông báo
  async createNotification(userId, type, data) {
    try {
      if (!db) {
        console.warn('Firebase not initialized - skipping notification');
        return;
      }

      const notificationData = {
        userId,
        type,
        data,
        isRead: false,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, NOTIFICATIONS_COLLECTION), notificationData);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  },

  // Lấy thông báo của user
  async getNotifications(userId) {
    try {
      if (!db) {
        return [];
      }

      const q = query(
        collection(db, NOTIFICATIONS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      const querySnapshot = await getDocs(q);
      const notifications = [];

      for (const doc of querySnapshot.docs) {
        const notification = { id: doc.id, ...doc.data() };
        
        // Lấy thông tin bổ sung dựa trên loại thông báo
        if (notification.type === 'connection_request' && notification.data.fromUserId) {
          const fromUserDoc = await getDoc(doc(db, 'users', notification.data.fromUserId));
          if (fromUserDoc.exists()) {
            notification.fromUser = fromUserDoc.data();
          }
        }

        notifications.push(notification);
      }

      return notifications;
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  },

  // Đánh dấu thông báo đã đọc
  async markNotificationAsRead(notificationId) {
    try {
      if (!db) {
        return { success: true };
      }

      const notificationRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
        updatedAt: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Lắng nghe thay đổi kết nối
  onConnectionsChange(userId, callback) {
    if (!db) {
      console.warn('Firebase not initialized - cannot listen to changes');
      return () => {};
    }

    const q = query(
      collection(db, CONNECTIONS_COLLECTION),
      where('toUserId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const connections = [];
      snapshot.forEach((doc) => {
        connections.push({ id: doc.id, ...doc.data() });
      });
      callback(connections);
    });
  },

  // Lắng nghe thay đổi thông báo
  onNotificationsChange(userId, callback) {
    if (!db) {
      console.warn('Firebase not initialized - cannot listen to changes');
      return () => {};
    }

    const q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const notifications = [];
      snapshot.forEach((doc) => {
        notifications.push({ id: doc.id, ...doc.data() });
      });
      callback(notifications);
    });
  }
}; 