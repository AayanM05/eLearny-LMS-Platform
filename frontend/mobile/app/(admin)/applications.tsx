import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../lib/auth';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';

export default function AdminApplications() {
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

      <Text style={styles.pageTitle}>Admin Control Center</Text>
      <Text style={styles.pageSubtitle}>Review and approve pending instructor applications</Text>

      {/* Queue Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.applicantName}>Dr. Alex Rivera</Text>
          <View style={styles.pendingTag}>
            <Text style={styles.pendingTagText}>PENDING</Text>
          </View>
        </View>

        <Text style={styles.applicantMeta}>Senior Systems Architect (10+ yrs) • alex@example.com</Text>
        <Text style={styles.applicantSpec}>Specialization: Distributed Systems & Kubernetes Architecture</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.approveButton}>
            <Feather name="check" size={14} color="#ffffff" style={{ marginRight: 4 }} />
            <Text style={styles.approveButtonText}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rejectButton}>
            <Feather name="x" size={14} color="#0f172a" style={{ marginRight: 4 }} />
            <Text style={styles.rejectButtonText}>Reject</Text>
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
    color: '#7c3aed',
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
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    padding: 16,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  applicantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  pendingTag: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pendingTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#d97706',
  },
  applicantMeta: {
    fontSize: 12,
    color: '#64748b',
  },
  applicantSpec: {
    fontSize: 12,
    fontWeight: '500',
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
    fontWeight: '600',
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
    fontWeight: '600',
  },
});
