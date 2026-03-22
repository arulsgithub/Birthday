import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Courier+Prime:wght@400;700&family=Creepster&family=Oswald:wght@300;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { width: 100%; min-height: 100vh; background: #0a0a0a; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #111; }
  ::-webkit-scrollbar-thumb { background: #b8860b; border-radius: 3px; }

  @keyframes flicker {
    0%,19%,21%,23%,25%,54%,56%,100% { opacity:1; }
    20%,24%,55% { opacity:0.4; }
  }
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes fadeInUp {
    from { opacity:0; transform:translateY(30px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity:0; } to { opacity:1; }
  }
  @keyframes typewriter {
    from { width:0; } to { width:100%; }
  }
  @keyframes blink {
    0%,100% { border-color: transparent; }
    50% { border-color: #b8860b; }
  }
  @keyframes shake {
    0%,100% { transform:translateX(0); }
    20% { transform:translateX(-8px); }
    40% { transform:translateX(8px); }
    60% { transform:translateX(-5px); }
    80% { transform:translateX(5px); }
  }
  @keyframes stamp {
    0%   { transform:scale(3) rotate(-15deg); opacity:0; }
    60%  { transform:scale(0.95) rotate(-15deg); opacity:1; }
    80%  { transform:scale(1.05) rotate(-15deg); }
    100% { transform:scale(1) rotate(-15deg); opacity:1; }
  }
  @keyframes pulse {
    0%,100% { box-shadow: 0 0 10px #b8860b44; }
    50%      { box-shadow: 0 0 30px #b8860baa, 0 0 60px #b8860b44; }
  }
  @keyframes safeShake {
    0%,100% { transform:rotate(0deg); }
    25% { transform:rotate(-3deg); }
    75% { transform:rotate(3deg); }
  }
  @keyframes dialRotate {
    from { transform:rotate(0deg); }
    to   { transform:rotate(360deg); }
  }
  @keyframes confettiFall {
    0%   { transform:translateY(-20px) rotate(0deg); opacity:1; }
    100% { transform:translateY(100vh) rotate(720deg); opacity:0; }
  }
  @keyframes glitch {
    0%,100% { text-shadow: 2px 0 #ff0040, -2px 0 #00ffff; }
    25%      { text-shadow: -2px 0 #ff0040, 2px 0 #00ffff; }
    50%      { text-shadow: 2px 2px #ff0040, -2px -2px #00ffff; }
    75%      { text-shadow: 0 -2px #ff0040, 0 2px #00ffff; }
  }
  @keyframes mapReveal {
    from { clip-path: inset(0 100% 0 0); }
    to   { clip-path: inset(0 0% 0 0); }
  }
  @keyframes clueSlide {
    from { opacity:0; transform:translateX(-40px) rotate(-2deg); }
    to   { opacity:1; transform:translateX(0) rotate(-1deg); }
  }
  @keyframes heartBeat {
    0%,100% { transform:scale(1); }
    14%     { transform:scale(1.1); }
    28%     { transform:scale(1); }
    42%     { transform:scale(1.1); }
    70%     { transform:scale(1); }
  }
  @keyframes starPop {
    0%   { transform:scale(0) rotate(0deg); opacity:0; }
    60%  { transform:scale(1.3) rotate(180deg); opacity:1; }
    100% { transform:scale(1) rotate(360deg); opacity:1; }
  }
  .flicker { animation: flicker 3s infinite; }
  .fadeInUp { animation: fadeInUp 0.7s ease forwards; }
  .fadeIn   { animation: fadeIn 0.6s ease forwards; }
  .glitch-text { animation: glitch 0.5s infinite; }
  .pulse-border { animation: pulse 2s infinite; }
`;

/* ─────────────────────────────────────────────
   SCANLINE OVERLAY
───────────────────────────────────────────── */
function Scanline() {
  return (
    <div style={{
      position:"fixed",inset:0,pointerEvents:"none",zIndex:999,overflow:"hidden",
    }}>
      <div style={{
        position:"absolute",top:0,left:0,right:0,height:"2px",
        background:"rgba(184,134,11,0.08)",
        animation:"scanline 4s linear infinite",
      }}/>
      <div style={{
        position:"absolute",inset:0,
        background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)",
        pointerEvents:"none",
      }}/>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CONFETTI
───────────────────────────────────────────── */
function Confetti() {
  const pieces = Array.from({length:60},(_,i)=>({
    id:i,
    left:`${Math.random()*100}%`,
    color:["#ff6ec4","#ffcc00","#00ffcc","#ff4466","#b8860b","#ff94de"][i%6],
    size:`${6+Math.random()*8}px`,
    delay:`${Math.random()*2}s`,
    dur:`${2+Math.random()*2}s`,
    shape: i%3===0?"50%":"2px",
  }));
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:998}}>
      {pieces.map(p=>(
        <div key={p.id} style={{
          position:"absolute",top:"-20px",left:p.left,
          width:p.size,height:p.size,
          background:p.color,borderRadius:p.shape,
          animation:`confettiFall ${p.dur} ${p.delay} ease-in forwards`,
        }}/>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   TYPEWRITER HOOK
───────────────────────────────────────────── */
function useTypewriter(text, speed=35, start=true) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(()=>{
    if(!start){setDisplayed("");setDone(false);return;}
    setDisplayed("");setDone(false);
    let i=0;
    const iv = setInterval(()=>{
      if(i<text.length){ setDisplayed(text.slice(0,i+1)); i++; }
      else { setDone(true); clearInterval(iv); }
    },speed);
    return ()=>clearInterval(iv);
  },[text,speed,start]);
  return {displayed,done};
}

/* ─────────────────────────────────────────────
   STAGE 1 — MURDER MYSTERY
───────────────────────────────────────────── */
function Stage1({ onNext }) {
  const [step, setStep] = useState(0);
  const [revealSuspect, setRevealSuspect] = useState(null);
  const [solved, setSolved] = useState(false);

  const intro = "CLASSIFIED CASE FILE #2503\nVictim: A Missing Birthday Girl\nLast seen: March 25th, the eve of her special day...";
  const { displayed, done } = useTypewriter(intro, 30, step===1);

  const suspects = [
    { id:0, name:"The Cake", emoji:"🎂", alibi:"Was seen melting suspiciously at midnight.", verdict:"INNOCENT" },
    { id:1, name:"The Balloons", emoji:"🎈", alibi:"Found floating near the crime scene. Very suspicious.", verdict:"INNOCENT" },
    { id:2, name:"Time Itself", emoji:"⏰", alibi:"Was caught stealing her youth... but returned it as wisdom.", verdict:"GUILTY ❤️" },
  ];

  return (
    <div style={s1.root}>
      <style>{GLOBAL_CSS}</style>
      <Scanline/>

      {step===0 && (
        <div style={s1.intro} className="fadeIn">
          <div style={s1.badge}>🔍</div>
          <h1 style={s1.title} className="flicker">DETECTIVE AGENCY</h1>
          <p style={s1.sub}>Special Crimes Division</p>
          <p style={s1.caseNum}>CASE NO. 2503 — OPERATION: AMRITHA</p>
          <div style={s1.divider}/>
          <p style={s1.body}>A new case has landed on your desk, Detective.<br/>Only YOU can solve it.</p>
          <button style={s1.btn} onClick={()=>setStep(1)}>OPEN CASE FILE →</button>
        </div>
      )}

      {step===1 && (
        <div style={s1.caseFile} className="fadeIn">
          <div style={s1.fileHeader}>
            <span style={s1.stamp}>⛔ TOP SECRET</span>
            <h2 style={s1.fileTitle}>INCIDENT REPORT</h2>
          </div>
          <pre style={s1.typeText}>{displayed}<span style={{borderRight:"2px solid #b8860b",animation:"blink 0.8s infinite"}}> </span></pre>
          {done && (
            <div style={{marginTop:24}} className="fadeInUp">
              <p style={s1.body}>Three suspects have been identified. Interrogate them all.</p>
              <button style={s1.btn} onClick={()=>setStep(2)}>BEGIN INTERROGATION →</button>
            </div>
          )}
        </div>
      )}

      {step===2 && (
        <div style={s1.interrogation} className="fadeIn">
          <h2 style={s1.fileTitle}>SUSPECT BOARD</h2>
          <p style={{...s1.body,marginBottom:24}}>Tap each suspect to interrogate</p>
          <div style={s1.suspectGrid}>
            {suspects.map(sus=>(
              <div key={sus.id} style={{
                ...s1.suspectCard,
                border: revealSuspect===sus.id ? "2px solid #b8860b" : "1px solid #333",
              }} onClick={()=>setRevealSuspect(sus.id)}>
                <div style={{fontSize:48}}>{sus.emoji}</div>
                <div style={s1.suspectName}>{sus.name}</div>
                {revealSuspect===sus.id && (
                  <div className="fadeIn">
                    <p style={s1.alibi}>"{sus.alibi}"</p>
                    <div style={{
                      ...s1.verdict,
                      color: sus.verdict.includes("GUILTY") ? "#ff6ec4" : "#00cc88",
                    }}>{sus.verdict}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {revealSuspect===2 && !solved && (
            <button style={{...s1.btn,marginTop:32,animation:"pulse 1s infinite"}} className="fadeInUp"
              onClick={()=>setSolved(true)}>CASE SOLVED! REVEAL FINDING →</button>
          )}
          {solved && (
            <div style={s1.solvedBox} className="fadeInUp">
              <p style={s1.solvedText}>🎉 CASE CLOSED 🎉</p>
              <p style={{...s1.body,color:"#ffcc88",marginTop:12}}>
                Time stole Amritha away for 365 days...<br/>
                and brought her back wiser, stronger, and ready for a new chapter.
              </p>
              <button style={{...s1.btn,marginTop:20,background:"linear-gradient(135deg,#b8860b,#ffcc00)"}}
                onClick={onNext}>PROCEED TO NEXT CHALLENGE →</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const s1 = {
  root:{ minHeight:"100vh",background:"radial-gradient(ellipse at top,#1a1200 0%,#0a0a0a 70%)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Special Elite',serif",position:"relative" },
  intro:{ textAlign:"center",maxWidth:540,width:"100%" },
  badge:{ fontSize:64,marginBottom:16,filter:"drop-shadow(0 0 20px #b8860b)" },
  title:{ fontSize:"clamp(2rem,8vw,3.5rem)",color:"#b8860b",letterSpacing:8,textTransform:"uppercase",textShadow:"0 0 30px #b8860b88" },
  sub:{ color:"#666",fontSize:"0.9rem",letterSpacing:4,marginTop:4 },
  caseNum:{ color:"#b8860b88",fontSize:"0.8rem",letterSpacing:3,marginTop:16,border:"1px solid #b8860b44",padding:"6px 16px",display:"inline-block" },
  divider:{ width:80,height:1,background:"#b8860b44",margin:"24px auto" },
  body:{ color:"#aaa",fontSize:"1rem",lineHeight:1.8,fontFamily:"'Courier Prime',monospace" },
  btn:{ marginTop:24,padding:"14px 36px",background:"transparent",border:"1.5px solid #b8860b",color:"#b8860b",fontSize:"0.9rem",letterSpacing:3,cursor:"pointer",fontFamily:"'Courier Prime',monospace",transition:"all 0.3s",borderRadius:2 },
  caseFile:{ maxWidth:600,width:"100%",background:"rgba(20,15,0,0.9)",border:"1px solid #b8860b44",padding:32,borderRadius:4 },
  fileHeader:{ display:"flex",alignItems:"center",gap:16,marginBottom:24 },
  stamp:{ background:"#8b0000",color:"#fff",padding:"4px 12px",fontSize:"0.7rem",letterSpacing:2,fontFamily:"'Courier Prime',monospace",transform:"rotate(-3deg)",display:"inline-block" },
  fileTitle:{ color:"#b8860b",fontSize:"1.3rem",letterSpacing:4 },
  typeText:{ color:"#ccb88a",fontFamily:"'Courier Prime',monospace",fontSize:"0.95rem",lineHeight:1.9,whiteSpace:"pre-wrap",minHeight:100 },
  interrogation:{ maxWidth:680,width:"100%",textAlign:"center" },
  suspectGrid:{ display:"flex",gap:16,flexWrap:"wrap",justifyContent:"center" },
  suspectCard:{ background:"rgba(20,15,0,0.9)",padding:24,borderRadius:4,cursor:"pointer",transition:"all 0.3s",flex:"1 1 160px",maxWidth:200,minHeight:140 },
  suspectName:{ color:"#b8860b",marginTop:8,fontFamily:"'Courier Prime',monospace",fontSize:"0.9rem",letterSpacing:2 },
  alibi:{ color:"#aaa",fontSize:"0.8rem",fontFamily:"'Courier Prime',monospace",lineHeight:1.6,marginTop:12,fontStyle:"italic" },
  verdict:{ marginTop:10,fontSize:"0.85rem",fontWeight:700,letterSpacing:2 },
  solvedBox:{ background:"rgba(184,134,11,0.08)",border:"1px solid #b8860b",padding:28,borderRadius:4,marginTop:8,textAlign:"center" },
  solvedText:{ color:"#ffcc00",fontSize:"1.5rem",letterSpacing:4 },
};

/* ─────────────────────────────────────────────
   STAGE 2 — CRACK THE CODE SAFE
───────────────────────────────────────────── */
function Stage2({ onNext }) {
  const riddles = [
    { q:"I have no doors but hold a secret inside. I grow sweeter each year. What am I?", a:"CAKE", hint:"🎂 Sweet & round" },
    { q:"The more you take, the more you leave behind. What am I?", a:"STEPS", hint:"👣 Think footprints" },
    { q:"Born once a year, celebrated by all. What am I?", a:"BIRTHDAY", hint:"🎉 Today's the day!" },
  ];
  const CODE = "253"; // 2→C, 5→A, 3→K... or just 3-digit combo from riddle order

  const [answers, setAnswers] = useState(["","",""]);
  const [checked, setChecked] = useState([false,false,false]);
  const [correct, setCorrect] = useState([false,false,false]);
  const [codeInput, setCodeInput] = useState("");
  const [safeOpen, setSafeOpen] = useState(false);
  const [wrongShake, setWrongShake] = useState(false);
  const [stage, setStage] = useState("riddles");

  const checkAnswer = (i) => {
    const c = [...checked]; c[i]=true; setChecked(c);
    const r = [...correct]; r[i]= answers[i].trim().toUpperCase()===riddles[i].a; setCorrect(r);
  };

  const allCorrect = correct.every(Boolean);

  const trySafe = () => {
    if(codeInput===CODE){ setSafeOpen(true); }
    else { setWrongShake(true); setTimeout(()=>setWrongShake(false),600); setCodeInput(""); }
  };

  return (
    <div style={s2.root}>
      <Scanline/>
      {stage==="riddles" && (
        <div style={s2.wrap} className="fadeIn">
          <h1 style={s2.title}>🔐 CRACK THE CODE</h1>
          <p style={s2.sub}>Solve all 3 riddles to get the safe combination</p>
          <div style={s2.riddleList}>
            {riddles.map((r,i)=>(
              <div key={i} style={{...s2.riddleCard, borderColor: correct[i]?"#00cc88":"#333"}} className="fadeInUp">
                <div style={s2.riddleNum}>RIDDLE {i+1}</div>
                <p style={s2.riddleQ}>"{r.q}"</p>
                <div style={s2.inputRow}>
                  <input
                    style={{...s2.input, borderColor: checked[i]?(correct[i]?"#00cc88":"#ff4444"):"#555"}}
                    value={answers[i]}
                    onChange={e=>{ const a=[...answers]; a[i]=e.target.value; setAnswers(a); }}
                    onKeyDown={e=>e.key==="Enter"&&checkAnswer(i)}
                    placeholder="Your answer..."
                    disabled={correct[i]}
                  />
                  {!correct[i] && <button style={s2.checkBtn} onClick={()=>checkAnswer(i)}>CHECK</button>}
                  {correct[i] && <span style={{color:"#00cc88",fontSize:"1.4rem"}}>✓</span>}
                </div>
                {checked[i]&&!correct[i]&&<p style={s2.hint}>Hint: {r.hint}</p>}
                {correct[i]&&<p style={{color:"#00cc88",fontSize:"0.8rem",marginTop:6,letterSpacing:2}}>CORRECT! Code digit: {i+1}→ {i===0?"2":i===1?"5":"3"}</p>}
              </div>
            ))}
          </div>
          {allCorrect && (
            <button style={{...s2.nextBtn}} className="fadeInUp" onClick={()=>setStage("safe")}>
              OPEN THE SAFE →
            </button>
          )}
        </div>
      )}

      {stage==="safe" && !safeOpen && (
        <div style={s2.safeWrap} className="fadeIn">
          <h2 style={s2.title}>YOU HAVE THE CODE</h2>
          <p style={s2.sub}>Enter the 3-digit combination</p>
          <div style={{
            ...s2.safe,
            animation: wrongShake ? "safeShake 0.5s ease" : "pulse 2s infinite",
          }}>
            <div style={s2.safeDoor}>
              <div style={s2.dial}>🔄</div>
              <div style={s2.handle}/>
            </div>
            <div style={s2.codeDisplay}>{codeInput || "_ _ _"}</div>
            <div style={s2.numPad}>
              {[1,2,3,4,5,6,7,8,9,"⌫",0,"✓"].map((k,i)=>(
                <button key={i} style={s2.numKey} onClick={()=>{
                  if(k==="⌫") setCodeInput(p=>p.slice(0,-1));
                  else if(k==="✓") trySafe();
                  else if(codeInput.length<3) setCodeInput(p=>p+k);
                }}>{k}</button>
              ))}
            </div>
            {wrongShake && <p style={{color:"#ff4444",fontSize:"0.8rem",letterSpacing:2,marginTop:8}}>⚠ WRONG CODE. TRY AGAIN.</p>}
          </div>
        </div>
      )}

      {safeOpen && (
        <div style={s2.openSafe} className="fadeIn">
          <Confetti/>
          <div style={{fontSize:80}}>🎊</div>
          <h2 style={{...s2.title,color:"#ffcc00"}}>SAFE OPENED!</h2>
          <div style={s2.noteInside}>
            <p style={s2.noteText}>
              Inside the safe...<br/>you find a single golden note:<br/><br/>
              <em style={{color:"#ffcc88",fontSize:"1.1rem"}}>"The real treasure was never gold —<br/>it was every mystery you solved,<br/>every story you lived.<br/>Happy Birthday, Amritha 💛"</em>
            </p>
          </div>
          <button style={{...s2.nextBtn,marginTop:24}} onClick={onNext}>NEXT MISSION →</button>
        </div>
      )}
    </div>
  );
}

const s2 = {
  root:{ minHeight:"100vh",background:"radial-gradient(ellipse at bottom,#001a1a 0%,#0a0a0a 70%)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Courier Prime',monospace" },
  wrap:{ maxWidth:640,width:"100%",textAlign:"center" },
  title:{ fontSize:"clamp(1.6rem,6vw,2.5rem)",color:"#00cccc",letterSpacing:4,textShadow:"0 0 20px #00cccc88",marginBottom:8 },
  sub:{ color:"#668888",fontSize:"0.9rem",letterSpacing:2,marginBottom:32 },
  riddleList:{ display:"flex",flexDirection:"column",gap:16,textAlign:"left" },
  riddleCard:{ background:"rgba(0,20,20,0.9)",border:"1px solid #333",padding:20,borderRadius:4,transition:"border-color 0.3s" },
  riddleNum:{ color:"#00cccc88",fontSize:"0.7rem",letterSpacing:4,marginBottom:8 },
  riddleQ:{ color:"#ccc",fontSize:"0.95rem",lineHeight:1.7,marginBottom:12,fontStyle:"italic" },
  inputRow:{ display:"flex",gap:10,alignItems:"center" },
  input:{ flex:1,background:"rgba(0,0,0,0.6)",border:"1px solid #555",color:"#fff",padding:"10px 14px",fontFamily:"'Courier Prime',monospace",fontSize:"0.9rem",borderRadius:2,outline:"none",letterSpacing:2 },
  checkBtn:{ padding:"10px 18px",background:"transparent",border:"1px solid #00cccc",color:"#00cccc",cursor:"pointer",fontFamily:"'Courier Prime',monospace",fontSize:"0.75rem",letterSpacing:2,borderRadius:2 },
  hint:{ color:"#888",fontSize:"0.8rem",marginTop:6,letterSpacing:1 },
  nextBtn:{ marginTop:32,padding:"14px 40px",background:"linear-gradient(135deg,#00cccc,#006666)",border:"none",color:"#fff",fontSize:"0.9rem",letterSpacing:3,cursor:"pointer",fontFamily:"'Courier Prime',monospace",borderRadius:2 },
  safeWrap:{ textAlign:"center",maxWidth:400,width:"100%" },
  safe:{ background:"linear-gradient(145deg,#1a1a1a,#2a2a2a)",border:"3px solid #444",borderRadius:8,padding:32,margin:"24px auto",maxWidth:320,boxShadow:"inset 0 0 30px rgba(0,0,0,0.8),0 0 40px rgba(0,204,204,0.1)" },
  safeDoor:{ display:"flex",justifyContent:"center",alignItems:"center",gap:20,marginBottom:20 },
  dial:{ fontSize:48,animation:"dialRotate 4s linear infinite" },
  handle:{ width:16,height:48,background:"linear-gradient(#888,#444)",borderRadius:8 },
  codeDisplay:{ fontSize:"2rem",color:"#00cccc",letterSpacing:16,fontFamily:"'Courier Prime',monospace",marginBottom:20,minHeight:48,textShadow:"0 0 10px #00cccc" },
  numPad:{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8 },
  numKey:{ padding:"12px",background:"rgba(255,255,255,0.05)",border:"1px solid #333",color:"#ccc",fontSize:"1rem",cursor:"pointer",fontFamily:"'Courier Prime',monospace",borderRadius:2,transition:"all 0.2s" },
  openSafe:{ textAlign:"center",maxWidth:500,width:"100%" },
  noteInside:{ background:"rgba(255,204,0,0.05)",border:"1px solid #b8860b",padding:28,borderRadius:4,marginTop:20,textAlign:"center" },
  noteText:{ color:"#ccc",lineHeight:1.9,fontSize:"0.95rem" },
};

/* ─────────────────────────────────────────────
   STAGE 3 — FBI DOSSIER
───────────────────────────────────────────── */
function Stage3({ onNext }) {
  const [revealed, setRevealed] = useState(false);
  const [page, setPage] = useState(0);

  const evidence = [
    { label:"FINGERPRINT ANALYSIS", icon:"👆", text:"Unique pattern found. No match in database. Conclusion: One of a kind.", tag:"EXHIBIT A" },
    { label:"WITNESS STATEMENT", icon:"👁️", text:"'She was seen reading a thriller at 2am, solving the plot before chapter 10.' — Anonymous", tag:"EXHIBIT B" },
    { label:"PSYCHOLOGICAL PROFILE", icon:"🧠", text:"Exceptionally sharp mind. Natural problem solver. Dangerous levels of intelligence.", tag:"EXHIBIT C" },
    { label:"EVIDENCE: ITEM #2503", icon:"🎂", text:"One birthday cake, heavily frosted. Found at scene. Believed to contain exactly 1 year of magic.", tag:"EXHIBIT D" },
  ];

  return (
    <div style={s3.root}>
      <Scanline/>
      {!revealed ? (
        <div style={s3.center} className="fadeIn">
          <div style={s3.folder}>
            <div style={s3.folderTab}>FBI — CLASSIFIED</div>
            <div style={s3.folderBody}>
              <div style={s3.classifiedStamp}>CLASSIFIED</div>
              <div style={s3.fbiLogo}>🏛️</div>
              <h2 style={s3.dossierTitle}>SUBJECT DOSSIER</h2>
              <p style={s3.caseRef}>FILE REF: AMR-2503 • EYES ONLY</p>
              <div style={s3.redactedLine}/>
              <div style={s3.redactedLine} />
              <p style={s3.body}>This file contains sensitive information.<br/>Authorization required to proceed.</p>
              <button style={s3.btn} onClick={()=>setRevealed(true)}>
                🔓 AUTHORIZE ACCESS
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={s3.dossierOpen} className="fadeIn">
          <div style={s3.dossierHeader}>
            <span style={s3.fbiTag}>FEDERAL BUREAU OF INVESTIGATION</span>
            <h2 style={s3.dossierName}>AMRITHA</h2>
            <span style={s3.chargesTag}>CHARGES: Being Extraordinarily Awesome</span>
          </div>

          <div style={s3.profileSection}>
            <div style={s3.mugshot}>
              <div style={s3.mugshotInner}>👩‍💼</div>
              <div style={s3.mugshotLabel}>SUBJECT — DOB: 25 MARCH</div>
            </div>
            <div style={s3.bioBox}>
              {[
                ["STATUS","EXTREMELY DANGEROUS (to boredom)"],
                ["KNOWN FOR","Solving crimes before detectives do"],
                ["THREAT LEVEL","HIGH — will outsmart you"],
                ["BIRTHDAY","25th March — CLASSIFIED INTEL"],
              ].map(([k,v],i)=>(
                <div key={i} style={s3.bioRow}>
                  <span style={s3.bioKey}>{k}</span>
                  <span style={s3.bioVal}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={s3.evidenceSection}>
            <h3 style={s3.evidenceTitle}>EVIDENCE COLLECTED</h3>
            <div style={s3.evidenceGrid}>
              {evidence.map((e,i)=>(
                <div key={i} style={s3.evidenceCard} className="fadeInUp">
                  <div style={s3.evidenceTag}>{e.tag}</div>
                  <div style={{fontSize:32,margin:"8px 0"}}>{e.icon}</div>
                  <div style={s3.evidenceLabel}>{e.label}</div>
                  <p style={s3.evidenceText}>{e.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={s3.verdict}>
            <p style={s3.verdictText}>
              🏛️ OFFICIAL FBI VERDICT 🏛️<br/>
              <span style={{color:"#ff6ec4",fontStyle:"italic",fontSize:"1rem"}}>
                "After thorough investigation, the FBI concludes:<br/>
                Amritha is hereby found guilty of cracking every case,<br/>
                thinking sharper than anyone in the room, and making the world<br/>
                a more interesting place. Sentenced to: a lifetime of great adventures."
              </span>
            </p>
            <button style={s3.btn} onClick={onNext}>FINAL MISSION →</button>
          </div>
        </div>
      )}
    </div>
  );
}

const s3 = {
  root:{ minHeight:"100vh",background:"radial-gradient(ellipse at center,#0a0014 0%,#050008 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Oswald',sans-serif",overflowY:"auto" },
  center:{ textAlign:"center",maxWidth:480,width:"100%" },
  folder:{ background:"#1a1200",border:"2px solid #b8860b",borderRadius:4,overflow:"hidden",maxWidth:440,margin:"0 auto" },
  folderTab:{ background:"#b8860b",color:"#000",padding:"8px 20px",fontSize:"0.75rem",letterSpacing:4,fontFamily:"'Courier Prime',monospace" },
  folderBody:{ padding:40,textAlign:"center" },
  classifiedStamp:{ display:"inline-block",border:"3px solid #8b0000",color:"#8b0000",padding:"6px 20px",fontSize:"1.2rem",letterSpacing:6,transform:"rotate(-8deg)",marginBottom:16,fontWeight:700 },
  fbiLogo:{ fontSize:48,marginBottom:16,filter:"drop-shadow(0 0 10px #b8860b)" },
  dossierTitle:{ color:"#b8860b",fontSize:"1.4rem",letterSpacing:6,marginBottom:4 },
  caseRef:{ color:"#666",fontSize:"0.75rem",letterSpacing:3,marginBottom:20,fontFamily:"'Courier Prime',monospace" },
  redactedLine:{ height:14,background:"#111",margin:"8px 0",borderRadius:2 },
  body:{ color:"#888",fontSize:"0.9rem",lineHeight:1.7,margin:"20px 0",fontFamily:"'Courier Prime',monospace" },
  btn:{ padding:"14px 36px",background:"transparent",border:"1.5px solid #b8860b",color:"#b8860b",fontSize:"0.85rem",letterSpacing:3,cursor:"pointer",fontFamily:"'Courier Prime',monospace",borderRadius:2,marginTop:8 },
  dossierOpen:{ maxWidth:680,width:"100%",paddingBottom:40 },
  dossierHeader:{ textAlign:"center",padding:"24px 0 16px",borderBottom:"1px solid #b8860b44" },
  fbiTag:{ color:"#b8860b88",fontSize:"0.7rem",letterSpacing:4 },
  dossierName:{ color:"#fff",fontSize:"clamp(2rem,8vw,3rem)",letterSpacing:8,textShadow:"0 0 20px #b8860b44",margin:"8px 0" },
  chargesTag:{ display:"inline-block",background:"rgba(139,0,0,0.3)",border:"1px solid #8b0000",color:"#ff8888",padding:"4px 16px",fontSize:"0.75rem",letterSpacing:2,fontFamily:"'Courier Prime',monospace" },
  profileSection:{ display:"flex",gap:20,padding:"24px 0",flexWrap:"wrap" },
  mugshot:{ flex:"0 0 140px",textAlign:"center" },
  mugshotInner:{ fontSize:80,background:"rgba(255,255,255,0.03)",border:"1px solid #333",padding:16,display:"block" },
  mugshotLabel:{ color:"#555",fontSize:"0.65rem",letterSpacing:2,marginTop:8,fontFamily:"'Courier Prime',monospace" },
  bioBox:{ flex:1,display:"flex",flexDirection:"column",gap:10,justifyContent:"center" },
  bioRow:{ display:"flex",gap:12,borderBottom:"1px solid #1a1a1a",paddingBottom:8 },
  bioKey:{ color:"#b8860b",fontSize:"0.75rem",letterSpacing:2,minWidth:100,fontFamily:"'Courier Prime',monospace" },
  bioVal:{ color:"#ccc",fontSize:"0.85rem",fontFamily:"'Courier Prime',monospace" },
  evidenceSection:{ borderTop:"1px solid #222",paddingTop:24 },
  evidenceTitle:{ color:"#b8860b",fontSize:"0.85rem",letterSpacing:4,marginBottom:16 },
  evidenceGrid:{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12 },
  evidenceCard:{ background:"rgba(255,255,255,0.02)",border:"1px solid #222",padding:16,borderRadius:2,textAlign:"center" },
  evidenceTag:{ color:"#8b0000",fontSize:"0.65rem",letterSpacing:2,fontFamily:"'Courier Prime',monospace" },
  evidenceLabel:{ color:"#b8860b",fontSize:"0.75rem",letterSpacing:2,margin:"8px 0 4px",fontFamily:"'Courier Prime',monospace" },
  evidenceText:{ color:"#888",fontSize:"0.8rem",lineHeight:1.6,fontFamily:"'Courier Prime',monospace",fontStyle:"italic" },
  verdict:{ marginTop:28,background:"rgba(184,134,11,0.05)",border:"1px solid #b8860b44",padding:28,borderRadius:4,textAlign:"center" },
  verdictText:{ color:"#ccc",fontSize:"0.9rem",lineHeight:2,fontFamily:"'Courier Prime',monospace",marginBottom:20 },
};

/* ─────────────────────────────────────────────
   STAGE 4 — TREASURE HUNT
───────────────────────────────────────────── */
function Stage4({ onNext }) {
  const [clue, setClue] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [stars, setStars] = useState([]);

  useEffect(()=>{
    setStars(Array.from({length:30},(_,i)=>({
      id:i, left:`${Math.random()*100}%`, top:`${Math.random()*100}%`,
      delay:`${Math.random()*3}s`, size:`${4+Math.random()*6}px`,
    })));
  },[]);

  const clues = [
    {
      num:1, icon:"🗺️",
      title:"THE FIRST CLUE",
      text:"Every great detective starts with a map.\nYour journey began the day you were born —\na trail of mysteries, laughs, and late nights.\nFollow the path... to clue #2.",
      btnText:"FOLLOW THE TRAIL →",
    },
    {
      num:2, icon:"🕯️",
      title:"THE SECOND CLUE",
      text:"Where there is darkness, a candle burns.\nYou have always been that light —\nin every room, in every story, in every person lucky enough to know you.\nKeep going, you're close...",
      btnText:"KEEP GOING →",
    },
    {
      num:3, icon:"🔑",
      title:"THE THIRD CLUE",
      text:"Every locked door has a key.\nYours is this: your curiosity, your wit,\nyour love for the twist in the tale.\nYou've had the key all along.\nOne last step...",
      btnText:"OPEN THE FINAL DOOR →",
    },
  ];

  const current = clues[clue];

  return (
    <div style={s4.root}>
      <style>{GLOBAL_CSS}</style>
      <Scanline/>

      {stars.map(st=>(
        <div key={st.id} style={{
          position:"fixed", left:st.left, top:st.top,
          width:st.size, height:st.size,
          background:"#fff", borderRadius:"50%",
          opacity:0.3+Math.random()*0.4,
          animation:`heartBeat ${2+Math.random()*2}s ${st.delay} infinite`,
          pointerEvents:"none", zIndex:0,
        }}/>
      ))}

      {!showFinal ? (
        <div style={s4.wrap} key={clue} className="fadeInUp">
          <div style={s4.clueCard}>
            <div style={s4.mapCorner} className="fadeIn">🗺️ TREASURE MAP</div>
            <div style={s4.progress}>
              {clues.map((_,i)=>(
                <div key={i} style={{...s4.dot, background: i<=clue?"#ffcc00":"#333"}}/>
              ))}
              <div style={s4.dotLine}/>
            </div>
            <div style={{fontSize:64,margin:"16px 0",filter:"drop-shadow(0 0 20px #ffcc0088)"}}>{current.icon}</div>
            <div style={s4.clueNum}>CLUE {current.num} OF {clues.length}</div>
            <h2 style={s4.clueTitle}>{current.title}</h2>
            <pre style={s4.clueText}>{current.text}</pre>
            <button style={s4.btn} onClick={()=>{
              if(clue < clues.length-1) setClue(c=>c+1);
              else setShowFinal(true);
            }}>{current.btnText}</button>
          </div>
        </div>
      ) : (
        <div style={s4.finalWrap} className="fadeIn">
          <Confetti/>
          <div style={s4.treasure}>
            <div style={{fontSize:80,animation:"heartBeat 1s infinite"}}>🎁</div>
            <div style={{fontSize:48,marginTop:8}}>✨👑✨</div>
          </div>
          <h1 style={s4.finalTitle} className="glitch-text">
            YOU FOUND IT!
          </h1>
          <div style={s4.finalCard}>
            <p style={s4.finalMsg}>
              🎉 <strong style={{color:"#ffcc00"}}>HAPPY BIRTHDAY, AMRITHA!</strong> 🎉
            </p>
            <p style={s4.finalBody}>
              You cracked the mystery,<br/>
              unlocked the safe,<br/>
              cleared your name at the FBI,<br/>
              and followed every clue to the end.<br/><br/>
              Just like you do in real life — with brilliance,<br/>
              with patience, and with that incredible mind of yours.<br/><br/>
              <em style={{color:"#ff9de2"}}>
                "May this year be your greatest mystery yet —<br/>
                full of plot twists you never saw coming,<br/>
                adventures beyond imagination,<br/>
                and a wonderful year ahead that only you could make the most of. 🎂"
              </em>
            </p>
            <div style={s4.starsRow}>
              {["⭐","🌟","💫","✨","🌸","💖","🎀","🎊"].map((e,i)=>(
                <span key={i} style={{fontSize:"1.5rem",animation:`starPop 0.5s ${i*0.1}s ease forwards`,opacity:0,display:"inline-block"}}>{e}</span>
              ))}
            </div>
            <button style={{...s4.btn,marginTop:24,background:"linear-gradient(135deg,#ff6ec4,#e040fb)",color:"#fff"}} onClick={onNext}>
              🕵️ One Final Mystery Awaits... →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const s4 = {
  root:{ minHeight:"100vh",background:"radial-gradient(ellipse at top left,#1a0a00 0%,#0a0a0a 60%)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Special Elite',serif",position:"relative",overflowY:"auto" },
  wrap:{ maxWidth:560,width:"100%",position:"relative",zIndex:2 },
  clueCard:{ background:"rgba(20,12,0,0.95)",border:"1px solid #b8860b44",padding:"32px 28px",borderRadius:4,textAlign:"center",position:"relative",boxShadow:"0 0 60px rgba(184,134,11,0.1)" },
  mapCorner:{ position:"absolute",top:12,left:16,color:"#b8860b44",fontSize:"0.7rem",letterSpacing:3,fontFamily:"'Courier Prime',monospace" },
  progress:{ display:"flex",alignItems:"center",justifyContent:"center",gap:0,marginBottom:8,position:"relative" },
  dot:{ width:12,height:12,borderRadius:"50%",zIndex:1,transition:"background 0.3s",margin:"0 20px" },
  dotLine:{ position:"absolute",top:"50%",left:"10%",right:"10%",height:1,background:"#333",zIndex:0 },
  clueNum:{ color:"#b8860b88",fontSize:"0.7rem",letterSpacing:4,fontFamily:"'Courier Prime',monospace",marginBottom:8 },
  clueTitle:{ color:"#ffcc00",fontSize:"clamp(1.2rem,5vw,1.8rem)",letterSpacing:3,marginBottom:16,textShadow:"0 0 20px #ffcc0044" },
  clueText:{ color:"#ccaa88",fontFamily:"'Courier Prime',monospace",fontSize:"0.9rem",lineHeight:1.9,whiteSpace:"pre-wrap",textAlign:"left",background:"rgba(0,0,0,0.3)",padding:20,borderRadius:2,borderLeft:"2px solid #b8860b44",marginBottom:24 },
  btn:{ padding:"14px 40px",background:"linear-gradient(135deg,#b8860b,#ffcc00)",border:"none",color:"#000",fontSize:"0.85rem",letterSpacing:3,cursor:"pointer",fontFamily:"'Courier Prime',monospace",borderRadius:2,fontWeight:700 },
  finalWrap:{ maxWidth:560,width:"100%",textAlign:"center",position:"relative",zIndex:2,paddingBottom:40 },
  treasure:{ marginBottom:16 },
  finalTitle:{ fontSize:"clamp(2rem,8vw,3.5rem)",color:"#ffcc00",letterSpacing:6,textShadow:"0 0 30px #ffcc0088",marginBottom:24 },
  finalCard:{ background:"rgba(20,10,0,0.95)",border:"1px solid #b8860b",padding:"32px 28px",borderRadius:4,boxShadow:"0 0 60px rgba(184,134,11,0.2)" },
  finalMsg:{ color:"#fff",fontSize:"1.3rem",letterSpacing:2,marginBottom:20 },
  finalBody:{ color:"#ccaa88",fontFamily:"'Courier Prime',monospace",fontSize:"0.95rem",lineHeight:2,marginBottom:24 },
  starsRow:{ display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginTop:8 },
};

/* ─────────────────────────────────────────────
   TRANSITION SCREEN
───────────────────────────────────────────── */
function Transition({ from, to, onDone }) {
  const labels = ["","🕵️ CASE FILED","🔐 CODE CRACKED","🏛️ DOSSIER SEALED","🗺️ FINAL MISSION"];
  useEffect(()=>{ const t=setTimeout(onDone,2200); return()=>clearTimeout(t); },[]);
  return (
    <div style={{
      position:"fixed",inset:0,background:"#000",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      zIndex:1000,fontFamily:"'Courier Prime',monospace",
    }} className="fadeIn">
      <div style={{color:"#b8860b",fontSize:"clamp(1.2rem,5vw,2rem)",letterSpacing:6,textAlign:"center",marginBottom:16}}>
        {labels[from]}
      </div>
      <div style={{color:"#333",fontSize:"0.8rem",letterSpacing:4}}>LOADING NEXT MISSION...</div>
      <div style={{marginTop:32,display:"flex",gap:8}}>
        {[0,1,2,3].map(i=>(
          <div key={i} style={{
            width:8,height:8,borderRadius:"50%",background:"#b8860b",
            animation:`heartBeat 1s ${i*0.2}s infinite`,
          }}/>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
import MysteryGame from "./MysteryGame";

export default function SurprisePage() {
  const [stage, setStage] = useState(1);
  const [transitioning, setTransitioning] = useState(false);
  const [fromStage, setFromStage] = useState(1);

  const next = () => {
    setFromStage(stage);
    setTransitioning(true);
  };

  const handleTransitionDone = () => {
    setStage(s=>s+1);
    setTransitioning(false);
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      {transitioning && <Transition from={fromStage} to={fromStage+1} onDone={handleTransitionDone}/>}
      {!transitioning && stage===1 && <Stage1 onNext={next}/>}
      {!transitioning && stage===2 && <Stage2 onNext={next}/>}
      {!transitioning && stage===3 && <Stage3 onNext={next}/>}
      {!transitioning && stage===4 && <Stage4 onNext={next}/>}
      {!transitioning && stage===5 && <MysteryGame onFinish={()=>alert("🎂 Case Closed! Happy Birthday Amritha! Hope you enjoyed every mystery 🎉")}/>}
    </>
  );
}
