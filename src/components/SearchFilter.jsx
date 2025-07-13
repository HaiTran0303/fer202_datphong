import { useState } from 'react';
import { Search, Filter, X, MapPin, DollarSign, Home } from 'lucide-react';
import { LOCATIONS, CATEGORIES, PRICE_RANGES, AREA_RANGES, AMENITIES_LIST } from '../utils/constants';

function SearchFilter({ onSearch, onFilter, initialFilters = {} }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    category: '',
    priceRange: '',
    areaRange: '',
    amenities: [],
    ...initialFilters
  });

  const [tempFilters, setTempFilters] = useState(filters);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle amenities toggle
  const toggleAmenity = (amenity) => {
    setTempFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  // Apply filters
  const applyFilters = () => {
    setFilters(tempFilters);
    
    // Convert filter format for API
    const apiFilters = {};
    
    if (tempFilters.location) {
      apiFilters.location = tempFilters.location;
    }
    
    if (tempFilters.category) {
      apiFilters.category = tempFilters.category;
    }
    
    if (tempFilters.priceRange) {
      const priceRange = PRICE_RANGES.find(p => p.label === tempFilters.priceRange);
      if (priceRange) {
        apiFilters.minPrice = priceRange.min;
        apiFilters.maxPrice = priceRange.max;
      }
    }
    
    if (tempFilters.areaRange) {
      const areaRange = AREA_RANGES.find(a => a.label === tempFilters.areaRange);
      if (areaRange) {
        apiFilters.minArea = areaRange.min;
        apiFilters.maxArea = areaRange.max;
      }
    }
    
    if (tempFilters.amenities.length > 0) {
      apiFilters.amenities = tempFilters.amenities;
    }
    
    onFilter(apiFilters);
    setShowFilters(false);
  };

  // Reset filters
  const resetFilters = () => {
    const emptyFilters = {
      location: '',
      category: '',
      priceRange: '',
      areaRange: '',
      amenities: []
    };
    setTempFilters(emptyFilters);
    setFilters(emptyFilters);
    onFilter({});
  };

  // Count active filters
  const activeFiltersCount = Object.values(filters).filter(value => 
    Array.isArray(value) ? value.length > 0 : value !== ''
  ).length;

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm phòng trọ, địa chỉ, tiện ích..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tìm kiếm
        </button>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2 ${
            showFilters ? 'bg-blue-50 border-blue-300' : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-4 h-4" />
          Bộ lọc
          {activeFiltersCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </form>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.location && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              <MapPin className="w-3 h-3" />
              {filters.location}
              <button
                onClick={() => handleFilterChange('location', '')}
                className="ml-1 hover:text-blue-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              <Home className="w-3 h-3" />
              {filters.category}
              <button
                onClick={() => handleFilterChange('category', '')}
                className="ml-1 hover:text-green-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.priceRange && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              <DollarSign className="w-3 h-3" />
              {filters.priceRange}
              <button
                onClick={() => handleFilterChange('priceRange', '')}
                className="ml-1 hover:text-yellow-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.areaRange && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              {filters.areaRange}
              <button
                onClick={() => handleFilterChange('areaRange', '')}
                className="ml-1 hover:text-purple-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.amenities.map(amenity => (
            <span key={amenity} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
              {amenity}
              <button
                onClick={() => toggleAmenity(amenity)}
                className="ml-1 hover:text-indigo-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={resetFilters}
            className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm underline"
          >
            Xóa tất cả
          </button>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <div className="border-t pt-4 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tỉnh/Thành phố
              </label>
              <select
                value={tempFilters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tất cả địa điểm</option>
                {LOCATIONS.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại hình
              </label>
              <select
                value={tempFilters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tất cả loại hình</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khoảng giá
              </label>
              <select
                value={tempFilters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tất cả mức giá</option>
                {PRICE_RANGES.map(range => (
                  <option key={range.label} value={range.label}>{range.label}</option>
                ))}
              </select>
            </div>

            {/* Area Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diện tích
              </label>
              <select
                value={tempFilters.areaRange}
                onChange={(e) => handleFilterChange('areaRange', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tất cả diện tích</option>
                {AREA_RANGES.map(range => (
                  <option key={range.label} value={range.label}>{range.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Amenities Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiện ích
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {AMENITIES_LIST.map(amenity => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempFilters.amenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Đặt lại
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={applyFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchFilter;
