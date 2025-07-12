import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import SearchPosts from './pages/SearchPosts';
import PostDetail from './pages/PostDetail';
import Suggestions from './pages/Suggestions';
import Connections from './pages/Connections';
import FirebaseTest from './test/FirebaseTest';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/search" element={<SearchPosts />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/firebase-test" element={<FirebaseTest />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
