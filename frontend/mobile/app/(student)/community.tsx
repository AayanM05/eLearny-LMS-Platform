import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Feather, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CommunityScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All Discussions');

  const categories = ['All Discussions', 'Spring Boot', 'Judge0 Sandbox', 'Certificates', 'React Native'];

  const threads = [
    {
      id: '1',
      title: 'How to configure Resilience4j Circuit Breaker with Spring Boot 3.2 WebFlux?',
      author: 'Aayan M.',
      authorRole: 'Student',
      time: '2 hours ago',
      category: 'Spring Boot',
      votes: 14,
      replies: 5,
      hasAcceptedAnswer: true,
      snippet: 'I am getting a timeout exception when configuring fallbackMethod. Here is my application.yml settings...',
    },
    {
      id: '2',
      title: 'Judge0 Sandbox return code 139 (Segmentation Fault) in C++20 problem #142',
      author: 'Marcus Chen',
      authorRole: 'Student',
      time: '5 hours ago',
      category: 'Judge0 Sandbox',
      votes: 9,
      replies: 3,
      hasAcceptedAnswer: false,
      snippet: 'Memory limit is exceeded when initializing large vector. Is there a custom memory flag needed?',
    },
  ];

  return (
    <View style={styles.mainWrapper}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Q&A Community Forum</Text>
        <TouchableOpacity style={styles.askBtn}>
          <Feather name="plus" size={16} color="#ffffff" />
          <Text style={styles.askBtnText}>Ask</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Search & Stats Banner */}
        <View style={styles.searchBanner}>
          <View style={styles.searchRow}>
            <Feather name="search" size={16} color="#64748b" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search 450+ technical questions & answers..."
              placeholderTextColor="#94a3b8"
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* Categories Horizontal Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.catChipText, activeCategory === cat && styles.catChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Discussion Threads */}
        <Text style={styles.sectionTitle}>Active Threads ({threads.length})</Text>

        <View style={styles.threadsList}>
          {threads.map((thread) => (
            <View key={thread.id} style={styles.threadCard}>
              <View style={styles.threadHeader}>
                <View style={styles.authorRow}>
                  <View style={styles.authorAvatar}>
                    <Text style={styles.authorAvatarText}>{thread.author.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={styles.authorName}>{thread.author}</Text>
                    <Text style={styles.threadTime}>{thread.time} • in {thread.category}</Text>
                  </View>
                </View>

                {thread.hasAcceptedAnswer && (
                  <View style={styles.acceptedBadge}>
                    <Feather name="check" size={10} color="#059669" />
                    <Text style={styles.acceptedBadgeText}>Resolved</Text>
                  </View>
                )}
              </View>

              <Text style={styles.threadTitle}>{thread.title}</Text>
              <Text style={styles.threadSnippet}>{thread.snippet}</Text>

              <View style={styles.threadFooter}>
                <View style={styles.footerMetrics}>
                  <View style={styles.metricItem}>
                    <Octicons name="thumbsup" size={14} color="#64748b" />
                    <Text style={styles.metricText}>{thread.votes} Upvotes</Text>
                  </View>

                  <View style={styles.metricItem}>
                    <Feather name="message-square" size={14} color="#64748b" />
                    <Text style={styles.metricText}>{thread.replies} Replies</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.replyBtn}>
                  <Text style={styles.replyBtnText}>View Thread</Text>
                </TouchableOpacity>
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
  askBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7c3aed',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  askBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 60,
  },
  searchBanner: {
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginRight: 8,
  },
  catChipActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  catChipTextActive: {
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  threadsList: {
    gap: 14,
  },
  threadCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  threadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  authorAvatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  authorName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  threadTime: {
    fontSize: 10,
    color: '#64748b',
  },
  acceptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  acceptedBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#059669',
  },
  threadTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 6,
    lineHeight: 20,
  },
  threadSnippet: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
    marginBottom: 14,
  },
  threadFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  footerMetrics: {
    flexDirection: 'row',
    gap: 14,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 11,
    color: '#64748b',
  },
  replyBtn: {
    backgroundColor: '#f5f3ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  replyBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
});
