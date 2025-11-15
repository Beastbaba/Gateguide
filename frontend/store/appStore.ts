import { create } from 'zustand';

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
  setLanguage: (lang: string) => void;
  setUserFlight: (flight: Flight | null) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  setRecording: (isRecording: boolean) => void;
  setTranslation: (translation: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedLanguage: 'en',
  userFlight: {
    id: '1',
    flightNumber: 'AI 202',
    destination: 'New York JFK',
    gate: 'B14',
    departureTime: '14:30',
    status: 'On Time',
  },
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
  isRecording: false,
  currentTranslation: null,
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
}));
