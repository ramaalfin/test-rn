import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import AuthNavigator, { AuthStackParamList } from './AuthNavigator';
import AppNavigator, { AppStackParamList } from './AppNavigator';
import SplashScreen from '../components/SplashScreen';
import useAuth from '../features/auth/hooks/useAuth';

/**
 * RootStackParamList
 * 
 * Type definition for root navigation parameters.
 * Includes both Auth and App stacks.
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4 - Authentication Navigation Flow
 */
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * RootNavigator Component
 * 
 * Top-level navigator that manages authentication flow.
 * Conditionally renders Auth or App stack based on authentication state.
 * 
 * Requirements:
 * - 4.1: Check for stored token on app launch
 * - 4.2: Render Auth stack when not authenticated
 * - 4.3: Render App stack when authenticated
 * - 4.4: Add splash screen for loading state
 * - 4.5: Prevent back navigation from App to Auth stack
 * - 4.6: Seamless navigation between login and app screens
 * 
 * Features:
 * - Automatic authentication check on mount via useAuth hook
 * - Splash screen during authentication check
 * - Conditional stack rendering based on isAuthenticated
 * - No headers shown (managed by child navigators)
 * - Prevents back navigation between auth states
 * 
 * Flow:
 * 1. App launches → useAuth checks for stored token
 * 2. While checking → Display SplashScreen
 * 3. Token found → Render App stack
 * 4. No token → Render Auth stack
 * 5. User logs in → Navigate to App stack
 * 6. User logs out → Navigate to Auth stack
 */
const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  /**
   * Display splash screen while checking authentication status
   * Requirements: 4.4 - Add splash screen for loading state
   */
  if (isLoading) {
    return <SplashScreen />;
  }

  /**
   * Conditional rendering based on authentication state
   * 
   * Key behaviors:
   * - Only one stack is rendered at a time (Auth OR App)
   * - Stack.Screen order doesn't matter since only one is rendered
   * - No back navigation between stacks (they're mutually exclusive)
   * - Navigation state is reset when switching stacks
   * 
   * Requirements:
   * - 4.2: Render Auth stack when not authenticated
   * - 4.3: Render App stack when authenticated
   * - 4.5: Prevent back navigation from App to Auth stack
   */
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Headers managed by child navigators
        animation: 'fade', // Smooth transition between auth states
      }}
    >
      {isAuthenticated ? (
        /**
         * App Stack - Shown when user is authenticated
         * Contains: Home, Search, Favorites, Settings, Detail screens
         * Requirements: 4.3 - Render App stack when authenticated
         */
        <Stack.Screen
          name="App"
          component={AppNavigator}
          options={{
            animationTypeForReplace: 'push', // Smooth animation when logging in
          }}
        />
      ) : (
        /**
         * Auth Stack - Shown when user is not authenticated
         * Contains: Login screen
         * Requirements: 4.2 - Render Auth stack when not authenticated
         */
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{
            animationTypeForReplace: 'pop', // Smooth animation when logging out
          }}
        />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
