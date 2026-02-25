import React, { useState } from 'react';

export default function ProfileMinimal() {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="w-full h-full min-h-[400px] md:min-h-[500px] relative flex items-center justify-center p-8 bg-transparent"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* 1. Státusz Indikátor (A Nothing-féle piros LED) */}
      <div className="absolute top-6 left-6 flex items-center gap-3 z-20">
        <div 
          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
            hovered ? 'bg-[#cc0000] shadow-[0_0_6px_rgba(204,0,0,0.8)]' : 'bg-gray-300'
          }`}
        ></div>
        <div className={`font-mono text-[10px] tracking-[0.2em] transition-colors duration-300 ${hovered ? 'text-black' : 'text-gray-400'}`}>
          {hovered ? 'SYSTEM.USER_DETECTED' : 'SYSTEM.STANDBY'}
        </div>
      </div>

      {/* 2. A Kép és a Mérnöki Keret */}
      <div className="relative w-full max-w-[260px] aspect-[3/4]">
        
        {/* Maga a Kép */}
        <img
          src="/images/me.jpg"
          alt="Profile"
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            hovered 
              ? 'grayscale-0 contrast-100 scale-100 opacity-100' // Éber állapot (ha teljesen fekete-fehéret akarsz, a grayscale-0-t írd át grayscale-re)
              : 'grayscale contrast-[0.85] scale-[0.96] opacity-70' // Alvó állapot
          }`}
        />

        {/* 3. Finom Célkeresztek / Sarokkonzolok (Csak hoverre pattannak be) */}
        <div 
          className={`absolute -top-3 -left-3 w-4 h-4 border-t border-l border-black transition-all duration-500 ease-out ${
            hovered ? 'opacity-100 translate-x-1 translate-y-1' : 'opacity-0'
          }`}
        ></div>
        <div 
          className={`absolute -bottom-3 -right-3 w-4 h-4 border-b border-r border-black transition-all duration-500 ease-out ${
            hovered ? 'opacity-100 -translate-x-1 -translate-y-1' : 'opacity-0'
          }`}
        ></div>

        {/* Opcionális: Egy leheletfinom vonal, ami hoverre végigfut az alján */}
        <div 
          className={`absolute -bottom-4 left-0 h-[1px] bg-black transition-all duration-700 ease-out ${
            hovered ? 'w-full opacity-20' : 'w-0 opacity-0'
          }`}
        ></div>

      </div>
    </div>
  );
}