import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, ActivityIndicator, AppState, AppStateStatus, Platform } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { fontInterRegular, fontInterMedium, fontInterSemiBold, fontInterBold, fontHeadingDisplay, fontHeadingSemiBold } from '../lib/typography';

export default function UpdateCheckModal() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const appState = useRef(AppState.currentState);

  const checkAndPrepareUpdate = async () => {
    try {
      let Updates;
      try {
        Updates = require('expo-updates');
      } catch (e) {
        return;
      }

      if (!Updates || !Updates.isEnabled) return;

      const update = await Updates.checkForUpdateAsync();
      if (update && update.isAvailable) {
        setUpdateAvailable(true); // Lock app screen immediately with popup
        setIsDownloading(true);
        
        await Updates.fetchUpdateAsync();
        setIsDownloading(false);
      }
    } catch (e) {
      console.log('EAS Update Check Error:', e);
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    // 1. Initial check on mount
    checkAndPrepareUpdate();

    // 2. Poll every 10 seconds while app is active
    const interval = setInterval(() => {
      checkAndPrepareUpdate();
    }, 10000);

    // 3. Re-check whenever app returns to foreground
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        checkAndPrepareUpdate();
      }
      appState.current = nextAppState;
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);

  const handleApplyUpdate = async () => {
    setIsUpdating(true);
    try {
      const Updates = require('expo-updates');
      await Updates.reloadAsync();
    } catch (e) {
      setIsUpdating(false);
    }
  };

  if (!updateAvailable) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={updateAvailable}
      onRequestClose={() => {
        // Prevent closing modal via Android physical back button (Mandatory Update)
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.dialogCard}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="system-update" size={36} color="#7c3aed" />
          </View>

          <Text style={styles.title}>Mandatory Update Required ⚡</Text>
          <Text style={styles.subtitle}>
            A new update of eLearny LMS has been published. To continue using the app and access updated features, you must reload now.
          </Text>

          {isDownloading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color="#7c3aed" size="small" style={{ marginRight: 8 }} />
              <Text style={styles.loadingText}>Downloading latest update package...</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.updateBtn}
              onPress={handleApplyUpdate}
              disabled={isUpdating}
              activeOpacity={0.8}
            >
              {isUpdating ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Feather name="refresh-cw" size={18} color="#ffffff" style={{ marginRight: 8 }} />
                  <Text style={styles.updateBtnText}>Update & Reload Now</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          <Text style={styles.lockNotice}>
            🔒 App features are locked until update is applied.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dialogCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: fontHeadingDisplay,
    fontSize: 20,
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: fontInterRegular,
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
    justifyContent: 'center',
  },
  loadingText: {
    fontFamily: fontInterSemiBold,
    fontSize: 13,
    color: '#7c3aed',
  },
  updateBtn: {
    backgroundColor: '#7c3aed',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  updateBtnText: {
    fontFamily: fontInterBold,
    color: '#ffffff',
    fontSize: 15,
  },
  lockNotice: {
    fontFamily: fontInterRegular,
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 14,
    textAlign: 'center',
  },
});
