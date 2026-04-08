# Implementation Plan: Auth Starter Project

## Overview

Transform the existing Movie Search App into a production-ready React Native starter project with JWT authentication. This implementation will replace the TMDB API with JSONPlaceholder, add authentication flows, modernize UI components with skeleton loaders and error states, and reorganize the codebase into a feature-based architecture.

## Tasks

- [x] 1. Set up authentication foundation
  - [x] 1.1 Create TokenManager service with AsyncStorage abstraction
    - Implement storeToken, getToken, deleteToken, and hasToken methods
    - Use consistent storage key: `@auth_token`
    - Add error handling for AsyncStorage operations
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [x] 1.2 Write unit tests for TokenManager
    - Test token storage and retrieval
    - Test token deletion
    - Test null return when no token exists
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 1.3 Create AuthService with mock JWT authentication
    - Implement login method using JSONPlaceholder /users endpoint
    - Generate mock JWT token (base64 encoded user data)
    - Implement logout method
    - Add email and password validation
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6, 1.7_

  - [x] 1.4 Write unit tests for AuthService
    - Test successful login flow
    - Test validation errors
    - Test network error handling
    - _Requirements: 1.1, 1.2, 1.3, 1.6, 1.7_

  - [x] 1.5 Create Zustand auth store (useAuthStore)
    - Define AuthState interface with user, token, isAuthenticated, isLoading, error
    - Implement login, logout, and checkAuth actions
    - Integrate with TokenManager for persistence
    - _Requirements: 1.3, 1.4, 1.5, 2.1, 2.2, 2.3_

  - [x] 1.6 Create useAuth hook
    - Wrap useAuthStore with business logic
    - Handle loading and error states
    - Provide clean API for components
    - _Requirements: 1.3, 1.4, 1.5, 1.6, 1.7_

- [x] 2. Implement login screen and validation
  - [x] 2.1 Create LoginScreen component with form inputs
    - Add email input with email keyboard type
    - Add password input with secure text entry
    - Implement form validation using Zod or Yup schema
    - Add inline error display below each field
    - _Requirements: 1.1, 1.2, 1.10, 12.5, 12.6_

  - [x] 2.2 Add keyboard handling to LoginScreen
    - Dismiss keyboard on tap outside inputs
    - Focus password field when "Next" pressed on email
    - Submit form when "Done" pressed on password
    - Adjust layout with KeyboardAvoidingView
    - _Requirements: 1.9, 12.1, 12.2, 12.3, 12.4_

  - [x] 2.3 Implement login submission logic
    - Connect form to useAuth hook
    - Disable submit button during loading
    - Display error messages from auth service
    - Navigate to app stack on success
    - _Requirements: 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

  - [x] 2.4 Style LoginScreen with modern UI design
    - Center form with card-based layout
    - Apply theme colors, spacing, and typography
    - Add rounded corners and soft shadows
    - Implement touchable feedback on button
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.8_

- [x] 3. Update navigation architecture for authentication
  - [x] 3.1 Create AuthNavigator with auth stack
    - Define AuthStackParamList type
    - Add Login screen to auth stack
    - Configure stack options (headerShown: false)
    - _Requirements: 4.4_

  - [x] 3.2 Update AppNavigator with app stack
    - Define AppStackParamList type
    - Add Home, Detail, and Settings screens
    - Configure tab navigation if needed
    - _Requirements: 4.4_

  - [x] 3.3 Create RootNavigator with conditional rendering
    - Check for stored token on app launch using useAuth
    - Render Auth stack when not authenticated
    - Render App stack when authenticated
    - Add splash screen for loading state
    - Prevent back navigation from App to Auth stack
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [x] 3.4 Write integration tests for navigation flow
    - Test navigation to app stack after login
    - Test navigation to auth stack after logout
    - Test token persistence across app restarts
    - _Requirements: 4.1, 4.2, 4.3, 4.5_

- [x] 4. Checkpoint - Ensure authentication flow works end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Migrate API client from TMDB to JSONPlaceholder
  - [x] 5.1 Update API client configuration
    - Change baseURL to https://jsonplaceholder.typicode.com
    - Remove TMDB API key from headers
    - Keep timeout and content-type settings
    - _Requirements: 18.1, 18.2, 18.3, 18.8_

  - [x] 5.2 Add request interceptor for JWT token
    - Get token from TokenManager
    - Add Authorization header with Bearer token
    - Add request logging for debugging
    - _Requirements: 3.5_

  - [x] 5.3 Add response interceptor for error handling
    - Handle 401 Unauthorized with automatic logout
    - Implement retry logic (max 2 retries) for network errors
    - Log errors with context (status, endpoint, message)
    - Trigger navigation to login on 401
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [x] 5.4 Write integration tests for API client
    - Test request interceptor adds token
    - Test 401 response triggers logout
    - Test retry logic for network errors
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 7.5_

