import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function FoodSphere({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
      ref.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={ref} position={position}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <MeshDistortMaterial color={color} distort={0.3} speed={2} roughness={0.2} metalness={0.1} />
      </mesh>
    </Float>
  );
}

function Donut({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.4;
      ref.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.8} floatIntensity={2}>
      <mesh ref={ref} position={position}>
        <torusGeometry args={[0.6, 0.25, 16, 32]} />
        <MeshDistortMaterial color={color} distort={0.15} speed={1.5} roughness={0.3} />
      </mesh>
    </Float>
  );
}

const Hero3DScene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }} className="absolute inset-0" style={{ background: "transparent" }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#fff5e6" />
      <pointLight position={[-3, 2, 2]} intensity={0.8} color="#e8750a" />
      <pointLight position={[3, -2, 2]} intensity={0.5} color="#ff9a3c" />

      <FoodSphere position={[-2.5, 1, 0]} color="#e8750a" speed={0.8} />
      <FoodSphere position={[2.8, -0.5, -1]} color="#ff9a3c" speed={0.6} />
      <Donut position={[0, -1.5, 0.5]} color="#d4583a" />
      <Donut position={[-1.5, -0.5, -2]} color="#f4a261" />
      <FoodSphere position={[1.5, 1.8, -1.5]} color="#2a9d8f" speed={0.4} />
    </Canvas>
  );
};

export default Hero3DScene;
