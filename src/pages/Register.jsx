import { useState, useEffect } from "react";
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

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !email.trim() || !password.trim()) {
      showToast("Por favor completa todos los campos", "warning");
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

          setTimeout(() => {
            navigate("/");
          }, 800);

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

            setTimeout(() => {
              navigate("/");
            }, 800);

            return;
          }

          showToast("Error creando perfil: " + profileError.message, "error");
          return;
        }

        showToast("Usuario registrado correctamente", "success");

        setNombre("");
        setEmail("");
        setPassword("");

        setTimeout(() => {
          navigate("/");
        }, 900);
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
      background:
        "radial-gradient(circle at 12% 18%, rgba(245, 208, 254, 0.95) 0, transparent 30%), radial-gradient(circle at 88% 14%, rgba(254, 215, 170, 0.95) 0, transparent 28%), linear-gradient(135deg, #ffffff 0%, #faf7ff 46%, #fff7ed 100%)",
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
    globalStyle: `
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

      .aria-auth-card {
        animation: authIn 0.28s ease both;
      }

      @keyframes authIn {
        from {
          opacity: 0;
          transform: translateY(12px) scale(0.98);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .aria-auth-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 18px 36px rgba(139, 92, 246, 0.30);
      }

      .aria-auth-link:hover {
        text-decoration: underline;
      }
    `,
    blobOne: {
      position: "absolute",
      width: isMobile ? "250px" : "430px",
      height: isMobile ? "250px" : "430px",
      borderRadius: "44% 56% 61% 39%",
      background:
        "linear-gradient(135deg, rgba(139,92,246,0.22), rgba(236,72,153,0.16), rgba(254,215,170,0.25))",
      top: isMobile ? "18px" : "80px",
      left: isMobile ? "-120px" : "-150px",
      filter: "blur(2px)",
      zIndex: 0,
      pointerEvents: "none",
    },
    blobTwo: {
      position: "absolute",
      width: isMobile ? "260px" : "380px",
      height: isMobile ? "260px" : "380px",
      borderRadius: "55% 45% 37% 63%",
      background:
        "linear-gradient(135deg, rgba(251,146,60,0.18), rgba(168,85,247,0.16))",
      right: isMobile ? "-135px" : "-120px",
      bottom: isMobile ? "24px" : "80px",
      filter: "blur(1px)",
      zIndex: 0,
      pointerEvents: "none",
    },
    container: {
      width: "100%",
      maxWidth: isMobile ? "440px" : "1080px",
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 430px",
      gap: isMobile ? "16px" : "36px",
      alignItems: "center",
      position: "relative",
      zIndex: 2,
    },
    mobileBrand: {
      display: isMobile ? "flex" : "none",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      marginBottom: "4px",
      padding: "8px",
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
    registerCard: {
      width: "100%",
      maxWidth: "100%",
      background: "rgba(255, 255, 255, 0.92)",
      border: "1px solid rgba(226, 232, 240, 0.95)",
      borderRadius: isSmall ? "24px" : isMobile ? "28px" : "32px",
      padding: isSmall ? "22px 18px" : isMobile ? "26px 22px" : "34px",
      boxShadow: isMobile
        ? "0 20px 55px rgba(15, 23, 42, 0.12)"
        : "0 24px 70px rgba(15, 23, 42, 0.12)",
      backdropFilter: "blur(18px)",
      overflow: "hidden",
    },
    logo: {
      display: "inline-flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "34px",
    },
    logoIcon: {
      width: isSmall ? "44px" : "48px",
      height: isSmall ? "44px" : "48px",
      borderRadius: "18px",
      background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
      boxShadow: "0 14px 28px rgba(139,92,246,0.25)",
      display: "grid",
      placeItems: "center",
      color: "#ffffff",
      fontWeight: "900",
      fontSize: "20px",
      flexShrink: 0,
    },
    title: {
      fontSize: "46px",
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
    visualWrap: {
      position: "absolute",
      right: "38px",
      bottom: "34px",
      width: "300px",
      height: "300px",
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
      fontSize: isSmall ? "26px" : "30px",
      margin: "0 0 8px",
      letterSpacing: "-1px",
      color: "#111827",
      textAlign: isMobile ? "center" : "left",
    },
    formText: {
      color: "#64748b",
      margin: "0 0 24px",
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
      marginBottom: "16px",
    },
    input: {
      width: "100%",
      border: "1px solid #e5e7eb",
      background: "#ffffff",
      borderRadius: "18px",
      padding: isSmall ? "14px 14px" : "15px 16px",
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
      padding: isSmall ? "7px 8px" : "8px 10px",
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
      opacity: loading ? 0.8 : 1,
      transition: "transform .18s ease, box-shadow .18s ease",
    },
    secondaryText: {
      textAlign: "center",
      marginTop: "22px",
      color: "#64748b",
      fontSize: "14px",
      lineHeight: 1.6,
    },
    link: {
      color: "#8b5cf6",
      fontWeight: "900",
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.page}>
      <style>{styles.globalStyle}</style>

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

          <div style={styles.badge}>Crea tu cuenta · Empieza tu diario</div>

          <h1 style={styles.title}>
            Comienza a construir tu espacio emocional con ARIA.
          </h1>

          <p style={styles.subtitle}>
            Regístrate para guardar tus emociones, crear entradas personales,
            conversar con ARIA y recibir análisis basados en tu propio diario.
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

        <section className="aria-auth-card" style={styles.registerCard}>
          <h2 style={styles.formTitle}>Crear cuenta</h2>
          <p style={styles.formText}>
            Completa tus datos para empezar a usar ARIA.
          </p>

          <form onSubmit={handleRegister}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nombre</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={loading}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Correo electrónico</label>
              <input
                style={styles.input}
                type="email"
                placeholder="tu_correo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
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
                  placeholder="Crea una contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
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
              className="aria-auth-button"
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrarse →"}
            </button>
          </form>

          <p style={styles.secondaryText}>
            ¿Ya tienes cuenta?{" "}
            <Link to="/" className="aria-auth-link" style={styles.link}>
              Iniciar sesión
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Register;
