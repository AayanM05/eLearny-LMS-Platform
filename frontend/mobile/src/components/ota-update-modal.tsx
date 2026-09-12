import React, { useEffect, useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Image, 
  StatusBar 
} from 'react-native';
import * as Updates from 'expo-updates';

interface OTAUpdateModalProps {
  theme?: 'light' | 'dark';
}

export function OTAUpdateModal({ theme = 'light' }: OTAUpdateModalProps) {
  const isDark = theme === 'dark';

  const [isUpdateRequired, setIsUpdateRequired] = useState(false);
  const [statusMessage, setStatusMessage] = useState('A new critical update is ready for installation.');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFailed, setDownloadFailed] = useState(false);

  useEffect(() => {
    async function checkUpdateStatus() {
      try {
        console.log('[OTA Updates] Engine checking for updates...');
        console.log('[OTA Updates] Updates enabled:', Updates.isEnabled);

        if (Updates.isEnabled) {
          const update = await Updates.checkForUpdateAsync();
          console.log('[OTA Updates] Check result isAvailable:', update.isAvailable);
          if (update.isAvailable) {
            setIsUpdateRequired(true);
            setIsDownloading(false);
            setDownloadFailed(false);
            setStatusMessage('A critical platform update (v2.0.0) is available with performance & UI improvements.');
          }
        } else if (__DEV__) {
          console.log('[OTA Updates] Running in __DEV__ mode.');
        }
      } catch (error) {
        console.log('[OTA Updates] Check error:', error);
      }
    }

    checkUpdateStatus();
  }, []);

  const handleStartUpdate = async () => {
    setIsDownloading(true);
    setDownloadFailed(false);
    setStatusMessage('Downloading latest eLearny LMS update bundle...');

    try {
      await Updates.fetchUpdateAsync();
      setStatusMessage('Applying update & restarting application...');
      setTimeout(async () => {
        await Updates.reloadAsync();
      }, 1000);
    } catch (e) {
      console.log('[OTA Updates] Fetch error:', e);
      setIsDownloading(false);
      setDownloadFailed(true);
      setStatusMessage('Download failed due to network interruption. Tap below to retry.');
    }
  };

  if (!isUpdateRequired) return null;

  return (
    <Modal
      visible={isUpdateRequired}
      transparent={false}
      animationType="fade"
      hardwareAccelerated
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>
        {/* Horizontal Branding Header Logo */}
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
            <Text style={styles.badgeText}>MANDATORY UPDATE AVAILABLE</Text>
          </View>

          <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>
            Platform Update v2.0.0
          </Text>

          <Text style={[styles.subtitle, isDark ? styles.darkSubtext : styles.lightSubtext]}>
            {statusMessage}
          </Text>

          {/* Downloading Spinner or Interactive Button */}
          {isDownloading ? (
            <View style={styles.statusBox}>
              <ActivityIndicator color="#D96B43" size="large" style={styles.spinner} />
              <Text style={styles.statusText}>Downloading Update Bundle...</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleStartUpdate}
              activeOpacity={0.85}
            >
              <Text style={styles.actionButtonText}>
                {downloadFailed ? 'Retry Download & Install' : '🚀 Download & Install Update'}
              </Text>
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
    gap: 14,
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
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontFamily: 'SpaceGrotesk_700Bold',
    textAlign: 'center',
  },
  lightText: {
    color: '#0F172A',
  },
  darkText: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
  lightSubtext: {
    color: '#64748B',
  },
  darkSubtext: {
    color: '#94A3B8',
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
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#D96B43',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#D96B43',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  footerNote: {
    position: 'absolute',
    bottom: 32,
    color: '#94A3B8',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
});
