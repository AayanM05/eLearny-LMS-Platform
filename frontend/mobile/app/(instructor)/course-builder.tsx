import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Modal, Switch } from 'react-native';
import { api } from '../../lib/api';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { fontInterRegular, fontInterMedium, fontInterSemiBold, fontInterBold, fontHeadingDisplay } from '../../lib/typography';

interface Lesson {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  isFreePreview: boolean;
  dripDelayDays: number;
  durationSeconds?: number;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseDetail {
  id: string;
  title: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  sections: Section[];
}

export default function CourseBuilderScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  // Add Section State
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [addingSection, setAddingSection] = useState(false);

  // Add Lesson State
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('');
  const [isFreePreview, setIsFreePreview] = useState(false);
  const [dripDelayDays, setDripDelayDays] = useState('0');
  const [addingLesson, setAddingLesson] = useState(false);

  const fetchCourse = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data: any = await api.fetch(`/instructor/courses/${id}`);
      setCourse(data);
    } catch {
      // Fallback mock course structure
      setCourse({
        id: (id as string) || 'course-1',
        title: 'Master React Native & Expo 2026',
        status: 'DRAFT',
        sections: [
          {
            id: 'sec-1',
            title: 'Section 1: Course Overview & Environment Setup',
            lessons: [
              {
                id: 'les-1',
                title: 'Welcome to the Course',
                description: 'Overview of topics covered in this masterclass.',
                videoUrl: 'https://example.com/video1.mp4',
                isFreePreview: true,
                dripDelayDays: 0,
              },
              {
                id: 'les-2',
                title: 'Installing Node & Expo CLI',
                description: 'Configuring your developer workstation.',
                isFreePreview: false,
                dripDelayDays: 1,
              },
            ],
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const handleAddSection = async () => {
    if (!newSectionTitle.trim() || !course) return;
    setAddingSection(true);
    try {
      const res: any = await api.fetch(`/instructor/courses/${course.id}/sections`, {
        method: 'POST',
        body: JSON.stringify({ title: newSectionTitle.trim() }),
      });
      const createdSec: Section = res || {
        id: `sec-${Date.now()}`,
        title: newSectionTitle.trim(),
        lessons: [],
      };
      setCourse({
        ...course,
        sections: [...course.sections, createdSec],
      });
      setNewSectionTitle('');
      setShowSectionModal(false);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to create section');
    } finally {
      setAddingSection(false);
    }
  };

  const handleDeleteSection = async (secId: string) => {
    if (!course) return;
    try {
      await api.fetch(`/instructor/sections/${secId}`, { method: 'DELETE' });
      setCourse({
        ...course,
        sections: course.sections.filter((s) => s.id !== secId),
      });
    } catch {
      setCourse({
        ...course,
        sections: course.sections.filter((s) => s.id !== secId),
      });
    }
  };

  const handleAddLesson = async () => {
    if (!lessonTitle.trim() || !activeSectionId || !course) return;
    setAddingLesson(true);
    try {
      const dripDays = parseInt(dripDelayDays, 10) || 0;
      const payload = {
        title: lessonTitle.trim(),
        description: lessonDescription.trim() || undefined,
        videoUrl: lessonVideoUrl.trim() || undefined,
        isFreePreview,
        dripDelayDays: dripDays,
      };

      const res: any = await api.fetch(`/instructor/sections/${activeSectionId}/lessons`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const newLesson: Lesson = res || {
        id: `les-${Date.now()}`,
        title: lessonTitle.trim(),
        description: lessonDescription.trim(),
        videoUrl: lessonVideoUrl.trim(),
        isFreePreview,
        dripDelayDays: dripDays,
      };

      setCourse({
        ...course,
        sections: course.sections.map((sec) =>
          sec.id === activeSectionId ? { ...sec, lessons: [...sec.lessons, newLesson] } : sec
        ),
      });

      setShowLessonModal(false);
      resetLessonForm();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to add lesson');
    } finally {
      setAddingLesson(false);
    }
  };

  const handleDeleteLesson = async (secId: string, lesId: string) => {
    if (!course) return;
    try {
      await api.fetch(`/instructor/lessons/${lesId}`, { method: 'DELETE' });
      setCourse({
        ...course,
        sections: course.sections.map((s) =>
          s.id === secId ? { ...s, lessons: s.lessons.filter((l) => l.id !== lesId) } : s
        ),
      });
    } catch {
      setCourse({
        ...course,
        sections: course.sections.map((s) =>
          s.id === secId ? { ...s, lessons: s.lessons.filter((l) => l.id !== lesId) } : s
        ),
      });
    }
  };

  const handlePublishToggle = async () => {
    if (!course) return;
    setPublishing(true);
    const newStatus = course.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await api.fetch(`/instructor/courses/${course.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      setCourse({ ...course, status: newStatus });
      Alert.alert('Success', `Course is now ${newStatus}`);
    } catch {
      setCourse({ ...course, status: newStatus });
    } finally {
      setPublishing(false);
    }
  };

  const resetLessonForm = () => {
    setLessonTitle('');
    setLessonDescription('');
    setLessonVideoUrl('');
    setIsFreePreview(false);
    setDripDelayDays('0');
    setActiveSectionId(null);
  };

  if (loading) {
    return (
      <View style={[styles.mainWrapper, styles.center]}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Loading curriculum editor...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.mainWrapper}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Feather name="arrow-left" size={18} color="#0f172a" />
        <Text style={styles.backBtnText}>Back to Courses</Text>
      </TouchableOpacity>

      {/* Course Title Header */}
      <View style={styles.headerBox}>
        <View style={{ flex: 1 }}>
          <View style={styles.badgeRow}>
            <View style={[styles.statusBadge, course?.status === 'PUBLISHED' ? styles.statusPublished : styles.statusDraft]}>
              <Text style={[styles.statusText, course?.status === 'PUBLISHED' ? styles.statusTextPub : styles.statusTextDraft]}>
                {course?.status}
              </Text>
            </View>
          </View>
          <Text style={styles.courseTitle}>{course?.title}</Text>
        </View>

        <TouchableOpacity
          style={[styles.publishBtn, course?.status === 'PUBLISHED' ? styles.unpublishBtn : null]}
          onPress={handlePublishToggle}
          disabled={publishing}
        >
          {publishing ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.publishBtnText}>
              {course?.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeaderTitle}>Curriculum Sections ({course?.sections.length || 0})</Text>
        <TouchableOpacity
          style={styles.addSecBtn}
          onPress={() => setShowSectionModal(true)}
        >
          <Feather name="plus" size={14} color="#ffffff" />
          <Text style={styles.addSecBtnText}>Add Section</Text>
        </TouchableOpacity>
      </View>

      {/* Sections List */}
      {course?.sections.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No sections created yet. Add your first section above.</Text>
        </View>
      ) : (
        course?.sections.map((sec, idx) => (
          <View key={sec.id} style={styles.secCard}>
            <View style={styles.secHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.secTitle}>{sec.title}</Text>
                <Text style={styles.secSubtitle}>{sec.lessons.length} Lessons</Text>
              </View>

              <TouchableOpacity
                onPress={() => handleDeleteSection(sec.id)}
                style={styles.deleteIconBtn}
              >
                <Feather name="trash-2" size={16} color="#dc2626" />
              </TouchableOpacity>
            </View>

            {/* Lessons */}
            <View style={styles.lessonsContainer}>
              {sec.lessons.map((les, lIdx) => (
                <View key={les.id} style={styles.lesRow}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.lesTitleRow}>
                      <Text style={styles.lesNum}>{lIdx + 1}.</Text>
                      <Text style={styles.lesTitle}>{les.title}</Text>
                    </View>

                    <View style={styles.lesMetaRow}>
                      {les.isFreePreview && (
                        <View style={styles.previewTag}>
                          <Text style={styles.previewTagText}>Free Preview</Text>
                        </View>
                      )}
                      {les.dripDelayDays > 0 && (
                        <View style={styles.dripTag}>
                          <Feather name="clock" size={10} color="#d97706" style={{ marginRight: 2 }} />
                          <Text style={styles.dripTagText}>Drip: Day {les.dripDelayDays}</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleDeleteLesson(sec.id, les.id)}
                    style={styles.deleteLesBtn}
                  >
                    <Feather name="x" size={14} color="#64748b" />
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity
                style={styles.addLessonBtn}
                onPress={() => {
                  setActiveSectionId(sec.id);
                  setShowLessonModal(true);
                }}
              >
                <Feather name="plus-circle" size={14} color="#7c3aed" style={{ marginRight: 4 }} />
                <Text style={styles.addLessonBtnText}>Add Lesson to Section</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      {/* Add Section Modal */}
      <Modal visible={showSectionModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add New Section</Text>

            <TextInput
              style={styles.input}
              placeholder="Section Title (e.g. Section 2: Core Components)"
              placeholderTextColor="#94a3b8"
              value={newSectionTitle}
              onChangeText={setNewSectionTitle}
            />

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowSectionModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveBtn, addingSection && styles.disabledBtn]}
                onPress={handleAddSection}
                disabled={addingSection}
              >
                <Text style={styles.saveBtnText}>Save Section</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Lesson Modal */}
      <Modal visible={showLessonModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Lesson to Section</Text>

            <TextInput
              style={styles.input}
              placeholder="Lesson Title *"
              placeholderTextColor="#94a3b8"
              value={lessonTitle}
              onChangeText={setLessonTitle}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Lesson Description"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={3}
              value={lessonDescription}
              onChangeText={setLessonDescription}
            />

            <TextInput
              style={styles.input}
              placeholder="Video URL (R2 Cloudflare or HLS link)"
              placeholderTextColor="#94a3b8"
              autoCapitalize="none"
              value={lessonVideoUrl}
              onChangeText={setLessonVideoUrl}
            />

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Free Preview Lesson?</Text>
              <Switch
                value={isFreePreview}
                onValueChange={setIsFreePreview}
                trackColor={{ false: '#cbd5e1', true: '#7c3aed' }}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Drip Release Delay (Days after enrollment)</Text>
              <TextInput
                style={styles.input}
                placeholder="0 = unlocked immediately"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                value={dripDelayDays}
                onChangeText={setDripDelayDays}
              />
            </View>

            <View style={styles.modalActionRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowLessonModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveBtn, addingLesson && styles.disabledBtn]}
                onPress={handleAddLesson}
                disabled={addingLesson}
              >
                <Text style={styles.saveBtnText}>Save Lesson</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: fontInterRegular,
    color: '#64748b',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backBtnText: {
    fontSize: 14,
    fontFamily: fontInterMedium,
    color: '#0f172a',
    marginLeft: 6,
  },
  headerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  statusPublished: {
    backgroundColor: '#d1fae5',
    borderColor: '#a7f3d0',
  },
  statusDraft: {
    backgroundColor: '#fef3c7',
    borderColor: '#fde68a',
  },
  statusText: {
    fontSize: 9,
    fontFamily: fontInterBold,
  },
  statusTextPub: {
    color: '#059669',
  },
  statusTextDraft: {
    color: '#d97706',
  },
  courseTitle: {
    fontSize: 18,
    fontFamily: fontHeadingDisplay,
    color: '#0f172a',
  },
  publishBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  unpublishBtn: {
    backgroundColor: '#dc2626',
  },
  publishBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: fontInterSemiBold,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontFamily: fontInterBold,
    color: '#0f172a',
  },
  addSecBtn: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addSecBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: fontInterSemiBold,
  },
  emptyBox: {
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 6,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    fontFamily: fontInterRegular,
    color: '#64748b',
  },
  secCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  secHeader: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  secTitle: {
    fontSize: 14,
    fontFamily: fontInterBold,
    color: '#0f172a',
  },
  secSubtitle: {
    fontSize: 11,
    fontFamily: fontInterRegular,
    color: '#64748b',
  },
  deleteIconBtn: {
    padding: 6,
  },
  lessonsContainer: {
    padding: 12,
    gap: 8,
  },
  lesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 10,
    borderRadius: 6,
  },
  lesTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lesNum: {
    fontSize: 13,
    fontFamily: fontInterBold,
    color: '#7c3aed',
  },
  lesTitle: {
    fontSize: 13,
    fontFamily: fontInterMedium,
    color: '#0f172a',
  },
  lesMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  previewTag: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  previewTagText: {
    fontSize: 9,
    fontFamily: fontInterBold,
    color: '#059669',
  },
  dripTag: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dripTagText: {
    fontSize: 9,
    fontFamily: fontInterBold,
    color: '#d97706',
  },
  deleteLesBtn: {
    padding: 6,
  },
  addLessonBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd6fe',
    borderRadius: 6,
    backgroundColor: '#f5f3ff',
    marginTop: 4,
  },
  addLessonBtnText: {
    fontSize: 12,
    fontFamily: fontInterSemiBold,
    color: '#7c3aed',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fontHeadingDisplay,
    color: '#0f172a',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: fontInterRegular,
    color: '#0f172a',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 13,
    fontFamily: fontInterMedium,
    color: '#0f172a',
  },
  fieldGroup: {
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontFamily: fontInterSemiBold,
    color: '#64748b',
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cancelBtnText: {
    fontSize: 13,
    fontFamily: fontInterMedium,
    color: '#475569',
  },
  saveBtn: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontFamily: fontInterSemiBold,
  },
});
