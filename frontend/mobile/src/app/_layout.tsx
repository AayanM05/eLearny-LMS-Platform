import React, { useEffect, useState, createContext, useContext } from 'react';
import { Text, TextInput, View, Image, StyleSheet, Animated } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { 
  useFonts, 
  Inter_400Regular, 
  Inter_500Medium, 
  Inter_600SemiBold, 
  Inter_700Bold 
} from '@expo-google-fonts/inter';
import { 
  SpaceGrotesk_400Regular,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold 
} from '@expo-google-fonts/space-grotesk';
import { Slot } from 'expo-router';
import { OTAUpdateModal } from '@/components/ota-update-modal';

// Prevent native OS splash screen from staying permanently
SplashScreen.preventAutoHideAsync().catch(() => {});

// Mobile Theme Context (Default to Light Mode)
export const MobileThemeContext = createContext<{
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}>({
  theme: 'light',
  toggleTheme: () => {},
});

export const useMobileTheme = () => useContext(MobileThemeContext);

export default function RootLayout() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(1));

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  // 1. Immediately dismiss native OS splash screen window on JS boot so grid placeholder NEVER shows
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  // 2. Control custom branded splash screen (3 Seconds Minimum Hold Time)
  useEffect(() => {
    if (fontsLoaded || fontError) {
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          setIsSplashVisible(false);
        });
      }, 3000); // 3 seconds minimum hold

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const isDark = theme === 'dark';
  const navTheme = isDark ? DarkTheme : {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#FAFAFA',
      card: '#FFFFFF',
      text: '#0F172A',
      border: '#E2E8F0',
    }
  };

  return (
    <MobileThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider value={navTheme}>
        <OTAUpdateModal theme={theme} />
        <Slot />

        {/* Branded Custom Splash Screen (3 Seconds Minimum • 17px Margins • Solid Black Text Logo on Light Bg) */}
        {isSplashVisible && (
          <Animated.View 
            style={[
              styles.splashContainer, 
              isDark ? styles.darkSplash : styles.lightSplash,
              { opacity: fadeAnim }
            ]}
            pointerEvents="none"
          >
            <Image
              source={
                isDark 
                  ? require('../../assets/branding/logo-dark.png')  // White text logo for Dark background
                  : require('../../assets/branding/logo-light.png') // Black text logo for Light background
              }
              style={styles.splashLogo}
              resizeMode="contain"
            />
            <Text style={[styles.splashTagline, isDark ? styles.darkTagline : styles.lightTagline]}>
              eLearny LMS Platform v2.0.0
            </Text>
          </Animated.View>
        )}
      </ThemeProvider>
    </MobileThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
    paddingHorizontal: 17, // Exact 17px left & right margins as requested
  },
  lightSplash: {
    backgroundColor: '#FAFAFA',
  },
  darkSplash: {
    backgroundColor: '#090D16',
  },
  splashLogo: {
    width: '100%',
    height: 120,
  },
  splashTagline: {
    marginTop: 20,
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1,
  },
  lightTagline: {
    color: '#64748B',
  },
  darkTagline: {
    color: '#94A3B8',
  },
});
