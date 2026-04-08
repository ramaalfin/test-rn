# Implementation Plan: Google OAuth Authentication

## Overview

This implementation plan replaces the current mock authentication system with Google OAuth authentication. The approach integrates `@react-native-google-signin/google-signin` for OAuth flow, uses `jsonwebtoken` for JWT generation with 1-hour expiration, and maintains compatibility with existing authentication infrastructure (AuthService, TokenManager, AuthStore, navigation flow).

## Tasks

- [x] 1. Install and configure required dependencies
  - [x] 1.1 Install @react-native-google-signin/google-signin library
    - Run `npm install @react-native-google-signin/google-signin`
    - Run `cd ios && pod install && cd ..` for iOS dependencies
    - _Requirements: 1.1_
  
  - [x] 1.2 Install jsonwebtoken library for JWT generation
    - Run `npm install jsonwebtoken`
    - Run `npm install --save-dev @types/jsonwebtoken`
    - _Requirements: 2.1_
  
  - [x] 1.3 Create environment configuration file
    - Copy `.env.example` to `.env`
    - Add placeholder values for `GOOGLE_WEB_CLIENT_ID`, `GOOGLE_IOS_CLIENT_ID`, `GOOGLE_ANDROID_CLIENT_ID`
    - Document how to obtain these values from Google Cloud Console
    - _Requirements: 1.1, 9.5_

- [x] 2. Configure iOS platform for Google Sign-In
  - [x] 2.1 Update Info.plist with URL scheme
    - Add `CFBundleURLTypes` array with Google Sign-In URL scheme
    - Use reversed iOS Client ID format (com.googleusercontent.apps.XXXXXX)
    - _Requirements: 9.1_
  
  - [x] 2.2 Configure iOS app capabilities
    - Ensure proper bundle identifier is set
    - Document iOS Client ID setup in Google Cloud Console
    - _Requirements: 9.1, 9.4_

- [x] 3. Configure Android platform for Google Sign-In
  - [x] 3.1 Update android/app/build.gradle
    - Add Google Services plugin if needed
    - Ensure package name matches Google Cloud Console configuration
    - _Requirements: 9.2_
  
  - [x] 3.2 Document SHA-1 fingerprint generation
    - Create instructions for generating debug and release SHA-1 fingerprints
    - Document how to add SHA-1 to Google Cloud Console
    - _Requirements: 9.3_

- [x] 4. Create Google OAuth configuration module
  - [x] 4.1 Create src/features/auth/config/googleOAuth.config.ts
    - Define `GoogleOAuthConfig` interface
    - Export `googleOAuthConfig` object with client IDs from environment variables
    - Include scopes: ['email', 'profile']
    - _Requirements: 1.1, 9.5_

- [x] 5. Implement JWT Service
  - [x] 5.1 Create src/features/auth/services/jwtService.ts
    - Define `JWTPayload` interface with sub, email, name, picture, iat, exp
    - Implement `generateToken` function with 1-hour expiration
    - Implement `validateToken` function to verify signature and expiration
    - Implement `decodeToken` function for payload extraction
    - Use a secure secret key from environment variables
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_
  
  - [ ]* 5.2 Write unit tests for JWT Service
    - Test token generation with valid user info
    - Test token validation with expired tokens
    - Test token validation with invalid signatures
    - Test payload decoding
    - _Requirements: 2.5, 2.6, 2.7_

- [x] 6. Update AuthService with Google OAuth integration
  - [x] 6.1 Add Google Sign-In configuration method
    - Implement `configureGoogleSignIn()` function
    - Configure with client IDs from googleOAuth.config
    - Call during app initialization
    - _Requirements: 1.1_
  
  - [x] 6.2 Implement loginWithGoogle method
    - Import GoogleSignin from @react-native-google-signin/google-signin
    - Implement `loginWithGoogle()` function
    - Handle Google Sign-In flow with `GoogleSignin.signIn()`
    - Extract user info (email, name, picture, sub) from Google response
    - Validate email format using existing `validateEmail` function
    - Validate presence of idToken and user data
    - Generate JWT token using JWTService
    - Store JWT token using TokenManager
    - Return AuthResponse with token and user data
    - _Requirements: 1.2, 1.3, 1.6, 2.1, 3.1, 7.1, 7.2, 7.3_
  
  - [x] 6.3 Add error handling for Google OAuth flow
    - Handle user cancellation (statusCodes.SIGN_IN_CANCELLED)
    - Handle network errors with descriptive messages
    - Handle invalid token responses
    - Return user-friendly error messages
    - _Requirements: 1.4, 1.5, 8.1, 8.2, 8.3_
  
  - [x] 6.4 Update logout method to revoke Google tokens
    - Call `GoogleSignin.revokeAccess()` before clearing local storage
    - Handle revocation errors gracefully
    - Maintain existing TokenManager.deleteToken() call
    - _Requirements: 6.1, 6.2_
  
  - [x] 6.5 Update validateToken to check JWT expiration
    - Use JWTService.validateToken() instead of mock validation
    - Check token structure and expiration
    - Clear invalid tokens automatically
    - _Requirements: 3.2, 7.4, 7.5, 7.6, 8.4_
  
  - [ ]* 6.6 Write unit tests for AuthService Google OAuth methods
    - Test loginWithGoogle success flow
    - Test loginWithGoogle with user cancellation
    - Test loginWithGoogle with network errors
    - Test logout with Google token revocation
    - Test validateToken with expired JWT
    - _Requirements: 1.4, 1.5, 8.1, 8.2, 8.3, 8.4_

