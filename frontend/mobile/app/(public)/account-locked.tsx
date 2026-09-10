import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { fontInterRegular, fontInterSemiBold, fontInterBold, fontHeadingDisplay } from '../../lib/typography';

export default function AccountLockedScreen() {
  const router = useRouter();
  const [secondsRemaining, setSecondsRemaining] = useState(900); // 15 mins default

  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsRemaining]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.mainWrapper}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Feather name="shield-off" size={28} color="#ef4444" />
        </View>

        <Text style={styles.title}>Account Locked</Text>
        <Text style={styles.subtitle}>
          Multiple failed login attempts were detected. For account security, access is temporarily suspended.
        </Text>

        <View style={styles.timerBox}>
          <Feather name="clock" size={16} color="#7c3aed" style={{ marginBottom: 4 }} />
          <Text style={styles.timerLabel}>AUTOMATIC UNLOCK IN</Text>
          <Text style={styles.timerValue}>{secondsRemaining > 0 ? formattedTime : 'UNLOCKED'}</Text>
        </View>

        {secondsRemaining <= 0 ? (
          <TouchableOpacity style={styles.button} onPress={() => router.push('/(public)/login')}>
            <Text style={styles.buttonText}>Try Sign In Again</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/(public)/forgot-password')}>
            <Text style={styles.secondaryButtonText}>Reset Password via Email</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => router.push('/(public)/login')} style={styles.linkContainer}>
          <Text style={styles.linkText}>Back to <Text style={styles.linkTextBold}>Sign In</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#ffffff' },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 },
  card: { backgroundColor: '#ffffff', borderRadius: 8, borderWidth: 1, borderColor: '#fecaca', padding: 24, alignItems: 'center' },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#fef2f2', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  title: { fontFamily: fontHeadingDisplay, fontSize: 22, color: '#0f172a', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontFamily: fontInterRegular, fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 20, lineHeight: 18 },
  timerBox: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', width: '100%', alignItems: 'center', marginBottom: 20 },
  timerLabel: { fontFamily: fontInterSemiBold, fontSize: 11, color: '#64748b', letterSpacing: 1, marginBottom: 4 },
  timerValue: { fontFamily: fontInterBold, fontSize: 28, color: '#0f172a', letterSpacing: 2 },
  button: { backgroundColor: '#7c3aed', borderRadius: 6, paddingVertical: 14, width: '100%', alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontFamily: fontInterBold, color: '#ffffff', fontSize: 15 },
  secondaryButton: { backgroundColor: '#f1f5f9', borderRadius: 6, paddingVertical: 14, width: '100%', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#cbd5e1' },
  secondaryButtonText: { fontFamily: fontInterSemiBold, color: '#0f172a', fontSize: 14 },
  linkContainer: { alignItems: 'center', marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9', width: '100%' },
  linkText: { fontFamily: fontInterRegular, fontSize: 13, color: '#64748b' },
  linkTextBold: { fontFamily: fontInterBold, color: '#7c3aed' },
});
