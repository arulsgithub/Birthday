import { useState, useEffect, useRef, useCallback } from "react";
import { G, THEME, CinePage, CinematicCastle, MagicParticles, FogLayers, AtmosphericLightning, RuneRing, MagicOrb, ParchmentCard, GoldDivider, CineBtn, CineTitle, useTypewriter } from "./HPCore";
import HogwartsSurprise from "./HogwartsSurprise";

const _T = 1774377000000; // 25 Mar 2026 00:00:00 IST

async function fetchServerTime() {
  try {
    const r = await fetch("https://worldtimeapi.org/api/timezone/Asia/Kolkata",{cache:"no-store"});
    return new Date((await r.json()).datetime).getTime();
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

/* ── Locked Alert ── */
function LockedAlert({ onClose }) {
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(4,3,8,.92)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400,padding:20 }} onClick={onClose}>
      <div style={{ background:"linear-gradient(145deg,#120e20,#0e0b18)",border:"1px solid rgba(201,168,76,.35)",borderRadius:4,padding:"44px 32px",maxWidth:360,width:"100%",textAlign:"center",boxShadow:"0 0 80px rgba(201,168,76,.1), 0 40px 80px rgba(0,0,0,.7)",animation:"alertReveal .5s cubic-bezier(.23,1,.32,1)" }} onClick={e=>e.stopPropagation()}>
        <RuneRing size={80}/>
        <div style={{ marginTop:20,marginBottom:6 }}>
          <p style={{ fontFamily:"'Cinzel',serif",color:THEME.gold,fontSize:".7rem",letterSpacing:"0.45em",marginBottom:10 }}>ENCHANTMENT ACTIVE</p>
          <h3 style={{ fontFamily:"'Cinzel',serif",color:THEME.gold,fontSize:"1.4rem",letterSpacing:".1em",marginBottom:16,textShadow:"0 0 20px rgba(201,168,76,.4)" }}>The Gates Are Sealed</h3>
        </div>
        <p style={{ color:THEME.silver,fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",lineHeight:1.9,marginBottom:8,opacity:.8 }}>
          Ancient magic holds this door shut.<br/>It yields only at the appointed hour —
        </p>
        <p style={{ color:THEME.gold,fontFamily:"'Cinzel',serif",fontSize:".88rem",letterSpacing:".2em",marginBottom:28 }}>25th March · Midnight · IST</p>
        <GoldDivider style={{ marginBottom:24 }}/>
        <CineBtn onClick={onClose}>I shall wait</CineBtn>
      </div>
    </div>
  );
}

/* ── Launch overlay ── */
function LaunchOverlay() {
  return (
    <div style={{ position:"fixed",inset:0,background:THEME.bg,zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn .3s ease" }}>
      <style>{G}</style>
      <MagicParticles count={60}/>
      <div style={{ textAlign:"center",position:"relative",zIndex:10 }}>
        <RuneRing size={120}/>
        <p style={{ color:THEME.gold,fontFamily:"'Cinzel',serif",fontSize:"1.2rem",letterSpacing:".35em",marginTop:24,animation:"breathe 1.5s ease-in-out infinite" }}>ALOHOMORA</p>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function HogwartsCountdown() {
  const [page,setPage]         = useState("countdown");
  const [time,setTime]         = useState(null);
  const [serverOk,setOk]       = useState(false);
  const [checking,setChecking] = useState(true);
  const [launched,setLaunched] = useState(false);
  const [showAlert,setAlert]   = useState(false);
  const offsetRef              = useRef(0);

  useEffect(()=>{
    (async()=>{
      const s = await fetchServerTime();
      offsetRef.current = s - Date.now();
      setTime(parseRemaining(_T - s));
      setOk(true); setChecking(false);
    })();
  },[]);

  useEffect(()=>{
    if(!serverOk) return;
    const iv = setInterval(()=>{
      setTime(parseRemaining(_T - (Date.now()+offsetRef.current)));
    },1000);
    return ()=>clearInterval(iv);
  },[serverOk]);

  const isOver = serverOk && time === null;

  const handleEnter = useCallback(async()=>{
    setChecking(true);
    const s = await fetchServerTime();
    offsetRef.current = s - Date.now();
    const rem = _T - s;
    setTime(parseRemaining(rem)); setChecking(false);
    if(rem > 0){ setAlert(true); return; }
    setLaunched(true);
    setTimeout(()=>setPage("surprise"),2000);
  },[]);

  if(page==="surprise") return <HogwartsSurprise/>;

  const units = time ? [
    {label:"Days",value:time.days},{label:"Hours",value:time.hours},
    {label:"Minutes",value:time.minutes},{label:"Seconds",value:time.seconds},
  ] : [];

  return (
    <div style={{ minHeight:"100vh",background:THEME.bg,display:"flex",flexDirection:"column",alignItems:"center",overflowX:"hidden",overflowY:"auto",position:"relative",paddingBottom:280 }}>
      <style>{G}</style>
      <MagicParticles count={55}/>
      <FogLayers/>
      <AtmosphericLightning/>
      <CinematicCastle/>

      {showAlert  && <LockedAlert onClose={()=>setAlert(false)}/>}
      {launched   && <LaunchOverlay/>}

      {/* ── Content ── */}
      <div style={{ width:"100%",maxWidth:520,padding:"52px 22px 28px",display:"flex",flexDirection:"column",alignItems:"center",gap:28,position:"relative",zIndex:10 }}>

        {/* Rune crest */}
        <div className="fiu" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:6 }}>
          <RuneRing size={108}/>
          <p style={{ fontFamily:"'Cinzel',serif",fontSize:".58rem",letterSpacing:"0.55em",color:THEME.goldDim,marginTop:6 }}>HOGWARTS · EST. 990 A.D.</p>
        </div>

        {/* Main title */}
        <div className="fiu" style={{ textAlign:"center",animationDelay:".15s" }}>
          <p style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:"0.55em",color:THEME.goldDim,marginBottom:14 }}>
            {isOver ? "THE HOUR HAS COME" : "AN ENCHANTMENT AWAITS"}
          </p>
          <h1 style={{
            fontFamily:"'Cinzel',serif", fontWeight:700,
            fontSize:"clamp(1.8rem,7.5vw,3.2rem)",
            color:THEME.gold, letterSpacing:".06em", lineHeight:1.15, textAlign:"center",
            textShadow:"0 0 60px rgba(201,168,76,.35), 0 2px 4px rgba(0,0,0,.8)",
          }}>
            {isOver ? "Mischief\nManaged" : "A Most\nSpecial Gift"}
          </h1>
          <GoldDivider style={{ marginTop:18 }}/>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(.95rem,3vw,1.15rem)",color:THEME.silver,letterSpacing:".12em",marginTop:14,fontStyle:"italic",opacity:.75 }}>
            {isOver ? "Happy Birthday, Amritha" : "For someone extraordinary"}
          </p>
        </div>

        {/* Hogwarts Letter */}
        {!isOver && !checking && (
          <ParchmentCard glowing className="fiu" style={{ animationDelay:".3s" }}>
            <div style={{ textAlign:"center",marginBottom:18 }}>
              <p style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:"0.45em",color:THEME.goldDim,marginBottom:4 }}>HOGWARTS SCHOOL OF WITCHCRAFT AND WIZARDRY</p>
              <GoldDivider/>
            </div>
            <p style={{ fontFamily:"'IM Fell English',serif",fontSize:"1.05rem",color:THEME.parchDark,lineHeight:2,textAlign:"center" }}>
              <em style={{ color:THEME.gold }}>Dear Amritha,</em><br/><br/>
              We are pleased to inform you that a most extraordinary<br/>
              surprise has been prepared in your honour.<br/>
              The enchantment shall reveal itself at the stroke<br/>
              of midnight on the 25th of March.
            </p>
            <GoldDivider style={{ marginTop:18,marginBottom:12 }}/>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:".85rem",color:THEME.goldDim,textAlign:"right",fontStyle:"italic",letterSpacing:".08em" }}>
              — Headmaster's Office, Hogwarts
            </p>
          </ParchmentCard>
        )}

        {/* Timer */}
        {!isOver && !checking && (
          <div className="fiu" style={{ textAlign:"center",width:"100%",animationDelay:".45s" }}>
            <p style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:"0.45em",color:THEME.goldDim,marginBottom:18 }}>THE ENCHANTMENT BREAKS IN</p>
            <div style={{ display:"flex",gap:"clamp(8px,3vw,16px)",justifyContent:"center" }}>
              {units.map(({label,value})=>(
                <div key={label} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:10,flex:1,maxWidth:100 }}>
                  <div style={{
                    width:"100%",
                    background:"linear-gradient(145deg,#14111e,#0e0c16)",
                    border:"1px solid rgba(201,168,76,0.2)",
                    borderRadius:3, padding:"16px 6px", textAlign:"center",
                    boxShadow:"0 0 20px rgba(201,168,76,.06),inset 0 0 20px rgba(0,0,0,.4)",
                    animation:"glowPulse 3s ease-in-out infinite",
                    position:"relative", overflow:"hidden",
                  }}>
                    {/* Subtle shimmer */}
                    <div style={{ position:"absolute",inset:0,background:"linear-gradient(105deg,transparent 40%,rgba(201,168,76,.04) 50%,transparent 60%)",backgroundSize:"200% 100%",animation:"shimmer 4s linear infinite" }}/>
                    <span style={{ display:"block",fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:"clamp(2rem,7vw,3rem)",color:THEME.gold,lineHeight:1,textShadow:"0 0 20px rgba(201,168,76,.5)",position:"relative",zIndex:1,animation:"countUp .3s ease" }}>
                      {String(value).padStart(2,"0")}
                    </span>
                  </div>
                  <span style={{ fontFamily:"'Cinzel',serif",fontSize:".55rem",letterSpacing:"0.4em",color:THEME.goldDim,textTransform:"uppercase" }}>{label}</span>
                </div>
              ))}
            </div>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:".82rem",letterSpacing:".2em",color:THEME.goldDim,marginTop:14,fontStyle:"italic" }}>
              25th March · XII · IST
            </p>
          </div>
        )}

        {checking && (
          <p style={{ fontFamily:"'Cinzel',serif",color:THEME.goldDim,fontSize:".78rem",letterSpacing:".35em" }}>
            Consulting the stars...
          </p>
        )}

        {/* Birthday message */}
        {isOver && (
          <ParchmentCard glowing className="fiu" style={{ textAlign:"center" }}>
            <p style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:"0.45em",color:THEME.goldDim,marginBottom:16 }}>THE ENCHANTMENT HAS LIFTED</p>
            <GoldDivider style={{ marginBottom:20 }}/>
            <p style={{ fontFamily:"'IM Fell English',serif",fontSize:"1.05rem",color:THEME.parchDark,lineHeight:2 }}>
              The night sky over Hogwarts glows golden.<br/>
              Your surprise awaits, Amritha.<br/><br/>
              <em style={{ color:THEME.gold }}>
                "Happiness can be found even in the darkest of times,<br/>
                if one only remembers to turn on the light."
              </em>
            </p>
            <GoldDivider style={{ marginTop:20 }}/>
          </ParchmentCard>
        )}

        {/* Button */}
        <div className="fiu" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:12,width:"100%",animationDelay:".55s" }}>
          <CineBtn
            onClick={handleEnter}
            disabled={checking||launched}
            variant={isOver?"gold":"ghost"}
            style={{ width:"100%",maxWidth:300,padding:"16px 20px",fontSize:".88rem",letterSpacing:".25em",animation:isOver?"lockPulse 2.5s infinite":"none" }}
          >
            {checking ? "Consulting the stars..." : "Alohomora"}
          </CineBtn>
          {!isOver && !checking && (
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:".78rem",letterSpacing:".15em",color:"rgba(184,184,200,0.25)",fontStyle:"italic" }}>
              Sealed until 25th March · Midnight · IST
            </p>
          )}
        </div>

        {/* Ambient orbs */}
        <MagicOrb size={60} color="#c9a84c" style={{ position:"fixed",top:"18%",left:"6%",zIndex:3,opacity:.35,animationDelay:"1s" }}/>
        <MagicOrb size={40} color="#8b1a1a" style={{ position:"fixed",top:"35%",right:"5%",zIndex:3,opacity:.25,animationDelay:"2.5s" }}/>
        <MagicOrb size={50} color="#1a4a2a" style={{ position:"fixed",bottom:"30%",left:"4%",zIndex:3,opacity:.2,animationDelay:"1.8s" }}/>

      </div>
    </div>
  );
}
