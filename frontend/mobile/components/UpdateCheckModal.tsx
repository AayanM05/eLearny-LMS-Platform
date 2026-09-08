import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';

export default function UpdateCheckModal() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newVersionLabel, setNewVersionLabel] = useState('v1.0.1');

  useEffect(() => {
    async function checkForUpdates() {
      try {
        // Safe check for expo-updates in production build
        const Updates = require('expo-updates');
        if (__DEV__) return; // Skip automatic popup during active local Expo development

        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          setUpdateAvailable(true);
        }
      } catch (e) {
        // Ignored in dev client or offline mode
      }
    }

    checkForUpdates();
  }, []);

  const handleApplyUpdate = async () => {
    setIsUpdating(true);
    try {
      const Updates = require('expo-updates');
      await Updates.reloadAsync();
    } catch (e) {
      setIsUpdating(false);
      setUpdateAvailable(false);
    }
  };

  if (!updateAvailable) return null;

  return (
    <Modal transparent animationType="fade" visible={updateAvailable}>
      <View style={styles.overlay}>
        <View style={styles.dialogCard}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="system-update" size={32} color="#7c3aed" />
          </View>

          <Text style={styles.title}>New Version Available 🚀</Text>
          <Text style={styles.subtitle}>
            A new version of eLearny LMS ({newVersionLabel}) has been downloaded. Tap below to reload and apply the update.
          </Text>

          <TouchableOpacity
            style={styles.updateBtn}
            onPress={handleApplyUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <>
                <Feather name="refresh-cw" size={16} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.updateBtnText}>Update & Reload Now</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  dialogCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  updateBtn: {
    backgroundColor: '#7c3aed',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
