import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { postsService } from '../utils/firebase';
import { User, Mail, Phone, School, MapPin, Edit, Save, X, Camera, Star, Heart, Home, CheckCircle, Upload, AlertCircle } from 'lucide-react';

function Profile() {
  const { currentUser, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    school: '',
    major: '',
    year: '',
    gender: '',
    city: '',
    bio: '',
    interests: [],
    lookingFor: {
      gender: '',
      ageRange: '',
      budget: '',
      location: '',
      lifestyle: []
    }
  });
  const [userStats, setUserStats] = useState({
    postsCount: 0,
    connectionsCount: 0,
    rating: 0
  });

  useEffect(() => {
    if (currentUser) {
      loadUserProfile();
      loadUserStats();
    }
  }, [currentUser]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      
      if (!currentUser || !db) {
        // Set basic info if Firebase not available
        setProfileData(prev => ({
          ...prev,
          fullName: currentUser?.displayName || '',
          email: currentUser?.email || '',
        }));
        return;
      }
      
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setProfileData(prev => ({
          ...prev,
          ...userData,
          fullName: userData.fullName || currentUser.displayName || '',
          email: userData.email || currentUser.email || '',
        }));
        
        // Load basic user stats from profile
        setUserStats(prev => ({
          ...prev,
          connectionsCount: userData.connectionsCount || 0,
          rating: userData.rating || 4.5, // Default demo rating
          profileViews: userData.profileViews || Math.floor(Math.random() * 50) + 10, // Demo views
          joinDate: userData.createdAt || currentUser.metadata?.creationTime || ''
        }));
      } else {
        // Initialize with basic info if no profile exists
        setProfileData(prev => ({
          ...prev,
          fullName: currentUser.displayName || '',
          email: currentUser.email || '',
        }));
        setUserStats(prev => ({
          ...prev,
          rating: 4.5, // Default demo rating
          profileViews: Math.floor(Math.random() * 50) + 10, // Demo views
          joinDate: currentUser.metadata?.creationTime || ''
        }));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setMessage({ type: 'error', text: 'Không thể tải thông tin hồ sơ' });
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      if (!currentUser) {
        console.log('No current user, skipping stats load');
        return;
      }
      
      console.log('Loading stats for user:', currentUser.uid, currentUser.email);
      
      // Get user's posts count from Firebase
      const userPosts = await postsService.getPostsByUser(currentUser.uid);
      console.log('User posts found:', userPosts.length, userPosts);
      
      // Calculate demo connections and rating based on posts
      const demoConnections = Math.max(userPosts.length * 2, 5) + Math.floor(Math.random() * 5);
      const demoRating = userPosts.length > 0 ? 4.2 + (Math.random() * 0.6) : 4.5;
      
      // Update stats with real and demo data
      setUserStats(prev => ({
        ...prev,
        postsCount: userPosts.length,
        connectionsCount: demoConnections,
        rating: parseFloat(demoRating.toFixed(1)),
        profileViews: prev.profileViews || Math.floor(Math.random() * 50) + 20
      }));
      
      console.log('Stats updated:', {
        postsCount: userPosts.length,
        connectionsCount: demoConnections,
        rating: parseFloat(demoRating.toFixed(1))
      });
      
    } catch (error) {
      console.error('Error loading user stats:', error);
      // Set demo data if Firebase fails
      const demoPosts = Math.floor(Math.random() * 3) + 1;
      const demoConnections = Math.floor(Math.random() * 10) + 5;
      const demoRating = 4.0 + (Math.random() * 1.0);
      
      setUserStats(prev => ({
        ...prev,
        postsCount: demoPosts,
        connectionsCount: demoConnections,
        rating: parseFloat(demoRating.toFixed(1)),
        profileViews: prev.profileViews || Math.floor(Math.random() * 50) + 20
      }));
      
      console.log('Used demo stats due to error:', {
        postsCount: demoPosts,
        connectionsCount: demoConnections,
        rating: parseFloat(demoRating.toFixed(1))
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLookingForChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      lookingFor: {
        ...prev.lookingFor,
        [name]: value
      }
    }));
  };

  const handleInterestToggle = (interest) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleLifestyleToggle = (lifestyle) => {
    setProfileData(prev => ({
      ...prev,
      lookingFor: {
        ...prev.lookingFor,
        lifestyle: prev.lookingFor.lifestyle.includes(lifestyle)
          ? prev.lookingFor.lifestyle.filter(l => l !== lifestyle)
          : [...prev.lookingFor.lifestyle, lifestyle]
      }
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      if (currentUser && db) {
        // Save to Firestore
        await setDoc(doc(db, 'users', currentUser.uid), {
          ...profileData,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        
        // Update Firebase Auth profile
        await updateUserProfile(profileData.fullName, null);
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const commonInterests = [
    'Đọc sách', 'Xem phim', 'Nghe nhạc', 'Du lịch', 'Thể thao', 'Nấu ăn',
    'Chơi game', 'Nhiếp ảnh', 'Học ngoại ngữ', 'Yoga', 'Gym', 'Vẽ'
  ];

  const lifestyleOptions = [
    'Sạch sẽ', 'Yên tĩnh', 'Thân thiện', 'Không hút thuốc', 'Không uống rượu',
    'Dậy sớm', 'Đi ngủ muộn', 'Thích nấu ăn', 'Thích tiệc tùng', 'Học tập nhiều'
  ];

  const tabs = [
    { id: 'info', label: 'Thông tin cá nhân', icon: <User size={20} /> },
    { id: 'preferences', label: 'Tiêu chí tìm bạn', icon: <Heart size={20} /> },
    { id: 'interests', label: 'Sở thích', icon: <Star size={20} /> }
  ];

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">Vui lòng đăng nhập để xem hồ sơ</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải thông tin hồ sơ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Message Alert */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-md flex items-center ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle size={20} className="mr-2" />
          ) : (
            <AlertCircle size={20} className="mr-2" />
          )}
          {message.text}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <User size={40} className="text-blue-600" />
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                <Camera size={16} />
              </button>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">
                {profileData.fullName || 'Chưa cập nhật tên'}
              </h1>
              <p className="text-blue-100">{profileData.email}</p>
              <p className="text-blue-100">{profileData.school || 'Chưa cập nhật trường'}</p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-6 pt-4 border-t border-blue-400">
                <div className="text-center">
                  <div className="text-2xl font-bold">{userStats.postsCount || 0}</div>
                  <div className="text-blue-100 text-sm">Bài đăng</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userStats.connectionsCount || 0}</div>
                  <div className="text-blue-100 text-sm">Kết nối</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-2xl font-bold">
                    {(userStats.rating || 0).toFixed(1)}
                    <Star size={18} className="ml-1" fill="currentColor" />
                  </div>
                  <div className="text-blue-100 text-sm">Đánh giá</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                >
                  {isEditing ? <X size={20} /> : <Edit size={20} />}
                  <span>{isEditing ? 'Hủy' : 'Chỉnh sửa'}</span>
                </button>
              </div>

              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trường học
                    </label>
                    <input
                      type="text"
                      name="school"
                      value={profileData.school}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngành học
                    </label>
                    <select
                      name="major"
                      value={profileData.major}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Chọn ngành học</option>
                      <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                      <option value="Kinh tế">Kinh tế</option>
                      <option value="Y học">Y học</option>
                      <option value="Luật">Luật</option>
                      <option value="Kỹ thuật">Kỹ thuật</option>
                      <option value="Khoa học tự nhiên">Khoa học tự nhiên</option>
                      <option value="Ngoại ngữ">Ngoại ngữ</option>
                      <option value="Thiết kế">Thiết kế</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Năm học
                    </label>
                    <select
                      name="year"
                      value={profileData.year}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Chọn năm</option>
                      <option value="1">Năm 1</option>
                      <option value="2">Năm 2</option>
                      <option value="3">Năm 3</option>
                      <option value="4">Năm 4</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giới tính
                    </label>
                    <select
                      name="gender"
                      value={profileData.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thành phố
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={profileData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giới thiệu bản thân
                    </label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Hãy viết vài dòng về bản thân..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Save size={20} />
                      <span>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="text-gray-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{profileData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="text-gray-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p className="font-medium">{profileData.phone || 'Chưa cập nhật'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <School className="text-gray-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Trường học</p>
                        <p className="font-medium">{profileData.school || 'Chưa cập nhật'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="text-gray-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Thành phố</p>
                        <p className="font-medium">{profileData.city || 'Chưa cập nhật'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="text-gray-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Giới tính</p>
                        <p className="font-medium">
                          {profileData.gender === 'male' ? 'Nam' : 
                           profileData.gender === 'female' ? 'Nữ' : 'Chưa cập nhật'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <School className="text-gray-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-500">Ngành học - Năm {profileData.year}</p>
                        <p className="font-medium">{profileData.major || 'Chưa cập nhật'}</p>
                      </div>
                    </div>
                  </div>
                  {profileData.bio && (
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-medium mb-2">Giới thiệu</h3>
                      <p className="text-gray-700">{profileData.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Tiêu chí tìm bạn ghép trọ</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới tính mong muốn
                  </label>
                  <select
                    name="gender"
                    value={profileData.lookingFor.gender}
                    onChange={handleLookingForChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Không quan trọng</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngân sách
                  </label>
                  <select
                    name="budget"
                    value={profileData.lookingFor.budget}
                    onChange={handleLookingForChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn ngân sách</option>
                    <option value="under-2m">Dưới 2 triệu</option>
                    <option value="2-3m">2-3 triệu</option>
                    <option value="3-4m">3-4 triệu</option>
                    <option value="4-5m">4-5 triệu</option>
                    <option value="above-5m">Trên 5 triệu</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Khu vực mong muốn
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={profileData.lookingFor.location}
                    onChange={handleLookingForChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ví dụ: Quận 1, gần trường học..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lối sống mong muốn
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {lifestyleOptions.map(option => (
                      <button
                        key={option}
                        onClick={() => handleLifestyleToggle(option)}
                        className={`p-2 text-sm rounded-md border ${
                          profileData.lookingFor.lifestyle.includes(option)
                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'interests' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Sở thích của bạn</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {commonInterests.map(interest => (
                  <button
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`p-3 text-sm rounded-lg border ${
                      profileData.interests.includes(interest)
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
              
              {profileData.interests.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Sở thích đã chọn:</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.interests.map(interest => (
                      <span
                        key={interest}
                        className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

export default Profile; 