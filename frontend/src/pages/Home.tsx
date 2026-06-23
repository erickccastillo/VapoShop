// frontend/src/pages/Home.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import BongExperience from "../components/BongsExperience";
import { ArrowLeft, ArrowRight } from "lucide-react";

// ==========================================
// INTERFACES
// ==========================================
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

// ==========================================
// CONFIGURACIÓN Y CONSTANTES DEL CAROUSEL PREMIUM
// ==========================================
const PREMIUM_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1556997449-3ab5ca1828cb?q=80&w=600&auto=format&fit=crop",
    bg: "#0B251A",
    panel: "#143F2D",
  },
  {
    src: "https://images.unsplash.com/photo-1603036324350-02d28120b605?q=80&w=600&auto=format&fit=crop",
    bg: "#1F1135",
    panel: "#2E1A4E",
  },
  {
    src: "https://images.unsplash.com/photo-1517254456976-ee8682099819?q=80&w=600&auto=format&fit=crop",
    bg: "#2B1A04",
    panel: "#412807",
  },
  {
    src: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=600&auto=format&fit=crop",
    bg: "#111111",
    panel: "#222222",
  },
];

const GRAIN_SVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.06'/></svg>`;

const TRANSITION = "transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1), height 650ms cubic-bezier(0.4,0,0.2,1), bottom 650ms cubic-bezier(0.4,0,0.2,1)";