- [x] 6. Create new data models and hooks for JSONPlaceholder
  - [x] 6.1 Define TypeScript types for JSONPlaceholder API
    - Create Item interface (id, userId, title, body)
    - Create ApiUser interface (id, name, email, etc.)
    - Remove movie-specific types
    - _Requirements: 18.4, 18.5_

  - [x] 6.2 Create useItems hook (replaces useMovies)
    - Use React Query with queryKey: ['items']
    - Fetch from /posts endpoint
    - Configure staleTime (5 minutes) and cacheTime (10 minutes)
    - Return loading, error, and data states
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 18.5, 18.6_

  - [x] 6.3 Create useItemDetail hook (replaces useMovieDetail)
    - Use React Query with queryKey: ['item', id]
    - Fetch from /posts/:id endpoint
    - Enable query only when id exists
    - Configure same cache settings as useItems
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 18.5, 18.7_

- [x] 7. Create modern UI components
  - [x] 7.1 Create LoadingSkeleton component with shimmer animation
    - Use Animated API for left-to-right shimmer effect
    - Accept width, height, borderRadius props
    - Apply theme colors for light/dark mode
    - Export multiple skeleton variants (card, text, circle)
    - _Requirements: 10.2, 10.5, 10.6, 10.8_

  - [x] 7.2 Create ErrorState component
    - Display error icon (centered)
    - Display user-friendly error message
    - Add retry button with onPress handler
    - Apply theme typography and spacing
    - _Requirements: 7.7, 10.3, 10.5, 10.6_

  - [x] 7.3 Create EmptyState component
    - Display empty icon (centered)
    - Display empty message
    - Optionally display action button
    - Apply theme typography and spacing
    - _Requirements: 10.4, 10.5, 10.6_

  - [x] 7.4 Create CardItem component (replaces MovieCard)
    - Display item title and body (truncated)
    - Add touchable with opacity feedback
    - Apply card styling (shadow, border radius, padding)
    - Add fade-in animation on mount
    - Memoize component with React.memo
    - _Requirements: 10.1, 10.5, 10.6, 10.7, 11.2, 11.3, 11.6, 11.8, 13.4_

  - [x] 7.5 Write component tests for UI components
    - Test LoadingSkeleton renders with correct dimensions
    - Test ErrorState calls onRetry when button pressed
    - Test EmptyState displays message and action
    - Test CardItem calls onPress with correct id
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 8. Update Home screen with new components and data
  - [x] 8.1 Update HomeScreen to use useItems hook
    - Replace useMovies with useItems
    - Display logged-in user email at top
    - Handle loading state with LoadingSkeleton
    - Handle error state with ErrorState component
    - Handle empty state with EmptyState component
    - _Requirements: 5.1, 5.2, 5.4, 5.5, 5.6, 18.6_

  - [x] 8.2 Implement FlatList with performance optimizations
    - Use keyExtractor with item.id
    - Set initialNumToRender to 10
    - Add pull-to-refresh functionality
    - Render CardItem components in list
    - Add fade-in animation for items
    - _Requirements: 5.3, 5.7, 5.8, 5.9, 13.1, 13.2, 13.4_

  - [x] 8.3 Style HomeScreen with modern design
    - Apply card-based layout with consistent spacing
    - Use theme colors and typography
    - Add proper padding and margins
    - _Requirements: 11.1, 11.2, 11.3, 11.6_

- [x] 9. Update Detail screen with new components and data
  - [x] 9.1 Update DetailScreen to use useItemDetail hook
    - Replace useMovieDetail with useItemDetail
    - Get itemId from navigation params
    - Handle loading state with LoadingSkeleton
    - Handle error state with ErrorState component
    - Handle empty state with EmptyState component
    - _Requirements: 6.1, 6.2, 6.4, 6.5, 6.6, 18.7_

  - [x] 9.2 Display item details with structured layout
    - Reuse CardItem component for consistency
    - Display full title and body text
    - Apply clear typography hierarchy
    - Add proper spacing and padding
    - _Requirements: 6.3, 6.7, 11.4, 11.7_

- [x] 10. Implement logout functionality
  - [x] 10.1 Add logout button to Settings screen
    - Create or update SettingsScreen component
    - Add logout button with clear styling
    - Display confirmation dialog on press
    - _Requirements: 17.1, 17.2, 17.6_

  - [x] 10.2 Implement logout logic
    - Call useAuth logout method
    - Delete token via TokenManager
    - Clear cached user data
    - Navigate to login screen
    - _Requirements: 17.3, 17.4, 17.5_

  - [x] 10.3 Write integration tests for logout flow
    - Test logout clears token
    - Test logout navigates to login screen
    - Test logout clears user data
    - _Requirements: 17.3, 17.4, 17.5_

- [x] 11. Implement dark mode support
  - [x] 11.1 Enhance theme system with light and dark palettes
    - Define light color palette
    - Define dark color palette
    - Update Theme interface if needed
    - _Requirements: 16.1, 11.9_

  - [x] 11.2 Create theme toggle in Settings screen
    - Add theme switch/toggle component
    - Connect to theme store (Zustand)
    - Persist theme preference to AsyncStorage
    - _Requirements: 16.4, 16.6_

  - [x] 11.3 Apply theme to all components
    - Update all components to use theme hook
    - Apply theme colors to navigation headers
    - Ensure smooth theme transitions
    - _Requirements: 16.2, 16.3, 16.5, 16.7_

