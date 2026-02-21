import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Plane, Html, Center } from '@react-three/drei';
import * as THREE from 'three';

function FaceTopology({ hovered }) {
  const groupRef = useRef();
  const wireframeRef = useRef();
  
  const [photoTex, depthTex] = useTexture([
    '/images/me.jpg', 
    '/images/me-depth.png'
  ]);
  photoTex.center.set(0.5, 0.5);
  depthTex.center.set(0.5, 0.5);

  const PLANE_WIDTH = 3;
  const PLANE_HEIGHT = 4;

  useFrame((state, delta) => {
    if (wireframeRef.current) {
      const targetScale = hovered ? 1.5 : 0;
      wireframeRef.current.displacementScale = THREE.MathUtils.lerp(
        wireframeRef.current.displacementScale,
        targetScale,
        delta * 4
      );
      wireframeRef.current.opacity = THREE.MathUtils.lerp(
        wireframeRef.current.opacity,
        hovered ? 1 : 0,
        delta * 8
      );
    }
    if (groupRef.current && hovered) {
      const targetRotationX = -(state.pointer.y * Math.PI) / 20;
      const targetRotationY = (state.pointer.x * Math.PI) / 15;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, delta * 2);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, delta * 2);
    } else if (groupRef.current && !hovered) {
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, delta * 2);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, delta * 2);
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <Plane args={[PLANE_WIDTH, PLANE_HEIGHT]} position={[0, 0, -0.01]}>
          <meshBasicMaterial map={photoTex} toneMapped={false} />
        </Plane>

        <Plane args={[PLANE_WIDTH, PLANE_HEIGHT, 24, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial
            ref={wireframeRef}
            displacementMap={depthTex}
            displacementScale={0}
            alphaMap={depthTex}
            transparent={true}
            opacity={0}
            wireframe={true}
            color="#000000"
            toneMapped={false}
          />
        </Plane>
      </Center>
    </group>
  );
}

export default function ProfileHologram() {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="w-full h-full min-h-[500px] relative cursor-crosshair overflow-hidden bg-gray-50/50"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <div className={`absolute top-4 left-4 font-mono text-xs tracking-widest z-10 transition-colors duration-300 ${hovered ? 'text-nothing-red animate-pulse' : 'text-gray-400'}`}>
        [{hovered ? 'SCANNING_TOPOGRAPHY' : 'ID_PHOTO_PORTRAIT'}]
      </div>

      <Canvas camera={{ position: [0, 0, 4.2], fov: 50 }}>
        <ambientLight intensity={3} />
        <Suspense fallback={<Html center className="font-mono text-xs text-gray-500">LOADING SCAN...</Html>}>
          <FaceTopology hovered={hovered} />
        </Suspense>
      </Canvas>
    </div>
  );
}