// frontend/src/pages/Home.tsx
import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  alt_text: string;
}

interface HeroSlide {
  id: number;
  tag: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  alt_text: string;
}

interface CategoryCollection {
  id: string;
  title: string;
  products: Product[];
}

export default function Home() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [categories, setCategories] = useState<CategoryCollection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cargar fuentes de Google
    const linkFonts = document.createElement("link");
    linkFonts.href = "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Hanken+Grotesk:wght@300;400;500;600;700&display=swap";
    linkFonts.rel = "stylesheet";
    document.head.appendChild(linkFonts);

    // Consultar el Backend local que actúa como puente a Supabase
  const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Obtener de forma segura las credenciales desde tu archivo .env del frontend
        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
        const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
          throw new Error("Faltan las variables de configuración de Supabase (.env) en el frontend");
        }

        // 2. Definir las cabeceras requeridas por el API Gateway de Supabase
        const headers = {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json"
        };

        // 3. Modificar los endpoints locales por las URLs directas de la base de datos en la nube
        const slidesResponse = await fetch(
          `${SUPABASE_URL}/rest/v1/hero_slides?is_active=eq.true&order=id.asc`, 
          { headers }
        );
        
        const categoriesResponse = await fetch(
          `${SUPABASE_URL}/rest/v1/categories?select=id,title,products(id,name,price,image_url,alt_text)&order=id.asc`, 
          { headers }
        );

        if (!slidesResponse.ok || !categoriesResponse.ok) {
          throw new Error("Error al conectar directamente con la API REST de Supabase");
        }

        const slidesData = await slidesResponse.json();
        const categoriesData = await categoriesResponse.json();

        // 4. Asignar los datos al estado tal cual como lo hacías antes
        setSlides(slidesData);
        setCategories(categoriesData);
      } catch (err: any) {
        setError(err.message || "Ocurrió un error inesperado al cargar la tienda");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      document.head.removeChild(linkFonts);
    };
  }, []);

  // Lógica Slider
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const nextSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  };
  
  const prevSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  useEffect(() => {
    if (slides.length === 0) return;
    const slideInterval = setInterval(nextSlide, 8000);

    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-up");
          scrollObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('[data-animate="true"]').forEach((el) => {
      scrollObserver.observe(el);
    });

    return () => {
      clearInterval(slideInterval);
      scrollObserver.disconnect();
    };
  }, [slides.length]);

  // Lógica WebGL Shader Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vsSource = `
      attribute vec2 position;
      varying vec2 v_texCoord;
      void main() {
          v_texCoord = position * 0.5 + 0.5;
          v_texCoord.y = 1.0 - v_texCoord.y;
          gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;
      void main() {
          vec2 uv = v_texCoord;
          float time = u_time * 0.2;
          vec2 p = uv * 2.0 - 1.0;
          p.x *= u_resolution.x / u_resolution.y;
          float noise = 0.0;
          float amp = 0.5;
          float freq = 1.0;
          for(int i = 0; i < 4; i++) {
              noise += amp * sin(freq * p.x + time + freq * p.y * 1.5);
              amp *= 0.5;
              freq *= 2.0;
              p = vec2(p.x * 0.8 - p.y * 0.6, p.x * 0.6 + p.y * 0.8);
          }
          vec3 color1 = vec3(0.07, 0.08, 0.08); 
          vec3 color2 = vec3(0.12, 0.13, 0.13); 
          vec3 accent = vec3(0.77, 0.63, 0.35) * 0.05; 
          vec3 finalColor = mix(color1, color2, noise * 0.5 + 0.5);
          finalColor += accent * (sin(time + uv.x * 3.0) * 0.5 + 0.5);
          gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    const program = gl.createProgram();
    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

    if (program && vs && fs) {
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
    } else return;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    let animationFrameId: number;

    function render(time: number) {
      if (!canvas || !gl) return;
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
          canvas.width = canvas.clientWidth;
          canvas.height = canvas.clientHeight;
          gl.viewport(0, 0, canvas.width, canvas.height);
      }
      gl.useProgram(program);
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1f(timeLocation, time * 0.001);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }
    animationFrameId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  if (loading) {
    return (
      <div className="bg-[#121414] min-h-screen flex items-center justify-center text-[#c5a059]">
        <p className="tracking-[0.2em] uppercase text-sm animate-pulse">Cargando catálogo premium...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#121414] min-h-screen flex flex-col items-center justify-center text-red-400 gap-4">
        <p className="font-['EB_Garamond'] text-2xl">Error de Conexión</p>
        <p className="text-sm opacity-60">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#121414] text-[#e2e2e2] selection:bg-[#c5a059]/30 font-['Hanken_Grotesk'] text-[16px] leading-[1.6] overflow-x-hidden min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .glass-panel { background: rgba(18, 20, 20, 0.7); backdrop-filter: blur(12px); }
        .hero-slide { transition: opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .active-slide { opacity: 1; z-index: 10; }
        .inactive-slide { opacity: 0; z-index: 0; }
        .product-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .product-card:hover { transform: translateY(-8px) scale(1.02); }
        .product-card:hover .product-image { box-shadow: 0 10px 40px -10px rgba(197, 160, 89, 0.3); }
        #shader-canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none; opacity: 0.4; }
        .fade-ready { opacity: 0; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 1s ease-out forwards; }
      `}} />

      <Header />

      <main>
        {/* Hero Section */}
        {slides.length > 0 && (
          <section className="relative h-[90vh] min-h-[700px] w-full overflow-hidden bg-[#0c0f0f]" id="hero">
            <canvas id="shader-canvas" ref={canvasRef}></canvas>
            
            <div className="h-full w-full relative" id="hero-slider">
              {slides.map((slide, index) => (
                <div 
                  key={slide.id} 
                  className={`hero-slide absolute inset-0 flex items-center ${
                    index === currentSlide ? 'active-slide' : 'inactive-slide'
                  }`}
                >
                  <div className="absolute inset-0 z-0 after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-r after:from-[#121414] after:via-[#121414]/40 after:to-transparent">
                    <img alt={slide.alt_text} className="w-full h-full object-cover" src={slide.image_url} />
                  </div>
                  <div className="max-w-[1280px] mx-auto px-[20px] md:px-[64px] w-full relative z-20">
                    <div className={`max-w-2xl ${index === currentSlide ? 'animate-fade-in-up' : ''}`}>
                      <span className="text-[#c5a059] font-['Hanken_Grotesk'] text-[14px] font-medium tracking-[0.3em] mb-4 block opacity-80">{slide.tag}</span>
                      <h1 className="font-['EB_Garamond'] text-[40px] md:text-[64px] font-normal leading-[1.2] md:leading-[1.1] tracking-[-0.01em] md:tracking-[-0.02em] text-[#e2e2e2] mb-6">{slide.title}</h1>
                      <p className="text-[18px] font-normal leading-[1.6] text-[#d1c5b4]/80 mb-10 max-w-lg">{slide.description}</p>
                      <div className="flex flex-wrap items-center gap-8">
                        <span className="font-['EB_Garamond'] text-[32px] font-normal leading-[1.3] text-[#c5a059]">${slide.price}</span>
                        <button className="px-12 py-4 bg-[#c5a059] text-[#412d00] font-['Hanken_Grotesk'] text-[14px] font-medium tracking-[0.2em] uppercase hover:bg-[#c5a059]/90 hover:shadow-[0_0_30px_rgba(197,160,89,0.3)] transition-all duration-500 active:scale-95">
                          Añadir al Carrito
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-12 right-[20px] md:right-[64px] z-30 flex gap-4">
              <button className="w-14 h-14 rounded-full border border-[#9a8f80]/20 flex items-center justify-center hover:bg-[#c5a059] hover:border-[#c5a059] hover:text-[#412d00] transition-all duration-300 group" onClick={prevSlide}>
                <span className="material-symbols-outlined transition-transform group-active:-translate-x-1">chevron_left</span>
              </button>
              <button className="w-14 h-14 rounded-full border border-[#9a8f80]/20 flex items-center justify-center hover:bg-[#c5a059] hover:border-[#c5a059] hover:text-[#412d00] transition-all duration-300 group" onClick={nextSlide}>
                <span className="material-symbols-outlined transition-transform group-active:translate-x-1">chevron_right</span>
              </button>
            </div>
          </section>
        )}

        {/* ProductCategories Section */}
        <section className="py-32 bg-[#121414]" id="categories">
          <div className="max-w-[1280px] mx-auto px-[20px] md:px-[64px] space-y-32">
            {categories.map((category) => (
              <div key={category.id} className="space-y-12 category-section fade-ready" data-animate="true">
                <div className="flex justify-between items-end border-b border-[#4e4639]/10 pb-6">
                  <h2 className="font-['EB_Garamond'] text-[40px] font-normal leading-[1.2] text-[#c5a059] tracking-tight">{category.title}</h2>
                  <a className="text-[14px] font-medium tracking-[0.05em] text-[#d1c5b4] hover:text-[#c5a059] uppercase transition-all duration-300 flex items-center gap-2 group" href="#">
                    Ver Colección 
                    <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </a>
                </div>
                
                <div className="flex gap-[32px] overflow-x-auto no-scrollbar pb-10 -mx-4 px-4">
                  {category.products && category.products.map((product) => (
                    <div key={product.id} className="min-w-[320px] flex-shrink-0 product-card">
                      <div className="aspect-[4/5] bg-[#1a1c1c] product-image overflow-hidden relative mb-6 rounded-lg transition-all duration-500">
                        <img 
                          alt={product.alt_text} 
                          className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" 
                          src={product.image_url} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                          <button className="w-full py-4 bg-[#c5a059] text-[#412d00] font-['Hanken_Grotesk'] text-[14px] font-medium tracking-[0.05em] uppercase transform translate-y-4 hover:translate-y-0 transition-transform duration-300">
                            Quick Add
                          </button>
                        </div>
                      </div>
                      <h3 className="font-['EB_Garamond'] text-[32px] font-normal leading-[1.3] text-[#e2e2e2]">{product.name}</h3>
                      <p className="text-[#c5a059] font-['Hanken_Grotesk'] text-[14px] font-medium mt-2 tracking-wider">${product.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}