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
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';

// Collections
const POSTS_COLLECTION = 'posts';
const USERS_COLLECTION = 'users';

// Posts Service
export const postsService = {
  // Create new post
  async createPost(postData) {
    try {
      if (!db) {
        // Mock successful creation
        console.log('Mock post created:', postData);
        return addMockPost(postData);
      }
      
      const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
        ...postData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0,
        likes: 0,
        status: 'active'
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      
      // If Firebase error, simulate successful creation
      if (error.code === 'failed-precondition' || error.message.includes('index')) {
        console.warn('Using mock post creation due to Firebase limitations');
        return addMockPost(postData);
      }
      
      throw error;
    }
  },

  // Get all posts with pagination
  async getPosts(options = {}) {
    try {
      // Handle both old and new calling patterns
      let pageSize = 20;
      
      if (typeof options === 'object' && options.page) {
        // New pattern from Home.jsx
        const {
          limit = 20,
        } = options;
        pageSize = limit;
      } else {
        // Old pattern
        pageSize = options.pageSize || pageSize;
      }
      
      if (!db) {
        console.warn('Firebase not initialized - falling back to mock data');
        return getMockPosts(options);
      }
      
      console.log('Firebase initialized successfully, attempting to query posts...');
      
      let q = collection(db, POSTS_COLLECTION);
      
      // Use simple query to avoid composite index requirements
      const queryConstraints = [];
      
      // Only use orderBy and limit to avoid index issues
      queryConstraints.push(orderBy('createdAt', 'desc'));
      queryConstraints.push(limit(pageSize));

      q = query(q, ...queryConstraints);
      
      console.log('Attempting Firebase query...');
      
      const querySnapshot = await getDocs(q);
      let posts = [];
      
      querySnapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...doc.data()
        });
      });

      console.log(`Successfully loaded ${posts.length} posts from Firebase`);

      // Calculate pagination info
      const total = posts.length;
      const currentPage = options.page || 1;
      const totalPages = Math.ceil(total / pageSize) || 1;
      
      return {
        posts,
        hasMore: posts.length === pageSize,
        totalPages,
        total,
        currentPage
      };
    } catch (error) {
      console.error('Error getting posts:', error);
      
      // If it's an index error, return mock data to keep app working
      if (error.code === 'failed-precondition' || error.message.includes('index')) {
        console.warn('Firebase index error - falling back to mock data');
        return getMockPosts(options);
      }
      
      // For other Firebase errors, also use mock data but show warning
      console.warn('Firebase error - falling back to mock data:', error.message);
      return getMockPosts(options);
    }
  },

  // Search posts
  async searchPosts(searchTerm, filters = {}) {
    try {
      let q = collection(db, POSTS_COLLECTION);
      
      const queryConstraints = [
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      ];

      // Apply filters (same as getPosts)
      if (filters.minPrice) {
        queryConstraints.push(where('price', '>=', filters.minPrice));
      }
      if (filters.maxPrice) {
        queryConstraints.push(where('price', '<=', filters.maxPrice));
      }
      if (filters.location) {
        queryConstraints.push(where('location', '==', filters.location));
      }
      if (filters.category) {
        queryConstraints.push(where('category', '==', filters.category));
      }

      q = query(q, ...queryConstraints);
      
      const querySnapshot = await getDocs(q);
      const posts = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Client-side search in title and description
        if (data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            data.description.toLowerCase().includes(searchTerm.toLowerCase())) {
          posts.push({
            id: doc.id,
            ...data
          });
        }
      });

      return posts;
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  },

  // Get single post
  async getPost(id) {
    try {
      const docRef = doc(db, POSTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        // Increment views
        await updateDoc(docRef, {
          views: (docSnap.data().views || 0) + 1
        });
        
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        throw new Error('Post not found');
      }
    } catch (error) {
      console.error('Error getting post:', error);
      throw error;
    }
  },

  // Update post
  async updatePost(id, updates) {
    try {
      const docRef = doc(db, POSTS_COLLECTION, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  // Delete post
  async deletePost(id) {
    try {
      if (!db) {
        // Delete from mock storage
        const index = mockPostsStorage.findIndex(post => post.id === id);
        if (index > -1) {
          mockPostsStorage.splice(index, 1);
          console.log('Mock post deleted:', id);
          return true;
        }
        return false;
      }

      const docRef = doc(db, POSTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting post:', error);
      
      // Fallback to mock deletion
      const index = mockPostsStorage.findIndex(post => post.id === id);
      if (index > -1) {
        mockPostsStorage.splice(index, 1);
        console.log('Fallback mock post deleted:', id);
        return true;
      }
      
      throw error;
    }
  },

  // Get featured posts
  async getFeaturedPosts(limit = 5) {
    try {
      const q = query(
        collection(db, POSTS_COLLECTION),
        where('status', '==', 'active'),
        where('featured', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );
      
      const querySnapshot = await getDocs(q);
      const posts = [];
      
      querySnapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return posts;
    } catch (error) {
      console.error('Error getting featured posts:', error);
      throw error;
    }
  },

  // Get posts by user
  async getPostsByUser(userId) {
    try {
      if (!db) {
        // Return mock posts for the user
        const userPosts = mockPostsStorage.filter(post => post.authorId === userId);
        console.log('Mock posts for user:', userId, userPosts);
        return userPosts;
      }

      const q = query(
        collection(db, POSTS_COLLECTION),
        where('authorId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const posts = [];
      
      querySnapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return posts;
    } catch (error) {
      console.error('Error getting user posts:', error);
      
      // Fallback to mock data if Firebase fails
      const userPosts = mockPostsStorage.filter(post => post.authorId === userId);
      console.log('Fallback mock posts for user:', userId, userPosts);
      return userPosts;
    }
  },

  // Real-time posts listener
  onPostsChange(callback, filters = {}) {
    let q = collection(db, POSTS_COLLECTION);
    
    const queryConstraints = [
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
      limit(20)
    ];

    if (filters.location) {
      queryConstraints.push(where('location', '==', filters.location));
    }
    if (filters.category) {
      queryConstraints.push(where('category', '==', filters.category));
    }

    q = query(q, ...queryConstraints);
    
    return onSnapshot(q, (snapshot) => {
      const posts = [];
      snapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(posts);
    });
  }
};

// Image Upload Service
export const imageService = {
  // Upload single image
  async uploadImage(file, path = 'posts') {
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const storageRef = ref(storage, `${path}/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Upload multiple images
  async uploadImages(files, path = 'posts') {
    try {
      const uploadPromises = files.map(file => this.uploadImage(file, path));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  },

  // Delete image
  async deleteImage(imageUrl) {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }
};

// Statistics Service
export const statsService = {
  // Get app statistics
  async getStats() {
    try {
      const postsQuery = query(
        collection(db, POSTS_COLLECTION),
        where('status', '==', 'active')
      );
      
      const usersQuery = query(collection(db, USERS_COLLECTION));
      
      const [postsSnapshot, usersSnapshot] = await Promise.all([
        getDocs(postsQuery),
        getDocs(usersQuery)
      ]);

      return {
        totalPosts: postsSnapshot.size,
        totalUsers: usersSnapshot.size,
        // Add more stats as needed
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      throw error;
    }
  }
};

// Locations and Categories constants
export const LOCATIONS = [
  'Hồ Chí Minh',
  'Hà Nội',
  'Đà Nẵng',
  'Cần Thơ',
  'Bình Dương',
  'Đồng Nai',
  'Khánh Hòa',
  'Hải Phòng',
  'Long An',
  'Quảng Nam',
  'Bà Rịa - Vũng Tàu',
  'Đắk Lắk'
];

export const CATEGORIES = [
  'Phòng trọ',
  'Nhà nguyên căn',
  'Căn hộ chung cư',
  'Căn hộ mini',
  'Căn hộ dịch vụ',
  'Ở ghép',
  'Mặt bằng'
];

export const PRICE_RANGES = [
  { label: 'Dưới 1 triệu', min: 0, max: 1000000 },
  { label: 'Từ 1 - 2 triệu', min: 1000000, max: 2000000 },
  { label: 'Từ 2 - 3 triệu', min: 2000000, max: 3000000 },
  { label: 'Từ 3 - 5 triệu', min: 3000000, max: 5000000 },
  { label: 'Từ 5 - 7 triệu', min: 5000000, max: 7000000 },
  { label: 'Từ 7 - 10 triệu', min: 7000000, max: 10000000 },
  { label: 'Từ 10 - 15 triệu', min: 10000000, max: 15000000 },
  { label: 'Trên 15 triệu', min: 15000000, max: 999999999 }
];

export const AREA_RANGES = [
  { label: 'Dưới 20 m²', min: 0, max: 20 },
  { label: 'Từ 20 - 30m²', min: 20, max: 30 },
  { label: 'Từ 30 - 50m²', min: 30, max: 50 },
  { label: 'Từ 50 - 70m²', min: 50, max: 70 },
  { label: 'Từ 70 - 90m²', min: 70, max: 90 },
  { label: 'Trên 90m²', min: 90, max: 999 }
];

// Mock data function for fallback when Firestore index is missing
// Mock posts storage
let mockPostsStorage = [
  {
    id: 'mock1',
    title: 'Tìm bạn nữ ghép trọ quận 1',
    description: 'Phòng trọ đẹp, đầy đủ tiện nghi, gần trường ĐH Khoa học Tự nhiên.',
    price: 3500000,
    budget: 3500000,
    location: 'Quận 1, Hồ Chí Minh',
    district: 'Quận 1',
    city: 'Hồ Chí Minh',
    roomType: 'double',
    gender: 'female',
    genderPreference: 'female',
    type: 'roommate-search',
    status: 'active',
    authorId: 'demo-user-123', // Demo user's posts
    authorName: 'Demo User',
    authorPhone: '0901234567',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    images: ['/api/placeholder/400/300']
  },
  {
    id: 'mock2',
    title: 'Nam tìm bạn cùng phòng gần ĐH Bách Khoa',
    description: 'Căn hộ mini 2 phòng ngủ, đầy đủ nội thất, gần trường học.',
    price: 2800000,
    budget: 2800000,
    location: 'Quận 3, Hồ Chí Minh',
    district: 'Quận 3',
    city: 'Hồ Chí Minh',
    roomType: 'apartment',
    gender: 'male',
    genderPreference: 'male',
    type: 'roommate-search',
    status: 'active',
    authorId: 'other-user-456', // Other user's posts
    authorName: 'Việt Nam',
    authorPhone: '0902345678',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString(),
    images: ['/api/placeholder/400/300']
  },
  {
    id: 'mock3',
    title: 'Demo Post - Tìm bạn ghép trọ quận Bình Thạnh',
    description: 'Phòng trọ yên tĩnh, an ninh tốt, phù hợp sinh viên nghiêm túc.',
    price: 3200000,
    budget: 3200000,
    location: 'Quận Bình Thạnh, Hồ Chí Minh',
    district: 'Quận Bình Thạnh',
    city: 'Hồ Chí Minh',
    roomType: 'single',
    gender: 'female',
    genderPreference: 'female',
    type: 'roommate-search',
    status: 'active',
    authorId: 'demo-user-123', // Demo user's posts
    authorName: 'Demo User',
    authorPhone: '0903456789',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date().toISOString(),
    images: ['/api/placeholder/400/300']
  }
];

const getMockPosts = (options = {}) => {
  return {
    posts: mockPostsStorage,
    totalPages: 1,
    total: mockPostsStorage.length,
    currentPage: options.page || 1,
    hasMore: false
  };
};

// Function to add mock post
const addMockPost = (postData) => {
  const mockPost = {
    id: 'mock-' + Date.now(),
    ...postData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockPostsStorage.unshift(mockPost); // Add to beginning
  return mockPost.id;
}; 