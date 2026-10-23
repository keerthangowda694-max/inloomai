import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Central Core Sphere with pulsating emissive glow
const GovernanceCore = ({ hovered }: { hovered: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const outerWireRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.3;
      meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.15;
    }
    if (outerWireRef.current) {
      outerWireRef.current.rotation.y = -t * 0.4;
      outerWireRef.current.rotation.z = Math.cos(t * 0.25) * 0.2;
    }
  });

  return (
    <group>
      {/* Outer Wireframe Cage */}
      <mesh ref={outerWireRef}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshStandardMaterial
          wireframe
          color={hovered ? '#A99BFF' : '#635BFF'}
          emissive={hovered ? '#635BFF' : '#4538D4'}
          emissiveIntensity={0.6}
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* Solid Luminous Faceted Core */}
      <mesh ref={meshRef}>
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color="#101525"
          emissive="#635BFF"
          emissiveIntensity={hovered ? 1.4 : 0.85}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Internal High-Intensity Light */}
      <pointLight color="#A99BFF" intensity={hovered ? 4.5 : 2.5} distance={6} />
      <pointLight color="#10B981" intensity={hovered ? 3.0 : 1.5} distance={4} position={[0, -0.5, 0]} />
    </group>
  );
};

// Floating Translucent Document Panel
const FloatingDocument = ({
  position,
  rotation,
  label,
  sublabel,
  statusColor = '#635BFF',
  delay = 0,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  label: string;
  sublabel: string;
  statusColor?: string;
  delay?: number;
}) => {
  const meshRef = useRef<THREE.Group>(null!);
  const [active, setActive] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() + delay;
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(t * 1.2) * 0.12;
      meshRef.current.rotation.y = rotation[1] + Math.sin(t * 0.8) * 0.08;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.5}>
      <group
        ref={meshRef}
        position={position}
        rotation={rotation}
        onPointerOver={() => setActive(true)}
        onPointerOut={() => setActive(false)}
      >
        {/* Document Panel Glass Surface */}
        <mesh>
          <planeGeometry args={[1.2, 0.75]} />
          <meshPhysicalMaterial
            color={active ? '#1A233D' : '#101525'}
            transparent
            opacity={0.85}
            roughness={0.15}
            transmission={0.4}
            thickness={0.5}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Panel Border Frame */}
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(1.2, 0.75)]} />
          <lineBasicMaterial
            color={active ? '#A99BFF' : statusColor}
            transparent
            opacity={active ? 1.0 : 0.6}
            linewidth={2}
          />
        </lineSegments>

        {/* Status Indicator Pip */}
        <mesh position={[-0.45, 0.22, 0.02]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color={statusColor} />
        </mesh>

        {/* Text lines representation */}
        <mesh position={[0.05, 0.22, 0.02]}>
          <planeGeometry args={[0.8, 0.025]} />
          <meshBasicMaterial color="#F5F6FF" opacity={0.8} transparent />
        </mesh>
        <mesh position={[-0.05, 0.08, 0.02]}>
          <planeGeometry args={[0.9, 0.02]} />
          <meshBasicMaterial color="#929BB2" opacity={0.6} transparent />
        </mesh>
        <mesh position={[-0.15, -0.06, 0.02]}>
          <planeGeometry args={[0.7, 0.02]} />
          <meshBasicMaterial color="#929BB2" opacity={0.4} transparent />
        </mesh>
        <mesh position={[-0.25, -0.2, 0.02]}>
          <planeGeometry args={[0.5, 0.02]} />
          <meshBasicMaterial color={statusColor} opacity={0.9} transparent />
        </mesh>
      </group>
    </Float>
  );
};

