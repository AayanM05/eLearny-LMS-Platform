import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../lib/auth';
import { api } from '../../lib/api';
import { useRouter } from 'expo-router';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';

interface CourseItem {
  id: string;
  title: string;
  category: string;
  price: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
}

export default function InstructorAnalytics() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data: any = await api.fetch('/instructor/courses');
      setCourses(Array.isArray(data) ? data : []);
    } catch {
      setCourses([
        {
          id: 'c-demo-1',
          title: 'Advanced Microservices & Distributed Systems with Spring Boot 3',
          category: 'Software Engineering',
          price: 89.99,
          status: 'PUBLISHED',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'c-demo-2',
          title: 'Production Kubernetes Cluster Architecture & GitOps Pipeline',
          category: 'DevOps & Cloud',
          price: 69.99,
          status: 'DRAFT',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

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
            <Text style={styles.avatarText}>{(user?.fullName || 'I').charAt(0).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{user?.fullName || 'Instructor'}</Text>
            <Text style={styles.userEmail}>Instructor Account Verified</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <Text style={styles.pageTitle}>Instructor Studio</Text>
      <Text style={styles.pageSubtitle}>Monitor course performance and revenue metrics</Text>

      {/* Revenue Card */}
      <View style={styles.revenueCard}>
        <Text style={styles.revenueLabel}>Total Gross Revenue</Text>
        <Text style={styles.revenueAmount}>$4,850.00</Text>
        <View style={styles.trendRow}>
          <Feather name="trending-up" size={14} color="#059669" />
          <Text style={styles.trendText}>+14% from last month</Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="people-outline" size={20} color="#7c3aed" />
          <Text style={styles.statNumber}>1,240</Text>
          <Text style={styles.statLabel}>Total Students</Text>
        </View>

        <View style={styles.statCard}>
          <Feather name="book-open" size={20} color="#0f172a" />
          <Text style={styles.statNumber}>{courses.length}</Text>
          <Text style={styles.statLabel}>Created Courses</Text>
        </View>
      </View>

      {/* Courses Catalog Section */}
      <View style={styles.catalogSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Courses Catalog</Text>
          <TouchableOpacity onPress={fetchCourses} style={styles.refreshBtn}>
            <Feather name="refresh-cw" size={14} color="#7c3aed" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color="#7c3aed" style={{ marginVertical: 16 }} />
        ) : (
          courses.map((course) => (
            <View key={course.id} style={styles.courseCard}>
              <View style={styles.courseHeader}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <View
                  style={[
                    styles.statusTag,
                    course.status === 'PUBLISHED' ? styles.publishedTag : styles.draftTag,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusTagText,
                      course.status === 'PUBLISHED' ? styles.publishedTagText : styles.draftTagText,
                    ]}
                  >
                    {course.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.courseMeta}>{course.category} • ${course.price.toFixed(2)}</Text>
            </View>
          ))
        )}
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
    color: '#059669',
    fontWeight: '600',
  },
  logoutButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#fee2e2',
    borderRadius: 4,
    backgroundColor: '#fef2f2',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  pageSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 20,
  },
  revenueCard: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 4,
    padding: 18,
    marginBottom: 16,
  },
  revenueLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
  },
  revenueAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#065f46',
    marginVertical: 4,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
    marginLeft: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    padding: 16,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  catalogSection: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  refreshBtn: {
    padding: 6,
    borderWidth: 1,
    borderColor: '#ddd6fe',
    borderRadius: 4,
    backgroundColor: '#f5f3ff',
  },
  courseCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    padding: 16,
    marginBottom: 10,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    flex: 1,
    marginRight: 8,
  },
  statusTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  publishedTag: {
    backgroundColor: '#d1fae5',
    borderColor: '#a7f3d0',
  },
  draftTag: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  publishedTagText: {
    color: '#059669',
  },
  draftTagText: {
    color: '#64748b',
  },
  courseMeta: {
    fontSize: 12,
    color: '#64748b',
  },
});

