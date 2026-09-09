import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import BottomNavigation from '../../components/BottomNavigation';

export default function StudentLayout() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Slot />
      </View>
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },
});
