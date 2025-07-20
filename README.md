# Latency Topology Visualizer

A real-time 3D visualization application that displays cryptocurrency exchange server locations and latency data across AWS, GCP, and Azure cloud regions.

## 🚀 Features

### Core Functionality
- **3D World Map**: Interactive globe visualization with smooth camera controls
- **Exchange Server Markers**: Visual representation of major cryptocurrency exchanges
- **Real-time Latency Monitoring**: Live latency data between exchange servers
- **Cloud Region Visualization**: AWS, GCP, and Azure region markers
- **Historical Data Charts**: Time-series analysis of latency trends

### Interactive Controls
- **Filtering**: Filter by exchange, cloud provider, and latency range
- **Camera Controls**: Rotate, zoom, and pan the 3D map
- **Layer Toggle**: Show/hide different visualization layers
- **Real-time Updates**: Live data updates every 3 seconds

### Performance Metrics
- **System Status**: Real-time health monitoring
- **Connection Count**: Active latency connections
- **Average Latency**: Current system performance
- **Server Statistics**: Comprehensive server information

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 with TypeScript
- **3D Graphics**: Three.js with React Three Fiber
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Data**: Mock data with real-time simulation

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd latency-topology-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Usage

### Basic Navigation
- **Left Click**: Select exchange servers
- **Right Click + Drag**: Rotate the camera
- **Scroll**: Zoom in/out
- **Drag**: Pan the camera

### Control Panel
- **Visualization Layers**: Toggle real-time latency, historical data, and cloud regions
- **Exchange Filter**: Select specific exchanges to display
- **Cloud Provider Filter**: Filter by AWS, GCP, or Azure
- **Latency Range**: Set minimum and maximum latency thresholds
- **Map Controls**: Auto-rotate, grid display, and axis visibility

### Historical Analysis
- **Server Pair Selection**: Choose specific exchange pairs
- **Time Range**: View data for 1 hour, 24 hours, 7 days, or 30 days
- **Statistics**: Min, max, and average latency values
- **Interactive Charts**: Hover for detailed information

## 📊 Data Sources

### Exchange Servers
- **Binance**: Singapore (AWS)
- **OKX**: Hong Kong (GCP)
- **Deribit**: Amsterdam (Azure)
- **Bybit**: Dubai (AWS)
- **Coinbase**: San Francisco (AWS)
- **Kraken**: Seattle (GCP)
- **Bitfinex**: New York (Azure)
- **KuCoin**: Beijing (AWS)

### Cloud Regions
- **AWS**: us-east-1, us-west-1, eu-west-1, ap-southeast-1
- **GCP**: us-central1, europe-west1, asia-east1
- **Azure**: eastus, westeurope, eastasia

### Latency Simulation
- **Real-time Updates**: Every 3 seconds
- **Latency Range**: 10-210ms
- **Status Classification**:
  - Green: <50ms (Low)
  - Yellow: 50-100ms (Medium)
  - Red: >100ms (High)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main application page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── WorldMap.tsx       # 3D world map component
│   ├── ControlPanel.tsx   # Control panel interface
│   ├── HistoricalChart.tsx # Historical data charts
│   ├── Legend.tsx         # Visualization legend
│   └── LoadingScreen.tsx  # Loading screen
├── hooks/                 # Custom React hooks
│   └── useRealTimeData.ts # Real-time data management
├── lib/                   # Utility libraries
│   └── dataService.ts     # Data generation and utilities
├── store/                 # State management
│   └── useStore.ts        # Zustand store
└── types/                 # TypeScript type definitions
    └── index.ts           # Core type definitions
```

## 🎨 Customization

### Adding New Exchanges
1. Update `mockExchangeServers` in `src/lib/dataService.ts`
2. Add server location and cloud provider information
3. The visualization will automatically include the new exchange

### Modifying Latency Simulation
1. Edit the `simulateRealTimeLatency` function in `src/lib/dataService.ts`
2. Adjust update frequency and latency ranges
3. Customize status thresholds

### Styling Changes
1. Modify `src/app/globals.css` for global styles
2. Update component-specific styles in individual components
3. Customize Tailwind classes for responsive design

## 🔧 Development

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks (if configured)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request


## 🙏 Acknowledgments

- **Three.js**: 3D graphics library
- **React Three Fiber**: React renderer for Three.js
- **Next.js**: React framework
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: State management
- **Recharts**: Chart library


---

**Note**: This application uses mock data for demonstration purposes. In a production environment, you would integrate with real latency monitoring APIs and exchange server data sources.