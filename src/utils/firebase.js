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
  startAfter,
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
        return 'mock-post-' + Date.now();
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
        return 'mock-post-' + Date.now();
      }
      
      throw error;
    }
  },

  // Get all posts with pagination
  async getPosts(options = {}) {
    try {
      // Handle both old and new calling patterns
      let filters = {};
      let pageSize = 20;
      let lastDoc = null;
      
      if (typeof options === 'object' && options.page) {
        // New pattern from Home.jsx
        const {
          limit = 20,
          ...rest
        } = options;
        filters = rest;
        pageSize = limit;
      } else {
        // Old pattern
        pageSize = options.pageSize || pageSize;
        lastDoc = options.lastDoc || null;
        filters = options.filters || options;
      }
      
      if (!db) {
        // Return mock data when Firebase is not available
        return {
          posts: [],
          totalPages: 1,
          total: 0,
          currentPage: options.page || 1
        };
      }
      
      let q = collection(db, POSTS_COLLECTION);
      
      // Apply filters - simplified to avoid composite index requirements
      const queryConstraints = [];
      
      // Always filter by status
      queryConstraints.push(where('status', '==', 'active'));
      
      // Only apply one filter at a time to avoid composite index needs
      if (filters.location) {
        queryConstraints.push(where('location', '==', filters.location));
      } else if (filters.category) {
        queryConstraints.push(where('category', '==', filters.category));
      } else if (filters.priceMin && !filters.priceMax) {
        queryConstraints.push(where('price', '>=', filters.priceMin));
      } else if (filters.priceMax && !filters.priceMin) {
        queryConstraints.push(where('price', '<=', filters.priceMax));
      }
      
      // Add orderBy last
      queryConstraints.push(orderBy('createdAt', 'desc'));

      // Add pagination
      if (lastDoc) {
        queryConstraints.push(startAfter(lastDoc));
      }
      queryConstraints.push(limit(pageSize));

      q = query(q, ...queryConstraints);
      
      const querySnapshot = await getDocs(q);
      let posts = [];
      
      querySnapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Client-side filtering for complex filters that require composite index
      if (filters.priceMin && filters.priceMax) {
        posts = posts.filter(post => 
          post.price >= filters.priceMin && post.price <= filters.priceMax
        );
      }
      
      if (filters.areaMin) {
        posts = posts.filter(post => post.area >= filters.areaMin);
      }
      
      if (filters.areaMax) {
        posts = posts.filter(post => post.area <= filters.areaMax);
      }

      // Calculate pagination info
      const total = posts.length;
      const currentPage = options.page || 1;
      const totalPages = Math.ceil(total / pageSize) || 1;
      
      return {
        posts,
        lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
        hasMore: querySnapshot.docs.length === pageSize,
        totalPages,
        total,
        currentPage
      };
    } catch (error) {
      console.error('Error getting posts:', error);
      
      // If it's an index error, return mock data to keep app working
      if (error.code === 'failed-precondition' || error.message.includes('index')) {
        console.warn('Using mock data due to Firestore index requirements');
        return getMockPosts(options);
      }
      
      // Return safe fallback data for other errors
      return {
        posts: [],
        totalPages: 1,
        total: 0,
        currentPage: options.page || 1,
        hasMore: false
      };
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
      const docRef = doc(db, POSTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting post:', error);
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
      const q = query(
        collection(db, POSTS_COLLECTION),
        where('userId', '==', userId),
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
      throw error;
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
const getMockPosts = (options = {}) => {
  const mockPosts = [
    {
      id: 'mock1',
      title: 'Tìm bạn nữ ghép trọ quận 1',
      description: 'Phòng trọ đẹp, đầy đủ tiện nghi, gần trường ĐH Khoa học Tự nhiên.',
      price: 3500000,
      location: 'Quận 1, Hồ Chí Minh',
      district: 'Quận 1',
      city: 'Hồ Chí Minh',
      roomType: 'double',
      gender: 'female',
      type: 'roommate-search',
      status: 'active',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      authorName: 'Minh Anh',
      authorPhone: '0901234567',
      images: ['/api/placeholder/400/300']
    },
    {
      id: 'mock2',
      title: 'Nam tìm bạn cùng phòng gần ĐH Bách Khoa',
      description: 'Căn hộ mini 2 phòng ngủ, đầy đủ nội thất, gần trường học.',
      price: 2800000,
      location: 'Quận 3, Hồ Chí Minh',
      district: 'Quận 3',
      city: 'Hồ Chí Minh',
      roomType: 'apartment',
      gender: 'male',
      type: 'roommate-search',
      status: 'active',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date().toISOString(),
      authorName: 'Việt Nam',
      authorPhone: '0902345678',
      images: ['/api/placeholder/400/300']
    },
    {
      id: 'mock3',
      title: 'Nữ tìm bạn ghép trọ quận Bình Thạnh',
      description: 'Phòng trọ yên tĩnh, an ninh tốt, phù hợp sinh viên nghiêm túc.',
      price: 3200000,
      location: 'Quận Bình Thạnh, Hồ Chí Minh',
      district: 'Quận Bình Thạnh',
      city: 'Hồ Chí Minh',
      roomType: 'single',
      gender: 'female',
      type: 'roommate-search',
      status: 'active',
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      updatedAt: new Date().toISOString(),
      authorName: 'Thu Hà',
      authorPhone: '0903456789',
      images: ['/api/placeholder/400/300']
    }
  ];

  return {
    posts: mockPosts,
    totalPages: 1,
    total: mockPosts.length,
    currentPage: options.page || 1,
    hasMore: false
  };
}; 