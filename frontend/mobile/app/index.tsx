import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, StatusBar, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../lib/auth';

export default function App() {
  const router = useRouter();
  const { setAuthSession } = useAuth();

  const handleInstantDemoLogin = async (role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN') => {
    const mockUser = {
      id: role === 'ADMIN' ? 'demo-admin-id' : role === 'INSTRUCTOR' ? 'demo-inst-id' : 'demo-stud-id',
      email: role === 'ADMIN' ? 'admin@elearny.com' : role === 'INSTRUCTOR' ? 'instructor@elearny.com' : 'student@elearny.com',
      fullName: role === 'ADMIN' ? 'System Administrator' : role === 'INSTRUCTOR' ? 'Dr. Sarah Jenkins' : 'Alex Rivera',
      role: role,
      createdAt: new Date().toISOString(),
    };
    await setAuthSession(mockUser, 'demo_access_token_jwt', 'demo_refresh_token');

    if (role === 'ADMIN') {
      router.replace('/(admin)/applications');
    } else if (role === 'INSTRUCTOR') {
      router.replace('/(instructor)/analytics');
    } else {
      router.replace('/(student)/dashboard');
    }
  };

  return (
    <View style={styles.mainWrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Horizontal Brand Logo Bar with App Icon Image */}
        <View style={styles.header}>
          <View style={styles.logoHorizontalGroup}>
            <Image 
              source={require('../assets/icon.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoTitleText}>
              eLearny<Text style={styles.logoTitleAccent}>.LMS</Text>
            </Text>
          </View>

          <View style={styles.versionTag}>
            <Text style={styles.versionTagText}>v1.0 PRO</Text>
          </View>
        </View>


        {/* Hero Banner Card */}
        <View style={styles.heroCard}>
          <View style={styles.pillBadge}>
            <Feather name="zap" size={12} color="#7c3aed" />
            <Text style={styles.pillBadgeText}>Next-Gen Enterprise LMS</Text>
          </View>

          <Text style={styles.heroTitle}>Master Software Engineering with Production Rigor</Text>
          <Text style={styles.heroSubtitle}>
            Interactive HD video courses, live code sandboxes, anti-cheat proctored exams, and QR verifiable certificates.
          </Text>

          {/* Feature Highlights Grid */}
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <View style={styles.featureIconBox}>
                <Ionicons name="play-circle-outline" size={16} color="#7c3aed" />
              </View>
              <Text style={styles.featureItemText}>HD Video Streaming</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIconBox}>
                <Feather name="code" size={16} color="#7c3aed" />
              </View>
              <Text style={styles.featureItemText}>Judge0 Code Runner</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIconBox}>
                <MaterialCommunityIcons name="certificate-outline" size={16} color="#7c3aed" />
              </View>
              <Text style={styles.featureItemText}>QR Certifications</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIconBox}>
                <Feather name="shield" size={16} color="#7c3aed" />
              </View>
              <Text style={styles.featureItemText}>Anti-Cheat Integrity</Text>
            </View>
          </View>
        </View>

        {/* Instant Demo Sandbox Access */}
        <View style={styles.demoCard}>
          <View style={styles.demoCardHeader}>
            <Feather name="play-circle" size={16} color="#7c3aed" />
            <Text style={styles.demoCardTitle}>Instant Demo Mode (0ms Delay)</Text>
          </View>
          <Text style={styles.demoCardSubtitle}>Tap a role to immediately enter the live workspace:</Text>
          
          <View style={styles.demoButtonRow}>
            <Pressable 
              style={({ pressed }) => [styles.demoRoleButton, pressed && styles.buttonPressed]} 
              onPress={() => handleInstantDemoLogin('STUDENT')}
            >
              <Ionicons name="person" size={14} color="#6d28d9" style={{ marginRight: 4 }} />
              <Text style={styles.demoRoleButtonText}>Student</Text>
            </Pressable>

            <Pressable 
              style={({ pressed }) => [styles.demoRoleButton, pressed && styles.buttonPressed]} 
              onPress={() => handleInstantDemoLogin('INSTRUCTOR')}
            >
              <Ionicons name="briefcase" size={14} color="#6d28d9" style={{ marginRight: 4 }} />
              <Text style={styles.demoRoleButtonText}>Instructor</Text>
            </Pressable>

            <Pressable 
              style={({ pressed }) => [styles.demoRoleButton, pressed && styles.buttonPressed]} 
              onPress={() => handleInstantDemoLogin('ADMIN')}
            >
              <Ionicons name="shield-checkmark" size={14} color="#6d28d9" style={{ marginRight: 4 }} />
              <Text style={styles.demoRoleButtonText}>Admin</Text>
            </Pressable>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Link href="/(public)/register" asChild>
            <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}>
              <Text style={styles.primaryButtonText}>Create Account Free</Text>
              <Feather name="arrow-right" size={18} color="#ffffff" style={styles.buttonIcon} />
            </Pressable>
          </Link>

          <Link href="/(public)/login" asChild>
            <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}>
              <Text style={styles.secondaryButtonText}>Sign In with Credentials</Text>
            </Pressable>
          </Link>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Feather name="check-circle" size={14} color="#059669" />
          <Text style={styles.footerText}>Powered by Spring Boot & Next.js Architecture</Text>
        </View>
      </ScrollView>
    </View>
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
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingVertical: 4,
  },
  logoHorizontalGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 36,
    height: 36,
    marginRight: 10,
    borderRadius: 8,
  },
  logoTitleText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  logoTitleAccent: {
    color: '#7c3aed',
    fontWeight: '800',
  },
  versionTag: {
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd6fe',
  },
  versionTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7c3aed',
    letterSpacing: 0.5,
  },
  heroCard: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  pillBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7c3aed',
    marginLeft: 6,
  },
  heroTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 30,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 19,
    marginBottom: 20,
  },
  featuresGrid: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 16,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  featureItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  demoCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd6fe',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  demoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  demoCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7c3aed',
    marginLeft: 6,
  },
  demoCardSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 12,
  },
  demoButtonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  demoRoleButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f3ff',
    borderWidth: 1,
    borderColor: '#c4b5fd',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoRoleButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6d28d9',
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: '#f8fafc',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  secondaryButtonText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#64748b',
    marginLeft: 6,
  },
});

