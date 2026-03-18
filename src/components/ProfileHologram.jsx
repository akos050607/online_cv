import React, { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

// --- 3D MODELL KOMPONENS ---
function AvatarModel() {
  // A modell betöltése az images mappából
  const { scene } = useGLTF("/images/me.glb");
  const modelRef = useRef();

  // Balra forgatás (90 fok, radianban: -PI / 2)
  const baseRotationY = -Math.PI / 2;

  useFrame((state) => {
    if (!modelRef.current) return;

    const mouseXOffset = (state.pointer.x * Math.PI) / 6;
    const mouseYOffset = (state.pointer.y * Math.PI) / 6;

    const targetX = -mouseYOffset; 
    const targetY = baseRotationY + mouseXOffset; 

    modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, targetX, 0.1);
    modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, targetY, 0.1);
  });

  return (
    <group ref={modelRef}>
      {/* MÓDOSÍTÁS: A scale értékét 3.8-ra növeltem, hogy még nagyobb legyen.
        Ha tovább szeretnéd növelni, írd át pl. 4.5-re, vagy csökkentsd 3.0-ra! 
      */}
      <primitive object={scene} scale={3.8} />
    </group>
  );
}

// --- FŐ KOMPONENS ---
export default function ProfileHologram() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="w-full h-full min-h-[400px] md:min-h-[500px] relative flex items-center justify-center p-8 bg-transparent cursor-crosshair"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Státusz Indikátor */}
      <div className="absolute top-6 left-6 flex items-center gap-3 z-20">
        <div
          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
            hovered
              ? "bg-[#cc0000] shadow-[0_0_6px_rgba(204,0,0,0.8)]"
              : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`font-mono text-[10px] tracking-[0.2em] transition-colors duration-300 ${hovered ? "text-black" : "text-gray-400"}`}
        >
          {hovered ? "FUNNY_3D_SCAN" : "STANDBY"}
        </div>
      </div>

      {/* Keret és Tartalom */}
      <div className="relative w-full max-w-[260px] aspect-[3/4]">
        {/* WAKE JELZÉS */}
        <div
          className={`absolute bottom-3 right-3 z-30 pointer-events-none transition-opacity duration-700 ${hovered ? "opacity-0" : "opacity-100"}`}
        >
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-2.5 py-1 shadow-sm border border-black/5">
            <div className="w-1.5 h-1.5 bg-[#cc0000] rounded-full animate-pulse"></div>
            <span className="font-mono text-[10px] tracking-widest text-black">
              WAKE
            </span>
          </div>
        </div>

        {/* --- KÉP ÉS 3D MODELL KONTÉNER --- */}
        <div className="absolute inset-0 w-full h-full bg-[#f4f4f4] overflow-hidden">
          
          {/* Színes 2D Kép */}
          <img
            src="/images/me.jpg"
            alt="Profile"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out z-10 ${
              hovered
                ? "opacity-0 scale-105 pointer-events-none"
                : "opacity-100 contrast-[0.85] scale-[0.96]"
            }`}
          />

          {/* 3D Canvas */}
          <div 
            className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out z-0 flex items-center justify-center ${
              hovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[5, 5, 5]} intensity={1.5} />
              
              <Suspense fallback={null}>
                <Center>
                  <AvatarModel />
                </Center>
              </Suspense>
            </Canvas>
          </div>
        </div>

        {/* Célkeresztek */}
        <div
          className={`absolute -top-3 -left-3 w-4 h-4 border-t border-l border-black transition-all duration-500 ease-out ${hovered ? "opacity-100 translate-x-1 translate-y-1" : "opacity-0"}`}
        ></div>
        <div
          className={`absolute -bottom-3 -right-3 w-4 h-4 border-b border-r border-black transition-all duration-500 ease-out ${hovered ? "opacity-100 -translate-x-1 -translate-y-1" : "opacity-0"}`}
        ></div>
      </div>
    </div>
  );
}

// A modell előtöltése
useGLTF.preload("/images/me.glb");