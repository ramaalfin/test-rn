# Authentication Feature

This feature module provides authentication functionality for the application, including secure token management and user authentication flows.

## Structure

```
auth/
├── screens/
│   ├── LoginScreen.tsx          # Login screen component
│   ├── index.ts                 # Barrel export
│   └── __tests__/
│       └── LoginScreen.test.tsx # Component tests
├── hooks/
│   ├── useAuth.ts               # Authentication hook
│   ├── index.ts                 # Barrel export
│   └── __tests__/
│       └── useAuth.test.ts      # Unit tests
├── services/
│   ├── tokenManager.ts          # Token storage abstraction
│   ├── authService.ts           # Authentication service
│   ├── index.ts                 # Barrel export
│   └── __tests__/
│       ├── tokenManager.test.ts              # Unit tests
│       ├── tokenManager.integration.test.ts  # Integration tests
│       └── authService.test.ts               # Unit tests
└── types/
    └── auth.types.ts            # TypeScript type definitions
```

## useAuth Hook

The useAuth hook provides a clean, component-friendly API for authentication operations. It wraps the useAuthStore with business logic and handles loading and error states automatically.

### Features

- **Automatic Authentication Check**: Checks for stored token on mount
- **Clean API**: Simple interface for login/logout operations
- **State Management**: Provides loading, error, and user states
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Type Safety**: Full TypeScript support

### API

The hook returns an object with the following properties:

```typescript
interface UseAuthReturn {
  // User data
  user: User | null;
  isAuthenticated: boolean;
  
  // Loading and error states
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
```

### Usage Example

```typescript
import { useAuth } from '@/features/auth/hooks';

function LoginScreen() {
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
      // Navigation to app stack happens automatically
    } catch (err) {
      // Error is already set in the hook state
      console.error('Login failed:', err);
    }
  };

  return (
    <View>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      {error && <Text>{error}</Text>}
      <Button
        title="Login"
        onPress={handleLogin}
        disabled={isLoading}
      />
    </View>
  );
}

function HomeScreen() {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation to login screen happens automatically
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <View>
      <Text>Welcome, {user?.name}!</Text>
      <Text>Email: {user?.email}</Text>
      <Button
        title="Logout"
        onPress={handleLogout}
        disabled={isLoading}
      />
    </View>
  );
}

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <Stack.Screen name="App" component={AppNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
```

### Behavior

#### On Mount
The hook automatically calls `checkAuth()` to verify if a stored token exists and is valid. This ensures the app knows the authentication state when it starts.

#### Login
- Sets `isLoading` to `true` during the operation
- On success: Updates `user`, `isAuthenticated`, and clears any previous errors
- On failure: Sets `error` with a user-friendly message and throws the error

#### Logout
- Sets `isLoading` to `true` during the operation
- On success: Clears `user`, `token`, and sets `isAuthenticated` to `false`
- On failure: Sets `error` with a user-friendly message and throws the error

#### Error Handling
- Errors are automatically set in the hook state
- Use `clearError()` to dismiss error messages
- Errors are also thrown so components can handle them if needed

### Testing

The useAuth hook includes comprehensive test coverage:

- Store integration tests
- Login/logout action tests
- Error handling tests
- State exposure tests

Run tests:
```bash
npm test -- src/features/auth/hooks/__tests__/useAuth.test.ts
```

### Requirements Satisfied

This implementation satisfies the following requirements from the spec:

- **1.3**: Sends authentication request to the authentication endpoint
- **1.4**: Stores JWT token securely on successful authentication
- **1.5**: Navigates to app stack on successful authentication
- **1.6**: Displays error message on authentication failure
- **1.7**: Displays network error message with retry option

## TokenManager Service

The TokenManager service provides a clean abstraction layer over AsyncStorage for JWT token management.

### Features

- **Secure Storage**: Abstracts AsyncStorage access for token persistence
- **Error Handling**: Comprehensive error handling for all storage operations
- **Type Safety**: Full TypeScript support with proper type definitions
- **Testability**: Designed for easy mocking and testing

### API

#### `storeToken(token: string): Promise<void>`
Stores a JWT token in secure storage.

```typescript
import { storeToken } from '@/features/auth/services';

await storeToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
```

#### `getToken(): Promise<string | null>`
Retrieves the stored JWT token.

```typescript
import { getToken } from '@/features/auth/services';

const token = await getToken();
if (token) {
  // Token exists
}
```

#### `deleteToken(): Promise<void>`
Removes the JWT token from storage.

