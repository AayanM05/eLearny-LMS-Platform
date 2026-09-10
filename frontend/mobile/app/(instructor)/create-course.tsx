import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { api } from '../../lib/api';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { fontInterRegular, fontInterMedium, fontInterSemiBold, fontInterBold, fontHeadingDisplay } from '../../lib/typography';

export default function CreateCourseScreen() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Software Development');
  const [level, setLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS'>('BEGINNER');
  const [price, setPrice] = useState('49.99');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!title.trim() || !category.trim() || !description.trim()) {
      setError('Please provide a Title, Category, and Description for your course.');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError('Please enter a valid price (0 or higher).');
      return;
    }

    setSubmitting(true);
    setError(null);

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-');

    try {
      const payload = {
        title: title.trim(),
        slug,
        subtitle: subtitle.trim() || undefined,
        description: description.trim(),
        category: category.trim(),
        level,
        price: priceNum,
        thumbnailUrl: thumbnailUrl.trim() || undefined,
      };

      const response: any = await api.fetch('/instructor/courses', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const courseId = response?.id || 'new-course-1';
      router.replace(`/(instructor)/course-builder?id=${courseId}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to create course. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.mainWrapper}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Feather name="arrow-left" size={18} color="#0f172a" />
        <Text style={styles.backBtnText}>Back to Courses</Text>
      </TouchableOpacity>

      <Text style={styles.pageTitle}>Create New Course</Text>
      <Text style={styles.pageSubtitle}>Fill in the basic course details to initialize your curriculum builder.</Text>

      <View style={styles.formCard}>
        {error && (
          <View style={styles.errorBox}>
            <Feather name="alert-circle" size={16} color="#dc2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Course Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Master React Native & Expo 2026"
            placeholderTextColor="#94a3b8"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Subtitle / Brief Summary</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Build native mobile apps with TypeScript & Tailwind CSS"
            placeholderTextColor="#94a3b8"
            value={subtitle}
            onChangeText={setSubtitle}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Category *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Mobile Development"
            placeholderTextColor="#94a3b8"
            value={category}
            onChangeText={setCategory}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Difficulty Level</Text>
          <View style={styles.levelRow}>
            {(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS'] as const).map((lvl) => (
              <TouchableOpacity
                key={lvl}
                style={[styles.levelOption, level === lvl && styles.levelOptionActive]}
                onPress={() => setLevel(lvl)}
              >
                <Text style={[styles.levelOptionText, level === lvl && styles.levelOptionTextActive]}>
                  {lvl.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Price ($ USD) *</Text>
          <TextInput
            style={styles.input}
            placeholder="49.99"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Thumbnail Image URL (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://images.unsplash.com/photo-..."
            placeholderTextColor="#94a3b8"
            autoCapitalize="none"
            value={thumbnailUrl}
            onChangeText={setThumbnailUrl}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Full Course Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Detail what students will learn, requirements, and target audience..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={5}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.disabledBtn]}
          onPress={handleCreate}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <>
              <Feather name="arrow-right" size={16} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.submitBtnText}>Initialize & Open Curriculum Builder</Text>
            </>
          )}
        </TouchableOpacity>
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
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtnText: {
    fontSize: 14,
    fontFamily: fontInterMedium,
    color: '#0f172a',
    marginLeft: 6,
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: fontHeadingDisplay,
    color: '#0f172a',
  },
  pageSubtitle: {
    fontSize: 13,
    fontFamily: fontInterRegular,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 24,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 20,
    gap: 16,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 12,
    borderRadius: 6,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    fontFamily: fontInterMedium,
    flex: 1,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontFamily: fontInterSemiBold,
    color: '#0f172a',
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
    backgroundColor: '#ffffff',
  },
  textArea: {
    height: 110,
    textAlignVertical: 'top',
  },
  levelRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  levelOption: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
  },
  levelOptionActive: {
    backgroundColor: '#f5f3ff',
    borderColor: '#7c3aed',
  },
  levelOptionText: {
    fontSize: 11,
    fontFamily: fontInterMedium,
    color: '#475569',
  },
  levelOptionTextActive: {
    color: '#7c3aed',
    fontFamily: fontInterBold,
  },
  submitButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 14,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: fontInterSemiBold,
  },
});
