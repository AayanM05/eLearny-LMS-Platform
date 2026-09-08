import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MobileAiChat() {
  const router = useRouter();
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
    {
      role: 'ai',
      text: 'Hi! I am your eLearny AI Tutor 🤖. Ask me any question about your courses, code debugging, or tech concepts!',
    },
  ]);

  const handleSend = () => {
    if (!inputMsg.trim() || loading) return;

    const userText = inputMsg;
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setInputMsg('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      let reply = 'I am your eLearny AI Tutor. What concept would you like to explore today?';
      const q = userText.toLowerCase();
      if (q.includes('spring') || q.includes('java')) {
        reply = 'Spring Boot 3 & Java 21 Tip:\n- Use @RestController for Spring Web endpoints.\n- Flyway manages database migrations seamlessly.';
      } else if (q.includes('react') || q.includes('next') || q.includes('expo')) {
        reply = 'React & Expo Tip:\n- Expo Router v3 provides fast, file-based mobile navigation for iOS & Android.';
      }
      setMessages((prev) => [...prev, { role: 'ai', text: reply }]);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>eLearny AI Tutor 🤖</Text>
      </View>

      <ScrollView contentContainerStyle={styles.chatScroll}>
        {messages.map((m, idx) => (
          <View
            key={idx}
            style={[styles.msgBubble, m.role === 'user' ? styles.userBubble : styles.aiBubble]}
          >
            <Text style={[styles.msgText, m.role === 'user' ? styles.userText : styles.aiText]}>
              {m.text}
            </Text>
          </View>
        ))}

        {loading && <Text style={styles.loadingText}>AI Tutor is thinking...</Text>}
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          value={inputMsg}
          onChangeText={setInputMsg}
          placeholder="Ask AI tutor a question..."
          placeholderTextColor="#94a3b8"
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={loading || !inputMsg.trim()}>
          <Ionicons name="send" size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
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
  chatScroll: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  msgBubble: {
    padding: 12,
    borderRadius: 8,
    maxWidth: '85%',
  },
  aiBubble: {
    backgroundColor: '#f1f5f9',
    alignSelf: 'flex-start',
  },
  userBubble: {
    backgroundColor: '#7c3aed',
    alignSelf: 'flex-end',
  },
  msgText: {
    fontSize: 13,
    lineHeight: 18,
  },
  aiText: {
    color: '#0f172a',
  },
  userText: {
    color: '#ffffff',
  },
  loadingText: {
    fontSize: 11,
    color: '#64748b',
    fontStyle: 'italic',
  },
  inputBar: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#0f172a',
  },
  sendBtn: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
});
