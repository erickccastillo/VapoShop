import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ShoppingCart, ArrowDown, ArrowRight, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";

const BG =
  "https://images.unsplash.com/photo-1781450077130-aa5d64171342?w=2400&h=1400&fit=crop&auto=format&q=90";

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  alt_text: string;
  category_id?: string;
  side?: "left" | "right";
  top?: string;
  enter?: number;
  exit?: number;
  badge?: string | null;
}

function ShelfCard({
  item,
  progress,
}: {
  item: Product;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const { addToCart } = useCart();
  const SLIDE_DIST = 320;
  const dir = item.side === "left" ? -1 : 1;

  const enter = item.enter ?? 0.2;
  const exit = item.exit ?? 0.7;
  const top = item.top ?? "30%";

  const x = useTransform(
    progress,
    [enter, enter + 0.13, exit, exit + 0.08],
    [dir * SLIDE_DIST, 0, 0, dir * SLIDE_DIST * 0.55]
  );
  const opacity = useTransform(
    progress,
    [enter, enter + 0.10, exit, exit + 0.07],
    [0, 1, 1, 0]
  );
  const cardScale = useTransform(
    progress,
    [enter, enter + 0.13],
    [0.82, 1]
  );

  const posStyle: React.CSSProperties =
    item.side === "left" ? { left: "3.5%" } : { right: "3.5%" };

  return (
    <motion.div
      style={{
        position: "absolute",
        top: top,
        ...posStyle,
        x,
        opacity,
        scale: cardScale,
        zIndex: 30,
        width: 188,
      }}
    >
      <div
        style={{
          background: "rgba(6, 6, 6, 0.88)",
          border: "1px solid rgba(197, 160, 89, 0.22)",
          borderRadius: 14,
          overflow: "hidden",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {item.badge && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "#c5a059",
              color: "#060606",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.12em",
              padding: "3px 8px",
              borderRadius: 4,
              zIndex: 2,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {item.badge}
          </div>
        )}

        <div style={{ position: "relative", height: 148, background: "#0e0e0e" }}>
          <img
            src={item.image_url}
            alt={item.alt_text || item.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(6,6,6,0.75) 0%, transparent 55%)",
            }}
          />
        </div>

        <div style={{ padding: "11px 13px 14px" }}>
          <p
            style={{
              color: "#ede9e0",
              fontSize: 12.5,
              fontWeight: 600,
              marginBottom: 3,
              fontFamily: "Inter, sans-serif",
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            {item.name}
          </p>
          <p
            style={{
              color: "#c5a059",
              fontSize: 13.5,
              fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: 10,
            }}
          >
            ${item.price}
          </p>
          <button
            onClick={() => addToCart(item)}
            style={{
              width: "100%",
              padding: "7px 0",
              background: "rgba(197, 160, 89, 0.1)",
              border: "1px solid rgba(197, 160, 89, 0.38)",
              borderRadius: 8,
              color: "#c5a059",
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: "0.1em",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              transition: "all 150ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(197, 160, 89, 0.25)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(197, 160, 89, 0.1)";
              e.currentTarget.style.color = "#c5a059";
            }}
          >
            <Plus size={11} strokeWidth={2.8} />
            AGREGAR
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface LandingPageProps {
  onEnterStore?: () => void; // Opcional por si manejas la navegación directo por URL
}

export default function LandingPage({ onEnterStore }: LandingPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { totalItems } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  
  const { scrollYProgress } = useScroll({ target: containerRef });

  useEffect(() => {
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const headers = { "apikey": SUPABASE_ANON_KEY, "Authorization": `Bearer ${SUPABASE_ANON_KEY}` };

    fetch(`${SUPABASE_URL}/rest/v1/products?select=*&limit=6`, { headers })
      .then(res => res.json())
      .then((data: Product[]) => {
        if (data && data.length > 0) {
          const simulatedBadges = ["BESTSELLER", "NUEVO", null, "HOT", "EXCLUSIVO", null];
          
          const dynamicShelfItems = data.map((product, index) => {
            const side = index % 2 === 0 ? ("left" as const) : ("right" as const);
            const enter = 0.08 + index * 0.09;
            const exit = 0.58 + index * 0.05;
            const coordinatesY = ["18%", "14%", "48%", "44%", "68%", "64%"];
            const top = coordinatesY[index] || "30%";

            return {
              ...product,
              side,
              top,
              enter,
              exit,
              badge: simulatedBadges[index] || null
            };
          });
          setProducts(dynamicShelfItems);
        }
      })
      .catch(err => console.error("Error alimentando repisa dinámica:", err));
  }, []);

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 2.85]);
  
  const entryHeaderOpacity = useTransform(scrollYProgress, [0, 0.12, 0.13, 1], [1, 0, 0, 0]);
  const mainTitleOpacity = useTransform(scrollYProgress, [0, 0.12, 0.13, 1], [1, 0, 0, 0]);
  const entryY = useTransform(scrollYProgress, [0, 0.12], [0, -55]);
  const scrollIndOpacity = useTransform(scrollYProgress, [0, 0.07, 0.08, 1], [1, 0, 0, 0]);
  const midOpacity = useTransform(scrollYProgress, [0, 0.35, 0.48, 0.72, 0.80, 1], [0, 0, 1, 1, 0, 0]);

  const ctaOpacity = useTransform(scrollYProgress, [0, 0.82, 0.93, 1], [0, 0, 1, 1]);
  const ctaY = useTransform(scrollYProgress, [0.82, 0.93], [45, 0]);

  const vignetteOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.80, 0.60, 0.35]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.48, 0.28, 0.12]);
  const cartOpacity = useTransform(scrollYProgress, [0, 0.06, 0.16, 1], [0, 0, 1, 1]);

  // ── MANEJADOR DE NAVEGACIÓN ──
  const handleNavigation = () => {
    if (onEnterStore) {
      onEnterStore(); // Llama la función padre si existe
    }
    // Redirección explícita a la ruta de la tienda
    window.location.href = "/store"; 
  };

  return (
    <>
      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 0.9; transform: scaleY(1.25); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
      `}</style>

      <div ref={containerRef} style={{ height: "520vh", background: "#060606" }}>
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            background: "#060606",
          }}
        >
          {/* ── BACKGROUND ZOOM ── */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              scale: bgScale,
              transformOrigin: "center 42%",
            }}
          >
            <img
              src={BG}
              alt="Glass Therapy Interior"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 38%",
              }}
            />
          </motion.div>

          {/* ── OVERLAYS & AMBIENT LIGHTS ── */}
          <motion.div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,1)", opacity: overlayOpacity, pointerEvents: "none", zIndex: 2 }} />
          <motion.div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 58% 65% at 50% 48%, transparent 0%, rgba(0,0,0,0.97) 100%)", opacity: vignetteOpacity, pointerEvents: "none", zIndex: 3 }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "28%", background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)", pointerEvents: "none", zIndex: 4 }} />
          <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "30%", height: "60%", background: "radial-gradient(ellipse at 50% 0%, rgba(197,160,89,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 4 }} />

          {/* ── TOP HEADER ── */}
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              padding: "28px 40px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 50,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 100%)",
              opacity: entryHeaderOpacity, 
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span
                style={{
                  fontFamily: "Oswald, sans-serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                GLASS THERAPY
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.38)",
                  letterSpacing: "0.22em",
                  fontFamily: "Inter, sans-serif",
                  textTransform: "uppercase",
                }}
              >
                // ARTISANAL GLASS
              </span>
            </div>
            
            <motion.button
              style={{
                opacity: cartOpacity,
                background: "rgba(197,160,89,0.10)",
                border: "1px solid rgba(197,160,89,0.32)",
                borderRadius: "50%",
                width: 46,
                height: 46,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#c5a059",
                position: "relative",
                transition: "background 150ms",
              }}
              whileHover={{ scale: 1.08 }}
            >
              <ShoppingCart size={19} strokeWidth={1.8} />
              {totalItems > 0 && (
                <span style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  background: "#c5a059",
                  color: "#060606",
                  fontSize: 9,
                  fontWeight: "bold",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {totalItems}
                </span>
              )}
            </motion.button>
          </motion.div>

          {/* ── INTERACTIVE PRODUCT SHELF CARDS ── */}
          {products.map((item) => (
            <ShelfCard key={item.id} item={item} progress={scrollYProgress} />
          ))}

          {/* ── ENTRY TEXT ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
              pointerEvents: "none",
            }}
          >
            <motion.div style={{ opacity: mainTitleOpacity, y: entryY, textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 10.5,
                  fontWeight: 600,
                  letterSpacing: "0.38em",
                  color: "#c5a059",
                  textTransform: "uppercase",
                  marginBottom: 18,
                }}
              >
                Bienvenido a
              </p>
              <h1
                style={{
                  fontFamily: "Oswald, sans-serif",
                  fontSize: "clamp(64px, 11vw, 130px)",
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "-0.01em",
                  lineHeight: 0.9,
                  textTransform: "uppercase",
                  marginBottom: 26,
                }}
              >
                GLASS
                <br />
                <span style={{ color: "#c5a059" }}>THERAPY</span>
              </h1>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.45)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                Piezas de Vidrio Soplado · Alta Orfebrería · Accesorios Premium
              </p>
            </motion.div>
          </div>

          {/* ── SCROLL INDICATOR ── */}
          <div style={{ position: "absolute", bottom: 36, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 20 }}>
            <motion.div style={{ opacity: scrollIndOpacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 9.5, fontWeight: 600, letterSpacing: "0.32em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>
                Desliza para explorar
              </p>
              <div style={{ width: 1, height: 38, background: "linear-gradient(to bottom, rgba(197,160,89,0.75), transparent)", animation: "scrollPulse 2.2s ease-in-out infinite", transformOrigin: "top" }} />
              <div style={{ animation: "bounce 2s ease-in-out infinite" }}>
                <ArrowDown size={13} color="rgba(197,160,89,0.55)" strokeWidth={2} />
              </div>
            </motion.div>
          </div>

          {/* ── MID-SCROLL LABEL ── */}
          <div style={{ position: "absolute", bottom: "14%", left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 20, pointerEvents: "none" }}>
            <motion.div style={{ opacity: midOpacity, textAlign: "center" }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.38em", color: "#c5a059", textTransform: "uppercase", marginBottom: 10 }}>
                El Arte del Vidrio Creado Terapia
              </p>
              <p style={{ fontFamily: "Oswald, sans-serif", fontSize: "clamp(28px, 4.5vw, 52px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", textTransform: "uppercase" }}>
                Diseño exclusivo y funcional
              </p>
            </motion.div>
          </div>

          {/* ── END CTA ── */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 25 }}>
            <motion.div style={{ opacity: ctaOpacity, y: ctaY, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.38em", color: "#c5a059", textTransform: "uppercase", marginBottom: 20 }}>
                La sesión ha comenzado
              </p>
              <h2
                style={{
                  fontFamily: "Oswald, sans-serif",
                  fontSize: "clamp(52px, 9vw, 110px)",
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "-0.025em",
                  lineHeight: 0.9,
                  textTransform: "uppercase",
                  marginBottom: 44,
                }}
              >
                INGRESA A LA
                <br />
                EXPERIENCIA
              </h2>
              <motion.button
                onClick={handleNavigation} // Ejecuta la función con la redirección a /store
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 13,
                  padding: "17px 40px",
                  background: "#c5a059",
                  color: "#060606",
                  fontFamily: "Oswald, sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  border: "none",
                  borderRadius: 5,
                  cursor: "pointer",
                  pointerEvents: "auto"
                }}
              >
                VER CATÁLOGO COMPLETO
                <ArrowRight size={17} strokeWidth={2.6} />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}