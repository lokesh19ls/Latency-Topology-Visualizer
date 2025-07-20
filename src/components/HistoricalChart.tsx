'use client';

import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { format } from 'date-fns';
import { useStore } from '../store/useStore';
import { BarChart3, TrendingUp, Clock } from 'lucide-react';

const HistoricalChart: React.FC = () => {
  const { historicalData, visualizationSettings, selectedServer } = useStore();
  const [selectedPair, setSelectedPair] = useState<string>('');

  const chartData = useMemo(() => {
    if (!selectedPair) return [];
    
    const pairData = historicalData.find(d => d.serverPair === selectedPair);
    if (!pairData) return [];

    return pairData.data.map(point => ({
      time: format(new Date(point.timestamp), 'HH:mm'),
      latency: point.latency,
      timestamp: point.timestamp,
    }));
  }, [selectedPair, historicalData]);

  const availablePairs = useMemo(() => {
    return historicalData.map(d => d.serverPair);
  }, [historicalData]);

  const selectedPairData = useMemo(() => {
    return historicalData.find(d => d.serverPair === selectedPair);
  }, [selectedPair, historicalData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border">
          <p className="text-gray-600 text-sm">{`Time: ${label}`}</p>
          <p className="text-blue-600 font-medium">
            {`Latency: ${payload[0].value}ms`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!visualizationSettings.showHistorical) {
    return null;
  }

  return (
    <div className="absolute bottom-4 right-4 z-10 bg-white/10 backdrop-blur-md rounded-lg p-4 text-white w-96">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Historical Latency
        </h3>
      </div>

      {/* Server Pair Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Select Server Pair</label>
        <select
          value={selectedPair}
          onChange={(e) => setSelectedPair(e.target.value)}
          className="w-full px-3 py-2 bg-white/10 rounded text-sm text-white"
        >
          <option value="">Choose a server pair...</option>
          {availablePairs.map((pair) => (
            <option key={pair} value={pair}>
              {pair}
            </option>
          ))}
        </select>
      </div>

      {/* Statistics */}
      {selectedPairData && (
        <div className="mb-4 p-3 bg-white/5 rounded-lg">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Statistics
          </h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-green-400 font-medium">
                {selectedPairData.stats.min}ms
              </div>
              <div className="text-gray-400 text-xs">Min</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-medium">
                {selectedPairData.stats.average}ms
              </div>
              <div className="text-gray-400 text-xs">Avg</div>
            </div>
            <div className="text-center">
              <div className="text-red-400 font-medium">
                {selectedPairData.stats.max}ms
              </div>
              <div className="text-gray-400 text-xs">Max</div>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="time"
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9ca3af' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="latency"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* No Data Message */}
      {selectedPair && chartData.length === 0 && (
        <div className="h-64 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <Clock className="w-8 h-8 mx-auto mb-2" />
            <p>No historical data available for this pair</p>
          </div>
        </div>
      )}

      {/* Time Range Info */}
      <div className="mt-4 text-xs text-gray-400 text-center">
        Showing data for: {visualizationSettings.timeRange}
      </div>
    </div>
  );
};

export default HistoricalChart; 