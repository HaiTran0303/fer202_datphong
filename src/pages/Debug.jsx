import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { postsService } from '../utils/firebase';

const Debug = () => {
  const { currentUser } = useAuth();
  const [results, setResults] = useState([]);

  const addResult = (message) => {
    setResults(prev => [...prev, { time: new Date().toLocaleTimeString(), message }]);
  };

  const testCreatePost = async () => {
    addResult('Testing create post...');
    
    if (!currentUser) {
      addResult('❌ No current user');
      return;
    }

    const testData = {
      title: 'Debug Test Post - ' + Date.now(),
      description: 'Test post from debug page',
      budget: 2500000,
      location: 'Test Location',
      district: 'Quận 1',
      city: 'Hồ Chí Minh',
      roomType: 'double',
      genderPreference: 'female',
      myGender: 'female',
      school: 'Đại học FPT',
      major: 'Công nghệ thông tin',
      year: '2',
      availableFrom: '2024-02-01',
      contactName: 'Debug User',
      contactPhone: '0123456789',
      interests: ['Đọc sách'],
      lifestyle: ['Sạch sẽ'],
      images: [],
      type: 'roommate-search',
      authorId: currentUser.uid,
      authorName: 'Debug User',
      authorPhone: '0123456789',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    };

    try {
      const result = await postsService.createPost(testData);
      addResult(`✅ Post created with ID: ${result}`);
    } catch (error) {
      addResult(`❌ Error creating post: ${error.message}`);
    }
  };

  const testFirebaseConnection = async () => {
    addResult('Testing Firebase connection...');
    
    try {
      // Import Firebase directly to test connection
      const { db } = await import('../firebase/config');
      if (db) {
        addResult('✅ Firebase database initialized');
        
        // Try a simple collection reference
        const { collection } = await import('firebase/firestore');
        const postsRef = collection(db, 'posts');
        addResult('✅ Posts collection reference created');
        
        // Try to get docs count
        const { getDocs } = await import('firebase/firestore');
        const snapshot = await getDocs(postsRef);
        addResult(`✅ Successfully queried Firebase: ${snapshot.docs.length} documents found`);
        
        snapshot.docs.forEach((doc, index) => {
          const data = doc.data();
          addResult(`  ${index + 1}. ${data.title || 'No title'} (ID: ${doc.id})`);
        });
      } else {
        addResult('❌ Firebase database not initialized');
      }
    } catch (error) {
      addResult(`❌ Firebase connection error: ${error.message}`);
    }
  };

  const testGetAllPosts = async () => {
    addResult('Testing get all posts...');
    
    try {
      const result = await postsService.getPosts({});
      addResult(`✅ Found ${result.posts.length} total posts`);
      result.posts.forEach((post, index) => {
        addResult(`  ${index + 1}. ${post.title} (ID: ${post.id}, Author: ${post.authorId})`);
      });
    } catch (error) {
      addResult(`❌ Error getting posts: ${error.message}`);
    }
  };

  const testGetUserPosts = async () => {
    addResult('Testing get user posts...');
    
    if (!currentUser) {
      addResult('❌ No current user');
      return;
    }

    try {
      const userPosts = await postsService.getPostsByUser(currentUser.uid);
      addResult(`✅ Found ${userPosts.length} posts for user ${currentUser.uid}`);
      userPosts.forEach((post, index) => {
        addResult(`  ${index + 1}. ${post.title} (ID: ${post.id})`);
      });
    } catch (error) {
      addResult(`❌ Error getting user posts: ${error.message}`);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Debug Page</h1>
          
          {currentUser ? (
            <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
              <p className="text-green-800">
                <strong>Current User:</strong> {currentUser.email} (ID: {currentUser.uid})
              </p>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
              <p className="text-red-800">❌ No user logged in</p>
            </div>
          )}

          <div className="flex gap-3 mb-6 flex-wrap">
            <button
              onClick={testFirebaseConnection}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Test Firebase Connection
            </button>
            <button
              onClick={testCreatePost}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Test Create Post
            </button>
            <button
              onClick={testGetAllPosts}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Test Get All Posts
            </button>
            <button
              onClick={testGetUserPosts}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Test Get User Posts
            </button>
            <button
              onClick={clearResults}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Clear Results
            </button>
          </div>

          <div className="bg-gray-900 text-green-400 rounded p-4 h-96 overflow-y-auto font-mono text-sm">
            <div className="mb-2">🔍 Debug Console:</div>
            {results.length === 0 ? (
              <div className="text-gray-500">No results yet. Click a button to test functions.</div>
            ) : (
              results.map((result, index) => (
                <div key={index} className="mb-1">
                  <span className="text-gray-400">[{result.time}]</span> {result.message}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Debug; 