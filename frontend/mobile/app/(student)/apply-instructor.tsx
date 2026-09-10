import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../lib/auth';
import { api } from '../../lib/api';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { fontInterRegular, fontInterMedium, fontInterSemiBold, fontInterBold, fontHeadingDisplay } from '../../lib/typography';

export default function ApplyInstructorScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [sampleVideoUrl, setSampleVideoUrl] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingApp, setExistingApp] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyApplication();
  }, []);

  const fetchMyApplication = async () => {
    setLoading(true);
    try {
      const data: any = await api.fetch('/instructor-applications/me');
      if (data && data.id) {
        setExistingApp(data);
      }
    } catch {
      // If 404 or no app yet, leave existingApp as null
      setExistingApp(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!headline.trim() || !bio.trim() || !experienceYears.trim()) {
      setError('Please fill in all required fields (Headline, Bio, Years of Experience).');
      return;
    }
    const years = parseInt(experienceYears, 10);
    if (isNaN(years) || years < 0) {
      setError('Please enter a valid number of years of experience.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        headline: headline.trim(),
        bio: bio.trim(),
        experienceYears: years,
        sampleVideoUrl: sampleVideoUrl.trim() || undefined,
      };
      const response: any = await api.fetch('/instructor-applications', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setExistingApp(response || { status: 'PENDING', headline, bio, experienceYears: years });
    } catch (err: any) {
      setError(err?.message || 'Failed to submit instructor application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.mainWrapper, styles.center]}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Checking application status...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.mainWrapper}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Feather name="arrow-left" size={18} color="#0f172a" />
        <Text style={styles.backBtnText}>Back to Dashboard</Text>
      </TouchableOpacity>

      <Text style={styles.pageTitle}>Apply to Teach on eLearny</Text>
      <Text style={styles.pageSubtitle}>
        Share your expertise with thousands of students worldwide. Apply today to become a verified instructor.
      </Text>

      {existingApp ? (
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Feather
              name={existingApp.status === 'APPROVED' ? 'check-circle' : existingApp.status === 'REJECTED' ? 'x-circle' : 'clock'}
              size={24}
              color={existingApp.status === 'APPROVED' ? '#059669' : existingApp.status === 'REJECTED' ? '#dc2626' : '#d97706'}
            />
            <Text style={styles.statusTitle}>
              Application Status: {existingApp.status || 'PENDING'}
            </Text>
          </View>

          <Text style={styles.statusDesc}>
            {existingApp.status === 'APPROVED'
              ? 'Congratulations! Your application has been approved. You now have full access to course creation tools.'
              : existingApp.status === 'REJECTED'
              ? 'Thank you for your interest. Unfortunately, your application was not approved at this time.'
              : 'Your application is currently under review by our administration team. We will notify you once a decision is made.'}
          </Text>

          <View style={styles.detailsBox}>
            <Text style={styles.detailLabel}>Submitted Headline:</Text>
            <Text style={styles.detailValue}>{existingApp.headline || headline || 'N/A'}</Text>

            <Text style={styles.detailLabel}>Years of Experience:</Text>
            <Text style={styles.detailValue}>{existingApp.experienceYears ?? experienceYears} Years</Text>
          </View>
        </View>
      ) : (
        <View style={styles.formCard}>
          {error && (
            <View style={styles.errorBox}>
              <Feather name="alert-circle" size={16} color="#dc2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Professional Headline *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Senior Full Stack Engineer & Cloud Architect"
              placeholderTextColor="#94a3b8"
              value={headline}
              onChangeText={setHeadline}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Teaching Bio & Experience *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your domain background, teaching experience, and course topic ideas..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
              value={bio}
              onChangeText={setBio}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Years of Relevant Experience *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 5"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={experienceYears}
              onChangeText={setExperienceYears}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Sample Video / Portfolio URL (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="https://youtube.com/watch?v=... or portfolio link"
              placeholderTextColor="#94a3b8"
              autoCapitalize="none"
              value={sampleVideoUrl}
              onChangeText={setSampleVideoUrl}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.disabledBtn]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <>
                <Feather name="send" size={16} color="#ffffff" style={{ marginRight: 8 }} />
                <Text style={styles.submitBtnText}>Submit Application</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
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
    marginTop: 6,
    marginBottom: 24,
    lineHeight: 18,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 20,
    gap: 16,
  },
  statusCard: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 20,
    gap: 12,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusTitle: {
    fontSize: 16,
    fontFamily: fontInterBold,
    color: '#0f172a',
  },
  statusDesc: {
    fontSize: 13,
    fontFamily: fontInterRegular,
    color: '#475569',
    lineHeight: 18,
  },
  detailsBox: {
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 4,
  },
  detailLabel: {
    fontSize: 11,
    fontFamily: fontInterSemiBold,
    color: '#64748b',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 14,
    fontFamily: fontInterMedium,
    color: '#0f172a',
    marginBottom: 8,
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
    height: 100,
    textAlignVertical: 'top',
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
