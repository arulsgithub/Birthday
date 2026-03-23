import { useState, useEffect } from "react";
import HogwartsMystery from "./HogwartsMystery";

/* ══════════════════════════════════════════════════════════
   SHARED GLOBALS
══════════════════════════════════════════════════════════ */
const HP_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=MedievalSharp&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{width:100%;min-height:100vh;background:#050308;overflow-x:hidden;}
::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:#080612;}::-webkit-scrollbar-thumb{background:#8b6914;border-radius:3px;}

@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeInLeft{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@keyframes starTwinkle{0%,100%{opacity:.15;transform:scale(1)}50%{opacity:.9;transform:scale(1.5)}}
@keyframes goldGlow{0%,100%{text-shadow:0 0 10px rgba(212,175,55,.4)}50%{text-shadow:0 0 30px rgba(212,175,55,.9),0 0 60px rgba(212,175,55,.3)}}
@keyframes parchmentFlicker{0%,100%{opacity:1}50%{opacity:.92}}
@keyframes spellSpark{0%{transform:scale(0) rotate(0deg);opacity:1}100%{transform:scale(2) rotate(360deg);opacity:0}}
@keyframes wandPulse{0%,100%{filter:drop-shadow(0 0 4px #d4af37)}50%{filter:drop-shadow(0 0 16px #d4af37) drop-shadow(0 0 30px rgba(212,175,55,.5))}}
@keyframes mapReveal{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0% 0 0)}}
@keyframes floatUp{0%{transform:translateY(0) rotate(0deg);opacity:0}10%{opacity:1}90%{opacity:.7}100%{transform:translateY(-100vh) rotate(360deg);opacity:0}}
@keyframes stampIn{from{transform:scale(3) rotate(-10deg);opacity:0}to{transform:scale(1) rotate(-10deg);opacity:1}}
@keyframes heartbeat{0%,100%{transform:scale(1)}14%{transform:scale(1.08)}28%{transform:scale(1)}42%{transform:scale(1.05)}}
@keyframes confettiFall{0%{transform:translateY(-10px) rotate(0);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
@keyframes crystalBall{0%,100%{box-shadow:0 0 20px rgba(100,100,255,.3),inset 0 0 20px rgba(150,100,255,.2)}50%{box-shadow:0 0 40px rgba(150,100,255,.6),inset 0 0 40px rgba(200,150,255,.3)}}
@keyframes sortingHatBob{0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-10px) rotate(5deg)}}
@keyframes marauderReveal{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}

.fi{animation:fadeIn .6s ease forwards}
.fiu{animation:fadeInUp .7s ease forwards}
.fil{animation:fadeInLeft .6s ease forwards}
.goldGlow{animation:goldGlow 2.5s ease-in-out infinite}
`;

/* Shared stars background */
function Stars({ count = 60 }) {
  const s = Array.from({ length: count }, (_, i) => ({
    id: i, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
    size: 1 + Math.random() * 2, delay: `${Math.random() * 4}s`, dur: `${2 + Math.random() * 3}s`,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {s.map(x => <div key={x.id} style={{ position: "absolute", left: x.left, top: x.top, width: x.size, height: x.size, background: "#fff", borderRadius: "50%", animation: `starTwinkle ${x.dur} ${x.delay} ease-in-out infinite`, boxShadow: `0 0 ${x.size * 2}px rgba(212,175,55,0.4)` }} />)}
    </div>
  );
}

/* Shared parchment button */
const HPBtn = ({ children, onClick, color = "#8b1a1a", style = {} }) => (
  <button onClick={onClick} style={{ padding: "13px 32px", background: `linear-gradient(135deg,${color},${color}dd)`, border: "1.5px solid #d4af37", color: "#f0e6c8", fontFamily: "'Cinzel', serif", fontSize: "0.88rem", letterSpacing: 2, cursor: "pointer", borderRadius: 2, boxShadow: "0 0 15px rgba(212,175,55,0.2)", transition: "all 0.3s", ...style }}>
    {children}
  </button>
);

/* Confetti */
function Confetti() {
  const p = Array.from({ length: 60 }, (_, i) => ({ id: i, left: `${Math.random() * 100}%`, color: ["#d4af37", "#8b1a1a", "#1a3a6b", "#2d6b1a", "#c8b89a"][i % 5], size: `${5 + Math.random() * 8}px`, delay: `${Math.random() * 2}s`, dur: `${2.5 + Math.random() * 2}s`, br: i % 3 === 0 ? "50%" : "0" }));
  return <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 990 }}>{p.map(c => <div key={c.id} style={{ position: "absolute", top: "-20px", left: c.left, width: c.size, height: c.size, background: c.color, borderRadius: c.br, animation: `confettiFall ${c.dur} ${c.delay} ease-in forwards` }} />)}</div>;
}

/* Typewriter */
function useTypewriter(text, speed = 30, active = true) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active) { setOut(""); setDone(false); return; }
    setOut(""); setDone(false); let i = 0;
    const iv = setInterval(() => { if (i < text.length) { setOut(text.slice(0, ++i)); } else { setDone(true); clearInterval(iv); } }, speed);
    return () => clearInterval(iv);
  }, [text, active]);
  return { out, done };
}

/* Transition */
function HPTransition({ from, onDone }) {
  const labels = ["", "⚡ Case Closed!", "🔮 Chamber Sealed!", "📜 Ministry Filed!", "🗺️ Map Folded!"];
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "fixed", inset: 0, background: "#050308", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 999 }} className="fi">
      <div style={{ fontSize: 52, animation: "wandPulse 1s infinite", marginBottom: 20 }}>🪄</div>
      <p style={{ color: "#d4af37", fontFamily: "'Cinzel Decorative'", fontSize: "clamp(1rem,4vw,1.6rem)", letterSpacing: 4, textAlign: "center" }}>{labels[from]}</p>
      <p style={{ color: "#4a3a20", fontFamily: "'Crimson Text'", fontSize: "0.9rem", letterSpacing: 3, marginTop: 12 }}>The next chapter unfolds...</p>
      <div style={{ display: "flex", gap: 8, marginTop: 28 }}>
        {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#8b6914", animation: `heartbeat 1s ${i * 0.2}s infinite` }} />)}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STAGE 1 — THE MYSTERY OF THE MISSING BIRTHDAY WITCH
══════════════════════════════════════════════════════════ */
function Stage1({ onNext }) {
  const [step, setStep] = useState(0);
  const [suspect, setSuspect] = useState(null);
  const [solved, setSolved] = useState(false);
  const intro = "CLASSIFIED — Ministry of Magic\nCase File #HP-2503\n\nThe Birthday Witch has gone missing from Hogwarts\non the eve of her most special day.\nThree suspects remain in the Great Hall.\nDetective Amritha, crack the case.";
  const { out, done } = useTypewriter(intro, 28, step === 1);

  const suspects = [
    { id: 0, name: "Dobby", icon: "🧦", alibi: "Claims he was ironing his hands. A sock was found near the scene.", verdict: "INNOCENT" },
    { id: 1, name: "Peeves", icon: "👻", alibi: "Was seen dropping dungbombs on the 7th floor. Two witnesses confirm.", verdict: "INNOCENT" },
    { id: 2, name: "Time Itself", icon: "⏳", alibi: "Stole 365 days from Amritha... and returned them as wisdom, laughter & magic.", verdict: "GUILTY ❤️" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top, #0f0a1e, #050308)", paddingBottom: 40 }}>
      <Stars count={50} />
      {step === 0 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 20, gap: 20, position: "relative", zIndex: 5 }} className="fi">
          <div style={{ fontSize: 64, animation: "wandPulse 2s infinite" }}>🔍</div>
          <h1 style={{ fontFamily: "'Cinzel Decorative'", fontSize: "clamp(1.3rem,5vw,2.2rem)", color: "#d4af37", textAlign: "center", letterSpacing: 3, animation: "goldGlow 2s infinite" }}>Ministry of Magic</h1>
          <p style={{ fontFamily: "'Cinzel'", color: "#c8b89a", fontSize: "0.9rem", letterSpacing: 4, textAlign: "center" }}>DEPARTMENT OF MYSTERIES</p>
          <div style={{ width: 60, height: 1, background: "#8b691466" }} />
          <p style={{ fontFamily: "'Cinzel'", color: "#8b6914", fontSize: "0.8rem", letterSpacing: 3, textAlign: "center" }}>CASE NO. HP-2503</p>
          <p style={{ color: "#c8b89a", fontFamily: "'Crimson Text'", fontSize: "1rem", lineHeight: 1.8, textAlign: "center", maxWidth: 400 }}>A most peculiar case has landed on your desk, Detective. Only the sharpest wizard mind can solve it.</p>
          <HPBtn onClick={() => setStep(1)}>Open Case File →</HPBtn>
        </div>
      )}
      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 20, gap: 20, position: "relative", zIndex: 5 }}>
          <div style={{ maxWidth: 580, width: "100%", background: "linear-gradient(145deg,#1e1508,#160f04)", border: "1px solid #8b691466", borderRadius: 4, padding: "28px 24px" }} className="fi">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ background: "#8b0000", color: "#fff", padding: "4px 14px", fontFamily: "'Cinzel'", fontSize: "0.65rem", letterSpacing: 3, transform: "rotate(-2deg)", display: "inline-block" }}>TOP SECRET</span>
              <span style={{ color: "#8b6914", fontFamily: "'Cinzel'", fontSize: "0.7rem", letterSpacing: 3 }}>MINISTRY OF MAGIC</span>
            </div>
            <pre style={{ fontFamily: "'Crimson Text'", fontSize: "1rem", color: "#c8b89a", lineHeight: 2, whiteSpace: "pre-wrap" }}>{out}{!done && <span style={{ animation: "goldGlow 0.8s infinite" }}>▌</span>}</pre>
            {done && (
              <div style={{ marginTop: 20, textAlign: "center" }} className="fiu">
                <p style={{ color: "#c8b89a", fontFamily: "'Crimson Text'", fontSize: "0.95rem", marginBottom: 16 }}>Three suspects await interrogation in the Great Hall.</p>
                <HPBtn onClick={() => setStep(2)}>Begin Interrogation →</HPBtn>
              </div>
            )}
          </div>
        </div>
      )}
      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", gap: 24, position: "relative", zIndex: 5 }}>
          <h2 style={{ fontFamily: "'Cinzel Decorative'", color: "#d4af37", fontSize: "clamp(1.1rem,4vw,1.8rem)", letterSpacing: 3, textAlign: "center", animation: "goldGlow 2s infinite" }}>The Suspect Board</h2>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", maxWidth: 700 }}>
            {suspects.map(s => (
              <div key={s.id} style={{ background: "linear-gradient(145deg,#1a1208,#120d04)", border: `1.5px solid ${suspect === s.id ? "#d4af37" : "#2a1e08"}`, borderRadius: 4, padding: 20, flex: "1 1 160px", maxWidth: 200, cursor: "pointer", transition: "all 0.3s", textAlign: "center" }} onClick={() => setSuspect(s.id)} className="fiu">
                <div style={{ fontSize: 44 }}>{s.icon}</div>
                <p style={{ color: "#d4af37", fontFamily: "'Cinzel'", fontSize: "0.85rem", letterSpacing: 2, marginTop: 8 }}>{s.name}</p>
                {suspect === s.id && (
                  <div className="fiu">
                    <p style={{ color: "#a89070", fontFamily: "'Crimson Text'", fontSize: "0.85rem", lineHeight: 1.7, marginTop: 10, fontStyle: "italic" }}>"{s.alibi}"</p>
                    <p style={{ color: s.verdict.includes("GUILTY") ? "#ff9de2" : "#66cc88", fontFamily: "'Cinzel'", fontSize: "0.75rem", letterSpacing: 2, marginTop: 8 }}>{s.verdict}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {suspect === 2 && !solved && (
            <HPBtn onClick={() => setSolved(true)} style={{ animation: "wandPulse 1.5s infinite" }}>✦ Case Solved! Reveal Finding ✦</HPBtn>
          )}
          {solved && (
            <div style={{ maxWidth: 520, background: "linear-gradient(145deg,#1a1208,#120d04)", border: "1px solid #d4af37", borderRadius: 4, padding: 28, textAlign: "center" }} className="fiu">
              <p style={{ color: "#d4af37", fontFamily: "'Cinzel Decorative'", fontSize: "1.2rem", letterSpacing: 3 }}>⚡ Case Closed! ⚡</p>
              <p style={{ color: "#c8b89a", fontFamily: "'Crimson Text'", fontSize: "1rem", lineHeight: 1.9, marginTop: 12 }}>
                Time stole Amritha away for 365 enchanted days...<br />and returned her more brilliant, more magical, more extraordinary than ever.
              </p>
              <HPBtn onClick={onNext} style={{ marginTop: 20, background: "linear-gradient(135deg,#1a3a6b,#2a5a9b)" }}>Proceed to Next Chapter →</HPBtn>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STAGE 2 — UNLOCK THE CHAMBER (Spell Code)
══════════════════════════════════════════════════════════ */
function Stage2({ onNext }) {
  const spells = [
    { q: "The spell that unlocks any door. Say it.", answer: "ALOHOMORA", hint: "🔓 First spell Hermione teaches" },
    { q: "Harry's signature defensive spell. The one that saved him countless times.", answer: "EXPELLIARMUS", hint: "⚡ Expel... arms?" },
    { q: "The spell that illuminates darkness. Cast it.", answer: "LUMOS", hint: "💡 Lumos = Light" },
  ];
  const CODE = "AEL";
  const [answers, setAnswers] = useState(["", "", ""]);
  const [checked, setChecked] = useState([false, false, false]);
  const [correct, setCorrect] = useState([false, false, false]);
  const [phase, setPhase] = useState("spells");
  const [codeInput, setCodeInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [wrong, setWrong] = useState(false);

  const checkSpell = (i) => {
    const c = [...checked]; c[i] = true; setChecked(c);
    const r = [...correct]; r[i] = answers[i].trim().toUpperCase() === spells[i].answer; setCorrect(r);
  };
  const allCorrect = correct.every(Boolean);

  const tryCode = () => {
    if (codeInput.toUpperCase() === CODE) { setUnlocked(true); }
    else { setWrong(true); setTimeout(() => setWrong(false), 600); setCodeInput(""); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at bottom, #0a0010, #050308)", paddingBottom: 40 }}>
      <Stars count={40} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", gap: 24, position: "relative", zIndex: 5 }}>
        <div style={{ fontSize: 52, animation: "wandPulse 2s infinite" }}>🔮</div>
        <h1 style={{ fontFamily: "'Cinzel Decorative'", color: "#d4af37", fontSize: "clamp(1.2rem,5vw,2rem)", letterSpacing: 3, textAlign: "center", animation: "goldGlow 2s infinite" }}>Unlock the Chamber</h1>
        <p style={{ color: "#8b6914", fontFamily: "'Cinzel'", fontSize: "0.75rem", letterSpacing: 4, textAlign: "center" }}>CAST THE THREE SPELLS TO REVEAL THE CODE</p>

        {phase === "spells" && (
          <div style={{ maxWidth: 580, width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
            {spells.map((sp, i) => (
              <div key={i} style={{ background: "linear-gradient(145deg,#1a1208,#0f0a04)", border: `1.5px solid ${correct[i] ? "#d4af37" : "#2a1e08"}`, borderRadius: 4, padding: "18px 20px" }} className="fiu">
                <p style={{ color: "#8b6914", fontFamily: "'Cinzel'", fontSize: "0.7rem", letterSpacing: 3, marginBottom: 6 }}>SPELL {i + 1}</p>
                <p style={{ color: "#c8b89a", fontFamily: "'Crimson Text'", fontSize: "1rem", lineHeight: 1.7, marginBottom: 12, fontStyle: "italic" }}>"{sp.q}"</p>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input
                    style={{ flex: 1, background: "rgba(0,0,0,0.4)", border: `1px solid ${checked[i] ? (correct[i] ? "#d4af37" : "#ff4444") : "#3a2a10"}`, color: "#f0e6c8", padding: "10px 14px", fontFamily: "'Cinzel'", fontSize: "0.85rem", letterSpacing: 2, outline: "none", borderRadius: 2 }}
                    value={answers[i]}
                    onChange={e => { const a = [...answers]; a[i] = e.target.value; setAnswers(a); }}
                    onKeyDown={e => e.key === "Enter" && checkSpell(i)}
                    placeholder="Cast your spell..."
                    disabled={correct[i]}
                  />
                  {!correct[i] && <HPBtn onClick={() => checkSpell(i)} style={{ padding: "10px 16px", fontSize: "0.75rem" }}>CAST</HPBtn>}
                  {correct[i] && <span style={{ fontSize: "1.4rem" }}>✨</span>}
                </div>
                {checked[i] && !correct[i] && <p style={{ color: "#8b5014", fontFamily: "'Crimson Text'", fontSize: "0.85rem", marginTop: 6, fontStyle: "italic" }}>Hint: {sp.hint}</p>}
                {correct[i] && <p style={{ color: "#d4af37", fontFamily: "'Cinzel'", fontSize: "0.7rem", letterSpacing: 2, marginTop: 6 }}>✦ Correct! First letter: {sp.answer[0]}</p>}
              </div>
            ))}
            {allCorrect && (
              <div style={{ textAlign: "center" }} className="fiu">
                <HPBtn onClick={() => setPhase("chamber")} style={{ background: "linear-gradient(135deg,#1a3a6b,#2a5a9b)", animation: "wandPulse 1.5s infinite" }}>
                  🗝️ Approach the Chamber →
                </HPBtn>
              </div>
            )}
          </div>
        )}

        {phase === "chamber" && !unlocked && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }} className="fi">
            <div style={{ width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(100,50,200,0.2), rgba(50,20,100,0.1))", border: "2px solid #4a2a8b", display: "flex", alignItems: "center", justifyContent: "center", animation: "crystalBall 3s ease-in-out infinite", boxShadow: "0 0 40px rgba(100,50,200,0.3)" }}>
              <span style={{ fontSize: 64 }}>🐍</span>
            </div>
            <p style={{ color: "#c8b89a", fontFamily: "'Crimson Text'", fontSize: "1rem", fontStyle: "italic", textAlign: "center" }}>The Chamber doors await. Enter the three-letter code formed by the first letters of each spell.</p>
            <div style={{ display: "flex", gap: 8 }}>
              {["A", "E", "L"].map((l, i) => (
                <div key={i} style={{ width: 48, height: 48, border: "1px solid #d4af37", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(212,175,55,0.05)", color: "#d4af37", fontFamily: "'Cinzel Decorative'", fontSize: "1.4rem" }}>{l}</div>
              ))}
            </div>
            <input
              style={{ width: 160, background: "rgba(0,0,0,0.5)", border: `1.5px solid ${wrong ? "#ff4444" : "#4a2a8b"}`, color: "#d4af37", padding: "12px 16px", fontFamily: "'Cinzel Decorative'", fontSize: "1.2rem", letterSpacing: 8, textAlign: "center", outline: "none", borderRadius: 4, animation: wrong ? "mapReveal .5s" : "none" }}
              value={codeInput}
              onChange={e => setCodeInput(e.target.value.toUpperCase().slice(0, 3))}
              onKeyDown={e => e.key === "Enter" && tryCode()}
              placeholder="_ _ _"
              maxLength={3}
            />
            <HPBtn onClick={tryCode} style={{ background: "linear-gradient(135deg,#4a1a8b,#6a2aab)" }}>🐍 OPEN CHAMBER</HPBtn>
            {wrong && <p style={{ color: "#ff4444", fontFamily: "'Cinzel'", fontSize: "0.8rem", letterSpacing: 2 }}>⚠ The serpent stirs... wrong code.</p>}
          </div>
        )}

        {unlocked && (
          <div style={{ maxWidth: 520, textAlign: "center" }} className="fi">
            <Confetti />
            <div style={{ fontSize: 60, marginBottom: 12 }}>🎊</div>
            <h2 style={{ fontFamily: "'Cinzel Decorative'", color: "#d4af37", fontSize: "1.5rem", letterSpacing: 3, animation: "goldGlow 1.5s infinite" }}>Chamber Unlocked!</h2>
            <div style={{ background: "linear-gradient(145deg,#1a1208,#0f0a04)", border: "1px solid #d4af37", borderRadius: 4, padding: 24, marginTop: 20 }}>
              <p style={{ color: "#c8b89a", fontFamily: "'Crimson Text'", fontSize: "1.05rem", lineHeight: 1.9 }}>
                Deep in the Chamber, etched in parseltongue on the walls:<br /><br />
                <em style={{ color: "#d4af37" }}>"The brightest witch of her age<br />cannot be contained by any spell.<br />Happy Birthday, Amritha. ⚡"</em>
              </p>
            </div>
            <HPBtn onClick={onNext} style={{ marginTop: 20, background: "linear-gradient(135deg,#1a3a6b,#2a5a9b)" }}>
              Next Chapter →
            </HPBtn>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STAGE 3 — MINISTRY OF MAGIC DOSSIER
══════════════════════════════════════════════════════════ */
function Stage3({ onNext }) {
  const [revealed, setRevealed] = useState(false);
  const [stamp, setStamp] = useState(false);

  const handleReveal = () => { setRevealed(true); setTimeout(() => setStamp(true), 800); };

  const evidence = [
    { tag: "EXHIBIT I", icon: "⚡", label: "MAGICAL SIGNATURE", text: "Unique lightning-bolt pattern detected. Classification: Extremely Powerful. Matches no known witch — entirely original." },
    { tag: "EXHIBIT II", icon: "📚", label: "LIBRARY RECORD", text: "Books borrowed: 847. Books finished: 847. Annotation quality: Outstanding. Threat level to Dark Arts: Maximum." },
    { tag: "EXHIBIT III", icon: "🔍", label: "DETECTIVE ASSESSMENT", text: "Natural deduction ability exceeds 94th percentile of Aurors. Solved 3 cold cases before finishing tea." },
    { tag: "EXHIBIT IV", icon: "🎂", label: "ITEM #2503", text: "One birthday cake enchanted with exactly 1 year of adventures, laughter, and magic. Confiscated from Time itself." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top, #0a0008, #050308)", paddingBottom: 40 }}>
      <Stars count={40} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", gap: 20, position: "relative", zIndex: 5 }}>
        {!revealed ? (
          <div style={{ textAlign: "center", maxWidth: 480, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }} className="fi">
            <div style={{ background: "linear-gradient(145deg,#1a1208,#120d04)", border: "2px solid #8b6914", borderRadius: 4, overflow: "hidden", width: "100%" }}>
              <div style={{ background: "#8b1a1a", padding: "10px 20px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#f0e6c8", fontFamily: "'Cinzel'", fontSize: "0.7rem", letterSpacing: 3 }}>MINISTRY OF MAGIC</span>
                <span style={{ color: "#f0e6c8", fontFamily: "'Cinzel'", fontSize: "0.7rem", letterSpacing: 3 }}>CLASSIFIED</span>
              </div>
              <div style={{ padding: "32px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 52, marginBottom: 12 }}>🏛️</div>
                <div style={{ display: "inline-block", border: "2px solid #8b0000", color: "#8b0000", padding: "6px 20px", fontFamily: "'Cinzel'", fontSize: "0.9rem", letterSpacing: 4, transform: "rotate(-8deg)", marginBottom: 16 }}>CLASSIFIED</div>
                <h2 style={{ fontFamily: "'Cinzel Decorative'", color: "#d4af37", fontSize: "1.2rem", letterSpacing: 4, marginBottom: 6 }}>SUBJECT DOSSIER</h2>
                <p style={{ color: "#4a3a20", fontFamily: "'Cinzel'", fontSize: "0.7rem", letterSpacing: 3, marginBottom: 20 }}>FILE REF: AMR-2503 · EYES ONLY</p>
                {[1, 2, 3].map(i => <div key={i} style={{ height: 12, background: "#1a1208", borderRadius: 2, margin: "8px 0" }} />)}
                <HPBtn onClick={handleReveal} style={{ marginTop: 20 }}>🔓 Accio — Reveal File</HPBtn>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: 680, width: "100%" }} className="fi">
            <div style={{ background: "linear-gradient(145deg,#1a1208,#0f0a04)", border: "2px solid #8b6914", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ background: "#8b1a1a", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#f0e6c8", fontFamily: "'Cinzel'", fontSize: "0.7rem", letterSpacing: 3 }}>MINISTRY OF MAGIC — AUROR DIVISION</span>
                <span style={{ color: "#f0e6c8", fontFamily: "'Cinzel'", fontSize: "0.7rem", letterSpacing: 3 }}>CASE #2503</span>
              </div>
              <div style={{ padding: "24px 20px" }}>
                {stamp && (
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <span style={{ display: "inline-block", border: "3px solid #d4af37", color: "#d4af37", padding: "6px 24px", fontFamily: "'Cinzel'", fontSize: "1rem", letterSpacing: 4, animation: "stampIn 0.5s ease forwards", transformOrigin: "center" }}>DECLASSIFIED ⚡</span>
                  </div>
                )}
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
                  <div style={{ fontSize: 72, lineHeight: 1, flexShrink: 0, background: "rgba(255,255,255,0.02)", border: "1px solid #2a1e08", padding: 12, borderRadius: 4 }}>🧙‍♀️</div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
                    {[["SUBJECT", "AMRITHA"], ["STATUS", "MOST DANGEROUS (to boredom)"], ["HOUSE", "All four claimed her — she chose herself"], ["DOB", "25th March · Classified"], ["THREAT LEVEL", "⚡⚡⚡⚡⚡ — EXTRAORDINARY"]].map(([k, v], i) => (
                      <div key={i} style={{ display: "flex", gap: 12, borderBottom: "1px solid #1a1208", paddingBottom: 6 }}>
                        <span style={{ color: "#8b6914", fontFamily: "'Cinzel'", fontSize: "0.7rem", letterSpacing: 2, minWidth: 100 }}>{k}</span>
                        <span style={{ color: "#c8b89a", fontFamily: "'Crimson Text'", fontSize: "0.9rem" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <h3 style={{ color: "#8b6914", fontFamily: "'Cinzel'", fontSize: "0.75rem", letterSpacing: 4, marginBottom: 14, textAlign: "center" }}>EVIDENCE COLLECTED</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 10, marginBottom: 20 }}>
                  {evidence.map((e, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #2a1e08", padding: 14, borderRadius: 2, textAlign: "center" }} className="fiu">
                      <p style={{ color: "#8b0000", fontFamily: "'Cinzel'", fontSize: "0.6rem", letterSpacing: 2, marginBottom: 6 }}>{e.tag}</p>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>{e.icon}</div>
                      <p style={{ color: "#d4af37", fontFamily: "'Cinzel'", fontSize: "0.65rem", letterSpacing: 2, marginBottom: 6 }}>{e.label}</p>
                      <p style={{ color: "#a89070", fontFamily: "'Crimson Text'", fontSize: "0.82rem", lineHeight: 1.6, fontStyle: "italic" }}>{e.text}</p>
                    </div>
                  ))}
                </div>
                <div style={{ background: "rgba(212,175,55,0.05)", border: "1px solid #8b691444", borderRadius: 4, padding: 20, textAlign: "center", marginBottom: 16 }}>
                  <p style={{ color: "#c8b89a", fontFamily: "'Crimson Text'", fontSize: "1rem", lineHeight: 2 }}>
                    🏛️ <strong style={{ color: "#d4af37" }}>OFFICIAL MINISTRY VERDICT:</strong><br />
                    <em>"Amritha is hereby found guilty of being extraordinarily brilliant, dangerously kind, and permanently magical. Sentenced to: a lifetime of adventures beyond imagination."</em>
                  </p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <HPBtn onClick={onNext} style={{ background: "linear-gradient(135deg,#1a3a6b,#2a5a9b)" }}>Next Chapter →</HPBtn>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STAGE 4 — THE MARAUDER'S MAP
══════════════════════════════════════════════════════════ */
function Stage4({ onNext }) {
  const [clue, setClue] = useState(0);
  const [showFinal, setShowFinal] = useState(false);

  const clues = [
    { loc: "Gryffindor Common Room", icon: "🦁", mapNote: "I solemnly swear I am up to no good.", text: "Every great story begins by the fire, surrounded by warmth, laughter, and those who feel like home. Your story started the same way — with a heart brave enough to feel everything deeply. Follow the next clue...", btn: "To the Astronomy Tower →" },
    { loc: "Astronomy Tower", icon: "🌙", mapNote: "The stars remember your name.", text: "From this tower, she saw the whole world laid out beneath her — the way you see every story, every mystery, every person. You've always had that gift: seeing what others miss. The map leads onward...", btn: "To the Library →" },
    { loc: "Hogwarts Library", icon: "📚", mapNote: "Restricted section: contains truths.", text: "You've lived in books the way others live in houses — completely, joyfully, without reservation. Every story you've read has made you more you. One more clue remains...", btn: "To the Great Hall →" },
    { loc: "The Great Hall", icon: "✨", mapNote: "Mischief Managed.", text: "The candles are lit. The ceiling shows your stars. Everyone who loves you is gathered here, even if not in person. This is where your story is celebrated. You've arrived, witch. You've always arrived.", btn: "🎂 Reveal the Final Surprise →" },
  ];

  const current = clues[clue];

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at center, #0a0608, #050308)", paddingBottom: 40 }}>
      <Stars count={60} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", gap: 20, position: "relative", zIndex: 5 }}>
        {!showFinal ? (
          <div style={{ maxWidth: 560, width: "100%" }} key={clue} className="fi">
            {/* Parchment map */}
            <div style={{ background: "linear-gradient(145deg,#2a1e08,#1e1408,#2a1e08)", border: "2px solid #8b6914", borderRadius: 4, padding: "28px 24px", position: "relative", boxShadow: "0 8px 32px rgba(0,0,0,0.6), inset 0 0 30px rgba(139,105,20,0.1)" }}>
              {/* Map header */}
              <div style={{ textAlign: "center", marginBottom: 20, borderBottom: "1px solid #8b691433", paddingBottom: 16 }}>
                <p style={{ color: "#8b6914", fontFamily: "'Cinzel'", fontSize: "0.65rem", letterSpacing: 4 }}>THE MARAUDER'S MAP</p>
                <p style={{ color: "#d4af37", fontFamily: "'Crimson Text'", fontSize: "0.85rem", fontStyle: "italic", marginTop: 4 }}>"{current.mapNote}"</p>
              </div>
              {/* Progress dots */}
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
                {clues.map((_, i) => (
                  <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: i <= clue ? "#d4af37" : "#2a1e08", border: "1px solid #8b6914", transition: "background 0.3s" }} />
                ))}
              </div>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 52, animation: "wandPulse 2s infinite", marginBottom: 8 }}>{current.icon}</div>
                <p style={{ color: "#8b6914", fontFamily: "'Cinzel'", fontSize: "0.7rem", letterSpacing: 4 }}>CLUE {clue + 1} · {current.loc.toUpperCase()}</p>
              </div>
              <p style={{ color: "#c8b89a", fontFamily: "'Crimson Text'", fontSize: "1.05rem", lineHeight: 1.9, fontStyle: "italic", background: "rgba(0,0,0,0.2)", padding: "16px 18px", borderLeft: "2px solid #8b691466", borderRadius: "0 4px 4px 0", marginBottom: 20 }}>{current.text}</p>
              {/* Footprints decoration */}
              <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 16, opacity: 0.4 }}>
                {["👣", "👣", "👣"].map((e, i) => <span key={i} style={{ fontSize: "0.8rem" }}>{e}</span>)}
              </div>
              <div style={{ textAlign: "center" }}>
                <HPBtn onClick={() => { if (clue < clues.length - 1) setClue(c => c + 1); else setShowFinal(true); }}>
                  {current.btn}
                </HPBtn>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: 560, width: "100%", textAlign: "center" }} className="fi">
            <Confetti />
            <div style={{ fontSize: 72, animation: "sortingHatBob 2s infinite", marginBottom: 12 }}>🧙‍♀️</div>
            <h1 style={{ fontFamily: "'Cinzel Decorative'", color: "#d4af37", fontSize: "clamp(1.5rem,6vw,2.5rem)", letterSpacing: 4, animation: "goldGlow 1.5s infinite", marginBottom: 8 }}>Mischief Managed!</h1>
            <div style={{ background: "linear-gradient(145deg,#1a1208,#0f0a04)", border: "1px solid #d4af37", borderRadius: 4, padding: "28px 22px", marginTop: 16, marginBottom: 20 }}>
              <p style={{ color: "#d4af37", fontFamily: "'Cinzel Decorative'", fontSize: "1.1rem", letterSpacing: 2, marginBottom: 16 }}>🎂 Happy Birthday, Amritha! 🎂</p>
              <p style={{ color: "#c8b89a", fontFamily: "'Crimson Text'", fontSize: "1.05rem", lineHeight: 2 }}>
                You've followed every clue through the castle,<br />
                solved every mystery, cast every spell.<br /><br />
                <em style={{ color: "#d4af37" }}>
                  "It does not do to dwell on dreams and forget to live.<br />
                  You, Amritha, have always known how to do both —<br />
                  dream wildly and live brilliantly. 💕"
                </em>
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16, fontSize: "1.5rem" }}>
                {["⚡", "🦁", "📚", "🦉", "✨", "🎂", "🪄", "💕"].map((e, i) => (
                  <span key={i} style={{ animation: `heartbeat 1s ${i * 0.12}s infinite` }}>{e}</span>
                ))}
              </div>
            </div>
            <HPBtn onClick={onNext} style={{ background: "linear-gradient(135deg,#4a1a8b,#6a2aab)", animation: "wandPulse 1.5s infinite" }}>
              🕵️ One Final Mystery Awaits... →
            </HPBtn>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ROOT SURPRISE CONTROLLER
══════════════════════════════════════════════════════════ */
export default function HogwartsSurprise() {
  const [stage, setStage] = useState(1);
  const [transitioning, setTransitioning] = useState(false);
  const [fromStage, setFromStage] = useState(1);

  const next = () => { setFromStage(stage); setTransitioning(true); };
  const afterTransition = () => { setStage(s => s + 1); setTransitioning(false); };

  return (
    <>
      <style>{HP_CSS}</style>
      {transitioning && <HPTransition from={fromStage} onDone={afterTransition} />}
      {!transitioning && stage === 1 && <Stage1 onNext={next} />}
      {!transitioning && stage === 2 && <Stage2 onNext={next} />}
      {!transitioning && stage === 3 && <Stage3 onNext={next} />}
      {!transitioning && stage === 4 && <Stage4 onNext={next} />}
      {!transitioning && stage === 5 && <HogwartsMystery />}
    </>
  );
}
