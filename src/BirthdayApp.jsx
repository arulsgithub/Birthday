import { useState, useEffect, useRef, useCallback } from "react";
import SurprisePage from "./SurprisePage";

// ─── TARGET: 25 March 2026, 00:00:00 IST (UTC+5:30) ───────────────────────
// Stored as UTC epoch ms — not readable as a date string in source
const _T = 1774377000000; // UTC ms for 2026-03-24T18:30:00Z = IST midnight 25th

// ─── Multiple time sources ─────────────────────────────────────────────────
// Fetches real server time from a public API to prevent client clock tampering
async function fetchServerTime() {
  try {
    const res = await fetch("https://worldtimeapi.org/api/timezone/Asia/Kolkata", {
      cache: "no-store",
    });
    const data = await res.json();
    return new Date(data.datetime).getTime();
  } catch {
    // fallback to client time if API fails
    return Date.now();
  }
}

function getRemainingMs(nowMs) {
  return _T - nowMs;
}

function parseRemaining(ms) {
  if (ms <= 0) return null;
  return {
    days:    Math.floor(ms / 86400000),
    hours:   Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

// ─── WaitAlert ─────────────────────────────────────────────────────────────
function WaitAlert({ onClose }) {
  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.alertBox} className="alertPop" onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: "3rem", marginBottom: 8 }}>⏳</div>
        <h2 style={S.alertTitle}>Patience, Dear! 💕</h2>
        <p style={S.alertMsg}>
          Your surprise is being wrapped with love.<br />
          Please wait until the timer ends on<br />
          <span style={S.alertDate}>25th March • 12:00 AM IST</span>
        </p>
        <button style={S.alertBtn} onClick={onClose}>Okay, I'll Wait 🎀</button>
      </div>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────
