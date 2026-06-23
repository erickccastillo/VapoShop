// frontend/src/components/BongsExperience.tsx
import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// Características específicas de Bongs
const bongsFeatures = [
  { id: 1, title: "Cristalería Alemana 9mm", desc: "Soplado a mano para máxima resistencia térmica y mecánica.", position: "top-[25%] left-[10%]" },
  { id: 2, title: "Percolador de Matriz Triple", desc: "Filtración ultra-húmeda y enfriamiento instantáneo para caladas suaves.", position: "top-[50%] right-[10%] text-right" },
  { id: 3, title: "Atrapahielos Estilizado", desc: "Indentaciones de precisión para una filtración gélida y refrescante.", position: "bottom-[20%] left-[15%]" },
];

export default function BongsExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(() => {
    const video = videoRef.current;
    if (!video) return;

    video.onloadedmetadata = () => {
      // Controlar el video con el scroll
      gsap.to(video, {
        currentTime: video.duration,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=3000", // Longitud de la experiencia de scroll
          scrub: 1,
          pin: true,
        },
      });
    };

    // Animación secuencial de los textos
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=3000",
        scrub: 1,
      }
    });

    bongsFeatures.forEach((_, i) => {
      tl.fromTo(`.bongs-feat-${i}`, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 })
        .to(`.bongs-feat-${i}`, { opacity: 0, y: -30, duration: 1 }, "+=1");
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#0c0f0f] overflow-hidden">
      {/* Video de Bong (optimizado y silenciado) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-60">
        <video
          ref={videoRef}
          src="/videos/bongs_experience_optimized.mp4" 
          playsInline
          muted
          preload="auto"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Textos flotantes */}
      <div className="absolute inset-0 z-20 max-w-[1280px] mx-auto px-6 pointer-events-none">
        {bongsFeatures.map((feat, i) => (
          <div key={feat.id} className={`absolute ${feat.position} bongs-feat-${i} max-w-xs bg-[#121414]/70 backdrop-blur-md p-6 rounded-2xl border border-[#c5a059]/20 shadow-xl`}>
            <span className="text-[#c5a059] font-mono text-xs tracking-widest block mb-2 uppercase">Esp. Bongs 0{feat.id}</span>
            <h3 className="font-['EB_Garamond'] text-2xl text-[#e2e2e2] mb-1 leading-tight">{feat.title}</h3>
            <p className="text-sm text-[#9a8f80]">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}