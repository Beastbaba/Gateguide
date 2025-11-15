import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../../components/GlassCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OCRScreen() {
  const insets = useSafeAreaInsets();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCapture = () => {
    // Mock camera capture
    setIsProcessing(true);
    setTimeout(() => {
      setCapturedImage('https://via.placeholder.com/400x300?text=Airport+Sign');
      setExtractedText('Gate B14\nDepartures\nBaggage Claim');
      setTranslatedText('Puerta B14\nSalidas\nRecogida de Equipaje');
      setIsProcessing(false);
    }, 1500);
  };

  const handleReset = () => {
    setCapturedImage(null);
    setExtractedText('');
    setTranslatedText('');
  };

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b', '#334155']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView
        style={{ paddingTop: insets.top }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Sign Translator</Text>
          <Text style={styles.subtitle}>Point camera at airport signs</Text>
        </View>

        {/* Camera Preview / Result */}
        <GlassCard style={styles.cameraCard}>
          {!capturedImage ? (
            <View style={styles.cameraPlaceholder}>
              <Ionicons name="camera" size={64} color="#6366f1" />
              <Text style={styles.placeholderText}>
                Camera preview will appear here
              </Text>
              <Text style={styles.placeholderSubtext}>
                Tap the button below to capture
              </Text>
            </View>
          ) : (
            <View>
              <Image
                source={{ uri: capturedImage }}
                style={styles.capturedImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleReset}
              >
                <Ionicons name="close-circle" size={32} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </GlassCard>

        {/* Capture Button */}
        {!capturedImage && (
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleCapture}
            disabled={isProcessing}
          >
            <LinearGradient
              colors={['#14b8a6', '#06b6d4']}
              style={styles.captureGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {isProcessing ? (
                <Text style={styles.captureText}>Processing...</Text>
              ) : (
                <>
                  <Ionicons name="camera" size={32} color="white" />
                  <Text style={styles.captureText}>Capture Sign</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Extracted Text */}
        {extractedText && (
          <GlassCard style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Ionicons name="text" size={24} color="#6366f1" />
              <Text style={styles.resultLabel}>Extracted Text:</Text>
            </View>
            <Text style={styles.resultText}>{extractedText}</Text>
          </GlassCard>
        )}

        {/* Translated Text */}
        {translatedText && (
          <GlassCard style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Ionicons name="language" size={24} color="#ec4899" />
              <Text style={styles.resultLabel}>Translation:</Text>
            </View>
            <Text style={styles.resultText}>{translatedText}</Text>
          </GlassCard>
        )}

        {/* Info Card */}
        <GlassCard style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#14b8a6" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>How to use:</Text>
            <Text style={styles.infoText}>
              1. Point your camera at any airport sign{'\n'}
              2. Tap "Capture Sign" button{'\n'}
              3. Get instant translation in your language
            </Text>
          </View>
        </GlassCard>

        {/* Feature Coming Soon */}
        <GlassCard style={styles.comingSoonCard}>
          <LinearGradient
            colors={['rgba(99, 102, 241, 0.2)', 'rgba(139, 92, 246, 0.2)']}
            style={styles.comingSoonGradient}
          >
            <Ionicons name="construct" size={32} color="#6366f1" />
            <Text style={styles.comingSoonText}>
              Camera integration coming soon!
            </Text>
            <Text style={styles.comingSoonSubtext}>
              Currently showing mock data for demonstration
            </Text>
          </LinearGradient>
        </GlassCard>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 8,
  },
  cameraCard: {
    marginBottom: 24,
    minHeight: 300,
  },
  cameraPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  placeholderText: {
    fontSize: 16,
    color: 'white',
    marginTop: 16,
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
  capturedImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
  },
  resetButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  captureButton: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#14b8a6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  captureGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 20,
  },
  captureText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  resultCard: {
    marginBottom: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resultText: {
    fontSize: 18,
    color: 'white',
    lineHeight: 28,
  },
  infoCard: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  comingSoonCard: {
    overflow: 'hidden',
  },
  comingSoonGradient: {
    padding: 24,
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
    textAlign: 'center',
  },
  comingSoonSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
});
