'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import { latLngTo3D } from '../lib/dataService';
import { TextureLoader } from 'three';
import { ExchangeServer, CloudRegion, LatencyData, VisualizationSettings } from '../types';

// Earth component
const Earth: React.FC = () => {
  const earthTexture = useLoader(TextureLoader, '/earthmap.jpg');
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={earthTexture}
        metalness={0.2}
        roughness={0.7}
      />
    </mesh>
  );
};

// Grid component
const Grid: React.FC<{ showGrid: boolean }> = ({ showGrid }) => {
  if (!showGrid) return null;
  return <gridHelper args={[4, 20, '#374151', '#6b7280']} />;
};

// Exchange server marker component
const ExchangeMarker: React.FC<{
  server: ExchangeServer;
  isSelected: boolean;
  isHovered: boolean;
  setSelectedServer: (id: string | null) => void;
  setHoveredServer: (id: string | null) => void;
}> = ({ server, isSelected, isHovered, setSelectedServer, setHoveredServer }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const position = useMemo(() => {
    return latLngTo3D(server.location.lat, server.location.lng, 1.02);
  }, [server.location.lat, server.location.lng]);

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'AWS': return '#FF9900';
      case 'GCP': return '#4285F4';
      case 'Azure': return '#00A4EF';
      default: return '#6b7280';
    }
  };

  const scale = isSelected ? 1.5 : isHovered ? 1.2 : 1;
  const color = getProviderColor(server.cloudProvider);

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        scale={scale}
        onClick={() => setSelectedServer(isSelected ? null : server.id)}
        onPointerOver={() => setHoveredServer(server.id)}
        onPointerOut={() => setHoveredServer(null)}
      >
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {(isSelected || isHovered) && (
        <Text
          position={[0, 0.05, 0]}
          fontSize={0.02}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {server.name}
        </Text>
      )}
    </group>
  );
};

// Cloud region marker component
const CloudRegionMarker: React.FC<{ region: CloudRegion }> = ({ region }) => {
  const position = useMemo(() => {
    return latLngTo3D(region.location.lat, region.location.lng, 1.01);
  }, [region.location.lat, region.location.lng]);

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshStandardMaterial color={region.color} transparent opacity={0.7} />
      </mesh>
      <Text
        position={[0, 0.04, 0]}
        fontSize={0.015}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {region.code}
      </Text>
    </group>
  );
};

// Latency connection line component
const LatencyConnection: React.FC<{ connection: LatencyData; servers: ExchangeServer[]; getLatencyColor: (latency: number) => string }> = ({ connection, servers, getLatencyColor }) => {
  const fromServer = servers.find(s => s.id === connection.fromServerId);
  const toServer = servers.find(s => s.id === connection.toServerId);

  const fromPos = useMemo(() => {
    return fromServer ? latLngTo3D(fromServer.location.lat, fromServer.location.lng, 1.02) : null;
  }, [fromServer]);
  const toPos = useMemo(() => {
    return toServer ? latLngTo3D(toServer.location.lat, toServer.location.lng, 1.02) : null;
  }, [toServer]);

  if (!fromServer || !toServer || !fromPos || !toPos) return null;

  const color = getLatencyColor(connection.latency);
  const opacity = connection.status === 'high' ? 0.8 : 0.4;

  return (
    <Line
      points={[fromPos, toPos]}
      color={color}
      lineWidth={connection.status === 'high' ? 2 : 1}
      transparent
      opacity={opacity}
    />
  );
};

// Scene component that contains all 3D elements
const Scene: React.FC<{
  servers: ExchangeServer[];
  latencyData: LatencyData[];
  cloudRegions: CloudRegion[];
  selectedServer: string | null;
  hoveredServer: string | null;
  visualizationSettings: VisualizationSettings;
  showGrid: boolean;
  setSelectedServer: (id: string | null) => void;
  setHoveredServer: (id: string | null) => void;
  getLatencyColor: (latency: number) => string;
}> = ({
  servers,
  latencyData,
  cloudRegions,
  selectedServer,
  hoveredServer,
  visualizationSettings,
  showGrid,
  setSelectedServer,
  setHoveredServer,
  getLatencyColor,
}) => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      <Earth />
      <Grid showGrid={showGrid} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      {/* Exchange server markers */}
      {servers.map((server) => (
        <ExchangeMarker
          key={server.id}
          server={server}
          isSelected={selectedServer === server.id}
          isHovered={hoveredServer === server.id}
          setSelectedServer={setSelectedServer}
          setHoveredServer={setHoveredServer}
        />
      ))}
      {/* Cloud region markers */}
      {visualizationSettings.showRegions && cloudRegions.map((region) => (
        <CloudRegionMarker key={region.id} region={region} />
      ))}
      {/* Latency connections */}
      {visualizationSettings.showRealTime && latencyData.map((connection) => (
        <LatencyConnection
          key={connection.id}
          connection={connection}
          servers={servers}
          getLatencyColor={getLatencyColor}
        />
      ))}
    </>
  );
};

// Main WorldMap component
const WorldMap: React.FC = () => {
  // Get all needed state from Zustand before Canvas
  const {
    mapControls,
    getFilteredServers,
    getFilteredLatencyData,
    cloudRegions,
    selectedServer,
    hoveredServer,
    visualizationSettings,
    setSelectedServer,
    setHoveredServer,
    getLatencyColor,
    mapControls: { showGrid },
  } = useStore();

  const servers = getFilteredServers();
  const latencyData = getFilteredLatencyData();

  return (
    <div className="w-full h-full bg-black">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 60 }}
        style={{ background: 'linear-gradient(to bottom, #0f172a, #1e293b)' }}
      >
        <Scene
          servers={servers}
          latencyData={latencyData}
          cloudRegions={cloudRegions}
          selectedServer={selectedServer}
          hoveredServer={hoveredServer}
          visualizationSettings={visualizationSettings as VisualizationSettings}
          showGrid={showGrid}
          setSelectedServer={setSelectedServer}
          setHoveredServer={setHoveredServer}
          getLatencyColor={getLatencyColor}
        />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={mapControls.autoRotate}
          autoRotateSpeed={0.5}
          minDistance={1.5}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
};

export default WorldMap; 