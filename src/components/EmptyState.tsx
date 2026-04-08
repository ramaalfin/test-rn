import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import theme from '../theme';

interface EmptyStateProps {
  message: string;
  icon?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  icon = '📭',
  action,
}) => {
  return (
    <View 
      style={styles.container}
      accessibilityRole="none"
    >
      <Text 
        style={styles.icon}
        accessibilityLabel="Empty state icon"
        accessibilityRole="image"
      >
        {icon}
      </Text>
      <Text 
        style={styles.message}
        accessibilityRole="text"
      >
        {message}
      </Text>
      {action && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={action.onPress}
          activeOpacity={0.7}
          accessibilityLabel={action.label}
          accessibilityHint="Double tap to perform this action"
          accessibilityRole="button"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.actionButtonText}>{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  icon: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  message: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  actionButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
    minHeight: 44,
    minWidth: 44,
  },
  actionButtonText: {
    ...theme.typography.label,
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
});

export default EmptyState;
