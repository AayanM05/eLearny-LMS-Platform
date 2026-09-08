import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
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
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.mainWrapper}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>e</Text>
        </View>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>eLearny</Text>
          <View style={styles.versionChip}>
            <Text style={styles.versionChipText}>v1.0 Pro</Text>
          </View>
        </View>
      </View>

      {/* Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.pillBadge}>
          <Feather name="zap" size={12} color="#7c3aed" />
          <Text style={styles.pillBadgeText}>Next-Gen LMS Platform</Text>
        </View>

        <Text style={styles.heroTitle}>Master Engineering with Production Rigor</Text>
        <Text style={styles.heroSubtitle}>
          Interactive video courses, live code sandboxes, anti-cheat exams, and instant verifiable certificates.
        </Text>

        {/* Feature Highlights */}
        <View style={styles.featuresGrid}>
          <View style={styles.featureItem}>
            <Ionicons name="play-circle-outline" size={18} color="#7c3aed" />
            <Text style={styles.featureItemText}>HD Video Streaming</Text>
          </View>
          <View style={styles.featureItem}>
            <Feather name="code" size={18} color="#7c3aed" />
            <Text style={styles.featureItemText}>Code Playgrounds</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="certificate-outline" size={18} color="#7c3aed" />
            <Text style={styles.featureItemText}>QR Certifications</Text>
          </View>
          <View style={styles.featureItem}>
            <Feather name="shield" size={18} color="#7c3aed" />
            <Text style={styles.featureItemText}>Proctored Exams</Text>
          </View>
        </View>
      </View>

      {/* Instant Demo Login Bar */}
      <View style={styles.demoCard}>
        <View style={styles.demoCardHeader}>
          <Feather name="zap" size={14} color="#7c3aed" />
          <Text style={styles.demoCardTitle}>Instant Demo Access (0ms Delay)</Text>
        </View>
        <Text style={styles.demoCardSubtitle}>Tap any role to immediately test the workspace</Text>
        <View style={styles.demoButtonRow}>
          <Pressable style={styles.demoRoleButton} onPress={() => handleInstantDemoLogin('STUDENT')}>
            <Text style={styles.demoRoleButtonText}>Student</Text>
          </Pressable>
          <Pressable style={styles.demoRoleButton} onPress={() => handleInstantDemoLogin('INSTRUCTOR')}>
            <Text style={styles.demoRoleButtonText}>Instructor</Text>
          </Pressable>
          <Pressable style={styles.demoRoleButton} onPress={() => handleInstantDemoLogin('ADMIN')}>
            <Text style={styles.demoRoleButtonText}>Admin</Text>
          </Pressable>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.buttonContainer}>
        <Link href="/(public)/register" asChild>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Get Started Free</Text>
            <Feather name="arrow-right" size={18} color="#ffffff" style={styles.buttonIcon} />
          </Pressable>
        </Link>

        <Link href="/(public)/login" asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Sign In with Backend Credentials</Text>
          </Pressable>
        </Link>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Feather name="check-circle" size={14} color="#059669" />
        <Text style={styles.footerText}>Powered by Spring Boot & Next.js Architecture</Text>
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
    paddingTop: 55,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 4,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoBadgeText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginRight: 8,
  },
  versionChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  versionChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#7c3aed',
  },
  heroCard: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
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
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 30,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 20,
  },
  featuresGrid: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 16,
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureItemText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
    marginLeft: 10,
  },
  demoCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd6fe',
    borderRadius: 4,
    padding: 16,
    marginBottom: 20,
  },
  demoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
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
    backgroundColor: '#f5f3ff',
    borderWidth: 1,
    borderColor: '#c4b5fd',
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  demoRoleButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6d28d9',
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 28,
  },
  primaryButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 14,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: '#f8fafc',
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryButtonText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '600',
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

