import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Thay thế config này bằng config thật từ Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCX2EqXh8JZUUsW2I-wC5oymb7FWy_NLKY",
  authDomain: "healthcare-49172.firebaseapp.com",
  projectId: "healthcare-49172",
  storageBucket: "healthcare-49172.firebasestorage.app",
  messagingSenderId: "4374621417",
  appId: "1:4374621417:web:e497604073ff87d11bd478"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service (optional)
// If Storage is not available, this will be null
export const storage = (() => {
  try {
    return getStorage(app);
  } catch (error) {
    console.warn('Firebase Storage không khả dụng:', error.message);
    return null;
  }
})();

export default app; 