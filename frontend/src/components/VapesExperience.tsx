// frontend/src/components/VapesExperience.tsx
import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const vapesFeatures = [
  {
    id: 1,
    title: "Cámara de Conducción de Cerámica",
    desc: "Calentamiento uniforme de grado médico que preserva el perfil de sabor puro sin combustión.",
    position: "top-[22%] left-[10%] md:left-[15%] max-w-xs",
  },
  {
    id: 2,
    title: "Control Digital de Precisión",
    desc: "Ajuste grado a grado mediante pantalla OLED para personalizar la densidad del vapor según tu preferencia.",
    position: "top-[48%] right-[10%] md:right-[15%] max-w-xs text-right",
  },
  {
    id: 3,
    title: "Batería de Alta Densidad",
    desc: "Carga rápida USB-C y autonomía extendida para sesiones continuas con un rendimiento óptimo de voltaje.",
    position: "bottom-[22%] left-[10%] md:left-[20%] max-w-xs",
  },
];

export default function VapesExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(() => {
    const video = videoRef.current;
    if (!video) return;

    video.onloadedmetadata = () => {
      gsap.to(video, {
        currentTime: video.duration,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=3000",
          scrub: 1,
          pin: true,
        },
      });
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=3000",
        scrub: 1,
      }
    });

    vapesFeatures.forEach((_, i) => {
      tl.fromTo(`.vapes-feat-${i}`, 
        { opacity: 0, y: 40, filter: "blur(10px)" }, 
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 }
      )
      .to(`.vapes-feat-${i}`, 
        { opacity: 0, y: -40, filter: "blur(10px)", duration: 1 }, 
        "+=1"
      );
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#0c0f0f] overflow-hidden">
      {/* CAPA DE FONDO: Video interactivo de Vaporizadores */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#121414] via-transparent to-[#121414] z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
        
        <video
          ref={videoRef}
          src="/videos/vapes_experience_optimized.mp4" // <-- Tu video de vaporizadores aquí
          playsInline
          muted
          preload="auto"
          className="w-full h-full object-cover md:object-contain opacity-70"
        />
      </div>

      {/* CAPA SUPERIOR: Características flotantes */}
      <div className="absolute inset-0 w-full h-full z-20 pointer-events-none max-w-[1280px] mx-auto px-6">
        {vapesFeatures.map((feat, i) => (
          <div
            key={feat.id}
            className={`absolute ${feat.position} vapes-feat-${i} pointer-events-auto bg-[#121414]/70 backdrop-blur-md border border-[#c5a059]/20 p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]`}
          >
            <span className="text-[#c5a059] font-mono text-xs tracking-widest block mb-2 uppercase font-medium">
              Tecnología Vape 0{feat.id}
            </span>
            <h3 className="font-['EB_Garamond'] text-2xl text-[#e2e2e2] mb-2 leading-tight">
              {feat.title}
            </h3>
            <p className="text-sm text-[#9a8f80] leading-relaxed">
              {feat.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Indicador de Scroll */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center gap-2 animate-pulse pointer-events-none">
        <span className="text-xs uppercase tracking-[0.3em] text-[#c5a059]">Desplaza para analizar la ingeniería</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#c5a059] to-transparent"></div>
      </div>
    </div>
  );
}