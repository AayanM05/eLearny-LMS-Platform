import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { AuthProvider } from '../lib/auth';
import UpdateCheckModal from '../components/UpdateCheckModal';
import BottomNavigation from '../components/BottomNavigation';

export default function RootLayout() {
  return (
    <AuthProvider>
      <View style={styles.rootContainer}>
        <View style={styles.contentArea}>
          <Stack screenOptions={{ headerShown: false }} />
        </View>
        <BottomNavigation />
        <UpdateCheckModal />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentArea: {
    flex: 1,
  },
});
