import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert 
} from 'react-native';

interface Lesson {
  id: number;
  title: string;
  type: string;
}

interface Section {
  id: number;
  title: string;
  lessons: Lesson[];
}

export default function MobileCourseBuilderScreen() {
  const [sections, setSections] = useState<Section[]>([
    {
      id: 1,
      title: 'Module 1: Mobile UI/UX & Native Gestures',
      lessons: [
        { id: 101, title: '1.1 Setting Up Expo SDK 51 & Reanimated 3', type: 'VIDEO' },
        { id: 102, title: '1.2 Gesture Handler 60fps Worklets', type: 'VIDEO' }
      ]
    },
    {
      id: 2,
      title: 'Module 2: State & API Sync',
      lessons: [
        { id: 201, title: '2.1 Spring Boot REST Integration', type: 'DOCUMENT' }
      ]
    }
  ]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Curriculum Builder</Text>
      <Text style={styles.headerSub}>Master React Native & Expo SDK 51</Text>

      <View style={styles.sectionsList}>
        {sections.map((sec, idx) => (
          <View key={sec.id} style={styles.sectionCard}>
            <View style={styles.secHeader}>
              <Text style={styles.secIndex}>Module {idx + 1}</Text>
              <Text style={styles.secTitle}>{sec.title}</Text>
            </View>

            <View style={styles.lessonsList}>
              {sec.lessons.map(lesson => (
                <View key={lesson.id} style={styles.lessonItem}>
                  <Text style={styles.lessonTypeIcon}>{lesson.type === 'VIDEO' ? '🎥' : '📄'}</Text>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.addLessonBtn}
              onPress={() => Alert.alert('Add Lesson', 'Selected module ' + (idx + 1))}
            >
              <Text style={styles.addLessonText}>+ Add Lesson Asset</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },
  headerSub: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 24,
  },
  sectionsList: {
    gap: 16,
  },
  sectionCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  secHeader: {
    marginBottom: 14,
  },
  secIndex: {
    color: '#D96B43',
    fontSize: 12,
    fontWeight: '800',
  },
  secTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  lessonsList: {
    gap: 10,
    marginBottom: 16,
  },
  lessonItem: {
    backgroundColor: '#020617',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  lessonTypeIcon: {
    fontSize: 16,
  },
  lessonTitle: {
    color: '#CBD5E1',
    fontSize: 14,
    flex: 1,
  },
  addLessonBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  addLessonText: {
    color: '#D96B43',
    fontSize: 14,
    fontWeight: '700',
  },
});
