import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import SearchPosts from './pages/SearchPosts';
import PostDetail from './pages/PostDetail';
import Suggestions from './pages/Suggestions';
import Connections from './pages/Connections';
import Login from './pages/Login';
import Register from './pages/Register';
import Ratings from './pages/Ratings';
import MyPosts from './pages/MyPosts';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import FirebaseTest from './test/FirebaseTest';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ErrorBoundary from './components/ErrorBoundary';
import DemoModal from './components/DemoModal';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DemoModal />
        <Router>
          <Routes>
            {/* Auth Routes - without Layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* App Routes - with Layout */}
            <Route path="*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/create-post" element={<CreatePost />} />
                  <Route path="/search" element={<SearchPosts />} />
                  <Route path="/post/:id" element={<PostDetail />} />
                  <Route path="/suggestions" element={<Suggestions />} />
                  <Route path="/connections" element={<Connections />} />
                  <Route path="/ratings" element={<Ratings />} />
                  <Route path="/my-posts" element={<MyPosts />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/firebase-test" element={<FirebaseTest />} />
                  
                  {/* Category Routes */}
                  <Route path="/nha-nguyen-can" element={<Home />} />
                  <Route path="/can-ho-chung-cu" element={<Home />} />
                  <Route path="/can-ho-mini" element={<Home />} />
                  <Route path="/can-ho-dich-vu" element={<Home />} />
                  <Route path="/o-ghep" element={<Home />} />
                  <Route path="/mat-bang" element={<Home />} />
                  <Route path="/blog" element={<Home />} />
                  <Route path="/bang-gia" element={<Home />} />
                  
                  {/* Location Routes */}
                  <Route path="/ho-chi-minh" element={<Home />} />
                  <Route path="/ha-noi" element={<Home />} />
                  <Route path="/da-nang" element={<Home />} />
                  <Route path="/saved" element={<Home />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
