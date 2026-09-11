import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';

export default function MobileInstructorApplyScreen() {
  const router = useRouter();
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState('3');
  const [expertiseTags, setExpertiseTags] = useState('React Native, Spring Boot, Mobile Design');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!bio.trim()) {
      Alert.alert('Required Field', 'Please provide a professional bio.');
      return;
    }
    setLoading(true);

    try {
      // Simulate API post to /api/v1/instructor/applications
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
      }, 1000);
    } catch (err) {
      setLoading(false);
      Alert.alert('Submission Error', 'Failed to submit application.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {submitted ? (
        <View style={styles.successCard}>
          <View style={styles.successBadge}>
            <Text style={styles.successBadgeText}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Application Submitted!</Text>
          <Text style={styles.successSub}>
            Your instructor application is under review by the academic committee. You will receive an in-app & email update within 24-48 hours.
          </Text>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.buttonText}>Return Home</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.formCard}>
          <Text style={styles.tagline}>INSTRUCTOR ELEVATION (FLOW 02)</Text>
          <Text style={styles.title}>Become an eLearny Instructor</Text>
          <Text style={styles.subtitle}>
            Teach thousands of mobile & web learners worldwide. Design interactive curricula, run live office hours, and track real-time analytics.
          </Text>

          {/* Bio Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Professional Biography *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={4}
              placeholder="Describe your background and expertise..."
              placeholderTextColor="#64748B"
              value={bio}
              onChangeText={setBio}
            />
          </View>

          {/* Experience Years */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Years of Domain Experience *</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="e.g. 5"
              placeholderTextColor="#64748B"
              value={experienceYears}
              onChangeText={setExperienceYears}
            />
          </View>

          {/* Expertise Tags */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Primary Expertise Tags *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. React Native, System Design, DevOps"
              placeholderTextColor="#64748B"
              value={expertiseTags}
              onChangeText={setExpertiseTags}
            />
          </View>

          {/* Portfolio Link */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Portfolio / Github Link</Text>
            <TextInput
              style={styles.input}
              placeholder="https://github.com/username"
              placeholderTextColor="#64748B"
              value={portfolioUrl}
              onChangeText={setPortfolioUrl}
            />
          </View>

          {/* Resume URL */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Resume / CV PDF URL</Text>
            <TextInput
              style={styles.input}
              placeholder="https://drive.google.com/resume.pdf"
              placeholderTextColor="#64748B"
              value={resumeUrl}
              onChangeText={setResumeUrl}
            />
          </View>

          {/* Submit Action */}
          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Submit Instructor Application</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
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
  formCard: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  tagline: {
    color: '#D96B43',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: '#D96B43',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#D96B43',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  successCard: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#10B98133',
  },
  successBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10B9811F',
    borderWidth: 1,
    borderColor: '#10B98140',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successBadgeText: {
    color: '#10B981',
    fontSize: 28,
    fontWeight: 'bold',
  },
  successTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  successSub: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
});
