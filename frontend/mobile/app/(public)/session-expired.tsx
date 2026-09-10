import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { fontInterRegular, fontInterSemiBold, fontInterBold, fontHeadingDisplay } from '../../lib/typography';

export default function SessionExpiredScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.mainWrapper}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Feather name="log-out" size={28} color="#7c3aed" />
        </View>

        <Text style={styles.title}>Session Expired</Text>
        <Text style={styles.subtitle}>
          Your authentication token has expired due to inactivity. Please sign in again to continue.
        </Text>

        <View style={styles.infoBanner}>
          <Feather name="check-circle" size={16} color="#059669" style={{ marginRight: 8 }} />
          <Text style={styles.infoText}>Your learning progress has been saved.</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/(public)/login')}>
          <Text style={styles.buttonText}>Sign In Again</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#ffffff' },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 },
  card: { backgroundColor: '#ffffff', borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', padding: 24, alignItems: 'center' },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#f3e8ff', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  title: { fontFamily: fontHeadingDisplay, fontSize: 22, color: '#0f172a', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontFamily: fontInterRegular, fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 16, lineHeight: 18 },
  infoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ecfdf5', borderWidth: 1, borderColor: '#a7f3d0', padding: 12, borderRadius: 6, width: '100%', marginBottom: 20 },
  infoText: { fontFamily: fontInterSemiBold, color: '#059669', fontSize: 12, flex: 1 },
  button: { backgroundColor: '#7c3aed', borderRadius: 6, paddingVertical: 14, width: '100%', alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontFamily: fontInterBold, color: '#ffffff', fontSize: 15 },
});
