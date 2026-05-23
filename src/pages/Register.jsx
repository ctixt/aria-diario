import { useState, useEffect, useMemo } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../components/useToast";

function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [screenWidth, setScreenWidth] = useState(() => {
    if (typeof window === "undefined") return 1200;
    return window.innerWidth;
  });

  const navigate = useNavigate();
  const { showToast } = useToast();

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

  const passwordScore = useMemo(() => {
    let score = 0;
    if (password.length >= 6) score += 35;
    if (password.length >= 10) score += 25;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 10;
    return Math.min(score, 100);
  }, [password]);

  const passwordLabel =
    passwordScore >= 75 ? "Fuerte" : passwordScore >= 45 ? "Aceptable" : "Básica";

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !email.trim() || !password.trim()) {
      showToast("Por favor completa todos los campos", "warning");
      return;
    }

    if (!emailLooksValid) {
      showToast("Ingresa un correo válido", "warning");
      return;
    }

    if (password.length < 6) {
      showToast("La contraseña debe tener al menos 6 caracteres", "warning");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        if (
          error.message.includes("already registered") ||
          error.message.includes("already exists") ||
          error.message.includes("User already registered")
        ) {
          showToast(
            "Esta cuenta ya existe. Serás enviado al inicio de sesión.",
            "warning"
          );
          setTimeout(() => navigate("/"), 800);
          return;
        }

        if (error.message.includes("email rate limit exceeded")) {
          showToast(
            "Supabase alcanzó el límite de correos. Intenta más tarde.",
            "warning"
          );
          return;
        }

        showToast("Error: " + error.message, "error");
        return;
      }

      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            nombre: nombre.trim(),
            email: email.trim(),
          },
        ]);

        if (profileError) {
          if (profileError.message.includes("duplicate key")) {
            showToast(
              "El perfil de este usuario ya existe. Serás enviado al inicio de sesión.",
              "warning"
            );
            setTimeout(() => navigate("/"), 800);
            return;
          }

          showToast("Error creando perfil: " + profileError.message, "error");
          return;
        }

        localStorage.setItem("aria_last_email", email.trim());
        showToast("Usuario registrado correctamente", "success");
        setNombre("");
        setEmail("");
        setPassword("");
        setTimeout(() => navigate("/"), 900);
      }
    } catch (error) {
      console.log("Error en registro:", error);
      showToast("Ocurrió un error al registrarte", "error");
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
        "radial-gradient(circle at 10% 18%, rgba(124,58,237,.16), transparent 30%), radial-gradient(circle at 88% 12%, rgba(236,72,153,.12), transparent 26%), radial-gradient(circle at 78% 88%, rgba(251,146,60,.12), transparent 26%), linear-gradient(135deg, #ffffff 0%, #faf7ff 48%, #fff7ed 100%)",
      position: "relative",
      overflowX: "hidden",
      boxSizing: "border-box",
    },
    global: `
      *, *::before, *::after { box-sizing: border-box; }
      html, body, #root { width: 100%; max-width: 100%; margin: 0; padding: 0; overflow-x: hidden; }
      input, button { font-family: inherit; max-width: 100%; }
      @keyframes authIn { from { opacity: 0; transform: translateY(14px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      @keyframes floaty { 0%, 100% { transform: translateY(0) rotate(-8deg); } 50% { transform: translateY(-10px) rotate(-4deg); } }
      @keyframes softPulse { 0%, 100% { opacity: .7; transform: scale(1); } 50% { opacity: .9; transform: scale(1.03); } }
      .auth-btn:hover { transform: translateY(-2px); box-shadow: 0 22px 40px rgba(139,92,246,.30); }
      .auth-soft:hover { background: #f8fafc; transform: translateY(-1px); }
      .auth-btn:active, .auth-soft:active { transform: scale(.985); }
      .auth-link:hover { text-decoration: underline; }
      button:focus-visible, input:focus-visible { outline: 3px solid rgba(124,58,237,.22); outline-offset: 2px; }
    `,
    orbOne: {
      position: "absolute",
      width: isMobile ? "220px" : "360px",
      height: isMobile ? "220px" : "360px",
      borderRadius: "44% 56% 61% 39%",
      background:
        "linear-gradient(135deg, rgba(139,92,246,.13), rgba(236,72,153,.09), rgba(254,215,170,.16))",
      top: isMobile ? "-80px" : "64px",
      left: isMobile ? "-120px" : "-150px",
      filter: "blur(4px)",
      pointerEvents: "none",
      zIndex: 0,
    },
    orbTwo: {
      position: "absolute",
      width: isMobile ? "240px" : "330px",
      height: isMobile ? "240px" : "330px",
      borderRadius: "55% 45% 37% 63%",
      background:
        "linear-gradient(135deg, rgba(251,146,60,.12), rgba(168,85,247,.10))",
      right: isMobile ? "-125px" : "-115px",
      bottom: isMobile ? "-90px" : "60px",
      filter: "blur(3px)",
      pointerEvents: "none",
      zIndex: 0,
    },
    container: {
      width: "100%",
      maxWidth: isMobile ? "460px" : "1100px",
      display: "grid",
      gridTemplateColumns: isMobile ? "minmax(0,1fr)" : "minmax(0,1fr) 430px",
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
        "linear-gradient(135deg, rgba(255,255,255,.78), rgba(255,255,255,.52))",
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
    },
    registerCard: {
      width: "100%",
      background: "rgba(255,255,255,.94)",
      border: "1px solid rgba(226,232,240,.94)",
      borderRadius: isSmall ? "24px" : isMobile ? "30px" : "34px",
      padding: isSmall ? "22px" : isMobile ? "28px" : "34px",
      boxShadow: isMobile
        ? "0 22px 58px rgba(15,23,42,.12)"
        : "0 26px 76px rgba(15,23,42,.13)",
      backdropFilter: "blur(18px)",
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
      zIndex: 4,
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
      fontSize: "46px",
      lineHeight: 1.03,
      letterSpacing: "-2px",
      margin: "0 0 18px",
      color: "#111827",
      maxWidth: "560px",
    },
    subtitle: {
      color: "#64748b",
      fontSize: "16px",
      lineHeight: 1.75,
      maxWidth: "545px",
      margin: 0,
    },
    miniGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "12px",
      marginTop: "28px",
      maxWidth: "560px",
      position: "relative",
      zIndex: 4,
    },
    miniCard: {
      padding: "14px",
      borderRadius: "20px",
      background: "rgba(255,255,255,.75)",
      border: "1px solid rgba(226,232,240,.85)",
      boxShadow: "0 14px 30px rgba(15,23,42,.05)",
    },
    visualWrap: {
      position: "absolute",
      right: "-20px",
      bottom: "-22px",
      width: "300px",
      height: "300px",
      pointerEvents: "none",
      zIndex: 1,
      opacity: 0.72,
    },
    mainOrb: {
      position: "absolute",
      width: "190px",
      height: "190px",
      borderRadius: "42% 58% 50% 50%",
      background: "linear-gradient(135deg, #7c3aed, #ec4899 55%, #fed7aa)",
      boxShadow:
        "0 28px 62px rgba(124,58,237,.22), inset 0 18px 35px rgba(255,255,255,.36)",
      left: "58px",
      top: "58px",
      animation: "floaty 5s ease-in-out infinite",
    },
    softCircle: {
      position: "absolute",
      width: "260px",
      height: "260px",
      right: "-80px",
      bottom: "-80px",
      borderRadius: "999px",
      background:
        "radial-gradient(circle, rgba(124,58,237,.18), rgba(236,72,153,.10), transparent 68%)",
      animation: "softPulse 6s ease-in-out infinite",
      zIndex: 0,
    },
    smallOrb: {
      position: "absolute",
      width: "68px",
      height: "68px",
      borderRadius: "50%",
      background: "#fff",
      right: "36px",
      top: "38px",
      boxShadow: "0 18px 35px rgba(15,23,42,.10)",
    },
    tinyOrb: {
      position: "absolute",
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      background: "#fb923c",
      left: "42px",
      bottom: "52px",
      boxShadow: "0 12px 22px rgba(249,115,22,.22)",
    },
    formTitle: {
      fontSize: isSmall ? "26px" : "30px",
      margin: "0 0 8px",
      letterSpacing: "-1px",
      color: "#111827",
      textAlign: isMobile ? "center" : "left",
    },
    formText: {
      color: "#64748b",
      margin: "0 0 24px",
      lineHeight: 1.6,
      textAlign: isMobile ? "center" : "left",
      fontSize: isSmall ? "14px" : "15px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: 850,
      color: "#374151",
      marginBottom: "8px",
    },
    inputGroup: { marginBottom: "16px" },
    input: {
      width: "100%",
      border: "1px solid #e5e7eb",
      background: "#fff",
      borderRadius: "18px",
      padding: isSmall ? "14px 14px" : "15px 16px",
      fontSize: "15px",
      color: "#111827",
      outline: "none",
      boxSizing: "border-box",
      boxShadow: "inset 0 2px 8px rgba(15,23,42,.03)",
    },
    passwordWrap: { position: "relative", width: "100%" },
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
      padding: isSmall ? "7px 8px" : "8px 10px",
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
      opacity: loading ? 0.82 : 1,
      transition: "transform .18s ease, box-shadow .18s ease",
    },
    secondaryText: {
      textAlign: "center",
      marginTop: "22px",
      color: "#64748b",
      fontSize: "14px",
      lineHeight: 1.6,
    },
    link: { color: "#7c3aed", fontWeight: 950, textDecoration: "none" },
    strengthTrack: {
      height: "8px",
      borderRadius: "999px",
      background: "#ede9fe",
      overflow: "hidden",
      marginTop: "10px",
    },
    strengthFill: {
      height: "100%",
      width: `${passwordScore}%`,
      borderRadius: "999px",
      background: "linear-gradient(135deg, #7c3aed, #ec4899)",
      transition: "width .25s ease",
    },
  };

  return (
    <div style={styles.page}>
      <style>{styles.global}</style>
      <div style={styles.orbOne}></div>
      <div style={styles.orbTwo}></div>

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
          <div style={styles.softCircle}></div>

          <div style={styles.heroContent}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>A</div>
              <div>
                <strong style={{ color: "#111827", fontSize: "18px" }}>ARIA</strong>
                <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
                  Diario emocional inteligente
                </p>
              </div>
            </div>

            <div style={styles.badge}>Crea tu cuenta · Empieza tu diario</div>

            <h1 style={styles.title}>
              Construye tu espacio emocional con ARIA.
            </h1>

            <p style={styles.subtitle}>
              Registra emociones, crea entradas personales, conversa con ARIA y
              genera reportes inteligentes desde cualquier dispositivo.
            </p>

            <div style={styles.miniGrid}>
              <div style={styles.miniCard}>
                <strong style={{ color: "#7c3aed" }}>01</strong>
                <p style={{ margin: "7px 0 0", color: "#64748b", fontSize: "13px", lineHeight: 1.45 }}>
                  Guarda tus emociones.
                </p>
              </div>
              <div style={styles.miniCard}>
                <strong style={{ color: "#ec4899" }}>02</strong>
                <p style={{ margin: "7px 0 0", color: "#64748b", fontSize: "13px", lineHeight: 1.45 }}>
                  Conversa con IA.
                </p>
              </div>
              <div style={styles.miniCard}>
                <strong style={{ color: "#f97316" }}>03</strong>
                <p style={{ margin: "7px 0 0", color: "#64748b", fontSize: "13px", lineHeight: 1.45 }}>
                  Genera reportes.
                </p>
              </div>
            </div>
          </div>

          <div style={styles.visualWrap}>
            <div style={styles.mainOrb}></div>
            <div style={styles.smallOrb}></div>
            <div style={styles.tinyOrb}></div>
          </div>
        </section>

        <section style={styles.registerCard}>
          <h2 style={styles.formTitle}>Crear cuenta</h2>
          <p style={styles.formText}>Completa tus datos para empezar a usar ARIA.</p>

          <form onSubmit={handleRegister}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nombre</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Correo electrónico</label>
              <input
                style={{
                  ...styles.input,
                  border:
                    email && !emailLooksValid
                      ? "1px solid #fb7185"
                      : "1px solid #e5e7eb",
                }}
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
                  style={{ ...styles.input, paddingRight: "88px" }}
                  type={showPassword ? "text" : "password"}
                  placeholder="Crea una contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
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

              {password && (
                <div>
                  <div style={styles.strengthTrack}>
                    <div style={styles.strengthFill}></div>
                  </div>
                  <small
                    style={{
                      color: "#64748b",
                      fontWeight: 750,
                      display: "block",
                      marginTop: "7px",
                    }}
                  >
                    Seguridad: {passwordLabel}
                  </small>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="auth-btn"
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrarse →"}
            </button>
          </form>

          <p style={styles.secondaryText}>
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="auth-link" style={styles.link}>
              Iniciar sesión
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Register;
