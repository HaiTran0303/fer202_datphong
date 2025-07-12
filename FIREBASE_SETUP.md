# 🔥 Hướng dẫn Setup Firebase

## Bước 1: Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Đặt tên project: `dat-phong-students`
4. Bỏ tích Google Analytics (không cần thiết)
5. Click "Create project"

## Bước 2: Thêm Web App

1. Vào project, click biểu tượng `</>`
2. Đặt tên app: "Dat Phong Web"
3. Không tích "Firebase Hosting"
4. Click "Register app"
5. **Copy Firebase config** (quan trọng!)

## Bước 3: Cấu hình Authentication

1. Vào **"Authentication"** → "Get started"
2. Chọn **"Sign-in method"**
3. Bật **"Email/Password"** → Save
4. (Tùy chọn) Bật **"Google"** sign-in

## Bước 4: Tạo Firestore Database

1. Vào **"Firestore Database"** → "Create database"
2. Chọn **"Start in test mode"** (sẽ cấu hình rules sau)
3. Chọn location: `asia-southeast1` (Singapore - gần VN)
4. Click "Done"

## Bước 5: Cấu hình Storage (để upload ảnh)

1. Vào **"Storage"** → "Get started"
2. Chọn **"Start in test mode"**
3. Chọn location: `asia-southeast1`
4. Click "Done"

## Bước 6: Cập nhật Config

Sau khi setup xong, bạn sẽ có config như này:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "dat-phong-students.firebaseapp.com",
  projectId: "dat-phong-students",
  storageBucket: "dat-phong-students.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789"
};
```

**Thay thế config trong file `src/firebase/config.js`**

## Bước 7: Cấu hình Firestore Rules

Vào **Firestore Database** → **Rules** và thay thế bằng:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Posts collection
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.authorId;
      allow create: if request.auth != null;
    }
    
    // Connections collection
    match /connections/{connectionId} {
      allow read, write: if request.auth != null;
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Bước 8: Cấu hình Storage Rules

Vào **Storage** → **Rules** và thay thế bằng:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Test Setup

Sau khi cấu hình xong, chạy:

```bash
npm run dev
```

Truy cập `http://localhost:5173` và test:
1. Đăng ký tài khoản mới
2. Đăng nhập
3. Kiểm tra Firebase Console xem có data không

## Cấu trúc Database

### Users Collection
```javascript
{
  uid: "user_id",
  email: "user@example.com",
  fullName: "Nguyễn Văn A",
  phone: "0123456789",
  school: "Đại học FPT",
  major: "Công nghệ thông tin",
  yearOfStudy: "2",
  gender: "Nam",
  dateOfBirth: "2000-01-01",
  avatar: "url_to_avatar",
  bio: "Mô tả bản thân",
  isVerified: false,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

### Posts Collection
```javascript
{
  id: "post_id",
  authorId: "user_id",
  title: "Tìm bạn ghép trọ",
  description: "Mô tả chi tiết",
  location: "Quận 1, TP.HCM",
  budget: 3000000,
  roomType: "Phòng đôi",
  amenities: ["wifi", "dieu-hoa", "tu-lanh"],
  images: ["url1", "url2"],
  contactInfo: {
    phone: "0123456789",
    zalo: "0123456789",
    facebook: "facebook.com/user"
  },
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

## Troubleshooting

### Lỗi "Firebase: Error (auth/configuration-not-found)"
- Kiểm tra lại config trong `firebase/config.js`
- Đảm bảo Authentication đã được bật

### Lỗi "Firestore: Missing or insufficient permissions"
- Kiểm tra Firestore Rules
- Đảm bảo user đã đăng nhập

### Lỗi CORS khi upload ảnh
- Kiểm tra Storage Rules
- Đảm bảo domain được cho phép

## Liên hệ

Nếu có vấn đề, check Firebase Console → Usage để xem logs chi tiết. 