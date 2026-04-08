import React from 'react';
import {Alert, View} from 'react-native';
import EmptyState from '../EmptyState';

/**
 * Example usage of EmptyState component
 */
const EmptyStateExample = () => {
  return (
    <View style={{flex: 1}}>
      {/* Basic usage with message only */}
      <EmptyState message="No items found" />

      {/* With custom icon */}
      <EmptyState message="No search results" icon="🔍" />

      {/* With action button */}
      <EmptyState
        message="No items found"
        icon="📭"
        action={{
          label: 'Refresh',
          onPress: () => Alert.alert('Refresh', 'Refreshing data...'),
        }}
      />
    </View>
  );
};

export default EmptyStateExample;
