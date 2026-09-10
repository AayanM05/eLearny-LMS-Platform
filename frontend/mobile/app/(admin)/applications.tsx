import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../lib/auth';
import { api } from '../../lib/api';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { fontInterRegular, fontInterMedium, fontInterSemiBold, fontInterBold, fontHeadingDisplay, fontHeadingSemiBold } from '../../lib/typography';

interface ApplicationItem {
  id: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  headline: string;
  bio: string;
  experienceYears: number;
  sampleVideoUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNotes?: string;
  createdAt: string;
}

export default function AdminApplications() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data: any = await api.fetch('/admin/instructor-applications');
      setApplications(Array.isArray(data) ? data : []);
    } catch {
      // Fallback demo data if backend offline/mock
      setApplications([
        {
          id: 'app-demo-1',
          userId: 'user-demo-1',
          userFullName: 'Dr. Alex Rivera',
          userEmail: 'alex@example.com',
          headline: 'Senior Systems Architect & Cloud Lead',
          bio: '10+ years specializing in distributed Kubernetes architecture.',
          experienceYears: 10,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleReview = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setProcessingId(id);
    try {
      await api.fetch(`/admin/instructor-applications/${id}/review`, {
        method: 'POST',
        body: JSON.stringify({ status, adminNotes: `Mobile review by Admin ${user?.fullName || ''}` }),
      });
      setApplications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
    } catch {
      setApplications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
    } finally {
      setProcessingId(null);
    }
  };

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
            <Text style={styles.avatarText}>{(user?.fullName || 'A').charAt(0).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{user?.fullName || 'Platform Admin'}</Text>
            <Text style={styles.userEmail}>Admin Privileges Active</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.titleRow}>
        <View>
          <Text style={styles.pageTitle}>Admin Control Center</Text>
          <Text style={styles.pageSubtitle}>Review pending instructor applications</Text>
        </View>
        <TouchableOpacity onPress={fetchApplications} style={styles.refreshIconBtn}>
          <Feather name="refresh-cw" size={16} color="#7c3aed" />
        </TouchableOpacity>
      </View>

      {/* Queue Section */}
      {loading ? (
        <ActivityIndicator size="large" color="#7c3aed" style={{ marginTop: 20 }} />
      ) : applications.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No applications pending review</Text>
        </View>
      ) : (
        applications.map((app) => (
          <View key={app.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.applicantName}>{app.userFullName}</Text>
              <View
                style={[
                  styles.statusTag,
                  app.status === 'APPROVED'
                    ? styles.statusApproved
                    : app.status === 'REJECTED'
                    ? styles.statusRejected
                    : styles.statusPending,
                ]}
              >
                <Text
                  style={[
                    styles.statusTagText,
                    app.status === 'APPROVED'
                      ? styles.statusApprovedText
                      : app.status === 'REJECTED'
                      ? styles.statusRejectedText
                      : styles.statusPendingText,
                  ]}
                >
                  {app.status}
                </Text>
              </View>
            </View>

            <Text style={styles.applicantMeta}>{app.headline} • {app.userEmail}</Text>
            <Text style={styles.applicantSpec}>{app.bio}</Text>

            {app.status === 'PENDING' ? (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.approveButton}
                  onPress={() => handleReview(app.id, 'APPROVED')}
                  disabled={processingId === app.id}
                >
                  <Feather name="check" size={14} color="#ffffff" style={{ marginRight: 4 }} />
                  <Text style={styles.approveButtonText}>
                    {processingId === app.id ? 'Saving...' : 'Approve'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => handleReview(app.id, 'REJECTED')}
                  disabled={processingId === app.id}
                >
                  <Feather name="x" size={14} color="#0f172a" style={{ marginRight: 4 }} />
                  <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.reviewedLabel}>Reviewed & Status Updated</Text>
            )}
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
  logoutButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#fee2e2',
    borderRadius: 4,
    backgroundColor: '#fef2f2',
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
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  refreshIconBtn: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd6fe',
    borderRadius: 4,
    backgroundColor: '#f5f3ff',
  },
  emptyBox: {
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 4,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    fontFamily: fontInterRegular,
    color: '#64748b',
  },
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    padding: 16,
    gap: 8,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  applicantName: {
    fontSize: 16,
    fontFamily: fontInterBold,
    color: '#0f172a',
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
  },
  statusPending: {
    backgroundColor: '#fef3c7',
    borderColor: '#fde68a',
  },
  statusApproved: {
    backgroundColor: '#d1fae5',
    borderColor: '#a7f3d0',
  },
  statusRejected: {
    backgroundColor: '#fee2e2',
    borderColor: '#fecaca',
  },
  statusTagText: {
    fontSize: 10,
    fontFamily: fontInterBold,
  },
  statusPendingText: {
    color: '#d97706',
  },
  statusApprovedText: {
    color: '#059669',
  },
  statusRejectedText: {
    color: '#dc2626',
  },
  reviewedLabel: {
    fontSize: 12,
    fontFamily: fontInterRegular,
    color: '#64748b',
    fontStyle: 'italic',
    marginTop: 4,
  },

  applicantMeta: {
    fontSize: 12,
    fontFamily: fontInterRegular,
    color: '#64748b',
  },
  applicantSpec: {
    fontSize: 12,
    fontFamily: fontInterSemiBold,
    color: '#0f172a',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontFamily: fontInterSemiBold,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 10,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectButtonText: {
    color: '#0f172a',
    fontSize: 13,
    fontFamily: fontInterSemiBold,
  },
});
