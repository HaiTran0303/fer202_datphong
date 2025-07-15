# Hướng Dẫn Dự Án FPTro

Tài liệu này cung cấp cái nhìn tổng quan chi tiết về kiến trúc, luồng hoạt động và các thành phần chính của dự án FPTro.

## 1. Tổng Quan Luồng Dự Án

Ứng dụng React này được xây dựng với Vite, sử dụng `react-router-dom` cho việc định tuyến và Firebase cho các dịch vụ backend (xác thực, cơ sở dữ liệu Firestore, lưu trữ).

### 1.1. Điểm Khởi Đầu (`src/main.jsx`)

*   `src/main.jsx` là điểm vào chính của ứng dụng.
*   Nó khởi tạo ứng dụng React bằng `createRoot` và render component `App` vào phần tử DOM có `id="root"` (trong `index.html`).
*   `StrictMode` được sử dụng để bật các kiểm tra bổ sung và cảnh báo cho các tiềm năng vấn đề trong ứng dụng.

### 1.2. Định Tuyến Chính (`src/App.jsx`)

*   `src/App.jsx` chịu trách nhiệm thiết lập định tuyến toàn cục của ứng dụng bằng cách sử dụng `BrowserRouter` (được đổi tên thành `Router`) và `Routes` từ `react-router-dom`.
*   Tất cả các route được định nghĩa ở đây, phân chia thành:
    *   **Auth Routes**: Các route như `/login` và `/register` không sử dụng `Layout` chung, cho phép các trang này có bố cục độc lập.
    *   **App Routes**: Hầu hết các route khác (`/`, `/create-post`, `/search`, v.v.) được lồng trong component `Layout`. Điều này đảm bảo rằng các trang này chia sẻ cùng một header, thanh điều hướng và footer.
*   `ErrorBoundary` bao bọc toàn bộ ứng dụng để bắt và xử lý các lỗi trong cây UI, cung cấp trải nghiệm người dùng tốt hơn khi có lỗi xảy ra.
*   `DemoModal` cũng được render ở cấp độ ứng dụng, có thể được sử dụng cho các mục đích demo hoặc thông báo chung.

### 1.3. Bố Cục Ứng Dụng (`src/components/Layout.jsx`)

*   `src/components/Layout.jsx` là một Higher-Order Component (HOC) cung cấp cấu trúc bố cục chung cho hầu hết các trang của ứng dụng.
*   Nó bao gồm:
    *   **Top Header**: Thanh thông báo nhỏ ở trên cùng.
    *   **Main Header**: Chứa logo (FPTro), thanh tìm kiếm toàn cầu, các liên kết điều hướng chính (Gợi ý AI, Kết nối, Đánh giá, Hồ sơ) và các nút xác thực/quản lý người dùng (Đăng nhập/Đăng ký hoặc Dropdown người dùng nếu đã đăng nhập).
    *   **Navigation Menu**: Thanh điều hướng phụ với các liên kết đến các loại bài đăng khác nhau (Phòng trọ, Nhà nguyên căn, Căn hộ chung cư, v.v.).
    *   **Main Content (`children`)**: Đây là nơi nội dung của các trang cụ thể (ví dụ: `Home`, `CreatePost`) được render.
    *   **Footer**: Chứa thông tin liên hệ, các liên kết điều hướng phụ và bản quyền.
*   Component này sử dụng Firebase Authentication (`getAuth`, `signOut`) để quản lý trạng thái đăng nhập của người dùng và hiển thị các tùy chọn phù hợp (ví dụ: dropdown tài khoản khi đã đăng nhập).
*   `NotificationDropdown` được tích hợp để hiển thị thông báo cho người dùng đã đăng nhập.

## 2. Cấu Trúc Thư Mục & Các Mô-đun Chính

Dự án được tổ chức theo cấu trúc thư mục logic để dễ dàng quản lý và mở rộng:

*   **`src/assets/`**: Chứa các tài nguyên tĩnh như hình ảnh.
*   **`src/components/`**: Chứa các thành phần UI có thể tái sử dụng.
    *   `src/components/ui/`: Các thành phần UI cơ bản (ví dụ: `Button.jsx`, `Card.jsx`, `Input.jsx`, `Modal.jsx`) thường được xây dựng dựa trên các thư viện UI không kiểu dáng (headless UI libraries) hoặc tự xây dựng với Tailwind CSS.
