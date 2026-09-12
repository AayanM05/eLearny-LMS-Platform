import React from 'react';
import { StyleSheet, View, Image, ScrollView, TouchableOpacity, Text, StatusBar, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header with Horizontal Branding Logo */}
        <View style={styles.header}>
          <Image
            source={
              isDark 
                ? require('../../assets/branding/logo-dark.png') 
                : require('../../assets/branding/logo-light.png')
            }
            style={styles.logoImage}
            resizeMode="contain"
          />
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>v2.0.0 Live</Text>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTag}>PRODUCTION MASTERCLASSES</Text>
          <Text style={styles.heroTitle}>Master Software Engineering on Mobile</Text>
          <Text style={styles.heroSub}>
            Interactive curricula, 4K video streaming, live instructor office hours, and verified certificates.
          </Text>

          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>Explore Masterclasses</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Courses Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Curricula</Text>
          <Text style={styles.sectionLink}>View All</Text>
        </View>

        {/* Course Card 1 */}
        <View style={styles.courseCard}>
          <View style={styles.courseHeader}>
            <Text style={styles.categoryBadge}>SOFTWARE ENGINEERING</Text>
            <Text style={styles.ratingText}>★ 4.92</Text>
          </View>
          <Text style={styles.courseTitle}>Master Spring Boot 3 & Distributed Microservices</Text>
          <Text style={styles.courseDesc}>
            Build production microservices with Spring Cloud, OAuth2 JWT, Docker, Kafka, and Supabase Postgres.
          </Text>
          <View style={styles.courseFooter}>
            <Text style={styles.priceText}>$49.99</Text>
            <TouchableOpacity style={styles.enrollBtn}>
              <Text style={styles.enrollBtnText}>Enroll</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Course Card 2 */}
        <View style={styles.courseCard}>
          <View style={styles.courseHeader}>
            <Text style={[styles.categoryBadge, { backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA' }]}>
              MOBILE APPS
            </Text>
            <Text style={styles.ratingText}>★ 4.96</Text>
          </View>
          <Text style={styles.courseTitle}>React Native & Expo SDK 57 Masterclass</Text>
          <Text style={styles.courseDesc}>
            Build 60fps native iOS & Android applications with Reanimated 4, Gesture Handler, and OTA Updates.
          </Text>
          <View style={styles.courseFooter}>
            <Text style={styles.priceText}>$59.99</Text>
            <TouchableOpacity style={styles.enrollBtn}>
              <Text style={styles.enrollBtnText}>Enroll</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.two,
  },
  logoImage: {
    height: 38,
    width: 150,
  },
  badgePill: {
    backgroundColor: 'rgba(217, 107, 67, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(217, 107, 67, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#D96B43',
    fontSize: 11,
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: 'rgba(30, 41, 59, 0.8)',
    gap: 10,
  },
  heroTag: {
    color: '#D96B43',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  heroSub: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
  },
  primaryButton: {
    backgroundColor: '#D96B43',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionLink: {
    color: '#D96B43',
    fontSize: 13,
    fontWeight: '600',
  },
  courseCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 10,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: 'rgba(217, 107, 67, 0.15)',
    color: '#D96B43',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '700',
  },
  courseTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  courseDesc: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 16,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(30, 41, 59, 0.6)',
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  enrollBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  enrollBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
