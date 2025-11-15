import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../../components/GlassCard';
import { useAppStore } from '../../store/appStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

// Get Mapples API Key from environment
const MAPPLES_API_KEY = Constants.expoConfig?.extra?.MAPPLES_API_KEY || process.env.EXPO_PUBLIC_MAPPLES_API_KEY;

// Mock airport coordinates
const AIRPORT_CENTER = {
  latitude: 28.5562,
  longitude: 77.1000,
};

const GATES = [
  { id: 'B14', latitude: 28.5572, longitude: 77.1010, name: 'Gate B14' },
  { id: 'C5', latitude: 28.5552, longitude: 77.0990, name: 'Gate C5' },
  { id: 'A1', latitude: 28.5582, longitude: 77.1020, name: 'Gate A1' },
];

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { userFlight } = useAppStore();
  const [selectedGate, setSelectedGate] = useState<typeof GATES[0] | null>(null);

  useEffect(() => {
    if (userFlight) {
      const gate = GATES.find((g) => g.id === userFlight.gate);
      if (gate) {
        setSelectedGate(gate);
      }
    }
  }, [userFlight]);

  const handleGetDirections = () => {
    if (selectedGate) {
      const origin = `${AIRPORT_CENTER.latitude},${AIRPORT_CENTER.longitude}`;
      const destination = `${selectedGate.latitude},${selectedGate.longitude}`;
      const mapsUrl = `https://maps.google.com/?q=${destination}`;
      Linking.openURL(mapsUrl);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <GlassCard style={styles.headerCard}>
          <Text style={styles.headerTitle}>Airport Map</Text>
          <Text style={styles.headerSubtitle}>Find your way</Text>
        </GlassCard>
      </View>

      {/* Gates List */}
      <ScrollView style={styles.gatesList} contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}>
        <View style={styles.gatesContainer}>
          <Text style={styles.sectionTitle}>Available Gates</Text>
          
          {GATES.map((gate) => (
            <TouchableOpacity
              key={gate.id}
              onPress={() => setSelectedGate(gate)}
              style={[
                styles.gateCard,
                selectedGate?.id === gate.id && styles.gateCardSelected,
              ]}
            >
              <LinearGradient
                colors={
                  selectedGate?.id === gate.id
                    ? ['rgba(99, 102, 241, 0.9)', 'rgba(139, 92, 246, 0.9)']
                    : ['rgba(99, 102, 241, 0.1)', 'rgba(139, 92, 246, 0.1)']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gateGradient}
              >
                <View style={styles.gateCardContent}>
                  <View style={styles.gateIcon}>
                    <Ionicons 
                      name="log-in" 
                      size={24} 
                      color={selectedGate?.id === gate.id ? 'white' : '#6366f1'} 
                    />
                  </View>
                  <View style={styles.gateCardInfo}>
                    <Text style={[styles.gateName, selectedGate?.id === gate.id && styles.gateNameSelected]}>
                      {gate.name}
                    </Text>
                    <Text style={styles.gateCoordinates}>
                      📍 {gate.latitude.toFixed(4)}, {gate.longitude.toFixed(4)}
                    </Text>
                    {userFlight && gate.id === userFlight.gate && (
                      <View style={styles.flightMatch}>
                        <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                        <Text style={styles.flightMatchText}>Your gate: {userFlight.flightNumber}</Text>
                      </View>
                    )}
                  </View>
                  {selectedGate?.id === gate.id && (
                    <Ionicons name="checkmark" size={24} color="white" />
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Action Card */}
      {selectedGate && (
        <View style={[styles.bottomCard, { paddingBottom: insets.bottom + 20 }]}>
          <GlassCard>
            <View style={styles.actionContent}>
              <View>
                <Text style={styles.selectedGateTitle}>Going to {selectedGate.name}</Text>
                {userFlight && selectedGate.id === userFlight.gate && (
                  <Text style={styles.flightInfo}>
                    Flight {userFlight.flightNumber} to {userFlight.destination}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.directionsButton}
                onPress={handleGetDirections}
              >
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.directionsGradient}
                >
                  <Ionicons name="navigate" size={20} color="white" />
                  <Text style={styles.directionsText}>Get Directions</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
  },
  headerCard: {
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  gatesList: {
    flex: 1,
    marginTop: 140,
  },
  gatesContainer: {
    padding: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  gateCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  gateCardSelected: {
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  gateGradient: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  gateCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gateIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gateCardInfo: {
    flex: 1,
  },
  gateName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366f1',
  },
  gateNameSelected: {
    color: 'white',
  },
  gateCoordinates: {
    fontSize: 12,
    color: '#cbd5e1',
    marginTop: 4,
  },
  flightMatch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  flightMatchText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    marginBottom: 20,
  },
  actionContent: {
    gap: 12,
  },
  selectedGateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  flightInfo: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  directionsButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  directionsGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  directionsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  map: {
    flex: 1,
  },
  recenterButton: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  recenterGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gateInfo: {
    gap: 16,
  },
  gateHeader: {
    flexDirection: 'row',
    gap: 16,
  },
  gateDetails: {
    flex: 1,
  },
  gateFlightNumber: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  navigateButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  navigateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  navigateText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  userMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMarkerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6366f1',
    borderWidth: 2,
    borderColor: 'white',
  },
  gateMarker: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#6366f1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  gateMarkerSelected: {
    backgroundColor: '#6366f1',
  },
  gateMarkerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6366f1',
  },
});
