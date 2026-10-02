import "../global.css";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

// Bundled locally (assets/fonts/) rather than fetched from Google at
// runtime/build time — same static files used by the web app
// (frontend/web/app/fonts/), so both platforms render identical type.
// Switched to Anton (headings) + Poppins (body) 2026-09-14, replacing
// Inter/Space Grotesk, at user's request.
//
// NOTE: this file previously also mutated Text.defaultProps here to try to
// set a global default font. That was removed (2026-09-14) after real
// device testing showed it wasn't reliably honored — every screen now uses
// components/AppText.tsx instead, which applies the font explicitly and
// verifiably per element.
const FONTS = {
  "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
  "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  "Anton-Regular": require("../assets/fonts/Anton-Regular.ttf"),
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(FONTS);

  if (!fontsLoaded && !fontError) {
    return null; // splash screen stays visible until fonts resolve
  }

  SplashScreen.hideAsync();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
