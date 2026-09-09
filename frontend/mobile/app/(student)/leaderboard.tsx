import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function LeaderboardScreen() {
  const router = useRouter();

  const top3 = [
    { rank: 2, name: 'Dr. Sarah J.', xp: '3,840 XP', avatar: 'S', color: '#94a3b8', crownColor: '#cbd5e1' },
    { rank: 1, name: 'Alex Rivera', xp: '4,520 XP', avatar: 'A', color: '#f59e0b', crownColor: '#fbbf24' },
    { rank: 3, name: 'Marcus Chen', xp: '3,110 XP', avatar: 'M', color: '#b45309', crownColor: '#d97706' },
  ];

  const rankings = [
    { rank: 4, name: 'Aayan M.', xp: '1,240 XP', streak: '5 Days', level: 'Lvl 8 Engineer', isCurrentUser: true },
    { rank: 5, name: 'Priya Sharma', xp: '1,180 XP', streak: '4 Days', level: 'Lvl 7 Developer', isCurrentUser: false },
    { rank: 6, name: 'Carlos Mendez', xp: '950 XP', streak: '3 Days', level: 'Lvl 6 Coder', isCurrentUser: false },
    { rank: 7, name: 'Elena Rostova', xp: '870 XP', streak: '2 Days', level: 'Lvl 5 Student', isCurrentUser: false },
  ];

  return (
    <View style={styles.mainWrapper}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Global Student Leaderboard</Text>
        <View style={styles.streakBadge}>
          <Ionicons name="flame" size={14} color="#f59e0b" />
          <Text style={styles.streakBadgeText}>5 Day Streak</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Top 3 Podium */}
        <View style={styles.podiumContainer}>
          {top3.map((user) => (
            <View key={user.rank} style={[styles.podiumCard, user.rank === 1 && styles.podiumCardFirst]}>
              <FontAwesome5 name="crown" size={20} color={user.crownColor} style={{ marginBottom: 4 }} />
              <View style={[styles.podiumAvatar, { borderColor: user.color }]}>
                <Text style={styles.podiumAvatarText}>{user.avatar}</Text>
              </View>
              <Text style={styles.podiumName}>{user.name}</Text>
              <Text style={styles.podiumXp}>{user.xp}</Text>
              <View style={[styles.rankTag, { backgroundColor: user.color }]}>
                <Text style={styles.rankTagText}>#{user.rank}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* User Rank Highlight Banner */}
        <View style={styles.userRankCard}>
          <View style={styles.userRankLeft}>
            <View style={styles.userRankBadge}>
              <Text style={styles.userRankBadgeText}>#4</Text>
            </View>
            <View>
              <Text style={styles.userRankName}>Your Current Rank</Text>
              <Text style={styles.userRankSub}>1,240 XP • 60 XP to #3 Rank</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.boostBtn} onPress={() => router.push('/(student)/referral')}>
            <Feather name="zap" size={14} color="#7c3aed" style={{ marginRight: 4 }} />
            <Text style={styles.boostBtnText}>Boost XP</Text>
          </TouchableOpacity>
        </View>

        {/* Full Rankings Table List */}
        <Text style={styles.sectionTitle}>Weekly Rankings</Text>
        <View style={styles.rankingsList}>
          {rankings.map((item) => (
            <View key={item.rank} style={[styles.rankItem, item.isCurrentUser && styles.rankItemCurrent]}>
              <Text style={styles.itemRankText}>#{item.rank}</Text>
              <View style={styles.itemAvatar}>
                <Text style={styles.itemAvatarText}>{item.name.charAt(0)}</Text>
              </View>

              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.itemName}>{item.name} {item.isCurrentUser && '(You)'}</Text>
                <Text style={styles.itemLevel}>{item.level}</Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.itemXp}>{item.xp}</Text>
                <View style={styles.streakRow}>
                  <Ionicons name="flame" size={12} color="#dc2626" />
                  <Text style={styles.itemStreak}>{item.streak}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  streakBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 60,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 20,
    marginTop: 10,
  },
  podiumCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  podiumCardFirst: {
    backgroundColor: '#312e81',
    borderColor: '#6366f1',
    transform: [{ translateY: -10 }],
    paddingVertical: 16,
  },
  podiumAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: 6,
  },
  podiumAvatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  podiumName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  podiumXp: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
    marginBottom: 6,
  },
  rankTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  rankTagText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userRankCard: {
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userRankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userRankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userRankBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  userRankName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userRankSub: {
    fontSize: 11,
    color: '#ddd6fe',
  },
  boostBtn: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  boostBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  rankingsList: {
    gap: 10,
  },
  rankItem: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  rankItemCurrent: {
    borderColor: '#7c3aed',
    backgroundColor: '#2e1065',
  },
  itemRankText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#94a3b8',
    width: 28,
  },
  itemAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemAvatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  itemLevel: {
    fontSize: 10,
    color: '#94a3b8',
  },
  itemXp: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#34d399',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemStreak: {
    fontSize: 10,
    color: '#f8fafc',
  },
});
