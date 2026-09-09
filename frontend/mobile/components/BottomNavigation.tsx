import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      name: 'Dashboard',
      path: '/(student)/dashboard',
      icon: (color: string) => <Feather name="home" size={20} color={color} />,
    },
    {
      name: 'Practice',
      path: '/(student)/practice',
      icon: (color: string) => <Feather name="code" size={20} color={color} />,
    },
    {
      name: 'AI Tutor',
      path: '/(student)/ai-chat',
      icon: (color: string) => <Feather name="cpu" size={20} color={color} />,
    },
    {
      name: 'Community',
      path: '/(student)/community',
      icon: (color: string) => <Feather name="message-square" size={20} color={color} />,
    },
    {
      name: 'Leaderboard',
      path: '/(student)/leaderboard',
      icon: (color: string) => <MaterialCommunityIcons name="trophy-outline" size={20} color={color} />,
    },
  ];

  // Don't show bottom nav on auth screens
  if (pathname.includes('/login') || pathname.includes('/register') || pathname === '/') {
    return null;
  }

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.path || pathname.includes(tab.name.toLowerCase());
        const activeColor = '#7c3aed';
        const inactiveColor = '#94a3b8';

        return (
          <TouchableOpacity
            key={tab.path}
            style={styles.tabButton}
            onPress={() => router.push(tab.path as any)}
            activeOpacity={0.7}
          >
            {tab.icon(isActive ? activeColor : inactiveColor)}
            <Text style={[styles.tabLabel, { color: isActive ? activeColor : inactiveColor, fontWeight: isActive ? '700' : '500' }]}>
              {tab.name}
            </Text>
            {isActive && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 12,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    position: 'relative',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#7c3aed',
    position: 'absolute',
    bottom: -4,
  },
});
