import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';
import useAppTheme from '../hooks/useAppTheme';
import type { Item } from '../types/api.types';

interface CardItemProps {
  item: Item;
  onPress: (id: number) => void;
}

const CardItem: React.FC<CardItemProps> = ({ item, onPress }) => {
  const theme = useAppTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.md,
      marginHorizontal: theme.spacing.lg,
      marginVertical: theme.spacing.sm,
      padding: theme.spacing.lg,
      ...theme.shadows.card,
    },
    title: {
      ...theme.typography.subheading,
      marginBottom: theme.spacing.sm,
    },
    body: {
      ...theme.typography.body,
      color: theme.colors.text.secondary,
    },
  });

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => onPress(item.id)}
        activeOpacity={0.7}
        accessibilityLabel={`${item.title}`}
        accessibilityHint="Double tap to view details"
        accessibilityRole="button"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.body} numberOfLines={3}>
          {item.body}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default React.memo(CardItem);
