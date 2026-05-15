import { useState, useEffect, useMemo } from "react";
import { supabase } from "../lib/supabase";
import groq from "../lib/groq";
import { useToast } from "../components/useToast";

function Dashboard() {
  const { showToast } = useToast();

  const [activePanel, setActivePanel] = useState("home");

  const [moodLevel, setMoodLevel] = useState(3);
  const [moodReply, setMoodReply] = useState(
    "Todo bien? ¿Necesitas ayuda en algo o solo quieres escribir un poco?"
  );

  const [entryInput, setEntryInput] = useState("");
  const [conversationInput, setConversationInput] = useState("");

  const [entries, setEntries] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);

  const [globalInput, setGlobalInput] = useState("");
  const [globalResponse, setGlobalResponse] = useState("");

  const [conversationSearch, setConversationSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= 768;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [profile, setProfile] = useState(null);

  const userName =
    profile?.nombre && profile.nombre.trim()
      ? profile.nombre.trim()
      : "amigo";

  const moodOptions = [
    {
      value: 1,
      label: "Muy mal",
      emoji: "😞",
      message: "Siento que hoy esté siendo difícil. ¿Quieres contarme qué pasó?",
      color: "#ef4444",
      soft: "#fee2e2",
    },
    {
      value: 2,
      label: "Bajo",
      emoji: "😕",
      message:
        "Veo que tu ánimo está bajo. Podemos hablar un poco si necesitas soltarlo.",
      color: "#f97316",
      soft: "#ffedd5",
    },
    {
      value: 3,
      label: "Neutral",
      emoji: "😐",
      message:
        "Todo bien? ¿Necesitas ayuda en algo o solo quieres escribir un poco?",
      color: "#8b5cf6",
      soft: "#ede9fe",
    },
    {
      value: 4,
      label: "Bien",
      emoji: "🙂",
      message:
        "Me alegra que estés bien. ¿Hubo algo que ayudó a que tu día fuera mejor?",
      color: "#10b981",
      soft: "#d1fae5",
    },
    {
      value: 5,
      label: "Genial",
      emoji: "😄",
      message: "Qué bueno saber eso. ¿Qué hizo especial tu día?",
      color: "#06b6d4",
      soft: "#cffafe",
    },
  ];

  const selectedMood = moodOptions.find(
    (mood) => mood.value === Number(moodLevel)
  );

  const stats = {
    entries: entries.length,
    conversations: conversations.length,
  };

  const filteredConversations = useMemo(() => {
    const search = conversationSearch.toLowerCase().trim();

    if (!search) return conversations;

    return conversations.filter((conv) => {
      return (
        conv.titulo?.toLowerCase().includes(search) ||
        conv.tipo?.toLowerCase().includes(search)
      );
    });
  }, [conversations, conversationSearch]);

  const quickGlobalPrompts = [
    "¿Qué opinas de mis emociones esta semana?",
    "Hazme una lista de mis emociones recientes",
    "¿Qué patrones notas en mis entradas?",
    "Dame una recomendación según mi semana",
  ];

  const latestEntry = entries[0] || null;
  const latestConversation = conversations[0] || null;

  const styles = {
    page: {
      minHeight: "100vh",
      background:
        "radial-gradient(circle at 12% 12%, rgba(124, 58, 237, 0.11), transparent 28%), radial-gradient(circle at 88% 16%, rgba(236, 72, 153, 0.10), transparent 24%), linear-gradient(135deg, #f8fafc 0%, #ffffff 52%, #fff7ed 100%)",
      color: "#111827",
      padding: isMobile ? "14px" : "22px",
      fontFamily:
        "Inter, Poppins, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      position: "relative",
      overflowX: "hidden",
      paddingBottom: isMobile ? "92px" : "22px",
    },
    appShell: {
      width: "100%",
      maxWidth: "1360px",
      margin: "0 auto",
      display: isMobile ? "block" : "grid",
      gridTemplateColumns: "270px minmax(0, 1fr)",
      gap: "18px",
      position: "relative",
      zIndex: 2,
    },
    sidebar: {
      display: isMobile ? "none" : "flex",
      flexDirection: "column",
      minHeight: "calc(100vh - 44px)",
      position: "sticky",
      top: "22px",
      borderRadius: "30px",
      padding: "18px",
      background: "rgba(255,255,255,0.78)",
      border: "1px solid rgba(226,232,240,0.95)",
      boxShadow: "0 24px 70px rgba(15,23,42,0.08)",
      backdropFilter: "blur(18px)",
    },
    main: {
      minWidth: 0,
    },
    topbar: {
      display: "flex",
      alignItems: isMobile ? "flex-start" : "center",
      justifyContent: "space-between",
      gap: "14px",
      flexWrap: "wrap",
      marginBottom: "16px",
      padding: isMobile ? "16px" : "18px 20px",
      borderRadius: isMobile ? "24px" : "28px",
      background: "rgba(255,255,255,0.82)",
      border: "1px solid rgba(226,232,240,0.95)",
      boxShadow: "0 18px 50px rgba(15,23,42,0.06)",
      backdropFilter: "blur(18px)",
    },
    logoBox: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    logoIcon: {
      width: "46px",
      height: "46px",
      borderRadius: "16px",
      background: "linear-gradient(135deg, #7c3aed, #ec4899)",
      color: "#ffffff",
      display: "grid",
      placeItems: "center",
      fontWeight: "950",
      boxShadow: "0 18px 34px rgba(124,58,237,0.25)",
      flexShrink: 0,
    },
    logoTitle: {
      margin: 0,
      fontSize: "26px",
      letterSpacing: "-1.2px",
      color: "#111827",
    },
    logoSub: {
      margin: 0,
      color: "#64748b",
      fontSize: "13px",
      lineHeight: 1.4,
    },
    panel: {
      animation: "softIn 0.28s ease both",
    },
    card: {
      background: "rgba(255,255,255,0.9)",
      border: "1px solid rgba(226,232,240,0.95)",
      borderRadius: isMobile ? "24px" : "30px",
      padding: isMobile ? "18px" : "24px",
      boxShadow: "0 20px 55px rgba(15,23,42,0.07)",
      backdropFilter: "blur(18px)",
    },
    compactCard: {
      background: "#ffffff",
      border: "1px solid #eef2f7",
      borderRadius: "24px",
      padding: isMobile ? "16px" : "18px",
      boxShadow: "0 14px 34px rgba(15,23,42,0.05)",
    },
    hero: {
      position: "relative",
      overflow: "hidden",
      borderRadius: isMobile ? "28px" : "34px",
      padding: isMobile ? "24px" : "34px",
      background:
        "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(236,72,153,0.86)), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.28), transparent 28%)",
      color: "#ffffff",
      boxShadow: "0 26px 70px rgba(124,58,237,0.24)",
      marginBottom: "18px",
    },
    heroTitle: {
      margin: "8px 0 12px",
      fontSize: isMobile ? "31px" : "44px",
      lineHeight: "1.05",
      letterSpacing: isMobile ? "-1px" : "-2px",
      maxWidth: "760px",
    },
    heroText: {
      margin: 0,
      maxWidth: "690px",
      color: "rgba(255,255,255,0.88)",
      lineHeight: 1.7,
      fontSize: isMobile ? "15px" : "16px",
    },
    grid2: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) 370px",
      gap: "18px",
      alignItems: "start",
    },
    gridGlobal: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) 300px",
      gap: "18px",
      alignItems: "start",
    },
    statGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
      gap: "14px",
      marginBottom: "18px",
    },
    moodGrid: {
      display: "grid",
      gridTemplateColumns: isMobile
        ? "repeat(2, minmax(0, 1fr))"
        : "repeat(5, minmax(0, 1fr))",
      gap: "12px",
      marginTop: "18px",
    },
    entriesGrid: {
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "14px",
    },
    textarea: {
      width: "100%",
      minHeight: isMobile ? "116px" : "136px",
      borderRadius: "22px",
      border: "1px solid #e5e7eb",
      background: "#ffffff",
      color: "#111827",
      padding: "16px",
      outline: "none",
      resize: "vertical",
      fontSize: "15px",
      boxSizing: "border-box",
      lineHeight: "1.7",
      boxShadow: "inset 0 2px 8px rgba(15,23,42,0.03)",
    },
    input: {
      width: "100%",
      borderRadius: "16px",
      border: "1px solid #e5e7eb",
      background: "#ffffff",
      color: "#111827",
      padding: "13px 15px",
      outline: "none",
      fontSize: "14px",
      boxSizing: "border-box",
    },
    button: {
      border: "none",
      borderRadius: "16px",
      padding: "13px 18px",
      cursor: loading ? "not-allowed" : "pointer",
      fontWeight: "850",
      background: "linear-gradient(135deg, #7c3aed, #ec4899)",
      color: "#ffffff",
      boxShadow: "0 14px 30px rgba(124,58,237,0.22)",
      opacity: loading ? 0.75 : 1,
      width: isMobile ? "100%" : "auto",
      transition: "transform .18s ease, box-shadow .18s ease",
    },
    orangeButton: {
      border: "none",
      borderRadius: "16px",
      padding: "13px 18px",
      cursor: loading ? "not-allowed" : "pointer",
      fontWeight: "850",
      background: "linear-gradient(135deg, #fb923c, #f97316)",
      color: "#ffffff",
      boxShadow: "0 14px 30px rgba(249,115,22,0.20)",
      opacity: loading ? 0.75 : 1,
      width: isMobile ? "100%" : "auto",
    },
    secondaryButton: {
      border: "1px solid #e5e7eb",
      borderRadius: "16px",
      padding: "12px 15px",
      cursor: "pointer",
      fontWeight: "800",
      background: "#ffffff",
      color: "#475569",
      boxShadow: "0 10px 25px rgba(15,23,42,0.04)",
    },
    ghostButton: {
      border: "1px solid #e5e7eb",
      borderRadius: "16px",
      padding: "12px 15px",
      cursor: "pointer",
      fontWeight: "800",
      background: "#ffffff",
      color: "#475569",
      transition: "transform .18s ease, background .18s ease",
    },
    label: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 12px",
      borderRadius: "999px",
      background: "#f8fafc",
      border: "1px solid #e5e7eb",
      color: "#64748b",
      fontSize: "13px",
      fontWeight: "750",
      whiteSpace: "nowrap",
    },
    logoutButton: {
      border: "1px solid #fecdd3",
      borderRadius: "14px",
      padding: "10px 16px",
      background: "#fff1f2",
      color: "#be123c",
      cursor: loading ? "not-allowed" : "pointer",
      fontWeight: 850,
      opacity: loading ? 0.75 : 1,
      width: isMobile ? "100%" : "auto",
    },
    bottomNav: {
      display: isMobile ? "grid" : "none",
      gridTemplateColumns: "repeat(4, 1fr)",
      position: "fixed",
      left: "12px",
      right: "12px",
      bottom: "12px",
      zIndex: 5000,
      padding: "8px",
      borderRadius: "24px",
      background: "rgba(255,255,255,0.92)",
      border: "1px solid rgba(226,232,240,0.95)",
      boxShadow: "0 20px 55px rgba(15,23,42,0.18)",
      backdropFilter: "blur(18px)",
      gap: "6px",
    },
    modalOverlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(15,23,42,0.45)",
      backdropFilter: "blur(8px)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "22px",
    },
    modalCard: {
      width: "100%",
      maxWidth: isMobile ? "92%" : "430px",
      background: "rgba(255,255,255,0.96)",
      border: "1px solid rgba(255,255,255,0.9)",
      borderRadius: "28px",
      padding: isMobile ? "22px" : "28px",
      boxShadow: "0 28px 80px rgba(15,23,42,0.24)",
      backdropFilter: "blur(18px)",
      animation: "modalIn .22s ease",
    },
    modalIcon: {
      width: "56px",
      height: "56px",
      borderRadius: "18px",
      background: "#fff1f2",
      color: "#e11d48",
      display: "grid",
      placeItems: "center",
      fontSize: "26px",
      fontWeight: "900",
      marginBottom: "16px",
    },
    modalTitle: {
      margin: "0 0 8px",
      fontSize: "24px",
      color: "#111827",
      letterSpacing: "-0.7px",
    },
    modalText: {
      margin: 0,
      color: "#64748b",
      lineHeight: "1.7",
      fontSize: "15px",
    },
    modalActions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "12px",
      marginTop: "24px",
      flexWrap: "wrap",
    },
    modalCancelButton: {
      border: "1px solid #e5e7eb",
      background: "#ffffff",
      color: "#374151",
      borderRadius: "16px",
      padding: "12px 18px",
      fontWeight: "900",
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.7 : 1,
    },
    modalConfirmButton: {
      border: "none",
      background: "linear-gradient(135deg, #ef4444, #e11d48)",
      color: "#ffffff",
      borderRadius: "16px",
      padding: "12px 18px",
      fontWeight: "900",
      cursor: loading ? "not-allowed" : "pointer",
      boxShadow: "0 14px 28px rgba(225, 29, 72, 0.22)",
      opacity: loading ? 0.75 : 1,
    },
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString();
  };

  const getMoodText = (level = moodLevel) => {
    const found = moodOptions.find((mood) => mood.value === Number(level));
    return found ? `${found.emoji} ${found.label}` : "😐 Neutral";
  };

  const getMoodBriefReply = (level) => {
    const found = moodOptions.find((mood) => mood.value === Number(level));
    return found ? found.message : "Estoy aquí si quieres hablar.";
  };

  const cleanMoodLabel = (label) => {
    return String(label || "")
      .replace("😞", "")
      .replace("😕", "")
      .replace("😐", "")
      .replace("🙂", "")
      .replace("😄", "")
      .trim();
  };

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  };

  const fetchProfile = async () => {
    const user = await getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("nombre, email")
      .eq("id", user.id)
      .single();

    if (error) {
      console.log("Error cargando perfil:", error);
      return;
    }

    setProfile(data);
  };

  const fetchEntries = async () => {
    const user = await getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("entries")
      .select("*")
      .eq("user_id", user.id)
      .order("fecha", { ascending: false });

    if (error) {
      console.log("Error cargando entradas:", error);
      return;
    }

    setEntries(data || []);
  };

  const fetchConversations = async () => {
    const user = await getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", user.id)
      .order("fecha", { ascending: false });

    if (error) {
      console.log("Error cargando conversaciones:", error);
      return;
    }

    setConversations(data || []);
  };

  const fetchConversationMessages = async (conversationId) => {
    if (!conversationId) return;

    const user = await getUser();

    if (!user) {
      console.log("No hay usuario autenticado");
      return;
    }

    const { data: conversationData, error: conversationError } = await supabase
      .from("conversations")
      .select("id, user_id")
      .eq("id", conversationId)
      .eq("user_id", user.id)
      .single();

    if (conversationError || !conversationData) {
      console.log("Esta conversación no pertenece al usuario actual");
      setConversationMessages([]);
      return;
    }

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("fecha", { ascending: true });

    if (error) {
      console.log("Error cargando mensajes:", error);
      return;
    }

    setConversationMessages(data || []);
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setConversationMessages([]);
    void fetchConversationMessages(conversation.id);
  };

  const fetchGlobalHistory = async () => {
    const user = await getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("ai_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("fecha", { ascending: false })
      .limit(10);

    if (error) {
      console.log("Error cargando historial global:", error);
      return [];
    }

    return data || [];
  };

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        await fetchProfile();
        await fetchEntries();
        await fetchConversations();
      }
    };

    loadData();
  }, []);

  const handleMoodChange = async (value) => {
    const level = Number(value);

    setMoodLevel(level);
    setMoodReply(getMoodBriefReply(level));

    const user = await getUser();

    if (!user) {
      showToast("Usuario no autenticado", "error");
      return;
    }

    const { error } = await supabase.from("mood_scores").insert([
      {
        user_id: user.id,
        mood_level: level,
        descripcion: getMoodText(level),
      },
    ]);

    if (error) {
      console.log("Error guardando estado de ánimo:", error);
      showToast("No se pudo guardar tu estado de ánimo", "error");
    }
  };

  const createMoodConversation = async () => {
    const user = await getUser();

    if (!user) {
      showToast("Usuario no autenticado", "error");
      return;
    }

    try {
      setLoading(true);

      const moodText = getMoodText();

      const { data: conversationData, error: conversationError } =
        await supabase
          .from("conversations")
          .insert([
            {
              user_id: user.id,
              titulo: `Estado de ánimo: ${moodText}`,
              tipo: "mood",
            },
          ])
          .select()
          .single();

      if (conversationError) {
        console.log("Error creando conversación:", conversationError);
        showToast("Error creando conversación", "error");
        return;
      }

      const userMessage = `Hoy seleccioné este estado de ánimo: ${moodText}`;

      const { error: userMessageError } = await supabase
        .from("messages")
        .insert([
          {
            conversation_id: conversationData.id,
            remitente: "usuario",
            mensaje: userMessage,
          },
        ]);

      if (userMessageError) {
        console.log("Error guardando mensaje:", userMessageError);
        showToast("Error guardando mensaje", "error");
        return;
      }

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "Eres ARIA, una IA de diario emocional. Responde breve, natural y humano. No escribas textos largos.",
          },
          {
            role: "user",
            content: `El usuario se llama ${userName} y seleccionó este estado de ánimo: ${moodText}. Responde con una pregunta breve para iniciar conversación. Usa su nombre solo si se siente natural.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 90,
      });

      const respuesta = completion.choices[0].message.content;

      const { error: ariaError } = await supabase.from("messages").insert([
        {
          conversation_id: conversationData.id,
          remitente: "aria",
          mensaje: respuesta,
        },
      ]);

      if (ariaError) {
        console.log("Error guardando respuesta ARIA:", ariaError);
        showToast("Error guardando respuesta de ARIA", "error");
        return;
      }

      setSelectedConversation(conversationData);
      setActivePanel("entry");

      await fetchConversations();
      void fetchConversationMessages(conversationData.id);

      showToast("Conversación iniciada correctamente", "success");
    } catch (error) {
      console.log("Error creando conversación de ánimo:", error);
      showToast("Error conectando con ARIA", "error");
    } finally {
      setLoading(false);
    }
  };

  const createEntryConversation = async () => {
    if (!entryInput.trim()) {
      showToast("Escribe una entrada primero", "warning");
      return;
    }

    const user = await getUser();

    if (!user) {
      showToast("Usuario no autenticado", "error");
      return;
    }

    try {
      setLoading(true);

      const textoInicial = entryInput.trim();

      const { data: conversationData, error: conversationError } =
        await supabase
          .from("conversations")
          .insert([
            {
              user_id: user.id,
              titulo: textoInicial.substring(0, 45),
              tipo: "entry",
            },
          ])
          .select()
          .single();

      if (conversationError) {
        console.log("Error creando conversación:", conversationError);
        showToast("Error creando conversación", "error");
        return;
      }

      const { error: entryError } = await supabase.from("entries").insert([
        {
          user_id: user.id,
          titulo: textoInicial.substring(0, 45),
          contenido: textoInicial,
        },
      ]);

      if (entryError) {
        console.log("Error guardando entrada:", entryError);
        showToast("Error guardando entrada", "error");
        return;
      }

      const { error: userMessageError } = await supabase
        .from("messages")
        .insert([
          {
            conversation_id: conversationData.id,
            remitente: "usuario",
            mensaje: textoInicial,
          },
        ]);

      if (userMessageError) {
        console.log("Error guardando mensaje inicial:", userMessageError);
        showToast("Error guardando mensaje inicial", "error");
        return;
      }

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "Eres ARIA, una IA de diario personal. Responde breve, natural y sigue el tema iniciado por el usuario. No hagas sermones ni textos largos.",
          },
          {
            role: "user",
            content: `
Nombre del usuario: ${userName}
Estado de ánimo actual: ${getMoodText()}

Nueva entrada del usuario:
${textoInicial}

Responde como inicio de conversación. Máximo 3 líneas. Usa su nombre solo si se siente natural.
`,
          },
        ],
        temperature: 0.7,
        max_tokens: 150,
      });

      const respuesta = completion.choices[0].message.content;

      const { error: ariaMessageError } = await supabase
        .from("messages")
        .insert([
          {
            conversation_id: conversationData.id,
            remitente: "aria",
            mensaje: respuesta,
          },
        ]);

      if (ariaMessageError) {
        console.log("Error guardando respuesta de ARIA:", ariaMessageError);
        showToast("Error guardando respuesta de ARIA", "error");
        return;
      }

      setSelectedConversation(conversationData);
      setEntryInput("");
      setConversationInput("");

      await fetchEntries();
      await fetchConversations();
      void fetchConversationMessages(conversationData.id);

      showToast("Entrada creada correctamente", "success");
    } catch (error) {
      console.log("Error creando entrada con ARIA:", error);
      showToast("Error creando conversación con ARIA", "error");
    } finally {
      setLoading(false);
    }
  };

  const continueSelectedConversation = async () => {
    if (!selectedConversation) {
      showToast("Selecciona una conversación primero", "warning");
      return;
    }

    if (!conversationInput.trim()) {
      showToast("Escribe algo para continuar", "warning");
      return;
    }

    try {
      setLoading(true);

      const nuevoMensaje = conversationInput.trim();

      const { data: currentMessages, error: messagesError } = await supabase
        .from("messages")
        .select("remitente, mensaje, fecha")
        .eq("conversation_id", selectedConversation.id)
        .order("fecha", { ascending: true });

      if (messagesError) {
        console.log("Error cargando historial:", messagesError);
        showToast("Error cargando historial", "error");
        return;
      }

      const groqMessages = [
        {
          role: "system",
          content: `Eres ARIA, una IA de diario personal. El usuario se llama ${userName}. Continúa esta conversación usando el historial. No cambies de tema sin razón. Responde breve, natural y con empatía. Usa su nombre solo cuando se sienta humano y natural.`,
        },
      ];

      if (currentMessages && currentMessages.length > 0) {
        currentMessages.forEach((msg) => {
          groqMessages.push({
            role: msg.remitente === "usuario" ? "user" : "assistant",
            content: msg.mensaje,
          });
        });
      }

      groqMessages.push({
        role: "user",
        content: nuevoMensaje,
      });

      const { error: userMessageError } = await supabase
        .from("messages")
        .insert([
          {
            conversation_id: selectedConversation.id,
            remitente: "usuario",
            mensaje: nuevoMensaje,
          },
        ]);

      if (userMessageError) {
        console.log("Error guardando mensaje usuario:", userMessageError);
        showToast("Error guardando tu mensaje", "error");
        return;
      }

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 220,
      });

      const respuesta = completion.choices[0].message.content;

      const { error: ariaMessageError } = await supabase
        .from("messages")
        .insert([
          {
            conversation_id: selectedConversation.id,
            remitente: "aria",
            mensaje: respuesta,
          },
        ]);

      if (ariaMessageError) {
        console.log("Error guardando respuesta ARIA:", ariaMessageError);
        showToast("Error guardando respuesta de ARIA", "error");
        return;
      }

      setConversationInput("");
      void fetchConversationMessages(selectedConversation.id);
    } catch (error) {
      console.log("Error continuando conversación:", error);
      showToast("Error conectando con ARIA", "error");
    } finally {
      setLoading(false);
    }
  };

  const detectRangeDays = (question) => {
    const q = question.toLowerCase();

    if (q.includes("15 días") || q.includes("15 dias") || q.includes("quince")) {
      return 15;
    }

    if (
      q.includes("30 días") ||
      q.includes("30 dias") ||
      q.includes("último mes") ||
      q.includes("ultimo mes") ||
      q.includes("este mes") ||
      q.includes("mes")
    ) {
      return 30;
    }

    if (
      q.includes("todo") ||
      q.includes("historial completo") ||
      q.includes("desde el inicio") ||
      q.includes("hace tiempo") ||
      q.includes("antiguas") ||
      q.includes("anteriores")
    ) {
      return 120;
    }

    return 7;
  };

  const getGlobalMode = (question) => {
    const q = question.toLowerCase();

    if (
      q.includes("lista") ||
      q.includes("enumera") ||
      q.includes("muestrame") ||
      q.includes("muéstrame") ||
      q.includes("cuáles") ||
      q.includes("cuales")
    ) {
      return "lista";
    }

    if (
      q.includes("qué opinas") ||
      q.includes("que opinas") ||
      q.includes("opinión") ||
      q.includes("opinion") ||
      q.includes("analiza") ||
      q.includes("patrones") ||
      q.includes("notas")
    ) {
      return "analisis";
    }

    if (
      q.includes("consejo") ||
      q.includes("recomendación") ||
      q.includes("recomendacion") ||
      q.includes("qué debería") ||
      q.includes("que deberia") ||
      q.includes("ayuda") ||
      q.includes("sugerencia")
    ) {
      return "consejo";
    }

    return "conversacional";
  };

  const handleGlobalChat = async () => {
    if (!globalInput.trim()) {
      showToast("Escribe algo para ARIA", "warning");
      return;
    }

    const user = await getUser();

    if (!user) {
      showToast("Usuario no autenticado", "error");
      return;
    }

    const userId = user.id;

    try {
      setLoading(true);

      const preguntaOriginal = globalInput.trim();
      const diasConsulta = detectRangeDays(preguntaOriginal);
      const modoRespuesta = getGlobalMode(preguntaOriginal);

      const today = new Date();
      const fromDate = new Date();
      fromDate.setDate(today.getDate() - diasConsulta);
      const since = fromDate.toISOString();

      const { data: moodsData, error: moodsError } = await supabase
        .from("mood_scores")
        .select("mood_level, descripcion, fecha")
        .eq("user_id", userId)
        .gte("fecha", since)
        .order("fecha", { ascending: false });

      if (moodsError) {
        console.log("Error cargando estados de ánimo:", moodsError);
      }

      const { data: entriesData, error: entriesError } = await supabase
        .from("entries")
        .select("titulo, contenido, fecha")
        .eq("user_id", userId)
        .gte("fecha", since)
        .order("fecha", { ascending: false });

      if (entriesError) {
        console.log("Error cargando entradas:", entriesError);
      }

      const { data: conversationsData, error: conversationsError } =
        await supabase
          .from("conversations")
          .select("id, titulo, tipo, fecha")
          .eq("user_id", userId)
          .gte("fecha", since)
          .order("fecha", { ascending: false });

      if (conversationsError) {
        console.log("Error cargando conversaciones:", conversationsError);
      }

      const conversationIds =
        conversationsData && conversationsData.length > 0
          ? conversationsData.map((conv) => conv.id)
          : [];

      let messagesData = [];

      if (conversationIds.length > 0) {
        const { data: messagesResult, error: messagesError } = await supabase
          .from("messages")
          .select("conversation_id, remitente, mensaje, fecha")
          .in("conversation_id", conversationIds)
          .order("fecha", { ascending: true });

        if (messagesError) {
          console.log(
            "Error cargando mensajes de conversaciones:",
            messagesError
          );
        } else {
          messagesData = messagesResult || [];
        }
      }

      const globalHistory = await fetchGlobalHistory();

      const moodCounter = {};
      const moodTimeline =
        moodsData && moodsData.length > 0
          ? moodsData.map((mood) => {
              const label = mood.descripcion || getMoodText(mood.mood_level);
              const cleanLabel = cleanMoodLabel(label);

              moodCounter[cleanLabel] = (moodCounter[cleanLabel] || 0) + 1;

              return {
                estado: label,
                fecha: formatDate(mood.fecha),
              };
            })
          : [];

      const moodSummaryText =
        Object.keys(moodCounter).length > 0
          ? Object.entries(moodCounter)
              .map(([estado, cantidad]) => `${estado}: ${cantidad}`)
              .join(", ")
          : "No hay estados de ánimo registrados en este rango.";

      const recentMoodText =
        moodTimeline.length > 0
          ? moodTimeline
              .slice(0, 8)
              .map(
                (mood, index) =>
                  `${index + 1}. ${mood.estado} (${mood.fecha})`
              )
              .join("\n")
          : "No hay estados recientes.";

      const entriesText =
        entriesData && entriesData.length > 0
          ? entriesData
              .slice(0, 8)
              .map((entry, index) => {
                return `${index + 1}. ${entry.titulo || "Entrada"}
Fecha: ${formatDate(entry.fecha)}
Contenido: ${entry.contenido}`;
              })
              .join("\n\n")
          : "No hay entradas registradas en este rango.";

      const conversationsResume =
        conversationsData && conversationsData.length > 0
          ? conversationsData
              .slice(0, 8)
              .map((conv, index) => {
                const convMessages = messagesData.filter(
                  (msg) => msg.conversation_id === conv.id
                );

                const userMessages = convMessages
                  .filter((msg) => msg.remitente === "usuario")
                  .map((msg) => msg.mensaje)
                  .slice(0, 4)
                  .join(" | ");

                return `${index + 1}. ${conv.titulo} (${conv.tipo})
Mensajes clave del usuario: ${
                  userMessages || "Sin mensajes relevantes del usuario."
                }`;
              })
              .join("\n\n")
          : "No hay conversaciones registradas en este rango.";

      const globalHistoryText =
        globalHistory && globalHistory.length > 0
          ? globalHistory
              .slice(-6)
              .map((msg, index) => {
                return `${index + 1}. Usuario preguntó: ${msg.user_message}
ARIA respondió: ${msg.ai_response}`;
              })
              .join("\n\n")
          : "No hay historial previo del chat global.";

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `
Eres ARIA, una IA de diario emocional inteligente.

El usuario se llama ${userName}. Puedes usar su nombre de forma natural, pero no en cada respuesta.

Tu trabajo NO es copiar ni repetir literalmente los datos del usuario.
Tu trabajo es interpretar, resumir y analizar como un diario emocional con memoria.

Reglas:
- No saludes con "hola de nuevo" salvo que el usuario salude primero.
- No repitas la misma idea dos veces.
- No enumeres todo el historial salvo que el usuario lo pida.
- No digas "recuerdo que..." en exceso.
- No suenes robótica.
- No actúes como terapeuta clínico.
- Usa la información del diario para dar una respuesta útil, natural y breve.
- Prioriza patrones, cambios, contradicciones y temas repetidos.
- Si hay emociones mezcladas, dilo de forma sencilla.
- Si el usuario pide opinión, interpreta.
- Si pide consejo, da recomendaciones pequeñas y prácticas.
- Si pide lista, responde con una lista clara.
- Si no hay suficientes datos, dilo sin inventar.

Estilo:
- Humano.
- Cálido.
- Directo.
- Sin testamentos.
- Máximo 4 párrafos cortos, excepto si el usuario pide lista.
`,
          },
          {
            role: "user",
            content: `
Nombre del usuario:
${userName}

Pregunta del usuario:
${preguntaOriginal}

Modo de respuesta esperado:
${modoRespuesta}

Rango analizado:
Últimos ${diasConsulta} días.

Resumen de estados de ánimo:
${moodSummaryText}

Estados de ánimo recientes:
${recentMoodText}

Entradas recientes:
${entriesText}

Conversaciones recientes resumidas:
${conversationsResume}

Historial breve del chat global:
${globalHistoryText}

Instrucción final:
Responde a la pregunta del usuario usando esta información como contexto.
No copies todo el historial.
Haz un análisis útil, natural y personalizado.
`,
          },
        ],
        temperature: 0.65,
        max_tokens: 560,
      });

      const respuesta = completion.choices[0].message.content;

      setGlobalResponse(respuesta);

      const { error: saveGlobalError } = await supabase
        .from("ai_messages")
        .insert([
          {
            user_id: user.id,
            user_message: preguntaOriginal,
            ai_response: respuesta,
            emotion_detected: "global",
          },
        ]);

      if (saveGlobalError) {
        console.log("Error guardando chat global:", saveGlobalError);
      }

      setGlobalInput("");
    } catch (error) {
      console.log("Error en chat global:", error);
      showToast("Error conectando con ARIA global", "error");
    } finally {
      setLoading(false);
    }
  };

  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    if (loading) return;
    setShowLogoutModal(false);
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      setShowLogoutModal(false);

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.log(error);
        showToast("Error cerrando sesión", "error");
        return;
      }

      showToast("Sesión cerrada correctamente", "success");

      setActivePanel("mood");
      setSelectedConversation(null);
      setConversationMessages([]);
      setEntries([]);
      setConversations([]);
      setGlobalResponse("");
      setEntryInput("");
      setConversationInput("");
      setGlobalInput("");
      setProfile(null);

      setTimeout(() => {
        window.location.href = "/";
      }, 700);
    } catch (error) {
      console.log(error);
      showToast("Error cerrando sesión", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <style>
        {`
          @keyframes softIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes modalIn {
            from { opacity: 0; transform: translateY(14px) scale(0.96); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }

          .aria-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 18px 36px rgba(124,58,237,0.24);
          }

          .aria-ghost:hover {
            transform: translateY(-1px);
            background: #f8fafc;
          }

          .aria-scroll::-webkit-scrollbar {
            width: 8px;
          }

          .aria-scroll::-webkit-scrollbar-thumb {
            background: #ddd6fe;
            border-radius: 999px;
          }
        `}
      </style>

      {showLogoutModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalIcon}>!</div>

            <h2 style={styles.modalTitle}>¿Cerrar sesión?</h2>

            <p style={styles.modalText}>
              Tu sesión actual se cerrará y volverás a la pantalla de inicio.
              Tus entradas y conversaciones seguirán guardadas.
            </p>

            <div style={styles.modalActions}>
              <button
                type="button"
                style={styles.modalCancelButton}
                onClick={closeLogoutModal}
                disabled={loading}
              >
                Cancelar
              </button>

              <button
                type="button"
                style={styles.modalConfirmButton}
                onClick={handleLogout}
                disabled={loading}
              >
                {loading ? "Cerrando..." : "Sí, cerrar sesión"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.appShell}>
        {!isMobile && (
          <aside style={styles.sidebar}>
            <div style={styles.logoBox}>
              <div style={styles.logoIcon}>A</div>
              <div>
                <h1 style={{ ...styles.logoTitle, fontSize: "28px" }}>ARIA</h1>
                <p style={styles.logoSub}>Diario emocional inteligente</p>
              </div>
            </div>

            <div
              style={{
                marginTop: "24px",
                display: "grid",
                gap: "10px",
              }}
            >
              {[
                { key: "home", label: "Inicio", icon: "⌂" },
                { key: "mood", label: "Estado de ánimo", icon: "◐" },
                { key: "entry", label: "Entradas", icon: "✎" },
                { key: "global", label: "ARIA global", icon: "✦" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActivePanel(item.key)}
                  className="aria-ghost"
                  style={{
                    ...styles.ghostButton,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    justifyContent: "flex-start",
                    background:
                      activePanel === item.key
                        ? "linear-gradient(135deg, #7c3aed, #ec4899)"
                        : "#ffffff",
                    color: activePanel === item.key ? "#ffffff" : "#475569",
                    border:
                      activePanel === item.key
                        ? "1px solid rgba(124,58,237,0.25)"
                        : "1px solid #e5e7eb",
                    boxShadow:
                      activePanel === item.key
                        ? "0 16px 34px rgba(124,58,237,0.22)"
                        : "0 10px 25px rgba(15,23,42,0.04)",
                  }}
                >
                  <span
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "12px",
                      display: "grid",
                      placeItems: "center",
                      background:
                        activePanel === item.key
                          ? "rgba(255,255,255,0.18)"
                          : "#f5f3ff",
                      color: activePanel === item.key ? "#ffffff" : "#7c3aed",
                    }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}
            </div>

            <div
              style={{
                marginTop: "auto",
                padding: "16px",
                borderRadius: "24px",
                background: "#f8fafc",
                border: "1px solid #e5e7eb",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px",
                  color: "#111827",
                  fontWeight: "900",
                }}
              >
                {getMoodText()}
              </p>
              <p style={{ margin: 0, color: "#64748b", lineHeight: 1.55 }}>
                {moodReply}
              </p>
            </div>
          </aside>
        )}

        <main style={styles.main}>
          <header style={styles.topbar}>
            <div style={styles.logoBox}>
              {isMobile && <div style={styles.logoIcon}>A</div>}

              <div>
                <h1 style={styles.logoTitle}>
                  Hola, {userName}
                </h1>
                <p style={styles.logoSub}>
                  {activePanel === "home"
                    ? "Bienvenido a tu espacio personal"
                    : "Tu diario emocional con IA"}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
                width: isMobile ? "100%" : "auto",
              }}
            >
              <span
                style={{
                  ...styles.label,
                  background: selectedMood?.soft || "#f8fafc",
                  color: selectedMood?.color || "#64748b",
                  border: `1px solid ${selectedMood?.color || "#e5e7eb"}33`,
                }}
              >
                {getMoodText()}
              </span>

              <span style={styles.label}>Entradas: {stats.entries}</span>
              <span style={styles.label}>Chats: {stats.conversations}</span>

              <button
                type="button"
                onClick={openLogoutModal}
                style={styles.logoutButton}
                disabled={loading}
              >
                Cerrar sesión
              </button>
            </div>
          </header>

          {loading && (
            <div
              style={{
                marginBottom: "16px",
                padding: "14px 16px",
                borderRadius: "18px",
                background: "#fff7ed",
                border: "1px solid #fed7aa",
                color: "#c2410c",
                fontWeight: "850",
                boxShadow: "0 10px 25px rgba(249,115,22,0.08)",
              }}
            >
              ARIA está pensando...
            </div>
          )}

          {activePanel === "home" && (
            <section style={styles.panel}>
              <div style={styles.hero}>
                <span
                  style={{
                    display: "inline-flex",
                    padding: "8px 12px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.16)",
                    border: "1px solid rgba(255,255,255,0.20)",
                    fontWeight: "850",
                    fontSize: "13px",
                  }}
                >
                  Tu espacio privado con IA
                </span>

                <h2 style={styles.heroTitle}>
                  ¿Quieres contarme cómo va tu día hoy?
                </h2>

                <p style={styles.heroText}>
                  Puedes registrar tu estado de ánimo, escribir una nueva entrada
                  o pedirle a ARIA que analice tu semana emocional.
                </p>

                <div
                  style={{
                    marginTop: "22px",
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    className="aria-btn"
                    type="button"
                    style={{
                      ...styles.button,
                      background: "#ffffff",
                      color: "#7c3aed",
                      boxShadow: "0 16px 35px rgba(15,23,42,0.14)",
                    }}
                    onClick={() => setActivePanel("entry")}
                  >
                    Escribir entrada
                  </button>

                  <button
                    className="aria-ghost"
                    type="button"
                    style={{
                      ...styles.ghostButton,
                      background: "rgba(255,255,255,0.12)",
                      color: "#ffffff",
                      border: "1px solid rgba(255,255,255,0.28)",
                    }}
                    onClick={() => setActivePanel("global")}
                  >
                    Hablar con ARIA
                  </button>
                </div>
              </div>

              <div style={styles.statGrid}>
                <button
                  type="button"
                  className="aria-ghost"
                  onClick={() => setActivePanel("mood")}
                  style={{
                    ...styles.compactCard,
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <span style={styles.label}>Estado actual</span>
                  <h3 style={{ margin: "14px 0 6px", fontSize: "24px" }}>
                    {getMoodText()}
                  </h3>
                  <p style={{ margin: 0, color: "#64748b", lineHeight: 1.6 }}>
                    Toca para cambiar cómo te sientes hoy.
                  </p>
                </button>

                <button
                  type="button"
                  className="aria-ghost"
                  onClick={() => setActivePanel("entry")}
                  style={{
                    ...styles.compactCard,
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <span style={styles.label}>Entradas</span>
                  <h3 style={{ margin: "14px 0 6px", fontSize: "24px" }}>
                    {entries.length}
                  </h3>
                  <p style={{ margin: 0, color: "#64748b", lineHeight: 1.6 }}>
                    {latestEntry
                      ? `Última: ${latestEntry.titulo}`
                      : "Aún no has escrito una entrada."}
                  </p>
                </button>

                <button
                  type="button"
                  className="aria-ghost"
                  onClick={() => setActivePanel("global")}
                  style={{
                    ...styles.compactCard,
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <span style={styles.label}>Chat global</span>
                  <h3 style={{ margin: "14px 0 6px", fontSize: "24px" }}>
                    {conversations.length} chats
                  </h3>
                  <p style={{ margin: 0, color: "#64748b", lineHeight: 1.6 }}>
                    {latestConversation
                      ? "ARIA puede analizar tus últimas conversaciones."
                      : "Empieza una conversación cuando quieras."}
                  </p>
                </button>
              </div>

              <section style={styles.card}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "14px",
                    flexWrap: "wrap",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <div>
                    <h2 style={{ margin: 0, color: "#111827" }}>
                      Actividad reciente
                    </h2>
                    <p style={{ margin: "6px 0 0", color: "#64748b" }}>
                      Tus últimas entradas guardadas.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="aria-ghost"
                    style={styles.ghostButton}
                    onClick={() => setActivePanel("entry")}
                  >
                    Ver entradas
                  </button>
                </div>

                {entries.length === 0 ? (
                  <p style={{ color: "#64748b", margin: 0 }}>
                    Aún no hay entradas guardadas.
                  </p>
                ) : (
                  <div style={styles.entriesGrid}>
                    {entries.slice(0, 3).map((entry) => (
                      <div key={entry.id} style={styles.compactCard}>
                        <strong style={{ color: "#111827" }}>
                          {entry.titulo}
                        </strong>
                        <p
                          style={{
                            color: "#4b5563",
                            lineHeight: "1.7",
                            marginBottom: "10px",
                          }}
                        >
                          {entry.contenido?.length > 120
                            ? `${entry.contenido.substring(0, 120)}...`
                            : entry.contenido}
                        </p>
                        <small style={{ color: "#94a3b8" }}>
                          {formatDate(entry.fecha)}
                        </small>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </section>
          )}

          {activePanel === "mood" && (
            <section style={styles.panel}>
              <div style={styles.card}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "16px",
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        color: "#111827",
                        fontSize: isMobile ? "26px" : "30px",
                        letterSpacing: "-0.8px",
                      }}
                    >
                      ¿Cómo te sientes hoy?
                    </h2>
                    <p
                      style={{
                        color: "#64748b",
                        margin: "8px 0 0",
                        lineHeight: 1.7,
                      }}
                    >
                      Selecciona tu estado de ánimo y ARIA te dará una respuesta
                      breve para iniciar una conversación.
                    </p>
                  </div>

                  <span
                    style={{
                      ...styles.label,
                      background: selectedMood?.soft || "#f8fafc",
                      color: selectedMood?.color || "#64748b",
                    }}
                  >
                    Seleccionado: {getMoodText()}
                  </span>
                </div>

                <div style={styles.moodGrid}>
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => handleMoodChange(mood.value)}
                      className="aria-ghost"
                      style={{
                        border:
                          moodLevel === mood.value
                            ? `2px solid ${mood.color}`
                            : "1px solid #e5e7eb",
                        background:
                          moodLevel === mood.value ? mood.soft : "#ffffff",
                        color: "#111827",
                        borderRadius: "24px",
                        padding: isMobile ? "16px 12px" : "20px",
                        cursor: "pointer",
                        boxShadow:
                          moodLevel === mood.value
                            ? `0 16px 30px ${mood.color}24`
                            : "0 10px 20px rgba(15,23,42,0.04)",
                        transform:
                          moodLevel === mood.value
                            ? "translateY(-2px)"
                            : "none",
                      }}
                    >
                      <div style={{ fontSize: isMobile ? "32px" : "38px" }}>
                        {mood.emoji}
                      </div>
                      <strong>{mood.label}</strong>
                    </button>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: "20px",
                    padding: "18px",
                    background: "#f8fafc",
                    border: "1px solid #e5e7eb",
                    borderRadius: "22px",
                  }}
                >
                  <strong style={{ color: "#7c3aed" }}>ARIA:</strong>
                  <p
                    style={{
                      margin: "6px 0 0",
                      color: "#374151",
                      lineHeight: 1.7,
                    }}
                  >
                    {moodReply}
                  </p>
                </div>

                <button
                  className="aria-btn"
                  style={{ ...styles.button, marginTop: "16px" }}
                  onClick={createMoodConversation}
                  disabled={loading}
                >
                  Iniciar conversación desde este ánimo
                </button>
              </div>
            </section>
          )}

          {activePanel === "entry" && (
            <section style={{ ...styles.panel, ...styles.grid2 }}>
              <div style={styles.card}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        color: "#111827",
                        fontSize: isMobile ? "26px" : "30px",
                        letterSpacing: "-0.8px",
                      }}
                    >
                      Nueva entrada
                    </h2>
                    <p style={{ color: "#64748b", lineHeight: 1.7 }}>
                      Cada entrada crea una conversación independiente con ARIA.
                    </p>
                  </div>
                </div>

                <textarea
                  style={styles.textarea}
                  placeholder="Escribe una nueva entrada..."
                  value={entryInput}
                  onChange={(e) => setEntryInput(e.target.value)}
                />

                <button
                  className="aria-btn"
                  style={{ ...styles.orangeButton, marginTop: "12px" }}
                  onClick={createEntryConversation}
                  disabled={loading}
                >
                  Crear nueva entrada con ARIA
                </button>

                <div
                  style={{
                    height: "1px",
                    background: "#e5e7eb",
                    margin: "26px 0",
                  }}
                />

                <h2
                  style={{
                    color: "#111827",
                    fontSize: "24px",
                    margin: "0 0 14px",
                  }}
                >
                  Conversación actual
                </h2>

                {selectedConversation ? (
                  <div style={styles.compactCard}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "12px",
                        flexWrap: "wrap",
                        alignItems: "center",
                        marginBottom: "14px",
                      }}
                    >
                      <p
                        style={{
                          color: "#7c3aed",
                          fontWeight: "900",
                          margin: 0,
                        }}
                      >
                        {selectedConversation.titulo}
                      </p>

                      <span style={styles.label}>
                        {selectedConversation.tipo || "chat"}
                      </span>
                    </div>

                    <div
                      className="aria-scroll"
                      style={{
                        maxHeight: isMobile ? "360px" : "430px",
                        overflowY: "auto",
                        paddingRight: "6px",
                      }}
                    >
                      {conversationMessages.length === 0 && (
                        <p style={{ color: "#64748b" }}>
                          No hay mensajes en esta conversación.
                        </p>
                      )}

                      {conversationMessages.map((msg) => (
                        <div
                          key={msg.id}
                          style={{
                            display: "flex",
                            justifyContent:
                              msg.remitente === "usuario"
                                ? "flex-end"
                                : "flex-start",
                            marginBottom: "12px",
                          }}
                        >
                          <div
                            style={{
                              maxWidth: isMobile ? "92%" : "78%",
                              padding: "14px 16px",
                              borderRadius:
                                msg.remitente === "usuario"
                                  ? "20px 20px 6px 20px"
                                  : "20px 20px 20px 6px",
                              background:
                                msg.remitente === "usuario"
                                  ? "linear-gradient(135deg, #7c3aed, #ec4899)"
                                  : "#f3f4f6",
                              color:
                                msg.remitente === "usuario"
                                  ? "#ffffff"
                                  : "#1f2937",
                              boxShadow: "0 10px 22px rgba(15,23,42,0.06)",
                            }}
                          >
                            <strong>
                              {msg.remitente === "usuario" ? "Tú" : "ARIA"}
                            </strong>
                            <p
                              style={{
                                margin: "6px 0 0",
                                lineHeight: "1.6",
                              }}
                            >
                              {msg.mensaje}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <textarea
                      style={{
                        ...styles.textarea,
                        minHeight: "88px",
                        marginTop: "16px",
                      }}
                      placeholder="Continúa esta conversación..."
                      value={conversationInput}
                      onChange={(e) => setConversationInput(e.target.value)}
                    />

                    <button
                      className="aria-btn"
                      style={{ ...styles.button, marginTop: "12px" }}
                      onClick={continueSelectedConversation}
                      disabled={loading}
                    >
                      Responder
                    </button>
                  </div>
                ) : (
                  <p style={{ color: "#64748b", marginBottom: 0 }}>
                    Crea una nueva entrada o selecciona una conversación anterior.
                  </p>
                )}
              </div>

              <aside style={styles.card}>
                <h2 style={{ marginTop: 0, color: "#111827" }}>Mis chats</h2>

                <input
                  style={styles.input}
                  placeholder="Buscar chat..."
                  value={conversationSearch}
                  onChange={(e) => setConversationSearch(e.target.value)}
                />

                <div
                  className="aria-scroll"
                  style={{
                    marginTop: "16px",
                    maxHeight: isMobile ? "360px" : "720px",
                    overflowY: "auto",
                    paddingRight: "4px",
                  }}
                >
                  {filteredConversations.length === 0 && (
                    <p style={{ color: "#64748b" }}>
                      No hay conversaciones para mostrar.
                    </p>
                  )}

                  {filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => handleSelectConversation(conv)}
                      className="aria-ghost"
                      style={{
                        width: "100%",
                        textAlign: "left",
                        border:
                          selectedConversation?.id === conv.id
                            ? "1px solid #7c3aed"
                            : "1px solid #e5e7eb",
                        background:
                          selectedConversation?.id === conv.id
                            ? "#f5f3ff"
                            : "#ffffff",
                        color: "#111827",
                        borderRadius: "18px",
                        padding: "15px",
                        marginBottom: "10px",
                        cursor: "pointer",
                        boxShadow:
                          selectedConversation?.id === conv.id
                            ? "0 12px 24px rgba(124,58,237,0.12)"
                            : "0 8px 18px rgba(15,23,42,0.04)",
                      }}
                    >
                      <strong>{conv.titulo}</strong>
                      <br />
                      <small style={{ color: "#64748b" }}>
                        {conv.tipo} · {formatDate(conv.fecha)}
                      </small>
                    </button>
                  ))}
                </div>
              </aside>
            </section>
          )}

          {activePanel === "global" && (
            <section style={{ ...styles.panel, ...styles.card }}>
              <div style={styles.gridGlobal}>
                <div>
                  <h2
                    style={{
                      marginTop: 0,
                      color: "#111827",
                      fontSize: isMobile ? "26px" : "30px",
                      letterSpacing: "-0.8px",
                    }}
                  >
                    Hablar con ARIA
                  </h2>

                  <p style={{ color: "#64748b", lineHeight: 1.7 }}>
                    Este chat analiza tus emociones, entradas y conversaciones
                    para darte opiniones y recomendaciones más personales.
                  </p>

                  <textarea
                    style={styles.textarea}
                    placeholder="Ejemplo: ¿Qué opinas de mis emociones esta semana?"
                    value={globalInput}
                    onChange={(e) => setGlobalInput(e.target.value)}
                  />

                  <button
                    className="aria-btn"
                    style={{ ...styles.button, marginTop: "12px" }}
                    onClick={handleGlobalChat}
                    disabled={loading}
                  >
                    Hablar con ARIA global
                  </button>

                  {globalResponse && (
                    <div
                      style={{
                        marginTop: "20px",
                        padding: isMobile ? "18px" : "22px",
                        borderRadius: "24px",
                        background: "#f8fafc",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 12px 28px rgba(15,23,42,0.05)",
                      }}
                    >
                      <strong style={{ color: "#7c3aed" }}>
                        ARIA global:
                      </strong>
                      <p
                        style={{
                          whiteSpace: "pre-wrap",
                          color: "#374151",
                          lineHeight: "1.8",
                        }}
                      >
                        {globalResponse}
                      </p>
                    </div>
                  )}
                </div>

                <aside style={styles.compactCard}>
                  <h3 style={{ marginTop: 0, color: "#111827" }}>
                    Preguntas rápidas
                  </h3>
                  <p style={{ color: "#64748b", fontSize: "14px" }}>
                    Ideas para analizar tu diario sin pensar demasiado.
                  </p>

                  {quickGlobalPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      className="aria-ghost"
                      onClick={() => setGlobalInput(prompt)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        border: "1px solid #e5e7eb",
                        background: "#ffffff",
                        color: "#374151",
                        borderRadius: "16px",
                        padding: "13px",
                        marginBottom: "10px",
                        cursor: "pointer",
                        fontWeight: "750",
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </aside>
              </div>
            </section>
          )}
        </main>
      </div>

      <nav style={styles.bottomNav}>
        {[
          { key: "home", label: "Inicio", icon: "⌂" },
          { key: "mood", label: "Ánimo", icon: "◐" },
          { key: "entry", label: "Entradas", icon: "✎" },
          { key: "global", label: "ARIA", icon: "✦" },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setActivePanel(item.key)}
            style={{
              border: "none",
              borderRadius: "18px",
              padding: "10px 6px",
              background:
                activePanel === item.key
                  ? "linear-gradient(135deg, #7c3aed, #ec4899)"
                  : "transparent",
              color: activePanel === item.key ? "#ffffff" : "#64748b",
              fontWeight: "850",
              cursor: "pointer",
              display: "grid",
              gap: "2px",
              placeItems: "center",
              fontSize: "12px",
            }}
          >
            <span style={{ fontSize: "18px", lineHeight: 1 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Dashboard;
