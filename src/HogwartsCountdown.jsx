import { useState, useEffect, useRef, useCallback } from "react";
import { G,T,CinematicBG,HLCastle,MagicDust,RuneRing,Card,Divider,Btn,Title } from "./HPCore";
import HogwartsMystery from "./HogwartsMystery";

const _T = 1774377000000; // 25 Mar midnight IST

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

/* ── ALERT MODAL ──────────────────────────────────────── */
function SealedAlert({ onClose }) {
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(2,3,8,.96)",backdropFilter:"blur(18px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:24 }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:"linear-gradient(160deg,#141028,#0e0c20)",
        border:"1px solid rgba(201,168,76,.32)",
        borderRadius:3,padding:"48px 36px",
        maxWidth:380,width:"100%",textAlign:"center",
        boxShadow:"0 0 100px rgba(201,168,76,.07),0 50px 100px rgba(0,0,0,.9)",
        animation:"alertIn .55s cubic-bezier(.23,1,.32,1)",
      }}>
        <style>{`@keyframes alertIn{0%{opacity:0;transform:scale(.94) translateY(20px)}100%{opacity:1;transform:scale(1) translateY(0)}}`}</style>
        <RuneRing size={82}/>
        <div style={{ marginTop:26,marginBottom:10 }}>
          <p style={{ fontFamily:"'Cinzel',serif",color:T.goldD,fontSize:".56rem",letterSpacing:".52em",marginBottom:14 }}>ENCHANTMENT ACTIVE</p>
          <h3 style={{ fontFamily:"'Cinzel',serif",color:T.gold,fontSize:"1.4rem",letterSpacing:".07em",marginBottom:18,textShadow:"0 0 30px rgba(201,168,76,.35)" }}>The Gates Are Sealed</h3>
        </div>
        <Divider style={{ marginBottom:20 }}/>
        <p style={{ color:T.silver,fontFamily:"'Cormorant Garamond',serif",fontSize:"1.05rem",lineHeight:1.95,marginBottom:12,opacity:.78 }}>Ancient magic holds this door shut.<br/>It yields only at the appointed hour —</p>
        <p style={{ color:T.gold,fontFamily:"'Cinzel',serif",fontSize:".82rem",letterSpacing:".2em",marginBottom:28 }}>25th March · Midnight · IST</p>
        <Btn onClick={onClose}>I shall wait</Btn>
      </div>
    </div>
  );
}

