import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  TextInput, 
  Alert 
} from 'react-native';

export default function MobileAvailabilityScreen() {
  const [tab, setTab] = useState<'LIVE' | 'LEAVE' | 'TA'>('LIVE');
  const [title, setTitle] = useState('');
  const [leaveStart, setLeaveStart] = useState('');
  const [taEmail, setTaEmail] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Academic Controls</Text>
      <Text style={styles.headerSub}>Manage blackout ranges, live class slots & TA delegation.</Text>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity 
          style={[styles.tabBtn, tab === 'LIVE' && styles.activeTab]}
          onPress={() => setTab('LIVE')}
        >
          <Text style={[styles.tabText, tab === 'LIVE' && styles.activeTabText]}>Live Slots</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabBtn, tab === 'LEAVE' && styles.activeTab]}
          onPress={() => setTab('LEAVE')}
        >
          <Text style={[styles.tabText, tab === 'LEAVE' && styles.activeTabText]}>Blackouts</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabBtn, tab === 'TA' && styles.activeTab]}
          onPress={() => setTab('TA')}
        >
          <Text style={[styles.tabText, tab === 'TA' && styles.activeTabText]}>TA Delegation</Text>
        </TouchableOpacity>
      </View>

      {tab === 'LIVE' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create Live Office Hour / 1-on-1</Text>
          <TextInput
            style={styles.input}
            placeholder="Session Title (e.g. System Design Review)"
            placeholderTextColor="#64748B"
            value={title}
            onChangeText={setTitle}
          />
          <TouchableOpacity 
            style={styles.primaryBtn}
            onPress={() => {
              Alert.alert('Slot Created', 'New live session slot published.');
              setTitle('');
            }}
          >
            <Text style={styles.btnText}>Publish Slot</Text>
          </TouchableOpacity>
        </View>
      )}

      {tab === 'LEAVE' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Record Blackout Date Range</Text>
          <TextInput
            style={styles.input}
            placeholder="Start Date (YYYY-MM-DD)"
            placeholderTextColor="#64748B"
            value={leaveStart}
            onChangeText={setLeaveStart}
          />
          <TouchableOpacity 
            style={styles.primaryBtn}
            onPress={() => {
              Alert.alert('Blackout Recorded', 'Blackout date range saved.');
              setLeaveStart('');
            }}
          >
            <Text style={styles.btnText}>Save Blackout Range</Text>
          </TouchableOpacity>
        </View>
      )}

      {tab === 'TA' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Invite Teaching Assistant</Text>
          <TextInput
            style={styles.input}
            placeholder="TA Email (e.g. assistant@elearny.com)"
            placeholderTextColor="#64748B"
            value={taEmail}
            onChangeText={setTaEmail}
          />
          <TouchableOpacity 
            style={styles.primaryBtn}
            onPress={() => {
              Alert.alert('Invitation Sent', 'TA invite token sent to ' + taEmail);
              setTaEmail('');
            }}
          >
            <Text style={styles.btnText}>Send TA Invitation</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },
  headerSub: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 20,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#D96B43',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 14,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
  },
  primaryBtn: {
    backgroundColor: '#D96B43',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
