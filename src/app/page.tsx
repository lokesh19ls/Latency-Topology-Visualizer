'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const SimpleGlobe = dynamic(() => import('../components/SimpleGlobe'), { ssr: false });
// import WorldMap from '../components/WorldMap';
import ControlPanel from '../components/ControlPanel';
import HistoricalChart from '../components/HistoricalChart';
import Legend from '../components/Legend';
import LoadingScreen from '../components/LoadingScreen';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { useStore } from '../store/useStore';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { isInitialized } = useRealTimeData();
  const { selectedServer, exchangeServers } = useStore();

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen while initializing
  if (isLoading || !isInitialized) {
    return <LoadingScreen />;
  }

  const selectedServerData = selectedServer 
    ? exchangeServers.find(s => s.id === selectedServer)
    : null;

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Simple Interactive Globe */}
      <SimpleGlobe />

      {/* Control Panel */}
      <ControlPanel />

      {/* Legend */}
      <Legend />

      {/* Historical Chart */}
      <HistoricalChart />

      {/* Selected Server Info */}
      {selectedServerData && (
        <div className="absolute bottom-4 left-4 z-10 bg-white/10 backdrop-blur-md rounded-lg p-4 text-white max-w-sm">
          <h3 className="text-lg font-semibold mb-2">{selectedServerData.name}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Location:</span>
              <span>{selectedServerData.location.city}, {selectedServerData.location.country}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Cloud Provider:</span>
              <span className="font-medium">{selectedServerData.cloudProvider}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Region:</span>
              <span>{selectedServerData.region}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Status:</span>
              <span className={`font-medium ${selectedServerData.isActive ? 'text-green-400' : 'text-red-400'}`}>
                {selectedServerData.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 text-center">
        <h1 className="text-2xl font-bold text-white mb-1">
          Latency Topology Visualizer
        </h1>
        <p className="text-gray-300 text-sm">
          Real-time cryptocurrency exchange infrastructure monitoring
        </p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10 text-center">
        <p className="text-gray-400 text-xs">
          Interactive 3D visualization of exchange server locations and latency data
        </p>
      </div>
    </div>
  );
}
