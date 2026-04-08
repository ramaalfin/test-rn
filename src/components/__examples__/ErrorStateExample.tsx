import React from 'react';
import { View } from 'react-native';
import { ErrorState } from '../ErrorState';

/**
 * Example usage of ErrorState component
 * 
 * This component displays an error message with a retry button.
 * It's typically used when API calls fail or network errors occur.
 */
export const ErrorStateExample: React.FC = () => {
  const handleRetry = () => {
    console.log('Retry button pressed');
    // Implement retry logic here (e.g., refetch data)
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Basic usage with default icon */}
      <ErrorState
        message="Unable to load data. Please check your connection and try again."
        onRetry={handleRetry}
      />

      {/* Usage with custom icon */}
      {/* <ErrorState
        message="Something went wrong. Please try again."
        onRetry={handleRetry}
        icon="❌"
      /> */}
    </View>
  );
};

export default ErrorStateExample;
