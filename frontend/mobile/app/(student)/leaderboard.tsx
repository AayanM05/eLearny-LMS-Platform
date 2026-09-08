import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MobileLeaderboard() {
  const router = useRouter();

  const leaders = [
    { rank: 1, name: 'Alex Rivera', xp: 4850, streak: 14, isUser: false },
    { rank: 2, name: 'Demo Student (You)', xp: 2450, streak: 7, isUser: true },
    { rank: 3, name: 'Sofia Patel', xp: 2100, streak: 5, isUser: false },
    { rank: 4, name: 'Marcus Vance', xp: 1890, streak: 4, isUser: false },
    { rank: 5, name: 'Elena Rostova', xp: 1650, streak: 3, isUser: false },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leaderboard & XP Stats</Text>
      </View>

      {/* User Stats Card */}
      <View style={styles.statsCard}>
        <View style={styles.statBox}>
          <Feather name="zap" size={20} color="#d97706" />
          <Text style={styles.statVal}>2,450 XP</Text>
          <Text style={styles.statLbl}>Total XP</Text>
        </View>

        <View style={styles.statBox}>
          <Feather name="flame" size={20} color="#dc2626" />
          <Text style={styles.statVal}>7 Days</Text>
          <Text style={styles.statLbl}>Daily Streak</Text>
        </View>

        <View style={styles.statBox}>
          <MaterialCommunityIcons name="trophy-outline" size={20} color="#7c3aed" />
          <Text style={styles.statVal}>#2</Text>
          <Text style={styles.statLbl}>Global Rank</Text>
        </View>
      </View>

      {/* Leaderboard Table */}
      <View style={styles.tableCard}>
        <Text style={styles.tableTitle}>Global Top 20</Text>

        <View style={styles.list}>
          {leaders.map((u) => (
            <View key={u.rank} style={[styles.row, u.isUser && styles.userRow]}>
              <View style={styles.leftCol}>
                <Text style={[styles.rankNum, u.rank <= 3 && styles.topRank]}>
                  #{u.rank}
                </Text>
                <Text style={styles.userName}>{u.name}</Text>
              </View>

              <View style={styles.rightCol}>
                <Text style={styles.xpText}>{u.xp} XP</Text>
              </View>
            </View>
          ))}
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
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 16,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
    gap: 4,
  },
  statVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  statLbl: {
    fontSize: 10,
    color: '#64748b',
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  tableTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  list: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#fafafa',
  },
  userRow: {
    backgroundColor: '#f3e8ff',
    borderWidth: 1,
    borderColor: '#7c3aed',
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rankNum: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
  },
  topRank: {
    color: '#d97706',
  },
  userName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  xpText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
});
