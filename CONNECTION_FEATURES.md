# 🔗 Chức năng Kết nối - Hướng dẫn sử dụng

## 📋 Tổng quan

Chức năng kết nối cho phép người dùng gửi lời mời kết nối với nhau dựa trên các bài đăng phòng trọ. Đây là một tính năng quan trọng để tạo cộng đồng và kết nối giữa các sinh viên tìm bạn cùng phòng.

## 🚀 Các tính năng chính

### 1. Gửi lời mời kết nối
- **Vị trí**: Trang chi tiết bài đăng (`/post/:id`)
- **Cách sử dụng**: 
  - Đăng nhập vào tài khoản
  - Xem bài đăng của người khác
  - Click nút "Gửi lời mời kết nối"
  - Nhập lời nhắn và gửi

### 2. Nhận thông báo kết nối
- **Vị trí**: Header (icon chuông thông báo)
- **Tính năng**:
  - Hiển thị số thông báo chưa đọc
  - Dropdown danh sách thông báo
  - Đánh dấu đã đọc
  - Link đến trang kết nối

### 3. Quản lý kết nối
- **Vị trí**: `/my-connections`
- **Tính năng**:
  - Xem lời mời đã nhận
  - Xem lời mời đã gửi
  - Chấp nhận/từ chối lời mời
  - Hủy lời mời đã gửi

### 4. Trang kết nối tổng quan
- **Vị trí**: `/connections`
- **Tính năng**:
  - Tin nhắn
  - Lời mời kết nối
  - Gợi ý kết nối

## 🛠️ Cấu trúc Database

### Collections trong Firebase

#### 1. `connections`
```javascript
{
  id: "connection_id",
  fromUserId: "user_id_1",
  toUserId: "user_id_2", 
  postId: "post_id",
  message: "Lời nhắn kết nối",
  status: "pending" | "accepted" | "declined",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 2. `notifications`
```javascript
{
  id: "notification_id",
  userId: "user_id",
  type: "connection_request" | "connection_accepted" | "connection_declined" | "connection_cancelled",
  data: {
    fromUserId: "user_id",
    connectionId: "connection_id",
    postId: "post_id",
    message: "Lời nhắn"
  },
  isRead: false,
  createdAt: timestamp
}
```

## 📱 Giao diện người dùng

### 1. Nút gửi lời mời kết nối
- **Màu**: Purple (`bg-purple-600`)
- **Icon**: UserPlus
- **Vị trí**: 
  - Trang chi tiết bài đăng
  - Card bài đăng (PostCard)

### 2. Modal gửi lời mời
- **Thông tin hiển thị**:
  - Thông tin bài đăng
  - Thông tin người đăng
  - Form nhập lời nhắn
  - Gợi ý viết lời nhắn

### 3. Notification Dropdown
- **Thông tin hiển thị**:
  - Số thông báo chưa đọc
  - Danh sách thông báo
  - Nút đánh dấu đã đọc
  - Link đến trang chi tiết

## 🔧 API Services

### ConnectionService

#### Gửi lời mời kết nối
```javascript
await connectionService.sendConnectionRequest(
  fromUserId, 
  toUserId, 
  postId, 
  message
);
```

#### Lấy lời mời đã gửi
```javascript
const sentConnections = await connectionService.getSentConnections(userId);
```

#### Lấy lời mời đã nhận
```javascript
const receivedConnections = await connectionService.getReceivedConnections(userId);
```

#### Chấp nhận lời mời
```javascript
await connectionService.acceptConnection(connectionId);
```

#### Từ chối lời mời
```javascript
await connectionService.declineConnection(connectionId);
```

#### Hủy lời mời
```javascript
await connectionService.cancelConnection(connectionId);
```

### NotificationService

#### Lấy thông báo
```javascript
const notifications = await connectionService.getNotifications(userId);
```

#### Đánh dấu đã đọc
```javascript
await connectionService.markNotificationAsRead(notificationId);
```

#### Lắng nghe thay đổi thông báo
```javascript
const unsubscribe = connectionService.onNotificationsChange(userId, (notifications) => {
  // Handle notifications update
});
```

## 🎯 Luồng hoạt động

### 1. Gửi lời mời kết nối
1. User A xem bài đăng của User B
2. User A click "Gửi lời mời kết nối"
3. Modal hiển thị form nhập lời nhắn
4. User A nhập lời nhắn và gửi
5. Hệ thống tạo connection record
6. Hệ thống tạo notification cho User B
7. User B nhận thông báo

### 2. Phản hồi lời mời
1. User B xem thông báo
2. User B vào trang kết nối
3. User B chấp nhận/từ chối lời mời
4. Hệ thống cập nhật status connection
5. Hệ thống tạo notification cho User A
6. User A nhận thông báo phản hồi

## 🎨 Components

### 1. ConnectionModal
- **Chức năng**: Modal gửi lời mời kết nối
- **Props**: `isOpen`, `onClose`, `post`, `targetUser`
- **Vị trí**: Sử dụng trong PostDetail và PostCard

### 2. NotificationDropdown
- **Chức năng**: Dropdown hiển thị thông báo
- **Vị trí**: Header (Layout.jsx)
- **Tính năng**: Real-time updates, mark as read

### 3. MyConnections
- **Chức năng**: Trang quản lý kết nối
- **Route**: `/my-connections`
- **Tính năng**: Tabs, search, actions

## 🔒 Bảo mật

### Firestore Rules
```javascript
match /connections/{connectionId} {
  allow read, write: if request.auth != null;
}

