import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../lib/api';
import { Feather } from '@expo/vector-icons';
import { fontInterRegular, fontInterSemiBold, fontInterBold, fontHeadingDisplay } from '../../lib/typography';

export default function TwoFactorSetupScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [secret, setSecret] = useState<string | null>(null);
  const [qrCodeDataUri, setQrCodeDataUri] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function init2fa() {
      try {
        const res: any = await api.fetch('/auth/2fa/setup', { method: 'POST' });
        setSecret(res.secret);
        setQrCodeDataUri(res.qrCodeDataUri);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to initialize 2FA setup');
      } finally {
        setLoading(false);
      }
    }
    init2fa();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.mainWrapper}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Two-Factor Setup</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Feather name="shield" size={24} color="#7c3aed" />
        </View>

        <Text style={styles.title}>Configure 2FA</Text>
        <Text style={styles.subtitle}>Scan the QR code below or enter the key into Google Authenticator or Authy.</Text>

        {errorMessage && (
          <View style={styles.errorBox}>
            <Feather name="alert-circle" size={16} color="#ef4444" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#7c3aed" style={{ marginVertical: 30 }} />
        ) : (
          <>
            {qrCodeDataUri && (
              <View style={styles.qrBox}>
                <Image source={{ uri: qrCodeDataUri }} style={styles.qrImage} resizeMode="contain" />
              </View>
            )}

            <View style={styles.keyBox}>
              <Text style={styles.keyLabel}>Manual Setup Key:</Text>
              <Text style={styles.keyValue}>{secret}</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/(public)/2fa-challenge')}>
              <Text style={styles.buttonText}>Verify TOTP Code</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#ffffff' },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  backButton: { padding: 8, marginRight: 8 },
  headerTitle: { fontFamily: fontHeadingDisplay, fontSize: 18, color: '#0f172a' },
  card: { backgroundColor: '#ffffff', borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', padding: 24, alignItems: 'center' },
  iconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#f3e8ff', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  title: { fontFamily: fontHeadingDisplay, fontSize: 22, color: '#0f172a', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontFamily: fontInterRegular, fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 20, lineHeight: 18 },
  errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca', padding: 10, borderRadius: 6, width: '100%', marginBottom: 16 },
  errorText: { fontFamily: fontInterRegular, color: '#ef4444', fontSize: 12, marginLeft: 8, flex: 1 },
  qrBox: { padding: 12, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, marginBottom: 16 },
  qrImage: { width: 180, height: 180 },
  keyBox: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 6, borderWidth: 1, borderColor: '#e2e8f0', width: '100%', alignItems: 'center', marginBottom: 20 },
  keyLabel: { fontFamily: fontInterRegular, fontSize: 11, color: '#64748b', marginBottom: 2 },
  keyValue: { fontFamily: fontInterBold, fontSize: 14, color: '#0f172a', letterSpacing: 1 },
  button: { backgroundColor: '#7c3aed', borderRadius: 6, paddingVertical: 14, width: '100%', alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontFamily: fontInterBold, color: '#ffffff', fontSize: 15 },
});
