import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const COFFEE_POS = new THREE.Vector3(0, 0, -4);

const EMPLOYEE_CONFIG = [
  {
    id: 'monitor',
    name: 'Monitor',
    role: 'Monitor Agent',
    tasks: ['Check heartbeat', 'Watch subagents'],
    position: [-6, 0, 3],
  },
  {
    id: 'researcher',
    name: 'Researcher',
    role: 'Research Agent',
    tasks: ['Web research', 'X feed analysis'],
    position: [-2, 0, 3],
  },
  {
    id: 'writer',
    name: 'Writer',
    role: 'Writer Agent',
    tasks: ['Reports', 'Docs', 'Summaries'],
    position: [2, 0, 3],
  },
  {
    id: 'builder',
    name: 'Builder',
    role: 'Builder Agent',
    tasks: ['Code changes', 'Scripts', 'Fixes'],
    position: [6, 0, 3],
  },
  {
    id: 'orchestrator',
    name: 'Orchestrator',
    role: 'Orchestrator',
    tasks: ['Task routing', 'Sub-agent control'],
    position: [0, 0, 7],
  },
];

function Floor() {
  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#1f2937" />
    </mesh>
  );
}

function Desk({ position }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 0.75, 0]}>
        <boxGeometry args={[2.5, 0.2, 1.2]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      <mesh castShadow position={[0, 1.2, -0.3]}>
        <boxGeometry args={[0.6, 0.4, 0.05]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
      <mesh castShadow position={[0, 0.4, 0.9]}>
        <boxGeometry args={[0.8, 0.3, 0.8]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
    </group>
  );
}

function CoffeeMachine() {
  return (
    <group position={COFFEE_POS} castShadow>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.6, 1.2]} />
        <meshStandardMaterial color="#7c2d12" />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.8, 0.3, 0.8]} />
        <meshStandardMaterial emissive="#f97316" emissiveIntensity={0.8} color="#fec89a" />
      </mesh>
      <Html distanceFactor={10} position={[0, 1.9, 0]}>
        <div
          style={{
            padding: '4px 8px',
            background: 'rgba(15,23,42,0.9)',
            borderRadius: 6,
            fontSize: 11,
            color: '#facc15',
            whiteSpace: 'nowrap',
          }}
        >
          ☕ Coffee Machine
        </div>
      </Html>
    </group>
  );
}

function Employee({ config }) {
  const ref = useRef();
  const [energy, setEnergy] = useState(100);
  const [state, setState] = useState('working'); // working | goingToCoffee | returning | ko
  const [target, setTarget] = useState(null);
  const speed = 2.5;
  const home = useRef(new THREE.Vector3(...config.position));

  useFrame((_, delta) => {
    if (!ref.current) return;

    if (state === 'ko') {
      ref.current.rotation.z = Math.PI / 2;
      return;
    }

    setEnergy((prev) => {
      if (state === 'working' || state === 'goingToCoffee' || state === 'returning') {
        const next = prev - delta * 3;
        if (next <= 0) {
          setState('ko');
          return 0;
        }
        if (next < 30 && state === 'working') {
          setState('goingToCoffee');
          setTarget(COFFEE_POS.clone());
        }
        return next;
      }
      return prev;
    });

    if ((state === 'goingToCoffee' || state === 'returning') && target) {
      const pos = ref.current.position;
      const dir = target.clone().sub(pos);
      const dist = dir.length();

      if (dist < 0.1) {
        if (state === 'goingToCoffee') {
          setEnergy(100);
          setState('returning');
          setTarget(home.current.clone());
        } else if (state === 'returning') {
          setState('working');
          setTarget(null);
        }
      } else {
        dir.normalize();
        pos.addScaledVector(dir, speed * delta);
      }
    }
  });

  const colorMap = {
    Monitor: '#22c55e',
    Researcher: '#0ea5e9',
    Writer: '#eab308',
    Builder: '#f97316',
    Orchestrator: '#a855f7',
  };
  const bodyColor = colorMap[config.name] || '#38bdf8';

  const energyColor = energy > 60 ? '#22c55e' : energy > 30 ? '#eab308' : '#f97316';

  return (
    <group ref={ref} position={config.position} castShadow>
      <mesh castShadow position={[0, 1, 0]}>
        <boxGeometry args={[0.7, 1.2, 0.4]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      <mesh castShadow position={[0, 1.9, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      <mesh castShadow position={[-0.2, 0.3, 0]}>
        <boxGeometry args={[0.25, 0.3, 0.4]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh castShadow position={[0.2, 0.3, 0]}>
        <boxGeometry args={[0.25, 0.3, 0.4]} />
        <meshStandardMaterial color="#111827" />
      </mesh>

      <Html distanceFactor={10} position={[0, 2.5, 0]}>
        <div
          style={{
            padding: '6px 10px',
            borderRadius: 8,
            background: 'rgba(15,23,42,0.9)',
            color: '#e5e7eb',
            fontSize: 11,
            minWidth: 120,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 2 }}>
            {config.name} ({config.role})
          </div>
          <div style={{ fontSize: 10, opacity: 0.9, marginBottom: 4 }}>
            {config.tasks.join(' · ')}
          </div>
          <div
            style={{
              height: 4,
              borderRadius: 999,
              background: '#1f2937',
              overflow: 'hidden',
              marginBottom: 2,
            }}
          >
            <div
              style={{
                width: `${energy}%`,
                height: '100%',
                background: energyColor,
                transition: 'width 0.2s linear',
              }}
            />
          </div>
          <div style={{ fontSize: 9, opacity: 0.8 }}>
            {state === 'working' && 'Working'}
            {state === 'goingToCoffee' && 'Heading to coffee...'}
            {state === 'returning' && 'Returning to desk'}
            {state === 'ko' && 'KO ☠️'}
          </div>
        </div>
      </Html>
    </group>
  );
}

export default function WorkspaceScene() {
  return (
    <group>
      <Floor />
      {EMPLOYEE_CONFIG.map((cfg) => (
        <Desk key={cfg.id} position={cfg.position} />
      ))}
      <CoffeeMachine />
      {EMPLOYEE_CONFIG.map((cfg) => (
        <Employee key={cfg.id} config={cfg} />
      ))}
    </group>
  );
}
