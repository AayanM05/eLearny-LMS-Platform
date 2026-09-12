import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as Updates from 'expo-updates';

export function OTAUpdateBanner() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    async function checkUpdates() {
      if (__DEV__) return; // Skip in dev mode
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          setUpdateAvailable(true);
        }
      } catch (e) {
        // Quiet fallback if offline or no update channel
      }
    }
    checkUpdates();
  }, []);

  const handleApplyUpdate = async () => {
    setIsDownloading(true);
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (e) {
      setIsDownloading(false);
      setUpdateAvailable(false);
    }
  };

  if (!updateAvailable) return null;

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.contentRow}>
        <View style={styles.textColumn}>
          <Text style={styles.title}>🚀 New App Update Available</Text>
          <Text style={styles.subtitle}>Instant OTA Update ready to install.</Text>
        </View>
        <TouchableOpacity 
          style={styles.updateBtn}
          onPress={handleApplyUpdate}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.updateBtnText}>Update Now</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#D96B43',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#D96B43',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textColumn: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  subtitle: {
    color: '#FFEDD5',
    fontSize: 12,
    marginTop: 2,
  },
  updateBtn: {
    backgroundColor: '#020617',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  updateBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
