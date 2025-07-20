import { ExchangeServer, CloudRegion, LatencyData, HistoricalLatencyData } from '../types';
import { fetchCountryLatency } from './cloudflareRadar';

// Mock exchange server data
export const mockExchangeServers: ExchangeServer[] = [
  {
    id: 'binance-1',
    name: 'Binance',
    location: { lat: 1.3521, lng: 103.8198, city: 'Singapore', country: 'Singapore' },
    cloudProvider: 'AWS',
    region: 'ap-southeast-1',
    isActive: true,
  },
  {
    id: 'okx-1',
    name: 'OKX',
    location: { lat: 22.3193, lng: 114.1694, city: 'Hong Kong', country: 'Hong Kong' },
    cloudProvider: 'GCP',
    region: 'asia-east1',
    isActive: true,
  },
  {
    id: 'deribit-1',
    name: 'Deribit',
    location: { lat: 52.3676, lng: 4.9041, city: 'Amsterdam', country: 'Netherlands' },
    cloudProvider: 'Azure',
    region: 'westeurope',
    isActive: true,
  },
  {
    id: 'bybit-1',
    name: 'Bybit',
    location: { lat: 25.2048, lng: 55.2708, city: 'Dubai', country: 'UAE' },
    cloudProvider: 'AWS',
    region: 'me-south-1',
    isActive: true,
  },
  {
    id: 'coinbase-1',
    name: 'Coinbase',
    location: { lat: 37.7749, lng: -122.4194, city: 'San Francisco', country: 'USA' },
    cloudProvider: 'AWS',
    region: 'us-west-1',
    isActive: true,
  },
  {
    id: 'kraken-1',
    name: 'Kraken',
    location: { lat: 47.6062, lng: -122.3321, city: 'Seattle', country: 'USA' },
    cloudProvider: 'GCP',
    region: 'us-west1',
    isActive: true,
  },
  {
    id: 'bitfinex-1',
    name: 'Bitfinex',
    location: { lat: 40.7128, lng: -74.0060, city: 'New York', country: 'USA' },
    cloudProvider: 'Azure',
    region: 'eastus',
    isActive: true,
  },
  {
    id: 'kucoin-1',
    name: 'KuCoin',
    location: { lat: 39.9042, lng: 116.4074, city: 'Beijing', country: 'China' },
    cloudProvider: 'AWS',
    region: 'ap-northeast-1',
    isActive: true,
  },
];

// Mock cloud regions data
export const mockCloudRegions: CloudRegion[] = [
  {
    id: 'aws-us-east-1',
    provider: 'AWS',
    name: 'US East (N. Virginia)',
    code: 'us-east-1',
    location: { lat: 38.9072, lng: -77.0369 },
    serverCount: 12,
    color: '#FF9900',
  },
  {
    id: 'aws-us-west-1',
    provider: 'AWS',
    name: 'US West (N. California)',
    code: 'us-west-1',
    location: { lat: 37.7749, lng: -122.4194 },
    serverCount: 8,
    color: '#FF9900',
  },
  {
    id: 'aws-eu-west-1',
    provider: 'AWS',
    name: 'Europe (Ireland)',
    code: 'eu-west-1',
    location: { lat: 53.3498, lng: -6.2603 },
    serverCount: 10,
    color: '#FF9900',
  },
  {
    id: 'aws-ap-southeast-1',
    provider: 'AWS',
    name: 'Asia Pacific (Singapore)',
    code: 'ap-southeast-1',
    location: { lat: 1.3521, lng: 103.8198 },
    serverCount: 6,
    color: '#FF9900',
  },
  {
    id: 'gcp-us-central1',
    provider: 'GCP',
    name: 'US Central (Iowa)',
    code: 'us-central1',
    location: { lat: 41.8781, lng: -93.0977 },
    serverCount: 9,
    color: '#4285F4',
  },
  {
    id: 'gcp-europe-west1',
    provider: 'GCP',
    name: 'Europe West (Belgium)',
    code: 'europe-west1',
    location: { lat: 50.8503, lng: 4.3517 },
    serverCount: 7,
    color: '#4285F4',
  },
  {
    id: 'gcp-asia-east1',
    provider: 'GCP',
    name: 'Asia East (Taiwan)',
    code: 'asia-east1',
    location: { lat: 25.0330, lng: 121.5654 },
    serverCount: 5,
    color: '#4285F4',
  },
  {
    id: 'azure-eastus',
    provider: 'Azure',
    name: 'East US',
    code: 'eastus',
    location: { lat: 40.7128, lng: -74.0060 },
    serverCount: 11,
    color: '#00A4EF',
  },
  {
    id: 'azure-westeurope',
    provider: 'Azure',
    name: 'West Europe',
    code: 'westeurope',
    location: { lat: 52.3676, lng: 4.9041 },
    serverCount: 8,
    color: '#00A4EF',
  },
  {
    id: 'azure-eastasia',
    provider: 'Azure',
    name: 'East Asia',
    code: 'eastasia',
    location: { lat: 22.3193, lng: 114.1694 },
    serverCount: 6,
    color: '#00A4EF',
  },
];

