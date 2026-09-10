import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { Feather } from '@expo/vector-icons';
import { fontInterRegular, fontInterSemiBold, fontInterBold, fontHeadingDisplay } from '../../lib/typography';

export default function RegisterScreen() {
  const router = useRouter();
  const { setAuthSession } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const redirectUser = (role: string) => {
    if (role === 'ADMIN') {
      router.replace('/(admin)/applications');
    } else if (role === 'INSTRUCTOR') {
      router.replace('/(instructor)/analytics');
    } else {
      router.replace('/(student)/dashboard');
    }
  };

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    setErrorMessage(null);
    setSuccessMessage(null);
    setStatusText('Connecting... this may take a moment on first load');
    setLoading(true);

    try {
      const response: any = await api.fetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ fullName, email, password }),
        timeoutMs: 60000,
      });

      setSuccessMessage('🎉 Registration Successful! Validated user in database.');
      await setAuthSession(response.user, response.accessToken, response.refreshToken);
      setTimeout(() => {
        redirectUser(response.user?.role || 'STUDENT');
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please check your inputs or network connection.');
    } finally {
      setLoading(false);
      setStatusText(null);
    }
  };

  const handleInstantDemoLogin = async (role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN') => {
    setErrorMessage(null);
    setSuccessMessage('🎉 Instant Demo Access Activated! Opening workspace...');
    setStatusText(`Configuring demo as ${role.toLowerCase()}...`);
    setLoading(true);
    const mockUser = {
      id: role === 'ADMIN' ? 'demo-admin-id' : role === 'INSTRUCTOR' ? 'demo-inst-id' : 'demo-stud-id',
      email: role === 'ADMIN' ? 'admin@elearny.com' : role === 'INSTRUCTOR' ? 'instructor@elearny.com' : 'student@elearny.com',
      fullName: role === 'ADMIN' ? 'System Administrator' : role === 'INSTRUCTOR' ? 'Dr. Sarah Jenkins' : 'Alex Rivera',
      role: role,
      createdAt: new Date().toISOString(),
    };
    await setAuthSession(mockUser, 'demo_access_token_jwt', 'demo_refresh_token');
    setTimeout(() => {
      setLoading(false);
      setStatusText(null);
      redirectUser(role);
    }, 400);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.mainWrapper}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
      </View>

      {/* Card Form Container */}
      <View style={styles.card}>
        <View style={styles.titleContainer}>
          <Text style={styles.brandTitle}>Join eLearny</Text>
          <Text style={styles.subtitle}>Start learning software engineering on mobile</Text>
        </View>

        {/* Instant Demo Quick Access Bar */}
        <View style={styles.demoBox}>
          <View style={styles.demoHeader}>
            <Feather name="zap" size={13} color="#7c3aed" />
            <Text style={styles.demoTitle}>Instant Demo Access (No backend needed)</Text>
          </View>
          <View style={styles.demoButtonsRow}>
            <TouchableOpacity style={styles.demoChip} onPress={() => handleInstantDemoLogin('STUDENT')}>
              <Text style={styles.demoChipText}>Student</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.demoChip} onPress={() => handleInstantDemoLogin('INSTRUCTOR')}>
              <Text style={styles.demoChipText}>Instructor</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.demoChip} onPress={() => handleInstantDemoLogin('ADMIN')}>
              <Text style={styles.demoChipText}>Admin</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading && (
          <View style={styles.loadingBanner}>
            <ActivityIndicator size="small" color="#7c3aed" style={{ marginRight: 8 }} />
            <Text style={styles.loadingBannerText}>
              Connecting... this may take a moment on first load if the server is waking up
            </Text>
          </View>
        )}

        {errorMessage && (
          <View style={styles.errorBox}>
            <Feather name="alert-circle" size={16} color="#ef4444" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {successMessage && (
          <View style={styles.successBox}>
            <Feather name="check-circle" size={16} color="#059669" />
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Feather name="user" size={18} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#94a3b8"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Feather name="mail" size={18} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Feather name="lock" size={18} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password (min 8 chars)"
              placeholderTextColor="#94a3b8"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator color="#ffffff" size="small" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>{statusText || 'Registering...'}</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Complete Registration</Text>
                <Feather name="arrow-right" size={16} color="#ffffff" style={styles.buttonIconRight} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push('/(public)/login')} style={styles.linkContainer}>
          <Text style={styles.linkText}>Already have an account? <Text style={styles.linkTextBold}>Sign In</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontFamily: fontHeadingDisplay,
    fontSize: 18,
    color: '#0f172a',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
  },
  titleContainer: {
    marginBottom: 20,
  },
  brandTitle: {
    fontFamily: fontHeadingDisplay,
    fontSize: 24,
    color: '#7c3aed',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: fontInterRegular,
    fontSize: 13,
    color: '#64748b',
  },
  demoBox: {
    backgroundColor: '#f5f3ff',
    borderWidth: 1,
    borderColor: '#ddd6fe',
    borderRadius: 4,
    padding: 12,
    marginTop: 16,
    marginBottom: 16,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  demoTitle: {
    fontFamily: fontInterBold,
    fontSize: 12,
    color: '#7c3aed',
    marginLeft: 6,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  demoChip: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#c4b5fd',
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center',
  },
  demoChipText: {
    fontFamily: fontInterSemiBold,
    fontSize: 11,
    color: '#6d28d9',
  },
  loadingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3e8ff',
    borderWidth: 1,
    borderColor: '#ddd6fe',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  loadingBannerText: {
    fontFamily: fontInterSemiBold,
    color: '#7c3aed',
    fontSize: 12,
    flex: 1,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 10,
    borderRadius: 4,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: fontInterRegular,
    color: '#ef4444',
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    padding: 10,
    borderRadius: 4,
    marginBottom: 16,
  },
  successText: {
    fontFamily: fontInterSemiBold,
    color: '#059669',
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  form: {
    gap: 12,
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: fontInterRegular,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0f172a',
  },
  button: {
    backgroundColor: '#7c3aed',
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: fontInterBold,
    color: '#ffffff',
    fontSize: 15,
  },
  buttonIconRight: {
    marginLeft: 6,
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  linkText: {
    fontFamily: fontInterRegular,
    fontSize: 13,
    color: '#64748b',
  },
  linkTextBold: {
    fontFamily: fontInterBold,
    color: '#7c3aed',
  },
});