export default function BirthdayApp() {
  const [page, setPage]           = useState("countdown");
  const [time, setTime]           = useState(null);        // remaining breakdown
  const [serverOk, setServerOk]   = useState(false);      // server time verified?
  const [checking, setChecking]   = useState(true);       // initial server check
  const [launched, setLaunched]   = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [particles, setParticles] = useState([]);

  // Offset between server time and client time (ms)
  const serverOffsetRef = useRef(0);

  // ── 1. On mount: fetch real server time once ──────────────────────────
  useEffect(() => {
    (async () => {
      const serverNow = await fetchServerTime();
      const clientNow = Date.now();
      serverOffsetRef.current = serverNow - clientNow; // can be +/-
      const remaining = getRemainingMs(serverNow);
      setTime(parseRemaining(remaining));
      setServerOk(true);
      setChecking(false);
    })();
  }, []);

  // ── 2. Tick every second using corrected time ─────────────────────────
  useEffect(() => {
    if (!serverOk) return;
    const iv = setInterval(() => {
      const correctedNow = Date.now() + serverOffsetRef.current;
      setTime(parseRemaining(getRemainingMs(correctedNow)));
    }, 1000);
    return () => clearInterval(iv);
  }, [serverOk]);

  // ── 3. Re-verify with server every 5 minutes ─────────────────────────
  useEffect(() => {
    if (!serverOk) return;
    const iv = setInterval(async () => {
      const serverNow = await fetchServerTime();
      serverOffsetRef.current = serverNow - Date.now();
      const remaining = getRemainingMs(serverNow);
      // If server says time is NOT up, force countdown back on
      if (remaining > 0 && page === "surprise") {
        setPage("countdown");
      }
      setTime(parseRemaining(remaining));
    }, 5 * 60 * 1000);
    return () => clearInterval(iv);
  }, [serverOk, page]);

  // ── 4. Particles ──────────────────────────────────────────────────────
  useEffect(() => {
    setParticles(Array.from({ length: 26 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animDelay: `${Math.random() * 8}s`,
      animDur: `${6 + Math.random() * 8}s`,
      size: `${10 + Math.random() * 16}px`,
      emoji: ["🌸","✨","🎀","💖","🌷","⭐","🦋","🎊"][Math.floor(Math.random() * 8)],
    })));
  }, []);

  // ── isOver: true ONLY when server-corrected time confirms countdown done
  const isOver = serverOk && time === null;

  // ── 5. Button handler — re-validates server time on EVERY click ───────
  const handleEnter = useCallback(async () => {
    // Always re-check server time at click moment
    setChecking(true);
    const serverNow = await fetchServerTime();
    serverOffsetRef.current = serverNow - Date.now();
    const remaining = getRemainingMs(serverNow);
    setTime(parseRemaining(remaining));
    setChecking(false);

    if (remaining > 0) {
      // Still locked — show alert regardless of UI state
      setShowAlert(true);
      return;
    }

    // Truly unlocked
    setLaunched(true);
    setTimeout(() => setPage("surprise"), 900);
  }, []);

  // ── Route to surprise ─────────────────────────────────────────────────
  if (page === "surprise") return <SurprisePage />;

  const units = time
    ? [
        { label: "Days",    value: time.days    },
        { label: "Hours",   value: time.hours   },
        { label: "Minutes", value: time.minutes },
        { label: "Seconds", value: time.seconds },
      ]
    : [];

  return (
    <div style={S.root}>
      <style>{CSS}</style>

      {showAlert && <WaitAlert onClose={() => setShowAlert(false)} />}

      {/* Floating particles */}
      {particles.map(p => (
        <div key={p.id} className="float-particle" style={{
          position: "fixed", left: p.left, bottom: "-40px",
          fontSize: p.size, animationDuration: p.animDur,
          animationDelay: p.animDelay, pointerEvents: "none", zIndex: 0,
        }}>{p.emoji}</div>
      ))}

      <div style={S.blob1} /><div style={S.blob2} /><div style={S.blob3} />

      <div style={S.center}>
        <div className="crown-bounce" style={S.crown}>👑</div>

        <h1 style={S.title}>
          {isOver ? "It's Time! 🎉" : "Something Special"}
          <br />
          <span style={S.subtitle}>
            {isOver ? "Happy Birthday, Princess!" : "is Coming..."}
          </span>
        </h1>

        {/* Countdown timer — only shown while locked */}
        {!isOver && !checking && (
          <>
            <p style={S.hint}>Counting down to her magical day ✨</p>
            <div style={S.timerRow}>
              {units.map(({ label, value }) => (
                <div key={label} style={S.unit}>
                  <div style={S.card} className="card-glow">
                    <span style={S.number}>{String(value).padStart(2, "0")}</span>
                  </div>
                  <span style={S.label}>{label}</span>
                </div>
              ))}
            </div>
            <p style={S.date}>25th March • 12:00 AM IST</p>
          </>
        )}

        {checking && (
          <p style={{ color: "rgba(255,200,240,0.5)", fontFamily: "'Lato',sans-serif", fontSize: "0.9rem", letterSpacing: 2 }}>
            Verifying time... ⏳
          </p>
        )}

        {/* Birthday message — only shown when truly over */}
        {isOver && (
          <p style={{ color: "rgba(255,220,240,0.95)", fontSize: "1.1rem", textAlign: "center", fontFamily: "'Lato',sans-serif", lineHeight: 1.7, margin: "0 0 16px" }} className="fadeIn">
            🎂🎁🥳🎈<br />The wait is finally over!<br />Wishing you the most beautiful day ever 💕
          </p>
        )}

        {/* 
          ── BUTTON STRATEGY ──────────────────────────────────────────────
          LOCKED:   Button EXISTS in DOM (inspect won't help) but:
                    • Visually greyed out
                    • onClick always calls server re-check
                    • Server says still locked → shows alert, no navigation
                    • Even if CSS is removed or onClick is called via console,
                      the server re-check happens every time before navigating
          UNLOCKED: Button becomes active — server confirmed time is past
        */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginTop: isOver ? 4 : 20 }}>
          <button
            className={`enter-btn ${launched ? "launched" : ""}`}
            style={{
              ...S.button,
              ...(!isOver ? S.buttonLocked : {}),
              ...(checking ? { opacity: 0.5, cursor: "wait" } : {}),
            }}
            onClick={handleEnter}
            disabled={checking}
          >
            {checking ? "Checking... ⏳" : "Open Your Surprise 🎀"}
          </button>

          {/* Lock status text — purely decorative, not a gate */}
          {!isOver && !checking && (
            <span style={{ color: "rgba(255,180,220,0.45)", fontSize: "0.72rem", fontFamily: "'Lato',sans-serif", letterSpacing: 1.5 }}>
              🔒 Server-locked · Unlocks 25 Mar, 12:00 AM IST
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const S = {
  root: { minHeight:"100vh", background:"linear-gradient(135deg,#1a0030 0%,#2d0050 40%,#4a0060 70%,#1a0020 100%)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Playfair Display',Georgia,serif", overflow:"hidden", position:"relative" },
  blob1: { position:"fixed",top:"-20%",left:"-15%",width:"500px",height:"500px",background:"radial-gradient(circle,rgba(255,105,180,.25) 0%,transparent 70%)",borderRadius:"50%",pointerEvents:"none" },
  blob2: { position:"fixed",bottom:"-20%",right:"-10%",width:"600px",height:"600px",background:"radial-gradient(circle,rgba(180,0,255,.2) 0%,transparent 70%)",borderRadius:"50%",pointerEvents:"none" },
  blob3: { position:"fixed",top:"40%",left:"60%",width:"300px",height:"300px",background:"radial-gradient(circle,rgba(255,180,220,.15) 0%,transparent 70%)",borderRadius:"50%",pointerEvents:"none" },
  center: { display:"flex",flexDirection:"column",alignItems:"center",gap:18,padding:"32px 20px",position:"relative",zIndex:2,maxWidth:700,width:"100%" },
  crown: { fontSize:52, filter:"drop-shadow(0 0 18px #ffcc00aa)" },
  title: { margin:0,fontSize:"clamp(2rem,7vw,3.6rem)",color:"#fff",textAlign:"center",fontWeight:700,lineHeight:1.2,textShadow:"0 0 40px rgba(255,150,200,.5)",letterSpacing:1 },
  subtitle: { fontSize:"clamp(1.1rem,4vw,2rem)",background:"linear-gradient(90deg,#ff9de2,#ffb3ec,#ff6ec4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontStyle:"italic" },
  hint: { color:"rgba(255,200,240,.75)",fontSize:"1rem",margin:0,fontFamily:"'Lato',sans-serif",fontStyle:"italic",letterSpacing:1.5 },
  timerRow: { display:"flex",gap:"clamp(10px,3vw,24px)",flexWrap:"wrap",justifyContent:"center",marginTop:8 },
  unit: { display:"flex",flexDirection:"column",alignItems:"center",gap:8 },
  card: { background:"rgba(255,255,255,.07)",border:"1.5px solid rgba(255,150,210,.4)",borderRadius:18,padding:"clamp(14px,3vw,22px) clamp(18px,4vw,32px)",backdropFilter:"blur(12px)",minWidth:"clamp(70px,15vw,100px)",textAlign:"center" },
  number: { fontSize:"clamp(2.2rem,8vw,3.8rem)",fontWeight:700,color:"#fff",fontFamily:"'Playfair Display',serif",textShadow:"0 0 20px rgba(255,120,200,.6)",letterSpacing:2,lineHeight:1 },
  label: { color:"rgba(255,180,230,.8)",fontSize:".75rem",letterSpacing:3,textTransform:"uppercase",fontFamily:"'Lato',sans-serif" },
  date: { color:"rgba(255,190,230,.5)",fontSize:".85rem",letterSpacing:2,fontFamily:"'Lato',sans-serif",marginTop:4 },
  button: { marginTop:8,padding:"16px 42px",fontSize:"1.05rem",fontFamily:"'Lato',sans-serif",fontWeight:600,letterSpacing:1.5,border:"none",borderRadius:50,cursor:"pointer",background:"linear-gradient(135deg,#ff6ec4,#ff94de,#e040fb)",color:"#fff",boxShadow:"0 0 30px rgba(255,110,196,.5),0 4px 20px rgba(0,0,0,.3)",transition:"transform .2s,box-shadow .2s" },
  buttonLocked: { background:"rgba(255,255,255,0.08)", boxShadow:"none", color:"rgba(255,200,230,0.4)", border:"1.5px solid rgba(255,150,210,0.18)", cursor:"pointer" },
  overlay: { position:"fixed",inset:0,background:"rgba(10,0,25,0.78)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100 },
  alertBox: { background:"linear-gradient(145deg,#2a0045,#3d0060)",border:"1.5px solid rgba(255,150,210,0.35)",borderRadius:24,padding:"40px 36px",maxWidth:360,width:"90%",textAlign:"center",boxShadow:"0 0 60px rgba(255,100,200,0.25),0 20px 60px rgba(0,0,0,0.5)" },
  alertTitle: { margin:"0 0 12px",fontSize:"1.6rem",color:"#fff",fontFamily:"'Playfair Display',serif",textShadow:"0 0 20px rgba(255,150,200,.5)" },
  alertMsg: { color:"rgba(255,210,235,0.85)",fontFamily:"'Lato',sans-serif",fontSize:"0.95rem",lineHeight:1.8,margin:"0 0 24px" },
  alertDate: { display:"block",marginTop:8,color:"#ff9de2",fontWeight:600,letterSpacing:1.5,fontSize:"0.9rem" },
  alertBtn: { padding:"12px 32px",fontSize:"0.95rem",fontFamily:"'Lato',sans-serif",fontWeight:600,letterSpacing:1.5,border:"none",borderRadius:50,cursor:"pointer",background:"linear-gradient(135deg,#ff6ec4,#e040fb)",color:"#fff",boxShadow:"0 0 20px rgba(255,110,196,.4)" },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Lato:wght@400;600&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html, body, #root { margin:0; padding:0; width:100%; min-height:100vh; overflow-x:hidden; }
  body { background:#1a0030; }

  .alertPop { animation:alertPop 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  @keyframes alertPop {
    from { opacity:0; transform:scale(0.7) translateY(30px); }
    to   { opacity:1; transform:scale(1) translateY(0); }
  }
  .float-particle { animation:floatUp linear infinite; }
  @keyframes floatUp {
    0%   { transform:translateY(0) rotate(0deg); opacity:0; }
    10%  { opacity:1; }
    90%  { opacity:.7; }
    100% { transform:translateY(-105vh) rotate(360deg); opacity:0; }
  }
  .crown-bounce { animation:crownBounce 2.5s ease-in-out infinite; }
  @keyframes crownBounce {
    0%,100% { transform:translateY(0) scale(1); }
    50%     { transform:translateY(-10px) scale(1.08); }
  }
  .card-glow { animation:cardPulse 2s ease-in-out infinite alternate; }
  @keyframes cardPulse {
    from { box-shadow:0 0 18px rgba(255,110,196,.2); }
    to   { box-shadow:0 0 38px rgba(255,110,196,.5); }
  }
  .enter-btn:not([disabled]):hover {
    transform:scale(1.06) translateY(-2px) !important;
    box-shadow:0 0 50px rgba(255,110,196,.75),0 6px 30px rgba(0,0,0,.3) !important;
  }
  .enter-btn.launched { animation:btnLaunch .8s ease forwards; }
  @keyframes btnLaunch {
    0%   { transform:scale(1);    opacity:1; }
    60%  { transform:scale(1.15); opacity:.8; }
    100% { transform:scale(.5);   opacity:0; }
  }
  .fadeIn { animation:fadeIn 1s ease forwards; }
  @keyframes fadeIn {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }
`;
