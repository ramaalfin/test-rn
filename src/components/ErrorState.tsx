import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  icon?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = React.memo(({
  message,
  onRetry,
  icon = '⚠️',
}) => {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.message, { color: theme.colors.text.secondary }]}>
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
      >
        <Text
          style={[
            styles.retryButtonText,
            {
              color: theme.colors.text.inverse,
              ...theme.typography.label,
            },
          ]}
        >
          Retry
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
  },
  retryButtonText: {
    fontWeight: '500',
  },
});

export default ErrorState;
