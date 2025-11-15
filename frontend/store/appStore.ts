import { create } from 'zustand';
import { api } from '../services/api';

interface Flight {
  id: string;
  flightNumber: string;
  destination: string;
  gate: string;
  departureTime: string;
  status: 'On Time' | 'Delayed' | 'Boarding' | 'Gate Changed';
}

interface Notification {
  id: string;
  type: 'gate_change' | 'delay' | 'boarding' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface AppState {
  selectedLanguage: string;
  userFlight: Flight | null;
  notifications: Notification[];
  isRecording: boolean;
  currentTranslation: string | null;
  loading: boolean;
  error: string | null;
  setLanguage: (lang: string) => void;
  setUserFlight: (flight: Flight | null) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  setRecording: (isRecording: boolean) => void;
  setTranslation: (translation: string | null) => void;
  fetchFlights: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  selectedLanguage: 'en',
  userFlight: null,
  notifications: [],
  isRecording: false,
  currentTranslation: null,
  loading: false,
  error: null,
  
  setLanguage: (lang) => set({ selectedLanguage: lang }),
  
  setUserFlight: (flight) => set({ userFlight: flight }),
  
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: Date.now().toString(),
          timestamp: new Date(),
          read: false,
        },
        ...state.notifications,
      ],
    })),
  
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  
  setRecording: (isRecording) => set({ isRecording }),
  
  setTranslation: (translation) => set({ currentTranslation: translation }),
  
  fetchFlights: async () => {
    set({ loading: true, error: null });
    try {
      const flights = await api.getFlights();
      if (flights && flights.length > 0) {
        set({ userFlight: flights[0], loading: false });
      }
    } catch (error: any) {
      console.error('Failed to fetch flights:', error);
      set({ error: error.message, loading: false });
      // Fallback to default flight
      set({
        userFlight: {
          id: '1',
          flightNumber: 'AI 202',
          destination: 'New York JFK',
          gate: 'B14',
          departureTime: '14:30',
          status: 'On Time',
        },
      });
    }
  },
  
  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const notifications = await api.getNotifications();
      if (notifications && notifications.length > 0) {
        const mappedNotifications: Notification[] = notifications.map((n: any) => ({
          ...n,
          read: false,
          timestamp: new Date(n.timestamp),
        }));
        set({ notifications: mappedNotifications, loading: false });
      }
    } catch (error: any) {
      console.error('Failed to fetch notifications:', error);
      set({ error: error.message, loading: false });
      // Set default notification
      set({
        notifications: [
          {
            id: '1',
            type: 'info',
            title: 'Welcome to GateGuide',
            message: 'Your smart airport assistant is ready!',
            timestamp: new Date(),
            read: false,
          },
        ],
      });
    }
  },
}));
