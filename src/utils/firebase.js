import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  serverTimestamp
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../firebase/config';

// ============ POSTS OPERATIONS ============

export const createPost = async (postData, authorId) => {
  const docRef = await addDoc(collection(db, 'posts'), {
    ...postData,
    authorId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const updatePost = async (postId, postData) => {
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, {
    ...postData,
    updatedAt: serverTimestamp()
  });
};

export const deletePost = async (postId) => {
  await deleteDoc(doc(db, 'posts', postId));
};

export const getPost = async (postId) => {
  const postDoc = await getDoc(doc(db, 'posts', postId));
  if (postDoc.exists()) {
    return { id: postDoc.id, ...postDoc.data() };
  }
  return null;
};

export const getPosts = async (filters = {}, pageSize = 10, lastDoc = null) => {
  let q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  
  // Apply filters
  if (filters.location) {
    q = query(q, where('location', '==', filters.location));
  }
  if (filters.budget) {
    q = query(q, where('budget', '<=', filters.budget));
  }
  if (filters.roomType) {
    q = query(q, where('roomType', '==', filters.roomType));
  }
  
  // Pagination
  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }
  q = query(q, limit(pageSize));
  
  const snapshot = await getDocs(q);
  const posts = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  return {
    posts,
    lastDoc: snapshot.docs[snapshot.docs.length - 1],
    hasMore: snapshot.docs.length === pageSize
  };
};

export const getUserPosts = async (userId) => {
  const q = query(
    collection(db, 'posts'),
    where('authorId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// ============ CONNECTIONS OPERATIONS ============

export const createConnection = async (connectionData) => {
  const docRef = await addDoc(collection(db, 'connections'), {
    ...connectionData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateConnection = async (connectionId, data) => {
  const connectionRef = doc(db, 'connections', connectionId);
  await updateDoc(connectionRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const getUserConnections = async (userId) => {
  const q = query(
    collection(db, 'connections'),
    where('participants', 'array-contains', userId),
    orderBy('updatedAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// ============ MESSAGES OPERATIONS ============

export const createMessage = async (messageData) => {
  const docRef = await addDoc(collection(db, 'messages'), {
    ...messageData,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const getMessages = async (connectionId) => {
  const q = query(
    collection(db, 'messages'),
    where('connectionId', '==', connectionId),
    orderBy('createdAt', 'asc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// ============ STORAGE OPERATIONS (OPTIONAL) ============

export const isStorageAvailable = () => {
  return storage !== null;
};

export const uploadImage = async (file, path) => {
  if (!isStorageAvailable()) {
    throw new Error('Storage không khả dụng. Vui lòng sử dụng URL hình ảnh trực tiếp.');
  }
  
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

export const uploadMultipleImages = async (files, basePath) => {
  if (!isStorageAvailable()) {
    throw new Error('Storage không khả dụng. Vui lòng sử dụng URL hình ảnh trực tiếp.');
  }
  
  const uploadPromises = files.map(async (file, index) => {
    const fileName = `${Date.now()}_${index}_${file.name}`;
    const path = `${basePath}/${fileName}`;
    return uploadImage(file, path);
  });
  
  return Promise.all(uploadPromises);
};

export const deleteImage = async (imageUrl) => {
  if (!isStorageAvailable()) {
    console.warn('Storage không khả dụng. Không thể xóa hình ảnh.');
    return;
  }
  
  const imageRef = ref(storage, imageUrl);
  await deleteObject(imageRef);
};

// ============ ALTERNATIVE IMAGE SOLUTIONS ============

// Convert file to base64 (for small images only)
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Placeholder images for testing
export const getPlaceholderImage = (width = 400, height = 300, text = 'Placeholder') => {
  return `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(text)}`;
};

// Default images cho different categories
export const getDefaultImages = () => {
  return {
    avatar: 'https://via.placeholder.com/150x150?text=Avatar',
    room: 'https://via.placeholder.com/400x300?text=Room',
    building: 'https://via.placeholder.com/400x300?text=Building',
    interior: 'https://via.placeholder.com/400x300?text=Interior'
  };
};

// ============ UTILITY FUNCTIONS ============

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// ============ SEARCH FUNCTIONS ============

export const searchPosts = async (searchTerm, filters = {}) => {
  // Note: Firestore doesn't support full-text search natively
  // This is a simple implementation, consider using Algolia or similar for production
  let q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  
  // Apply filters
  if (filters.location) {
    q = query(q, where('location', '>=', filters.location));
  }
  
  const snapshot = await getDocs(q);
  const posts = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  // Client-side filtering for search term
  if (searchTerm) {
    const searchTermLower = searchTerm.toLowerCase();
    return posts.filter(post => 
      post.title?.toLowerCase().includes(searchTermLower) ||
      post.description?.toLowerCase().includes(searchTermLower) ||
      post.location?.toLowerCase().includes(searchTermLower)
    );
  }
  
  return posts;
}; 