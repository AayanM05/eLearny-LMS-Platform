import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Text, 
  StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useMobileTheme } from './_layout';

// Featured Course Categories
const CATEGORIES = ['All', 'Engineering', 'AI & Data', 'Design', 'Business'];

// Featured Curricula Data (Content Parity with Web)
const FEATURED_COURSES = [
  {
    id: '1',
    category: 'ENGINEERING',
    badgeColor: 'rgba(217, 107, 67, 0.15)',
    badgeTextColor: '#D96B43',
    rating: '★ 4.96 (1,420)',
    level: 'ADVANCED',
    title: 'Master Spring Boot 3 & Distributed Microservices',
    desc: 'Build production-ready microservices with Spring Cloud, OAuth2 JWT Security, Docker, Kafka, and Supabase Postgres.',
    instructor: 'Dr. Alex Vance • Ex-Netflix Staff Engineer',
    price: '$49.99',
    enrolledCount: '12.4K enrolled',
  },
  {
    id: '2',
    category: 'MOBILE APPS',
    badgeColor: 'rgba(59, 130, 246, 0.15)',
    badgeTextColor: '#3B82F6',
    rating: '★ 4.98 (2,180)',
    level: 'INTERMEDIATE',
    title: 'React Native & Expo SDK 57 Masterclass',
    desc: 'Build 60fps native iOS & Android applications with Reanimated 4, Gesture Handler, NativeWind, and OTA Updates.',
    instructor: 'Sarah Jenkins • Principal Mobile Architect',
    price: '$59.99',
    enrolledCount: '18.9K enrolled',
  },
  {
    id: '3',
    category: 'AI & DATA',
    badgeColor: 'rgba(16, 185, 129, 0.15)',
    badgeTextColor: '#10B981',
    rating: '★ 4.94 (890)',
    level: 'BEGINNER TO ADVANCED',
    title: 'Generative AI & LLM Systems Engineering',
    desc: 'Fine-tune open-weight LLMs, build RAG pipelines with LangChain & Vector DBs, and deploy production AI inference APIs.',
    instructor: 'Marcus Chen • AI Research Scientist',
    price: '$69.99',
    enrolledCount: '9.2K enrolled',
  },
];

// Architectural Pillars
const ARCHITECTURAL_PILLARS = [
  {
    icon: '🛡️',
    title: '5-Role Governance',
    desc: 'Granular permissions for Students, Instructors, TAs, Admins, and Super Admins.',
  },
  {
    icon: '⚡',
    title: 'Judge0 Sandbox',
    desc: 'Isolated code execution queue supporting Java 21, Python 3, C++, and TypeScript.',
  },
  {
    icon: '🏆',
    title: 'Duolingo Gamification',
    desc: 'Daily streak freezes, XP power-ups, milestone badges, and weekly podium leaderboards.',
  },
  {
    icon: '🎥',
    title: 'Signed R2 Video Stream',
    desc: 'Secure Cloudflare R2 video streaming with presigned expiration tokens and drip releases.',
  },
];

