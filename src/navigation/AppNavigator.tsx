import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import TabNavigator, { TabParamList } from './TabNavigator';
import DetailScreen from '../screens/DetailScreen';
import useAppTheme from '../hooks/useAppTheme';
import useSettingsStore from '../stores/useSettingsStore';

/**
 * AppStackParamList
 * 
 * Type definition for app stack navigation parameters.
 * Includes tab navigator and detail screen.
 * 
 * Requirements: 4.4 - Authentication Navigation Flow
 */
export type AppStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  Detail: { itemId: number };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

/**
 * AppNavigator Component
 * 
 * Navigation stack for authenticated app screens.
 * Displays when user is authenticated.
 * 
 * Requirements: 4.4 - Authentication Navigation Flow
 * 
 * Features:
 * - Tab navigator as the initial route (Home, Search, Favorites, Settings)
 * - Detail screen for viewing item details
 * - Theme-aware header styling
 * - Supports both light and dark modes
 */
const AppNavigator: React.FC = () => {
  const theme = useAppTheme();
  const { isDarkMode } = useSettingsStore();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: isDarkMode ? theme.colors.background : theme.colors.primary,
        },
        headerTintColor: isDarkMode ? theme.colors.text.primary : theme.colors.text.inverse,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ title: 'Detail' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
