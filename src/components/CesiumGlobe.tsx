import React, { useEffect } from 'react';
import { Viewer, Globe, CameraFlyTo } from 'resium';
import { Ion, buildModuleUrl, Cartesian3 } from 'cesium';

// Set Cesium base URL for static assets
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_CESIUM_BASE_URL) {
  (window as any).CESIUM_BASE_URL = process.env.NEXT_PUBLIC_CESIUM_BASE_URL;
  (buildModuleUrl as any).setBaseUrl?.(process.env.NEXT_PUBLIC_CESIUM_BASE_URL);
}

// Optionally set your Cesium Ion access token (not required for basic globe)
Ion.defaultAccessToken = '';

const CesiumGlobe: React.FC = () => {
  useEffect(() => {
    // Set base URL again in case of hot reload
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_CESIUM_BASE_URL) {
      (window as any).CESIUM_BASE_URL = process.env.NEXT_PUBLIC_CESIUM_BASE_URL;
      (buildModuleUrl as any).setBaseUrl?.(process.env.NEXT_PUBLIC_CESIUM_BASE_URL);
    }
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'absolute', inset: 0, zIndex: 0 }}>
      <Viewer
        full
        baseLayerPicker={true}
        timeline={false}
        animation={false}
        navigationHelpButton={true}
        geocoder={false}
        homeButton={true}
        sceneModePicker={true}
        infoBox={false}
        selectionIndicator={false}
      >
        <Globe enableLighting={true} />
        <CameraFlyTo
          duration={2}
          destination={Cartesian3.fromDegrees(0, 0, 20000000)}
        />
      </Viewer>
    </div>
  );
};

export default CesiumGlobe; 