*   **`src/contexts/`**: Dành cho các Context API của React để quản lý trạng thái toàn cục. (Hiện tại chưa có context nào được định nghĩa rõ ràng trong các file đã xem).
*   **`src/firebase/`**: Chứa cấu hình và các hàm tiện ích liên quan đến Firebase.
    *   `src/firebase/config.js`: Khởi tạo ứng dụng Firebase và các dịch vụ (Auth, Firestore, Storage). Nó cũng bao gồm logic để kết nối với các Firebase Emulator trong môi trường phát triển và cung cấp các đối tượng mock nếu Firebase không khả dụng, giúp ứng dụng không bị crash.
*   **`src/hooks/`**: Chứa các React Hooks tùy chỉnh để tái sử dụng logic trạng thái.
*   **`src/pages/`**: Chứa các thành phần đại diện cho các trang hoặc chế độ xem chính của ứng dụng.
*   **`src/services/`**: Dành cho các hàm xử lý logic nghiệp vụ và tương tác với API/backend.
*   **`src/utils/`**: Chứa các hàm tiện ích, hằng số và các tệp trợ giúp khác.
    *   `src/utils/constants.js`: Chứa các hằng số được sử dụng trong toàn bộ ứng dụng (ví dụ: `LOCATIONS`).
    *   `src/utils/seedData.js`: Có thể chứa dữ liệu mẫu để phát triển hoặc kiểm thử.

## 3. Luồng Hoạt Động Của Các Chức Năng Chính

### 3.1. Trang Chủ (`src/pages/Home.jsx`)

*   **Mục đích**: Hiển thị danh sách các bài đăng (phòng trọ, nhà nguyên căn, v.v.) và cung cấp chức năng tìm kiếm, lọc, sắp xếp.
*   **Luồng dữ liệu**:
    *   Sử dụng `useState` để quản lý `posts` (danh sách bài đăng), `loading` (trạng thái tải), `error` (thông báo lỗi), `filters` (bộ lọc hiện tại), `searchTerm` (từ khóa tìm kiếm), `currentPage` (trang hiện tại), `totalPages` (tổng số trang) và `sortBy` (tiêu chí sắp xếp).
    *   Hàm `loadPosts` (sử dụng `useCallback` để tối ưu hiệu suất) là hàm chính để tìm nạp dữ liệu bài đăng.
        *   Nó xây dựng các tham số truy vấn dựa trên `filters`, `searchTerm`, `currentPage` và `sortBy`.
        *   Nó gọi hàm `getPosts` (được định nghĩa nội bộ trong `Home.jsx` nhưng có thể được di chuyển ra `src/services/postsService.js` để tách biệt logic).
    *   **`getPosts` Function**:
        *   Kiểm tra xem Firebase có được khởi tạo hay không (`db`). Nếu không, nó sẽ sử dụng dữ liệu mock (`mockPostsStorage`) để ngăn ứng dụng bị crash.
        *   Xây dựng truy vấn Firebase Firestore (`collection`, `query`, `where`, `orderBy`, `limit`) dựa trên các tùy chọn được truyền vào (ví dụ: `location`, `category`).
        *   Sử dụng `getDocs` để lấy dữ liệu từ Firestore.
        *   Thực hiện lọc phía client cho các trường hợp phức tạp hơn như tìm kiếm theo từ khóa, lọc theo khoảng giá, diện tích và tiện ích.
        *   Sắp xếp kết quả theo các tiêu chí như `createdAt`, `price`, `hasVideo`.
        *   Trả về một đối tượng chứa `posts`, `hasMore`, `totalPages`, `total` và `currentPage`.
    *   `useEffect` Hook:
        *   Gọi `loadPosts` khi các dependency (`filters`, `searchTerm`, `currentPage`, `sortBy`) thay đổi.
        *   Thiết lập một `onSnapshot` listener của Firebase Firestore để cập nhật bài đăng theo thời gian thực. Điều này cho phép ứng dụng phản ứng ngay lập tức với các thay đổi dữ liệu trên Firestore mà không cần tải lại trang. Listener này cũng áp dụng các bộ lọc cơ bản (`status`, `orderBy`, `limit`, `location`, `category`).
    *   Các hàm `handleFilterChange`, `handleSearch`, `handleSortChange`, `handlePageChange`, `handleLocationFilter` được sử dụng để cập nhật trạng thái bộ lọc và kích hoạt việc tải lại bài đăng.
