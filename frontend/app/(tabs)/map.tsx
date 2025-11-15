import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
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
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState(AIRPORT_CENTER);
  const [selectedGate, setSelectedGate] = useState<typeof GATES[0] | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<Array<{ latitude: number; longitude: number }>>([]);

  useEffect(() => {
    if (userFlight) {
      const gate = GATES.find((g) => g.id === userFlight.gate);
      if (gate) {
        setSelectedGate(gate);
      }
    }
  }, [userFlight]);

  const handleNavigate = () => {
    if (selectedGate) {
      setShowRoute(true);
      mapRef.current?.fitToCoordinates([userLocation, selectedGate], {
        edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
        animated: true,
      });
      // Fetch route from Mapples API
      fetchDirections();
    }
  };

  const handleRecenter = () => {
    mapRef.current?.animateToRegion(
      {
        ...userLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  };

  // Fetch directions using Mapples API
  const fetchDirections = async () => {
    if (!selectedGate || !MAPPLES_API_KEY) {
      console.log('Missing data:', { selectedGate, MAPPLES_API_KEY });
      return;
    }

    try {
      const url = `https://api.mappls.com/routes?origin=${userLocation.latitude},${userLocation.longitude}&destination=${selectedGate.latitude},${selectedGate.longitude}&key=${MAPPLES_API_KEY}&region=IND`;
      console.log('Fetching route from:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      console.log('Mapples Response:', data);

      // Parse route coordinates from Mapples response
      if (data.routes && data.routes[0] && data.routes[0].geometry) {
        const coordinates = decodePolyline(data.routes[0].geometry);
        setRouteCoordinates(coordinates);
      } else {
        console.warn('No route geometry found in response');
        // Fallback to simple route if API fails
        setRouteCoordinates([userLocation, selectedGate]);
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
      // Fallback to simple route
      setRouteCoordinates([userLocation, selectedGate]);
    }
  };

  // Decode polyline from Mapples API
  const decodePolyline = (encoded: string) => {
    const inv = 1.0 / 1e5;
    const decoded: Array<{ latitude: number; longitude: number }> = [];
    let previous = [0, 0];
    let i = 0;

    while (i < encoded.length) {
      const ll = [0, 0];
      for (let j = 0; j < 2; j++) {
        let shift = 0;
        let result = 0;
        let byte = 0;
        do {
          byte = encoded.charCodeAt(i++) - 63;
          result |= (byte & 0x1f) << shift;
          shift += 5;
        } while (byte >= 0x20);
        ll[j] = previous[j] + (result & 1 ? ~(result >> 1) : result >> 1);
        previous[j] = ll[j];
      }
      decoded.push({
        latitude: ll[0] * inv,
        longitude: ll[1] * inv,
      });
    }
    return decoded;
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          ...AIRPORT_CENTER,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
      >
        {/* User Location */}
        <Marker coordinate={userLocation} title="You are here">
          <View style={styles.userMarker}>
            <View style={styles.userMarkerInner} />
          </View>
        </Marker>

        {/* Gates */}
        {GATES.map((gate) => (
          <Marker
            key={gate.id}
            coordinate={gate}
            title={gate.name}
            onPress={() => setSelectedGate(gate)}
          >
            <View
              style={[
                styles.gateMarker,
                selectedGate?.id === gate.id && styles.gateMarkerSelected,
              ]}
            >
              <Text style={styles.gateMarkerText}>{gate.id}</Text>
            </View>
          </Marker>
        ))}

        {/* Route */}
        {showRoute && routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#6366f1"
            strokeWidth={4}
            lineDashPattern={[10, 5]}
          />
        )}
      </MapView>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <GlassCard style={styles.headerCard}>
          <Text style={styles.headerTitle}>Airport Map</Text>
          <Text style={styles.headerSubtitle}>Find your way</Text>
        </GlassCard>
      </View>

      {/* Recenter Button */}
      <TouchableOpacity
        style={[styles.recenterButton, { top: insets.top + 120 }]}
        onPress={handleRecenter}
      >
        <LinearGradient
          colors={['rgba(99, 102, 241, 0.9)', 'rgba(139, 92, 246, 0.9)']}
          style={styles.recenterGradient}
        >
          <Ionicons name="locate" size={24} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Gate Info Card */}
      {selectedGate && (
        <View style={[styles.bottomCard, { paddingBottom: insets.bottom + 100 }]}>
          <GlassCard>
            <View style={styles.gateInfo}>
              <View style={styles.gateHeader}>
                <Ionicons name="log-in" size={32} color="#6366f1" />
                <View style={styles.gateDetails}>
                  <Text style={styles.gateName}>{selectedGate.name}</Text>
                  {userFlight && selectedGate.id === userFlight.gate && (
                    <Text style={styles.gateFlightNumber}>
                      {userFlight.flightNumber} - {userFlight.destination}
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity
                style={styles.navigateButton}
                onPress={handleNavigate}
              >
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  style={styles.navigateGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="navigate" size={20} color="white" />
                  <Text style={styles.navigateText}>
                    {showRoute ? 'Hide Route' : 'Navigate'}
                  </Text>
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
  map: {
    flex: 1,
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
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
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
  gateName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
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
