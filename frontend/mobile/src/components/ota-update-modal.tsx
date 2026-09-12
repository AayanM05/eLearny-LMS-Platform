import React, { useEffect, useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Image, 
  useColorScheme, 
  StatusBar 
} from 'react-native';
import * as Updates from 'expo-updates';

export function OTAUpdateModal() {
  const colorScheme = useColorScheme();
  const [isUpdateRequired, setIsUpdateRequired] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Checking for critical updates...');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFailed, setDownloadFailed] = useState(false);

  useEffect(() => {
    async function checkAndApplyUpdate() {
      try {
        if (Updates.isEnabled) {
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            setIsUpdateRequired(true);
            setIsDownloading(true);
            setStatusMessage('Downloading latest eLearny LMS update...');
            
            // Automatically fetch and reload
            await Updates.fetchUpdateAsync();
            setStatusMessage('Applying update & restarting app...');
            setTimeout(async () => {
              await Updates.reloadAsync();
            }, 1000);
          }
        }
      } catch (error) {
        console.log('[OTA Updates] Check error:', error);
        // If an update was detected but fetch failed
        if (isUpdateRequired) {
          setDownloadFailed(true);
          setStatusMessage('Network timeout. Please check your connection and retry.');
        }
      }
    }

    checkAndApplyUpdate();
  }, []);

  const handleManualRetry = async () => {
    setIsDownloading(true);
    setDownloadFailed(false);
    setStatusMessage('Downloading latest eLearny LMS update...');
    try {
      await Updates.fetchUpdateAsync();
      setStatusMessage('Applying update & restarting app...');
      await Updates.reloadAsync();
    } catch (e) {
      setIsDownloading(false);
      setDownloadFailed(true);
      setStatusMessage('Download failed. Tap below to retry.');
    }
  };

  if (!isUpdateRequired) return null;

  const isDark = colorScheme === 'dark';

  return (
    <Modal
      visible={isUpdateRequired}
      transparent={false}
      animationType="fade"
      hardwareAccelerated
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>
        {/* Branding Header Logo */}
        <Image
          source={
            isDark 
              ? require('../../assets/branding/logo-dark.png') 
              : require('../../assets/branding/logo-light.png')
          }
          style={styles.logoImage}
          resizeMode="contain"
        />

        {/* Update Card Container */}
        <View style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}>
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>MANDATORY UPDATE REQUIRED</Text>
          </View>

          <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>
            New Version Available
          </Text>

          <Text style={styles.subtitle}>
            A critical platform update is ready. You must apply this update to continue using eLearny LMS.
          </Text>

          {/* Loading Indicator or Retry */}
          <View style={styles.statusBox}>
            {isDownloading && (
              <ActivityIndicator color="#D96B43" size="large" style={styles.spinner} />
            )}
            <Text style={styles.statusText}>{statusMessage}</Text>
          </View>

          {downloadFailed && (
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={handleManualRetry}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>Retry & Reload App</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.footerNote}>
          eLearny LMS v2.0.0 • Over-The-Air Engine
        </Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  lightContainer: {
    backgroundColor: '#FAFAFA',
  },
  darkContainer: {
    backgroundColor: '#090D16',
  },
  logoImage: {
    height: 48,
    width: 200,
    marginBottom: 32,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  darkCard: {
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  badgePill: {
    backgroundColor: 'rgba(217, 107, 67, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(217, 107, 67, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: {
    color: '#D96B43',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  lightText: {
    color: '#0F172A',
  },
  darkText: {
    color: '#FFFFFF',
  },
  subtitle: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  statusBox: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingTop: 12,
    width: '100%',
  },
  spinner: {
    marginVertical: 4,
  },
  statusText: {
    color: '#D96B43',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#D96B43',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  footerNote: {
    position: 'absolute',
    bottom: 32,
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
});
