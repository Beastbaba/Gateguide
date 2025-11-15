import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../../components/GlassCard';
import { useAppStore } from '../../store/appStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { selectedLanguage, setLanguage } = useAppStore();
  const [pushNotifications, setPushNotifications] = React.useState(true);
  const [soundEnabled, setSoundEnabled] = React.useState(true);

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
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Profile Card */}
        <GlassCard style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              style={styles.avatar}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.avatarText}>JD</Text>
            </LinearGradient>
          </View>
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileEmail}>john.doe@example.com</Text>
        </GlassCard>

        {/* Language Selection */}
        <Text style={styles.sectionTitle}>Preferred Language</Text>
        <GlassCard style={styles.section}>
          {LANGUAGES.map((lang, index) => (
            <View key={lang.code}>
              <TouchableOpacity
                style={styles.languageItem}
                onPress={() => setLanguage(lang.code)}
              >
                <View style={styles.languageInfo}>
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                  <Text style={styles.languageName}>{lang.name}</Text>
                </View>
                {selectedLanguage === lang.code && (
                  <Ionicons name="checkmark-circle" size={24} color="#6366f1" />
                )}
              </TouchableOpacity>
              {index < LANGUAGES.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </GlassCard>

        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <GlassCard style={styles.section}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={24} color="#6366f1" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingDescription}>
                  Get flight updates and alerts
                </Text>
              </View>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#334155', true: '#6366f1' }}
              thumbColor={pushNotifications ? '#ffffff' : '#94a3b8'}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="volume-high" size={24} color="#6366f1" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Sound</Text>
                <Text style={styles.settingDescription}>
                  Play sounds for notifications
                </Text>
              </View>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#334155', true: '#6366f1' }}
              thumbColor={soundEnabled ? '#ffffff' : '#94a3b8'}
            />
          </View>
        </GlassCard>

        {/* About */}
        <Text style={styles.sectionTitle}>About</Text>
        <GlassCard style={styles.section}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuInfo}>
              <Ionicons name="help-circle" size={24} color="#6366f1" />
              <Text style={styles.menuLabel}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuInfo}>
              <Ionicons name="document-text" size={24} color="#6366f1" />
              <Text style={styles.menuLabel}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuInfo}>
              <Ionicons name="information-circle" size={24} color="#6366f1" />
              <Text style={styles.menuLabel}>About GateGuide</Text>
            </View>
            <Text style={styles.versionText}>v1.0.0</Text>
          </TouchableOpacity>
        </GlassCard>

        {/* API Configuration */}
        <Text style={styles.sectionTitle}>API Configuration</Text>
        <GlassCard style={styles.apiCard}>
          <View style={styles.apiItem}>
            <Ionicons name="key" size={20} color="#6366f1" />
            <Text style={styles.apiLabel}>ElevenLabs API Key</Text>
          </View>
          <TouchableOpacity style={styles.apiButton}>
            <Text style={styles.apiButtonText}>Configure</Text>
          </TouchableOpacity>
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
  profileCard: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 32,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#94a3b8',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  section: {
    marginBottom: 32,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  languageFlag: {
    fontSize: 24,
  },
  languageName: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#94a3b8',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  menuInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  versionText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  apiCard: {
    marginBottom: 32,
  },
  apiItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  apiLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  apiButton: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  apiButtonText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});
