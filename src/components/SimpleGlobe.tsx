import React, { useEffect, useRef } from 'react';
import Globe, { GlobeInstance } from 'globe.gl';
import * as THREE from 'three';
import { useStore } from '../store/useStore';

interface GlobePoint {
  type: string;
  color: string;
  label: string;
  size?: number;
}

const providerColor = (provider: string) => {
  switch (provider) {
    case 'AWS': return '#FF9900';
    case 'GCP': return '#4285F4';
    case 'Azure': return '#00A4EF';
    default: return '#6b7280';
  }
};

function createLatLonGrid() {
  const group = new THREE.Group();
  group.name = 'latlon-grid';
  // Latitude lines
  for (let lat = -60; lat <= 60; lat += 30) {
    const curve = new THREE.EllipseCurve(
      0, 0, 1 * Math.cos((lat * Math.PI) / 180), 1, 0, 2 * Math.PI, false, 0
    );
    const points = curve.getPoints(128).map(p => new THREE.Vector3(p.x, Math.sin((lat * Math.PI) / 180), p.y));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: '#444', opacity: 0.5, transparent: true }));
    group.add(line);
  }
  // Longitude lines
  for (let lng = 0; lng < 360; lng += 30) {
    const points = [];
    for (let lat = -90; lat <= 90; lat += 2) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -Math.sin(phi) * Math.cos(theta);
      const y = Math.cos(phi);
      const z = Math.sin(phi) * Math.sin(theta);
      points.push(new THREE.Vector3(x, y, z));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: '#444', opacity: 0.5, transparent: true }));
    group.add(line);
  }
  return group;
}

const AXIS_NAME = 'globe-axes-helper';

const SimpleGlobe: React.FC = () => {
  const globeEl = useRef<HTMLDivElement>(null);
  const globeInstance = useRef<GlobeInstance | null>(null);
  const {
    exchangeServers,
    cloudRegions,
    latencyData,
    getLatencyColor,
    mapControls,
  } = useStore();

  // Prepare points for exchange servers
  const serverPoints = exchangeServers.map(server => ({
    ...server,
    lat: server.location.lat,
    lng: server.location.lng,
    color: providerColor(server.cloudProvider),
    size: 0.6,
    type: 'server',
    label: `${server.name} (${server.cloudProvider})\n${server.location.city}, ${server.location.country}`
  }));

  // Prepare points for cloud regions
  const regionPoints = cloudRegions.map(region => ({
    ...region,
    lat: region.location.lat,
    lng: region.location.lng,
    color: region.color,
    size: 1.0,
    type: 'region',
    label: `${region.provider} Region: ${region.name}\nCode: ${region.code}\nServers: ${region.serverCount}`
  }));

  // Prepare arcs for latency connections
  const arcs = latencyData
    .map(conn => {
      const from = exchangeServers.find(s => s.id === conn.fromServerId);
      const to = exchangeServers.find(s => s.id === conn.toServerId);
      if (!from || !to) return null;
      return {
        startLat: from.location.lat,
        startLng: from.location.lng,
        endLat: to.location.lat,
        endLng: to.location.lng,
        color: getLatencyColor(conn.latency),
        label: `${from.name} → ${to.name}\nLatency: ${conn.latency}ms`,
        status: conn.status,
        order: conn.latency,
      };
    })
    .filter((arc): arc is NonNullable<typeof arc> => !!arc);

  // Only create the globe instance once
  useEffect(() => {
    const el = globeEl.current;
    if (el && !globeInstance.current) {
      globeInstance.current = new (Globe as unknown as { new (el: HTMLElement): GlobeInstance })(el)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .width(window.innerWidth)
        .height(window.innerHeight)
        .pointAltitude(() => 0.02)
        .pointRadius('size')
        .pointLabel('label')
        .customThreeObject((d: object) => {
          if (typeof d === 'object' && d && 'type' in d && (d as Record<string, unknown>).type === 'region') {
            const region = d as GlobePoint;
            const mesh = new THREE.Mesh(
              new THREE.SphereGeometry(0.055, 16, 16),
              new THREE.MeshStandardMaterial({ color: region.color, opacity: 0.85, transparent: true, emissive: region.color, emissiveIntensity: 0.5 })
            );
            mesh.userData = { label: region.label };
            return mesh;
          }
          const dummy = new THREE.Object3D();
          dummy.visible = false;
          return dummy;
        })
        .customThreeObjectUpdate((obj: THREE.Object3D, d: object) => {
          if (obj && d && typeof d === 'object' && 'type' in d && (d as Record<string, unknown>).type === 'region') {
            obj.userData = { label: (d as Record<string, unknown>).label };
          }
        })
        .arcAltitude(() => 0.19)
        .arcStroke(2.8)
        .arcDashLength(0.5)
        .arcDashGap(0.2)
        .arcDashInitialGap(() => Math.random())
        .arcDashAnimateTime(1400)
        .arcLabel('label')
        .arcColor((arc: unknown) => {
          if (arc && typeof arc === 'object' && 'color' in arc) {
            return String((arc as { color: string }).color);
          }
          return '#fff';
        });
    }
    // Clean up on unmount
    return () => {
      if (el) el.replaceChildren();
      globeInstance.current = null;
    };
  }, []);

  // Only update data, not the globe instance
  useEffect(() => {
    if (globeInstance.current) {
      globeInstance.current
        .pointsData(serverPoints)
        .pointLat('lat')
        .pointLng('lng')
        .pointColor('color')
        .customLayerData(regionPoints)
        .arcsData(arcs)
        .arcStartLat('startLat')
        .arcStartLng('startLng')
        .arcEndLat('endLat')
        .arcEndLng('endLng')
        .arcColor('color');
    }
  }, [serverPoints, regionPoints, arcs]);

  // Auto-rotate effect
  useEffect(() => {
    if (globeInstance.current && typeof globeInstance.current.controls === 'function') {
      globeInstance.current.controls().autoRotate = mapControls.autoRotate;
      globeInstance.current.controls().autoRotateSpeed = 0.5;
    }
  }, [mapControls.autoRotate]);

  // Grid overlay effect
  useEffect(() => {
    if (globeInstance.current && globeInstance.current.scene) {
      // Remove existing grid
      const existing = globeInstance.current.scene().getObjectByName('latlon-grid');
      if (existing) globeInstance.current.scene().remove(existing);
      if (mapControls.showGrid) {
        globeInstance.current.scene().add(createLatLonGrid());
      }
    }
  }, [mapControls.showGrid]);

  // Axis overlay effect
  useEffect(() => {
    if (globeInstance.current && globeInstance.current.scene) {
      // Remove existing axis
      const existing = globeInstance.current.scene().getObjectByName(AXIS_NAME);
      if (existing) globeInstance.current.scene().remove(existing);
      if (mapControls.showAxis) {
        const axis = new THREE.AxesHelper(1.2);
        axis.name = AXIS_NAME;
        globeInstance.current.scene().add(axis);
      }
    }
  }, [mapControls.showAxis]);

  return <div ref={globeEl} style={{ width: '100vw', height: '100vh', position: 'absolute', inset: 0, zIndex: 0 }} />;
};

export default SimpleGlobe; 