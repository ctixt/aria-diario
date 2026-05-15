import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";


function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !email.trim() || !password.trim()) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {

  // Si el usuario ya existe
  if (
    error.message.includes("already registered") ||
    error.message.includes("already exists") ||
    error.message.includes("User already registered")
  ) {

    alert(
      "Esta cuenta ya existe. Serás enviado al inicio de sesión."
    );

    navigate("/");

    return;
  }

  alert("Error: " + error.message);
  return;
}

      if (data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              id: data.user.id,
              nombre: nombre,
              email: email,
            },
          ]);

        if (profileError) {
          alert("Error creando perfil: " + profileError.message);
          return;
        }

        alert("Usuario registrado correctamente");
        navigate("/");
      }
    } catch (error) {
      console.log("Error en registro:", error);
      alert("Ocurrió un error al registrarte");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background:
        "radial-gradient(circle at 15% 20%, #f5d0fe 0, transparent 28%), radial-gradient(circle at 85% 15%, #fed7aa 0, transparent 24%), linear-gradient(135deg, #ffffff 0%, #faf7ff 46%, #fff7ed 100%)",
      display: "grid",
      placeItems: "center",
      padding: "28px",
      fontFamily:
        "Inter, Poppins, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      position: "relative",
      overflow: "hidden",
      color: "#172033",
    },
    blobOne: {
      position: "absolute",
      width: "430px",
      height: "430px",
      borderRadius: "44% 56% 61% 39%",
      background:
        "linear-gradient(135deg, rgba(139,92,246,0.22), rgba(236,72,153,0.16), rgba(254,215,170,0.25))",
      top: "80px",
      left: "-150px",
      filter: "blur(2px)",
      zIndex: 0,
    },
    blobTwo: {
      position: "absolute",
      width: "380px",
      height: "380px",
      borderRadius: "55% 45% 37% 63%",
      background:
        "linear-gradient(135deg, rgba(251,146,60,0.18), rgba(168,85,247,0.16))",
      right: "-120px",
      bottom: "80px",
      filter: "blur(1px)",
      zIndex: 0,
    },
    container: {
      width: "100%",
      maxWidth: "1080px",
      display: "grid",
      gridTemplateColumns: "1fr 430px",
      gap: "36px",
      alignItems: "center",
      position: "relative",
      zIndex: 2,
    },
    heroCard: {
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
      background: "rgba(255, 255, 255, 0.88)",
      border: "1px solid rgba(226, 232, 240, 0.9)",
      borderRadius: "32px",
      padding: "34px",
      boxShadow: "0 24px 70px rgba(15, 23, 42, 0.12)",
      backdropFilter: "blur(18px)",
    },
    logo: {
      display: "inline-flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "34px",
    },
    logoIcon: {
      width: "48px",
      height: "48px",
      borderRadius: "18px",
      background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
      boxShadow: "0 14px 28px rgba(139,92,246,0.25)",
      display: "grid",
      placeItems: "center",
      color: "#ffffff",
      fontWeight: "900",
      fontSize: "20px",
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
      fontSize: "30px",
      margin: "0 0 8px",
      letterSpacing: "-1px",
      color: "#111827",
    },
    formText: {
      color: "#64748b",
      margin: "0 0 28px",
      lineHeight: "1.6",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "800",
      color: "#374151",
      marginBottom: "8px",
    },
    inputGroup: {
      marginBottom: "18px",
    },
    input: {
      width: "100%",
      border: "1px solid #e5e7eb",
      background: "#ffffff",
      borderRadius: "18px",
      padding: "15px 16px",
      fontSize: "15px",
      color: "#111827",
      outline: "none",
      boxSizing: "border-box",
      boxShadow: "inset 0 2px 8px rgba(15,23,42,0.03)",
    },
    passwordWrap: {
      position: "relative",
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
      cursor: "pointer",
    },
    submitButton: {
      width: "100%",
      border: "none",
      borderRadius: "18px",
      padding: "15px 18px",
      cursor: "pointer",
      fontWeight: "900",
      fontSize: "15px",
      background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
      color: "#ffffff",
      marginTop: "10px",
      boxShadow: "0 16px 32px rgba(139, 92, 246, 0.28)",
    },
    secondaryText: {
      textAlign: "center",
      marginTop: "22px",
      color: "#64748b",
      fontSize: "14px",
    },
    link: {
      color: "#8b5cf6",
      fontWeight: "900",
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.blobOne}></div>
      <div style={styles.blobTwo}></div>

      <div style={styles.container}>
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

        <section style={styles.registerCard}>
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
                />

                <button
                  type="button"
                  style={styles.showButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrarse →"}
            </button>
          </form>

          <p style={styles.secondaryText}>
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" style={styles.link}>
              Iniciar sesión
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Register;