- [x] 12. Reorganize codebase into feature-based structure
  - [x] 12.1 Create feature directories
    - Create src/features/auth with screens, hooks, services, types
    - Create src/features/home with screens, components, hooks
    - Create src/features/detail with screens, hooks
    - Create src/features/settings with screens
    - _Requirements: 9.1, 9.7_

  - [x] 12.2 Move authentication code to features/auth
    - Move LoginScreen to features/auth/screens
    - Move useAuth to features/auth/hooks
    - Move AuthService and TokenManager to features/auth/services
    - Move auth types to features/auth/types
    - _Requirements: 9.1, 9.7, 9.8_

  - [x] 12.3 Move home code to features/home
    - Move HomeScreen to features/home/screens
    - Move useItems to features/home/hooks
    - Move home-specific components if any
    - _Requirements: 9.1, 9.7, 9.8_

  - [x] 12.4 Move detail code to features/detail
    - Move DetailScreen to features/detail/screens
    - Move useItemDetail to features/detail/hooks
    - _Requirements: 9.1, 9.7, 9.8_

  - [x] 12.5 Organize shared code
    - Keep shared components in src/components
    - Keep shared hooks in src/hooks
    - Keep API client in src/services/api
    - Keep navigation in src/navigation
    - Keep theme in src/theme
    - _Requirements: 9.2, 9.3, 9.4, 9.5, 9.6_

  - [x] 12.6 Update all imports across codebase
    - Update import paths to reflect new structure
    - Ensure no broken imports
    - Test that app builds successfully
    - _Requirements: 9.1, 9.7, 9.8, 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8_

- [x] 13. Checkpoint - Ensure all features work with new structure
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Implement error handling and network resilience
  - [x] 14.1 Add network error detection
    - Detect no internet connection in API client
    - Display "No internet connection" message
    - Provide retry button in ErrorState
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

  - [x] 14.2 Enhance error logging
    - Create structured error log format (timestamp, type, endpoint, status, message)
    - Log all API errors with context
    - Sanitize sensitive data from logs
    - _Requirements: 7.2, 7.3, 7.4_

  - [x] 14.3 Add user-friendly error messages
    - Map technical errors to user-friendly messages
    - Never expose technical details to users
    - Provide actionable guidance (retry, check connection)
    - _Requirements: 7.7, 14.2_

- [x] 15. Add accessibility features
  - [x] 15.1 Add accessibility labels to interactive elements
    - Add accessibilityLabel to all buttons
    - Add accessibilityLabel to all touchable elements
    - Add accessibilityHint where helpful
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8_

  - [x] 15.2 Ensure minimum touch target sizes
    - Verify all touchable elements are at least 44x44pt
    - Add hitSlop where needed
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8_

  - [x] 15.3 Add error announcements for screen readers
    - Use accessibilityLiveRegion for dynamic errors
    - Announce loading states
    - Announce success messages
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8_

- [-] 16. Performance optimization and polish
  - [~] 16.1 Optimize FlatList rendering
    - Add getItemLayout if item heights are fixed
    - Verify keyExtractor is efficient
    - Check initialNumToRender is appropriate
    - _Requirements: 13.1, 13.2, 13.3_

  - [ ] 16.2 Optimize animations
    - Use native driver for all animations where possible
    - Verify smooth 60fps performance
    - _Requirements: 13.6_

  - [ ] 16.3 Code quality review
    - Ensure all components separate presentation from logic
    - Extract business logic into custom hooks
    - Remove inline functions in render methods
    - Verify TypeScript strict typing throughout
    - Add comments for architectural decisions
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8_

  - [ ] 16.4 Clean up and remove old code
    - Remove TMDB API code and types
    - Remove movie-specific components
    - Remove unused dependencies
    - Update environment variables
    - _Requirements: 18.1, 18.2, 18.3, 18.4_

- [x] 17. Final testing and validation
  - [x] 17.1 Run all unit tests
    - Verify TokenManager tests pass
    - Verify AuthService tests pass
    - Verify validation tests pass
    - _Requirements: All_

  - [x] 17.2 Run all integration tests
    - Verify auth flow tests pass
    - Verify navigation tests pass
    - Verify API client tests pass
    - _Requirements: All_

  - [x] 17.3 Run all component tests
    - Verify LoginScreen tests pass
    - Verify UI component tests pass
    - Verify screen tests pass
    - _Requirements: All_

  - [x] 17.4 Manual testing checklist
    - Test complete login flow
    - Test logout flow
    - Test token expiration (401 handling)
    - Test network error handling
    - Test dark mode switching
    - Test pull-to-refresh
    - Test navigation between screens
    - Test keyboard handling
    - _Requirements: All_

- [x] 18. Final checkpoint - Ensure all tests pass and app is production-ready
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- The implementation follows a logical progression: auth foundation → API migration → UI modernization → feature restructuring → testing & polish
- All code should use TypeScript with strict typing
- All components should support both light and dark modes
- All interactive elements should have proper accessibility labels
