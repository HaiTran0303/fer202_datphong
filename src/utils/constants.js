export const LOCATIONS = [
  'Hồ Chí Minh', 
  'Hà Nội', 
  'Đà Nẵng', 
  'Cần Thơ', 
  'Quy Nhơn'
];

export const DISTRICTS = {
  'Hồ Chí Minh': [
    'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6',
    'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10', 'Quận 11', 'Quận 12',
    'Bình Thạnh', 'Phú Nhuận', 'Tân Bình', 'Tân Phú', 'Gò Vấp', 'Bình Tân', 'Thủ Đức', 'Bình Chánh', 'Nhà Bè', 'Hóc Môn', 'Củ Chi', 'Cần Giờ'
  ],
  'Hà Nội': [
    'Ba Đình', 'Hoàn Kiếm', 'Tây Hồ', 'Long Biên', 'Cầu Giấy', 'Đống Đa', 'Hai Bà Trưng', 'Hoàng Mai', 'Thanh Xuân', 'Hà Đông', 'Nam Từ Liêm', 'Bắc Từ Liêm', 'Thanh Trì', 'Gia Lâm', 'Đông Anh', 'Sóc Sơn', 'Mê Linh', 'Sơn Tây', 'Ba Vì', 'Phúc Thọ', 'Đan Phượng', 'Hoài Đức', 'Quốc Oai', 'Thạch Thất', 'Chương Mỹ', 'Thanh Oai', 'Thường Tín', 'Phú Xuyên', 'Ứng Hòa', 'Mỹ Đức'
  ],
  'Đà Nẵng': [
    'Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu', 'Cẩm Lệ', 'Hòa Vang', 'Hoàng Sa'
  ],
  'Cần Thơ': [
    'Ninh Kiều', 'Bình Thủy', 'Cái Răng', 'Ô Môn', 'Thốt Nốt', 'Phong Điền', 'Cờ Đỏ', 'Vĩnh Thạnh', 'Thới Lai'
  ],
  'Quy Nhơn': [
    'Quy Nhơn', 'An Nhơn', 'Tuy Phước', 'Phù Cát', 'Phù Mỹ', 'Hoài Nhơn', 'Hoài Ân', 'Tây Sơn', 'Vân Canh', 'Vĩnh Thạnh', 'An Lão'
  ]
};

export const CATEGORIES = [
  'Phòng trọ',
  'Nhà nguyên căn',
  'Căn hộ chung cư',
  'Căn hộ mini',
  'Căn hộ dịch vụ',
  'Ở ghép',
  'Mặt bằng'
];

export const PRICE_RANGES = [
  { label: 'Dưới 1 triệu', min: 0, max: 1000000 },
  { label: 'Từ 1 - 2 triệu', min: 1000000, max: 2000000 },
  { label: 'Từ 2 - 3 triệu', min: 2000000, max: 3000000 },
  { label: 'Từ 3 - 5 triệu', min: 3000000, max: 5000000 },
  { label: 'Từ 5 - 7 triệu', min: 5000000, max: 7000000 },
  { label: 'Trên 7 triệu', min: 7000000, max: Infinity }
];

export const AREA_RANGES = [
  { label: 'Dưới 20 m²', min: 0, max: 20 },
  { label: 'Từ 20 - 30m²', min: 20, max: 30 },
  { label: 'Từ 30 - 50m²', min: 30, max: 50 },
  { label: 'Trên 50m²', min: 50, max: Infinity }
];

export const AMENITIES_LIST = [
  'Máy lạnh', 'Wifi', 'Giường', 'Tủ quần áo', 'Bàn học', 
  'Tủ lạnh', 'Máy giặt', 'Bếp', 'Ban công', 'Thang máy',
  'Sân vườn', 'Bãi đậu xe', 'An ninh 24/7'
];
