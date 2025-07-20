import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { 
  mockExchangeServers, 
  mockCloudRegions, 
  generateMockLatencyData, 
  generateHistoricalLatencyData,
  simulateRealTimeLatency,
  fetchMockApiLatencyData
} from '../lib/dataService';

export const useRealTimeData = () => {
  const {
    setExchangeServers,
    setCloudRegions,
    addLatencyData,
    setHistoricalData,
    updatePerformanceMetrics,
    exchangeServers,
    latencyData,
  } = useStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize data on mount
  useEffect(() => {
    // Set initial exchange servers and cloud regions
    setExchangeServers(mockExchangeServers);
    setCloudRegions(mockCloudRegions);

    // Generate initial latency data from mock API
    (async () => {
      let initialLatencyData;
      try {
        initialLatencyData = await fetchMockApiLatencyData();
      } catch (e) {
        initialLatencyData = generateMockLatencyData();
      }
      initialLatencyData.forEach(data => addLatencyData(data));

      // Generate historical data (still mock for now)
      const historicalData = generateHistoricalLatencyData();
      setHistoricalData(historicalData);

      // Update performance metrics
      updatePerformanceMetrics({
        totalServers: mockExchangeServers.length,
        activeConnections: initialLatencyData.length,
        averageLatency: Math.round(
          initialLatencyData.reduce((sum, data) => sum + data.latency, 0) / initialLatencyData.length
        ),
        systemStatus: 'healthy',
        lastUpdate: Date.now(),
      });
    })();
  }, []);

  // Start real-time latency simulation
  useEffect(() => {
    if (exchangeServers.length > 0) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Start new simulation
      const cleanup = simulateRealTimeLatency((newLatencyData) => {
        addLatencyData(newLatencyData);
        
        // Update performance metrics periodically
        const currentLatencyData = [...latencyData, newLatencyData];
        if (currentLatencyData.length % 10 === 0) { // Update every 10 new data points
          const avgLatency = Math.round(
            currentLatencyData.slice(-100).reduce((sum, data) => sum + data.latency, 0) / 
            Math.min(currentLatencyData.length, 100)
          );
          
          updatePerformanceMetrics({
            activeConnections: currentLatencyData.length,
            averageLatency: avgLatency,
            systemStatus: avgLatency < 50 ? 'healthy' : avgLatency < 100 ? 'warning' : 'critical',
            lastUpdate: Date.now(),
          });
        }
      }, 3000); // Update every 3 seconds

      intervalRef.current = cleanup as any;
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [exchangeServers.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isInitialized: exchangeServers.length > 0,
  };
}; 