- [x] 7. Checkpoint - Ensure core authentication logic is complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Update AuthStore with Google OAuth support
  - [x] 8.1 Add picture field to User type
    - Update User interface in src/features/auth/types/auth.types.ts
    - Add optional `picture?: string` field
    - _Requirements: 5.2_
  
  - [x] 8.2 Add loginWithGoogle action to AuthStore
    - Import AuthService.loginWithGoogle
    - Create `loginWithGoogle` action in useAuthStore
    - Update user state with picture from Google
    - Handle errors and set error state
    - _Requirements: 10.3_
  
  - [x] 8.3 Update checkAuth to validate JWT expiration
    - Use AuthService.validateToken for stored tokens
    - Clear expired tokens and navigate to login
    - _Requirements: 7.5, 8.4_

- [x] 9. Update LoginScreen with Google Sign-In button
  - [x] 9.1 Add Google Sign-In button component
    - Import GoogleSignin button or create custom button
    - Follow Google Brand Guidelines (white background, Google logo, proper text)
    - Use 48dp minimum height for accessibility
    - Add rounded corners (2dp) and subtle shadow
    - _Requirements: 4.1, 4.2_
  
  - [x] 9.2 Implement Google Sign-In button handler
    - Call `loginWithGoogle` from useAuth hook
    - Show loading indicator during OAuth flow
    - Disable button during loading
    - _Requirements: 4.3, 4.4_
  
  - [x] 9.3 Add OAuth-specific error message display
    - Display "Sign in cancelled" for user cancellation
    - Display "No internet connection" for network errors
    - Display "Authentication failed" for other errors
    - Show error messages below the button
    - _Requirements: 4.5, 4.6, 4.7, 8.1, 8.2, 8.3, 8.5_
  
  - [x] 9.4 Update useAuth hook to support Google OAuth
    - Add `loginWithGoogle` function to useAuth hook
    - Call AuthStore's loginWithGoogle action
    - Handle loading and error states
    - _Requirements: 10.3_

- [x] 10. Update HomeScreen to display Google profile information
  - [x] 10.1 Display user profile picture
    - Add Image component for profile picture
    - Use user.picture from auth state
    - Add fallback for missing profile picture
    - Apply circular styling
    - _Requirements: 5.2_
  
  - [x] 10.2 Display user name from JWT
    - Show user.name from auth state
    - Maintain existing email display
    - _Requirements: 5.3_
  
  - [x] 10.3 Verify existing email display still works
    - Ensure user.email is displayed correctly
    - No changes needed if already implemented
    - _Requirements: 5.1, 10.6_

- [x] 11. Update SettingsScreen logout functionality
  - [x] 11.1 Verify logout button calls enhanced logout
    - Ensure existing logout button calls AuthService.logout
    - Verify Google token revocation is triggered
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [x] 11.2 Add error alert for logout failures
    - Display alert when logout fails
    - Show user-friendly error message
    - _Requirements: 6.5_
  
  - [x] 11.3 Verify navigation to LoginScreen after logout
    - Ensure navigation flow works correctly
    - No changes needed if already implemented
    - _Requirements: 6.4, 10.7_

- [x] 12. Initialize Google Sign-In on app startup
  - [x] 12.1 Update App.tsx or root component
    - Import AuthService.configureGoogleSignIn
    - Call configureGoogleSignIn() in useEffect on mount
    - Handle configuration errors gracefully
    - _Requirements: 1.1_

- [ ] 13. Create setup documentation
  - [ ] 13.1 Document Google Cloud Console setup
    - Create step-by-step guide for creating OAuth credentials
    - Document how to obtain Web, iOS, and Android Client IDs
    - Document SHA-1 fingerprint generation and registration
    - Document redirect URI configuration
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ] 13.2 Document environment variable configuration
    - List all required environment variables
    - Provide example values format
    - Document where to find each value in Google Cloud Console
    - _Requirements: 1.1, 9.5_

- [ ] 14. Final checkpoint - Integration testing
  - [ ] 14.1 Test complete Google OAuth flow on iOS
    - Test successful login with Google account
    - Test user cancellation handling
    - Test network error handling
    - Verify profile picture and name display
    - Test logout and token revocation
    - _Requirements: 1.2, 1.4, 1.5, 5.1, 5.2, 5.3, 6.1_
  
  - [ ] 14.2 Test complete Google OAuth flow on Android
    - Test successful login with Google account
    - Test user cancellation handling
    - Test network error handling
    - Verify profile picture and name display
    - Test logout and token revocation
    - _Requirements: 1.2, 1.4, 1.5, 5.1, 5.2, 5.3, 6.1_
  
  - [ ] 14.3 Test JWT token expiration handling
    - Verify 1-hour expiration is enforced
    - Test automatic logout when token expires
    - Test navigation to LoginScreen on expired token
    - _Requirements: 2.4, 7.5, 8.4_
  
  - [ ] 14.4 Verify existing functionality remains intact
    - Test navigation flow between Auth and App stacks
    - Test API interceptors with new JWT tokens
    - Verify AsyncStorage token persistence
    - _Requirements: 10.3, 10.4, 10.5_

- [ ] 15. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Google Cloud Console setup (task 13) should be completed before testing OAuth flow
- Environment variables must be configured before running the app with Google OAuth
- The design uses TypeScript, so all implementation should use TypeScript
- Existing mock authentication code in AuthService should be removed or commented out after Google OAuth is working
- JWT secret key should be stored securely and not committed to version control
