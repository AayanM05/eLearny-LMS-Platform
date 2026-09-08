import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {
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
            <Text style={styles.versionChipText}>v1.0</Text>
          </View>
        </View>
      </View>

      {/* Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.pillBadge}>
          <Feather name="sparkles" size={12} color="#7c3aed" />
          <Text style={styles.pillBadgeText}>Next-Gen Learning Platform</Text>
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
            <Feather name="shield-check" size={18} color="#7c3aed" />
            <Text style={styles.featureItemText}>Proctored Exams</Text>
          </View>
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
            <Text style={styles.secondaryButtonText}>Sign In to Account</Text>
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
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
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
    marginBottom: 28,
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
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 32,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
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
  buttonContainer: {
    gap: 12,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 15,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: '#f8fafc',
    paddingVertical: 15,
    borderRadius: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryButtonText: {
    color: '#0f172a',
    fontSize: 16,
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