*   **Các thành phần con**:
    *   `SearchFilter`: Cho phép người dùng nhập từ khóa tìm kiếm và áp dụng các bộ lọc nâng cao.
    *   `PostCard`: Hiển thị thông tin chi tiết của một bài đăng.
    *   `Pagination`: Cung cấp điều hướng phân trang.
*   **Giao diện người dùng**: Hiển thị tổng số tin đăng, các nút lọc theo địa điểm (`LOCATIONS`), các tab sắp xếp (Đề xuất, Mới đăng, Có video). Hiển thị trạng thái tải (skeleton loaders) hoặc thông báo không tìm thấy bài đăng. Sidebar hiển thị "Tin mới đăng" và "Bài viết mới".

### 3.2. Cấu hình Firebase (`src/firebase/config.js`)

*   **Mục đích**: Cấu hình và khởi tạo các dịch vụ Firebase cho ứng dụng.
*   **Luồng hoạt động**:
    *   Khai báo `firebaseConfig` với các khóa API và thông tin dự án của Firebase. **Lưu ý**: Cần thay thế `firebaseConfig` này bằng cấu hình thực tế từ Firebase Console của bạn.
    *   Sử dụng `initializeApp` để khởi tạo ứng dụng Firebase.
    *   Sử dụng `getAuth`, `getFirestore`, `getStorage` để lấy các instance của dịch vụ xác thực, Firestore và Cloud Storage.
    *   **Emulator Integration**: Trong môi trường phát triển (`import.meta.env.DEV` là `true` và `VITE_USE_FIREBASE_EMULATOR` được đặt), nó cố gắng kết nối với Firebase Emulators (`localhost:9099` cho Auth, `localhost:8080` cho Firestore, `localhost:9199` cho Storage). Điều này rất hữu ích cho việc phát triển cục bộ mà không cần tương tác với các dự án Firebase trực tiếp.
    *   **Error Handling**: Nếu quá trình khởi tạo Firebase thất bại, nó sẽ tạo ra các đối tượng mock cho `auth` và `db` để ngăn ứng dụng bị crash, cho phép ứng dụng vẫn chạy ở một mức độ nào đó (ví dụ: với dữ liệu mock).
    *   Xuất các instance `auth`, `db`, `storage` để các thành phần khác có thể sử dụng.

## 4. Quy Ước Mã Hóa & Thực Hành Tốt Nhất

Dự án tuân thủ các quy ước sau:

*   **Sử dụng Tailwind CSS**: Tất cả kiểu dáng được áp dụng thông qua các lớp tiện ích của Tailwind CSS. Tránh sử dụng CSS hoặc thẻ `<style>` nội tuyến trừ khi thực sự cần thiết.
*   **`class:` thay vì toán tử ba ngôi**: Sử dụng cách tiếp cận `class:` của Tailwind (ví dụ: `class:bg-blue-500={isActive}`) để tạo kiểu có điều kiện khi có thể, thay vì toán tử ba ngôi trực tiếp trong `className`.
*   **Trả về sớm**: Các hàm sử dụng `return` sớm để thoát khỏi hàm ngay khi điều kiện được đáp ứng, cải thiện khả năng đọc và giảm độ sâu lồng.
*   **Tên mô tả**: Biến, hàm và hằng số được đặt tên rõ ràng, mô tả mục đích của chúng.
*   **Hàm xử lý sự kiện**: Các hàm xử lý sự kiện được đặt tên với tiền tố `handle` (ví dụ: `handleClick`, `handleLogout`).
*   **Khả năng truy cập (Accessibility)**: Cân nhắc các tính năng trợ năng như `tabindex`, `aria-label` cho các phần tử tương tác. (Ví dụ: các nút, liên kết).
*   **Hằng số thay vì hàm**: Sử dụng hằng số cho các hàm thay vì khai báo hàm truyền thống khi phù hợp (ví dụ: `const toggle = () => {}`).
*   **Định nghĩa kiểu**: Nếu có thể, định nghĩa các kiểu dữ liệu (ví dụ: thông qua JSDoc hoặc TypeScript nếu được sử dụng) để cải thiện khả năng đọc và bảo trì mã.

Tài liệu này sẽ được cập nhật khi dự án phát triển.
