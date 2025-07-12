import React, { createContext, useContext, useState, useEffect } from 'react';
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

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Đăng ký với email/password
  const register = async (email, password, userData) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Cập nhật profile
    await updateProfile(result.user, {
      displayName: userData.fullName
    });

    // Lưu thông tin user vào Firestore
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

    return result;
  };

  // Đăng nhập với email/password
  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
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
    await signOut(auth);
    setUserProfile(null);
  };

  // Lấy thông tin user từ Firestore
  const getUserProfile = async (uid) => {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  };

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
      setCurrentUser(user);
      
      if (user) {
        // Lấy thông tin profile từ Firestore
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

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