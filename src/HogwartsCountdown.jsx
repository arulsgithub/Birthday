import { useState, useEffect, useRef, useCallback } from "react";
import { HP_CSS, AmrithaWitch, HogwartsCastle, Stars, FloatingCandles, FlyingBroom, ShootingStar } from "./HPShared";
import HogwartsSurprise from "./HogwartsSurprise";

const _T = 1774377000000;

async function fetchServerTime() {
  try {
    const r = await fetch("https://worldtimeapi.org/api/timezone/Asia/Kolkata",{cache:"no-store"});
    const d = await r.json();
    return new Date(d.datetime).getTime();
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

function SpellAlert({ onClose }) {
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(3,2,8,.92)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:20 }} onClick={onClose}>
      <div style={{ background:"linear-gradient(145deg,#120e22,#0e0a1c)",border:"2px solid #d4af37",borderRadius:6,padding:"36px 28px",maxWidth:340,width:"100%",textAlign:"center",boxShadow:"0 0 80px rgba(139,105,20,.3)",animation:"alertPop .4s cubic-bezier(.34,1.56,.64,1)" }} onClick={e=>e.stopPropagation()}>
        <div style={{ fontSize:"3rem",marginBottom:10,animation:"wandWave 1s ease-in-out infinite alternate" }}>🪄</div>
        <h2 style={{ fontFamily:"'Cinzel Decorative'",color:"#d4af37",fontSize:"1.4rem",marginBottom:10,textShadow:"0 0 20px rgba(212,175,55,.6)" }}>Alohomora!</h2>
        <p style={{ color:"#c8b89a",fontFamily:"'Crimson Text'",fontSize:"1rem",lineHeight:1.9,marginBottom:8 }}>
          The enchantment holds, dear witch.<br/>
          The gates open only when stars align<br/>at the witching hour on...
        </p>
        <p style={{ color:"#d4af37",fontFamily:"'Cinzel Decorative'",fontSize:"0.95rem",letterSpacing:2,marginBottom:22 }}>25th March · XII · IST</p>
        <button style={{ padding:"12px 28px",background:"linear-gradient(135deg,#8b1a1a,#a52020)",border:"1.5px solid #d4af37",color:"#f0e6c8",fontFamily:"'Cinzel'",fontSize:".88rem",letterSpacing:2,cursor:"pointer",borderRadius:3 }} onClick={onClose}>I Shall Wait 🦉</button>
      </div>
    </div>
  );
}

