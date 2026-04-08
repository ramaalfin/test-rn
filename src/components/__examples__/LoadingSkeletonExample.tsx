import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import {
  LoadingSkeleton,
  SkeletonCard,
  SkeletonText,
  SkeletonCircle,
} from '../LoadingSkeleton';
import { useAppTheme } from '../../hooks/useAppTheme';

/**
 * Example usage of LoadingSkeleton components
 * This demonstrates all variants and common use cases
 */
export const LoadingSkeletonExample: React.FC = () => {
  const theme = useAppTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.section}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Basic Skeleton
        </Text>
        <LoadingSkeleton width="100%" height={20} borderRadius={4} />
        <View style={{ height: theme.spacing.md }} />
        <LoadingSkeleton width="80%" height={20} borderRadius={4} />
        <View style={{ height: theme.spacing.md }} />
        <LoadingSkeleton width="60%" height={20} borderRadius={4} />
      </View>

      <View style={styles.section}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Skeleton Card
        </Text>
        <SkeletonCard />
      </View>

      <View style={styles.section}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Skeleton Text (3 lines)
        </Text>
        <SkeletonText lines={3} />
      </View>

      <View style={styles.section}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Skeleton Circle (Avatar)
        </Text>
        <View style={styles.row}>
          <SkeletonCircle size={48} />
          <View style={{ width: theme.spacing.md }} />
          <View style={{ flex: 1 }}>
            <LoadingSkeleton width="60%" height={16} borderRadius={4} />
            <View style={{ height: theme.spacing.sm }} />
            <LoadingSkeleton width="40%" height={14} borderRadius={4} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Custom Skeleton (Image Placeholder)
        </Text>
        <LoadingSkeleton
          width="100%"
          height={200}
          borderRadius={theme.borderRadius.md}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          List of Skeleton Cards
        </Text>
        <SkeletonCard />
        <View style={{ height: theme.spacing.md }} />
        <SkeletonCard />
        <View style={{ height: theme.spacing.md }} />
        <SkeletonCard />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default LoadingSkeletonExample;
