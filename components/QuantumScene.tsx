
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Torus, Cylinder, Stars, Environment, Box, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Fix for JSX intrinsic elements missing from type definitions in the current environment
// Using PascalCase variables for Three.js elements bypasses the strict IntrinsicElements check
const Group = 'group' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const AmbientLight = 'ambientLight' as any;
const SpotLight = 'spotLight' as any;
const PointLight = 'pointLight' as any;

const QuantumParticle = ({ position, color, scale = 1, speed = 1 }: { position: [number, number, number]; color: string; scale?: number; speed?: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime() * speed;
      ref.current.position.y = position[1] + Math.sin(t * 1.5 + position[0]) * 0.4;
      ref.current.position.x = position[0] + Math.cos(t * 0.8 + position[2]) * 0.2;
      ref.current.rotation.x = t * 0.5;
      ref.current.rotation.z = t * 0.3;
    }
  });

  return (
    <Sphere ref={ref} args={[1, 64, 64]} position={position} scale={scale}>
      <MeshDistortMaterial
        color={color}
        envMapIntensity={2}
        clearcoat={1}
        clearcoatRoughness={0}
        metalness={0.7}
        roughness={0.1}
        distort={0.4}
        speed={speed * 2}
      />
    </Sphere>
  );
};

const MacroscopicWave = () => {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
       const t = state.clock.getElapsedTime();
       ref.current.rotation.z = t * 0.05;
       ref.current.rotation.y = Math.sin(t * 0.1) * 0.2;
    }
  });

  return (
    <Group ref={ref}>
      <Torus args={[3, 0.02, 16, 128]} rotation={[Math.PI / 2, 0, 0]}>
        <MeshStandardMaterial color="#C5A059" emissive="#C5A059" emissiveIntensity={1} transparent opacity={0.4} />
      </Torus>
      <Torus args={[3.5, 0.01, 16, 128]} rotation={[Math.PI / 2, 0.2, 0]}>
        <MeshStandardMaterial color="#4F46E5" emissive="#4F46E5" emissiveIntensity={0.5} transparent opacity={0.2} />
      </Torus>
    </Group>
  );
}

export const HeroScene: React.FC = () => {
  const particles = useMemo(() => [
    { position: [0, 0, 0] as [number, number, number], color: "#4F46E5", scale: 1.2, speed: 0.5 },
    { position: [-4, 2, -3] as [number, number, number], color: "#9333EA", scale: 0.5, speed: 0.8 },
    { position: [4, -1, -2] as [number, number, number], color: "#C5A059", scale: 0.7, speed: 0.4 },
    { position: [-2, -2.5, -1] as [number, number, number], color: "#3B82F6", scale: 0.4, speed: 1.2 },
  ], []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={40} />
        <AmbientLight intensity={0.4} />
        <SpotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#C5A059" />
        
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
          {particles.map((p, i) => (
            <QuantumParticle key={i} {...p} />
          ))}
          <MacroscopicWave />
        </Float>

        <Environment preset="night" />
        <Stars radius={150} depth={50} count={2000} factor={4} saturation={0.5} fade speed={0.5} />
      </Canvas>
    </div>
  );
};

export const QuantumComputerScene: React.FC<{ theme?: 'light' | 'dark' }> = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={35} />
        <AmbientLight intensity={isDark ? 0.8 : 0.4} />
        <SpotLight position={[5, 10, 5]} angle={0.3} penumbra={1} intensity={isDark ? 5 : 2} color="#C5A059" />
        <PointLight position={[-5, -5, -5]} intensity={isDark ? 1 : 0.5} color="#4F46E5" />
        <Environment preset={isDark ? "night" : "studio"} />
        
        <Float rotationIntensity={0.6} floatIntensity={0.3} speed={2}>
          <Group position={[0, -0.4, 0]} rotation={[0.2, 0.4, 0]}>
            {/* Main Plates */}
            <Cylinder args={[1.2, 1.2, 0.05, 64]} position={[0, 1.2, 0]}>
              <MeshStandardMaterial color="#C5A059" metalness={1} roughness={0.1} />
            </Cylinder>
            
            <Cylinder args={[1, 1, 0.05, 64]} position={[0, 0.4, 0]}>
              <MeshStandardMaterial color="#C5A059" metalness={1} roughness={0.1} />
            </Cylinder>
            
            <Cylinder args={[0.7, 0.7, 0.05, 64]} position={[0, -0.4, 0]}>
              <MeshStandardMaterial color="#C5A059" metalness={1} roughness={0.1} />
            </Cylinder>

            {/* Support Rods */}
            {[0, 1, 2, 3].map((i) => {
              const angle = (i * Math.PI) / 2;
              const r = 0.8;
              return (
                <Cylinder 
                  key={i}
                  args={[0.02, 0.02, 1.6, 16]} 
                  position={[Math.cos(angle) * r, 0.4, Math.sin(angle) * r]}
                >
                  <MeshStandardMaterial color="#E5E7EB" metalness={0.9} roughness={0.1} />
                </Cylinder>
              );
            })}

            {/* Central core */}
            <Torus args={[0.4, 0.01, 16, 64]} position={[0, -0.4, 0]} rotation={[Math.PI/2, 0, 0]}>
               <MeshStandardMaterial color="#B87333" metalness={1} roughness={0.2} />
            </Torus>
            
            <Sphere args={[0.15, 32, 32]} position={[0, -0.4, 0]}>
                <MeshDistortMaterial 
                  color="#C5A059" 
                  emissive="#C5A059" 
                  emissiveIntensity={isDark ? 2 : 0.5} 
                  distort={0.3} 
                  speed={4} 
                />
            </Sphere>

            {/* Sycamore processor unit */}
            <Box args={[0.3, 0.1, 0.3]} position={[0, -0.6, 0]}>
                <MeshStandardMaterial color={isDark ? "#111" : "#333"} metalness={1} roughness={0.05} />
            </Box>
          </Group>
        </Float>
      </Canvas>
    </div>
  );
}
