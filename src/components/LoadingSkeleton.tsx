import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

interface LoadingSkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = React.memo(({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const theme = useAppTheme();
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [shimmerAnimation]);

  const translateX = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  return (
    <View
      style={[
        styles.container,
        {
          width: width as any,
          height: height as any,
          borderRadius,
          backgroundColor: theme.colors.skeleton,
        },
        style,
      ]}
      accessibilityLabel="Loading"
      accessibilityRole="none"
      accessible={false}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
});

// Skeleton variants for common use cases
export const SkeletonCard: React.FC<{ style?: ViewStyle }> = React.memo(({ style }) => {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.lg,
        },
        theme.shadows.card,
        style,
      ]}
      accessibilityLabel="Loading content"
      accessibilityRole="none"
      accessible={false}
    >
      <LoadingSkeleton width="60%" height={24} borderRadius={4} />
      <View style={{ height: theme.spacing.md }} />
      <LoadingSkeleton width="100%" height={16} borderRadius={4} />
      <View style={{ height: theme.spacing.sm }} />
      <LoadingSkeleton width="100%" height={16} borderRadius={4} />
      <View style={{ height: theme.spacing.sm }} />
      <LoadingSkeleton width="80%" height={16} borderRadius={4} />
    </View>
  );
});

export const SkeletonText: React.FC<{
  lines?: number;
  style?: ViewStyle;
}> = React.memo(({ lines = 3, style }) => {
  const theme = useAppTheme();

  return (
    <View style={style}>
      {Array.from({ length: lines }).map((_, index) => (
        <View key={index}>
          <LoadingSkeleton
            width={index === lines - 1 ? '70%' : '100%'}
            height={16}
            borderRadius={4}
          />
          {index < lines - 1 && <View style={{ height: theme.spacing.sm }} />}
        </View>
      ))}
    </View>
  );
});

export const SkeletonCircle: React.FC<{
  size?: number;
  style?: ViewStyle;
}> = React.memo(({ size = 48, style }) => {
  return (
    <LoadingSkeleton
      width={size}
      height={size}
      borderRadius={size / 2}
      style={style}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  shimmer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  card: {
    width: '100%',
  },
});

export default LoadingSkeleton;
