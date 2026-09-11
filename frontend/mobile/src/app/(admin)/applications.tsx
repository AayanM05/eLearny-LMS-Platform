import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert 
} from 'react-native';

interface AppItem {
  id: number;
  name: string;
  email: string;
  bio: string;
  experience: number;
  tags: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export default function MobileAdminApplicationsScreen() {
  const [applications, setApplications] = useState<AppItem[]>([
    {
      id: 1,
      name: 'Dr. Sarah Jenkins',
      email: 'sarah.jenkins@stanford.edu',
      bio: 'Senior Distributed Systems Architect with 12 years of cloud experience. Author of 3 books on Microservices.',
      experience: 12,
      tags: 'Spring Boot, Kubernetes, Kafka',
      status: 'PENDING'
    },
    {
      id: 2,
      name: 'Alex Vance',
      email: 'alex.vance@techlead.io',
      bio: 'Staff Frontend Engineer specializing in Next.js, WebGL, and high-performance micro-interactions.',
      experience: 8,
      tags: 'React, Next.js, Reanimated',
      status: 'PENDING'
    }
  ]);

  const handleAction = (id: number, approve: boolean) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: approve ? 'APPROVED' : 'REJECTED' } : a));
    Alert.alert('Status Updated', `Application has been ${approve ? 'Approved' : 'Rejected'}.`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Admin Review Center</Text>
      <Text style={styles.headerSub}>Verify instructor credentials & elevate user role privileges.</Text>

      <View style={styles.list}>
        {applications.map(app => (
          <View key={app.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.name}>{app.name}</Text>
                <Text style={styles.email}>{app.email}</Text>
              </View>
              <View style={[
                styles.badge, 
                app.status === 'APPROVED' ? styles.badgeApproved : app.status === 'REJECTED' ? styles.badgeRejected : styles.badgePending
              ]}>
                <Text style={[
                  styles.badgeText,
                  app.status === 'APPROVED' ? styles.textApproved : app.status === 'REJECTED' ? styles.textRejected : styles.textPending
                ]}>{app.status}</Text>
              </View>
            </View>

            <Text style={styles.bio}>{app.bio}</Text>

            <View style={styles.metaRow}>
              <Text style={styles.metaText}>💼 {app.experience} Yrs Exp</Text>
              <Text style={styles.metaText}>✨ {app.tags}</Text>
            </View>

            {app.status === 'PENDING' && (
              <View style={styles.btnRow}>
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.approveBtn]}
                  onPress={() => handleAction(app.id, true)}
                >
                  <Text style={styles.btnText}>Approve</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.actionBtn, styles.rejectBtn]}
                  onPress={() => handleAction(app.id, false)}
                >
                  <Text style={styles.btnText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
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
  list: {
    gap: 16,
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  email: {
    color: '#64748B',
    fontSize: 13,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgePending: {
    backgroundColor: '#F59E0B1F',
    borderColor: '#F59E0B40',
  },
  badgeApproved: {
    backgroundColor: '#10B9811F',
    borderColor: '#10B98140',
  },
  badgeRejected: {
    backgroundColor: '#EF44441F',
    borderColor: '#EF444440',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  textPending: { color: '#F59E0B' },
  textApproved: { color: '#10B981' },
  textRejected: { color: '#EF4444' },
  bio: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  metaText: {
    color: '#94A3B8',
    fontSize: 12,
    backgroundColor: '#020617',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  approveBtn: {
    backgroundColor: '#10B981',
  },
  rejectBtn: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
