import type { NextApiRequest, NextApiResponse } from 'next';

const mockLatency = [
  { from: 'US', to: 'SG', latency: 180 },
  { from: 'US', to: 'NL', latency: 90 },
  { from: 'SG', to: 'NL', latency: 210 },
  { from: 'US', to: 'HK', latency: 160 },
  { from: 'US', to: 'AE', latency: 200 },
  { from: 'US', to: 'CN', latency: 220 },
  { from: 'SG', to: 'HK', latency: 40 },
  { from: 'SG', to: 'AE', latency: 120 },
  { from: 'SG', to: 'CN', latency: 60 },
  { from: 'NL', to: 'HK', latency: 170 },
  { from: 'NL', to: 'AE', latency: 140 },
  { from: 'NL', to: 'CN', latency: 150 },
  // ...add more as needed
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(mockLatency);
} 