import { useEffect } from 'react';
import { Text, TextInput, useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { Anton_400Regular } from '@expo-google-fonts/anton';
import { Slot } from 'expo-router';

// Prevent splash screen from auto-hiding before custom fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    SpaceGrotesk_700Bold,
    Anton_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // 1. Override React Native default font ONCE globally
      // @ts-ignore
      Text.defaultProps = Text.defaultProps || {};
      // @ts-ignore
      Text.defaultProps.style = { fontFamily: 'Inter_400Regular' };
      // @ts-ignore
      TextInput.defaultProps = TextInput.defaultProps || {};
      // @ts-ignore
      TextInput.defaultProps.style = { fontFamily: 'Inter_400Regular' };

      // Hide native splash screen
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null; // Keep native splash screen visible while loading custom fonts
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Slot />
    </ThemeProvider>
  );
}
