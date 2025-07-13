import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const FirebaseTest = () => {
  const { currentUser, register, login, logout } = useAuth();
  const [testResults, setTestResults] = useState({
    auth: 'pending',
    firestore: 'pending',
    storage: 'pending'
  });
  const [testEmail] = useState('test@example.com');
  const [testPassword] = useState('test123456');

  // Test Firebase Auth
  const testAuth = async () => {
    try {
      console.log('Testing Firebase Auth...');
      
      // Test register
      await register(testEmail, testPassword, {
        fullName: 'Test User',
        phone: '0123456789',
        school: 'Test School',
        major: 'Test Major',
        yearOfStudy: '1',
        gender: 'Nam',
        dateOfBirth: '2000-01-01',
        bio: 'Test bio'
      });
      
      console.log('✅ Registration successful');
      
      // Test logout
      await logout();
      console.log('✅ Logout successful');
      
      // Test login
      await login(testEmail, testPassword);
      console.log('✅ Login successful');
      
      setTestResults(prev => ({ ...prev, auth: 'success' }));
    } catch (error) {
      console.error('❌ Auth test failed:', error);
      setTestResults(prev => ({ ...prev, auth: 'failed' }));
    }
  };

  // Test Firestore
  const testFirestore = async () => {
    try {
      console.log('Testing Firestore...');
      
      // Test write
      await setDoc(doc(db, 'test', 'firebase-test'), {
        message: 'Hello Firebase!',
        timestamp: new Date().toISOString()
      });
      console.log('✅ Firestore write successful');
      
      // Test read
      const querySnapshot = await getDocs(collection(db, 'test'));
      console.log('✅ Firestore read successful, documents:', querySnapshot.size);
      
      setTestResults(prev => ({ ...prev, firestore: 'success' }));
    } catch (error) {
      console.error('❌ Firestore test failed:', error);
      setTestResults(prev => ({ ...prev, firestore: 'failed' }));
    }
  };

  // Test Storage
  const testStorage = async () => {
    try {
      console.log('Testing Storage...');
      
      const { isStorageAvailable } = await import('../utils/firebase');
      
      if (isStorageAvailable()) {
        console.log('✅ Storage khả dụng');
        setTestResults(prev => ({ ...prev, storage: 'available' }));
      } else {
        console.log('⚠️ Storage không khả dụng - App vẫn hoạt động bình thường');
        setTestResults(prev => ({ ...prev, storage: 'unavailable' }));
      }
    } catch (error) {
      console.error('❌ Storage test failed:', error);
      setTestResults(prev => ({ ...prev, storage: 'failed' }));
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setTestResults({
      auth: 'pending',
      firestore: 'pending',
      storage: 'pending'
    });
    
    await testFirestore();
    await testAuth();
    await testStorage();
  };

  useEffect(() => {
    console.log('Firebase Test Component mounted');
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'available': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      case 'unavailable': return 'text-orange-600';
      case 'skipped': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'available': return '✅';
      case 'failed': return '❌';
      case 'pending': return '⏳';
      case 'unavailable': return '⚠️';
      case 'skipped': return '⏭️';
      default: return '❓';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Firebase Connection Test</h1>
      
      {/* Current User Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Current User</h2>
        {currentUser ? (
          <div className="text-sm text-gray-600">
            <p>Email: {currentUser.email}</p>
            <p>UID: {currentUser.uid}</p>
            <p>Verified: {currentUser.emailVerified ? 'Yes' : 'No'}</p>
          </div>
        ) : (
          <p className="text-gray-500">No user logged in</p>
        )}
      </div>

      {/* Test Results */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Test Results</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Authentication</span>
            <span className={`flex items-center gap-2 ${getStatusColor(testResults.auth)}`}>
              {getStatusIcon(testResults.auth)}
              {testResults.auth}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Firestore Database</span>
            <span className={`flex items-center gap-2 ${getStatusColor(testResults.firestore)}`}>
              {getStatusIcon(testResults.firestore)}
              {testResults.firestore}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Storage</span>
            <span className={`flex items-center gap-2 ${getStatusColor(testResults.storage)}`}>
              {getStatusIcon(testResults.storage)}
              {testResults.storage}
            </span>
          </div>
        </div>
      </div>

      {/* Test Actions */}
      <div className="flex gap-4">
        <button
          onClick={runAllTests}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Run All Tests
        </button>
        <button
          onClick={() => window.location.reload()}
          className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Reload Page
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
          <li>Make sure you've updated Firebase config in <code>src/firebase/config.js</code></li>
          <li>Enable Authentication and Firestore in Firebase Console</li>
          <li>Set up Firestore rules to allow read/write for authenticated users</li>
          <li>Click "Run All Tests" to test your Firebase connection</li>
        </ol>
      </div>
    </div>
  );
};

export default FirebaseTest; 