import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { fontInterRegular, fontInterSemiBold, fontInterBold, fontHeadingDisplay } from '../../lib/typography';
import { useRouter } from 'expo-router';

export default function AiChatScreen() {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'AI',
      text: 'Hello Alex! I am your 24/7 AI Code & System Design Tutor. How can I help you with your Java, Spring Boot, or React Native studies today?',
      time: '10:00 AM',
    },
    {
      id: '2',
      sender: 'USER',
      text: 'How does Resilience4j Circuit Breaker handle state transitions from CLOSED to OPEN?',
      time: '10:02 AM',
    },
    {
      id: '3',
      sender: 'AI',
      text: 'Resilience4j uses a sliding window (count-based or time-based) to track request outcomes.\n\n1. CLOSED: All requests pass through normally while calculating failure rate.\n2. OPEN: When failure rate exceeds threshold (e.g. 50%), circuit opens and immediately throws CallNotPermittedException.\n3. HALF-OPEN: After waitDurationInOpenState, it allows a limited number of test calls to check if downstream service recovered.',
      time: '10:02 AM',
    },
  ]);

  const quickPrompts = [
    'Explain Spring Security JWT',
    'Debug my code',
    'Generate MCQ Quiz',
    'What is Circuit Breaker?',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const messageText = textToSend || inputText;
    if (!messageText.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'USER',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const aiReply = {
        id: (Date.now() + 1).toString(),
        sender: 'AI',
        text: `Here is a detailed explanation for: "${messageText}"\n\nIn enterprise microservices, ensuring high availability and fault isolation is key. Let me know if you need code examples!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 800);
  };

  return (
    <KeyboardAvoidingView style={styles.mainWrapper} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>AI Assistant Tutor</Text>
          <Text style={styles.headerSubtitle}>24/7 AI Code Debugger & Prompt Tutor</Text>
        </View>
        <View style={styles.aiBadge}>
          <Feather name="cpu" size={14} color="#a78bfa" />
        </View>
      </View>

      {/* Messages Scroll Area */}
      <ScrollView contentContainerStyle={styles.messagesContainer} showsVerticalScrollIndicator={false}>
        {messages.map((msg) => (
          <View key={msg.id} style={[styles.msgRow, msg.sender === 'USER' ? styles.userRow : styles.aiRow]}>
            {msg.sender === 'AI' && (
              <View style={styles.aiAvatar}>
                <Feather name="cpu" size={14} color="#ffffff" />
              </View>
            )}

            <View style={[styles.msgBubble, msg.sender === 'USER' ? styles.userBubble : styles.aiBubble]}>
              <Text style={[styles.msgText, msg.sender === 'USER' ? styles.userMsgText : styles.aiMsgText]}>
                {msg.text}
              </Text>
              <Text style={[styles.msgTime, msg.sender === 'USER' ? styles.userTime : styles.aiTime]}>
                {msg.time}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Quick Prompts Bar */}
      <View style={styles.promptsBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quickPrompts.map((prompt) => (
            <TouchableOpacity
              key={prompt}
              style={styles.promptPill}
              onPress={() => handleSendMessage(prompt)}
            >
              <Feather name="zap" size={12} color="#7c3aed" style={{ marginRight: 4 }} />
              <Text style={styles.promptPillText}>{prompt}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Ask AI Tutor a question..."
          placeholderTextColor="#94a3b8"
          value={inputText}
          onChangeText={setInputText}
          style={styles.textInput}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={() => handleSendMessage()}>
          <Ionicons name="send" size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    fontFamily: fontHeadingDisplay,
    fontSize: 16,
    color: '#ffffff',
  },
  headerSubtitle: {
    fontFamily: fontInterRegular,
    fontSize: 11,
    color: '#a78bfa',
  },
  aiBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 20,
    gap: 14,
  },
  msgRow: {
    flexDirection: 'row',
    gap: 8,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  aiRow: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  msgBubble: {
    maxWidth: '80%',
    padding: 14,
    borderRadius: 12,
  },
  userBubble: {
    backgroundColor: '#7c3aed',
    borderBottomRightRadius: 2,
  },
  aiBubble: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderBottomLeftRadius: 2,
  },
  msgText: {
    fontFamily: fontInterRegular,
    fontSize: 13,
    lineHeight: 18,
  },
  userMsgText: {
    color: '#ffffff',
  },
  aiMsgText: {
    color: '#e2e8f0',
  },
  msgTime: {
    fontFamily: fontInterRegular,
    fontSize: 9,
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  userTime: {
    color: '#ddd6fe',
  },
  aiTime: {
    color: '#64748b',
  },
  promptsBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  promptPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#312e81',
    borderWidth: 1,
    borderColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  promptPillText: {
    fontFamily: fontInterBold,
    fontSize: 11,
    color: '#c7d2fe',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontFamily: fontInterRegular,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
