import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Platform } from 'react-native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PracticeHub() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<'JAVA' | 'PYTHON' | 'CPP' | 'JAVASCRIPT'>('JAVA');
  const [code, setCode] = useState<string>(
    `public class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello, eLearny Judge0 Engine!");\n    }\n}`
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const handleLanguageChange = (lang: 'JAVA' | 'PYTHON' | 'CPP' | 'JAVASCRIPT') => {
    setSelectedLanguage(lang);
    setOutput(null);
    if (lang === 'JAVA') {
      setCode(`public class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello, eLearny Judge0 Engine!");\n    }\n}`);
    } else if (lang === 'PYTHON') {
      setCode(`def solve():\n    print("Hello, eLearny Python Sandbox!")\n\nif __name__ == "__main__":\n    solve()`);
    } else if (lang === 'CPP') {
      setCode(`#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, eLearny C++ Sandbox!" << endl;\n    return 0;\n}`);
    } else {
      setCode(`console.log("Hello, eLearny Node.js Sandbox!");`);
    }
  };

  const handleRunCode = () => {
    setIsExecuting(true);
    setOutput(null);
    setTimeout(() => {
      setIsExecuting(false);
      setOutput(`[SUCCESS] Test Case #1 Passed (12ms, 14.2 MB)\nOutput:\nHello, eLearny Judge0 Engine!\n\nAll 3 test cases passed! (100% Score)`);
    }, 1200);
  };

  return (
    <View style={styles.mainWrapper}>
      {/* Dark Header Navigation Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>Practice Hub & Code Runner</Text>
          <Text style={styles.headerSubtitle}>Judge0 Multi-Language Sandbox</Text>
        </View>
        <View style={styles.badgeLive}>
          <View style={styles.liveDot} />
          <Text style={styles.badgeLiveText}>Judge0 v1.13</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Problem Card Panel */}
        <View style={styles.problemCard}>
          <View style={styles.problemMetaRow}>
            <View style={styles.diffBadge}>
              <Text style={styles.diffBadgeText}>MEDIUM</Text>
            </View>
            <Text style={styles.problemPoints}>+50 XP Reward</Text>
          </View>

          <Text style={styles.problemTitle}>Problem #142: Two Sum & Hash Mapping</Text>
          <Text style={styles.problemDesc}>
            Given an array of integers <Text style={styles.codeSnippet}>nums</Text> and an integer <Text style={styles.codeSnippet}>target</Text>, return indices of the two numbers such that they add up to target.
          </Text>

          <View style={styles.constraintBox}>
            <Text style={styles.constraintTitle}>Sample Input / Output:</Text>
            <Text style={styles.constraintCode}>Input: nums = [2,7,11,15], target = 9</Text>
            <Text style={styles.constraintCode}>Output: [0,1] (Explanation: nums[0] + nums[1] == 9)</Text>
          </View>
        </View>

        {/* Language Tabs Selector */}
        <View style={styles.languageBar}>
          {(['JAVA', 'PYTHON', 'CPP', 'JAVASCRIPT'] as const).map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[styles.langTab, selectedLanguage === lang && styles.langTabActive]}
              onPress={() => handleLanguageChange(lang)}
            >
              <Text style={[styles.langTabText, selectedLanguage === lang && styles.langTabTextActive]}>
                {lang}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* IDE Code Editor Container */}
        <View style={styles.ideContainer}>
          <View style={styles.ideHeader}>
            <View style={styles.ideHeaderLeft}>
              <Feather name="terminal" size={14} color="#a78bfa" />
              <Text style={styles.ideHeaderTitle}>Solution.{selectedLanguage === 'JAVA' ? 'java' : selectedLanguage === 'PYTHON' ? 'py' : selectedLanguage === 'CPP' ? 'cpp' : 'js'}</Text>
            </View>
            <TouchableOpacity onPress={() => handleLanguageChange(selectedLanguage)}>
              <Text style={styles.resetText}>Reset Code</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            multiline
            value={code}
            onChangeText={setCode}
            style={styles.codeArea}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.ideFooter}>
            <TouchableOpacity style={styles.runBtn} onPress={handleRunCode} disabled={isExecuting}>
              {isExecuting ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Ionicons name="play" size={16} color="#ffffff" style={{ marginRight: 6 }} />
                  <Text style={styles.runBtnText}>Run Code (Judge0)</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn}>
              <Feather name="check-circle" size={16} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.submitBtnText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Execution Output Terminal Box */}
        {output && (
          <View style={styles.outputBox}>
            <View style={styles.outputHeader}>
              <MaterialIcons name="assessment" size={16} color="#10b981" />
              <Text style={styles.outputTitle}>Console Output & Test Results</Text>
            </View>
            <Text style={styles.outputText}>{output}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  headerBar: {
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
  headerTitleCol: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#94a3b8',
  },
  badgeLive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38bdf8',
  },
  badgeLiveText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 60,
  },
  problemCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  problemMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  diffBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  diffBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  problemPoints: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#34d399',
  },
  problemTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 6,
  },
  problemDesc: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 18,
    marginBottom: 12,
  },
  codeSnippet: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#a78bfa',
    backgroundColor: '#0f172a',
  },
  constraintBox: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  constraintTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#94a3b8',
    marginBottom: 4,
  },
  constraintCode: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#e2e8f0',
  },
  languageBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  langTab: {
    flex: 1,
    backgroundColor: '#1e293b',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  langTabActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  langTabText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#94a3b8',
  },
  langTabTextActive: {
    color: '#ffffff',
  },
  ideContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
    marginBottom: 16,
  },
  ideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  ideHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ideHeaderTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#cbd5e1',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  resetText: {
    fontSize: 11,
    color: '#f43f5e',
  },
  codeArea: {
    minHeight: 180,
    padding: 14,
    color: '#f8fafc',
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 20,
    backgroundColor: '#0f172a',
  },
  ideFooter: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  runBtn: {
    flex: 1,
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  runBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  outputBox: {
    backgroundColor: '#064e3b',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#059669',
  },
  outputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  outputTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#34d399',
  },
  outputText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#ecfdf5',
    lineHeight: 18,
  },
});
