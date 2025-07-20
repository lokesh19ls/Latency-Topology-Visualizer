'use client';

import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Settings, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Grid3X3, 
  Activity, 
  Server, 
  Globe,
  Filter,
  Search,
  Sun,
  Moon,
  RefreshCw
} from 'lucide-react';

const highlightMatch = (text: string, query: string) => {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return <>{text.slice(0, idx)}<span className="bg-blue-700 text-white rounded px-1">{text.slice(idx, idx + query.length)}</span>{text.slice(idx + query.length)}</>;
};

const ControlPanel: React.FC = () => {
  const {
    visualizationSettings,
    mapControls,
    performanceMetrics,
    exchangeServers,
    updateVisualizationSettings,
    updateMapControls,
    updatePerformanceMetrics,
  } = useStore();

  const [exchangeSearch, setExchangeSearch] = useState('');

  const uniqueExchanges = [...new Set(exchangeServers.map(s => s.name))];
  const uniqueProviders = [...new Set(exchangeServers.map(s => s.cloudProvider))];

  const filteredExchanges = uniqueExchanges.filter(exchange =>
    exchange.toLowerCase().includes(exchangeSearch.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return '🟢';
      case 'warning': return '🟡';
      case 'critical': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="absolute top-4 left-4 z-10 bg-white/10 backdrop-blur-md rounded-lg p-4 text-white min-w-80">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Controls
        </h2>
        <button
          onClick={() => updateVisualizationSettings({ 
            theme: visualizationSettings.theme === 'dark' ? 'light' : 'dark' 
          })}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          {visualizationSettings.theme === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Performance Metrics */}
      <div className="mb-6 p-3 bg-white/5 rounded-lg">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Performance Metrics
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Servers:</span>
            <span className="font-medium">{performanceMetrics.totalServers}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Connections:</span>
            <span className="font-medium">{performanceMetrics.activeConnections}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Avg Latency:</span>
            <span className="font-medium">{performanceMetrics.averageLatency}ms</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Status:</span>
            <span className={`font-medium flex items-center gap-1 ${getStatusColor(performanceMetrics.systemStatus)}`}>
              {getStatusIcon(performanceMetrics.systemStatus)}
              {performanceMetrics.systemStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Visualization Layers */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Visualization Layers
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={visualizationSettings.showRealTime}
              onChange={(e) => updateVisualizationSettings({ showRealTime: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Real-time Latency</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={visualizationSettings.showHistorical}
              onChange={(e) => updateVisualizationSettings({ showHistorical: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Historical Data</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={visualizationSettings.showRegions}
              onChange={(e) => updateVisualizationSettings({ showRegions: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Cloud Regions</span>
          </label>
        </div>
      </div>

      {/* Exchange Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Server className="w-4 h-4" />
          Exchange Filter
        </h3>
        {/* Search box */}
        <div className="relative mb-2">
          <input
            type="text"
            placeholder="Search exchanges..."
            value={exchangeSearch}
            onChange={e => setExchangeSearch(e.target.value)}
            className="w-full px-2 py-1 rounded bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-2 top-2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {filteredExchanges.length === 0 && (
            <div className="text-gray-400 text-sm px-2 py-1">No exchanges found</div>
          )}
          {filteredExchanges.map((exchange) => (
            <label key={exchange} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={visualizationSettings.selectedExchanges.length === 0 || 
                         visualizationSettings.selectedExchanges.includes(exchange)}
                onChange={(e) => {
                  const current = visualizationSettings.selectedExchanges;
                  const newSelection = e.target.checked
                    ? current.length === 0 ? [] : current.filter(x => x !== exchange)
                    : [...current, exchange];
                  updateVisualizationSettings({ selectedExchanges: newSelection });
                }}
                className="rounded"
              />
              <span className="text-sm">{highlightMatch(exchange, exchangeSearch)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Cloud Provider Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Cloud Providers
        </h3>
        <div className="space-y-2">
          {uniqueProviders.map((provider) => (
            <label key={provider} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={visualizationSettings.selectedProviders.includes(provider as any)}
                onChange={(e) => {
                  const current = visualizationSettings.selectedProviders;
                  const newSelection = e.target.checked
                    ? [...current, provider as any]
                    : current.filter(p => p !== provider);
                  updateVisualizationSettings({ selectedProviders: newSelection });
                }}
                className="rounded"
              />
              <span className="text-sm">{provider}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Latency Range */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Latency Range (ms)
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={visualizationSettings.latencyRange.min}
              onChange={(e) => updateVisualizationSettings({
                latencyRange: {
                  ...visualizationSettings.latencyRange,
                  min: parseInt(e.target.value) || 0
                }
              })}
              className="w-20 px-2 py-1 bg-white/10 rounded text-sm"
              placeholder="Min"
            />
            <span className="text-sm">to</span>
            <input
              type="number"
              value={visualizationSettings.latencyRange.max}
              onChange={(e) => updateVisualizationSettings({
                latencyRange: {
                  ...visualizationSettings.latencyRange,
                  max: parseInt(e.target.value) || 1000
                }
              })}
              className="w-20 px-2 py-1 bg-white/10 rounded text-sm"
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Map Controls
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={mapControls.autoRotate}
              onChange={(e) => updateMapControls({ autoRotate: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Auto Rotate</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={mapControls.showGrid}
              onChange={(e) => updateMapControls({ showGrid: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Show Grid</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={mapControls.showAxis}
              onChange={(e) => updateMapControls({ showAxis: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Show Axis</span>
          </label>
        </div>
      </div>

      {/* Time Range */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">Time Range</h3>
        <select
          value={visualizationSettings.timeRange}
          onChange={(e) => updateVisualizationSettings({ timeRange: e.target.value as any })}
          className="w-full px-3 py-2 bg-white/10 rounded text-sm"
        >
          <option value="1h">Last Hour</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>

      {/* Refresh Button */}
      <button
        onClick={() => {
          // Simulate refresh by updating metrics
          updatePerformanceMetrics({
            lastUpdate: Date.now(),
            totalServers: exchangeServers.length,
            activeConnections: Math.floor(Math.random() * 50) + 10,
            averageLatency: Math.floor(Math.random() * 100) + 20,
          });
        }}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Refresh Data
      </button>
    </div>
  );
};

export default ControlPanel; 