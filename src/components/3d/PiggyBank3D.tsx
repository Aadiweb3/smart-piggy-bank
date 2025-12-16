import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  MeshTransmissionMaterial, 
  Environment, 
  Sparkles,
  useGLTF,
  Sphere
} from '@react-three/drei';
import * as THREE from 'three';

function GlassPiggyBank() {
  const groupRef = useRef<THREE.Group>(null);
  const coinRefs = useRef<THREE.Mesh[]>([]);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  // Create simplified piggy shape using spheres
  const bodyGeometry = useMemo(() => new THREE.SphereGeometry(1.2, 64, 64), []);
  const headGeometry = useMemo(() => new THREE.SphereGeometry(0.6, 32, 32), []);
  const earGeometry = useMemo(() => new THREE.ConeGeometry(0.15, 0.3, 32), []);
  const snoutGeometry = useMemo(() => new THREE.CylinderGeometry(0.25, 0.2, 0.3, 32), []);
  const legGeometry = useMemo(() => new THREE.CylinderGeometry(0.12, 0.15, 0.4, 16), []);

  return (
    <group ref={groupRef}>
      {/* Main body - glass */}
      <mesh geometry={bodyGeometry} scale={[1, 0.85, 0.9]}>
        <MeshTransmissionMaterial
          backside
          samples={16}
          thickness={0.5}
          chromaticAberration={0.2}
          anisotropy={0.3}
          distortion={0.1}
          distortionScale={0.2}
          temporalDistortion={0.1}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
          color="#a78bfa"
          transmission={0.95}
          roughness={0.05}
          ior={1.5}
        />
      </mesh>

      {/* Head */}
      <mesh geometry={headGeometry} position={[1.1, 0.3, 0]}>
        <MeshTransmissionMaterial
          backside
          samples={16}
          thickness={0.3}
          chromaticAberration={0.1}
          color="#a78bfa"
          transmission={0.95}
          roughness={0.05}
          ior={1.5}
        />
      </mesh>

      {/* Snout */}
      <mesh geometry={snoutGeometry} position={[1.6, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#f0abfc" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Nostrils */}
      <mesh position={[1.75, 0.25, 0.08]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#7c3aed" />
      </mesh>
      <mesh position={[1.75, 0.25, -0.08]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#7c3aed" />
      </mesh>

      {/* Ears */}
      <mesh geometry={earGeometry} position={[0.9, 0.85, 0.25]} rotation={[0.3, 0, 0.3]}>
        <meshStandardMaterial color="#f0abfc" metalness={0.2} roughness={0.5} />
      </mesh>
      <mesh geometry={earGeometry} position={[0.9, 0.85, -0.25]} rotation={[-0.3, 0, 0.3]}>
        <meshStandardMaterial color="#f0abfc" metalness={0.2} roughness={0.5} />
      </mesh>

      {/* Eyes */}
      <mesh position={[1.35, 0.5, 0.2]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#1e1b4b" />
      </mesh>
      <mesh position={[1.35, 0.5, -0.2]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#1e1b4b" />
      </mesh>

      {/* Eye highlights */}
      <mesh position={[1.4, 0.53, 0.22]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[1.4, 0.53, -0.18]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>

      {/* Legs */}
      {[
        [-0.5, -0.9, 0.4],
        [-0.5, -0.9, -0.4],
        [0.5, -0.9, 0.4],
        [0.5, -0.9, -0.4],
      ].map((pos, i) => (
        <mesh key={i} geometry={legGeometry} position={pos as [number, number, number]}>
          <meshStandardMaterial color="#f0abfc" metalness={0.2} roughness={0.5} />
        </mesh>
      ))}

      {/* Coin slot on top */}
      <mesh position={[0, 0.85, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.08, 0.4, 0.02]} />
        <meshStandardMaterial color="#4c1d95" />
      </mesh>

      {/* Tail (curly) */}
      <mesh position={[-1.15, 0.2, 0]}>
        <torusGeometry args={[0.12, 0.04, 16, 32, Math.PI * 1.5]} />
        <meshStandardMaterial color="#f0abfc" metalness={0.2} roughness={0.5} />
      </mesh>

      {/* Inner glow */}
      <pointLight position={[0, 0, 0]} intensity={2} color="#7f5af0" distance={2} />

      {/* Floating coins inside */}
      <FloatingCoins />
    </group>
  );
}

function FloatingCoins() {
  const coinsRef = useRef<THREE.Group>(null);
  
  const coinPositions = useMemo(() => [
    [0.2, 0.1, 0.3],
    [-0.3, -0.2, 0.1],
    [0.1, 0.3, -0.2],
    [-0.2, 0, -0.3],
    [0.3, -0.1, 0],
  ], []);

  useFrame((state) => {
    if (coinsRef.current) {
      coinsRef.current.children.forEach((coin, i) => {
        coin.position.y += Math.sin(state.clock.elapsedTime * 2 + i) * 0.002;
        coin.rotation.y += 0.02;
      });
    }
  });

  return (
    <group ref={coinsRef}>
      {coinPositions.map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} scale={0.15}>
          <cylinderGeometry args={[1, 1, 0.2, 32]} />
          <meshStandardMaterial 
            color="#fbbf24" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#f59e0b"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function IncomingCoins() {
  const coinsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (coinsRef.current) {
      coinsRef.current.children.forEach((coin, i) => {
        const speed = 0.5 + i * 0.1;
        const offset = i * 2;
        const t = ((state.clock.elapsedTime * speed + offset) % 4) / 4;
        
        coin.position.y = 3 - t * 5;
        coin.position.x = Math.sin(t * Math.PI * 2 + i) * 0.5;
        coin.rotation.x += 0.05;
        coin.rotation.z += 0.03;
        
        const scale = Math.sin(t * Math.PI) * 0.3;
        coin.scale.setScalar(Math.max(0.1, scale));
      });
    }
  });

  return (
    <group ref={coinsRef}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} scale={0.2}>
          <cylinderGeometry args={[1, 1, 0.2, 32]} />
          <meshStandardMaterial 
            color="#fbbf24" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#f59e0b"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#7f5af0" />
      <pointLight position={[0, 5, 0]} intensity={1} color="#2cb67d" />
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <GlassPiggyBank />
      </Float>
      
      <IncomingCoins />
      
      <Sparkles
        count={50}
        scale={6}
        size={2}
        speed={0.4}
        color="#7f5af0"
      />
      
      <Environment preset="city" />
    </>
  );
}

interface PiggyBank3DProps {
  className?: string;
}

export default function PiggyBank3D({ className }: PiggyBank3DProps) {
  return (
    <div className={`w-full h-full ${className || ''}`}>
      <Canvas
        camera={{ position: [4, 2, 4], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
