export interface ExchangeServer {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  };
  cloudProvider: 'AWS' | 'GCP' | 'Azure';
  region: string;
  isActive: boolean;
}

export interface CloudRegion {
  id: string;
  provider: 'AWS' | 'GCP' | 'Azure';
  name: string;
  code: string;
  location: {
    lat: number;
    lng: number;
  };
  serverCount: number;
  color: string;
}

export interface LatencyData {
  id: string;
  fromServerId: string;
  toServerId: string;
  latency: number; // in milliseconds
  timestamp: number;
  status: 'low' | 'medium' | 'high';
}

export interface HistoricalLatencyData {
  serverPair: string;
  data: Array<{
    timestamp: number;
    latency: number;
  }>;
  stats: {
    min: number;
    max: number;
    average: number;
  };
}

export interface VisualizationSettings {
  showRealTime: boolean;
  showHistorical: boolean;
  showRegions: boolean;
  selectedExchanges: string[];
  selectedProviders: ('AWS' | 'GCP' | 'Azure')[];
  latencyRange: {
    min: number;
    max: number;
  };
  timeRange: '1h' | '24h' | '7d' | '30d';
  theme: 'light' | 'dark';
}

export interface PerformanceMetrics {
  totalServers: number;
  activeConnections: number;
  averageLatency: number;
  systemStatus: 'healthy' | 'warning' | 'critical';
  lastUpdate: number;
}

export interface MapControls {
  autoRotate: boolean;
  showGrid: boolean;
  showAxis: boolean;
  cameraPosition: {
    x: number;
    y: number;
    z: number;
  };
} 