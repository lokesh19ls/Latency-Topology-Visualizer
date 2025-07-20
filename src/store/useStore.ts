import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  ExchangeServer,
  CloudRegion,
  LatencyData,
  HistoricalLatencyData,
  VisualizationSettings,
  PerformanceMetrics,
  MapControls,
} from '../types';

interface AppState {
  // Data
  exchangeServers: ExchangeServer[];
  cloudRegions: CloudRegion[];
  latencyData: LatencyData[];
  historicalData: HistoricalLatencyData[];
  
  // Settings
  visualizationSettings: VisualizationSettings;
  mapControls: MapControls;
  performanceMetrics: PerformanceMetrics;
  
  // UI State
  selectedServer: string | null;
  hoveredServer: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setExchangeServers: (servers: ExchangeServer[]) => void;
  setCloudRegions: (regions: CloudRegion[]) => void;
  addLatencyData: (data: LatencyData) => void;
  setHistoricalData: (data: HistoricalLatencyData[]) => void;
  updateVisualizationSettings: (settings: Partial<VisualizationSettings>) => void;
  updateMapControls: (controls: Partial<MapControls>) => void;
  updatePerformanceMetrics: (metrics: Partial<PerformanceMetrics>) => void;
  setSelectedServer: (serverId: string | null) => void;
  setHoveredServer: (serverId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Computed
  getFilteredServers: () => ExchangeServer[];
  getFilteredLatencyData: () => LatencyData[];
  getLatencyColor: (latency: number) => string;
}

const initialVisualizationSettings: VisualizationSettings = {
  showRealTime: true,
  showHistorical: false,
  showRegions: true,
  selectedExchanges: [],
  selectedProviders: ['AWS', 'GCP', 'Azure'],
  latencyRange: { min: 0, max: 1000 },
  timeRange: '24h',
  theme: 'dark',
};

const initialMapControls: MapControls = {
  autoRotate: false,
  showGrid: true,
  showAxis: false,
  cameraPosition: { x: 0, y: 0, z: 5 },
};

const initialPerformanceMetrics: PerformanceMetrics = {
  totalServers: 0,
  activeConnections: 0,
  averageLatency: 0,
  systemStatus: 'healthy',
  lastUpdate: Date.now(),
};

export const useStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Initial state
      exchangeServers: [],
      cloudRegions: [],
      latencyData: [],
      historicalData: [],
      visualizationSettings: initialVisualizationSettings,
      mapControls: initialMapControls,
      performanceMetrics: initialPerformanceMetrics,
      selectedServer: null,
      hoveredServer: null,
      isLoading: false,
      error: null,

      // Actions
      setExchangeServers: (servers) => set({ exchangeServers: servers }),
      setCloudRegions: (regions) => set({ cloudRegions: regions }),
      addLatencyData: (data) => set((state) => ({
        latencyData: [...state.latencyData, data].slice(-1000), // Keep last 1000 entries
      })),
      setHistoricalData: (data) => set({ historicalData: data }),
      updateVisualizationSettings: (settings) => set((state) => ({
        visualizationSettings: { ...state.visualizationSettings, ...settings },
      })),
      updateMapControls: (controls) => set((state) => ({
        mapControls: { ...state.mapControls, ...controls },
      })),
      updatePerformanceMetrics: (metrics) => set((state) => ({
        performanceMetrics: { ...state.performanceMetrics, ...metrics },
      })),
      setSelectedServer: (serverId) => set({ selectedServer: serverId }),
      setHoveredServer: (serverId) => set({ hoveredServer: serverId }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      // Computed
      getFilteredServers: () => {
        const state = get();
        const { selectedExchanges, selectedProviders } = state.visualizationSettings;
        
        return state.exchangeServers.filter((server) => {
          const exchangeMatch = selectedExchanges.length === 0 || selectedExchanges.includes(server.name);
          const providerMatch = selectedProviders.includes(server.cloudProvider);
          return exchangeMatch && providerMatch;
        });
      },

      getFilteredLatencyData: () => {
        const state = get();
        const { latencyRange } = state.visualizationSettings;
        
        return state.latencyData.filter((data) => {
          return data.latency >= latencyRange.min && data.latency <= latencyRange.max;
        });
      },

      getLatencyColor: (latency: number) => {
        if (latency < 50) return '#10b981'; // green
        if (latency < 100) return '#f59e0b'; // yellow
        return '#ef4444'; // red
      },
    }),
    {
      name: 'latency-topology-store',
    }
  )
); 