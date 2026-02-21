import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function CoreObject() {
  const outerRef = useRef();
  const innerRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    const targetX = -(state.pointer.y * Math.PI) / 6;
    const targetY = (state.pointer.x * Math.PI) / 6;

    outerRef.current.rotation.x = THREE.MathUtils.lerp(outerRef.current.rotation.x, targetX, 0.1);
    outerRef.current.rotation.y = THREE.MathUtils.lerp(outerRef.current.rotation.y, targetY + (t * 0.2), 0.1);
    
    const pulse = 1 + Math.sin(t * 5) * 0.15;
    innerRef.current.scale.set(pulse, pulse, pulse);
  });

  return (
    <group>
      <Icosahedron ref={outerRef} args={[1.2, 1]} position={[0, 0, 0]}>
        <meshBasicMaterial 
            color="#000000" 
            wireframe={true} 
            transparent={true} 
            opacity={0.15}
        />
      </Icosahedron>

      <Sphere ref={innerRef} args={[0.15, 32, 32]}>
        <meshBasicMaterial color="#cc0000" />
      </Sphere>
    </group>
  );
}

export default function SystemCore() {
  return (
    <div className="w-full h-full min-h-[200px] cursor-crosshair">
      <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }}>
        <CoreObject />
      </Canvas>
    </div>
  );
}