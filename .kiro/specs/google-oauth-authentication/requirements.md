# Requirements Document

## Introduction

This document specifies requirements for implementing Google OAuth authentication to replace the current mock authentication system in the React Native application. The system will integrate Google Sign-In, generate proper JWT tokens with 1-hour expiration, and maintain existing functionality including token storage, navigation flow, and logout capabilities.

## Glossary

- **OAuth_Client**: The Google Sign-In library (@react-native-google-signin/google-signin) that handles OAuth flow
- **JWT_Generator**: The jsonwebtoken library that creates and verifies JWT tokens
- **Token_Manager**: The existing AsyncStorage-based service that stores JWT tokens
- **Auth_Service**: The authentication service that orchestrates login and logout operations
- **Login_Screen**: The UI component that presents the Google Sign-In button
- **Home_Screen**: The UI component that displays the logged-in user's information
- **Settings_Screen**: The UI component that provides logout functionality
- **Auth_Store**: The Zustand store that manages authentication state
- **Google_User_Info**: User data returned from Google (email, name, profile picture, sub)
- **JWT_Token**: JSON Web Token with 1-hour expiration containing user claims
- **Access_Token**: OAuth access token provided by Google
- **ID_Token**: OAuth ID token provided by Google containing user information

## Requirements

### Requirement 1: Google OAuth Integration

**User Story:** As a user, I want to sign in with my Google account, so that I can authenticate without creating a separate password

#### Acceptance Criteria

1. WHEN the Login_Screen loads, THE OAuth_Client SHALL be configured with Web Client ID, iOS Client ID, and Android Client ID
2. WHEN a user taps the "Sign in with Google" button, THE OAuth_Client SHALL initiate the Google OAuth flow
3. WHEN the OAuth flow completes successfully, THE OAuth_Client SHALL return Access_Token, ID_Token, and Google_User_Info
4. WHEN the OAuth flow is cancelled by the user, THE Auth_Service SHALL handle the cancellation without crashing
5. IF the OAuth flow fails due to network error, THEN THE Auth_Service SHALL return a descriptive error message
6. THE OAuth_Client SHALL extract email, name, profile picture URL, and sub from Google_User_Info

### Requirement 2: JWT Token Generation

**User Story:** As a developer, I want to generate secure JWT tokens with expiration, so that user sessions are properly managed

#### Acceptance Criteria

1. WHEN Google authentication succeeds, THE JWT_Generator SHALL create a JWT_Token with 1-hour expiration
2. THE JWT_Generator SHALL include email, name, and sub in the JWT_Token payload
3. THE JWT_Generator SHALL include iat (issued at) timestamp in the JWT_Token payload
4. THE JWT_Generator SHALL include exp (expiration) timestamp set to 1 hour from iat
5. WHEN validating a JWT_Token, THE JWT_Generator SHALL verify the token signature
6. WHEN validating a JWT_Token, THE JWT_Generator SHALL check that current time is before exp timestamp
7. IF a JWT_Token is expired, THEN THE JWT_Generator SHALL return validation failure

### Requirement 3: Token Storage

**User Story:** As a user, I want my authentication session to persist, so that I don't have to sign in every time I open the app

#### Acceptance Criteria

1. WHEN a JWT_Token is generated, THE Token_Manager SHALL store it in AsyncStorage
2. WHEN the app launches, THE Token_Manager SHALL retrieve the stored JWT_Token
3. WHEN logout occurs, THE Token_Manager SHALL delete the JWT_Token from AsyncStorage
4. THE Token_Manager SHALL use the existing storage key "@auth_token"

### Requirement 4: Login Screen UI

**User Story:** As a user, I want a clear and recognizable Google sign-in button, so that I understand how to authenticate

#### Acceptance Criteria

1. THE Login_Screen SHALL display a "Sign in with Google" button with Google logo
2. THE Login_Screen SHALL follow Google's brand guidelines for button styling
3. WHEN the OAuth flow is in progress, THE Login_Screen SHALL display a loading indicator
4. WHEN the OAuth flow is in progress, THE Login_Screen SHALL disable the sign-in button
5. IF authentication fails, THEN THE Login_Screen SHALL display an error message below the button
6. IF the user cancels OAuth flow, THEN THE Login_Screen SHALL display "Sign in cancelled" message
7. IF a network error occurs, THEN THE Login_Screen SHALL display "No internet connection" message

