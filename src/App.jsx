import { useState, useEffect } from "react";

function Numpad({ onKey, variant = "phone", arrowReady = false }) {
  const s = {
    padding: "15px 0", fontSize: 22,
    background: "#f2f2f2", border: "none",
    borderRadius: 10, cursor: "pointer", userSelect: "none",
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, maxWidth: 300, margin: "0 auto" }}>
      {"123456789".split("").map(k =>
        <button key={k} style={s} onClick={() => onKey(k)}>{k}</button>
      )}
      {variant === "phone" ? (
        <>
          <div />
          <button style={s} onClick={() => onKey("0")}>0</button>
          <button style={{ ...s, background: "transparent", fontSize: 18 }} onClick={() => onKey("⌫")}>⌫</button>
        </>
      ) : (
        <>
          <button style={{ ...s, background: "transparent", fontSize: 18 }} onClick={() => onKey("⌫")}>⌫</button>
          <button style={s} onClick={() => onKey("0")}>0</button>
          <button
            onClick={() => arrowReady && onKey("→")}
            style={{
              width: 52, height: 52, margin: "auto", borderRadius: "50%",
              background: arrowReady ? "#007AFF" : "#ccc",
              border: "none", color: "white", fontSize: 22,
              cursor: arrowReady ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              userSelect: "none",
            }}
          >→</button>
        </>
      )}
    </div>
  );
}

function Modal({ children }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 999,
    }}>
      <div style={{
        background: "white", borderRadius: 14,
        padding: "28px 32px", minWidth: 240,
        boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
      }}>
        {children}
      </div>
    </div>
  );
}

function SplashPage({ onReady }) {
  return (
    <div onClick={onReady} style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      height: "100vh", cursor: "pointer",
    }}>
      <style>{`
        @keyframes pepsiIn {
          0%   { transform: rotate(-180deg) scale(.15); opacity: 0 }
          65%  { transform: rotate(12deg)   scale(1.06); opacity: 1 }
          100% { transform: rotate(0deg)    scale(1);    opacity: 1 }
        }
        @keyframes wordIn {
          from { opacity: 0; letter-spacing: 14px }
          to   { opacity: 1; letter-spacing: 6px  }
        }
      `}</style>
      <svg width="140" height="140" viewBox="0 0 140 140"
        style={{ animation: "pepsiIn 1.8s cubic-bezier(.34,1.26,.64,1) forwards" }}>
        <circle cx="70" cy="70" r="68" fill="white" stroke="#e8e8e8" strokeWidth="2" />
        <path d="M70 2 A68 68 0 0 1 138 70 L70 70 Z" fill="#004B93" />
        <path d="M70 138 A68 68 0 0 1 2 70 L70 70 Z" fill="#E4002B" />
        <path d="M2 70 Q35 53 70 70 Q105 87 138 70" stroke="white" strokeWidth="14" fill="none" />
        <circle cx="70" cy="70" r="68" fill="none" stroke="#e8e8e8" strokeWidth="2" />
      </svg>
      <p style={{ marginTop: 24, fontSize: 26, fontWeight: 900, color: "#004B93", animation: "wordIn .7s 1.5s both" }}>
        PEPSI
      </p>
      <p style={{ marginTop: 12, color: "#bbb", fontSize: 12, animation: "wordIn .5s 2.2s both" }}>
        tap to continue
      </p>
    </div>
  );
}