// Evidence Link Lines connecting nodes through the central engine
const EvidenceLinks = () => {
  const lineRef = useRef<THREE.LineSegments>(null!);

  const lines = useMemo(() => {
    const points: number[] = [];
    // Points connecting nodes to center [0,0,0]
    const nodes: [number, number, number][] = [
      [-2.4, 1.2, 0.5],
      [2.3, 1.0, -0.2],
      [-1.8, -1.3, -0.4],
      [2.0, -1.2, 0.4],
      [0.0, 2.2, 0.1],
    ];

    nodes.forEach((pos) => {
      points.push(pos[0], pos[1], pos[2]);
      points.push(0, 0, 0);
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geometry;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (lineRef.current) {
      (lineRef.current.material as THREE.LineBasicMaterial).opacity =
        0.25 + Math.sin(t * 2) * 0.15;
    }
  });

  return (
    <lineSegments ref={lineRef} geometry={lines}>
      <lineBasicMaterial color="#A99BFF" transparent opacity={0.3} />
    </lineSegments>
  );
};

// Stream of Controlled Analytical Particles
const AnalyticalStream = () => {
  const count = 40;
  const particlesRef = useRef<THREE.Points>(null!);

  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const radius = 1.4 + Math.random() * 1.5;
      const angle = (i / count) * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1.6;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
      ph[i] = Math.random() * Math.PI * 2;
    }
    return [pos, ph];
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.8;
    const array = particlesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const currentAngle = (i / count) * Math.PI * 2 + t * 0.5;
      const radius = 1.3 + Math.sin(t + phases[i]) * 0.4;
      array[i * 3] = Math.cos(currentAngle) * radius;
      array[i * 3 + 1] = Math.sin(t * 1.2 + phases[i]) * 0.7;
      array[i * 3 + 2] = Math.sin(currentAngle) * radius;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#A99BFF"
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Main Export Component with Suspense & Fallback
export const GovernanceEngine3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [hovered, setHovered] = useState(false);
  const [hasWebGlError, setHasWebGlError] = useState(false);

  // Fallback CSS poster representation if WebGL is disabled or on reduced-motion devices
  if (hasWebGlError) {
    return (
      <div className={`relative flex items-center justify-center p-8 rounded-2xl glass-panel ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo/20 via-transparent to-mint/10 rounded-2xl" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full border border-indigo/40 bg-navy/80 flex items-center justify-center shadow-glow-indigo animate-pulse">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo to-lavender flex items-center justify-center">
              <span className="font-mono text-xs font-bold text-white">CORE</span>
            </div>
          </div>
          <p className="mt-4 text-xs font-mono text-muted uppercase tracking-wider">
            Governance Core Engine • 500-User Evidence Grounded
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-[380px] md:h-[480px] lg:h-[540px] select-none ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background radial gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo/15 rounded-full blur-3xl pointer-events-none" />

      {/* R3F Canvas */}
      <Canvas
        camera={{ position: [0, 0.4, 5.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        onError={() => setHasWebGlError(true)}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 6, 4]} intensity={1.2} />
        <directionalLight position={[-5, -4, -3]} intensity={0.4} color="#635BFF" />

        {/* Central Luminous Governance Core */}
        <GovernanceCore hovered={hovered} />

        {/* Evidence Links */}
        <EvidenceLinks />

        {/* Controlled Particle Stream */}
        <AnalyticalStream />

        {/* Flow Node 1: Submitted Document (Left) */}
        <FloatingDocument
          position={[-2.4, 0.8, 0.2]}
          rotation={[0.1, 0.4, -0.05]}
          label="Candidate Copy"
          sublabel="Orbit Suite Launch"
          statusColor="#EF4444" // Coral (Flagged claim)
          delay={0}
        />

        {/* Flow Node 2: Approved Source Spec (Top Right) */}
        <FloatingDocument
          position={[2.3, 0.9, -0.3]}
          rotation={[-0.1, -0.35, 0.05]}
          label="Authoritative Spec"
          sublabel="Product Spec v3.0 (500 Users)"
          statusColor="#10B981" // Mint (Verified evidence)
          delay={1.5}
        />

        {/* Flow Node 3: Brand Rules Policy (Bottom Left) */}
        <FloatingDocument
          position={[-1.9, -1.1, -0.2]}
          rotation={[0.15, 0.3, 0.05]}
          label="Brand Rule"
          sublabel="Prohibited 100% Uptime"
          statusColor="#F59E0B" // Amber (Warning rule)
          delay={3.0}
        />

        {/* Flow Node 4: Human Review Stage (Bottom Right) */}
        <FloatingDocument
          position={[2.0, -1.0, 0.3]}
          rotation={[-0.1, -0.25, -0.05]}
          label="Review Queue"
          sublabel="Action: Pending Decision"
          statusColor="#A99BFF" // Lavender (Review pending)
          delay={4.5}
        />
      </Canvas>

      {/* Dimensional Architecture HUD Overlay */}
      <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between pointer-events-none text-[11px] font-mono text-muted/80 border-t border-white/5 pt-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
          <span>STAGE: VERIFIED EVIDENCE PIPELINE</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span className="text-white/40">INPUT → CORE → REPOSITORIES → HUMAN APPROVAL</span>
        </div>
      </div>
    </div>
  );
};
