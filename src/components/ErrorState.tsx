import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  icon?: string;
  actionText?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = React.memo(({
  message,
  onRetry,
  icon = '⚠️',
  actionText = 'Retry',
}) => {
  const theme = useAppTheme();

  return (
    <View 
      style={styles.container}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Text 
        style={styles.icon}
        accessibilityLabel={`Error icon`}
        accessibilityRole="image"
      >
        {icon}
      </Text>
      <Text 
        style={[styles.message, { color: theme.colors.text.secondary }]}
        accessibilityRole="text"
      >
        {message}
      </Text>
      <TouchableOpacity
        style={[
          styles.retryButton,
          {
            backgroundColor: theme.colors.primary,
            borderRadius: theme.borderRadius.md,
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.xl,
            marginTop: theme.spacing.lg,
          },
        ]}
        onPress={onRetry}
        activeOpacity={0.7}
        accessibilityLabel={actionText}
        accessibilityHint="Double tap to retry the operation"
        accessibilityRole="button"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text
          style={[
            styles.retryButtonText,
            {
              ...theme.typography.label,
              color: theme.colors.text.inverse,
            },
          ]}
        >
          {actionText}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  retryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  },
  retryButtonText: {
    fontWeight: '500',
  },
});

export default ErrorState;
