import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useAuth } from '../../lib/auth';
import { api } from '../../lib/api';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { fontInterRegular, fontInterMedium, fontInterSemiBold, fontInterBold, fontHeadingDisplay } from '../../lib/typography';

interface Course {
  id: string;
  title: string;
  slug: string;
  category: string;
  level: string;
  price: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  thumbnailUrl?: string;
  sectionsCount?: number;
  enrolledStudentsCount?: number;
  createdAt: string;
}

export default function InstructorCoursesScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data: any = await api.fetch('/instructor/courses');
      setCourses(Array.isArray(data) ? data : []);
    } catch {
      // Fallback demo data if backend offline/empty
      setCourses([
        {
          id: 'demo-course-1',
          title: 'Full Stack Java Spring Boot & Next.js Masterclass',
          slug: 'full-stack-java-nextjs-masterclass',
          category: 'Software Development',
          level: 'INTERMEDIATE',
          price: 49.99,
          status: 'PUBLISHED',
          thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop',
          sectionsCount: 8,
          enrolledStudentsCount: 142,
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
            <Text style={styles.userEmail}>Instructor Studio Active</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => router.push('/(instructor)/create-course')}
        >
          <Feather name="plus" size={16} color="#ffffff" />
          <Text style={styles.createBtnText}>New Course</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleRow}>
        <View>
          <Text style={styles.pageTitle}>My Courses</Text>
          <Text style={styles.pageSubtitle}>Manage course curriculum, pricing & drip content</Text>
        </View>
        <TouchableOpacity onPress={fetchCourses} style={styles.refreshIconBtn}>
          <Feather name="refresh-cw" size={16} color="#7c3aed" />
        </TouchableOpacity>
      </View>

      {/* Courses List */}
      {loading ? (
        <ActivityIndicator size="large" color="#7c3aed" style={{ marginTop: 20 }} />
      ) : courses.length === 0 ? (
        <View style={styles.emptyBox}>
          <Feather name="book-open" size={32} color="#94a3b8" style={{ marginBottom: 8 }} />
          <Text style={styles.emptyTitle}>No courses created yet</Text>
          <Text style={styles.emptyDesc}>Get started by clicking the "New Course" button above.</Text>
        </View>
      ) : (
        courses.map((course) => (
          <View key={course.id} style={styles.courseCard}>
            {course.thumbnailUrl ? (
              <Image source={{ uri: course.thumbnailUrl }} style={styles.cardImage} resizeMode="cover" />
            ) : (
              <View style={[styles.cardImage, styles.placeholderImage]}>
                <Feather name="image" size={24} color="#94a3b8" />
              </View>
            )}

            <View style={styles.cardContent}>
              <View style={styles.statusRow}>
                <View style={[styles.badge, course.status === 'PUBLISHED' ? styles.publishedBadge : styles.draftBadge]}>
                  <Text style={[styles.badgeText, course.status === 'PUBLISHED' ? styles.publishedBadgeText : styles.draftBadgeText]}>
                    {course.status}
                  </Text>
                </View>
                <Text style={styles.priceText}>
                  {course.price > 0 ? `$${course.price.toFixed(2)}` : 'FREE'}
                </Text>
              </View>

              <Text style={styles.courseTitle} numberOfLines={2}>{course.title}</Text>
              <Text style={styles.courseMeta}>{course.category} • {course.level}</Text>

              <View style={styles.footerRow}>
                <TouchableOpacity
                  style={styles.builderBtn}
                  onPress={() => router.push(`/(instructor)/course-builder?id=${course.id}`)}
                >
                  <Feather name="edit-3" size={14} color="#7c3aed" style={{ marginRight: 4 }} />
                  <Text style={styles.builderBtnText}>Curriculum Builder</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.analyticsIconBtn}
                  onPress={() => router.push('/(instructor)/analytics')}
                >
                  <Feather name="bar-chart-2" size={14} color="#475569" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}
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
    fontFamily: fontInterBold,
  },
  userName: {
    fontSize: 16,
    fontFamily: fontInterBold,
    color: '#0f172a',
  },
  userEmail: {
    fontSize: 11,
    color: '#7c3aed',
    fontFamily: fontInterSemiBold,
  },
  createBtn: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  createBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: fontInterSemiBold,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: fontHeadingDisplay,
    color: '#0f172a',
  },
  pageSubtitle: {
    fontSize: 12,
    fontFamily: fontInterRegular,
    color: '#64748b',
    marginTop: 2,
  },
  refreshIconBtn: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd6fe',
    borderRadius: 4,
    backgroundColor: '#f5f3ff',
  },
  emptyBox: {
    padding: 32,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: fontInterBold,
    color: '#0f172a',
  },
  emptyDesc: {
    fontSize: 12,
    fontFamily: fontInterRegular,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  courseCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 140,
  },
  placeholderImage: {
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 16,
    gap: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  publishedBadge: {
    backgroundColor: '#d1fae5',
    borderColor: '#a7f3d0',
  },
  draftBadge: {
    backgroundColor: '#fef3c7',
    borderColor: '#fde68a',
  },
  badgeText: {
    fontSize: 10,
    fontFamily: fontInterBold,
  },
  publishedBadgeText: {
    color: '#059669',
  },
  draftBadgeText: {
    color: '#d97706',
  },
  priceText: {
    fontSize: 14,
    fontFamily: fontInterBold,
    color: '#0f172a',
  },
  courseTitle: {
    fontSize: 16,
    fontFamily: fontInterBold,
    color: '#0f172a',
    lineHeight: 22,
  },
  courseMeta: {
    fontSize: 12,
    fontFamily: fontInterRegular,
    color: '#64748b',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  builderBtn: {
    flex: 1,
    backgroundColor: '#f5f3ff',
    borderWidth: 1,
    borderColor: '#ddd6fe',
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  builderBtnText: {
    color: '#7c3aed',
    fontSize: 12,
    fontFamily: fontInterSemiBold,
  },
  analyticsIconBtn: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    backgroundColor: '#f8fafc',
  },
});
