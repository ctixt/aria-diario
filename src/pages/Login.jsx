import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../components/useToast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [screenWidth, setScreenWidth] = useState(() => {
    if (typeof window === "undefined") return 1200;
    return window.innerWidth;
  });

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = screenWidth <= 820;
  const isSmall = screenWidth <= 480;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      showToast("Por favor ingresa tu correo y contraseña", "warning");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        showToast("Correo o contraseña incorrectos", "error");
        return;
      }

      showToast("Inicio de sesión correcto", "success");

      setTimeout(() => {
        navigate("/dashboard");
      }, 600);
    } catch (error) {
      console.log("Error en login:", error);
      showToast("Ocurrió un error al iniciar sesión", "error");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      width: "100%",
      maxWidth: "100vw",
      background:
        "radial-gradient(circle at 12% 12%, rgba(245, 208, 254, 0.95) 0, transparent 30%), radial-gradient(circle at 88% 18%, rgba(254, 215, 170, 0.9) 0, transparent 28%), linear-gradient(135deg, #ffffff 0%, #faf7ff 48%, #fff7ed 100%)",
      display: "grid",
      placeItems: "center",
      padding: isSmall ? "14px" : isMobile ? "18px" : "28px",
      fontFamily:
        "Inter, Poppins, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      position: "relative",
      overflowX: "hidden",
      color: "#172033",
      boxSizing: "border-box",
    },
    reset: `
      * {
        box-sizing: border-box;
      }

      html,
      body,
      #root {
        width: 100%;
        max-width: 100%;
        margin: 0;
        padding: 0;
        overflow-x: hidden;
      }

      input,
      button {
        font-family: inherit;
        max-width: 100%;
      }

      @keyframes softIn {
        from {
          opacity: 0;
          transform: translateY(12px) scale(0.98);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes floatOrb {
        0%, 100% {
          transform: translateY(0) rotate(-10deg);
        }
        50% {
          transform: translateY(-10px) rotate(-6deg);
        }
      }

      .login-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 20px 38px rgba(139, 92, 246, 0.30);
      }

      .soft-button:hover {
        background: #f8fafc;
      }
    `,
    blobOne: {
      position: "absolute",
      width: isMobile ? "260px" : "430px",
      height: isMobile ? "260px" : "430px",
      borderRadius: "44% 56% 61% 39%",
      background:
        "linear-gradient(135deg, rgba(139,92,246,0.20), rgba(236,72,153,0.14), rgba(254,215,170,0.24))",
      top: isMobile ? "-80px" : "80px",
      left: isMobile ? "-120px" : "-150px",
      filter: "blur(2px)",
      zIndex: 0,
      pointerEvents: "none",
    },
    blobTwo: {
      position: "absolute",
      width: isMobile ? "240px" : "380px",
      height: isMobile ? "240px" : "380px",
      borderRadius: "55% 45% 37% 63%",
      background:
        "linear-gradient(135deg, rgba(251,146,60,0.16), rgba(168,85,247,0.14))",
      right: isMobile ? "-120px" : "-120px",
      bottom: isMobile ? "-70px" : "80px",
      filter: "blur(1px)",
      zIndex: 0,
      pointerEvents: "none",
    },
    container: {
      width: "100%",
      maxWidth: isMobile ? "460px" : "1080px",
      display: "grid",
      gridTemplateColumns: isMobile ? "minmax(0, 1fr)" : "minmax(0, 1fr) 430px",
      gap: isMobile ? "16px" : "36px",
      alignItems: "center",
      position: "relative",
      zIndex: 2,
      animation: "softIn 0.35s ease both",
    },
    mobileBrand: {
      display: isMobile ? "flex" : "none",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      marginBottom: "2px",
      padding: "6px 0",
    },
    heroCard: {
      display: isMobile ? "none" : "block",
      minHeight: "560px",
      borderRadius: "36px",
      padding: "46px",
      background: "rgba(255, 255, 255, 0.62)",
      border: "1px solid rgba(255,255,255,0.85)",
      boxShadow: "0 28px 80px rgba(88, 28, 135, 0.12)",
      backdropFilter: "blur(18px)",
      position: "relative",
      overflow: "hidden",
    },
    loginCard: {
      width: "100%",
      maxWidth: "100%",
      background: "rgba(255, 255, 255, 0.9)",
      border: "1px solid rgba(226, 232, 240, 0.92)",
      borderRadius: isSmall ? "24px" : isMobile ? "28px" : "32px",
      padding: isSmall ? "22px" : isMobile ? "26px" : "34px",
      boxShadow: isMobile
        ? "0 22px 55px rgba(15, 23, 42, 0.11)"
        : "0 24px 70px rgba(15, 23, 42, 0.12)",
      backdropFilter: "blur(18px)",
      boxSizing: "border-box",
    },
    logo: {
      display: "inline-flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "34px",
    },
    logoIcon: {
      width: isSmall ? "42px" : "48px",
      height: isSmall ? "42px" : "48px",
      borderRadius: isSmall ? "16px" : "18px",
      background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
      boxShadow: "0 14px 28px rgba(139,92,246,0.25)",
      display: "grid",
      placeItems: "center",
      color: "#ffffff",
      fontWeight: "900",
      fontSize: isSmall ? "18px" : "20px",
      flexShrink: 0,
    },
    title: {
      fontSize: "48px",
      lineHeight: "1.03",
      letterSpacing: "-2px",
      margin: "0 0 18px",
      color: "#111827",
    },
    subtitle: {
      color: "#64748b",
      fontSize: "16px",
      lineHeight: "1.75",
      maxWidth: "560px",
      margin: 0,
    },
    visualWrap: {
      position: "absolute",
      right: "38px",
      bottom: "34px",
      width: "300px",
      height: "300px",
      pointerEvents: "none",
    },
    mainOrb: {
      position: "absolute",
      width: "210px",
      height: "210px",
      borderRadius: "42% 58% 50% 50%",
      background: "linear-gradient(135deg, #7c3aed, #ec4899 55%, #fed7aa)",
      boxShadow:
        "0 30px 60px rgba(124,58,237,0.28), inset 0 18px 35px rgba(255,255,255,0.35)",
      transform: "rotate(-12deg)",
      left: "35px",
      top: "35px",
      animation: "floatOrb 5s ease-in-out infinite",
    },
    smallOrb: {
      position: "absolute",
      width: "76px",
      height: "76px",
      borderRadius: "50%",
      background: "#ffffff",
      boxShadow: "0 18px 35px rgba(15,23,42,0.12)",
      right: "18px",
      top: "22px",
    },
    tinyOrb: {
      position: "absolute",
      width: "26px",
      height: "26px",
      borderRadius: "50%",
      background: "#fb923c",
      boxShadow: "0 12px 22px rgba(249,115,22,0.26)",
      left: "20px",
      bottom: "48px",
    },
    formTitle: {
      fontSize: isSmall ? "26px" : isMobile ? "28px" : "30px",
      margin: "0 0 8px",
      letterSpacing: "-1px",
      color: "#111827",
      lineHeight: "1.12",
      textAlign: isMobile ? "center" : "left",
    },
    formText: {
      color: "#64748b",
      margin: "0 0 26px",
      lineHeight: "1.6",
      textAlign: isMobile ? "center" : "left",
      fontSize: isSmall ? "14px" : "15px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "800",
      color: "#374151",
      marginBottom: "8px",
    },
    inputGroup: {
      marginBottom: "17px",
    },
    input: {
      width: "100%",
      border: "1px solid #e5e7eb",
      background: "#ffffff",
      borderRadius: "18px",
      padding: isSmall ? "14px 15px" : "15px 16px",
      fontSize: "15px",
      color: "#111827",
      outline: "none",
      boxSizing: "border-box",
      boxShadow: "inset 0 2px 8px rgba(15,23,42,0.03)",
    },
    passwordWrap: {
      position: "relative",
      width: "100%",
    },
    showButton: {
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      border: "none",
      background: "#f8fafc",
      color: "#8b5cf6",
      fontWeight: "800",
      borderRadius: "12px",
      padding: "8px 10px",
      cursor: loading ? "not-allowed" : "pointer",
    },
    submitButton: {
      width: "100%",
      border: "none",
      borderRadius: "18px",
      padding: "15px 18px",
      cursor: loading ? "not-allowed" : "pointer",
      fontWeight: "900",
      fontSize: "15px",
      background: loading
        ? "linear-gradient(135deg, #c4b5fd, #f9a8d4)"
        : "linear-gradient(135deg, #8b5cf6, #ec4899)",
      color: "#ffffff",
      marginTop: "8px",
      boxShadow: "0 16px 32px rgba(139, 92, 246, 0.28)",
      opacity: loading ? 0.82 : 1,
      transition: "transform .18s ease, box-shadow .18s ease",
    },
    secondaryText: {
      textAlign: "center",
      marginTop: "22px",
      color: "#64748b",
      fontSize: "14px",
      lineHeight: "1.6",
    },
    link: {
      color: "#8b5cf6",
      fontWeight: "900",
      textDecoration: "none",
    },
    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "9px 13px",
      borderRadius: "999px",
      background: "#f5f3ff",
      border: "1px solid #ddd6fe",
      color: "#7c3aed",
      fontSize: "13px",
      fontWeight: "900",
      marginBottom: "18px",
    },
    mobileHint: {
      display: isMobile ? "block" : "none",
      margin: "16px auto 0",
      maxWidth: "330px",
      textAlign: "center",
      color: "#64748b",
      fontSize: "13px",
      lineHeight: "1.55",
    },
  };

  return (
    <div style={styles.page}>
      <style>{styles.reset}</style>

      <div style={styles.blobOne}></div>
      <div style={styles.blobTwo}></div>

      <div style={styles.container}>
        <div style={styles.mobileBrand}>
          <div style={styles.logoIcon}>A</div>
          <div>
            <strong style={{ color: "#111827", fontSize: "18px" }}>ARIA</strong>
            <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
              Diario emocional inteligente
            </p>
          </div>
        </div>

        <section style={styles.heroCard}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>A</div>
            <div>
              <strong style={{ color: "#111827", fontSize: "18px" }}>
                ARIA
              </strong>
              <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
                Diario emocional inteligente
              </p>
            </div>
          </div>

          <div style={styles.badge}>IA emocional · Diario personal</div>

          <h1 style={styles.title}>
            Bienvenido de nuevo a tu espacio emocional.
          </h1>

          <p style={styles.subtitle}>
            Inicia sesión para continuar tus entradas, conversaciones privadas
            y análisis emocional con ARIA. Todo en un espacio limpio, personal y
            pensado para ayudarte a entenderte mejor.
          </p>

          <div style={styles.visualWrap}>
            <div style={styles.mainOrb}></div>
            <div style={styles.smallOrb}></div>
            <div style={styles.tinyOrb}></div>

            <div
              style={{
                position: "absolute",
                left: "66px",
                top: "78px",
                width: "120px",
                height: "2px",
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.8), rgba(255,255,255,0.15))",
                transform: "rotate(-28deg)",
              }}
            ></div>

            <div
              style={{
                position: "absolute",
                right: "72px",
                bottom: "74px",
                width: "95px",
                height: "2px",
                background:
                  "linear-gradient(90deg, rgba(139,92,246,0.05), rgba(139,92,246,0.5), rgba(139,92,246,0.05))",
                transform: "rotate(32deg)",
              }}
            ></div>
          </div>
        </section>

        <section style={styles.loginCard}>
          <h2 style={styles.formTitle}>Iniciar sesión</h2>
          <p style={styles.formText}>
            Accede a tu diario emocional y continúa donde lo dejaste.
          </p>

          <form onSubmit={handleLogin}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Correo electrónico</label>
              <input
                style={styles.input}
                type="email"
                placeholder="tu_correo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Contraseña</label>

              <div style={styles.passwordWrap}>
                <input
                  style={{
                    ...styles.input,
                    paddingRight: "86px",
                  }}
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  style={styles.showButton}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-button"
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Iniciar sesión →"}
            </button>
          </form>

          <p style={styles.secondaryText}>
            ¿Aún no tienes cuenta?{" "}
            <Link to="/register" style={styles.link}>
              Crear cuenta
            </Link>
          </p>

          <p style={styles.mobileHint}>
            Tus entradas y conversaciones se guardan en un espacio privado para
            que puedas retomarlas cuando quieras.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Login;
