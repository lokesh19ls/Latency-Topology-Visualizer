'use client';

import React from 'react';
import { Loader2, Globe, Zap, Activity } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center z-50">
      <div className="text-center text-white">
        {/* Logo/Icon */}
        <div className="mb-8">
          <div className="relative">
            <Globe className="w-16 h-16 mx-auto text-blue-400 animate-pulse" />
            <Zap className="w-8 h-8 absolute -top-2 -right-2 text-yellow-400 animate-bounce" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Latency Topology Visualizer
        </h1>
        
        {/* Subtitle */}
        <p className="text-gray-300 mb-8 text-lg">
          Real-time cryptocurrency exchange infrastructure monitoring
        </p>

        {/* Loading Animation */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          <span className="text-blue-400">Initializing 3D visualization...</span>
        </div>

        {/* Loading Steps */}
        <div className="space-y-3 text-sm text-gray-400">
          <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-green-400" />
            <span>Loading exchange server data</span>
          </div>
          <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-green-400" />
            <span>Connecting to cloud regions</span>
          </div>
          <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-green-400" />
            <span>Establishing latency monitoring</span>
          </div>
          <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-green-400" />
            <span>Rendering 3D world map</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style={{ width: '85%' }}></div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-xs text-gray-500">
          <p>Powered by Next.js, Three.js, and React Three Fiber</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 