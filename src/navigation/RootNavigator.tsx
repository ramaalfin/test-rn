import React, { useEffect, useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import AuthNavigator, { AuthStackParamList } from './AuthNavigator';
import AppNavigator, { AppStackParamList } from './AppNavigator';
import SplashScreen from '../components/SplashScreen';
import useAuthStore from '../stores/useAuthStore';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) {
      console.log('[RootNavigator] Already initialized, skipping checkAuth');
      return;
    }

    hasInitialized.current = true;
    console.log('[RootNavigator] First mount - calling checkAuth');

    checkAuth().catch((error) => {
      console.error('[RootNavigator] Error during checkAuth:', error);
    });
  }, [checkAuth]);

  useEffect(() => {
    console.log('[RootNavigator] State changed:', { isAuthenticated, isLoading });
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    console.log('[RootNavigator] Rendering SplashScreen');
    return <SplashScreen />;
  }

  console.log('[RootNavigator] Rendering', isAuthenticated ? 'App' : 'Auth', 'stack');

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen
          name="App"
          component={AppNavigator}
          options={{
            animationTypeForReplace: 'push',
          }}
        />
      ) : (
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{
            animationTypeForReplace: 'pop',
          }}
        />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
