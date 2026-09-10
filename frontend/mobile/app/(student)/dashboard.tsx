import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { useAuth } from '../../lib/auth';
import { useRouter } from 'expo-router';
import { Feather, Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { fontInterRegular, fontInterSemiBold, fontInterBold, fontHeadingDisplay } from '../../lib/typography';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Spring Boot', 'System Design', 'React Native', 'DevOps'];

  const handleLogout = async () => {
    await logout();
    router.replace('/(public)/login');
  };

  return (
    <View style={styles.mainWrapper}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Full-Bleed Rich Hero Header */}
        <View style={styles.heroHeader}>
          <View style={styles.topBar}>
            <View style={styles.userBadge}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{(user?.fullName || 'S').charAt(0).toUpperCase()}</Text>
              </View>
              <View>
                <Text style={styles.greetingText}>Welcome back 👋</Text>
                <Text style={styles.userName}>{user?.fullName || 'Student User'}</Text>
              </View>
            </View>

            <View style={styles.topActions}>
              <View style={styles.xpBadge}>
                <Feather name="zap" size={14} color="#f59e0b" />
                <Text style={styles.xpBadgeText}>1,240 XP</Text>
              </View>
              <TouchableOpacity style={styles.iconBtn} onPress={handleLogout}>
                <Feather name="log-out" size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Input Bar */}
          <View style={styles.searchBarContainer}>
            <Feather name="search" size={18} color="#94a3b8" style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Search 120+ courses, tutorials & sandbox problems..."
              placeholderTextColor="#94a3b8"
              style={styles.searchInput}
            />
            <TouchableOpacity style={styles.filterBtn}>
              <Feather name="sliders" size={16} color="#7c3aed" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content Area */}
        <View style={styles.contentBody}>
          {/* Live v1.1 Update Announcement Banner */}
          <View style={{ backgroundColor: '#f3e8ff', borderWidth: 1, borderColor: '#ddd6fe', borderRadius: 10, padding: 14, marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="sparkles" size={20} color="#7c3aed" style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontFamily: fontInterBold, color: '#6d28d9' }}>v1.1 OTA Live Update Verified! 🎉</Text>
              <Text style={{ fontSize: 11, fontFamily: fontInterRegular, color: '#5b21b6', marginTop: 2 }}>Student Dashboard enhanced with instant AI Assistant FAB & Live Judge0 practice links.</Text>
            </View>
          </View>

          {/* Quick Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: '#fef3c7', borderColor: '#fde68a' }]}>
              <View style={styles.statIconBadge}>
                <Ionicons name="flame" size={18} color="#d97706" />
              </View>
              <Text style={styles.statNumber}>5 Days</Text>
              <Text style={styles.statLabel}>Learning Streak</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: '#e0e7ff', borderColor: '#c7d2fe' }]}>
              <View style={styles.statIconBadge}>
                <Ionicons name="book-outline" size={18} color="#4338ca" />
              </View>
              <Text style={styles.statNumber}>4 Enrolled</Text>
              <Text style={styles.statLabel}>Active Courses</Text>
            </View>

            <TouchableOpacity
              style={[styles.statCard, { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }]}
              onPress={() => router.push('/(student)/certificates')}
            >
              <View style={styles.statIconBadge}>
                <MaterialCommunityIcons name="certificate-outline" size={18} color="#059669" />
              </View>
              <Text style={styles.statNumber}>2 Earned</Text>
              <Text style={styles.statLabel}>Certificates</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statCard, { backgroundColor: '#f3e8ff', borderColor: '#e9d5ff' }]}
              onPress={() => router.push('/(student)/leaderboard')}
            >
              <View style={styles.statIconBadge}>
                <FontAwesome5 name="trophy" size={16} color="#7c3aed" />
              </View>
              <Text style={styles.statNumber}>#4 Rank</Text>
              <Text style={styles.statLabel}>Global XP Rank</Text>
            </TouchableOpacity>
          </View>

          {/* Featured Active Course Card */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Continue Learning</Text>
            <TouchableOpacity onPress={() => router.push('/(student)/practice')}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activeCourseCard}>
            <View style={styles.courseBadgeRow}>
              <View style={styles.moduleTag}>
                <Text style={styles.moduleTagText}>Module 4 of 8</Text>
              </View>
              <Text style={styles.timeTag}>⏱️ 45 mins left</Text>
            </View>

            <Text style={styles.courseTitle}>Spring Boot 3.2 Microservices & Distributed Architecture</Text>
            <Text style={styles.lessonTitle}>Lesson 14: Resiliency with Resilience4j Circuit Breaker</Text>

            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Progress</Text>
                <Text style={styles.progressPercent}>68%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: '68%' }]} />
              </View>
            </View>

            <TouchableOpacity style={styles.resumeBtn} onPress={() => router.push('/(student)/practice')}>
              <Ionicons name="play" size={18} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.resumeBtnText}>Resume Lesson</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Access Modules Navigation */}
          <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>Core Platform Modules</Text>
          <View style={styles.moduleGrid}>
            <TouchableOpacity
              style={styles.moduleCard}
              onPress={() => router.push('/(student)/practice')}
            >
              <View style={[styles.moduleIconBg, { backgroundColor: '#f3e8ff' }]}>
                <Feather name="code" size={22} color="#7c3aed" />
              </View>
              <Text style={styles.moduleTitle}>Practice Sandbox</Text>
              <Text style={styles.moduleDesc}>Live Judge0 Multi-Lang Runner</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moduleCard}
              onPress={() => router.push('/(student)/ai-chat')}
            >
              <View style={[styles.moduleIconBg, { backgroundColor: '#e0e7ff' }]}>
                <Feather name="cpu" size={22} color="#4338ca" />
              </View>
              <Text style={styles.moduleTitle}>AI Assistant Tutor</Text>
              <Text style={styles.moduleDesc}>24/7 AI Code Debugger</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moduleCard}
              onPress={() => router.push('/(student)/community')}
            >
              <View style={[styles.moduleIconBg, { backgroundColor: '#ecfdf5' }]}>
                <Feather name="message-square" size={22} color="#059669" />
              </View>
              <Text style={styles.moduleTitle}>Q&A Community</Text>
              <Text style={styles.moduleDesc}>Discuss & Solicit Help</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moduleCard}
              onPress={() => router.push('/(student)/referral')}
            >
              <View style={[styles.moduleIconBg, { backgroundColor: '#fef3c7' }]}>
                <Feather name="gift" size={22} color="#d97706" />
              </View>
              <Text style={styles.moduleTitle}>Referral Rewards</Text>
              <Text style={styles.moduleDesc}>Earn +200 XP Per Invite</Text>
            </TouchableOpacity>
          </View>

          {/* Category Filter Chips */}
          <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>Explore Learning Paths</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.catChipText, activeCategory === cat && styles.catChipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Recommended Course Cards List */}
          <View style={styles.courseList}>
            <View style={styles.catalogCard}>
              <View style={styles.catalogCardImageHeader}>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>ADVANCED</Text>
                </View>
                <Text style={styles.ratingText}>⭐ 4.9 (1.2k reviews)</Text>
              </View>
              <Text style={styles.catalogTitle}>Enterprise Full Stack: Spring Boot 3.2 + Next.js 14</Text>
              <Text style={styles.catalogInstructor}>By Dr. Sarah Jenkins • Senior Staff Engineer</Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>📚 42 Lessons</Text>
                <Text style={styles.metaText}>⏱️ 18.5 Hours</Text>
                <Text style={styles.metaPrice}>₹3,499</Text>
              </View>
              <TouchableOpacity style={styles.enrollBtn}>
                <Text style={styles.enrollBtnText}>Enroll & Start Practice</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.catalogCard}>
              <View style={styles.catalogCardImageHeader}>
                <View style={[styles.levelBadge, { backgroundColor: '#e0e7ff' }]}>
                  <Text style={[styles.levelBadgeText, { color: '#4338ca' }]}>INTERMEDIATE</Text>
                </View>
                <Text style={styles.ratingText}>⭐ 4.8 (850 reviews)</Text>
              </View>
              <Text style={styles.catalogTitle}>System Design & Microservices Scalability Architecture</Text>
              <Text style={styles.catalogInstructor}>By Alex Rivera • Principal Architect</Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>📚 28 Lessons</Text>
                <Text style={styles.metaText}>⏱️ 12.0 Hours</Text>
                <Text style={styles.metaPrice}>₹2,999</Text>
              </View>
              <TouchableOpacity style={styles.enrollBtn}>
                <Text style={styles.enrollBtnText}>Enroll & Start Practice</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating AI Tutor FAB Button */}
      <TouchableOpacity
        style={styles.floatingFab}
        onPress={() => router.push('/(student)/ai-chat')}
        activeOpacity={0.85}
      >
        <Feather name="cpu" size={22} color="#ffffff" />
        <Text style={styles.fabText}>AI Assistant</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    paddingBottom: 90,
  },
  heroHeader: {
    backgroundColor: '#7c3aed',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6d28d9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#a78bfa',
  },
  avatarText: {
    fontFamily: fontInterBold,
    color: '#ffffff',
    fontSize: 20,
  },
  greetingText: {
    fontFamily: fontInterRegular,
    fontSize: 12,
    color: '#c4b5fd',
  },
  userName: {
    fontFamily: fontHeadingDisplay,
    fontSize: 17,
    color: '#ffffff',
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  xpBadgeText: {
    fontFamily: fontInterBold,
    color: '#fbbf24',
    fontSize: 12,
  },
  iconBtn: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontInterRegular,
    fontSize: 13,
    color: '#0f172a',
  },
  filterBtn: {
    paddingLeft: 8,
  },
  contentBody: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  statIconBadge: {
    marginBottom: 6,
  },
  statNumber: {
    fontFamily: fontInterBold,
    fontSize: 18,
    color: '#0f172a',
  },
  statLabel: {
    fontFamily: fontInterRegular,
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: fontHeadingDisplay,
    fontSize: 18,
    color: '#0f172a',
  },
  seeAllText: {
    fontFamily: fontInterSemiBold,
    fontSize: 13,
    color: '#7c3aed',
  },
  activeCourseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 18,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  courseBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  moduleTag: {
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  moduleTagText: {
    fontFamily: fontInterBold,
    fontSize: 10,
    color: '#7c3aed',
  },
  timeTag: {
    fontFamily: fontInterRegular,
    fontSize: 11,
    color: '#64748b',
  },
  courseTitle: {
    fontFamily: fontHeadingDisplay,
    fontSize: 16,
    color: '#0f172a',
    marginBottom: 4,
  },
  lessonTitle: {
    fontFamily: fontInterRegular,
    fontSize: 12,
    color: '#475569',
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontFamily: fontInterRegular,
    fontSize: 11,
    color: '#64748b',
  },
  progressPercent: {
    fontFamily: fontInterBold,
    fontSize: 11,
    color: '#7c3aed',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7c3aed',
    borderRadius: 4,
  },
  resumeBtn: {
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumeBtnText: {
    fontFamily: fontInterBold,
    color: '#ffffff',
    fontSize: 14,
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moduleCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
  },
  moduleIconBg: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  moduleTitle: {
    fontFamily: fontHeadingDisplay,
    fontSize: 13,
    color: '#0f172a',
    marginBottom: 2,
  },
  moduleDesc: {
    fontFamily: fontInterRegular,
    fontSize: 10,
    color: '#64748b',
  },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginRight: 8,
  },
  catChipActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  catChipText: {
    fontFamily: fontInterSemiBold,
    fontSize: 12,
    color: '#475569',
  },
  catChipTextActive: {
    color: '#ffffff',
  },
  courseList: {
    gap: 14,
  },
  catalogCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  catalogCardImageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  levelBadgeText: {
    fontFamily: fontInterBold,
    fontSize: 9,
    color: '#7c3aed',
  },
  ratingText: {
    fontFamily: fontInterRegular,
    fontSize: 11,
    color: '#64748b',
  },
  catalogTitle: {
    fontFamily: fontHeadingDisplay,
    fontSize: 15,
    color: '#0f172a',
    marginBottom: 4,
  },
  catalogInstructor: {
    fontFamily: fontInterRegular,
    fontSize: 11,
    color: '#64748b',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
    marginBottom: 12,
  },
  metaText: {
    fontFamily: fontInterRegular,
    fontSize: 11,
    color: '#475569',
  },
  metaPrice: {
    fontFamily: fontInterBold,
    fontSize: 14,
    color: '#059669',
  },
  enrollBtn: {
    backgroundColor: '#f5f3ff',
    borderWidth: 1,
    borderColor: '#c4b5fd',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  enrollBtnText: {
    fontFamily: fontInterBold,
    fontSize: 12,
    color: '#7c3aed',
  },
  floatingFab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: '#7c3aed',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  fabText: {
    fontFamily: fontInterBold,
    color: '#ffffff',
    fontSize: 13,
  },
});

