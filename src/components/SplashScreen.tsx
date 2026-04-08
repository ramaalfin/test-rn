import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import useAppTheme from '../hooks/useAppTheme';

/**
 * SplashScreen Component
 * 
 * Displays a loading indicator while checking authentication status.
 * Shown during app initialization before determining which navigation stack to render.
 * 
 * Requirements: 4.1 - Authentication Navigation Flow
 * 
 * Features:
 * - Centered loading indicator
 * - Theme-aware background color
 * - Minimal, clean design
 */
const SplashScreen: React.FC = () => {
  const theme = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator 
        size="large" 
        color={theme.colors.primary} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;
