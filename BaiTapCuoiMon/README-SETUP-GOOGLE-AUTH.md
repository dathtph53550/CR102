# Thiết lập Google Authentication cho Ứng dụng

## 1. Tạo và cấu hình dự án trên Firebase Console

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Chọn dự án Firebase đã có hoặc tạo dự án mới
3. Trong mục Authentication, kích hoạt phương thức đăng nhập "Google"

## 2. Tạo và cấu hình Google OAuth Client ID

### 2.1. Đăng ký OAuth trên Google Cloud Platform Console:

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn dự án Firebase của bạn (hoặc tạo dự án mới)
3. Đi đến API & Services > Credentials
4. Nhấp vào "Create Credentials" và chọn "OAuth client ID"
5. Chọn loại ứng dụng:
   - Web application (cho web)
   - Android (cho ứng dụng Android)
   - iOS (cho ứng dụng iOS)

### 2.2. Đối với Android:

1. Tạo một SHA-1 certificate fingerprint:
   ```
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
2. Thêm SHA-1 vào dự án Firebase của bạn:
   - Trong Firebase Console, đi đến Project settings > Your apps > Android app
   - Nhấp vào "Add fingerprint" và thêm SHA-1 của bạn
3. Tải về file `google-services.json` và đặt vào thư mục gốc của dự án

### 2.3. Đối với iOS:

1. Thêm Bundle ID giống với `bundleIdentifier` trong `app.json`
2. Tải về file `GoogleService-Info.plist` và đặt vào thư mục gốc của dự án

### 2.4. Đối với Web:

1. Thêm Authorized JavaScript origins (URL gốc của ứng dụng web)
2. Thêm Authorized redirect URIs (URI chuyển hướng sau khi đăng nhập)

## 3. Cập nhật cấu hình ứng dụng

1. Cập nhật file `app/context/AuthContext.tsx` với các Client ID:
   ```typescript
   // Thay thế các giá trị này bằng Client ID của bạn
   const WEB_CLIENT_ID = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';
   const ANDROID_CLIENT_ID = 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com';
   const IOS_CLIENT_ID = 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com';
   ```

2. Cập nhật file `app.json` với thông tin ứng dụng:
   - Thêm `bundleIdentifier` cho iOS
   - Đảm bảo `package` cho Android đã được cấu hình đúng
   - Đảm bảo `scheme` khớp với cấu hình của bạn

## 4. Kiểm tra đăng nhập Google

1. Khởi động ứng dụng
2. Nhấp vào nút "Đăng nhập với Google" trên màn hình đăng nhập
3. Bạn sẽ được chuyển hướng đến trang đăng nhập Google
4. Sau khi xác thực thành công, bạn sẽ được chuyển hướng trở lại ứng dụng và đăng nhập tự động

## Lưu ý

- Đảm bảo bạn đã cài đặt các gói phụ thuộc cần thiết:
  ```
  expo install expo-auth-session expo-crypto expo-web-browser
  ```
- Khi chạy trên thiết bị thực, hãy đảm bảo ứng dụng đã được đăng ký đúng với Firebase và Google Cloud Console
- Mỗi môi trường (development/production) có thể yêu cầu cấu hình khác nhau 