export default function MobileLandingScreen() {
  const router = useRouter();
  const { theme, toggleTheme } = useMobileTheme();
  const isDark = theme === 'dark';
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredCourses = selectedCategory === 'All'
    ? FEATURED_COURSES
    : FEATURED_COURSES.filter(c => 
        selectedCategory === 'Engineering' ? c.category === 'ENGINEERING' :
        selectedCategory === 'AI & Data' ? c.category === 'AI & DATA' :
        selectedCategory === 'Mobile' ? c.category === 'MOBILE APPS' : true
      );

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Top Header with Branding Logo, Theme Switcher & Auth Links */}
      <View style={[styles.header, isDark ? styles.darkHeader : styles.lightHeader]}>
        <Image
          source={
            isDark 
              ? require('../../assets/branding/logo-dark.png') 
              : require('../../assets/branding/logo-light.png')
          }
          style={styles.logoImage}
          resizeMode="contain"
        />

        <View style={styles.headerRightActions}>
          {/* Theme Toggle Button */}
          <TouchableOpacity 
            style={[styles.themeBtn, isDark ? styles.darkThemeBtn : styles.lightThemeBtn]} 
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <Text style={styles.themeBtnText}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <TouchableOpacity 
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.7}
            style={styles.loginBtn}
          >
            <Text style={[styles.loginBtnText, isDark ? styles.darkText : styles.lightText]}>
              Log In
            </Text>
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity 
            onPress={() => router.push('/(auth)/register')}
            activeOpacity={0.8}
            style={styles.registerBtn}
          >
            <Text style={styles.registerBtnText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Release Pill Badge */}
        <View style={styles.pillContainer}>
          <View style={styles.pillBadge}>
            <Text style={styles.pillText}>🔥 PRO LEVEL LMS PLATFORM 2.0 • LIVE</Text>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={[styles.heroHeadline, isDark ? styles.darkHeadline : styles.lightHeadline]}>
            Architected for <Text style={styles.orangeHighlight}>World-Class</Text> Engineers & Creators
          </Text>

          <Text style={[styles.heroSubtext, isDark ? styles.darkSubtext : styles.lightSubtext]}>
            Production-grade curricula, 4K video streaming, live instructor office hours, code sandbox execution, and verified certificates.
          </Text>

          <View style={styles.heroCtaGroup}>
            <TouchableOpacity 
              style={styles.primaryCta} 
              onPress={() => router.push('/(auth)/register')}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryCtaText}>Get Started Free →</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.secondaryCta, isDark ? styles.darkSecondaryCta : styles.lightSecondaryCta]} 
              onPress={() => router.push('/(auth)/login')}
              activeOpacity={0.8}
            >
              <Text style={[styles.secondaryCtaText, isDark ? styles.darkText : styles.lightText]}>
                Explore Courses
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4-Column Proof Stats Bar */}
        <View style={[styles.statsBar, isDark ? styles.darkStatsBar : styles.lightStatsBar]}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>120K+</Text>
            <Text style={styles.statLabel}>Active Engineers</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>99.4%</Text>
            <Text style={styles.statLabel}>Pass Rate</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.9/5</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>&lt; 50ms</Text>
            <Text style={styles.statLabel}>Sandbox Speed</Text>
          </View>
        </View>

        {/* Category Filter Tabs */}
        <View style={styles.categorySection}>
          <Text style={[styles.sectionTitle, isDark ? styles.darkHeadline : styles.lightHeadline]}>
            Explore Masterclasses
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.categoryPill,
                  selectedCategory === cat
                    ? styles.activeCategoryPill
                    : (isDark ? styles.darkCategoryPill : styles.lightCategoryPill)
                ]}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    selectedCategory === cat
                      ? styles.activeCategoryPillText
                      : (isDark ? styles.darkSubtext : styles.lightSubtext)
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Course Cards */}
        <View style={styles.courseList}>
          {filteredCourses.map(course => (
            <View key={course.id} style={[styles.courseCard, isDark ? styles.darkCard : styles.lightCard]}>
              <View style={styles.courseCardHeader}>
                <View style={[styles.catBadge, { backgroundColor: course.badgeColor }]}>
                  <Text style={[styles.catBadgeText, { color: course.badgeTextColor }]}>
                    {course.category}
                  </Text>
                </View>
                <Text style={styles.ratingText}>{course.rating}</Text>
              </View>

              <Text style={[styles.courseTitle, isDark ? styles.darkText : styles.lightText]}>
                {course.title}
              </Text>

              <Text style={[styles.courseDesc, isDark ? styles.darkSubtext : styles.lightSubtext]}>
                {course.desc}
              </Text>

              <Text style={styles.instructorText}>{course.instructor}</Text>

              <View style={styles.courseFooter}>
                <View>
                  <Text style={[styles.priceText, isDark ? styles.darkText : styles.lightText]}>
                    {course.price}
                  </Text>
                  <Text style={styles.enrolledText}>{course.enrolledCount}</Text>
                </View>

                <TouchableOpacity 
                  style={styles.enrollBtn}
                  onPress={() => router.push('/(auth)/register')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.enrollBtnText}>Enroll Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Architectural Pillars Section */}
        <View style={styles.pillarsSection}>
          <Text style={[styles.sectionTitle, isDark ? styles.darkHeadline : styles.lightHeadline]}>
            Architectural Pillars
          </Text>
          <Text style={[styles.sectionSub, isDark ? styles.darkSubtext : styles.lightSubtext]}>
            Built from scratch for enterprise reliability, high performance, and zero compromise.
          </Text>

          <View style={styles.pillarsGrid}>
            {ARCHITECTURAL_PILLARS.map((pillar, idx) => (
              <View key={idx} style={[styles.pillarCard, isDark ? styles.darkCard : styles.lightCard]}>
                <Text style={styles.pillarIcon}>{pillar.icon}</Text>
                <Text style={[styles.pillarTitle, isDark ? styles.darkText : styles.lightText]}>
                  {pillar.title}
                </Text>
                <Text style={[styles.pillarDesc, isDark ? styles.darkSubtext : styles.lightSubtext]}>
                  {pillar.desc}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Dual Elevation Banners */}
        <View style={styles.bannersContainer}>
          {/* Banner 1: Instructors */}
          <View style={[styles.bannerCard, styles.instructorBanner]}>
            <Text style={styles.bannerTag}>INSTRUCTOR PORTAL</Text>
            <Text style={styles.bannerTitle}>Become an Author & Teach Thousands</Text>
            <Text style={styles.bannerDesc}>
              Publish courses, host office hours, manage TAs, and earn an 80% revenue split on every enrollment.
            </Text>
            <TouchableOpacity 
              style={styles.bannerBtn}
              onPress={() => router.push('/(auth)/register')}
              activeOpacity={0.85}
            >
              <Text style={styles.bannerBtnText}>Apply as Instructor →</Text>
            </TouchableOpacity>
          </View>

          {/* Banner 2: Enterprise */}
          <View style={[styles.bannerCard, isDark ? styles.darkBanner : styles.lightBanner]}>
            <Text style={styles.bannerTagOrange}>ENTERPRISE TEAMS</Text>
            <Text style={[styles.bannerTitle, isDark ? styles.darkText : styles.lightText]}>
              Upskill Engineering Organizations
            </Text>
            <Text style={[styles.bannerDesc, isDark ? styles.darkSubtext : styles.lightSubtext]}>
              Custom learning paths, dedicated TA queues, automated proctoring, and Apache POI Excel reports.
            </Text>
            <TouchableOpacity 
              style={styles.secondaryCta}
              onPress={() => router.push('/(auth)/register')}
              activeOpacity={0.8}
            >
              <Text style={[styles.secondaryCtaText, isDark ? styles.darkText : styles.lightText]}>
                Contact Sales
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={[styles.footer, isDark ? styles.darkFooter : styles.lightFooter]}>
          <Image
            source={
              isDark 
                ? require('../../assets/branding/logo-dark.png') 
                : require('../../assets/branding/logo-light.png')
            }
            style={styles.footerLogo}
            resizeMode="contain"
          />
          <Text style={[styles.footerTagline, isDark ? styles.darkSubtext : styles.lightSubtext]}>
            The Premier Enterprise Learning Management Platform
          </Text>

          <Text style={styles.copyrightText}>
            © 2026 eLearny LMS Platform • All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightBg: {
    backgroundColor: '#FAFAFA',
  },
  darkBg: {
    backgroundColor: '#090D16',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  lightHeader: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E2E8F0',
  },
  darkHeader: {
    backgroundColor: '#090D16',
    borderBottomColor: '#1E293B',
  },
  logoImage: {
    height: 34,
    width: 130,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightThemeBtn: {
    backgroundColor: '#F1F5F9',
  },
  darkThemeBtn: {
    backgroundColor: '#1E293B',
  },
  themeBtnText: {
    fontSize: 16,
  },
  loginBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  loginBtnText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  registerBtn: {
    backgroundColor: '#D96B43',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  registerBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 24,
  },
  pillContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  pillBadge: {
    backgroundColor: 'rgba(217, 107, 67, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(217, 107, 67, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  pillText: {
    color: '#D96B43',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.8,
  },
  heroSection: {
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
  },
  heroHeadline: {
    fontSize: 28,
    fontFamily: 'SpaceGrotesk_700Bold',
    textAlign: 'center',
    lineHeight: 36,
  },
  lightHeadline: {
    color: '#0F172A',
  },
  darkHeadline: {
    color: '#FFFFFF',
  },
  orangeHighlight: {
    color: '#D96B43',
  },
  heroSubtext: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 340,
  },
  lightSubtext: {
    color: '#64748B',
  },
  darkSubtext: {
    color: '#94A3B8',
  },
  heroCtaGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
    width: '100%',
  },
  primaryCta: {
    flex: 1,
    backgroundColor: '#D96B43',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D96B43',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  secondaryCta: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  lightSecondaryCta: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  darkSecondaryCta: {
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
  },
  secondaryCtaText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  lightStatsBar: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  darkStatsBar: {
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 15,
    fontFamily: 'SpaceGrotesk_700Bold',
    color: '#D96B43',
  },
  statLabel: {
    fontSize: 9,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  categorySection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  sectionSub: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginTop: -8,
  },
  categoryScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  lightCategoryPill: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  darkCategoryPill: {
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
  },
  activeCategoryPill: {
    backgroundColor: '#D96B43',
    borderColor: '#D96B43',
  },
  categoryPillText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  activeCategoryPillText: {
    color: '#FFFFFF',
  },
  courseList: {
    gap: 16,
  },
  courseCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    gap: 10,
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
  },
  courseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  catBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  ratingText: {
    color: '#F59E0B',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  courseTitle: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk_700Bold',
    lineHeight: 22,
  },
  courseDesc: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 16,
  },
  instructorText: {
    color: '#D96B43',
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  priceText: {
    fontSize: 18,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  enrolledText: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
  },
  enrollBtn: {
    backgroundColor: '#D96B43',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  enrollBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  pillarsSection: {
    gap: 12,
    marginTop: 8,
  },
  pillarsGrid: {
    gap: 12,
    marginTop: 4,
  },
  pillarCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 6,
  },
  pillarIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  pillarTitle: {
    fontSize: 15,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  pillarDesc: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 16,
  },
  bannersContainer: {
    gap: 16,
    marginTop: 8,
  },
  bannerCard: {
    borderRadius: 20,
    padding: 20,
    gap: 10,
  },
  instructorBanner: {
    backgroundColor: '#0F172A',
  },
  lightBanner: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  darkBanner: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  bannerTag: {
    color: '#D96B43',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },
  bannerTagOrange: {
    color: '#D96B43',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  bannerDesc: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
  bannerBtn: {
    backgroundColor: '#D96B43',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  bannerBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
  footer: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 24,
    paddingBottom: 16,
    borderTopWidth: 1,
  },
  lightFooter: {
    borderTopColor: '#E2E8F0',
  },
  darkFooter: {
    borderTopColor: '#1E293B',
  },
  footerLogo: {
    height: 32,
    width: 130,
  },
  footerTagline: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  copyrightText: {
    color: '#94A3B8',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
  lightText: {
    color: '#0F172A',
  },
  darkText: {
    color: '#FFFFFF',
  },
});
