import { useState } from "react";
import { ToastContext } from "./ToastContext";

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info") => {
    const id = Date.now() + Math.random();

    const newToast = {
      id,
      message,
      type,
    };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const getToastStyle = (type) => {
    const base = {
      minWidth: "280px",
      maxWidth: "390px",
      padding: "16px 18px",
      borderRadius: "18px",
      color: "#111827",
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      boxShadow: "0 18px 45px rgba(15, 23, 42, 0.14)",
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      animation: "toastIn 0.28s ease",
      backdropFilter: "blur(14px)",
    };

    if (type === "success") {
      return {
        ...base,
        background: "#ecfdf5",
        border: "1px solid #bbf7d0",
      };
    }

    if (type === "error") {
      return {
        ...base,
        background: "#fff1f2",
        border: "1px solid #fecaca",
      };
    }

    if (type === "warning") {
      return {
        ...base,
        background: "#fff7ed",
        border: "1px solid #fed7aa",
      };
    }

    return {
      ...base,
      background: "#f5f3ff",
      border: "1px solid #ddd6fe",
    };
  };

  const getIcon = (type) => {
    if (type === "success") return "✓";
    if (type === "error") return "!";
    if (type === "warning") return "!";
    return "i";
  };

  const getIconStyle = (type) => {
    const base = {
      width: "28px",
      height: "28px",
      borderRadius: "999px",
      display: "grid",
      placeItems: "center",
      fontWeight: "900",
      color: "#ffffff",
      flexShrink: 0,
      marginTop: "1px",
    };

    if (type === "success") {
      return {
        ...base,
        background: "#10b981",
      };
    }

    if (type === "error") {
      return {
        ...base,
        background: "#ef4444",
      };
    }

    if (type === "warning") {
      return {
        ...base,
        background: "#f97316",
      };
    }

    return {
      ...base,
      background: "#8b5cf6",
    };
  };

  const getTitle = (type) => {
    if (type === "success") return "Correcto";
    if (type === "error") return "Ups, algo salió mal";
    if (type === "warning") return "Atención";
    return "ARIA";
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <style>
        {`
          @keyframes toastIn {
            from {
              opacity: 0;
              transform: translateX(30px) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }
        `}
      </style>

      <div
        style={{
          position: "fixed",
          top: "22px",
          right: "22px",
          zIndex: 99999,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {toasts.map((toast) => (
          <div key={toast.id} style={getToastStyle(toast.type)}>
            <div style={getIconStyle(toast.type)}>{getIcon(toast.type)}</div>

            <div style={{ flex: 1 }}>
              <strong
                style={{
                  display: "block",
                  fontSize: "14px",
                  marginBottom: "3px",
                  color: "#111827",
                }}
              >
                {getTitle(toast.type)}
              </strong>

              <p
                style={{
                  margin: 0,
                  color: "#4b5563",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              style={{
                border: "none",
                background: "transparent",
                color: "#6b7280",
                cursor: "pointer",
                fontSize: "18px",
                lineHeight: "18px",
                padding: "0",
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;