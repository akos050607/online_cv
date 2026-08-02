import React, { useState, lazy, Suspense } from "react";

// A three.js-t használó rész külön chunk: csak az első hoverre töltjük le.
const ProfileModel = lazy(() => import("./ProfileModel.jsx"));

export default function ProfileHologram() {
  const [hovered, setHovered] = useState(false);
  // Ha egyszer betöltöttük, maradjon a DOM-ban, hogy a következő hover azonnali legyen.
  const [modelRequested, setModelRequested] = useState(false);
  // A fotó CSAK akkor tűnik el, ha a modell tényleg kirajzolódott. Ha a 3D
  // bármiért nem jön be, a látogató a képet látja - soha nem üres panelt.
  const [modelReady, setModelReady] = useState(false);

  const enter = () => {
    setHovered(true);
    setModelRequested(true);
  };

  const showModel = hovered && modelReady;

  return (
    <div
      className="w-full h-full min-h-[400px] md:min-h-[500px] relative flex items-center justify-center p-8 bg-transparent cursor-crosshair"
      onPointerEnter={enter}
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
          {showModel ? "FUNNY_3D_SCAN" : hovered ? "LOADING" : "STANDBY"}
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
          {/* Színes 2D Kép — ez tölt be azonnal */}
          <img
            src="/images/me.jpg"
            alt="Szénássy Ákos"
            width="750"
            height="1000"
            fetchpriority="high"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out z-10 ${
              showModel
                ? "opacity-0 scale-105 pointer-events-none"
                : "opacity-100 contrast-[0.85] scale-[0.96]"
            }`}
          />

          {/* 3D Canvas — lusta betöltés */}
          <div
            className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out z-0 flex items-center justify-center ${
              showModel ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            {modelRequested && (
              <Suspense fallback={null}>
                <ProfileModel onReady={() => setModelReady(true)} />
              </Suspense>
            )}
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