match /notifications/{notificationId} {
  allow read, write: if request.auth != null && 
    request.auth.uid == resource.data.userId;
}
```

### Validation
- Chỉ user đã đăng nhập mới có thể gửi lời mời
- Không thể gửi lời mời cho chính mình
- Lời nhắn có giới hạn 500 ký tự
- Chỉ có thể chấp nhận/từ chối lời mời đã nhận

## 🚀 Deployment

### 1. Firebase Setup
- Tạo collections: `connections`, `notifications`
- Cấu hình Firestore Rules
- Test real-time listeners

### 2. Testing
- Test gửi lời mời kết nối
- Test nhận thông báo real-time
- Test chấp nhận/từ chối lời mời
- Test hủy lời mời

### 3. Monitoring
- Monitor số lượng connections
- Monitor notification delivery
- Monitor user engagement

## 📊 Analytics

### Metrics cần theo dõi
- Số lời mời kết nối được gửi
- Tỷ lệ chấp nhận lời mời
- Thời gian phản hồi trung bình
- Số thông báo được đọc

### Events cần track
- `connection_request_sent`
- `connection_request_accepted`
- `connection_request_declined`
- `notification_opened`

## 🔄 Future Enhancements

### 1. Tính năng nâng cao
- Chat real-time giữa các kết nối
- Gợi ý kết nối thông minh
- Rating và review sau khi kết nối
- Group chat cho nhiều người

### 2. UX Improvements
- Push notifications
- Email notifications
- In-app messaging
- Connection history

### 3. Analytics
- Connection success rate
- User engagement metrics
- Popular connection patterns
- Geographic distribution

## 🐛 Troubleshooting

### Common Issues

#### 1. Thông báo không hiển thị
- Kiểm tra Firebase Rules
- Kiểm tra real-time listeners
- Kiểm tra user authentication

#### 2. Lời mời không được gửi
- Kiểm tra connection service
- Kiểm tra user permissions
- Kiểm tra network connectivity

#### 3. Real-time updates không hoạt động
- Kiểm tra Firebase config
- Kiểm tra onSnapshot listeners
- Kiểm tra error handling

### Debug Commands
```javascript
// Check connection service
console.log('Connection service:', connectionService);

// Check notifications
console.log('Notifications:', notifications);

// Check Firebase connection
console.log('Firebase db:', db);
```

## 📞 Support

Nếu gặp vấn đề với chức năng kết nối, vui lòng:
1. Kiểm tra console logs
2. Kiểm tra Firebase Console
3. Test với mock data
4. Liên hệ support team 