// Generate mock latency data
export const generateMockLatencyData = (): LatencyData[] => {
  const data: LatencyData[] = [];
  const servers = mockExchangeServers;
  
  for (let i = 0; i < servers.length; i++) {
    for (let j = i + 1; j < servers.length; j++) {
      const latency = Math.random() * 200 + 10; // 10-210ms
      const status = latency < 50 ? 'low' : latency < 100 ? 'medium' : 'high';
      
      data.push({
        id: `${servers[i].id}-${servers[j].id}`,
        fromServerId: servers[i].id,
        toServerId: servers[j].id,
        latency: Math.round(latency),
        timestamp: Date.now(),
        status,
      });
    }
  }
  
  return data;
};

// Generate historical latency data
export const generateHistoricalLatencyData = (): HistoricalLatencyData[] => {
  const data: HistoricalLatencyData[] = [];
  const servers = mockExchangeServers;
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  
  for (let i = 0; i < servers.length; i++) {
    for (let j = i + 1; j < servers.length; j++) {
      const timeSeriesData = [];
      const baseLatency = Math.random() * 100 + 20;
      
      for (let k = 0; k < 24; k++) {
        const timestamp = now - (23 - k) * (oneDay / 24);
        const latency = baseLatency + (Math.random() - 0.5) * 40;
        timeSeriesData.push({
          timestamp,
          latency: Math.round(latency),
        });
      }
      
      const latencies = timeSeriesData.map(d => d.latency);
      data.push({
        serverPair: `${servers[i].name}-${servers[j].name}`,
        data: timeSeriesData,
        stats: {
          min: Math.min(...latencies),
          max: Math.max(...latencies),
          average: Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length),
        },
      });
    }
  }
  
  return data;
};

// Simulate real-time latency updates
export const simulateRealTimeLatency = (
  callback: (data: LatencyData) => void,
  interval: number = 5000
): (() => void) => {
  const intervalId = setInterval(() => {
    const servers = mockExchangeServers;
    const fromServer = servers[Math.floor(Math.random() * servers.length)];
    const toServer = servers[Math.floor(Math.random() * servers.length)];
    
    if (fromServer.id !== toServer.id) {
      const latency = Math.random() * 200 + 10;
      const status = latency < 50 ? 'low' : latency < 100 ? 'medium' : 'high';
      
      const latencyData: LatencyData = {
        id: `${fromServer.id}-${toServer.id}-${Date.now()}`,
        fromServerId: fromServer.id,
        toServerId: toServer.id,
        latency: Math.round(latency),
        timestamp: Date.now(),
        status,
      };
      
      callback(latencyData);
    }
  }, interval);
  
  return () => clearInterval(intervalId);
};

// Convert lat/lng to 3D coordinates
export const latLngTo3D = (lat: number, lng: number, radius: number = 1): [number, number, number] => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  
  return [x, y, z];
};

// Get distance between two points on Earth
export const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}; 

// Map country names to ISO country codes for Cloudflare Radar
const countryNameToCode: Record<string, string> = {
  'Singapore': 'SG',
  'Hong Kong': 'HK',
  'Netherlands': 'NL',
  'UAE': 'AE',
  'USA': 'US',
  'China': 'CN',
  // Add more as needed
};

export function getCountryCode(countryName: string): string {
  return countryNameToCode[countryName] || 'US';
}

// Fetch real latency data for all unique exchange pairs using Cloudflare Radar
export async function getCloudflareLatencyData(): Promise<LatencyData[]> {
  const servers = mockExchangeServers;
  const data: LatencyData[] = [];
  const now = Date.now();
  for (let i = 0; i < servers.length; i++) {
    for (let j = i + 1; j < servers.length; j++) {
      const fromCode = getCountryCode(servers[i].location.country);
      const toCode = getCountryCode(servers[j].location.country);
      try {
        const latency = await fetchCountryLatency(fromCode, toCode);
        const avg = latency?.avg || 100;
        let status: 'low' | 'medium' | 'high' = 'high';
        if (avg < 50) status = 'low';
        else if (avg < 100) status = 'medium';
        data.push({
          id: `${servers[i].id}-${servers[j].id}`,
          fromServerId: servers[i].id,
          toServerId: servers[j].id,
          latency: Math.round(avg),
          timestamp: now,
          status,
        });
      } catch {
        // fallback to mock value if error
        data.push({
          id: `${servers[i].id}-${servers[j].id}`,
          fromServerId: servers[i].id,
          toServerId: servers[j].id,
          latency: 100,
          timestamp: now,
          status: 'high',
        });
      }
    }
  }
  return data;
} 

export async function fetchMockApiLatencyData(): Promise<LatencyData[]> {
  const res = await fetch('/api/latency');
  const apiData: Array<{ from: string; to: string; latency: number }> = await res.json();
  const now = Date.now();
  return apiData.map((item, idx) => ({
    id: `mock-${item.from}-${item.to}-${now}-${idx}`,
    fromServerId: item.from,
    toServerId: item.to,
    latency: item.latency,
    timestamp: now,
    status: item.latency < 50 ? 'low' : item.latency < 100 ? 'medium' : 'high',
  }));
} 