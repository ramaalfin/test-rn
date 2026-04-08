# Auth Starter Project

A production-ready React Native starter project with JWT authentication, built with TypeScript, React Navigation, React Query, and Zustand for state management.

## Features

- 🔐 JWT-based authentication with secure token management
- 🎨 Modern UI with skeleton loaders and error states
- 🌓 Dark mode support
- 📱 Feature-based architecture
- 🔄 React Query for data fetching and caching
- 🎯 TypeScript with strict mode
- ♿ Accessibility support
- 🧪 Comprehensive test coverage

## Setup

### Prerequisites

- Node.js >= 22
- Yarn
- React Native development environment ([Setup Guide](https://reactnative.dev/docs/set-up-your-environment))
- Google OAuth credentials (optional, for Google Sign-In)

### Installation

```bash
# 1. Install dependencies
yarn install

# 2. Configure environment variables
cp .env.example .env
# Edit .env and add your Google OAuth credentials (optional)

# 3. Install iOS pods (macOS only)
cd ios && bundle install && bundle exec pod install && cd ..

# 4. Run the app
yarn ios     # or
yarn android
```

## Project Structure

```
src/
├── features/           # Feature-based modules
│   ├── auth/          # Authentication (login, token management)
│   ├── home/          # Home screen with item list
│   ├── detail/        # Detail screen
│   └── settings/      # Settings and logout
├── components/        # Shared reusable components
├── navigation/        # Navigation configuration
├── services/          # API client and services
├── hooks/             # Custom hooks
├── stores/            # Zustand stores
├── theme/             # Design system tokens
└── types/             # TypeScript type definitions
```

## Architecture

### Authentication Flow

1. User enters credentials on login screen
2. AuthService validates and generates JWT token
3. Token is stored securely via TokenManager
4. API client automatically includes token in requests
5. On 401 response, user is automatically logged out

### Data Fetching

- Uses JSONPlaceholder API for demo data
- React Query handles caching and refetching
- Automatic retry logic for failed requests
- Optimistic updates for better UX

### State Management

- **Zustand** for client state (auth, settings)
- **React Query** for server state (API data)
- **AsyncStorage** for persistence

## Key Technologies

- **React Native 0.84** - Mobile framework
- **TypeScript** - Type safety
- **React Navigation** - Navigation
- **React Query** - Data fetching
- **Zustand** - State management
- **Axios** - HTTP client
- **AsyncStorage** - Local storage
- **Google Sign-In** - OAuth authentication

## Testing

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test --watch

# Run tests with coverage
yarn test --coverage
```

## Scripts

```bash
yarn start          # Start Metro bundler
yarn android        # Run on Android
yarn ios            # Run on iOS
yarn lint           # Run ESLint
yarn test           # Run tests
```

## Documentation

- [Google OAuth Setup](./GOOGLE_OAUTH_SETUP.md) - Guide for setting up Google Sign-In
- [JWT Implementation](./JWT_IMPLEMENTATION.md) - Details on JWT token management

## License

MIT
