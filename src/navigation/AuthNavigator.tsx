import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../features/auth/screens/LoginScreen';

/**
 * AuthStackParamList
 * 
 * Type definition for authentication stack navigation parameters.
 * Currently includes only the Login screen.
 * 
 * Requirements: 4.4 - Authentication Navigation Flow
 */
export type AuthStackParamList = {
  Login: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

/**
 * AuthNavigator Component
 * 
 * Navigation stack for authentication-related screens.
 * Displays when user is not authenticated.
 * 
 * Requirements: 4.4 - Authentication Navigation Flow
 * 
 * Features:
 * - Login screen as the initial route
 * - No headers shown (headerShown: false)
 * - Separated from app navigation stack
 */
const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Hide headers for auth screens
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