/* ── LAUNCH OVERLAY ───────────────────────────────────── */
function LaunchOverlay() {
  return (
    <div style={{ position:"fixed",inset:0,background:T.bg,zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",animation:"launchWipe 2.2s ease forwards" }}>
      <style>{G}</style>
      <MagicDust count={70}/>
      <div style={{ textAlign:"center",position:"relative",zIndex:10 }}>
        <RuneRing size={118}/>
        <p style={{ color:T.gold,fontFamily:"'Cinzel',serif",fontSize:"1.15rem",letterSpacing:".42em",marginTop:26,animation:"breathe 1.4s ease-in-out infinite" }}>ALOHOMORA</p>
      </div>
    </div>
  );
}

/* ── TIMER UNIT ───────────────────────────────────────── */
function TimerUnit({ value, label, delay = "0s" }) {
  return (
    <div className="fiu" style={{ animationDelay:delay,flex:1,maxWidth:130,display:"flex",flexDirection:"column",alignItems:"center",gap:10 }}>
      <div style={{
        width:"100%",position:"relative",overflow:"hidden",
        background:"linear-gradient(175deg,#0e0b1e,#080616)",
        border:"1px solid rgba(201,168,76,.16)",
        borderRadius:2,padding:"20px 8px",textAlign:"center",
        boxShadow:"0 0 30px rgba(201,168,76,.04),inset 0 0 24px rgba(0,0,0,.6),0 20px 50px rgba(0,0,0,.5)",
      }}>
        {/* Top highlight line */}
        <div style={{ position:"absolute",top:0,left:"15%",right:"15%",height:"1px",background:"linear-gradient(90deg,transparent,rgba(201,168,76,.2),transparent)" }}/>
        {/* Shimmer */}
        <div style={{ position:"absolute",inset:0,background:"linear-gradient(110deg,transparent 30%,rgba(201,168,76,.04) 50%,transparent 70%)",backgroundSize:"200% 100%",animation:"shimmerSlide 5s linear infinite" }}/>
        <span style={{
          display:"block",fontFamily:"'Cinzel',serif",fontWeight:700,
          fontSize:"clamp(2.2rem,7.5vw,3.4rem)",color:T.gold,lineHeight:1,
          textShadow:"0 0 30px rgba(201,168,76,.5),0 0 60px rgba(201,168,76,.2)",
          position:"relative",zIndex:1,
        }}>
          {String(value).padStart(2,"0")}
        </span>
        {/* Bottom fade */}
        <div style={{ position:"absolute",bottom:0,left:0,right:0,height:"30%",background:"linear-gradient(0deg,rgba(0,0,0,.4),transparent)" }}/>
      </div>
      <span style={{ fontFamily:"'Cinzel',serif",fontSize:".52rem",letterSpacing:".48em",color:T.goldD,textTransform:"uppercase",opacity:.9 }}>{label}</span>
    </div>
  );
}

/* ── MAIN COMPONENT ───────────────────────────────────── */
export default function HogwartsCountdown() {
  const [page,setPage]       = useState("countdown");
  const [time,setTime]       = useState(null);
  const [ok,setOk]           = useState(false);
  const [checking,setChecking] = useState(true);
  const [launched,setLaunched] = useState(false);
  const [showAlert,setAlert] = useState(false);
  const offRef               = useRef(0);

  useEffect(()=>{
    (async()=>{
      const s = await fetchServerTime();
      offRef.current = s - Date.now();
      setTime(parseRemaining(_T - s));
      setOk(true); setChecking(false);
    })();
  },[]);

  useEffect(()=>{
    if (!ok) return;
    const iv = setInterval(()=>setTime(parseRemaining(_T-(Date.now()+offRef.current))),1000);
    return ()=>clearInterval(iv);
  },[ok]);

  const isOver = ok && time === null;

  const handleEnter = useCallback(async()=>{
    setChecking(true);
    const s = await fetchServerTime();
    offRef.current = s - Date.now();
    const rem = _T - s;
    setTime(parseRemaining(rem));
    setChecking(false);
    if (rem > 0) { setAlert(true); return; }
    setLaunched(true);
    setTimeout(()=>setPage("surprise"),2100);
  },[]);

  if (page === "surprise") return <HogwartsMystery/>;

  const units = time ? [
    { label:"Days",    value:time.days    },
    { label:"Hours",   value:time.hours   },
    { label:"Minutes", value:time.minutes },
    { label:"Seconds", value:time.seconds },
  ] : [];

  return (
    <div style={{ minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",overflowX:"hidden",overflowY:"auto",position:"relative",paddingBottom:320 }}>
      <style>{G}</style>
      <CinematicBG/>
      <MagicDust count={50}/>
      <HLCastle/>

      {showAlert  && <SealedAlert onClose={()=>setAlert(false)}/>}
      {launched   && <LaunchOverlay/>}

      {/* ── CONTENT ── */}
      <div style={{ width:"100%",maxWidth:580,padding:"60px 24px 30px",display:"flex",flexDirection:"column",alignItems:"center",gap:32,position:"relative",zIndex:10 }}>

        {/* Crest + wordmark */}
        <div className="fiu" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:10 }}>
          <RuneRing size={110}/>
          <p style={{ fontFamily:"'Cinzel',serif",fontSize:".54rem",letterSpacing:".58em",color:T.goldD,marginTop:4 }}>HOGWARTS · EST. 990 A.D.</p>
        </div>

        {/* Headline */}
        <div className="fiu" style={{ textAlign:"center",animationDelay:".1s",width:"100%" }}>
          <p style={{ fontFamily:"'Cinzel',serif",fontSize:".54rem",letterSpacing:".58em",color:T.goldD,marginBottom:16 }}>
            {isOver ? "THE HOUR HAS COME" : "AN ENCHANTMENT AWAITS"}
          </p>
          <h1 style={{
            fontFamily:"'Cinzel',serif",fontWeight:900,
            fontSize:"clamp(2.4rem,9vw,4rem)",
            color:T.gold,letterSpacing:".04em",lineHeight:1.1,
            textAlign:"center",
            textShadow:"0 0 80px rgba(201,168,76,.35),0 0 160px rgba(201,168,76,.15),0 3px 6px rgba(0,0,0,.95)",
          }}>
            {isOver ? "Mischief\nManaged" : "A Most\nSpecial Gift"}
          </h1>
          <Divider style={{ marginTop:22 }}/>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1rem,3vw,1.2rem)",color:T.silver,letterSpacing:".18em",marginTop:16,fontStyle:"italic",opacity:.7 }}>
            {isOver ? "Happy Birthday, Amritha" : "For someone extraordinary"}
          </p>
        </div>

        {/* Hogwarts letter */}
        {!isOver && !checking && (
          <Card glow className="fiu" style={{ animationDelay:".22s" }}>
            <div style={{ textAlign:"center",marginBottom:18 }}>
              <p style={{ fontFamily:"'Cinzel',serif",fontSize:".55rem",letterSpacing:".5em",color:T.goldD,marginBottom:14 }}>
                HOGWARTS SCHOOL OF WITCHCRAFT AND WIZARDRY
              </p>
              <Divider/>
            </div>
            <p style={{ fontFamily:"'IM Fell English',serif",fontSize:"1.06rem",color:T.parchD,lineHeight:2.1,textAlign:"center" }}>
              <em style={{ color:T.gold }}>Dear Amritha,</em><br/><br/>
              We are pleased to inform you that a most extraordinary<br/>
              surprise has been prepared in your honour.<br/>
              The enchantment shall reveal itself at the stroke<br/>
              of midnight on the 25th of March.
            </p>
            <Divider style={{ marginTop:22,marginBottom:14 }}/>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:".84rem",color:T.goldD,textAlign:"right",fontStyle:"italic",letterSpacing:".08em" }}>
              — Headmaster's Office, Hogwarts
            </p>
          </Card>
        )}

        {/* Countdown timer */}
        {!isOver && !checking && (
          <div className="fiu" style={{ textAlign:"center",width:"100%",animationDelay:".35s" }}>
            <p style={{ fontFamily:"'Cinzel',serif",fontSize:".55rem",letterSpacing:".52em",color:T.goldD,marginBottom:22 }}>THE ENCHANTMENT BREAKS IN</p>
            <div style={{ display:"flex",gap:"clamp(10px,3vw,18px)",justifyContent:"center",width:"100%" }}>
              {units.map(({label,value},i)=>(
                <TimerUnit key={label} value={value} label={label} delay={`${i*.06}s`}/>
              ))}
            </div>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:".82rem",letterSpacing:".22em",color:T.goldD,marginTop:18,fontStyle:"italic" }}>
              25th March · Midnight · IST
            </p>
          </div>
        )}

        {/* Loading */}
        {checking && (
          <p style={{ fontFamily:"'Cinzel',serif",color:T.goldD,fontSize:".76rem",letterSpacing:".4em",textAlign:"center",animation:"breathe 2s ease-in-out infinite" }}>
            Consulting the stars...
          </p>
        )}

        {/* Birthday message when time has passed */}
        {isOver && (
          <Card glow className="fiu" style={{ textAlign:"center" }}>
            <p style={{ fontFamily:"'Cinzel',serif",fontSize:".56rem",letterSpacing:".5em",color:T.goldD,marginBottom:16 }}>THE ENCHANTMENT HAS LIFTED</p>
            <Divider style={{ marginBottom:22 }}/>
            <p style={{ fontFamily:"'IM Fell English',serif",fontSize:"1.06rem",color:T.parchD,lineHeight:2.1 }}>
              The night sky over Hogwarts glows golden.<br/>
              Your surprise awaits, Amritha.<br/><br/>
              <em style={{ color:T.gold }}>"Happiness can be found even in the darkest of times,<br/>if one only remembers to turn on the light."</em>
            </p>
            <Divider style={{ marginTop:22 }}/>
          </Card>
        )}

        {/* CTA */}
        <div className="fiu" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:14,width:"100%",animationDelay:".5s" }}>
          <Btn
            onClick={handleEnter}
            disabled={checking||launched}
            variant={isOver?"gold":"ghost"}
            style={{ width:"100%",maxWidth:320,padding:"18px 20px",fontSize:".84rem",letterSpacing:".3em" }}
          >
            {checking ? "Consulting the stars..." : "Alohomora"}
          </Btn>
          {!isOver && !checking && (
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:".76rem",letterSpacing:".16em",color:"rgba(184,191,204,.2)",fontStyle:"italic",textAlign:"center" }}>
              Sealed until 25th March · Midnight · IST
            </p>
          )}
        </div>

      </div>
    </div>
  );
}