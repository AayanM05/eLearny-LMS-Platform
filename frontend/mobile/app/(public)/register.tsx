import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { Feather } from '@expo/vector-icons';
import { fontInterRegular, fontInterSemiBold, fontInterBold, fontHeadingDisplay } from '../../lib/typography';

export default function RegisterScreen() {
  const router = useRouter();
  const { setAuthSession } = useAuth();

  const [role, setRole] = useState<'STUDENT' | 'INSTRUCTOR'>('STUDENT');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Username check state
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Password requirements checklist
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  // Debounced username check
  useEffect(() => {
    if (!username || username.trim().length < 3) {
      setUsernameAvailable(null);
      setUsernameSuggestions([]);
      return;
    }

    setIsCheckingUsername(true);
    const timer = setTimeout(async () => {
      try {
        const res: any = await api.fetch(`/auth/check-username?username=${encodeURIComponent(username.trim())}`);
        setUsernameAvailable(res.available);
        setUsernameSuggestions(res.suggestions || []);
      } catch (err) {
        setUsernameAvailable(null);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [username]);

  const handleRegister = async () => {
    if (!fullName || !username || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    if (usernameAvailable === false) {
      setErrorMessage('Username is taken. Please choose another username.');
      return;
    }
    if (!agreeToTerms) {
      setErrorMessage('You must agree to the Terms of Service & Privacy Policy');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      const response: any = await api.fetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ fullName, username: username.trim(), email, password, role }),
        timeoutMs: 60000,
      });

      await setAuthSession(response.user, response.accessToken, response.refreshToken);
      redirectUser(response.user?.role || 'STUDENT');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const redirectUser = (role: string) => {
    if (role === 'ADMIN') {
      router.replace('/(admin)/applications');
    } else if (role === 'INSTRUCTOR') {
      router.replace('/(instructor)/analytics');
    } else {
      router.replace('/(student)/dashboard');
    }
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
          <Text style={styles.subtitle}>Full Parity Mobile & Web LMS Platform</Text>
        </View>

        {errorMessage && (
          <View style={styles.errorBox}>
            <Feather name="alert-circle" size={16} color="#ef4444" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* Role Selection Tabs */}
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleTab, role === 'STUDENT' && styles.roleTabActive]}
            onPress={() => setRole('STUDENT')}
          >
            <Text style={[styles.roleTabText, role === 'STUDENT' && styles.roleTabTextActive]}>Student</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleTab, role === 'INSTRUCTOR' && styles.roleTabActive]}
            onPress={() => setRole('INSTRUCTOR')}
          >
            <Text style={[styles.roleTabText, role === 'INSTRUCTOR' && styles.roleTabTextActive]}>Instructor</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {/* Full Name */}
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

          {/* Username with Live Availability Indicator */}
          <View style={styles.inputWrapper}>
            <Feather name="at-sign" size={18} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#94a3b8"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />
            {isCheckingUsername && <ActivityIndicator size="small" color="#7c3aed" />}
            {!isCheckingUsername && usernameAvailable === true && <Feather name="check-circle" size={18} color="#059669" />}
            {!isCheckingUsername && usernameAvailable === false && <Feather name="x-circle" size={18} color="#ef4444" />}
          </View>

          {/* Username Suggestions if Taken */}
          {usernameAvailable === false && usernameSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>Suggestions:</Text>
              <View style={styles.suggestionsRow}>
                {usernameSuggestions.map(sugg => (
                  <TouchableOpacity key={sugg} onPress={() => setUsername(sugg)} style={styles.suggestionChip}>
                    <Text style={styles.suggestionText}>{sugg}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Email */}
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

          {/* Optional Phone */}
          <View style={styles.inputWrapper}>
            <Feather name="phone" size={18} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone (Optional)"
              placeholderTextColor="#94a3b8"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* Password */}
          <View style={styles.inputWrapper}>
            <Feather name="lock" size={18} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password (min 8 chars)"
              placeholderTextColor="#94a3b8"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Password Live Checklist */}
          <View style={styles.checklistGrid}>
            <View style={styles.checkItem}>
              <Feather name={passwordChecks.length ? 'check' : 'x'} size={12} color={passwordChecks.length ? '#059669' : '#94a3b8'} />
              <Text style={[styles.checkText, passwordChecks.length && styles.checkTextPass]}>Min 8 chars</Text>
            </View>
            <View style={styles.checkItem}>
              <Feather name={passwordChecks.uppercase ? 'check' : 'x'} size={12} color={passwordChecks.uppercase ? '#059669' : '#94a3b8'} />
              <Text style={[styles.checkText, passwordChecks.uppercase && styles.checkTextPass]}>Uppercase</Text>
            </View>
            <View style={styles.checkItem}>
              <Feather name={passwordChecks.lowercase ? 'check' : 'x'} size={12} color={passwordChecks.lowercase ? '#059669' : '#94a3b8'} />
              <Text style={[styles.checkText, passwordChecks.lowercase && styles.checkTextPass]}>Lowercase</Text>
            </View>
            <View style={styles.checkItem}>
              <Feather name={passwordChecks.number ? 'check' : 'x'} size={12} color={passwordChecks.number ? '#059669' : '#94a3b8'} />
              <Text style={[styles.checkText, passwordChecks.number && styles.checkTextPass]}>Number</Text>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputWrapper}>
            <Feather name="lock" size={18} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#94a3b8"
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          {/* Terms & Privacy Agreement */}
          <TouchableOpacity onPress={() => setAgreeToTerms(!agreeToTerms)} style={styles.termsRow}>
            <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
              {agreeToTerms && <Feather name="check" size={12} color="#ffffff" />}
            </View>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsLink} onPress={() => router.push('/(public)/terms')}>Terms & Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
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
  mainWrapper: { flex: 1, backgroundColor: '#ffffff' },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backButton: { padding: 8, marginRight: 8 },
  headerTitle: { fontFamily: fontHeadingDisplay, fontSize: 18, color: '#0f172a' },
  card: { backgroundColor: '#ffffff', borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', padding: 20 },
  titleContainer: { marginBottom: 16 },
  brandTitle: { fontFamily: fontHeadingDisplay, fontSize: 24, color: '#7c3aed', marginBottom: 4 },
  subtitle: { fontFamily: fontInterRegular, fontSize: 13, color: '#64748b' },
  roleContainer: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  roleTab: { flex: 1, paddingVertical: 10, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6, alignItems: 'center', backgroundColor: '#f8fafc' },
  roleTabActive: { backgroundColor: '#f3e8ff', borderColor: '#7c3aed' },
  roleTabText: { fontFamily: fontInterSemiBold, fontSize: 13, color: '#64748b' },
  roleTabTextActive: { color: '#7c3aed' },
  errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca', padding: 10, borderRadius: 6, marginBottom: 16 },
  errorText: { fontFamily: fontInterRegular, color: '#ef4444', fontSize: 12, marginLeft: 8, flex: 1 },
  form: { gap: 12, marginBottom: 16 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 6, paddingHorizontal: 12, backgroundColor: '#ffffff' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontFamily: fontInterRegular, paddingVertical: 12, fontSize: 14, color: '#0f172a' },
  suggestionsContainer: { marginTop: -4, marginBottom: 4 },
  suggestionsTitle: { fontFamily: fontInterRegular, fontSize: 11, color: '#64748b', marginBottom: 4 },
  suggestionsRow: { flexDirection: 'row', gap: 6 },
  suggestionChip: { backgroundColor: '#f3e8ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: '#ddd6fe' },
  suggestionText: { fontFamily: fontInterSemiBold, fontSize: 11, color: '#7c3aed' },
  checklistGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 8, backgroundColor: '#f8fafc', borderRadius: 6, borderWidth: 1, borderColor: '#f1f5f9' },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  checkText: { fontFamily: fontInterRegular, fontSize: 11, color: '#94a3b8' },
  checkTextPass: { color: '#059669', fontFamily: fontInterSemiBold },
  termsRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  checkboxChecked: { backgroundColor: '#7c3aed', borderColor: '#7c3aed' },
  termsText: { fontFamily: fontInterRegular, fontSize: 12, color: '#64748b' },
  termsLink: { color: '#7c3aed', fontFamily: fontInterSemiBold },
  button: { backgroundColor: '#7c3aed', borderRadius: 6, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.65 },
  buttonContent: { flexDirection: 'row', alignItems: 'center' },
  buttonText: { fontFamily: fontInterBold, color: '#ffffff', fontSize: 15 },
  buttonIconRight: { marginLeft: 6 },
  linkContainer: { alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  linkText: { fontFamily: fontInterRegular, fontSize: 13, color: '#64748b' },
  linkTextBold: { fontFamily: fontInterBold, color: '#7c3aed' },
});
