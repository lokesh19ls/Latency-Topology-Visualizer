'use client';

import React from 'react';
import { useStore } from '../store/useStore';
import { MapPin, Cloud, Zap, Info } from 'lucide-react';

const Legend: React.FC = () => {
  const { getLatencyColor } = useStore();

  return (
    <div className="absolute top-4 right-4 z-10 bg-white/10 backdrop-blur-md rounded-lg p-4 text-white w-64">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Legend</h3>
      </div>

      {/* Exchange Servers */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Exchange Servers
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF9900]"></div>
            <span>AWS</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#4285F4]"></div>
            <span>GCP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00A4EF]"></div>
            <span>Azure</span>
          </div>
        </div>
      </div>

      {/* Cloud Regions */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
          <Cloud className="w-4 h-4" />
          Cloud Regions
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF9900] opacity-70"></div>
            <span>AWS Regions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#4285F4] opacity-70"></div>
            <span>GCP Regions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00A4EF] opacity-70"></div>
            <span>Azure Regions</span>
          </div>
        </div>
      </div>

      {/* Latency Connections */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Latency Connections
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-[#10b981]"></div>
            <span>Low (&lt;50ms)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-[#f59e0b]"></div>
            <span>Medium (50-100ms)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-[#ef4444]"></div>
            <span>High (&gt;100ms)</span>
          </div>
        </div>
      </div>

      {/* Controls Info */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Controls</h4>
        <div className="space-y-1 text-xs text-gray-300">
          <div>• Left Click: Select server</div>
          <div>• Right Click: Rotate camera</div>
          <div>• Scroll: Zoom in/out</div>
          <div>• Drag: Pan camera</div>
        </div>
      </div>

      {/* Status Indicators */}
      <div>
        <h4 className="text-sm font-medium mb-2">Status</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Healthy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span>Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span>Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legend; 