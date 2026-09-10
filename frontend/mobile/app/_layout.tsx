import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { Text, TextInput } from 'react-native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '../lib/auth';
import UpdateCheckModal from '../components/UpdateCheckModal';

SplashScreen.preventAutoHideAsync().catch(() => {});

// Global font default override per rules.md §14
try {
  // @ts-ignore
  Text.defaultProps = Text.defaultProps || {};
  // @ts-ignore
  Text.defaultProps.style = [{ fontFamily: 'Inter_400Regular' }, Text.defaultProps.style];

  // @ts-ignore
  TextInput.defaultProps = TextInput.defaultProps || {};
  // @ts-ignore
  TextInput.defaultProps.style = [{ fontFamily: 'Inter_400Regular' }, TextInput.defaultProps.style];
} catch (e) {
  // Ignore Hermes immutable defaultProps error gracefully
}

class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.log('AppErrorBoundary caught exception:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
      );
    }
    return this.props.children;
  }
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  return (
    <AppErrorBoundary>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <UpdateCheckModal />
      </AuthProvider>
    </AppErrorBoundary>
  );
}
