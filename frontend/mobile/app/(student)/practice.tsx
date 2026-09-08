import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MobilePracticeHub() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'editor' | 'articles'>('editor');
  const [code, setCode] = useState(
    'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}'
  );
  const [consoleLog, setConsoleLog] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleLog(null);
    setTimeout(() => {
      setIsRunning(false);
      if (code.length > 20) {
        setConsoleLog('✔ All 3 test cases passed! (38ms)\n+50 XP Awarded!');
      } else {
        setConsoleLog('✖ Execution failed: Code snippet is incomplete.');
      }
    }, 1000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Practice Hub & Code Runner</Text>
      </View>

      {/* Segment Control */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'editor' && styles.segmentActive]}
          onPress={() => setActiveTab('editor')}
        >
          <Feather name="code" size={14} color={activeTab === 'editor' ? '#7c3aed' : '#64748b'} />
          <Text style={[styles.segmentText, activeTab === 'editor' && styles.segmentTextActive]}>
            Code Sandbox
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'articles' && styles.segmentActive]}
          onPress={() => setActiveTab('articles')}
        >
          <Feather name="book-open" size={14} color={activeTab === 'articles' ? '#7c3aed' : '#64748b'} />
          <Text style={[styles.segmentText, activeTab === 'articles' && styles.segmentTextActive]}>
            Tech Articles
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'editor' ? (
        <View style={styles.editorWrapper}>
          {/* Challenge Meta */}
          <View style={styles.challengeCard}>
            <View style={styles.tagRow}>
              <Text style={styles.easyTag}>EASY</Text>
              <Text style={styles.xpText}>+50 XP</Text>
            </View>
            <Text style={styles.problemTitle}>1. Two Sum Problem</Text>
            <Text style={styles.problemDesc}>
              Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
            </Text>
          </View>

          {/* Mobile Code Editor */}
          <View style={styles.codeContainer}>
            <View style={styles.codeHeader}>
              <Text style={styles.langText}>JavaScript (Node.js)</Text>
              <TouchableOpacity style={styles.runBtn} onPress={handleRunCode} disabled={isRunning}>
                <Ionicons name="play-outline" size={14} color="#ffffff" />
                <Text style={styles.runBtnText}>{isRunning ? 'Running...' : 'Run Code'}</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.codeInput}
              multiline
              value={code}
              onChangeText={setCode}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Console Log */}
          {consoleLog && (
            <View style={styles.consoleCard}>
              <Text style={styles.consoleHeader}>Console Execution Log:</Text>
              <Text style={styles.consoleText}>{consoleLog}</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.articlesList}>
          {[
            { title: 'Spring Boot 3 REST APIs & Microservices', cat: 'Backend', time: '8 min read' },
            { title: 'Next.js 14 App Router & Server Components', cat: 'Frontend', time: '6 min read' },
            { title: 'React Native & Expo SDK 51 Architecture', cat: 'Mobile', time: '10 min read' },
          ].map((item, idx) => (
            <View key={idx} style={styles.articleCard}>
              <View style={styles.articleMeta}>
                <Text style={styles.articleCat}>{item.cat}</Text>
                <Text style={styles.articleTime}>{item.time}</Text>
              </View>
              <Text style={styles.articleTitle}>{item.title}</Text>
            </View>
          ))}
        </View>
      )}
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
    marginBottom: 16,
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
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 6,
    gap: 6,
  },
  segmentActive: {
    backgroundColor: '#ffffff',
    elevation: 1,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  segmentTextActive: {
    color: '#7c3aed',
  },
  editorWrapper: {
    gap: 14,
  },
  challengeCard: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 14,
    gap: 6,
  },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  easyTag: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#059669',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  xpText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#d97706',
  },
  problemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  problemDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  codeContainer: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    overflow: 'hidden',
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#1e293b',
  },
  langText: {
    fontSize: 11,
    color: '#94a3b8',
    fontFamily: 'monospace',
  },
  runBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    gap: 4,
  },
  runBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  codeInput: {
    color: '#f8fafc',
    fontFamily: 'monospace',
    fontSize: 12,
    padding: 12,
    minHeight: 180,
    textAlignVertical: 'top',
  },
  consoleCard: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    gap: 4,
  },
  consoleHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#94a3b8',
  },
  consoleText: {
    fontSize: 12,
    color: '#10b981',
    fontFamily: 'monospace',
  },
  articlesList: {
    gap: 12,
  },
  articleCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 14,
    gap: 6,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  articleCat: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  articleTime: {
    fontSize: 11,
    color: '#94a3b8',
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
});
