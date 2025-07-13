import { postsService } from './firebase';

// Sample posts data
const samplePosts = [
  {
    title: 'PHÒNG TRỌ MỚI RẤT ĐẸP SỐ 373/1 ĐƯỜNG LÝ THƯỜNG KIỆT, QUẬN TÂN BÌNH - GẦN BÊN TRƯỜNG ĐH BÁCH KHOA',
    description: 'PHÒNG TRỌ MỚI, ĐẸP SỐ 373/1/2a LÝ THƯỜNG KIỆT, GẦN ĐH BÁCH KHOA - Phòng nằm ngay trung tâm quận Tân Bình (xem hình thật). HẼM THÔNG, HẼM TO cách ĐƯỜNG LÝ THƯỜNG KIỆT chỉ 50m. Gần trường Đại học Bách Khoa, Đại học Công nghiệp, Đại học Tôn Đức Thắng...',
    price: 3900000,
    area: 25,
    location: 'Hồ Chí Minh',
    district: 'Tân Bình',
    category: 'Phòng trọ',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571508601891-ca5e7a713859?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Máy lạnh', 'Wifi', 'Giường', 'Tủ quần áo', 'Bàn học'],
    utilities: ['Điện', 'Nước', 'Internet'],
    deposit: 1000000,
    contact: {
      name: 'Anh Hiếu',
      phone: '0918180057',
      email: 'hieu@example.com'
    },
    address: '373/1 Đường Lý Thường Kiệt, Phường 7, Quận Tân Bình, TP.HCM',
    userId: 'user1',
    featured: true,
    rating: 5,
    views: 245,
    likes: 12
  },
  {
    title: 'Cho thuê phòng trọ có ban công, máy lạnh, thang máy giá 2.5 - 2.7tr tại P15, Q Tân Bình',
    description: 'Phòng trọ đẹp. Nằm trên trục đường chính số 346 PHẠM VĂN BẠCH, Phía sau Sân Bay Tân Sơn Nhất, gần eTown Công hòa, thuận tiện đi tất cả các Quận. Phòng có ban công, máy lạnh, thang máy, an ninh tốt.',
    price: 2500000,
    area: 20,
    location: 'Hồ Chí Minh',
    district: 'Tân Bình',
    category: 'Phòng trọ',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Máy lạnh', 'Ban công', 'Thang máy', 'Wifi', 'Giường'],
    utilities: ['Điện', 'Nước', 'Internet'],
    deposit: 2000000,
    contact: {
      name: 'Chị Mai',
      phone: '0908123456',
      email: 'mai@example.com'
    },
    address: '346 Phạm Văn Bạch, Phường 15, Quận Tân Bình, TP.HCM',
    userId: 'user2',
    featured: true,
    rating: 5,
    views: 189,
    likes: 8
  },
  {
    title: 'CHO THUÊ PHÒNG TRỌ MỚI CHÍNH CHỦ, GIẢM GIÁ, QUẬN TÂN PHÚ - GẦN BÊN TRƯỜNG ĐH CÔNG NGHỆ THỰC PHẨM',
    description: 'PHÒNG TRỌ 24 SƠN KỲ TÂN PHÚ, GẦN ĐH CÔNG NGHỆ THỰC PHẨM - Cách trường Đại Học Công nghệ Thực Phẩm 700m, cách AeOnMall Tân Phú 500m, Gần eTown, PanDoRa. An ninh tốt, môi trường sạch sẽ.',
    price: 2900000,
    area: 20,
    location: 'Hồ Chí Minh',
    district: 'Tân Phú',
    category: 'Phòng trọ',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571508601891-ca5e7a713859?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Máy lạnh', 'Wifi', 'Giường', 'Tủ quần áo', 'Bàn học', 'Tủ lạnh'],
    utilities: ['Điện', 'Nước', 'Internet'],
    deposit: 1500000,
    contact: {
      name: 'Anh Tuấn',
      phone: '0912345678',
      email: 'tuan@example.com'
    },
    address: '24 Sơn Kỳ, Phường Sơn Kỳ, Quận Tân Phú, TP.HCM',
    userId: 'user3',
    featured: false,
    rating: 4,
    views: 156,
    likes: 6
  },
  {
    title: 'CĂN HỘ DUPLEX CỬA SỔ THOÁNG - FULL NỘI THẤT P.TÂN HƯNG Q.7 GẦN CRESENT MALL, LOTTE, RMIT, TDTU, Q1-4',
    description: 'Căn hộ duplex 2 tầng, thiết kế hiện đại, đầy đủ nội thất cao cấp. Gần các trường đại học và trung tâm thương mại. Vị trí thuận tiện di chuyển đến quận 1, quận 4.',
    price: 5000000,
    area: 45,
    location: 'Hồ Chí Minh',
    district: 'Quận 7',
    category: 'Căn hộ chung cư',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571508601891-ca5e7a713859?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Máy lạnh', 'Wifi', 'Giường', 'Tủ quần áo', 'Bàn học', 'Tủ lạnh', 'Máy giặt', 'Bếp', 'Sofa'],
    utilities: ['Điện', 'Nước', 'Internet', 'Cáp TV'],
    deposit: 5000000,
    contact: {
      name: 'Chị Linh',
      phone: '0909876543',
      email: 'linh@example.com'
    },
    address: 'Phường Tân Hưng, Quận 7, TP.HCM',
    userId: 'user4',
    featured: true,
    rating: 5,
    views: 312,
    likes: 18
  },
  {
    title: 'Duplex bancon siêu đẹp 30m2 - 656 Quang Trung F11 Gò Vấp',
    description: 'Phòng duplex có ban công rộng rãi, thoáng mát. Nằm trên đường Quang Trung, giao thông thuận tiện. Đầy đủ tiện nghi, an ninh tốt.',
    price: 4500000,
    area: 30,
    location: 'Hồ Chí Minh',
    district: 'Gò Vấp',
    category: 'Căn hộ mini',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Máy lạnh', 'Ban công', 'Wifi', 'Giường', 'Tủ quần áo', 'Bàn học', 'Tủ lạnh'],
    utilities: ['Điện', 'Nước', 'Internet'],
    deposit: 3000000,
    contact: {
      name: 'Anh Đức',
      phone: '0918765432',
      email: 'duc@example.com'
    },
    address: '656 Quang Trung, Phường 11, Quận Gò Vấp, TP.HCM',
    userId: 'user5',
    featured: false,
    rating: 4,
    views: 198,
    likes: 9
  },
  {
    title: 'Phòng trọ Hà Nội - Gần Đại học Bách Khoa, giá tốt sinh viên',
    description: 'Phòng trọ dành cho sinh viên, gần các trường đại học. Giá cả hợp lý, môi trường an toàn, sạch sẽ. Đầy đủ tiện nghi cơ bản.',
    price: 2200000,
    area: 18,
    location: 'Hà Nội',
    district: 'Hai Bà Trưng',
    category: 'Phòng trọ',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Wifi', 'Giường', 'Tủ quần áo', 'Bàn học'],
    utilities: ['Điện', 'Nước', 'Internet'],
    deposit: 1500000,
    contact: {
      name: 'Chị Hương',
      phone: '0987654321',
      email: 'huong@example.com'
    },
    address: 'Phường Bách Khoa, Quận Hai Bà Trưng, Hà Nội',
    userId: 'user6',
    featured: false,
    rating: 4,
    views: 123,
    likes: 5
  },
  {
    title: 'Nhà nguyên căn 2 tầng Đà Nẵng - Gần biển, full nội thất',
    description: 'Nhà nguyên căn 2 tầng, gần biển Mỹ Khê. Đầy đủ nội thất, có sân vườn, garage để xe. Phù hợp cho gia đình hoặc nhóm bạn.',
    price: 8000000,
    area: 80,
    location: 'Đà Nẵng',
    district: 'Ngũ Hành Sơn',
    category: 'Nhà nguyên căn',
    images: [
      'https://images.unsplash.com/photo-1571508601891-ca5e7a713859?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Máy lạnh', 'Wifi', 'Giường', 'Tủ quần áo', 'Bàn học', 'Tủ lạnh', 'Máy giặt', 'Bếp', 'Sofa', 'Sân vườn'],
    utilities: ['Điện', 'Nước', 'Internet', 'Cáp TV'],
    deposit: 10000000,
    contact: {
      name: 'Anh Nam',
      phone: '0905432109',
      email: 'nam@example.com'
    },
    address: 'Phường Mỹ An, Quận Ngũ Hành Sơn, Đà Nẵng',
    userId: 'user7',
    featured: true,
    rating: 5,
    views: 456,
    likes: 23
  },
  {
    title: 'Mặt bằng kinh doanh trung tâm Cần Thơ - Vị trí đẹp',
    description: 'Mặt bằng kinh doanh tại trung tâm thành phố Cần Thơ. Vị trí đẹp, giao thông thuận tiện, phù hợp mở cửa hàng, quán ăn, văn phòng.',
    price: 12000000,
    area: 50,
    location: 'Cần Thơ',
    district: 'Ninh Kiều',
    category: 'Mặt bằng',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571508601891-ca5e7a713859?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Điện 3 pha', 'Nước', 'Internet', 'Bãi đậu xe'],
    utilities: ['Điện', 'Nước', 'Internet'],
    deposit: 20000000,
    contact: {
      name: 'Ông Hải',
      phone: '0913456789',
      email: 'hai@example.com'
    },
    address: 'Phường Xuân Khánh, Quận Ninh Kiều, Cần Thơ',
    userId: 'user8',
    featured: false,
    rating: 4,
    views: 234,
    likes: 11
  }
];

// Function to seed data
export const seedPosts = async () => {
  try {
    console.log('Bắt đầu seed dữ liệu...');
    
    for (let i = 0; i < samplePosts.length; i++) {
      const post = samplePosts[i];
      const postId = await postsService.createPost(post);
      console.log(`Đã tạo post ${i + 1}/${samplePosts.length}: ${postId}`);
    }
    
    console.log('Hoàn thành seed dữ liệu!');
    return true;
  } catch (error) {
    console.error('Lỗi khi seed dữ liệu:', error);
    return false;
  }
};

// Function to clear all posts (for testing)
export const clearAllPosts = async () => {
  try {
    console.log('Bắt đầu xóa tất cả posts...');
    
    const { posts } = await postsService.getPosts(100); // Get all posts
    
    for (const post of posts) {
      await postsService.deletePost(post.id);
      console.log(`Đã xóa post: ${post.id}`);
    }
    
    console.log('Hoàn thành xóa tất cả posts!');
    return true;
  } catch (error) {
    console.error('Lỗi khi xóa posts:', error);
    return false;
  }
};

export default { seedPosts, clearAllPosts }; 