import React, { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

/*
  A 3D modell külön chunkban él, és csak akkor töltődik be, amikor a
  látogató ténylegesen rámutat a profilképre. Így a three.js (~885 kB) és a
  .glb modell nem terheli az első betöltést — a toborzó a telefonján
  azonnal látja az oldalt.
*/

function AvatarModel({ onReady }) {
  const { scene } = useGLTF("/images/me.glb");
  const modelRef = useRef();

  // useGLTF felfüggeszt, amíg tölt — ide csak betöltött modellel jutunk el.
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  // Balra forgatás (90 fok, radianban: -PI / 2)
  const baseRotationY = -Math.PI / 2;

  useFrame((state) => {
    if (!modelRef.current) return;

    const mouseXOffset = (state.pointer.x * Math.PI) / 6;
    const mouseYOffset = (state.pointer.y * Math.PI) / 6;

    const targetX = -mouseYOffset;
    const targetY = baseRotationY + mouseXOffset;

    modelRef.current.rotation.x = THREE.MathUtils.lerp(
      modelRef.current.rotation.x,
      targetX,
      0.1,
    );
    modelRef.current.rotation.y = THREE.MathUtils.lerp(
      modelRef.current.rotation.y,
      targetY,
      0.1,
    );
  });

  return (
    <group ref={modelRef}>
      <primitive object={scene} scale={3.8} />
    </group>
  );
}

export default function ProfileModel({ onReady }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />

      <Suspense fallback={null}>
        <Center>
          <AvatarModel onReady={onReady} />
        </Center>
      </Suspense>
    </Canvas>
  );
}
