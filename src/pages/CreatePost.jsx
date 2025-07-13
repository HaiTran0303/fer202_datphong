import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  MapPin,
  DollarSign,
  FileText,
  Image,
  CheckCircle,
  Upload,
  X,
  User,
  Phone,
  CreditCard,
  History,
  FileCheck,
  LogOut,
  Plus,
  AlertCircle,
  Tv,
  Filter,
  Heart,
  Settings,
  Search,
  Star,
  Eye,
  Calendar,
  Home,
  Shield,
  Tag,
  BarChart3,
  Clock,
  ChevronDown,
  Edit
} from 'lucide-react';

function CreatePost() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('area');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    district: '',
    ward: '',
    street: '',
    houseNumber: '',
    roomType: '',
    gender: '',
    maxPeople: '',
    availableFrom: '',
    area: '',
    amenities: [],
    rules: [],
    images: [],
    contactName: '',
    contactPhone: '',
    contactEmail: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files.map(file => URL.createObjectURL(file))]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.price || !formData.location) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const postData = {
        ...formData,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName,
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      
      console.log('Creating post:', postData);
      
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/search');
      }, 2000);
      
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Có lỗi xảy ra khi đăng bài. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'area', label: 'Khu vực', icon: <MapPin size={16} /> },
    { id: 'info', label: 'Thông tin mô tả', icon: <FileText size={16} /> },
    { id: 'images', label: 'Hình ảnh', icon: <Image size={16} /> },
    { id: 'video', label: 'Video', icon: <Tv size={16} /> },
    { id: 'contact', label: 'Thông tin liên hệ', icon: <Phone size={16} /> }
  ];

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-500 mb-4">Vui lòng đăng nhập để đăng bài</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đăng bài thành công!</h2>
          <p className="text-gray-600 mb-4">
            Bài đăng của bạn đã được tạo và sẽ hiển thị trong danh sách tìm kiếm.
          </p>
          <p className="text-sm text-gray-500">Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <Home className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">FPTRO.COM</h1>
                  <p className="text-xs text-blue-100">Kênh thông tin phòng trọ số 1 Việt Nam</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 hover:text-blue-200 cursor-pointer">
                <MapPin size={16} />
                <span>Tìm theo khu vực</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-blue-200 cursor-pointer">
                <Filter size={16} />
                <span>Bộ lọc</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-blue-200 cursor-pointer">
                <Heart size={16} />
                <span>Tin đã lưu</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-blue-200 cursor-pointer">
                <Settings size={16} />
                <span>Quản lý</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-500 px-3 py-1 rounded-full">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-medium">{currentUser.displayName || 'Trần Hoàng Hải'}</span>
                <ChevronDown size={16} />
              </div>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Đăng tin
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <a href="#" className="text-orange-500 border-b-2 border-orange-500 py-4 px-0 text-sm font-medium">
              Phòng trọ
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-500 py-4 px-0 text-sm font-medium">
              Nhà nguyên căn
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-500 py-4 px-0 text-sm font-medium">
              Căn hộ chung cư
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-500 py-4 px-0 text-sm font-medium">
              Căn hộ mini
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-500 py-4 px-0 text-sm font-medium">
              Căn hộ dịch vụ
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-500 py-4 px-0 text-sm font-medium">
              Ở ghép
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-500 py-4 px-0 text-sm font-medium">
              Mặt bằng
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-500 py-4 px-0 text-sm font-medium">
              Blog
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-500 py-4 px-0 text-sm font-medium">
              Bảng giá dịch vụ
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Advertisement */}
          <div className="w-[180px] space-y-4">
            <div className="bg-gradient-to-b from-red-600 to-red-700 text-white rounded-lg p-4 text-center shadow-lg">
              <div className="bg-yellow-400 text-black rounded-full px-3 py-1 text-xs font-bold mb-3">
                fptro.vn
              </div>
              <div className="text-sm font-bold mb-1">CHUYÊN TRANG</div>
              <div className="text-2xl font-bold leading-tight">BẤT</div>
              <div className="text-2xl font-bold leading-tight">ĐỘNG</div>
              <div className="text-2xl font-bold leading-tight">SÂN</div>
              <div className="mt-3 text-xs opacity-90">Tìm kiếm nhanh chóng</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
                <h1 className="text-xl font-bold text-gray-900">Đăng tin cho thuê</h1>
                <p className="text-sm text-gray-600 mt-1">Hoàn thành thông tin để đăng tin nhanh chóng</p>
              </div>

              {/* Tabs */}
              <div className="border-b bg-gray-50">
                <nav className="flex space-x-0">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-orange-500 text-orange-600 bg-white'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                    <AlertCircle size={20} className="mr-3" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Khu vực Tab */}
                  {activeTab === 'area' && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-medium text-blue-900 mb-2">Thông tin khu vực</h3>
                        <p className="text-sm text-blue-700">Chọn khu vực để hiển thị tin đăng chính xác</p>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Loại chuyên mục <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            required
                          >
                            <option value="">-- Chọn loại chuyên mục --</option>
                            <option value="room">Phòng trọ</option>
                            <option value="house">Nhà nguyên căn</option>
                            <option value="apartment">Căn hộ chung cư</option>
                            <option value="mini">Căn hộ mini</option>
                            <option value="service">Căn hộ dịch vụ</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tỉnh/Thành phố <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="province"
                              value={formData.province}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              required
                            >
                              <option value="">-- Chọn Tỉnh/TP --</option>
                              <option value="ho-chi-minh">Hồ Chí Minh</option>
                              <option value="ha-noi">Hà Nội</option>
                              <option value="da-nang">Đà Nẵng</option>
                              <option value="binh-duong">Bình Dương</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Quận/Huyện <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="district"
                              value={formData.district}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              required
                            >
                              <option value="">-- Chọn quận huyện --</option>
                              <option value="quan-1">Quận 1</option>
                              <option value="quan-2">Quận 2</option>
                              <option value="quan-3">Quận 3</option>
                              <option value="quan-4">Quận 4</option>
                              <option value="quan-5">Quận 5</option>
                              <option value="quan-6">Quận 6</option>
                              <option value="quan-7">Quận 7</option>
                              <option value="quan-8">Quận 8</option>
                              <option value="quan-9">Quận 9</option>
                              <option value="quan-10">Quận 10</option>
                              <option value="quan-11">Quận 11</option>
                              <option value="quan-12">Quận 12</option>
                              <option value="quan-binh-thanh">Quận Bình Thạnh</option>
                              <option value="quan-phu-nhuan">Quận Phú Nhuận</option>
                              <option value="quan-tan-binh">Quận Tân Bình</option>
                              <option value="quan-tan-phu">Quận Tân Phú</option>
                              <option value="quan-go-vap">Quận Gò Vấp</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phường/Xã
                            </label>
                            <select
                              name="ward"
                              value={formData.ward}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                              <option value="">-- Chọn phường xã --</option>
                              <option value="phuong-1">Phường 1</option>
                              <option value="phuong-2">Phường 2</option>
                              <option value="phuong-3">Phường 3</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Đường/Phố
                            </label>
                            <select
                              name="street"
                              value={formData.street}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                              <option value="">-- Chọn đường phố --</option>
                              <option value="le-van-sy">Lê Văn Sỹ</option>
                              <option value="nguyen-thi-minh-khai">Nguyễn Thị Minh Khai</option>
                              <option value="vo-van-tan">Võ Văn Tần</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Số nhà
                            </label>
                            <input
                              type="text"
                              name="houseNumber"
                              value={formData.houseNumber}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="Nhập số nhà"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Địa chỉ
                            </label>
                            <input
                              type="text"
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="Địa chỉ"
                              required
                            />
                          </div>
                        </div>

                        {/* Bản đồ */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bản đồ</h3>
                          <div className="bg-gray-100 border-2 border-dashed border-gray-300 h-64 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500">Bản đồ sẽ hiển thị ở đây</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Thông tin mô tả Tab */}
                  {activeTab === 'info' && (
                    <div className="space-y-6">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="font-medium text-green-900 mb-2">Thông tin mô tả</h3>
                        <p className="text-sm text-green-700">Mô tả chi tiết giúp tìm được khách thuê phù hợp</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tiêu đề <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Nhập tiêu đề"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">(Tối thiểu 30 ký tự, tối đa 100 ký tự)</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nội dung mô tả <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={8}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Nhập nội dung mô tả"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">(Tối thiểu 50 ký tự, tối đa 5000 ký tự)</p>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Giá cho thuê <span className="text-red-500">*</span>
                          </label>
                          <div className="flex">
                            <input
                              type="number"
                              name="price"
                              value={formData.price}
                              onChange={handleInputChange}
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="Nhập giá"
                              required
                            />
                            <select
                              name="priceUnit"
                              className="px-4 py-3 border border-gray-300 border-l-0 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
                            >
                              <option value="dong/thang">đồng/tháng</option>
                              <option value="dong/ngay">đồng/ngày</option>
                            </select>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Nhập đầy đủ số, ví dụ 1 triệu thì nhập là 1000000</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Diện tích <span className="text-red-500">*</span>
                          </label>
                          <div className="flex">
                            <input
                              type="number"
                              name="area"
                              value={formData.area}
                              onChange={handleInputChange}
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="Nhập diện tích"
                              required
                            />
                            <div className="px-4 py-3 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg">
                              m²
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Đặc điểm nổi bật</h3>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { id: 'furnished', label: 'Đầy đủ nội thất' },
                            { id: 'parking', label: 'Có chỗ để xe' },
                            { id: 'ac', label: 'Có điều hòa' },
                            { id: 'kitchen', label: 'Có bếp' },
                            { id: 'fridge', label: 'Có tủ lạnh' },
                            { id: 'washing', label: 'Có máy giặt' },
                            { id: 'elevator', label: 'Có thang máy' },
                            { id: 'balcony', label: 'Có ban công' },
                            { id: 'security', label: 'Bảo vệ 24/7' }
                          ].map((feature) => (
                            <div key={feature.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                              <input
                                type="checkbox"
                                id={feature.id}
                                name={feature.id}
                                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                              />
                              <label htmlFor={feature.id} className="ml-3 text-sm text-gray-700 cursor-pointer">
                                {feature.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hình ảnh Tab */}
                  {activeTab === 'images' && (
                    <div className="space-y-6">
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <h3 className="font-medium text-purple-900 mb-2">Hình ảnh</h3>
                        <p className="text-sm text-purple-700">Thêm hình ảnh để thu hút khách thuê</p>
                      </div>

                      <div>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
                          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-600 mb-4">
                            Kéo thả hoặc <span className="text-orange-500 font-medium">chọn ảnh</span> để tải lên
                          </p>
                          <p className="text-sm text-gray-500 mb-4">
                            Hỗ trợ định dạng JPG, PNG. Kích thước tối đa 5MB
                          </p>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg cursor-pointer font-medium transition-colors"
                          >
                            Chọn hình ảnh
                          </label>
                        </div>
                        
                        {formData.images.length > 0 && (
                          <div className="mt-6">
                            <h4 className="font-medium text-gray-900 mb-3">Ảnh đã tải lên ({formData.images.length})</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {formData.images.map((image, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={image}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Video Tab */}
                  {activeTab === 'video' && (
                    <div className="space-y-6">
                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                        <h3 className="font-medium text-indigo-900 mb-2">Video</h3>
                        <p className="text-sm text-indigo-700">Video giúp bạn có thêm lượt xem và tăng tỷ lệ cho thuê</p>
                      </div>

                      <div>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
                          <Tv className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-600 mb-4">
                            Kéo thả hoặc <span className="text-orange-500 font-medium">chọn video</span> để tải lên
                          </p>
                          <p className="text-sm text-gray-500 mb-4">
                            Hỗ trợ định dạng MP4, AVI. Kích thước tối đa 50MB
                          </p>
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            id="video-upload"
                          />
                          <label
                            htmlFor="video-upload"
                            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg cursor-pointer font-medium transition-colors"
                          >
                            Chọn video
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Thông tin liên hệ Tab */}
                  {activeTab === 'contact' && (
                    <div className="space-y-6">
                      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                        <h3 className="font-medium text-teal-900 mb-2">Thông tin liên hệ</h3>
                        <p className="text-sm text-teal-700">Thông tin để khách hàng liên hệ với bạn</p>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Họ và tên <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="contactName"
                            value={formData.contactName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Trần Hoàng Hải"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số điện thoại <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            name="contactPhone"
                            value={formData.contactPhone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="0972773693"
                            required
                          />
                        </div>
                      </div>

                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                        <h4 className="font-medium text-gray-900 mb-4">Xác nhận thông tin</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Loại tin đăng:</span>
                            <span className="text-sm font-medium">Phòng trọ</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Giá thuê:</span>
                            <span className="text-sm font-medium text-green-600">
                              {formData.price ? `${Number(formData.price).toLocaleString()} đồng/tháng` : 'Chưa nhập'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Diện tích:</span>
                            <span className="text-sm font-medium">
                              {formData.area ? `${formData.area} m²` : 'Chưa nhập'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 px-6 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                        >
                          {loading ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                              Đang đăng tin...
                            </div>
                          ) : (
                            'Đăng tin ngay →'
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 space-y-4">
            {/* User Info */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {currentUser.displayName || 'Trần Hoàng Hải'}
                  </h3>
                  <p className="text-sm text-gray-500">0972773693</p>
                  <p className="text-xs text-gray-400">Mã tài khoản: 154774</p>
                </div>
              </div>
              <div className="text-center bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-1">Số dư tài khoản</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">0</p>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  💳 Nạp tiền
                </button>
              </div>
            </div>

            {/* Management Menu */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">QUẢN LÝ TIN ĐĂNG</h3>
                <button className="text-orange-500 text-sm hover:underline">Xem tất cả</button>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <FileText size={20} className="text-gray-600" />
                    </div>
                    <p className="text-xs text-gray-600">Tất cả</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <CheckCircle size={20} className="text-green-600" />
                    </div>
                    <p className="text-xs text-gray-600">Đang hiển thị</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <Clock size={20} className="text-yellow-600" />
                    </div>
                    <p className="text-xs text-gray-600">Hết hạn</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <Eye size={20} className="text-red-600" />
                    </div>
                    <p className="text-xs text-gray-600">Tin ẩn</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 space-y-3">
                <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <Tag size={16} className="text-orange-500" />
                  <span className="text-sm font-medium text-gray-700">Bảng giá dịch vụ</span>
                </div>
                <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <BarChart3 size={16} className="text-orange-500" />
                  <span className="text-sm font-medium text-gray-700">Quản lý giao dịch</span>
                </div>
                <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <User size={16} className="text-orange-500" />
                  <span className="text-sm font-medium text-gray-700">Quản lý tài khoản</span>
                </div>
                <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <LogOut size={16} className="text-orange-500" />
                  <span className="text-sm font-medium text-gray-700">Đăng xuất</span>
                </div>
              </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">Tin mới đăng</h3>
              </div>
              <div className="p-4 space-y-4">
                {[
                  { title: 'Duplex balcon siêu đẹp 30m2 - 656 Quang Trung F11 Gò...', price: '4.5 triệu/tháng', time: '56 phút trước' },
                  { title: 'Phòng trọ nhà nguyên căn 1 trệt, 1 Gác cao, MT Hẻ...', price: '5.5 triệu/tháng', time: '2 giờ trước' },
                  { title: 'CHO THUÊ PHÒNG TRỌ NGAY CỔNG SAU CÔNG TY...', price: '1.5 triệu/tháng', time: '2 giờ trước' }
                ].map((post, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Home size={20} className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium mb-1 line-clamp-2">
                        {post.title}
                      </p>
                      <p className="text-sm text-green-600 font-medium">{post.price}</p>
                      <p className="text-xs text-gray-500">{post.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Advertisement */}
            <div className="bg-gradient-to-br from-teal-400 to-teal-500 rounded-lg p-4 text-center shadow-lg">
              <div className="text-white text-sm font-medium mb-2">thuecanho123</div>
              <div className="text-white text-xl font-bold mb-1">website</div>
              <div className="text-white text-xl font-bold mb-1">cho thuê</div>
              <div className="text-white text-xl font-bold mb-1">căn hộ</div>
              <div className="text-white text-xl font-bold mb-3">chung cư</div>
              <div className="bg-white rounded-lg p-2">
                <div className="w-full h-20 bg-gray-200 rounded flex items-center justify-center">
                  <Home size={24} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost; 