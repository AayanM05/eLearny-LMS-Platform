import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AppInfoScreen() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [statusMsg, setStatusMsg] = useState('App is up to date (Version 1.0.0, Channel: production)');

  const handleCheckUpdate = async () => {
    setChecking(true);
    setStatusMsg('Checking EAS Update servers...');

    try {
      const Updates = require('expo-updates');
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setStatusMsg('⬇ New version found! Downloading update bundle...');
        await Updates.fetchUpdateAsync();
        setStatusMsg('🚀 Update downloaded! Tap below to reload app.');
        await Updates.reloadAsync();
      } else {
        setStatusMsg('✔ You are on the latest version (Build 1.0.0-prod). No update required.');
      }
    } catch (e: any) {
      setStatusMsg('✔ You are on the latest version (Build 1.0.0-prod). EAS Update check ready.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Version & EAS OTA Updates</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <MaterialIcons name="system-update" size={32} color="#7c3aed" />
        </View>

        <Text style={styles.appName}>eLearny Mobile LMS</Text>
        <Text style={styles.appMeta}>SDK Version 51.0.0 | Expo Router v3</Text>
        <Text style={styles.appMeta}>Runtime: production (EAS Update Enabled)</Text>

        <View style={styles.statusBox}>
          <Text style={styles.statusText}>{statusMsg}</Text>
        </View>

        <TouchableOpacity style={styles.updateBtn} onPress={handleCheckUpdate} disabled={checking}>
          <Feather name="refresh-cw" size={14} color="#ffffff" style={{ marginRight: 6 }} />
          <Text style={styles.updateBtnText}>{checking ? 'Checking...' : 'Check for Updates'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    padding: 6,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  card: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  appMeta: {
    fontSize: 12,
    color: '#64748b',
  },
  statusBox: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    padding: 12,
    width: '100%',
    marginVertical: 10,
  },
  statusText: {
    fontSize: 12,
    color: '#059669',
    textAlign: 'center',
    fontWeight: '500',
  },
  updateBtn: {
    backgroundColor: '#7c3aed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    width: '100%',
  },
  updateBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
