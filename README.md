# TestRN - React Native Authentication App

Aplikasi React Native dengan fitur autentikasi menggunakan Google OAuth dan Email/Password login.

## 📋 Daftar Isi

- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Kredensial Login](#kredensial-login)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Dokumentasi](#dokumentasi)

## ✨ Fitur

- 🔐 **Google OAuth Authentication** - Login menggunakan akun Google
- 📧 **Email/Password Login** - Login tradisional dengan email dan password
- 🎨 **Dark Mode** - Tema gelap dan terang yang dapat diubah
- 🔒 **JWT Token Management** - Token dengan expirasi 1 jam
- 💾 **Persistent Session** - Session tersimpan menggunakan AsyncStorage
- 📱 **Cross-Platform** - Support iOS dan Android
- ✅ **Form Validation** - Validasi form menggunakan React Hook Form dan Zod
- 🚀 **Type-Safe** - Fully typed dengan TypeScript

## 🛠 Teknologi

- **React Native** 0.84.1
- **TypeScript** 5.8.3
- **React Navigation** 7.x
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client
- **AsyncStorage** - Local storage
- **Google Sign-In** - OAuth authentication

## 📦 Prasyarat

Pastikan Anda sudah menginstall:

- **Node.js** >= 22.11.0
- **npm** atau **yarn**
- **React Native CLI**
- **Xcode** (untuk iOS development)
- **Android Studio** (untuk Android development)
- **CocoaPods** (untuk iOS dependencies)

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd test-rn
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install iOS Dependencies

```bash
cd ios
pod install
cd ..
```

## ⚙️ Konfigurasi

### 1. Environment Variables

Copy file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Edit file `.env` dan isi dengan kredensial Anda:

```env
# Google OAuth Configuration
GOOGLE_WEB_CLIENT_ID=your_web_client_id_here.apps.googleusercontent.com
GOOGLE_IOS_CLIENT_ID=your_ios_client_id_here.apps.googleusercontent.com
GOOGLE_ANDROID_CLIENT_ID=your_android_client_id_here.apps.googleusercontent.com

# JWT Secret Key
JWT_SECRET=your_secure_jwt_secret_key_here
```

### 2. Google OAuth Setup

Untuk mendapatkan Google OAuth credentials:

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang sudah ada
3. Enable Google Sign-In API
4. Buat OAuth 2.0 Client IDs untuk:
   - Web application
   - iOS application
   - Android application

**Panduan lengkap:** Lihat [docs/GOOGLE_OAUTH_SETUP.md](docs/GOOGLE_OAUTH_SETUP.md)

### 3. Generate JWT Secret

Gunakan salah satu cara berikut untuk generate JWT secret:

```bash
# Menggunakan Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Menggunakan OpenSSL
openssl rand -hex 32
```

## 🏃 Menjalankan Aplikasi

### iOS

```bash
npm run ios
```

Atau buka `ios/TestRN.xcworkspace` di Xcode dan run dari sana.

### Android

```bash
npm run android
```

Pastikan emulator Android sudah berjalan atau device sudah terkoneksi.

### Metro Bundler

Jika Metro bundler tidak start otomatis:

```bash
npm start
```

### Reset Cache

Jika mengalami masalah, coba reset cache:

```bash
npm run reset
```

## 🔑 Kredensial Login

### Login dengan Email/Password

Aplikasi menggunakan [JSONPlaceholder API](https://jsonplaceholder.typicode.com/) untuk mock authentication. Anda bisa login dengan **email apapun** dan **password apapun**.

**Contoh kredensial yang bisa digunakan:**

```
Email: Sincere@april.biz
Password: (password apapun)

Email: Shanna@melissa.tv
Password: (password apapun)

Email: Nathan@yesenia.net
Password: (password apapun)
```

> **Catatan:** Sistem akan mengambil user pertama dari JSONPlaceholder API jika email tidak ditemukan. Password tidak divalidasi karena ini adalah mock API.

### Login dengan Google

1. Tap tombol "Sign in with Google"
2. Pilih akun Google Anda
3. Berikan permission yang diminta
4. Anda akan diarahkan ke Home Screen

## 🧪 Testing

### Run Unit Tests

```bash
npm test
```

### Run Specific Test

```bash
# JWT Expiration Tests
npm test -- src/features/auth/services/__tests__/jwtExpiration.test.ts

# Auth Store Tests
npm test -- src/stores/__tests__/authStoreExpiration.test.ts
```

### Manual Testing

Lihat panduan testing lengkap:
- [Integration Testing Guide](docs/INTEGRATION_TESTING_GUIDE.md)
- [Android Testing Instructions](docs/ANDROID_TESTING_INSTRUCTIONS.md)
- [JWT Expiration Testing](docs/JWT_EXPIRATION_TESTING.md)
- [Quick Test Checklist](docs/QUICK_TEST_CHECKLIST.md)

## 🐛 Troubleshooting

### Error: "No internet connection"

1. Pastikan emulator/device memiliki koneksi internet
2. Test ping: `adb shell ping -c 4 8.8.8.8`
3. Restart emulator
4. Clear cache: `npm run reset`

**Panduan lengkap:** [docs/NETWORK_TROUBLESHOOTING.md](docs/NETWORK_TROUBLESHOOTING.md)

### Error: Zod Export Namespace

```bash
npm install --save-dev @babel/plugin-transform-export-namespace-from
npm run reset
```

**Panduan lengkap:** [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

### iOS: "The operation couldn't be completed"

- Verify iOS Client ID di `.env`
- Verify reversed Client ID di `Info.plist`
- Pastikan Bundle ID match dengan Google Cloud Console

### Android: "Developer Error" atau "Error 10"

- Verify SHA-1 fingerprint di Google Cloud Console
- Generate SHA-1: `cd android && ./gradlew signingReport`
- Pastikan package name match dengan Google Cloud Console

### Token Validation Fails

- Verify `JWT_SECRET` sudah diset di `.env`
- Pastikan secret minimal 32 karakter
- Restart app setelah mengubah `.env`

### Dark Mode Tidak Berfungsi

- Pastikan `ThemeContext` sudah terintegrasi dengan `useSettingsStore`
- Clear AsyncStorage dan restart app
- Lihat [docs/FIXES.md](docs/FIXES.md) untuk detail

## 📚 Dokumentasi

### Setup & Configuration
- [Environment Variables](docs/ENVIRONMENT_VARIABLES.md) - Konfigurasi environment variables
- [Google OAuth Setup](docs/GOOGLE_OAUTH_SETUP.md) - Setup Google OAuth lengkap

### Development
- [Form Validation](docs/FORM_VALIDATION.md) - Implementasi React Hook Form dan Zod
- [Fixes Documentation](docs/FIXES.md) - Bug fixes yang sudah dilakukan

### Testing
- [Integration Testing Guide](docs/INTEGRATION_TESTING_GUIDE.md) - Panduan testing lengkap
- [Android Testing Instructions](docs/ANDROID_TESTING_INSTRUCTIONS.md) - Testing khusus Android
- [JWT Expiration Testing](docs/JWT_EXPIRATION_TESTING.md) - Testing token expiration
- [Quick Test Checklist](docs/QUICK_TEST_CHECKLIST.md) - Checklist testing cepat

### Troubleshooting
- [Network Troubleshooting](docs/NETWORK_TROUBLESHOOTING.md) - Solusi masalah network
- [Troubleshooting Guide](docs/TROUBLESHOOTING.md) - Panduan troubleshooting umum

## 📁 Struktur Project

```
test-rn/
├── src/
│   ├── components/          # Reusable components
│   ├── context/            # React contexts (Theme, etc)
│   ├── features/           # Feature modules
│   │   ├── auth/          # Authentication feature
│   │   ├── home/          # Home screen
│   │   └── settings/      # Settings screen
│   ├── navigation/         # Navigation configuration
│   ├── stores/            # Zustand stores
│   ├── theme/             # Theme configuration
│   └── types/             # TypeScript types
├── android/               # Android native code
├── ios/                   # iOS native code
├── docs/                  # Documentation
└── __tests__/            # Test files
```

## 🔒 Security Notes

- ⚠️ Jangan commit file `.env` ke version control
- ⚠️ Gunakan JWT secret yang kuat untuk production
- ⚠️ Rotate secrets secara berkala di production
- ⚠️ Gunakan HTTPS untuk semua API calls di production
- ⚠️ Implementasikan rate limiting untuk login endpoints

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

This project is private and proprietary.

## 👥 Contact

Untuk pertanyaan atau support, silakan hubungi tim development.

---

**Happy Coding! 🚀**
