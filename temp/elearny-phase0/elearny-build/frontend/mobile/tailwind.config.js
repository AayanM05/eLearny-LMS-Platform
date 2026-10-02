/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Same token values as frontend/web/app/globals.css — see docs/design.md §2.
      // NativeWind (RN) can't do CSS custom properties + hsl(var(...)) the way
      // web Tailwind v4 can, so the resolved hex values are duplicated here.
      // If design.md's token VALUES ever change, update both this file and
      // frontend/web/app/globals.css together — they must stay in sync.
      colors: {
        primary: {
          DEFAULT: "#D96B43", // Terracotta Orange — light mode
          dark: "#E57A52", // Terracotta Orange — dark mode variant
          foreground: "#FFFFFF",
        },
        background: {
          DEFAULT: "#FFFFFF",
          dark: "#141417",
        },
        foreground: {
          DEFAULT: "#1E1F24",
          dark: "#F5F5F5",
        },
        muted: {
          DEFAULT: "#F4F4F5",
          dark: "#28282C",
          foreground: "#75757A",
        },
        border: {
          DEFAULT: "#E5E5E7",
          dark: "#333338",
        },
        success: "#16A34A",
        warning: "#F59E0B",
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },
      },
      borderRadius: {
        DEFAULT: "4px", // matches web's --radius: 0.25rem — sharp, not rounded
      },
      fontFamily: {
        // Matches the Poppins/Anton pairing loaded in app/_layout.tsx.
        // Every screen uses components/AppText.tsx (font-sans by default)
        // rather than relying on an implicit global default — see that
        // file's comment for why.
        sans: ["Poppins-Regular"],
        heading: ["Anton-Regular"],
      },
    },
  },
  plugins: [],
};
