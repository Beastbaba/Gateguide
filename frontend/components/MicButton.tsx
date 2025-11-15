import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface MicButtonProps {
  isRecording: boolean;
  onPress: () => void;
}

export const MicButton: React.FC<MicButtonProps> = ({ isRecording, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.stop();
    }

    if (isRecording) {
      animationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: false,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: false,
          }),
        ])
      );
      animationRef.current.start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.8,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
      Animated.timing(opacityAnim, {
        toValue: 0.3,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [isRecording]);

  const ring1Scale = scaleAnim.interpolate({
    inputRange: [1, 1.2],
    outputRange: [1, 1.2],
  });

  const ring2Scale = scaleAnim.interpolate({
    inputRange: [1, 1.2],
    outputRange: [1.3, 1.56],
  });

  return (
    <View style={styles.container}>
      {isRecording && (
        <>
          <Animated.View
            style={[
              styles.ring,
              {
                transform: [{ scale: ring2Scale }],
                opacity: Animated.multiply(opacityAnim, 0.5),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.ring,
              {
                transform: [{ scale: ring1Scale }],
                opacity: opacityAnim,
              },
            ]}
          />
        </>
      )}
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <LinearGradient
          colors={isRecording ? ['#ec4899', '#ef4444'] : ['#6366f1', '#8b5cf6']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons
            name={isRecording ? 'stop' : 'mic'}
            size={48}
            color="white"
          />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  gradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#6366f1',
  },
});
