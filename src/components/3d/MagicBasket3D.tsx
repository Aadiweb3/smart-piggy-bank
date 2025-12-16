import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Sparkles, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useWalletStore } from '@/store/walletStore';

function Basket() {
  const basketRef = useRef<THREE.Group>(null);
  const { totalDeposited } = useWalletStore();
  
  // Glow intensity based on balance
  const glowIntensity = useMemo(() => {
    return Math.min(2, 0.5 + (totalDeposited / 5000) * 1.5);
  }, [totalDeposited]);

  useFrame((state) => {
    if (basketRef.current) {
      basketRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={basketRef}>
      {/* Basket body - glass bowl shape */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          thickness={0.3}
          chromaticAberration={0.2}
          anisotropy={0.3}
          distortion={0.1}
          color="#7f5af0"
          transmission={0.9}
          roughness={0.1}
          ior={1.5}
        />
      </mesh>

      {/* Basket rim */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[1, 0.05, 16, 100]} />
        <meshStandardMaterial 
          color="#a78bfa"
          metalness={0.8}
          roughness={0.2}
          emissive="#7f5af0"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Handle */}
      <mesh position={[0, 0.6, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.5, 0.04, 16, 100, Math.PI]} />
        <meshStandardMaterial 
          color="#a78bfa"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Inner glow */}
      <pointLight 
        position={[0, -0.3, 0]} 
        intensity={glowIntensity} 
        color="#7f5af0" 
        distance={2} 
      />
      <pointLight 
        position={[0, -0.3, 0]} 
        intensity={glowIntensity * 0.5} 
        color="#2cb67d" 
        distance={1.5} 
      />

      {/* Coins inside */}
      <BasketCoins />
    </group>
  );
}

function BasketCoins() {
  const { totalDeposited } = useWalletStore();
  const coinsRef = useRef<THREE.Group>(null);
  
  const coinCount = useMemo(() => {
    return Math.min(15, Math.floor(totalDeposited / 200) + 3);
  }, [totalDeposited]);

  const coinPositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < coinCount; i++) {
      const radius = Math.random() * 0.5;
      const angle = Math.random() * Math.PI * 2;
      const height = -0.3 - Math.random() * 0.4;
      positions.push([
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius,
      ]);
    }
    return positions;
  }, [coinCount]);

  useFrame((state) => {
    if (coinsRef.current) {
      coinsRef.current.children.forEach((coin, i) => {
        coin.rotation.y += 0.01 + i * 0.002;
        coin.position.y += Math.sin(state.clock.elapsedTime * 2 + i) * 0.001;
      });
    }
  });

  return (
    <group ref={coinsRef}>
      {coinPositions.map((pos, i) => (
        <mesh key={i} position={pos} rotation={[Math.random() * 0.5, 0, Math.random() * 0.5]} scale={0.12}>
          <cylinderGeometry args={[1, 1, 0.2, 32]} />
          <meshStandardMaterial 
            color="#fbbf24" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#f59e0b"
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

function MagicBasketScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} color="#7f5af0" />
      
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
        <Basket />
      </Float>
      
      <Sparkles
        count={40}
        scale={4}
        size={1.5}
        speed={0.3}
        color="#fbbf24"
      />
      
      <Environment preset="city" />
    </>
  );
}

interface MagicBasket3DProps {
  className?: string;
}

export default function MagicBasket3D({ className }: MagicBasket3DProps) {
  return (
    <div className={`w-full h-full ${className || ''}`}>
      <Canvas
        camera={{ position: [0, 1, 3], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <MagicBasketScene />
      </Canvas>
    </div>
  );
}
