import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import WorkspaceScene from './WorkspaceScene.jsx';
import useDashboardState from './useDashboardState.js';

export default function App() {
  const dashboard = useDashboardState();

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* Optional overlay for basic task status */}
      <div
        style={{
          position: 'fixed',
          top: 12,
          left: 12,
          padding: '8px 12px',
          background: 'rgba(15,23,42,0.8)',
          color: '#e5e7eb',
          fontSize: 12,
          borderRadius: 8,
          maxWidth: 320,
          zIndex: 10,
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 4 }}>OpenClaw Task Dashboard</div>
        {dashboard ? (
          <>
            <div style={{ opacity: 0.8, marginBottom: 4 }}>
              업데이트: {new Date(dashboard.generatedAt).toLocaleTimeString()}
            </div>
            {dashboard.tasks
              .filter((t) => t.parentId === null)
              .map((t) => (
                <div key={t.id} style={{ marginBottom: 2 }}>
                  <span style={{ fontWeight: 500 }}>{t.title}</span>
                  <span style={{ opacity: 0.8 }}> · {t.status}</span>
                </div>
              ))}
          </>
        ) : (
          <div style={{ opacity: 0.7 }}>불러오는 중...</div>
        )}
      </div>

      <Canvas camera={{ position: [10, 10, 15], fov: 45 }} shadows>
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 15, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <OrbitControls enableDamping />
        <WorkspaceScene dashboard={dashboard} />
      </Canvas>
    </div>
  );
}
