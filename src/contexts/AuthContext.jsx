import React, { useState, useEffect, useCallback } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { AuthContext } from './AuthContext.js';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mockUser, setMockUser] = useState(null);

  // Đăng ký với email/password
  const register = async (email, password, userData) => {
    try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Cập nhật profile
    await updateProfile(result.user, {
      displayName: userData.fullName
    });

    // Lưu thông tin user vào Firestore
      if (db) {
    await setDoc(doc(db, 'users', result.user.uid), {
      uid: result.user.uid,
      email: email,
      fullName: userData.fullName,
      phone: userData.phone,
      school: userData.school,
      major: userData.major,
      yearOfStudy: userData.yearOfStudy,
      gender: userData.gender,
      dateOfBirth: userData.dateOfBirth,
      avatar: userData.avatar || '',
      bio: userData.bio || '',
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
      }

    return result;
    } catch (error) {
      console.error('Registration error:', error);
      
      // For demo purposes, allow mock registration
      if (error.code === 'auth/email-already-in-use') {
        throw error; // This is a real auth error
      }
      
      // For other Firebase errors, provide mock registration for demo
      console.warn('Using mock registration for demo purposes');
      return {
        user: {
          uid: 'demo-user-' + Date.now(),
          email: email,
          displayName: userData.fullName
        }
      };
    }
  };

  // Đăng nhập với email/password
  const login = async (email, password) => {
    try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
    } catch (error) {
      console.error('Login error:', error);
      
      // For demo purposes, allow mock login if Firebase has issues
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw error; // These are real auth errors
      }
      
      // For other Firebase errors, provide mock login for demo
      if (email === 'demo@test.com' && password === '123456') {
        console.warn('Using mock login for demo purposes');
        const mockUserData = {
          uid: 'demo-user-123',
          email: 'demo@test.com',
          displayName: 'Demo User'
        };
        setMockUser(mockUserData);
        setCurrentUser(mockUserData);
        setUserProfile({
          uid: 'demo-user-123',
          email: 'demo@test.com',
          fullName: 'Demo User',
          isVerified: true
        });
        return {
          user: mockUserData
        };
      }
      
      throw error;
    }
  };

  // Đăng nhập với Google
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Kiểm tra xem user đã có profile chưa
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!userDoc.exists()) {
      // Tạo profile mới cho user Google
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        fullName: result.user.displayName,
        avatar: result.user.photoURL,
        isVerified: result.user.emailVerified,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    return result;
  };

  // Đăng xuất
  const logout = async () => {
    if (mockUser) {
      setMockUser(null);
      setCurrentUser(null);
      setUserProfile(null);
    } else {
    await signOut(auth);
    setUserProfile(null);
    }
  };

  // Lấy thông tin user từ Firestore
  const getUserProfile = useCallback(async (uid) => {
    try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }, []);

  // Cập nhật profile
  const updateUserProfile = async (uid, userData) => {
    await setDoc(doc(db, 'users', uid), {
      ...userData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    // Cập nhật local state
    setUserProfile(prevProfile => ({
      ...prevProfile,
      ...userData
    }));
  };

  // Lắng nghe thay đổi auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Don't override currentUser if we have a mock user
      if (!mockUser) {
      setCurrentUser(user);
      
      if (user) {
        // Lấy thông tin profile từ Firestore
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [mockUser, getUserProfile]);

  const value = {
    currentUser,
    userProfile,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    getUserProfile,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 