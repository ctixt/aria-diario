import { useState, useEffect, useMemo } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../components/useToast";

function Login() {
  const [email, setEmail] = useState(
    () => localStorage.getItem("aria_last_email") || ""
  );
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
    const handleResize = () => setScreenWidth(window.innerWidth);

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenWidth <= 860;
  const isSmall = screenWidth <= 480;

  const emailLooksValid = useMemo(() => {
    if (!email.trim()) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }, [email]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      showToast("Por favor ingresa tu correo y contraseña", "warning");
      return;
    }

    if (!emailLooksValid) {
      showToast("Ingresa un correo válido", "warning");
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

      localStorage.setItem("aria_last_email", email.trim());
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
      display: "grid",
      placeItems: "center",
      padding: isSmall ? "14px" : isMobile ? "20px" : "30px",
      fontFamily:
        "Inter, Poppins, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      color: "#172033",
      background:
        "radial-gradient(circle at 16% 16%, rgba(124,58,237,.16), transparent 28%), radial-gradient(circle at 86% 14%, rgba(236,72,153,.12), transparent 28%), radial-gradient(circle at 76% 88%, rgba(251,146,60,.13), transparent 24%), linear-gradient(135deg, #ffffff 0%, #faf7ff 50%, #fff7ed 100%)",
      position: "relative",
      overflowX: "hidden",
      boxSizing: "border-box",
    },
    global: `
      *, *::before, *::after {
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

      @keyframes authIn {
        from {
          opacity: 0;
          transform: translateY(14px) scale(.985);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes floatSoft {
        0%, 100% {
          transform: translateY(0) rotate(-8deg);
        }
        50% {
          transform: translateY(-10px) rotate(-4deg);
        }
      }

      @keyframes shimmer {
        0% {
          transform: translateX(-120%);
        }
        100% {
          transform: translateX(120%);
        }
      }

      .auth-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 22px 42px rgba(124, 58, 237, .30);
      }

      .auth-soft:hover {
        background: #f8fafc;
        transform: translateY(-1px);
      }

      .auth-link:hover {
        text-decoration: underline;
      }

      .auth-btn:active,
      .auth-soft:active {
        transform: scale(.985);
      }

      button:focus-visible,
      input:focus-visible {
        outline: 3px solid rgba(124,58,237,.22);
        outline-offset: 2px;
      }
    `,
    backgroundOrbOne: {
      position: "absolute",
      width: isMobile ? "240px" : "430px",
      height: isMobile ? "240px" : "430px",
      borderRadius: "44% 56% 61% 39%",
      background:
        "linear-gradient(135deg, rgba(139,92,246,.17), rgba(236,72,153,.10), rgba(254,215,170,.18))",
      top: isMobile ? "-90px" : "56px",
      left: isMobile ? "-130px" : "-155px",
      filter: "blur(2px)",
      pointerEvents: "none",
      zIndex: 0,
    },
    backgroundOrbTwo: {
      position: "absolute",
      width: isMobile ? "250px" : "360px",
      height: isMobile ? "250px" : "360px",
      borderRadius: "55% 45% 37% 63%",
      background:
        "linear-gradient(135deg, rgba(251,146,60,.14), rgba(168,85,247,.12))",
      right: isMobile ? "-130px" : "-115px",
      bottom: isMobile ? "-90px" : "70px",
      filter: "blur(1px)",
      pointerEvents: "none",
      zIndex: 0,
    },
    container: {
      width: "100%",
      maxWidth: isMobile ? "460px" : "1120px",
      display: "grid",
      gridTemplateColumns: isMobile
        ? "minmax(0,1fr)"
        : "minmax(0, 1fr) 430px",
      gap: isMobile ? "16px" : "38px",
      alignItems: "center",
      position: "relative",
      zIndex: 2,
      animation: "authIn .36s ease both",
    },
    mobileBrand: {
      display: isMobile ? "flex" : "none",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      padding: "8px 0",
    },
    heroCard: {
      display: isMobile ? "none" : "block",
      minHeight: "590px",
      borderRadius: "40px",
      padding: "46px",
      background:
        "linear-gradient(135deg, rgba(255,255,255,.72), rgba(255,255,255,.52))",
      border: "1px solid rgba(255,255,255,.88)",
      boxShadow: "0 30px 90px rgba(88,28,135,.12)",
      backdropFilter: "blur(20px)",
      position: "relative",
      overflow: "hidden",
    },
    heroContent: {
      position: "relative",
      zIndex: 3,
      maxWidth: "610px",
      paddingRight: "210px",
    },
    decorativeGlow: {
      position: "absolute",
      width: "360px",
      height: "360px",
      borderRadius: "999px",
      background:
        "radial-gradient(circle, rgba(236,72,153,.16), transparent 62%)",
      right: "-40px",
      bottom: "-70px",
      zIndex: 0,
      pointerEvents: "none",
    },
    visualWrap: {
      position: "absolute",
      right: "-20px",
      bottom: "18px",
      width: "330px",
      height: "330px",
      pointerEvents: "none",
      zIndex: 1,
      opacity: 0.68,
    },
    mainOrb: {
      position: "absolute",
      width: "205px",
      height: "205px",
      borderRadius: "42% 58% 50% 50%",
      background:
        "linear-gradient(135deg, rgba(124,58,237,.95), rgba(236,72,153,.82) 58%, rgba(254,215,170,.88))",
      boxShadow:
        "0 30px 70px rgba(124,58,237,.20), inset 0 18px 35px rgba(255,255,255,.34)",
      left: "54px",
      top: "50px",
      animation: "floatSoft 5s ease-in-out infinite",
    },
    smallOrb: {
      position: "absolute",
      width: "72px",
      height: "72px",
      borderRadius: "50%",
      background: "rgba(255,255,255,.92)",
      right: "36px",
      top: "44px",
      boxShadow: "0 18px 35px rgba(15,23,42,.10)",
    },
    tinyOrb: {
      position: "absolute",
      width: "28px",
      height: "28px",
      borderRadius: "50%",
      background: "#fb923c",
      left: "44px",
      bottom: "70px",
      boxShadow: "0 12px 22px rgba(249,115,22,.22)",
    },
    diagonalLineOne: {
      position: "absolute",
      left: "88px",
      top: "102px",
      width: "126px",
      height: "2px",
      background:
        "linear-gradient(90deg, rgba(255,255,255,.1), rgba(255,255,255,.85), rgba(255,255,255,.1))",
      transform: "rotate(-28deg)",
    },
    diagonalLineTwo: {
      position: "absolute",
      right: "80px",
      bottom: "102px",
      width: "100px",
      height: "2px",
      background:
        "linear-gradient(90deg, rgba(124,58,237,.06), rgba(124,58,237,.42), rgba(124,58,237,.06))",
      transform: "rotate(32deg)",
    },
    loginCard: {
      width: "100%",
      background: "rgba(255,255,255,.93)",
      border: "1px solid rgba(226,232,240,.95)",
      borderRadius: isSmall ? "24px" : isMobile ? "30px" : "34px",
      padding: isSmall ? "22px" : isMobile ? "28px" : "34px",
      boxShadow: isMobile
        ? "0 22px 58px rgba(15,23,42,.12)"
        : "0 26px 76px rgba(15,23,42,.13)",
      backdropFilter: "blur(18px)",
      position: "relative",
      overflow: "hidden",
    },
    cardShine: {
      position: "absolute",
      inset: "0 auto 0 0",
      width: "45%",
      background:
        "linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent)",
      animation: "shimmer 5s ease-in-out infinite",
      pointerEvents: "none",
      opacity: 0.35,
    },
    logoIcon: {
      width: isSmall ? "42px" : "50px",
      height: isSmall ? "42px" : "50px",
      borderRadius: "18px",
      background: "linear-gradient(135deg, #7c3aed, #ec4899)",
      boxShadow: "0 16px 30px rgba(124,58,237,.26)",
      display: "grid",
      placeItems: "center",
      color: "#fff",
      fontWeight: 950,
      flexShrink: 0,
    },
    logo: {
      display: "inline-flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "34px",
      position: "relative",
      zIndex: 3,
    },
    badge: {
      display: "inline-flex",
      padding: "9px 13px",
      borderRadius: "999px",
      background: "#f5f3ff",
      border: "1px solid #ddd6fe",
      color: "#7c3aed",
      fontSize: "13px",
      fontWeight: 900,
      marginBottom: "18px",
    },
    title: {
      fontSize: "48px",
      lineHeight: 1.03,
      letterSpacing: "-2px",
      margin: "0 0 18px",
      color: "#111827",
    },
    subtitle: {
      color: "#64748b",
      fontSize: "16px",
      lineHeight: 1.75,
      maxWidth: "520px",
      margin: 0,
    },
    featureList: {
      marginTop: "28px",
      display: "grid",
      gap: "10px",
      maxWidth: "430px",
    },
    featureItem: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      color: "#475569",
      fontSize: "14px",
      fontWeight: 750,
    },
    checkDot: {
      width: "24px",
      height: "24px",
      borderRadius: "10px",
      display: "grid",
      placeItems: "center",
      background: "#ede9fe",
      color: "#7c3aed",
      fontWeight: 950,
      flexShrink: 0,
    },
    formTitle: {
      fontSize: isSmall ? "26px" : "30px",
      margin: "0 0 8px",
      letterSpacing: "-1px",
      color: "#111827",
      textAlign: isMobile ? "center" : "left",
      position: "relative",
      zIndex: 2,
    },
    formText: {
      color: "#64748b",
      margin: "0 0 26px",
      lineHeight: 1.6,
      textAlign: isMobile ? "center" : "left",
      fontSize: isSmall ? "14px" : "15px",
      position: "relative",
      zIndex: 2,
    },
    form: {
      position: "relative",
      zIndex: 2,
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: 850,
      color: "#374151",
      marginBottom: "8px",
    },
    inputGroup: {
      marginBottom: "17px",
    },
    input: {
      width: "100%",
      border:
        email && !emailLooksValid ? "1px solid #fb7185" : "1px solid #e5e7eb",
      background: "#fff",
      borderRadius: "18px",
      padding: isSmall ? "14px 15px" : "15px 16px",
      fontSize: "15px",
      color: "#111827",
      outline: "none",
      boxSizing: "border-box",
      boxShadow: "inset 0 2px 8px rgba(15,23,42,.03)",
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
      color: "#7c3aed",
      fontWeight: 850,
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
      fontWeight: 950,
      fontSize: "15px",
      background: loading
        ? "linear-gradient(135deg, #c4b5fd, #f9a8d4)"
        : "linear-gradient(135deg, #7c3aed, #ec4899)",
      color: "#fff",
      marginTop: "8px",
      boxShadow: "0 16px 32px rgba(139,92,246,.28)",
      opacity: loading ? 0.84 : 1,
      transition: "transform .18s ease, box-shadow .18s ease",
    },
    secondaryText: {
      textAlign: "center",
      marginTop: "22px",
      color: "#64748b",
      fontSize: "14px",
      lineHeight: 1.6,
      position: "relative",
      zIndex: 2,
    },
    link: {
      color: "#7c3aed",
      fontWeight: 950,
      textDecoration: "none",
    },
    hint: {
      display: isMobile ? "block" : "none",
      margin: "16px auto 0",
      maxWidth: "340px",
      textAlign: "center",
      color: "#64748b",
      fontSize: "13px",
      lineHeight: 1.55,
      position: "relative",
      zIndex: 2,
    },
  };

  return (
    <div style={styles.page}>
      <style>{styles.global}</style>

      <div style={styles.backgroundOrbOne}></div>
      <div style={styles.backgroundOrbTwo}></div>

      <div style={styles.container}>
        <div style={styles.mobileBrand}>
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

        <section style={styles.heroCard}>
          <div style={styles.decorativeGlow}></div>

          <div style={styles.heroContent}>
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
              Continúa tus entradas, conversaciones privadas y reportes
              emocionales con una experiencia limpia, segura y personalizada.
            </p>

            <div style={styles.featureList}>
              <div style={styles.featureItem}>
                <span style={styles.checkDot}>✓</span>
                Entradas privadas organizadas por usuario.
              </div>
              <div style={styles.featureItem}>
                <span style={styles.checkDot}>✓</span>
                Conversaciones con ARIA según tu diario.
              </div>
              <div style={styles.featureItem}>
                <span style={styles.checkDot}>✓</span>
                Reportes PDF con conclusión de IA.
              </div>
            </div>
          </div>

          <div style={styles.visualWrap}>
            <div style={styles.mainOrb}></div>
            <div style={styles.smallOrb}></div>
            <div style={styles.tinyOrb}></div>
            <div style={styles.diagonalLineOne}></div>
            <div style={styles.diagonalLineTwo}></div>
          </div>
        </section>

        <section style={styles.loginCard}>
          <div style={styles.cardShine}></div>

          <h2 style={styles.formTitle}>Iniciar sesión</h2>
          <p style={styles.formText}>
            Accede a tu diario emocional y continúa donde lo dejaste.
          </p>

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Correo electrónico</label>
              <input
                style={styles.input}
                type="email"
                placeholder="tu_correo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />

              {!emailLooksValid && (
                <small
                  style={{
                    color: "#e11d48",
                    fontWeight: 750,
                    display: "block",
                    marginTop: "7px",
                  }}
                >
                  Correo no válido
                </small>
              )}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Contraseña</label>

              <div style={styles.passwordWrap}>
                <input
                  style={{
                    ...styles.input,
                    paddingRight: "88px",
                    border: "1px solid #e5e7eb",
                  }}
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="auth-soft"
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
              className="auth-btn"
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Iniciar sesión →"}
            </button>
          </form>

          <p style={styles.secondaryText}>
            ¿Aún no tienes cuenta?{" "}
            <Link to="/register" className="auth-link" style={styles.link}>
              Crear cuenta
            </Link>
          </p>

          <p style={styles.hint}>
            Tus datos se cargan por usuario, así cada cuenta mantiene su propio
            diario y conversaciones.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Login;
