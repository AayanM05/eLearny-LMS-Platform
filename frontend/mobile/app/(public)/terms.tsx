import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { fontInterRegular, fontInterSemiBold, fontInterBold, fontHeadingDisplay } from '../../lib/typography';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.mainWrapper}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.brandTitle}>Terms & Privacy Policy</Text>
        <Text style={styles.subtitle}>Last updated: September 2026</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.sectionText}>
            By creating an account or accessing the eLearny LMS Platform, you agree to be bound by these Terms of Service, Privacy Policy, and applicable laws.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. User Account Integrity</Text>
          <Text style={styles.sectionText}>
            You are responsible for protecting your login credentials and TOTP security keys. Sharing accounts or attempting unauthorized system access is prohibited.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. User Data Control (§3.19)</Text>
          <Text style={styles.sectionText}>
            You hold complete ownership rights over your personal data. Request full JSON data exports or permanent account deletion at any time via Account & Security settings.
          </Text>
        </View>

        <TouchableOpacity onPress={() => router.back()} style={styles.button}>
          <Text style={styles.buttonText}>I Understand</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#ffffff' },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backButton: { padding: 8, marginRight: 8 },
  headerTitle: { fontFamily: fontHeadingDisplay, fontSize: 18, color: '#0f172a' },
  card: { backgroundColor: '#ffffff', borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', padding: 20 },
  brandTitle: { fontFamily: fontHeadingDisplay, fontSize: 22, color: '#7c3aed', marginBottom: 4 },
  subtitle: { fontFamily: fontInterRegular, fontSize: 12, color: '#64748b', marginBottom: 20 },
  section: { marginBottom: 16 },
  sectionTitle: { fontFamily: fontInterBold, fontSize: 14, color: '#0f172a', marginBottom: 4 },
  sectionText: { fontFamily: fontInterRegular, fontSize: 13, color: '#64748b', lineHeight: 18 },
  button: { backgroundColor: '#7c3aed', borderRadius: 6, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  buttonText: { fontFamily: fontInterBold, color: '#ffffff', fontSize: 15 },
});
