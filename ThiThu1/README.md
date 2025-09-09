# Ứng Dụng Quản Lý Xe Máy

Ứng dụng quản lý xe máy được xây dựng với React Native và Redux, cho phép người dùng xem danh sách, thêm, sửa và xóa thông tin xe máy.

## Tính Năng

- Hiển thị danh sách xe máy với banner quảng cáo
- Thêm mới xe máy với đầy đủ thông tin
- Sửa thông tin xe máy
- Xóa xe máy
- Chọn/chụp ảnh cho xe máy
- Hiệu ứng chuyển động đẹp mắt
- Sử dụng Redux để quản lý state

## Cài Đặt

1. Clone repository:
```
git clone <repository-url>
cd <repository-folder>
```

2. Cài đặt các dependencies:
```
npm install
```

3. Khởi động json-server (API):
```
npm run api
```

4. Chạy ứng dụng (trên một terminal khác):
```
npm start
```

## Cấu Trúc Thư Mục

- `app/` - Thư mục chứa mã nguồn chính của ứng dụng
  - `components/` - Các component tái sử dụng
  - `redux/` - Redux store và slice
  - `api/` - Các service API
  - `index.tsx` - Màn hình chính
  - `add.tsx` - Màn hình thêm mới
  - `edit.tsx` - Màn hình sửa
  - `_layout.tsx` - Layout chung của ứng dụng
- `db.json` - Cơ sở dữ liệu JSON cho json-server

## API

API được triển khai bằng json-server với endpoint `/XeMay` và các thuộc tính:
- `ten_xe_ph24366` - Tên xe máy
- `mau_sac_ph24366` - Màu sắc
- `gia_ban_ph24366` - Giá bán
- `mo_ta_ph24366` - Mô tả
- `hinh_anh_ph24366` - URL hình ảnh

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
