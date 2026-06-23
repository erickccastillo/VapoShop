// frontend/src/components/PipasExperience.tsx
import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const pipasFeatures = [
  {
    id: 1,
    title: "Ergonomía Escultural",
    desc: "Diseño orgánico soplado al fuego que se adapta perfectamente a la forma de la mano para un agarre natural.",
    position: "top-[25%] left-[10%] md:left-[15%] max-w-xs",
  },
  {
    id: 2,
    title: "Válvula de Carburación Calibrada",
    desc: "Orificio lateral de precisión milimétrica para un control total del flujo de aire y una limpieza rápida del humo.",
    position: "top-[50%] right-[10%] md:right-[15%] max-w-xs text-right",
  },
  {
    id: 3,
    title: "Detalles en Vidrio Fumé",
    desc: "Acabados cromáticos opacos y texturizados que cambian sutilmente de tonalidad con la incidencia de la luz.",
    position: "bottom-[20%] left-[10%] md:left-[20%] max-w-xs",
  },
];

export default function PipasExperience() {
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

    pipasFeatures.forEach((_, i) => {
      tl.fromTo(`.pipas-feat-${i}`, 
        { opacity: 0, y: 40, filter: "blur(10px)" }, 
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 }
      )
      .to(`.pipas-feat-${i}`, 
        { opacity: 0, y: -40, filter: "blur(10px)", duration: 1 }, 
        "+=1"
      );
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#0c0f0f] overflow-hidden">
      {/* CAPA DE FONDO: Video interactivo de Pipas */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#121414] via-transparent to-[#121414] z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
        
        <video
          ref={videoRef}
          src="/videos/pipas_experience_optimized.mp4" // <-- Tu video de pipas aquí
          playsInline
          muted
          preload="auto"
          className="w-full h-full object-cover md:object-contain opacity-70"
        />
      </div>

      {/* CAPA SUPERIOR: Características flotantes */}
      <div className="absolute inset-0 w-full h-full z-20 pointer-events-none max-w-[1280px] mx-auto px-6">
        {pipasFeatures.map((feat, i) => (
          <div
            key={feat.id}
            className={`absolute ${feat.position} pipas-feat-${i} pointer-events-auto bg-[#121414]/70 backdrop-blur-md border border-[#c5a059]/20 p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]`}
          >
            <span className="text-[#c5a059] font-mono text-xs tracking-widest block mb-2 uppercase font-medium">
              Artesanía Pipa 0{feat.id}
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
        <span className="text-xs uppercase tracking-[0.3em] text-[#c5a059]">Desplaza para ver el arte a detalle</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#c5a059] to-transparent"></div>
      </div>
    </div>
  );
}