export default function HogwartsCountdown() {
  const [page,setPage]             = useState("countdown");
  const [time,setTime]             = useState(null);
  const [serverOk,setServerOk]     = useState(false);
  const [checking,setChecking]     = useState(true);
  const [launched,setLaunched]     = useState(false);
  const [showAlert,setShowAlert]   = useState(false);
  const serverOffsetRef            = useRef(0);

  useEffect(()=>{
    (async()=>{
      const sNow = await fetchServerTime();
      serverOffsetRef.current = sNow - Date.now();
      setTime(parseRemaining(_T - sNow));
      setServerOk(true); setChecking(false);
    })();
  },[]);

  useEffect(()=>{
    if(!serverOk) return;
    const iv = setInterval(()=>{ const now=Date.now()+serverOffsetRef.current; setTime(parseRemaining(_T-now)); },1000);
    return()=>clearInterval(iv);
  },[serverOk]);

  const isOver = serverOk && time === null;

  const handleEnter = useCallback(async()=>{
    setChecking(true);
    const sNow = await fetchServerTime();
    serverOffsetRef.current = sNow - Date.now();
    const rem = _T - sNow;
    setTime(parseRemaining(rem)); setChecking(false);
    if(rem > 0){ setShowAlert(true); return; }
    setLaunched(true);
    setTimeout(()=>setPage("surprise"),1500);
  },[]);

  if(page==="surprise") return <HogwartsSurprise/>;

  const units = time ? [
    {label:"Days",    value:time.days},
    {label:"Hours",   value:time.hours},
    {label:"Minutes", value:time.minutes},
    {label:"Seconds", value:time.seconds},
  ] : [];

  return (
    <div style={{ minHeight:"100vh", background:"radial-gradient(ellipse at 50% 0%,#100820 0%,#080612 45%,#050308 100%)", display:"flex", flexDirection:"column", alignItems:"center", overflowX:"hidden", overflowY:"auto", position:"relative", paddingBottom:220 }}>
      <style>{HP_CSS}</style>
      <Stars count={90}/>
      <FloatingCandles count={11}/>
      <FlyingBroom/>
      <ShootingStar/>
      <HogwartsCastle/>

      {showAlert && <SpellAlert onClose={()=>setShowAlert(false)}/>}

      {/* Launch overlay */}
      {launched && (
        <div style={{ position:"fixed",inset:0,background:"#050308",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",animation:"launchFlash 1.5s ease forwards" }}>
          <style>{`@keyframes launchFlash{0%{opacity:0}20%{opacity:1}80%{opacity:1}100%{opacity:0}}`}</style>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:80,animation:"wandSpinLaunch 1.5s ease forwards" }}>🪄</div>
            <p style={{ color:"#d4af37",fontFamily:"'Cinzel Decorative'",fontSize:"1.4rem",letterSpacing:4,marginTop:16,animation:"fadeInUp .6s .3s ease both" }}>Alohomora!</p>
          </div>
        </div>
      )}

      {/* ── CONTENT ── */}
      <div style={{ width:"100%", maxWidth:480, padding:"40px 20px 20px", display:"flex", flexDirection:"column", alignItems:"center", gap:22, position:"relative", zIndex:10 }}>

        {/* Hogwarts Crest */}
        <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:6 }}>
          <div style={{ width:82,height:82,border:"2px solid #d4af37",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:"radial-gradient(circle,rgba(139,105,20,.18) 0%,transparent 70%)",animation:"crestPulse 3s ease-in-out infinite",boxShadow:"0 0 20px rgba(212,175,55,.25)" }}>
            <style>{`@keyframes crestPulse{0%,100%{box-shadow:0 0 18px rgba(212,175,55,.2)}50%{box-shadow:0 0 40px rgba(212,175,55,.5),0 0 80px rgba(212,175,55,.12)}}`}</style>
            <span style={{ fontSize:"2rem",filter:"drop-shadow(0 0 8px #d4af37)" }}>⚡</span>
          </div>
          <p style={{ color:"#8b6914",fontFamily:"'Cinzel'",fontSize:".62rem",letterSpacing:6 }}>HOGWARTS</p>
        </div>

        {/* Title */}
        <div style={{ textAlign:"center",width:"100%" }}>
          <h1 className="goldGlow" style={{ fontFamily:"'Cinzel Decorative'",fontSize:"clamp(1.5rem,6.5vw,2.6rem)",color:"#d4af37",letterSpacing:2,lineHeight:1.2,textAlign:"center",textShadow:"0 0 30px rgba(212,175,55,.4)" }}>
            {isOver ? "Mischief Managed!" : "A Most Special"}
          </h1>
          <p style={{ fontFamily:"'Crimson Text'",fontSize:"clamp(.95rem,3.5vw,1.25rem)",color:"#c8b89a",letterSpacing:2,fontStyle:"italic",textAlign:"center",marginTop:6 }}>
            {isOver ? "Happy Birthday, Amritha! ⚡" : "Enchantment Awaits..."}
          </p>
        </div>

        {/* Witch Character */}
        <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
          <AmrithaWitch size={148} expression={isOver?"happy":"determined"} showWand showBook/>
          <p style={{ color:"#8b6914",fontFamily:"'Cinzel'",fontSize:".6rem",letterSpacing:3 }}>DETECTIVE AMRITHA · HOGWARTS WITCH</p>
        </div>

        {/* Hogwarts Letter */}
        {!isOver && !checking && (
          <div style={{ width:"100%",background:"linear-gradient(145deg,#1c1608,#140f04)",border:"1px solid #d4af3755",borderRadius:4,padding:"28px 20px 20px",position:"relative",boxShadow:"0 8px 28px rgba(0,0,0,.5),inset 0 0 18px rgba(139,105,20,.04)",animation:"letterReveal .8s ease forwards" }}>
            <div style={{ position:"absolute",top:-18,left:"50%",transform:"translateX(-50%)",fontSize:28,filter:"drop-shadow(0 0 8px rgba(212,175,55,.6))",background:"#140f04",padding:"0 10px" }}>🦉</div>
            <p style={{ color:"#c8b89a",fontFamily:"'Crimson Text'",fontSize:".95rem",lineHeight:2,textAlign:"center",marginTop:6 }}>
              <em style={{ color:"#d4af37" }}>Dear Amritha,</em><br/><br/>
              We are pleased to inform you that a most magical<br/>
              surprise has been prepared in your honour.<br/>
              The enchantment shall be revealed at midnight<br/>
              on the 25th of March.
            </p>
            <p style={{ color:"#8b6914",fontSize:".78rem",letterSpacing:1,textAlign:"right",marginTop:14,fontStyle:"italic",fontFamily:"'Crimson Text'" }}>— Headmaster's Office, Hogwarts</p>
          </div>
        )}

        {/* Timer */}
        {!isOver && !checking && (
          <div style={{ textAlign:"center",width:"100%" }}>
            <p style={{ color:"#8b6914",fontFamily:"'Cinzel'",fontSize:".72rem",letterSpacing:3,marginBottom:16 }}>✦ The Enchantment Breaks In ✦</p>
            <div style={{ display:"flex",gap:10,justifyContent:"center",width:"100%" }}>
              {units.map(({label,value})=>(
                <div key={label} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:8,flex:1,maxWidth:100 }}>
                  <div style={{ width:"100%",background:"linear-gradient(145deg,#1c1608,#241a08)",border:"1px solid #d4af3766",borderRadius:6,padding:"14px 6px",textAlign:"center",boxShadow:"0 0 14px rgba(212,175,55,.08)",animation:"timerGlow 2s ease-in-out infinite" }}>
                    <span style={{ display:"block",fontSize:"clamp(1.8rem,6.5vw,2.8rem)",fontWeight:700,color:"#d4af37",fontFamily:"'Cinzel Decorative'",lineHeight:1,textShadow:"0 0 14px rgba(212,175,55,.6)" }}>
                      {String(value).padStart(2,"0")}
                    </span>
                  </div>
                  <span style={{ color:"#8b6914",fontSize:".6rem",letterSpacing:2,textTransform:"uppercase",fontFamily:"'Cinzel'" }}>{label}</span>
                </div>
              ))}
            </div>
            <p style={{ color:"#4a3a20",fontFamily:"'Cinzel'",fontSize:".7rem",letterSpacing:3,marginTop:12 }}>25th March · XII · IST</p>
          </div>
        )}

        {checking && <p style={{ color:"#8b6914",fontFamily:"'Cinzel'",fontSize:".85rem",letterSpacing:3,textAlign:"center" }}>Consulting the stars... ✨</p>}

        {/* Birthday message */}
        {isOver && (
          <div style={{ width:"100%",background:"linear-gradient(145deg,#1c1608,#140f04)",border:"1px solid #d4af37",borderRadius:4,padding:"22px 20px",textAlign:"center",animation:"letterReveal .8s ease forwards" }}>
            <p style={{ fontSize:"2rem",letterSpacing:6,marginBottom:12 }}>🎂⚡🦉🪄✨</p>
            <p style={{ color:"#c8b89a",fontFamily:"'Crimson Text'",fontSize:"1rem",lineHeight:2 }}>
              The enchantment has broken!<br/>
              Your magical surprise awaits, young witch.<br/>
              <em style={{ color:"#d4af37",display:"block",marginTop:8 }}>"Happiness can be found in the darkest of times,<br/>if one only remembers to turn on the light."</em>
            </p>
          </div>
        )}

        {/* Button */}
        <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:10,width:"100%" }}>
          <button
            onClick={handleEnter}
            disabled={checking||launched}
            style={{
              width:"100%",maxWidth:320,padding:"16px 20px",
              background: !isOver ? "rgba(255,255,255,0.03)" : "linear-gradient(135deg,#8b1a1a,#a52020,#8b1a1a)",
              border:`2px solid ${!isOver?"rgba(139,105,20,.18)":"#d4af37"}`,
              color: !isOver ? "rgba(200,184,154,.25)" : "#f0e6c8",
              fontFamily:"'Cinzel'",fontSize:"1rem",letterSpacing:3,cursor:"pointer",borderRadius:4,
              boxShadow: isOver ? "0 0 25px rgba(139,26,26,.5),0 0 50px rgba(212,175,55,.1)" : "none",
              transition:"all .3s",display:"flex",alignItems:"center",justifyContent:"center",gap:8,
              opacity: checking ? 0.6 : 1,
            }}
          >
            <span style={{ fontSize:"1.1rem" }}>🪄</span>
            {checking ? "Consulting stars..." : isOver ? "Alohomora! Open Surprise" : "Alohomora!"}
          </button>
          {!isOver && !checking && (
            <p style={{ color:"#4a3a20",fontFamily:"'Crimson Text'",fontSize:".78rem",letterSpacing:1,fontStyle:"italic",textAlign:"center" }}>
              🔒 Sealed by ancient magic · Unlocks 25th March
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
