import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MobileCommunity() {
  const router = useRouter();
  const [questions, setQuestions] = useState([
    {
      id: '1',
      author: 'Alex Rivera',
      title: 'How to handle JWT token refresh in Spring Security 6 & Next.js?',
      replies: 4,
      solved: true,
    },
    {
      id: '2',
      author: 'Sophia Chen',
      title: 'Best strategy for state management in Expo SDK 51 React Native app?',
      replies: 2,
      solved: false,
    },
  ]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Q&A Community Forum</Text>
      </View>

      <View style={styles.listContainer}>
        {questions.map((q) => (
          <View key={q.id} style={styles.qCard}>
            <View style={styles.qHeader}>
              <Text style={styles.authorText}>{q.author}</Text>
              {q.solved && (
                <View style={styles.solvedBadge}>
                  <Ionicons name="checkmark-circle" size={12} color="#059669" />
                  <Text style={styles.solvedText}>Solved</Text>
                </View>
              )}
            </View>

            <Text style={styles.qTitle}>{q.title}</Text>

            <View style={styles.qFooter}>
              <View style={styles.replyCount}>
                <Feather name="message-square" size={12} color="#64748b" />
                <Text style={styles.replyText}>{q.replies} Replies</Text>
              </View>
            </View>
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
    gap: 12,
  },
  qCard: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 14,
    gap: 8,
  },
  qHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  solvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  solvedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#059669',
  },
  qTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    lineHeight: 20,
  },
  qFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  replyCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  replyText: {
    fontSize: 11,
    color: '#64748b',
  },
});
