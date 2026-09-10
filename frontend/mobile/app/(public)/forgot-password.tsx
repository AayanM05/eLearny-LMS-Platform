import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../lib/api';
import { Feather } from '@expo/vector-icons';
import { fontInterRegular, fontInterSemiBold, fontInterBold, fontHeadingDisplay } from '../../lib/typography';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }
    setErrorMessage(null);
    setLoading(true);

    try {
      await api.fetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit reset request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.mainWrapper}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forgot Password</Text>
      </View>

      <View style={styles.card}>
        {!isSubmitted ? (
          <>
            <View style={styles.iconCircle}>
              <Feather name="mail" size={24} color="#7c3aed" />
            </View>

            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Enter your account email to receive password reset instructions.</Text>

            {errorMessage && (
              <View style={styles.errorBox}>
                <Feather name="alert-circle" size={16} color="#ef4444" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            <View style={styles.inputWrapper}>
              <Feather name="mail" size={18} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Send Reset Link</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.successContainer}>
            <View style={styles.successCircle}>
              <Feather name="check-circle" size={32} color="#059669" />
            </View>
            <Text style={styles.title}>Check Your Email</Text>
            <Text style={styles.subtitle}>If an account with that email exists, reset instructions have been sent.</Text>
            
            <TouchableOpacity onPress={() => router.push('/(public)/login')} style={styles.button}>
              <Text style={styles.buttonText}>Return to Sign In</Text>
            </TouchableOpacity>
          </View>
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
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 6, paddingHorizontal: 12, width: '100%', marginBottom: 16, backgroundColor: '#ffffff' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontFamily: fontInterRegular, paddingVertical: 12, fontSize: 14, color: '#0f172a' },
  button: { backgroundColor: '#7c3aed', borderRadius: 6, paddingVertical: 14, width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  buttonDisabled: { opacity: 0.65 },
  buttonText: { fontFamily: fontInterBold, color: '#ffffff', fontSize: 15 },
  successContainer: { alignItems: 'center', width: '100%' },
  successCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#ecfdf5', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  linkContainer: { alignItems: 'center', marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9', width: '100%' },
  linkText: { fontFamily: fontInterRegular, fontSize: 13, color: '#64748b' },
  linkTextBold: { fontFamily: fontInterBold, color: '#7c3aed' },
});
