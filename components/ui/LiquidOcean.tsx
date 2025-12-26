
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float } from "@react-three/drei";

// Fix: Define Three.js intrinsic elements as any-typed constants to bypass JSX type errors in environments where IntrinsicElements are not properly extended.
const Mesh = "mesh" as any;
const Primitive = "primitive" as any;
const MeshStandardMaterial = "meshStandardMaterial" as any;
const BoxGeometry = "boxGeometry" as any;
const Color = "color" as any;
const AmbientLight = "ambientLight" as any;
const PointLight = "pointLight" as any;

interface LiquidOceanProps {
  backgroundColor?: number | string;
  accentColor?: number | string;
  oceanFragments?: number;
  waveAmplitude?: number;
  rotationSpeed?: number;
  children?: React.ReactNode;
}

const OceanMesh = ({ 
  accentColor = 0x00ff88, 
  oceanFragments = 30, 
  waveAmplitude = 0.15 
}: { 
  accentColor?: number | string; 
  oceanFragments?: number; 
  waveAmplitude?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create geometry once
  const geometry = useMemo(() => new THREE.PlaneGeometry(25, 25, oceanFragments, oceanFragments), [oceanFragments]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const { clock } = state;
    const positions = meshRef.current.geometry.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      
      // Calculate wave height using multiple sin/cos waves for complexity
      const z = Math.sin(x * 0.5 + clock.getElapsedTime()) * waveAmplitude +
                Math.cos(y * 0.3 + clock.getElapsedTime() * 0.8) * waveAmplitude;
      
      positions.setZ(i, z);
    }
    positions.needsUpdate = true;
  });

  return (
    // Fix: Using constant instead of intrinsic lowercase tag
    <Mesh ref={meshRef} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -2, 0]}>
      {/* Fix: Using constant instead of intrinsic lowercase tag */}
      <Primitive object={geometry} attach="geometry" />
      {/* Fix: Using constant instead of intrinsic lowercase tag */}
      <MeshStandardMaterial 
        color={accentColor} 
        wireframe 
        transparent 
        opacity={0.15} 
        emissive={accentColor} 
        emissiveIntensity={0.5} 
      />
    </Mesh>
  );
};

const FloatingBoxes = () => {
  const count = 20;
  const boxes = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 20,
      ] as [number, number, number],
      size: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.5 + 0.1,
    }));
  }, []);

  return (
    <>
      {boxes.map((box, i) => (
        <Float 
          key={i} 
          speed={box.speed * 2} 
          rotationIntensity={1} 
          floatIntensity={2} 
          position={box.position}
        >
          {/* Fix: Using constant instead of intrinsic lowercase tag */}
          <Mesh>
            {/* Fix: Using constant instead of intrinsic lowercase tag */}
            <BoxGeometry args={[box.size, box.size, box.size]} />
            {/* Fix: Using constant instead of intrinsic lowercase tag */}
            <MeshStandardMaterial 
              color={i % 2 === 0 ? "#00ff88" : "#ff0055"} 
              transparent 
              opacity={0.3} 
              wireframe
            />
          </Mesh>
        </Float>
      ))}
    </>
  );
};

export const LiquidOcean: React.FC<LiquidOceanProps> = ({
  backgroundColor = "#050505",
  accentColor = "#00ff88",
  oceanFragments = 30,
  waveAmplitude = 0.15,
  rotationSpeed = 0.0005,
  children
}) => {
  return (
    <div className="relative w-full h-full min-h-screen bg-[#050505]">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 5, 15], fov: 45 }}>
          {/* Fix: Using constant instead of intrinsic lowercase tag */}
          <Color attach="background" args={[backgroundColor as any]} />
          {/* Fix: Using constant instead of intrinsic lowercase tag */}
          <AmbientLight intensity={0.5} />
          {/* Fix: Using constant instead of intrinsic lowercase tag */}
          <PointLight position={[10, 10, 10]} intensity={1} color="#00ff88" />
          {/* Fix: Using constant instead of intrinsic lowercase tag */}
          <PointLight position={[-10, 5, -10]} intensity={0.5} color="#ff0055" />
          
          <OceanMesh 
            accentColor={accentColor} 
            oceanFragments={oceanFragments} 
            waveAmplitude={waveAmplitude} 
          />
          <FloatingBoxes />
          
          <SceneController rotationSpeed={rotationSpeed} />
        </Canvas>
      </div>
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

const SceneController = ({ rotationSpeed }: { rotationSpeed: number }) => {
  useFrame((state) => {
    const { camera } = state;
    camera.position.x = Math.sin(state.clock.getElapsedTime() * rotationSpeed) * 15;
    camera.position.z = Math.cos(state.clock.getElapsedTime() * rotationSpeed) * 15;
    camera.lookAt(0, 0, 0);
  });
  return null;
};
