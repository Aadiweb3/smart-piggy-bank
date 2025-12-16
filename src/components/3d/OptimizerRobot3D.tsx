import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useWalletStore } from '@/store/walletStore';

function DataRing({ radius, speed, color, thickness = 0.02 }: { 
  radius: number; 
  speed: number; 
  color: string;
  thickness?: number;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  const { optimizerStatus } = useWalletStore();
  
  const speedMultiplier = useMemo(() => {
    switch (optimizerStatus) {
      case 'scanning': return 2;
      case 'analyzing': return 3;
      case 'rebalancing': return 4;
      default: return 1;
    }
  }, [optimizerStatus]);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x += speed * speedMultiplier * 0.01;
      ringRef.current.rotation.y += speed * speedMultiplier * 0.005;
    }
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[radius, thickness, 16, 100]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function CoreOrb() {
  const orbRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const { optimizerStatus } = useWalletStore();
  
  const statusColor = useMemo(() => {
    switch (optimizerStatus) {
      case 'scanning': return '#22c55e';
      case 'analyzing': return '#3b82f6';
      case 'rebalancing': return '#ff8906';
      default: return '#7f5af0';
    }
  }, [optimizerStatus]);

  useFrame((state) => {
    if (orbRef.current && glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
      orbRef.current.scale.setScalar(pulse);
      glowRef.current.scale.setScalar(pulse * 1.5);
    }
  });

  return (
    <group>
      {/* Inner core */}
      <mesh ref={orbRef}>
        <sphereGeometry args={[0.3, 64, 64]} />
        <meshStandardMaterial 
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial 
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Point light for glow effect */}
      <pointLight color={statusColor} intensity={3} distance={5} />
    </group>
  );
}

function DataParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const { optimizerStatus } = useWalletStore();
  
  const particleCount = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 0.8 + Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const speed = optimizerStatus === 'idle' ? 0.1 : 0.3;
      particlesRef.current.rotation.y += speed * 0.01;
      particlesRef.current.rotation.x += speed * 0.005;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#7f5af0"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function OptimizerScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <group>
          <CoreOrb />
          
          {/* Data rings */}
          <group rotation={[0.3, 0, 0]}>
            <DataRing radius={0.6} speed={1} color="#7f5af0" />
          </group>
          <group rotation={[0.8, 0.5, 0]}>
            <DataRing radius={0.75} speed={1.5} color="#2cb67d" />
          </group>
          <group rotation={[0.2, 0.8, 0.3]}>
            <DataRing radius={0.9} speed={0.8} color="#ff8906" thickness={0.015} />
          </group>
          
          <DataParticles />
        </group>
      </Float>
      
      <Sparkles
        count={30}
        scale={3}
        size={1}
        speed={0.3}
        color="#7f5af0"
      />
      
      <Environment preset="night" />
    </>
  );
}

interface OptimizerRobot3DProps {
  className?: string;
}

export default function OptimizerRobot3D({ className }: OptimizerRobot3DProps) {
  return (
    <div className={`w-full h-full ${className || ''}`}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <OptimizerScene />
      </Canvas>
    </div>
  );
}
