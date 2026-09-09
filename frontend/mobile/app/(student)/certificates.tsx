import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CertificatesScreen() {
  const router = useRouter();
  const [selectedCert, setSelectedCert] = useState<any | null>(null);

  const certificates = [
    {
      id: 'CERT-ELE-8921-X1',
      title: 'Spring Boot 3.2 Microservices & Distributed Security',
      issuedDate: 'September 5, 2026',
      instructor: 'Dr. Sarah Jenkins',
      badgeColor: '#f59e0b',
      verified: true,
      grade: '98% Score (Honors)',
    },
    {
      id: 'CERT-ELE-4102-Y9',
      title: 'Next.js 14 App Router & Full Stack Architecture',
      issuedDate: 'August 28, 2026',
      instructor: 'Alex Rivera',
      badgeColor: '#7c3aed',
      verified: true,
      grade: '95% Score',
    },
  ];

  return (
    <View style={styles.mainWrapper}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verifiable Certificates</Text>
        <View style={styles.verifiedChip}>
          <Feather name="check-circle" size={12} color="#059669" />
          <Text style={styles.verifiedChipText}>QR Verifiable</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.heroBanner}>
          <FontAwesome5 name="award" size={32} color="#f59e0b" style={{ marginBottom: 12 }} />
          <Text style={styles.heroTitle}>Earn Production-Grade PDF Certificates</Text>
          <Text style={styles.heroSubtitle}>
            Issued upon 100% course completion and passing proctored exams. Includes cryptographically signed QR verification.
          </Text>
        </View>

        {/* Certificate Cards */}
        <Text style={styles.sectionTitle}>Your Credentials ({certificates.length})</Text>

        {certificates.map((cert) => (
          <View key={cert.id} style={styles.certCard}>
            <View style={styles.certHeader}>
              <View style={styles.badgeCircle}>
                <MaterialCommunityIcons name="certificate" size={24} color={cert.badgeColor} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.certId}>{cert.id}</Text>
                <Text style={styles.certTitle}>{cert.title}</Text>
              </View>
            </View>

            <View style={styles.certDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Issued To:</Text>
                <Text style={styles.detailValue}>Alex Rivera</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Issued Date:</Text>
                <Text style={styles.detailValue}>{cert.issuedDate}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Instructor:</Text>
                <Text style={styles.detailValue}>{cert.instructor}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Grade Result:</Text>
                <Text style={[styles.detailValue, { color: '#059669', fontWeight: 'bold' }]}>{cert.grade}</Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.verifyBtn}
                onPress={() => setSelectedCert(cert)}
              >
                <MaterialCommunityIcons name="qrcode" size={14} color="#7c3aed" style={{ marginRight: 6 }} />
                <Text style={styles.verifyBtnText}>Verify QR Code</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.downloadBtn}>
                <Feather name="download" size={14} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.downloadBtnText}>PDF Download</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* QR Verification Modal */}
      {selectedCert && (
        <Modal transparent animationType="fade" visible={!!selectedCert}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Cryptographic QR Verification</Text>
              <Text style={styles.modalSubtitle}>Certificate ID: {selectedCert.id}</Text>

              <View style={styles.qrPreviewBox}>
                <MaterialCommunityIcons name="qrcode-scan" size={120} color="#0f172a" />
                <Text style={styles.qrUrl}>https://elearny.com/api/v1/certificates/verify/{selectedCert.id}</Text>
              </View>

              <View style={styles.statusBox}>
                <Feather name="check-circle" size={16} color="#059669" />
                <Text style={styles.statusText}>Cryptographically Verified by PDFBox 3.0.2</Text>
              </View>

              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedCert(null)}>
                <Text style={styles.closeBtnText}>Close Verification</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  verifiedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  verifiedChipText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#059669',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 60,
  },
  heroBanner: {
    backgroundColor: '#1e1b4b',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#c7d2fe',
    textAlign: 'center',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 14,
  },
  certCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 18,
    marginBottom: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  certHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  badgeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fffbeb',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  certId: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  certTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 2,
  },
  certDetails: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    gap: 6,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  verifyBtn: {
    flex: 1,
    backgroundColor: '#f5f3ff',
    borderWidth: 1,
    borderColor: '#ddd6fe',
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  downloadBtn: {
    flex: 1,
    backgroundColor: '#7c3aed',
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 20,
  },
  qrPreviewBox: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
    width: '100%',
  },
  qrUrl: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 10,
    textAlign: 'center',
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#059669',
  },
  closeBtn: {
    backgroundColor: '#0f172a',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
