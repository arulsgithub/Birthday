import { useState, useEffect, useRef, useCallback } from "react";
import { G, T, Page, CinematicScene, MagicDust, FogOverlay, RuneRing, Card, Rule, Btn, Heading, useTypewriter } from "./HPCore";
import HogwartsSurprise from "./HogwartsSurprise";

const _T = 1774377000000;

async function fetchServerTime() {
  try {
    const r = await fetch("https://worldtimeapi.org/api/timezone/Asia/Kolkata",{cache:"no-store"});
    return new Date((await r.json()).datetime).getTime();
  } catch { return Date.now(); }
}

function parseRemaining(ms) {
  if (ms <= 0) return null;
  return {
    days:    Math.floor(ms/86400000),
    hours:   Math.floor((ms/3600000)%24),
    minutes: Math.floor((ms/60000)%60),
    seconds: Math.floor((ms/1000)%60),
  };
}

/* ── Sealed alert ── */
function SealedAlert({ onClose }) {
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(4,3,8,.94)",backdropFilter:"blur(16px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400,padding:20 }}
      onClick={onClose}>
      <div style={{ background:"linear-gradient(145deg,#10091e,#0c0818)",border:"1px solid rgba(201,162,86,.32)",borderRadius:3,padding:"48px 32px",maxWidth:360,width:"100%",textAlign:"center",boxShadow:"0 60px 120px rgba(0,0,0,.8),0 0 60px rgba(201,162,86,.08)",animation:"alertUp .5s cubic-bezier(.23,1,.32,1)" }}
        onClick={e=>e.stopPropagation()}>
        <RuneRing size={88}/>
        <div style={{ marginTop:24,marginBottom:8 }}>
          <p style={{ fontFamily:"'Cinzel',serif",color:T.goldDm,fontSize:".6rem",letterSpacing:".55em",marginBottom:12 }}>ENCHANTMENT ACTIVE</p>
          <h3 style={{ fontFamily:"'Cinzel',serif",color:T.gold,fontSize:"1.5rem",letterSpacing:".08em",marginBottom:18,textShadow:"0 0 30px rgba(201,162,86,.4)" }}>
            The Gates Are Sealed
          </h3>
        </div>
        <Rule style={{ marginBottom:20 }}/>
        <p style={{ color:T.silver,fontFamily:"'Cormorant Garamond',serif",fontSize:"1.05rem",lineHeight:1.9,marginBottom:8,opacity:.8 }}>
          Ancient enchantments hold this door shut.<br/>
          They yield only at the appointed hour —
        </p>
        <p style={{ color:T.gold,fontFamily:"'Cinzel',serif",fontSize:".88rem",letterSpacing:".2em",marginBottom:30 }}>
          25th March · Midnight · IST
        </p>
        <Rule style={{ marginBottom:24 }}/>
        <Btn onClick={onClose}>I shall wait</Btn>
      </div>
    </div>
  );
}

