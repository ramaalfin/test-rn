import React from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CardItem from '../components/CardItem';
import useItems from '../hooks/useItems';
import type { Item } from '../types/api.types';
import type { RootStackParamList } from '../navigation/RootNavigator';
import useAppTheme from '../hooks/useAppTheme';
import { SkeletonCard } from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import useAuthStore from '../stores/useAuthStore';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Tabs'
>;

const HomeScreen: React.FC = () => {
  const {
    data: items,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useItems();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuthStore();

  const theme = useAppTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    emailText: {
      ...theme.typography.body,
      color: theme.colors.text.secondary,
    },
    list: {
      paddingVertical: theme.spacing.sm,
    },
    skeletonContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
    },
  });

  const handleItemPress = (id: number) => {
    navigation.navigate('Detail', { itemId: id });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.emailText}>
        {user?.email || 'Not logged in'}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.skeletonContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonCard key={index} style={{ marginBottom: theme.spacing.md }} />
          ))}
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <ErrorState
          message="Failed to load items. Please try again."
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  if (!items || items.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <EmptyState
          message="No items available at the moment."
          icon="📭"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <CardItem item={item} onPress={handleItemPress} />
        )}
        contentContainerStyle={styles.list}
        ListHeaderComponent={renderHeader}
        initialNumToRender={10}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[theme.colors.secondary]}
            tintColor={theme.colors.secondary}
          />
        }
      />
    </View>
  );
};

export default HomeScreen;