```typescript
import { deleteToken } from '@/features/auth/services';

await deleteToken();
```

#### `hasToken(): Promise<boolean>`
Checks if a JWT token exists in storage.

```typescript
import { hasToken } from '@/features/auth/services';

const exists = await hasToken();
if (exists) {
  // Token is stored
}
```

### Usage Example

```typescript
import TokenManager from '@/features/auth/services/tokenManager';

// Store token after successful login
async function handleLogin(email: string, password: string) {
  const response = await authApi.login(email, password);
  await TokenManager.storeToken(response.token);
}

// Check authentication status
async function checkAuth() {
  const hasAuth = await TokenManager.hasToken();
  if (hasAuth) {
    const token = await TokenManager.getToken();
    // Validate token and proceed
  }
}

// Logout
async function handleLogout() {
  await TokenManager.deleteToken();
  // Navigate to login screen
}
```

### Storage Key

The TokenManager uses a consistent storage key: `@auth_token`

This key is internal to the service and should not be accessed directly by other modules.

### Error Handling

All methods include proper error handling:

- **storeToken**: Throws error if storage operation fails
- **getToken**: Returns `null` if retrieval fails or token doesn't exist
- **deleteToken**: Throws error if deletion operation fails
- **hasToken**: Returns `false` if check fails

Errors are logged to the console for debugging purposes.

### Testing

The TokenManager service includes comprehensive test coverage:

- **Unit Tests**: Test individual methods with mocked AsyncStorage
- **Integration Tests**: Test complete token lifecycle workflows

Run tests:
```bash
npm test -- src/features/auth/services/__tests__/
```

### Requirements Satisfied

This implementation satisfies the following requirements from the spec:

- **2.1**: Provides methods to store, retrieve, and delete JWT tokens
- **2.2**: Does not expose AsyncStorage directly to other modules
- **2.3**: Persists tokens to secure storage when stored
- **2.4**: Returns token or null when retrieved
- **2.5**: Removes token from secure storage when deleted
- **2.6**: Uses consistent storage key for token persistence

## LoginScreen Component

The LoginScreen component provides a modern, user-friendly login interface with form validation and error handling.

### Features

- **Email Input**: Email keyboard type with format validation
- **Password Input**: Secure text entry with minimum length validation
- **Inline Validation**: Error messages displayed below each field
- **Loading State**: Disabled inputs and loading indicator during authentication
- **Keyboard Handling**: Automatic keyboard dismissal and field navigation
- **Modern UI**: Card-based design with theme integration
- **Accessibility**: Proper keyboard types and return key handling

### Form Validation

The component implements client-side validation using the validation functions from AuthService:

- **Email**: Must be a valid email format (regex validation)
- **Password**: Must be at least 6 characters long

Validation errors are displayed inline below each input field.

### Keyboard Handling

- **Tap Outside**: Dismisses keyboard when tapping outside input fields
- **Next Button**: Pressing "Next" on email field focuses password field
- **Done Button**: Pressing "Done" on password field submits the form
- **Auto-dismiss**: Keyboard is dismissed when form is submitted

### UI Design

The LoginScreen follows modern design principles:

- **Centered Layout**: Form is centered vertically on screen
- **Card Container**: Inputs are contained in a card with shadow
- **Theme Integration**: Uses theme colors, spacing, and typography
- **Visual Feedback**: Button opacity changes during loading
- **Error Display**: Inline errors below fields, global errors in highlighted container

### Usage Example

```typescript
import { LoginScreen } from '@/features/auth/screens';

// In your AuthNavigator
<Stack.Screen 
  name="Login" 
  component={LoginScreen}
  options={{ headerShown: false }}
/>
```

### Testing

The LoginScreen includes comprehensive test coverage:

- Rendering tests
- Form validation tests
- User interaction tests
- Error display tests
- Loading state tests

Run tests:
```bash
npm test -- src/features/auth/screens/__tests__/LoginScreen.test.tsx
```

### Requirements Satisfied

This implementation satisfies the following requirements from the spec:

- **1.1**: Validates email format using validation schema
- **1.2**: Validates password meets minimum requirements (6 characters)
- **1.10**: Displays validation errors inline below each input field
- **12.5**: Uses appropriate keyboard types (email for email field)
- **12.6**: Enables secure text entry for password field

## Future Enhancements

- Token encryption for additional security
- Biometric authentication integration
- Refresh token management
- Token expiration validation
- "Forgot Password" functionality
- Social login integration
