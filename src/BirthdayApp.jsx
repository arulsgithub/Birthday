import { useState, useEffect } from "react";
import SurprisePage from "./SurprisePage";

const TARGET = new Date("2024-01-01T00:00:00+05:30");

function getTimeLeft() {
  const diff = TARGET - new Date();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function WaitAlert({ onClose }) {
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.alertBox} className="alertPop" onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: "3rem", marginBottom: 8 }}>⏳</div>
        <h2 style={styles.alertTitle}>Patience, Dear! 💕</h2>
        <p style={styles.alertMsg}>
          Your surprise is being wrapped with love.<br />
          Please wait until the timer ends on<br />
          <span style={styles.alertDate}>25th March • 12:00 AM IST</span>
        </p>
        <button style={styles.alertBtn} onClick={onClose}>Okay, I'll Wait 🎀</button>
      </div>
    </div>
  );
}

export default function BirthdayApp() {
  const [page, setPage] = useState("countdown");
  const [time, setTime] = useState(getTimeLeft());
  const [particles, setParticles] = useState([]);
  const [launched, setLaunched] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setParticles(
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        animDelay: `${Math.random() * 8}s`,
        animDur: `${6 + Math.random() * 8}s`,
        size: `${10 + Math.random() * 16}px`,
        emoji: ["🌸","✨","🎀","💖","🌷","⭐","🦋","🎊"][Math.floor(Math.random() * 8)],
      }))
    );
  }, []);

  const isOver = time === null;

  const handleEnter = () => {
    if (!isOver) { setShowAlert(true); return; }
    setLaunched(true);
    setTimeout(() => setPage("surprise"), 900);
  };

  const units = time
    ? [
        { label: "Days", value: time.days },
        { label: "Hours", value: time.hours },
        { label: "Minutes", value: time.minutes },
        { label: "Seconds", value: time.seconds },
      ]
    : [];

  if (page === "surprise") {
         return <SurprisePage />;
  }

  return (
    <div style={styles.root}>
      <style>{css}</style>

      {showAlert && <WaitAlert onClose={() => setShowAlert(false)} />}

      {particles.map((p) => (
        <div key={p.id} className="float-particle" style={{
          position: "fixed", left: p.left, bottom: "-40px",
          fontSize: p.size, animationDuration: p.animDur,
          animationDelay: p.animDelay, pointerEvents: "none", zIndex: 0,
        }}>
          {p.emoji}
        </div>
      ))}

      <div style={styles.blob1} /><div style={styles.blob2} /><div style={styles.blob3} />

      <div style={styles.center}>
        <div className="crown-bounce" style={styles.crown}>👑</div>

        <h1 style={styles.title}>
          {isOver ? "It's Time! 🎉" : "Something Special"}
          <br />
          <span style={styles.subtitle}>
            {isOver ? "Happy Birthday, Princess!" : "is Coming..."}
          </span>
        </h1>

        {!isOver && (
          <>
            <p style={styles.hint}>Counting down to her magical day ✨</p>
            <div style={styles.timerRow}>
              {units.map(({ label, value }) => (
                <div key={label} style={styles.unit}>
                  <div style={styles.card} className="card-glow">
                    <span style={styles.number}>{String(value).padStart(2, "0")}</span>
                  </div>
                  <span style={styles.label}>{label}</span>
                </div>
              ))}
            </div>
            <p style={styles.date}>25th March • 12:00 AM IST</p>
          </>
        )}

        {/* Button always visible */}
        <div style={{ marginTop: isOver ? 8 : 24 }}>
          {isOver && (
            <p style={{ color: "rgba(255,220,240,0.95)", fontSize: "1.1rem", textAlign: "center", fontFamily: "'Lato',sans-serif", lineHeight: 1.7, margin: "0 0 16px" }}>
              🎂🎁🥳🎈<br />The wait is finally over!<br />Wishing you the most beautiful day ever 💕
            </p>
          )}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <button
              className={`enter-btn ${launched ? "launched" : ""} ${!isOver ? "btn-disabled" : ""}`}
              style={{
                ...styles.button,
                ...(isOver ? {} : styles.buttonDisabled),
              }}
              onClick={handleEnter}
            >
              {isOver ? "Open Your Surprise 🎀" : "Open Your Surprise 🎀"}
            </button>
            {!isOver && (
              <span style={{ color: "rgba(255,180,220,0.5)", fontSize: "0.75rem", fontFamily: "'Lato',sans-serif", letterSpacing: 1.5 }}>
                🔒 Unlocks on 25th March
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#1a0030 0%,#2d0050 40%,#4a0060 70%,#1a0020 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Playfair Display',Georgia,serif",
    overflow: "hidden", position: "relative",
  },
  blob1: { position:"fixed",top:"-20%",left:"-15%",width:"500px",height:"500px",background:"radial-gradient(circle,rgba(255,105,180,.25) 0%,transparent 70%)",borderRadius:"50%",pointerEvents:"none" },
  blob2: { position:"fixed",bottom:"-20%",right:"-10%",width:"600px",height:"600px",background:"radial-gradient(circle,rgba(180,0,255,.2) 0%,transparent 70%)",borderRadius:"50%",pointerEvents:"none" },
  blob3: { position:"fixed",top:"40%",left:"60%",width:"300px",height:"300px",background:"radial-gradient(circle,rgba(255,180,220,.15) 0%,transparent 70%)",borderRadius:"50%",pointerEvents:"none" },
  center: { display:"flex",flexDirection:"column",alignItems:"center",gap:18,padding:"32px 20px",position:"relative",zIndex:2,maxWidth:700,width:"100%" },
  crown: { fontSize:52,filter:"drop-shadow(0 0 18px #ffcc00aa)" },
  title: { margin:0,fontSize:"clamp(2rem,7vw,3.6rem)",color:"#fff",textAlign:"center",fontWeight:700,lineHeight:1.2,textShadow:"0 0 40px rgba(255,150,200,.5)",letterSpacing:1 },
  subtitle: { fontSize:"clamp(1.1rem,4vw,2rem)",background:"linear-gradient(90deg,#ff9de2,#ffb3ec,#ff6ec4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontStyle:"italic" },
  hint: { color:"rgba(255,200,240,.75)",fontSize:"1rem",margin:0,fontFamily:"'Lato',sans-serif",fontStyle:"italic",letterSpacing:1.5 },
  timerRow: { display:"flex",gap:"clamp(10px,3vw,24px)",flexWrap:"wrap",justifyContent:"center",marginTop:8 },
  unit: { display:"flex",flexDirection:"column",alignItems:"center",gap:8 },
  card: { background:"rgba(255,255,255,.07)",border:"1.5px solid rgba(255,150,210,.4)",borderRadius:18,padding:"clamp(14px,3vw,22px) clamp(18px,4vw,32px)",backdropFilter:"blur(12px)",minWidth:"clamp(70px,15vw,100px)",textAlign:"center" },
  number: { fontSize:"clamp(2.2rem,8vw,3.8rem)",fontWeight:700,color:"#fff",fontFamily:"'Playfair Display',serif",textShadow:"0 0 20px rgba(255,120,200,.6)",letterSpacing:2,lineHeight:1 },
  label: { color:"rgba(255,180,230,.8)",fontSize:".75rem",letterSpacing:3,textTransform:"uppercase",fontFamily:"'Lato',sans-serif" },
  date: { color:"rgba(255,190,230,.5)",fontSize:".85rem",letterSpacing:2,fontFamily:"'Lato',sans-serif",marginTop:4 },
  birthdayMsg: { display:"flex",flexDirection:"column",alignItems:"center",gap:16,marginTop:8 },
  button: { marginTop:10,padding:"16px 42px",fontSize:"1.05rem",fontFamily:"'Lato',sans-serif",fontWeight:600,letterSpacing:1.5,border:"none",borderRadius:50,cursor:"pointer",background:"linear-gradient(135deg,#ff6ec4,#ff94de,#e040fb)",color:"#fff",boxShadow:"0 0 30px rgba(255,110,196,.5),0 4px 20px rgba(0,0,0,.3)",transition:"transform .2s,box-shadow .2s" },
  buttonDisabled: { background:"rgba(255,255,255,0.1)",boxShadow:"none",cursor:"pointer",color:"rgba(255,200,230,0.5)",border:"1.5px solid rgba(255,150,210,0.2)" },
  overlay: { position:"fixed",inset:0,background:"rgba(10,0,25,0.75)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100 },
  alertBox: { background:"linear-gradient(145deg,#2a0045,#3d0060)",border:"1.5px solid rgba(255,150,210,0.35)",borderRadius:24,padding:"40px 36px",maxWidth:360,width:"90%",textAlign:"center",boxShadow:"0 0 60px rgba(255,100,200,0.25),0 20px 60px rgba(0,0,0,0.5)" },
  alertTitle: { margin:"0 0 12px",fontSize:"1.6rem",color:"#fff",fontFamily:"'Playfair Display',serif",textShadow:"0 0 20px rgba(255,150,200,.5)" },
  alertMsg: { color:"rgba(255,210,235,0.85)",fontFamily:"'Lato',sans-serif",fontSize:"0.95rem",lineHeight:1.8,margin:"0 0 24px" },
  alertDate: { display:"block",marginTop:8,color:"#ff9de2",fontWeight:600,letterSpacing:1.5,fontSize:"0.9rem" },
  alertBtn: { padding:"12px 32px",fontSize:"0.95rem",fontFamily:"'Lato',sans-serif",fontWeight:600,letterSpacing:1.5,border:"none",borderRadius:50,cursor:"pointer",background:"linear-gradient(135deg,#ff6ec4,#e040fb)",color:"#fff",boxShadow:"0 0 20px rgba(255,110,196,.4)",transition:"transform .2s" },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Lato:wght@400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { margin: 0; padding: 0; width: 100%; min-height: 100vh; overflow-x: hidden; }
  body { background: #1a0030; }
  .alertPop { animation: alertPop 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  @keyframes alertPop {
    from { opacity:0; transform:scale(0.7) translateY(30px); }
    to   { opacity:1; transform:scale(1) translateY(0); }
  }
  .float-particle { animation: floatUp linear infinite; }
  @keyframes floatUp {
    0%   { transform:translateY(0) rotate(0deg);   opacity:0; }
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
  .enter-btn:hover { transform:scale(1.06) translateY(-2px) !important; box-shadow:0 0 50px rgba(255,110,196,.75),0 6px 30px rgba(0,0,0,.3) !important; }
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