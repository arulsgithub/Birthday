import { useState, useEffect, useRef, useCallback } from "react";
import HogwartsSurprise from "./HogwartsSurprise";

// ── Target: 25 March 2026, 12:00 AM IST ──────────────────────────────────
const _T = 1774377000000;

async function fetchServerTime() {
  try {
    const res = await fetch("https://worldtimeapi.org/api/timezone/Asia/Kolkata", { cache: "no-store" });
    const data = await res.json();
    return new Date(data.datetime).getTime();
  } catch { return Date.now(); }
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

// ── Floating Candles ──────────────────────────────────────────────────────
function FloatingCandles() {
  const candles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${5 + Math.random() * 90}%`,
    delay: `${Math.random() * 6}s`,
    dur: `${8 + Math.random() * 6}s`,
    size: 0.6 + Math.random() * 0.8,
    drift: Math.random() > 0.5 ? "candleDriftL" : "candleDriftR",
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {candles.map(c => (
        <div key={c.id} style={{
          position: "absolute",
          left: c.left,
          bottom: "-80px",
          animation: `${c.drift} ${c.dur} ${c.delay} ease-in-out infinite`,
          transform: `scale(${c.size})`,
        }}>
          {/* Candle body */}
          <div style={{ width: 8, height: 32, background: "linear-gradient(#f0e6c8,#d4c090)", borderRadius: "3px 3px 1px 1px", margin: "0 auto", position: "relative" }}>
            {/* Wick */}
            <div style={{ width: 1, height: 8, background: "#333", position: "absolute", top: -7, left: "50%", transform: "translateX(-50%)" }} />
            {/* Flame */}
            <div style={{
              width: 8, height: 14, background: "radial-gradient(ellipse at bottom, #ffcc00, #ff6600, transparent)",
              borderRadius: "50% 50% 30% 30%", position: "absolute", top: -20, left: "50%",
              transform: "translateX(-50%)", animation: "flameFlicker 0.3s ease-in-out infinite alternate",
              boxShadow: "0 0 8px 3px rgba(255,180,0,0.4)",
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Stars ─────────────────────────────────────────────────────────────────
function MagicStars() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 1 + Math.random() * 2.5,
    delay: `${Math.random() * 4}s`,
    dur: `${2 + Math.random() * 3}s`,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: "absolute", left: s.left, top: s.top,
          width: s.size, height: s.size,
          background: "#fff", borderRadius: "50%",
          animation: `starTwinkle ${s.dur} ${s.delay} ease-in-out infinite`,
          boxShadow: `0 0 ${s.size * 2}px rgba(255,220,100,0.6)`,
        }} />
      ))}
    </div>
  );
}

// ── Hogwarts Silhouette SVG ───────────────────────────────────────────────
function HogwartsSilhouette() {
  return (
    <svg viewBox="0 0 800 300" style={{ position: "fixed", bottom: 0, left: 0, right: 0, width: "100%", pointerEvents: "none", zIndex: 2 }} preserveAspectRatio="xMidYMax meet">
      {/* Mountains */}
      <path d="M0,300 L0,180 L60,120 L120,180 L180,100 L240,160 L300,80 L360,140 L800,140 L800,300 Z" fill="#0a0a14" opacity="0.9"/>
      {/* Castle base */}
      <path d="M300,140 L300,50 L340,50 L340,30 L360,30 L360,50 L380,50 L380,20 L400,20 L400,50 L420,50 L420,40 L440,40 L440,50 L460,50 L460,140 Z" fill="#0d0d1a"/>
      {/* Towers */}
      <rect x="295" y="30" width="20" height="60" fill="#0d0d1a"/>
      <path d="M293,30 L305,10 L317,30 Z" fill="#1a1a2e"/>
      <rect x="455" y="20" width="20" height="70" fill="#0d0d1a"/>
      <path d="M453,20 L465,0 L477,20 Z" fill="#1a1a2e"/>
      <rect x="375" y="15" width="14" height="35" fill="#0d0d1a"/>
      <path d="M373,15 L382,0 L391,15 Z" fill="#1a1a2e"/>
      {/* Windows glowing */}
      <rect x="310" y="60" width="6" height="8" rx="3" fill="#ffd700" opacity="0.8"/>
      <rect x="325" y="55" width="6" height="8" rx="3" fill="#ff8c00" opacity="0.6"/>
      <rect x="410" y="65" width="6" height="8" rx="3" fill="#ffd700" opacity="0.7"/>
      <rect x="430" y="58" width="6" height="8" rx="3" fill="#ff8c00" opacity="0.5"/>
      <rect x="382" y="40" width="5" height="7" rx="2" fill="#ffd700" opacity="0.9"/>
      {/* Flags */}
      <line x1="305" y1="10" x2="305" y2="2" stroke="#8b0000" strokeWidth="1"/>
      <polygon points="305,2 313,5 305,8" fill="#8b0000"/>
      <line x1="465" y1="0" x2="465" y2="-8" stroke="#1a3a6b" strokeWidth="1"/>
      <polygon points="465,-8 473,-5 465,-2" fill="#1a3a6b"/>
      {/* Foreground trees */}
      <path d="M0,300 L0,200 L30,160 L45,200 L60,150 L75,200 L90,170 L100,220 L110,160 L125,210 L135,180 L145,230 L155,190 L170,240 L800,240 L800,300 Z" fill="#060810"/>
      {/* Lake reflection */}
      <ellipse cx="400" cy="280" rx="200" ry="15" fill="rgba(100,120,200,0.15)"/>
    </svg>
  );
}

// ── Owl flying ────────────────────────────────────────────────────────────
function FlyingOwl() {
  return (
    <div style={{ position: "fixed", top: "15%", pointerEvents: "none", zIndex: 3, animation: "owlFly 18s linear infinite" }}>
      <div style={{ fontSize: 28, animation: "owlFlap 0.4s ease-in-out infinite alternate" }}>🦉</div>
    </div>
  );
}

// ── Wait Alert ────────────────────────────────────────────────────────────
function SpellAlert({ onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(5,5,15,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }} onClick={onClose}>
      <div style={{ background: "linear-gradient(145deg,#1a1228,#0f0a1e)", border: "2px solid #8b6914", borderRadius: 4, padding: "40px 32px", maxWidth: 380, width: "100%", textAlign: "center", boxShadow: "0 0 60px rgba(139,105,20,0.3), inset 0 0 40px rgba(0,0,0,0.5)", animation: "alertPop 0.4s cubic-bezier(0.34,1.56,0.64,1)" }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: "3.5rem", marginBottom: 12, animation: "wandWave 1s ease-in-out infinite alternate" }}>🪄</div>
        <h2 style={{ fontFamily: "'Cinzel Decorative', serif", color: "#d4af37", fontSize: "1.4rem", marginBottom: 12, textShadow: "0 0 20px rgba(212,175,55,0.5)" }}>Alohomora!</h2>
        <p style={{ color: "#c8b89a", fontFamily: "'Crimson Text', serif", fontSize: "1rem", lineHeight: 1.8, marginBottom: 8 }}>
          The enchantment holds, young witch.<br />
          The castle gates shall open only when<br />
          the stars align on...
        </p>
        <p style={{ color: "#d4af37", fontFamily: "'Cinzel Decorative', serif", fontSize: "1rem", letterSpacing: 2, marginBottom: 24 }}>25th March • The Witching Hour</p>
        <button style={{ padding: "12px 32px", background: "linear-gradient(135deg,#8b1a1a,#c0392b)", border: "1px solid #d4af37", color: "#f0e6c8", fontFamily: "'Cinzel', serif", fontSize: "0.9rem", letterSpacing: 2, cursor: "pointer", borderRadius: 2 }} onClick={onClose}>
          I Shall Wait 🦉
        </button>
      </div>
    </div>
  );
}

// ── Main Countdown ────────────────────────────────────────────────────────
export default function HogwartsCountdown() {
  const [page, setPage]           = useState("countdown");
  const [time, setTime]           = useState(null);
  const [serverOk, setServerOk]   = useState(false);
  const [checking, setChecking]   = useState(true);
  const [launched, setLaunched]   = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [sparkles, setSparkles]   = useState([]);
  const serverOffsetRef           = useRef(0);

  useEffect(() => {
    (async () => {
      const sNow = await fetchServerTime();
      serverOffsetRef.current = sNow - Date.now();
      setTime(parseRemaining(sNow - _T <= 0 ? 0 : _T - sNow));
      setServerOk(true);
      setChecking(false);
    })();
  }, []);

  useEffect(() => {
    if (!serverOk) return;
    const iv = setInterval(() => {
      const now = Date.now() + serverOffsetRef.current;
      setTime(parseRemaining(_T - now));
    }, 1000);
    return () => clearInterval(iv);
  }, [serverOk]);

  useEffect(() => {
    setSparkles(Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 70}%`,
      delay: `${Math.random() * 5}s`,
      dur: `${2 + Math.random() * 3}s`,
      char: ["✦","✧","⋆","·","★","✨"][Math.floor(Math.random() * 6)],
    })));
  }, []);

  const isOver = serverOk && time === null;

  const handleEnter = useCallback(async () => {
    setChecking(true);
    const sNow = await fetchServerTime();
    serverOffsetRef.current = sNow - Date.now();
    const rem = _T - sNow;
    setTime(parseRemaining(rem));
    setChecking(false);
    if (rem > 0) { setShowAlert(true); return; }
    setLaunched(true);
    setTimeout(() => setPage("surprise"), 1200);
  }, []);

  if (page === "surprise") return <HogwartsSurprise />;

  const units = time ? [
    { label: "Days",    value: time.days    },
    { label: "Hours",   value: time.hours   },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ] : [];

  return (
    <div style={S.root}>
      <style>{CSS}</style>
      <MagicStars />
      <FloatingCandles />
      <FlyingOwl />
      <HogwartsSilhouette />

      {showAlert && <SpellAlert onClose={() => setShowAlert(false)} />}

      {/* Ambient sparkles */}
      {sparkles.map(s => (
        <div key={s.id} style={{ position: "fixed", left: s.left, top: s.top, color: "#d4af37", fontSize: "0.8rem", animation: `sparkleFloat ${s.dur} ${s.delay} ease-in-out infinite`, pointerEvents: "none", zIndex: 3 }}>{s.char}</div>
      ))}

      <div style={S.center}>
        {/* Hogwarts crest */}
        <div style={S.crest} className="crestGlow">
          <div style={S.crestInner}>
            <div style={{ fontSize: "clamp(2rem,8vw,3.5rem)", lineHeight: 1 }}>⚡</div>
            <div style={{ fontSize: "0.6rem", letterSpacing: 4, color: "#8b6914", fontFamily: "'Cinzel', serif", marginTop: 4 }}>HOGWARTS</div>
          </div>
        </div>

        {/* Main title */}
        <div style={S.scrollBanner}>
          <div style={S.scrollLeft}>〜</div>
          <div style={{ textAlign: "center" }}>
            <h1 style={S.mainTitle} className="titleGlow">
              {isOver ? "Mischief Managed!" : "A Most Special"}
            </h1>
            <p style={S.mainSub}>
              {isOver ? "Happy Birthday, Amritha! 🎂" : "Enchantment Awaits..."}
            </p>
          </div>
          <div style={S.scrollRight}>〜</div>
        </div>

        {/* Letter from Hogwarts */}
        {!isOver && !checking && (
          <div style={S.letterBox} className="letterReveal">
            <div style={S.letterSeal}>🦉</div>
            <p style={S.letterText}>
              <em>Dear Amritha,</em><br /><br />
              We are pleased to inform you that a most magical surprise<br />
              has been prepared in your honour.<br />
              The enchantment shall be revealed at the stroke of midnight<br />
              on the 25th of March.
            </p>
            <p style={S.letterSign}>— Headmaster's Office, Hogwarts</p>
          </div>
        )}

        {/* Timer */}
        {!isOver && !checking && (
          <div style={S.timerSection}>
            <p style={S.timerLabel}>✦ The Enchantment Breaks In ✦</p>
            <div style={S.timerRow}>
              {units.map(({ label, value }) => (
                <div key={label} style={S.timerUnit}>
                  <div style={S.parchmentCard} className="cardGlow">
                    <div style={S.timerNum}>{String(value).padStart(2, "0")}</div>
                  </div>
                  <div style={S.timerUnitLabel}>{label}</div>
                </div>
              ))}
            </div>
            <p style={S.timerDate}>25th March · XII · IST</p>
          </div>
        )}

        {checking && (
          <p style={{ color: "#8b6914", fontFamily: "'Cinzel', serif", fontSize: "0.85rem", letterSpacing: 3 }}>
            Consulting the stars... ✨
          </p>
        )}

        {/* Birthday message */}
        {isOver && (
          <div style={S.birthdayBox} className="letterReveal">
            <p style={S.bdayEmoji}>🎂⚡🎁🦉🧙‍♀️</p>
            <p style={S.bdayText}>
              The enchantment has broken!<br />
              Your magical surprise awaits, young witch.<br />
              <em style={{ color: "#d4af37" }}>Happiness can be found even in the darkest of times,<br />if one only remembers to turn on the light.</em>
            </p>
          </div>
        )}

        {/* Button */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginTop: 8, position: "relative", zIndex: 10 }}>
          <button
            style={{ ...S.btn, ...(!isOver ? S.btnLocked : {}), ...(checking ? { opacity: 0.6, cursor: "wait" } : {}), ...(launched ? { animation: "btnLaunch 1s ease forwards" } : {}) }}
            onClick={handleEnter}
            disabled={checking}
          >
            <span style={{ marginRight: 8 }}>🪄</span>
            {checking ? "Consulting stars..." : isOver ? "Alohomora! Open Surprise" : "Alohomora!"}
          </button>
          {!isOver && !checking && (
            <p style={{ color: "#4a3a20", fontFamily: "'Crimson Text', serif", fontSize: "0.8rem", letterSpacing: 1, fontStyle: "italic" }}>
              🔒 Sealed by ancient magic · Unlocks 25th March
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const S = {
  root: { minHeight: "100vh", background: "radial-gradient(ellipse at 50% 0%, #0f0a1e 0%, #080612 40%, #050308 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Crimson Text', serif", position: "relative", overflow: "hidden", paddingBottom: 160 },
  center: { display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "32px 20px", position: "relative", zIndex: 5, maxWidth: 700, width: "100%" },
  crest: { width: 90, height: 90, border: "2px solid #8b6914", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle, rgba(139,105,20,0.15) 0%, transparent 70%)" },
  crestInner: { textAlign: "center" },
  scrollBanner: { display: "flex", alignItems: "center", gap: 12, width: "100%" },
  scrollLeft: { color: "#8b6914", fontSize: "1.5rem", opacity: 0.6, flexShrink: 0 },
  scrollRight: { color: "#8b6914", fontSize: "1.5rem", opacity: 0.6, flexShrink: 0 },
  mainTitle: { fontFamily: "'Cinzel Decorative', serif", fontSize: "clamp(1.6rem,6vw,3rem)", color: "#d4af37", letterSpacing: 3, textAlign: "center", lineHeight: 1.2 },
  mainSub: { fontFamily: "'Cinzel', serif", fontSize: "clamp(0.9rem,3vw,1.3rem)", color: "#c8b89a", letterSpacing: 3, textAlign: "center", fontStyle: "italic", marginTop: 6 },
  letterBox: { background: "linear-gradient(145deg, #1e1508, #160f04)", border: "1px solid #8b691466", borderRadius: 2, padding: "24px 28px", maxWidth: 520, width: "100%", position: "relative", boxShadow: "0 8px 32px rgba(0,0,0,0.6), inset 0 0 20px rgba(139,105,20,0.05)" },
  letterSeal: { position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)", fontSize: 28, filter: "drop-shadow(0 0 8px rgba(139,105,20,0.6))" },
  letterText: { color: "#c8b89a", fontSize: "0.95rem", lineHeight: 2, textAlign: "center", marginTop: 8 },
  letterSign: { color: "#8b6914", fontSize: "0.8rem", letterSpacing: 2, textAlign: "right", marginTop: 12, fontStyle: "italic" },
  timerSection: { textAlign: "center", width: "100%" },
  timerLabel: { color: "#8b6914", fontFamily: "'Cinzel', serif", fontSize: "0.75rem", letterSpacing: 3, marginBottom: 16 },
  timerRow: { display: "flex", gap: "clamp(8px,3vw,20px)", justifyContent: "center", flexWrap: "wrap" },
  timerUnit: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
  parchmentCard: { background: "linear-gradient(145deg,#1e1508,#2a1e0a)", border: "1px solid #8b691488", borderRadius: 4, padding: "clamp(12px,3vw,20px) clamp(16px,4vw,28px)", minWidth: "clamp(65px,14vw,95px)", textAlign: "center", position: "relative", overflow: "hidden" },
  timerNum: { fontSize: "clamp(2rem,7vw,3.5rem)", fontWeight: 700, color: "#d4af37", fontFamily: "'Cinzel Decorative', serif", lineHeight: 1, textShadow: "0 0 20px rgba(212,175,55,0.5)" },
  timerUnitLabel: { color: "#8b6914", fontSize: "0.65rem", letterSpacing: 3, textTransform: "uppercase", fontFamily: "'Cinzel', serif" },
  timerDate: { color: "#4a3a20", fontFamily: "'Cinzel', serif", fontSize: "0.75rem", letterSpacing: 3, marginTop: 14 },
  birthdayBox: { background: "linear-gradient(145deg,#1e1508,#160f04)", border: "1px solid #8b6914", borderRadius: 2, padding: "24px 28px", maxWidth: 520, width: "100%", textAlign: "center" },
  bdayEmoji: { fontSize: "2.2rem", letterSpacing: 6, marginBottom: 12 },
  bdayText: { color: "#c8b89a", fontSize: "1rem", lineHeight: 2 },
  btn: { padding: "16px 40px", background: "linear-gradient(135deg,#8b1a1a,#a52020,#8b1a1a)", border: "1.5px solid #d4af37", color: "#f0e6c8", fontFamily: "'Cinzel', serif", fontSize: "1rem", letterSpacing: 3, cursor: "pointer", borderRadius: 2, boxShadow: "0 0 20px rgba(139,26,26,0.4), 0 0 40px rgba(212,175,55,0.1)", transition: "all 0.3s", position: "relative", zIndex: 10 },
  btnLocked: { background: "rgba(255,255,255,0.04)", boxShadow: "none", color: "rgba(200,184,154,0.3)", borderColor: "rgba(139,105,20,0.2)", cursor: "pointer" },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { width: 100%; min-height: 100vh; background: #050308; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #080612; }
  ::-webkit-scrollbar-thumb { background: #8b6914; border-radius: 3px; }

  @keyframes starTwinkle { 0%,100%{opacity:.2;transform:scale(1)} 50%{opacity:1;transform:scale(1.4)} }
  @keyframes candleDriftL { 0%{transform:translateY(0) rotate(0deg) scale(var(--s,1))} 25%{transform:translateY(-30vh) rotate(-5deg)} 50%{transform:translateY(-60vh) rotate(3deg)} 75%{transform:translateY(-80vh) rotate(-3deg)} 100%{transform:translateY(-110vh) rotate(0deg)} }
  @keyframes candleDriftR { 0%{transform:translateY(0) rotate(0deg)} 25%{transform:translateY(-30vh) rotate(5deg)} 50%{transform:translateY(-60vh) rotate(-3deg)} 75%{transform:translateY(-80vh) rotate(3deg)} 100%{transform:translateY(-110vh) rotate(0deg)} }
  @keyframes flameFlicker { from{transform:translateX(-50%) scaleY(1) scaleX(1)} to{transform:translateX(-50%) scaleY(1.15) scaleX(0.9)} }
  @keyframes sparkleFloat { 0%,100%{opacity:0;transform:translateY(0) rotate(0deg)} 30%{opacity:1} 70%{opacity:.5} 100%{transform:translateY(-30px) rotate(360deg)} }
  @keyframes owlFly { 0%{left:-60px;top:15%} 40%{top:20%} 60%{top:12%} 100%{left:110vw;top:10%} }
  @keyframes owlFlap { from{transform:scaleY(1)} to{transform:scaleY(0.85) scaleX(1.1)} }
  @keyframes titleGlow { 0%,100%{text-shadow:0 0 20px rgba(212,175,55,0.4)} 50%{text-shadow:0 0 40px rgba(212,175,55,0.8),0 0 80px rgba(212,175,55,0.3)} }
  @keyframes crestGlow { 0%,100%{box-shadow:0 0 15px rgba(139,105,20,0.3)} 50%{box-shadow:0 0 35px rgba(139,105,20,0.7), 0 0 60px rgba(212,175,55,0.2)} }
  @keyframes cardGlow { 0%,100%{box-shadow:0 0 10px rgba(139,105,20,0.2)} 50%{box-shadow:0 0 25px rgba(139,105,20,0.5),inset 0 0 15px rgba(212,175,55,0.05)} }
  @keyframes letterReveal { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes alertPop { from{opacity:0;transform:scale(0.7)} to{opacity:1;transform:scale(1)} }
  @keyframes wandWave { from{transform:rotate(-15deg)} to{transform:rotate(15deg)} }
  @keyframes btnLaunch { 0%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:.8} 100%{transform:scale(0);opacity:0} }

  .titleGlow { animation: titleGlow 3s ease-in-out infinite; }
  .crestGlow { animation: crestGlow 3s ease-in-out infinite; }
  .cardGlow  { animation: cardGlow  2s ease-in-out infinite; }
  .letterReveal { animation: letterReveal 0.8s ease forwards; }

  button:hover:not([disabled]) { transform: scale(1.04) translateY(-2px) !important; box-shadow: 0 0 30px rgba(212,175,55,0.4), 0 0 60px rgba(139,26,26,0.3) !important; }
`;