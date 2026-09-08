import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth';

export default function LoginScreen() {
  const router = useRouter();
  const { setAuthSession } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [is2faRequired, setIs2faRequired] = useState(false);
  const [pending2faToken, setPending2faToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    setErrorMessage(null);
    setLoading(true);

    try {
      const response: any = await api.fetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.is2faRequired) {
        setIs2faRequired(true);
        setPending2faToken(response.pending2faToken);
      } else {
        await setAuthSession(response.user, response.accessToken, response.refreshToken);
        redirectUser(response.user.role);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handle2faVerify = async () => {
    if (!totpCode || totpCode.length !== 6) {
      setErrorMessage('Please enter a 6-digit TOTP code');
      return;
    }
    setErrorMessage(null);
    setLoading(true);

    try {
      const response: any = await api.fetch('/auth/2fa/verify', {
        method: 'POST',
        body: JSON.stringify({ pending2faToken, totpCode }),
      });

      await setAuthSession(response.user, response.accessToken, response.refreshToken);
      redirectUser(response.user.role);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid 2FA code');
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
    <View style={styles.container}>
      <Text style={styles.title}>eLearny Mobile</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      {!is2faRequired ? (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.form}>
          <Text style={styles.infoText}>Enter the 6-digit code from your authenticator app</Text>
          <TextInput
            style={[styles.input, styles.totpInput]}
            placeholder="123456"
            placeholderTextColor="#888"
            keyboardType="number-pad"
            maxLength={6}
            value={totpCode}
            onChangeText={setTotpCode}
          />
          <TouchableOpacity style={styles.button} onPress={handle2faVerify} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify Code</Text>}
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity onPress={() => router.push('/(public)/register')}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7c3aed',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    color: '#000',
  },
  totpInput: {
    textAlign: 'center',
    letterSpacing: 4,
    fontSize: 20,
  },
  button: {
    backgroundColor: '#7c3aed',
    borderRadius: 4,
    padding: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  linkText: {
    color: '#7c3aed',
    textAlign: 'center',
    marginTop: 12,
  },
});
