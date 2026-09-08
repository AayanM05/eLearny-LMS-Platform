import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../lib/auth';
import { useRouter } from 'expo-router';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/(public)/login');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.mainWrapper}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.userBadge}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(user?.fullName || 'S').charAt(0).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{user?.fullName || 'Student User'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {/* Welcome Card */}
      <View style={styles.welcomeCard}>
        <View style={styles.accountTag}>
          <Feather name="shield" size={12} color="#7c3aed" />
          <Text style={styles.accountTagText}>Student Account Active</Text>
        </View>
        <Text style={styles.welcomeTitle}>Student Learning Workspace</Text>
        <Text style={styles.welcomeSubtitle}>Track your active courses, quizzes, and earned credentials.</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="book-outline" size={20} color="#7c3aed" />
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Enrolled Courses</Text>
        </View>

        <View style={styles.statCard}>
          <Feather name="clock" size={20} color="#059669" />
          <Text style={styles.statNumber}>18.4h</Text>
          <Text style={styles.statLabel}>Learning Time</Text>
        </View>

        <View style={styles.statCard}>
          <MaterialCommunityIcons name="certificate-outline" size={20} color="#d97706" />
          <Text style={styles.statNumber}>1</Text>
          <Text style={styles.statLabel}>Certificate</Text>
        </View>

        <View style={styles.statCard}>
          <Feather name="flame" size={20} color="#dc2626" />
          <Text style={styles.statNumber}>5 Days</Text>
          <Text style={styles.statLabel}>Daily Streak</Text>
        </View>
      </View>

      {/* Continue Learning Card */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Continue Learning</Text>

        <View style={styles.courseCard}>
          <View style={styles.courseHeader}>
            <Text style={styles.courseTag}>Java & Spring Boot</Text>
            <Text style={styles.courseModule}>Module 4 of 6</Text>
          </View>

          <Text style={styles.courseTitle}>Spring Boot 3.2 Microservices & Security</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressTextRow}>
              <Text style={styles.progressLabel}>Overall Progress</Text>
              <Text style={styles.progressValue}>78%</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: '78%' }]} />
            </View>
          </View>

          <TouchableOpacity style={styles.resumeButton}>
            <Ionicons name="play-circle" size={18} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.resumeButtonText}>Resume Lesson 14</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  userEmail: {
    fontSize: 11,
    color: '#64748b',
  },
  logoutButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#fee2e2',
    borderRadius: 4,
    backgroundColor: '#fef2f2',
  },
  welcomeCard: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    padding: 16,
    marginBottom: 20,
  },
  accountTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3e8ff',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 8,
  },
  accountTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#7c3aed',
    marginLeft: 4,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    padding: 14,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  sectionContainer: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  courseCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    padding: 16,
    gap: 12,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7c3aed',
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  courseModule: {
    fontSize: 11,
    color: '#64748b',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  progressContainer: {
    gap: 6,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  progressValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7c3aed',
    borderRadius: 4,
  },
  resumeButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  resumeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