### Requirement 5: User Information Display

**User Story:** As a user, I want to see my account information after signing in, so that I know I'm authenticated

#### Acceptance Criteria

1. WHEN the Home_Screen loads, THE Home_Screen SHALL display the logged-in user's email
2. WHERE profile picture is available, THE Home_Screen SHALL display the user's profile picture
3. WHERE name is available, THE Home_Screen SHALL display the user's name

### Requirement 6: Logout Functionality

**User Story:** As a user, I want to sign out of my account, so that I can protect my privacy

#### Acceptance Criteria

1. WHEN a user taps logout in Settings_Screen, THE Auth_Service SHALL revoke the Google Access_Token
2. WHEN logout is initiated, THE Token_Manager SHALL delete the JWT_Token
3. WHEN logout is initiated, THE Auth_Store SHALL clear user data from state
4. WHEN logout completes, THE application SHALL navigate to Login_Screen
5. WHEN logout fails, THE Settings_Screen SHALL display an error alert

### Requirement 7: Input Validation

**User Story:** As a developer, I want to validate authentication data, so that the system handles invalid data gracefully

#### Acceptance Criteria

1. WHEN Google_User_Info is received, THE Auth_Service SHALL validate that email matches email format regex
2. WHEN Google_User_Info is received, THE Auth_Service SHALL validate that Access_Token is present
3. WHEN Google_User_Info is received, THE Auth_Service SHALL validate that ID_Token is present
4. WHEN the app launches with a stored JWT_Token, THE Auth_Service SHALL validate the token structure
5. WHEN the app launches with a stored JWT_Token, THE Auth_Service SHALL validate the token expiration
6. IF validation fails, THEN THE Auth_Service SHALL clear the invalid token and require re-authentication

### Requirement 8: Error Handling

**User Story:** As a user, I want clear error messages when authentication fails, so that I understand what went wrong

#### Acceptance Criteria

1. IF the user cancels Google Sign-In, THEN THE Auth_Service SHALL return "Sign in was cancelled"
2. IF network connection fails during OAuth, THEN THE Auth_Service SHALL return "No internet connection. Please check your network."
3. IF Google returns invalid tokens, THEN THE Auth_Service SHALL return "Authentication failed. Please try again."
4. IF JWT_Token expires during app use, THEN THE Auth_Service SHALL clear the token and navigate to Login_Screen
5. WHEN any authentication error occurs, THE Login_Screen SHALL display the error message in user-friendly format

### Requirement 9: Platform Configuration

**User Story:** As a developer, I want platform-specific OAuth configuration, so that Google Sign-In works on both iOS and Android

#### Acceptance Criteria

1. THE OAuth_Client SHALL be configured with iOS URL scheme in Info.plist
2. THE OAuth_Client SHALL be configured with Android package name in build.gradle
3. THE OAuth_Client SHALL be configured with Android SHA-1 fingerprint in Google Cloud Console
4. THE OAuth_Client SHALL be configured with redirect URIs for both iOS and Android platforms
5. THE OAuth_Client SHALL use Web Client ID for both platforms

### Requirement 10: Integration with Existing System

**User Story:** As a developer, I want to integrate Google OAuth without breaking existing functionality, so that the app continues to work correctly

#### Acceptance Criteria

1. THE Auth_Service SHALL replace mock authentication logic with Google OAuth logic
2. THE Auth_Service SHALL continue using the existing Token_Manager for JWT storage
3. THE Auth_Store SHALL continue managing authentication state with the same interface
4. THE navigation flow SHALL continue switching between Auth stack and App stack based on token presence
5. THE existing API interceptors SHALL continue working with JWT tokens from Google authentication
6. THE Home_Screen SHALL continue displaying user email without modification
7. THE Settings_Screen SHALL continue providing logout functionality without modification