function getRoleStyle(role: "center" | "left" | "right" | "back", isMobile: boolean): React.CSSProperties {
  if (role === "center") {
    return {
      transform: `translateX(-50%) scale(${isMobile ? 1.2 : 1.55})`,
      filter: "none",
      opacity: 1,
      zIndex: 20,
      left: "50%",
      height: isMobile ? "58%" : "88%",
      bottom: isMobile ? "22%" : 0,
    };
  }
  if (role === "left") {
    return {
      transform: "translateX(-50%) scale(0.95)",
      filter: "blur(4px)",
      opacity: 0.6,
      zIndex: 10,
      left: isMobile ? "15%" : "28%",
      height: isMobile ? "16%" : "28%",
      bottom: isMobile ? "32%" : "12%",
    };
  }
  if (role === "right") {
    return {
      transform: "translateX(-50%) scale(0.95)",
      filter: "blur(4px)",
      opacity: 0.6,
      zIndex: 10,
      left: isMobile ? "85%" : "70%",
      height: isMobile ? "16%" : "28%",
      bottom: isMobile ? "32%" : "12%",
    };
  }
  return {
    transform: "translateX(-50%) scale(0.85)",
    filter: "blur(8px)",
    opacity: 0.3,
    zIndex: 5,
    left: "50%",
    height: isMobile ? "13%" : "22%",
    bottom: isMobile ? "32%" : "12%",
  };
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [categories, setCategories] = useState<CategoryCollection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados locales para la sección Carousel Integrada
  const [premiumIndex, setPremiumIndex] = useState(0);
  const [isAnimatingPremium, setIsAnimatingPremium] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Efecto de inicialización y fetching general
  useEffect(() => {
    // Cargar fuentes de Google
    const linkFonts = document.createElement("link");
    linkFonts.href = "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Hanken+Grotesk:wght@300;400;500;600;700&family=Oswald:wght@400;700&display=swap";
    linkFonts.rel = "stylesheet";
    document.head.appendChild(linkFonts);

    // Precargar imágenes del carrusel premium
    PREMIUM_IMAGES.forEach(({ src }) => {
      const img = new Image();
      img.src = src;
    });

    const fetchData = async () => {
      try {
        setLoading(true);

        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
        const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
          throw new Error("Faltan las variables de configuración de Supabase (.env) en el frontend");
        }

        const headers = {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json"
        };

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

  // Manejo de Responsividad Seguro (Anti errores SSR/Vite)
  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lógica Slider Principal (Hero)
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

  // Lógica WebGL Shader Background (Hero)
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

  // Lógica Navegación del Carrusel Premium Integrado
  const navigatePremium = useCallback(
    (dir: "next" | "prev") => {
      if (isAnimatingPremium) return;
      setIsAnimatingPremium(true);
      setPremiumIndex((prev) => (dir === "next" ? (prev + 1) % 4 : (prev + 3) % 4));
      setTimeout(() => setIsAnimatingPremium(false), 650);
    },
    [isAnimatingPremium]
  );

  const center = premiumIndex;
  const left = (premiumIndex + 3) % 4;
  const right = (premiumIndex + 1) % 4;

  function getPremiumRole(i: number): "center" | "left" | "right" | "back" {
    if (i === center) return "center";
    if (i === left) return "left";
    if (i === right) return "right";
    return "back";
  }

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


      <main>
       
       {/* NUEVA SECCIÓN: Premium Glassware Carousel */}
        <section
          style={{
            backgroundColor: PREMIUM_IMAGES[premiumIndex].bg,
            transition: "background-color 650ms cubic-bezier(0.4,0,0.2,1)",
            position: "relative",
            width: "100%",
            overflow: "hidden",
            borderTop: "1px solid rgba(255,255,255,0.03)",
            borderBottom: "1px solid rgba(255,255,255,0.03)"
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "80vh", minHeight: "600px", overflow: "hidden" }}>
            
            {/* Grain overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 50,
                backgroundImage: `url("${GRAIN_SVG}")`,
                backgroundSize: "200px 200px",
                backgroundRepeat: "repeat",
                opacity: 0.22, /* Reducido levemente para mayor nitidez y seriedad */
              }}
            />

            {/* Giant ghost text */}
            <div
              style={{
                position: "absolute",
                insetInline: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                userSelect: "none",
                zIndex: 2,
                top: "15%",
              }}
            >
              <span
                style={{
                  fontFamily: "Oswald, sans-serif",
                  fontSize: "clamp(60px, 18vw, 260px)",
                  fontWeight: 700,
                  color: "#ffffff",
                  opacity: 0.02, /* Más sutil para un acabado de ultra-lujo */
                  lineHeight: 1,
                  textTransform: "uppercase",
                  letterSpacing: "-0.02em",
                  whiteSpace: "nowrap",
                }}
              >
                THERAPY
              </span>
            </div>

            {/* Top-left brand label */}
            <div
              style={{
                position: "absolute",
                top: "2rem",
                left: isMobile ? "1rem" : "4rem",
                zIndex: 60,
                fontSize: "0.75rem",
                fontWeight: 500,
                textTransform: "uppercase",
                color: "#c5a059", /* Toque oro/crema sutil de tu paleta premium */
                opacity: 0.85,
                letterSpacing: "0.25em",
              }}
            >
              GLASS THERAPY // PIEZAS Y PRODUCTOS
            </div>

            {/* Carousel items */}
            <div style={{ position: "absolute", inset: 0, zIndex: 3 }}>
              {PREMIUM_IMAGES.map((img, i) => {
                const role = getPremiumRole(i);
                const roleStyle = getRoleStyle(role, isMobile);
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      aspectRatio: "0.6 / 1",
                      transition: TRANSITION,
                      willChange: "transform, filter, opacity",
                      ...roleStyle,
                    }}
                  >
                    <img
                      src={img.src}
                      alt={`Premium Product ${i + 1}`}
                      draggable={false}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        objectPosition: "bottom center",
                        filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.8))" /* Sombra pesada para dar seriedad */
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Bottom-left: text + nav buttons */}
            <div
              style={{
                position: "absolute",
                bottom: isMobile ? "2rem" : "4rem",
                left: isMobile ? "1rem" : "4rem",
                zIndex: 60,
                maxWidth: "420px", /* Un poco más de espacio para el texto en español */
              }}
            >
              <p
                style={{
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: isMobile ? "0.5rem" : "1rem",
                  fontSize: isMobile ? "1.1rem" : "1.5rem",
                  color: "#e2e2e2",
                  fontFamily: "'EB Garamond', serif" /* Cambio de fuente para mayor sofisticación y seriedad */
                }}
              >
                Alta Cristalería de Colección
              </p>
              {!isMobile && (
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#9a8f80",
                    opacity: 0.9,
                    lineHeight: 1.7,
                    marginBottom: "1.5rem",
                    fontWeight: 300,
                    letterSpacing: "0.01em"
                  }}
                >
                  Piezar de autor forjadas a mano en vidrio de borosilicato de alta densidad. Ingeniería de precisión diseñada para transformar el flujo de aire y elevar tu ritual diario a través de un filtrado óptimo y una estética arquitectónica atemporal.
                </p>
              )}
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {(["prev", "next"] as const).map((dir) => (
                  <button
                    key={dir}
                    onClick={() => navigatePremium(dir)}
                    style={{
                      width: isMobile ? "2.5rem" : "3rem",
                      height: isMobile ? "2.5rem" : "3rem",
                      borderRadius: "50%",
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.15)", /* Bordes más finos y elegantes */
                      color: "#e2e2e2",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 200ms ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.borderColor = "#c5a059";
                      e.currentTarget.style.color = "#c5a059";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                      e.currentTarget.style.color = "#e2e2e2";
                    }}
                  >
                    {dir === "prev" ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom-right: SHOP COLLECTION link */}
            <button
              onClick={() => navigate("/CatalogPage")}
              style={{
            position: "absolute",
            bottom: isMobile ? "1.5rem" : "5rem",
            right: isMobile ? "1rem" : "2.5rem",
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            fontFamily: "Oswald, sans-serif",
            fontSize: "clamp(20px, 4vw, 52px)",
            fontWeight: 700,
            color: "white",
            opacity: 0.9,
            letterSpacing: "-0.01em",
            lineHeight: 1,
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "opacity 200ms",
          }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#c5a059";
                e.currentTarget.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#e2e2e2";
                e.currentTarget.style.opacity = "0.9";
              }}
            >
              EXPLORAR CATALOGO
              <ArrowRight
            style={{ marginLeft: isMobile ? "0.75rem" : "0.75rem" }}
            size={isMobile ? 20 : 32}
            strokeWidth={2.25}
          />
            </button>

          </div>
        </section>

        {/* ProductCategories Section */}
        <section className="py-32 bg-[#121414]" id="categories">
          <div className="max-w-[1280px] mx-auto px-[20px] md:px-[64px] space-y-32">
            {categories.map((category) => (
              <div key={category.id} className="space-y-12 category-section fade-ready" data-animate="true">
                <div className="flex justify-between items-end border-b border-[#4e4639]/10 pb-6">
                  <h2 className="font-['EB_Garamond'] text-[40px] font-normal leading-[1.2] text-[#c5a059] tracking-tight">{category.title}</h2>
                  <button 
                    onClick={() => navigate(`/category/${category.id}`)}
                    className="text-[14px] font-medium tracking-[0.05em] text-[#d1c5b4] hover:text-[#c5a059] uppercase transition-all duration-300 flex items-center gap-2 group bg-transparent border-none cursor-pointer"
                  >
                    Ver Colección 
                    <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">→</span>
                  </button>
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
                          <button 
                            onClick={() => addToCart(product)}
                            className="w-full py-4 bg-[#c5a059] text-[#412d00] font-['Hanken_Grotesk'] text-[14px] font-medium tracking-[0.05em] uppercase transform translate-y-4 hover:translate-y-0 transition-transform duration-300"
                          >
                            Añadir al carrito
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