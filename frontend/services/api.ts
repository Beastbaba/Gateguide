const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8000';

interface APIError {
  message: string;
  error?: any;
}

class APIClient {
  private baseURL: string;

  constructor() {
    this.baseURL = BACKEND_URL;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // STT - Speech to Text / Transcription
  async transcribeAudio(request: {
    source_language: string;
    target_language: string;
    audio_url?: string;
  }) {
    return this.request('/api/stt/transcribe', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Translate text
  async translateText(request: {
    text: string;
    source_language: string;
    target_language: string;
  }) {
    return this.request('/api/translate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // OCR - Extract text from image
  async extractTextFromImage(request: {
    image_url: string;
    target_language?: string;
  }) {
    return this.request('/api/ocr', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Get all gates
  async getGates() {
    return this.request('/api/gates', { method: 'GET' });
  }

  // Get all flights
  async getFlights() {
    return this.request('/api/flights', { method: 'GET' });
  }

  // Get specific flight
  async getFlight(flightNumber: string) {
    return this.request(`/api/flights/${flightNumber}`, { method: 'GET' });
  }

  // Get notifications
  async getNotifications() {
    return this.request('/api/notifications', { method: 'GET' });
  }

  // WebSocket for real-time notifications
  connectWebSocket(onMessage: (data: any) => void, onError?: (error: any) => void) {
    const wsUrl = this.baseURL.replace('http', 'ws') + '/api/ws/notifications';
    
    try {
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (onError) onError(error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
      };

      return ws;
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      if (onError) onError(error);
      return null;
    }
  }
}

export const api = new APIClient();
