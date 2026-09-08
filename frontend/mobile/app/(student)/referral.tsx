import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MobileReferral() {
  const router = useRouter();
  const referralCode = 'REF-ELE-89A4B12C';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Referral Rewards Program</Text>
      </View>

      <View style={styles.banner}>
        <MaterialCommunityIcons name="gift-outline" size={32} color="#d97706" />
        <Text style={styles.bannerTitle}>Invite Friends & Earn +200 XP</Text>
        <Text style={styles.bannerSub}>Get +200 XP for every friend who registers with your unique code!</Text>
      </View>

      <View style={styles.codeCard}>
        <Text style={styles.codeLbl}>YOUR REFERRAL CODE</Text>
        <View style={styles.codeBox}>
          <Text style={styles.codeVal}>{referralCode}</Text>
          <TouchableOpacity style={styles.copyBtn}>
            <Feather name="copy" size={14} color="#ffffff" />
            <Text style={styles.copyText}>Copy Link</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>3</Text>
          <Text style={styles.statLbl}>Referrals Joined</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>+600 XP</Text>
          <Text style={styles.statLbl}>XP Rewards Earned</Text>
        </View>
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
  banner: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 16,
    gap: 8,
    marginBottom: 20,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  bannerSub: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
  codeCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 16,
    gap: 8,
    marginBottom: 20,
  },
  codeLbl: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b',
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f3e8ff',
    padding: 10,
    borderRadius: 6,
  },
  codeVal: {
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  copyBtn: {
    backgroundColor: '#7c3aed',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    gap: 4,
  },
  copyText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 16,
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    gap: 4,
  },
  statVal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  statLbl: {
    fontSize: 11,
    color: '#64748b',
  },
});
