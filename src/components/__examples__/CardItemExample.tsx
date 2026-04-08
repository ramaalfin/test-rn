import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CardItem from '../CardItem';
import type { Item } from '../../types/api.types';

const exampleItems: Item[] = [
  {
    userId: 1,
    id: 1,
    title: 'Getting Started with React Native',
    body: 'React Native is a powerful framework for building mobile applications using JavaScript and React.',
  },
  {
    userId: 1,
    id: 2,
    title: 'Understanding TypeScript',
    body: 'TypeScript adds static typing to JavaScript, making your code more robust and maintainable.',
  },
  {
    userId: 2,
    id: 3,
    title: 'Modern UI/UX Design Patterns',
    body: 'Learn about the latest design patterns including skeleton loaders, empty states, and error boundaries.',
  },
];

const CardItemExample = () => {
  const handlePress = (id: number) => {
    console.log('Pressed item with id:', id);
  };

  return (
    <ScrollView style={styles.container}>
      {exampleItems.map((item) => (
        <CardItem key={item.id} item={item} onPress={handlePress} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
  },
});

export default CardItemExample;