/* ── Launch overlay ── */
function LaunchOverlay() {
  return (
    <div style={{ position:"fixed",inset:0,background:T.bg,zIndex:500,display:"flex",alignItems:"center",justifyContent:"center" }} className="fi">
      <style>{G}</style>
      <CinematicScene/>
      <MagicDust count={70}/>
      <FogOverlay/>
      <div style={{ textAlign:"center",position:"relative",zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",gap:20 }}>
        <RuneRing size={130}/>
        <p style={{ color:T.gold,fontFamily:"'Cinzel',serif",fontSize:"1.3rem",letterSpacing:".35em",animation:"breathe 1.5s ease-in-out infinite" }}>
          ALOHOMORA
        </p>
      </div>
    </div>
  );
}

export default function HogwartsCountdown() {
  const [page,setPage]         = useState("countdown");
  const [time,setTime]         = useState(null);
  const [serverOk,setOk]       = useState(false);
  const [checking,setChecking] = useState(true);
  const [launched,setLaunched] = useState(false);
  const [showAlert,setAlert]   = useState(false);
  const offRef                 = useRef(0);

  useEffect(()=>{
    (async()=>{
      const s=await fetchServerTime();
      offRef.current=s-Date.now();
      setTime(parseRemaining(_T-s));
      setOk(true);setChecking(false);
    })();
  },[]);

  useEffect(()=>{
    if(!serverOk)return;
    const iv=setInterval(()=>setTime(parseRemaining(_T-(Date.now()+offRef.current))),1000);
    return()=>clearInterval(iv);
  },[serverOk]);

  const isOver = serverOk && time===null;

  const handleEnter = useCallback(async()=>{
    setChecking(true);
    const s=await fetchServerTime();
    offRef.current=s-Date.now();
    const rem=_T-s;
    setTime(parseRemaining(rem));setChecking(false);
    if(rem>0){setAlert(true);return;}
    setLaunched(true);
    setTimeout(()=>setPage("surprise"),2200);
  },[]);

  if(page==="surprise") return <HogwartsSurprise/>;

  const units = time ? [
    {label:"Days",value:time.days},{label:"Hours",value:time.hours},
    {label:"Minutes",value:time.minutes},{label:"Seconds",value:time.seconds},
  ] : [];

  return (
    <div style={{ minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",overflowX:"hidden",overflowY:"auto",position:"relative",paddingBottom:220 }}>
      <style>{G}</style>
      <CinematicScene/>
      <MagicDust count={55}/>
      <FogOverlay/>

      {showAlert  && <SealedAlert onClose={()=>setAlert(false)}/>}
      {launched   && <LaunchOverlay/>}

      {/* ── Content — sits above scene ── */}
      <div style={{ width:"100%",maxWidth:540,padding:"56px 22px 32px",display:"flex",flexDirection:"column",alignItems:"center",gap:28,position:"relative",zIndex:10 }}>

        {/* Rune crest */}
        <div className="fiu" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:8 }}>
          <RuneRing size={112}/>
          <p style={{ fontFamily:"'Cinzel',serif",fontSize:".56rem",letterSpacing:".6em",color:T.goldDm,marginTop:4 }}>HOGWARTS · EST. 990 A.D.</p>
        </div>

        {/* Main title */}
        <div className="fiu" style={{ textAlign:"center",animationDelay:".18s" }}>
          <p style={{ fontFamily:"'Cinzel',serif",fontSize:".58rem",letterSpacing:".58em",color:T.goldDm,marginBottom:14 }}>
            {isOver?"THE HOUR HAS COME":"AN ENCHANTMENT AWAITS"}
          </p>
          <h1 style={{
            fontFamily:"'Cinzel',serif",fontWeight:700,
            fontSize:"clamp(2rem,8vw,3.6rem)",
            color:T.gold,letterSpacing:".05em",lineHeight:1.12,textAlign:"center",
            textShadow:"0 0 80px rgba(201,162,86,.4),0 4px 8px rgba(0,0,0,.9)",
            animation:"goldGlow 4s ease-in-out infinite",
          }}>
            {isOver?"Mischief\nManaged":"A Most\nSpecial Gift"}
          </h1>
          <Rule style={{ marginTop:20 }}/>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1rem,3.2vw,1.2rem)",color:T.silver,letterSpacing:".12em",marginTop:16,fontStyle:"italic",opacity:.75 }}>
            {isOver?"Happy Birthday, Amritha":"For someone extraordinary"}
          </p>
        </div>

        {/* Hogwarts Letter */}
        {!isOver && !checking && (
          <Card glow className="fiu" style={{ animationDelay:".35s" }}>
            <div style={{ textAlign:"center",marginBottom:20 }}>
              <p style={{ fontFamily:"'Cinzel',serif",fontSize:".56rem",letterSpacing:".5em",color:T.goldDm,marginBottom:12 }}>
                HOGWARTS SCHOOL OF WITCHCRAFT AND WIZARDRY
              </p>
              <Rule/>
            </div>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",color:T.parch,lineHeight:2.1,textAlign:"center",fontStyle:"italic" }}>
              <span style={{ color:T.gold,fontStyle:"normal",fontFamily:"'Cinzel',serif",fontSize:".88rem",letterSpacing:".1em" }}>Dear Amritha,</span><br/><br/>
              We are pleased to inform you that a most extraordinary<br/>
              surprise has been prepared in your honour.<br/>
              The enchantment shall reveal itself at the stroke<br/>
              of midnight on the 25th of March.
            </p>
            <Rule style={{ marginTop:20,marginBottom:14 }}/>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:".85rem",color:T.goldDm,textAlign:"right",fontStyle:"italic",letterSpacing:".08em" }}>
              — Headmaster's Office, Hogwarts
            </p>
          </Card>
        )}

        {/* TIMER */}
        {!isOver && !checking && (
          <div className="fiu" style={{ textAlign:"center",width:"100%",animationDelay:".5s" }}>
            <p style={{ fontFamily:"'Cinzel',serif",fontSize:".56rem",letterSpacing:".55em",color:T.goldDm,marginBottom:20 }}>
              THE ENCHANTMENT BREAKS IN
            </p>
            <div style={{ display:"flex",gap:"clamp(8px,3vw,18px)",justifyContent:"center" }}>
              {units.map(({label,value})=>(
                <div key={label} style={{ flex:1,maxWidth:110,display:"flex",flexDirection:"column",alignItems:"center",gap:10 }}>
                  {/* Timer card — premium dark glass */}
                  <div style={{
                    width:"100%",
                    background:"linear-gradient(160deg,rgba(22,18,36,.98),rgba(14,12,24,.99))",
                    border:"1px solid rgba(201,162,86,.22)",
                    borderRadius:3, padding:"18px 8px",
                    boxShadow:"0 0 30px rgba(201,162,86,.07),0 20px 60px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.05)",
                    position:"relative",overflow:"hidden",
                    animation:"borderPulse 4s ease-in-out infinite",
                  }}>
                    {/* Shimmer sweep */}
                    <div style={{ position:"absolute",inset:0,background:"linear-gradient(110deg,transparent 38%,rgba(201,162,86,.05) 50%,transparent 62%)",backgroundSize:"200% 100%",animation:"shimmer 5s linear infinite" }}/>
                    <span key={value} style={{
                      display:"block",
                      fontFamily:"'Cinzel',serif",fontWeight:700,
                      fontSize:"clamp(2.2rem,8vw,3.4rem)",
                      color:T.gold,lineHeight:1,
                      textShadow:"0 0 30px rgba(201,162,86,.55),0 2px 4px rgba(0,0,0,.9)",
                      position:"relative",zIndex:1,
                      animation:"countFlip .4s ease",
                    }}>
                      {String(value).padStart(2,"0")}
                    </span>
                  </div>
                  <span style={{ fontFamily:"'Cinzel',serif",fontSize:".52rem",letterSpacing:".45em",color:T.goldDm,textTransform:"uppercase" }}>{label}</span>
                </div>
              ))}
            </div>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:".85rem",letterSpacing:".2em",color:T.goldDm,marginTop:16,fontStyle:"italic" }}>
              25th March · XII · IST
            </p>
          </div>
        )}

        {checking && (
          <p style={{ fontFamily:"'Cinzel',serif",color:T.goldDm,fontSize:".76rem",letterSpacing:".4em" }}>
            Consulting the stars...
          </p>
        )}

        {/* Birthday message */}
        {isOver && (
          <Card glow className="fiu" style={{ textAlign:"center" }}>
            <p style={{ fontFamily:"'Cinzel',serif",fontSize:".56rem",letterSpacing:".5em",color:T.goldDm,marginBottom:18 }}>
              THE ENCHANTMENT HAS LIFTED
            </p>
            <Rule style={{ marginBottom:20 }}/>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",color:T.parch,lineHeight:2.1,fontStyle:"italic" }}>
              The night sky over Hogwarts burns golden.<br/>
              Your surprise awaits, Amritha.<br/><br/>
              <em style={{ color:T.gold }}>
                "Happiness can be found even in the darkest of times,<br/>
                if one only remembers to turn on the light."
              </em>
            </p>
            <Rule style={{ marginTop:20 }}/>
          </Card>
        )}

        {/* BUTTON */}
        <div className="fiu" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:14,width:"100%",animationDelay:".62s" }}>
          <Btn
            onClick={handleEnter}
            disabled={checking||launched}
            variant={isOver?"gold":"ghost"}
            style={{
              width:"100%",maxWidth:300,padding:"17px 20px",fontSize:".85rem",letterSpacing:".25em",
              animation:isOver?"borderPulse 2.5s infinite":"none",
            }}
          >
            {checking?"Consulting the stars...":"Alohomora"}
          </Btn>
          {!isOver && !checking && (
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:".78rem",letterSpacing:".15em",color:"rgba(180,175,200,.22)",fontStyle:"italic" }}>
              Sealed until 25th March · Midnight · IST
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