function PhonePage({ onConfirm }) {
  const [phone, setPhone]   = useState("");
  const [active, setActive] = useState(false);
  const [modal, setModal]   = useState(false);
  const showConfirm = phone.length >= 4;

  const handleKey = (k) => {
    if (k === "⌫") setPhone(p => p.slice(0, -1));
    else if (phone.length < 15) setPhone(p => p + k);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", padding: "48px 24px 24px" }}>
      <h2 style={{ textAlign: "center", fontWeight: 600, marginBottom: 6 }}>Phone Number</h2>
      <p style={{ textAlign: "center", color: "#999", fontSize: 13, marginBottom: 32 }}>
        Tap the field to open keyboard
      </p>

      <div onClick={() => setActive(true)} style={{
        fontSize: 26, letterSpacing: 3, textAlign: "center",
        borderBottom: `2px solid ${active ? "#007AFF" : "#ccc"}`,
        paddingBottom: 8, maxWidth: 300, margin: "0 auto 12px",
        minHeight: 44, cursor: "text",
      }}>
        {phone || <span style={{ color: "#ccc", fontSize: 17 }}>+___ ___ ____</span>}
      </div>

      <div style={{ minHeight: 28, textAlign: "center", marginBottom: 12 }}>
        {showConfirm && (
          <span onClick={() => setModal(true)} style={{
            color: "#007AFF", fontSize: 14, cursor: "pointer",
            textDecoration: "underline", userSelect: "none",
          }}>Confirm</span>
        )}
      </div>

      {active && (
        <div style={{ marginTop: "auto" }}>
          <Numpad onKey={handleKey} variant="phone" />
        </div>
      )}

      {modal && (
        <Modal>
          <p style={{ textAlign: "center", color: "#888", fontSize: 13, marginBottom: 6 }}>Confirm number?</p>
          <p style={{ textAlign: "center", fontWeight: 700, fontSize: 22, marginBottom: 24 }}>{phone}</p>
          <div style={{ textAlign: "center" }}>
            <span onClick={() => { setModal(false); onConfirm(phone); }} style={{
              color: "#007AFF", fontSize: 16, cursor: "pointer",
              textDecoration: "underline", userSelect: "none",
            }}>Confirm</span>
          </div>
        </Modal>
      )}
    </div>
  );
}

function OtpPage({ phone, onConfirm }) {
  const [otp, setOtp] = useState("");
  const LEN = 6;

  const handleKey = (k) => {
    if      (k === "⌫")                      setOtp(p => p.slice(0, -1));
    else if (k === "→" && otp.length === LEN) onConfirm();
    else if (otp.length < LEN)               setOtp(p => p + k);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", padding: "48px 24px 24px" }}>
      <h2 style={{ textAlign: "center", fontWeight: 600, marginBottom: 6 }}>Enter OTP</h2>
      <p style={{ textAlign: "center", color: "#999", fontSize: 13, marginBottom: 32 }}>Code sent to {phone}</p>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 40 }}>
        {Array.from({ length: LEN }).map((_, i) => (
          <div key={i} style={{
            width: 42, height: 52, borderRadius: 8,
            border: `2px solid ${i <= otp.length ? "#007AFF" : "#ddd"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, fontWeight: 700,
            background: i < otp.length ? "#eef4ff" : "white",
            transition: "border-color 0.15s",
          }}>{otp[i] || ""}</div>
        ))}
      </div>

      <div style={{ marginTop: "auto" }}>
        <Numpad onKey={handleKey} variant="otp" arrowReady={otp.length === LEN} />
      </div>
    </div>
  );
}

function HomePage() {
  const [modal, setModal] = useState({ show: true, type: "default" });

  const modals = {
    default: (
      <>
        <p style={{ textAlign: "center", marginBottom: 20, fontSize: 15 }}>Welcome! Confirm to continue.</p>
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => setModal(m => ({ ...m, show: false }))}
            style={{
              background: "#007AFF", color: "white", border: "none",
              padding: "10px 28px", borderRadius: 8, fontSize: 15, cursor: "pointer",
            }}
          >Confirm</button>
        </div>
      </>
    ),
    // promo: <PromoModal />,
    // notice: <NoticeModal />,
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 48 }}>🏠</div>
      <h2 style={{ fontWeight: 400, color: "#bbb", marginTop: 8 }}>Home</h2>
      {modal.show && <Modal>{modals[modal.type]}</Modal>}
    </div>
  );
}

export default function App() {
  const [page, setPage]   = useState("splash");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (page !== "splash") return;
    const t = setTimeout(() => setPage("phone"), 3000);
    return () => clearTimeout(t);
  }, [page]);

  return (
    <div style={{
      maxWidth: 430, margin: "0 auto", minHeight: "100vh",
      background: "white",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {page === "splash" && <SplashPage onReady={() => setPage("phone")} />}
      {page === "phone"  && <PhonePage  onConfirm={p => { setPhone(p); setPage("otp"); }} />}
      {page === "otp"    && <OtpPage    phone={phone} onConfirm={() => setPage("home")} />}
      {page === "home"   && <HomePage />}
    </div>
  );
}
