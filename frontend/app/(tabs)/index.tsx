import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../../components/GlassCard';
import { useAppStore } from '../../store/appStore';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { userFlight, notifications } = useAppStore();
  const unreadNotifications = notifications.filter((n) => !n.read);

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
          <View>
            <Text style={styles.greeting}>Welcome to</Text>
            <Text style={styles.title}>GateGuide ✈️</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={28} color="white" />
            {unreadNotifications.length > 0 && (
              <View style={styles.notificationDot} />
            )}
          </TouchableOpacity>
        </View>

        {/* Flight Card */}
        {userFlight && (
          <GlassCard style={styles.flightCard}>
            <View style={styles.flightHeader}>
              <Text style={styles.flightLabel}>Your Flight</Text>
              <View
                style={[
                  styles.statusBadge,
                  userFlight.status === 'On Time' && styles.statusOnTime,
                  userFlight.status === 'Delayed' && styles.statusDelayed,
                  userFlight.status === 'Boarding' && styles.statusBoarding,
                ]}
              >
                <Text style={styles.statusText}>{userFlight.status}</Text>
              </View>
            </View>
            <Text style={styles.flightNumber}>{userFlight.flightNumber}</Text>
            <Text style={styles.destination}>{userFlight.destination}</Text>
            <View style={styles.flightDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="time" size={20} color="#94a3b8" />
                <Text style={styles.detailText}>{userFlight.departureTime}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="log-in" size={20} color="#94a3b8" />
                <Text style={styles.detailText}>Gate {userFlight.gate}</Text>
              </View>
            </View>
          </GlassCard>
        )}

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/voice')}
          >
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="mic" size={32} color="white" />
              <Text style={styles.actionText}>Voice Assistant</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/map')}
          >
            <LinearGradient
              colors={['#ec4899', '#f43f5e']}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="map" size={32} color="white" />
              <Text style={styles.actionText}>Navigate</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/ocr')}
          >
            <LinearGradient
              colors={['#14b8a6', '#06b6d4']}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="camera" size={32} color="white" />
              <Text style={styles.actionText}>Translate Sign</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient
              colors={['#f59e0b', '#f97316']}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="help-circle" size={32} color="white" />
              <Text style={styles.actionText}>Help</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Recent Notifications */}
        {unreadNotifications.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recent Updates</Text>
            {unreadNotifications.slice(0, 3).map((notification) => (
              <GlassCard key={notification.id} style={styles.notificationCard}>
                <View style={styles.notificationHeader}>
                  <Ionicons
                    name={
                      notification.type === 'gate_change'
                        ? 'log-in'
                        : notification.type === 'delay'
                        ? 'time'
                        : notification.type === 'boarding'
                        ? 'airplane'
                        : 'information-circle'
                    }
                    size={24}
                    color="#6366f1"
                  />
                  <Text style={styles.notificationTitle}>
                    {notification.title}
                  </Text>
                </View>
                <Text style={styles.notificationMessage}>
                  {notification.message}
                </Text>
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
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '500',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 4,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  flightCard: {
    marginBottom: 32,
  },
  flightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  flightLabel: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusOnTime: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  statusDelayed: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  statusBoarding: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '700',
  },
  flightNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  destination: {
    fontSize: 20,
    color: '#e2e8f0',
    marginBottom: 20,
  },
  flightDetails: {
    flexDirection: 'row',
    gap: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    width: (width - 52) / 2,
    height: 120,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  actionGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  notificationCard: {
    marginBottom: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    flex: 1,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
});
