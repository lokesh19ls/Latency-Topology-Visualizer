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
    setExchangeServers(mockExchangeServers);
    setCloudRegions(mockCloudRegions);

    (async () => {
      let initialLatencyData;
      try {
        initialLatencyData = await fetchMockApiLatencyData();
      } catch {
        initialLatencyData = generateMockLatencyData();
      }
      initialLatencyData.forEach(data => addLatencyData(data));

      const historicalData = generateHistoricalLatencyData();
      setHistoricalData(historicalData);

      updatePerformanceMetrics({
        totalServers: mockExchangeServers.length,
        activeConnections: initialLatencyData.length,
        averageLatency: Math.round(
          initialLatencyData.reduce((sum: number, data) => sum + data.latency, 0) / initialLatencyData.length
        ),
        systemStatus: 'healthy',
        lastUpdate: Date.now(),
      });
    })();
  }, [setExchangeServers, setCloudRegions, addLatencyData, setHistoricalData, updatePerformanceMetrics]);

  // Start real-time latency simulation
  useEffect(() => {
    if (exchangeServers.length > 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      const cleanup = simulateRealTimeLatency((newLatencyData) => {
        addLatencyData(newLatencyData);

        const currentLatencyData = [...latencyData, newLatencyData];
        if (currentLatencyData.length % 10 === 0) {
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
      }, 3000);

      intervalRef.current = cleanup as unknown as NodeJS.Timeout;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [exchangeServers.length, addLatencyData, latencyData, updatePerformanceMetrics]);

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