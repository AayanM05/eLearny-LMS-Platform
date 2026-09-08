import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MobileCertificates() {
  const router = useRouter();

  const certificates = [
    {
      title: 'Full-Stack Web Development Bootcamp',
      instructor: 'Dr. Alex Rivera',
      date: '2026-08-15',
      code: 'CERT-ELE-89A4B12C',
    },
    {
      title: 'Spring Boot 3 & Microservices Masterclass',
      instructor: 'Sarah Jenkins',
      date: '2026-09-01',
      code: 'CERT-ELE-99F1C33X',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Earned Certificates</Text>
      </View>

      <View style={styles.listContainer}>
        {certificates.map((cert, idx) => (
          <View key={idx} style={styles.certCard}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="certificate" size={32} color="#d97706" />
              <View style={styles.badge}>
                <Feather name="shield" size={10} color="#059669" />
                <Text style={styles.badgeText}>Verified</Text>
              </View>
            </View>

            <Text style={styles.certTitle}>{cert.title}</Text>
            <Text style={styles.instructorText}>Instructor: {cert.instructor}</Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>Issued: {cert.date}</Text>
              <Text style={styles.codeText}>ID: {cert.code}</Text>
            </View>

            <TouchableOpacity style={styles.downloadBtn}>
              <Feather name="download" size={14} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.downloadText}>Download PDF Certificate</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    padding: 6,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  listContainer: {
    gap: 16,
  },
  certCard: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 16,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#059669',
  },
  certTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  instructorText: {
    fontSize: 12,
    color: '#64748b',
  },
  infoBox: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    padding: 10,
    gap: 4,
  },
  infoText: {
    fontSize: 11,
    color: '#475569',
  },
  codeText: {
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  downloadBtn: {
    backgroundColor: '#7c3aed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 4,
  },
  downloadText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
