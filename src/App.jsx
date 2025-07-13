import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import SearchPosts from './pages/SearchPosts';
import PostDetail from './pages/PostDetail';
import Suggestions from './pages/Suggestions';
import Connections from './pages/Connections';
import FirebaseTest from './test/FirebaseTest';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/search" element={<SearchPosts />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/suggestions" element={<Suggestions />} />
          <Route path="/connections" element={<Connections />} />
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
    </Router>
  );
}

export default App;
