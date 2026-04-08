import React from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CardItem from '../../../components/CardItem';
import type { AppStackParamList } from '../../../navigation/AppNavigator';
import useAppTheme from '../../../hooks/useAppTheme';
import { SkeletonCard } from '../../../components/LoadingSkeleton';
import ErrorState from '../../../components/ErrorState';
import EmptyState from '../../../components/EmptyState';
import useAuthStore from '../../../stores/useAuthStore';
import { useItems } from '../hooks';
import { useErrorHandler } from '../../../hooks/useErrorHandler';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'Detail'
>;

const HomeScreen: React.FC = () => {
  const {
    data: items,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useItems();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuthStore();
  const { getErrorDisplayInfo } = useErrorHandler();

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
    userInfoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    profilePictureContainer: {
      marginRight: theme.spacing.md,
    },
    profilePicture: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.border,
    },
    userTextContainer: {
      flex: 1,
    },
    nameText: {
      ...theme.typography.subheading,
      fontWeight: '600',
      marginBottom: theme.spacing.xs,
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
    <View 
      style={styles.header}
      accessibilityRole="header"
    >
      <View style={styles.userInfoContainer}>
        {user?.picture && (
          <View style={styles.profilePictureContainer}>
            <Image
              source={{ uri: user.picture }}
              style={styles.profilePicture}
              accessibilityLabel={`Profile picture of ${user.name || 'user'}`}
              accessibilityRole="image"
            />
          </View>
        )}
        <View style={styles.userTextContainer}>
          {user?.name && (
            <Text 
              style={styles.nameText}
              accessibilityRole="text"
            >
              {user.name}
            </Text>
          )}
          <Text 
            style={styles.emailText}
            accessibilityRole="text"
          >
            {user?.email || 'Not logged in'}
          </Text>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View 
        style={styles.container}
        accessibilityLabel="Loading items"
        accessibilityRole="none"
      >
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
    const errorInfo = getErrorDisplayInfo(error);
    return (
      <View style={styles.container}>
        {renderHeader()}
        <ErrorState
          message={errorInfo.message}
          icon={errorInfo.icon}
          actionText={errorInfo.actionText}
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
            accessibilityLabel="Pull to refresh items"
          />
        }
        accessibilityLabel={`List of ${items?.length || 0} items`}
        accessibilityRole="list"
      />
    </View>
  );
};

export default HomeScreen;
