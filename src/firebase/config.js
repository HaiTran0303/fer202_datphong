import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

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
let app;
let auth;
let db;
let storage;

try {
  app = initializeApp(firebaseConfig);

  // Initialize Firebase Authentication
  auth = getAuth(app);

  // Initialize Cloud Firestore
  db = getFirestore(app);

  // Initialize Cloud Storage
  storage = getStorage(app);
  
  // For development, you can connect to emulators
  if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR) {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099');
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectStorageEmulator(storage, 'localhost', 9199);
  } catch (error) {
      console.warn('Firebase emulator connection failed:', error);
    }
  }
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization failed:', error);
  
  // Create mock objects to prevent app crashes
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => callback(null),
    signOut: () => Promise.resolve(),
    signInWithEmailAndPassword: () => Promise.reject(new Error('Firebase not available')),
    createUserWithEmailAndPassword: () => Promise.reject(new Error('Firebase not available'))
  };
  
  db = {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({ exists: false }),
        set: () => Promise.resolve(),
        update: () => Promise.resolve(),
        delete: () => Promise.resolve()
      })
    })
  };
  
  storage = null;
}

export { auth, db, storage };
export default app; 