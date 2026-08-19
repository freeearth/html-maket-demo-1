import { useState, useEffect, useRef } from "react";

/* ─── Modal ───────────────────────────────────────────────────── */
function Modal({ children }) {
  return (
    <div style={{
      position:"fixed", inset:0,
      background:"rgba(0,0,0,0.4)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex:999,
    }}>
      <div style={{
        background:"white", borderRadius:14,
        padding:"28px 32px", minWidth:240,
        boxShadow:"0 4px 24px rgba(0,0,0,0.15)",
      }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Page 1: Splash ──────────────────────────────────────────── */
function SplashPage({ onReady }) {
  return (
    <div onClick={onReady} style={{
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      height:"100vh", cursor:"pointer",
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
        style={{ animation:"pepsiIn 1.8s cubic-bezier(.34,1.26,.64,1) forwards" }}>
        <circle cx="70" cy="70" r="68" fill="white" stroke="#e8e8e8" strokeWidth="2" />
        <path d="M70 2 A68 68 0 0 1 138 70 L70 70 Z" fill="#004B93" />
        <path d="M70 138 A68 68 0 0 1 2 70 L70 70 Z" fill="#E4002B" />
        <path d="M2 70 Q35 53 70 70 Q105 87 138 70" stroke="white" strokeWidth="14" fill="none" />
        <circle cx="70" cy="70" r="68" fill="none" stroke="#e8e8e8" strokeWidth="2" />
      </svg>
      <p style={{ marginTop:24, fontSize:26, fontWeight:900, color:"#004B93", animation:"wordIn .7s 1.5s both" }}>
        PEPSI
      </p>
      <p style={{ marginTop:12, color:"#bbb", fontSize:12, animation:"wordIn .5s 2.2s both" }}>
        tap to continue
      </p>
    </div>
  );
}

/* ─── Page 2: Phone Input ─────────────────────────────────────── */
function PhonePage({ onConfirm }) {
  const [phone, setPhone] = useState("");
  const [modal, setModal] = useState(false);
  const showConfirm = phone.length >= 4;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", padding:"48px 24px 24px" }}>
      <h2 style={{ textAlign:"center", fontWeight:600, marginBottom:6 }}>Phone Number</h2>
      <p style={{ textAlign:"center", color:"#999", fontSize:13, marginBottom:32 }}>
        Enter your phone number
      </p>

      {/* Native tel input — triggers numeric keyboard on mobile */}
      <input
        type="tel"
        inputMode="numeric"
        value={phone}
        onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 15))}
        placeholder="+___ ___ ____"
        autoFocus
        style={{
          fontSize:24, letterSpacing:3, textAlign:"center",
          border:"none", borderBottom:"2px solid #007AFF",
          outline:"none", padding:"8px 0",
          width:"100%", maxWidth:300,
          margin:"0 auto 12px", display:"block",
          background:"transparent",
        }}
      />

      <div style={{ minHeight:28, textAlign:"center", marginBottom:12 }}>
        {showConfirm && (
          <span onClick={() => setModal(true)} style={{
            color:"#007AFF", fontSize:14, cursor:"pointer",
            textDecoration:"underline", userSelect:"none",
          }}>Confirm</span>
        )}
      </div>

      {modal && (
        <Modal>
          <p style={{ textAlign:"center", color:"#888", fontSize:13, marginBottom:6 }}>Confirm number?</p>
          <p style={{ textAlign:"center", fontWeight:700, fontSize:22, marginBottom:24 }}>{phone}</p>
          <div style={{ textAlign:"center" }}>
            <span onClick={() => { setModal(false); onConfirm(phone); }} style={{
              color:"#007AFF", fontSize:16, cursor:"pointer",
              textDecoration:"underline", userSelect:"none",
            }}>Confirm</span>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── Page 3: OTP ─────────────────────────────────────────────── */
function OtpPage({ phone, onConfirm }) {
  const [otp, setOtp] = useState("");
  const inputRef = useRef(null);
  const LEN = 6;

  // Auto-focus hidden input when page mounts → opens native keyboard
  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div
      style={{ display:"flex", flexDirection:"column", height:"100vh", padding:"48px 24px 24px" }}
      onClick={() => inputRef.current?.focus()}   // tap anywhere to re-focus
    >
      <h2 style={{ textAlign:"center", fontWeight:600, marginBottom:6 }}>Enter OTP</h2>
      <p style={{ textAlign:"center", color:"#999", fontSize:13, marginBottom:32 }}>
        Code sent to {phone}
      </p>

      {/* Visual 6-box display */}
      <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:32 }}>
        {Array.from({ length:LEN }).map((_,i) => (
          <div key={i} style={{
            width:42, height:52, borderRadius:8,
            border:`2px solid ${i <= otp.length ? "#007AFF" : "#ddd"}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:24, fontWeight:700,
            background: i < otp.length ? "#eef4ff" : "white",
          }}>{otp[i] || ""}</div>
        ))}
      </div>

      {/* Hidden input — captures native keyboard, feeds the visual boxes above */}
      <input
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        maxLength={LEN}
        value={otp}
        onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, LEN))}
        style={{
          opacity:0, height:0, padding:0, margin:0,
          border:"none", position:"absolute", pointerEvents:"none",
        }}
      />

      {/* Circle arrow — activates when all 6 digits are entered */}
      <div style={{ marginTop:"auto", display:"flex", justifyContent:"flex-end", maxWidth:300, margin:"auto auto 0" }}>
        <button
          onClick={() => otp.length === LEN && onConfirm()}
          style={{
            width:52, height:52, borderRadius:"50%",
            background: otp.length === LEN ? "#007AFF" : "#ccc",
            border:"none", color:"white", fontSize:22,
            cursor: otp.length === LEN ? "pointer" : "default",
            display:"flex", alignItems:"center", justifyContent:"center",
            transition:"background 0.2s",
          }}
        >→</button>
      </div>
    </div>
  );
}

/* ─── Page 4: Home ────────────────────────────────────────────── */
function HomePage() {
  // modal.type is the integration point with the admin panel:
  // admin sends a type string → frontend renders the matching component
  const [modal, setModal] = useState({ show:true, type:"default" });

  const modals = {
    default: (
      <>
        <p style={{ textAlign:"center", marginBottom:20, fontSize:15 }}>Welcome! Confirm to continue.</p>
        <div style={{ textAlign:"center" }}>
          <button
            onClick={() => setModal(m => ({ ...m, show:false }))}
            style={{
              background:"#007AFF", color:"white", border:"none",
              padding:"10px 28px", borderRadius:8, fontSize:15, cursor:"pointer",
            }}
          >Confirm</button>
        </div>
      </>
    ),
    // Add new modal types here as admin panel grows:
    // promo: <PromoModal />,
    // notice: <NoticeModal />,
    // survey: <SurveyModal />,
  };

  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
      <div style={{ fontSize:48 }}>🏠</div>
      <h2 style={{ fontWeight:400, color:"#bbb", marginTop:8 }}>Home</h2>
      {modal.show && <Modal>{modals[modal.type]}</Modal>}
    </div>
  );
}

/* ─── App root ────────────────────────────────────────────────── */
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
      maxWidth:430, margin:"0 auto", minHeight:"100vh",
      background:"white",
      fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {page === "splash" && <SplashPage onReady={() => setPage("phone")} />}
      {page === "phone"  && <PhonePage  onConfirm={p => { setPhone(p); setPage("otp"); }} />}
      {page === "otp"    && <OtpPage    phone={phone} onConfirm={() => setPage("home")} />}
      {page === "home"   && <HomePage />}
    </div>
  );
}
