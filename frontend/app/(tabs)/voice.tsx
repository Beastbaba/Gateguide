import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MicButton } from '../../components/MicButton';
import { GlassCard } from '../../components/GlassCard';
import { useAppStore } from '../../store/appStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TranslationHistory {
  id: string;
  original: string;
  translated: string;
  timestamp: Date;
}

export default function VoiceScreen() {
  const insets = useSafeAreaInsets();
  const { isRecording, setRecording, selectedLanguage } = useAppStore();
  const [transcription, setTranscription] = useState('');
  const [translation, setTranslation] = useState('');
  const [history, setHistory] = useState<TranslationHistory[]>([]);

  const handleMicPress = async () => {
    if (isRecording) {
      setRecording(false);
      const mockTranscription = 'Where is gate B14?';
      const mockTranslation = '¿Dónde está la puerta B14?';
      setTranscription(mockTranscription);
      setTranslation(mockTranslation);
      
      // Add to history
      setHistory((prev) => [
        {
          id: Date.now().toString(),
          original: mockTranscription,
          translated: mockTranslation,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    } else {
      // Start recording
      setRecording(true);
      setTranscription('');
      setTranslation('');
    }
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
          <Text style={styles.title}>Voice Assistant</Text>
          <TouchableOpacity style={styles.languageButton}>
            <Text style={styles.languageText}>EN → ES</Text>
            <Ionicons name="chevron-down" size={16} color="white" />
          </TouchableOpacity>
        </View>

        {/* Microphone */}
        <View style={styles.micContainer}>
          <MicButton isRecording={isRecording} onPress={handleMicPress} />
          <Text style={styles.micLabel}>
            {isRecording ? 'Listening...' : 'Tap to speak'}
          </Text>
        </View>

        {/* Current Translation */}
        {(transcription || translation) && (
          <GlassCard style={styles.translationCard}>
            {transcription && (
              <View style={styles.textSection}>
                <View style={styles.textHeader}>
                  <Ionicons name="person" size={20} color="#6366f1" />
                  <Text style={styles.textLabel}>You said:</Text>
                </View>
                <Text style={styles.textContent}>{transcription}</Text>
              </View>
            )}
            {translation && (
              <View style={styles.textSection}>
                <View style={styles.textHeader}>
                  <Ionicons name="language" size={20} color="#ec4899" />
                  <Text style={styles.textLabel}>Translation:</Text>
                </View>
                <Text style={styles.textContent}>{translation}</Text>
                <TouchableOpacity style={styles.playButton}>
                  <Ionicons name="play-circle" size={32} color="#6366f1" />
                  <Text style={styles.playText}>Play</Text>
                </TouchableOpacity>
              </View>
            )}
          </GlassCard>
        )}

        {/* Help Text */}
        <GlassCard style={styles.helpCard}>
          <Ionicons name="information-circle" size={24} color="#6366f1" />
          <Text style={styles.helpText}>
            Ask questions about your flight, gate location, facilities, or
            anything else you need help with!
          </Text>
        </GlassCard>

        {/* History */}
        {history.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recent Translations</Text>
            {history.map((item) => (
              <GlassCard key={item.id} style={styles.historyCard}>
                <Text style={styles.historyOriginal}>{item.original}</Text>
                <View style={styles.historyDivider} />
                <Text style={styles.historyTranslated}>{item.translated}</Text>
              </GlassCard>
            ))}
          </>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  languageText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  micContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  micLabel: {
    fontSize: 18,
    color: '#cbd5e1',
    marginTop: 20,
    fontWeight: '600',
  },
  translationCard: {
    marginBottom: 20,
  },
  textSection: {
    marginBottom: 20,
  },
  textHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  textLabel: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  textContent: {
    fontSize: 18,
    color: 'white',
    lineHeight: 28,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  playText: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '700',
  },
  helpCard: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  helpText: {
    flex: 1,
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  historyCard: {
    marginBottom: 12,
  },
  historyOriginal: {
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
  },
  historyDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 8,
  },
  historyTranslated: {
    fontSize: 16,
    color: '#cbd5e1',
  },
});
