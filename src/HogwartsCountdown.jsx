import { useState, useEffect, useRef, useCallback } from "react";
import { G, Page, Castle, CinematicBG, Particles, RuneRing, WandLight, Card, Btn, Title, Divider, useTypewriter } from "./HPCore";
import HogwartsSurprise from "./HogwartsSurprise";

const _T = 1774377000000; // 25 Mar 2026 00:00 IST

async function fetchServerTime() {
  try {
    const r = await fetch("https://worldtimeapi.org/api/timezone/Asia/Kolkata",{cache:"no-store"});
    return new Date((await r.json()).datetime).getTime();
  } catch { return Date.now(); }
}
function parseRem(ms) {
  if(ms<=0) return null;
  return { days:Math.floor(ms/86400000), hours:Math.floor((ms/3600000)%24), minutes:Math.floor((ms/60000)%60), seconds:Math.floor((ms/1000)%60) };
}

function LockedAlert({ onClose }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(3,8,15,.94)",backdropFilter:"blur(16px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:20}} onClick={onClose}>
      <style>{G}</style>
      <div style={{maxWidth:360,width:"100%",background:"linear-gradient(145deg,#0a1424,#070e1c)",border:"1px solid rgba(180,140,60,.3)",borderRadius:4,padding:"44px 32px",textAlign:"center",boxShadow:"0 0 80px rgba(180,140,60,.08),0 40px 80px rgba(0,0,0,.8)",animation:"alertIn .5s cubic-bezier(.23,1,.32,1)"}} onClick={e=>e.stopPropagation()}>
        <RuneRing size={80}/>
        <div style={{marginTop:20}}>
          <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.5)",fontSize:".58rem",letterSpacing:".55em",marginBottom:12}}>ENCHANTMENT ACTIVE</p>
          <h3 style={{fontFamily:"'Cinzel',serif",color:"rgba(200,165,80,.9)",fontSize:"1.35rem",letterSpacing:".08em",marginBottom:16,lineHeight:1.2}}>The Gates Are Sealed</h3>
          <Divider style={{marginBottom:18}}/>
          <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,190,215,.7)",fontSize:"1rem",lineHeight:1.9,marginBottom:8}}>Ancient magic holds this door shut.<br/>It yields only at the appointed hour —</p>
          <p style={{fontFamily:"'Cinzel',serif",color:"rgba(200,165,80,.8)",fontSize:".82rem",letterSpacing:".18em",marginBottom:28}}>25th March · Midnight · IST</p>
          <Btn onClick={onClose}>I shall wait</Btn>
        </div>
      </div>
    </div>
  );
}

export default function HogwartsCountdown() {
  const [page,setPage]       = useState("countdown");
  const [time,setTime]       = useState(null);
  const [ok,setOk]           = useState(false);
  const [checking,setCheck]  = useState(true);
  const [launched,setLaunch] = useState(false);
  const [alert,setAlert]     = useState(false);
  const ref                  = useRef(0);

  useEffect(()=>{
    (async()=>{
      const s=await fetchServerTime();
      ref.current=s-Date.now();
      setTime(parseRem(_T-s)); setOk(true); setCheck(false);
    })();
  },[]);

  useEffect(()=>{
    if(!ok) return;
    const iv=setInterval(()=>setTime(parseRem(_T-(Date.now()+ref.current))),1000);
    return()=>clearInterval(iv);
  },[ok]);

  const isOver = ok && time===null;

  const handleEnter = useCallback(async()=>{
    setCheck(true);
    // const s=await fetchServerTime(); ref.current=s-Date.now();
    // const rem=_T-s; setTime(parseRem(rem)); setCheck(false);
    // if(rem>0){setAlert(true);return;}
    setLaunch(true); setTimeout(()=>setPage("surprise"),2200);
  },[]);

  if(page==="surprise") return <HogwartsSurprise/>;

  const units = time?[
    {l:"Days",v:time.days},{l:"Hours",v:time.hours},
    {l:"Minutes",v:time.minutes},{l:"Seconds",v:time.seconds}
  ]:[];

  return (
    <div style={{minHeight:"100vh",position:"relative",overflowX:"hidden",overflowY:"auto",paddingBottom:290,display:"flex",flexDirection:"column",alignItems:"center"}}>
      <style>{G}</style>
      <CinematicBG variant="night"/>
      <Particles count={45}/>
      <Castle/>

      {alert && <LockedAlert onClose={()=>setAlert(false)}/>}

      {/* Launch overlay */}
      {launched && (
        <div style={{position:"fixed",inset:0,background:"#03080f",zIndex:600,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",animation:"fadeIn .4s ease"}}>
          <CinematicBG variant="night"/>
          <Particles count={70}/>
          <div style={{position:"relative",zIndex:10,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:20}}>
            <RuneRing size={110}/>
            <p style={{fontFamily:"'Cinzel',serif",color:"rgba(200,165,80,.9)",fontSize:"1.1rem",letterSpacing:".35em",animation:"breathe 1.5s infinite",marginTop:8}}>ALOHOMORA</p>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div style={{width:"100%",maxWidth:560,padding:"56px 22px 24px",display:"flex",flexDirection:"column",alignItems:"center",gap:28,position:"relative",zIndex:10}}>

        {/* Crest */}
        <div className="fiu" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,animationDelay:".1s"}}>
          <RuneRing size={96}/>
          <p style={{fontFamily:"'Cinzel',serif",fontSize:".55rem",letterSpacing:".6em",color:"rgba(180,140,60,.4)",marginTop:4}}>HOGWARTS · EST. 990 A.D.</p>
        </div>

        {/* Title */}
        <div className="fiu" style={{textAlign:"center",animationDelay:".2s"}}>
          <p style={{fontFamily:"'Cinzel',serif",fontSize:".58rem",letterSpacing:".55em",color:"rgba(180,140,60,.45)",marginBottom:16}}>
            {isOver?"THE HOUR HAS COME":"AN ENCHANTMENT AWAITS"}
          </p>
          <h1 style={{
            fontFamily:"'Cinzel',serif",fontWeight:700,
            fontSize:"clamp(2rem,8.5vw,3.8rem)",
            color:"rgba(200,165,80,.95)",
            letterSpacing:".04em",lineHeight:1.12,textAlign:"center",
            textShadow:"0 0 80px rgba(180,140,60,.35),0 2px 6px rgba(0,0,0,.9)",
          }}>
            {isOver?"Mischief\nManaged":"A Most\nSpecial Gift"}
          </h1>
          <Divider style={{marginTop:20}}/>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1rem,3.2vw,1.2rem)",color:"rgba(180,190,215,.6)",letterSpacing:".12em",marginTop:14,fontStyle:"italic"}}>
            {isOver?"Happy Birthday, Amritha":"For someone extraordinary"}
          </p>
        </div>

        {/* Hogwarts Letter */}
        {!isOver&&!checking && (
          <Card glow className="fiu" style={{animationDelay:".35s"}}>
            <div style={{textAlign:"center",marginBottom:18}}>
              <p style={{fontFamily:"'Cinzel',serif",fontSize:".56rem",letterSpacing:".5em",color:"rgba(180,140,60,.45)",marginBottom:12}}>HOGWARTS SCHOOL OF WITCHCRAFT AND WIZARDRY</p>
              <Divider/>
            </div>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.08rem",color:"rgba(210,195,160,.85)",lineHeight:2.05,textAlign:"center"}}>
              <em style={{color:"rgba(200,165,80,.85)"}}>Dear Amritha,</em><br/><br/>
              We are pleased to inform you that a most extraordinary<br/>
              surprise has been prepared in your honour.<br/>
              The enchantment shall reveal itself at the stroke<br/>
              of midnight on the 25th of March.
            </p>
            <Divider style={{marginTop:18,marginBottom:14}}/>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:".85rem",color:"rgba(180,140,60,.5)",textAlign:"right",fontStyle:"italic",letterSpacing:".06em"}}>
              — Headmaster's Office, Hogwarts
            </p>
          </Card>
        )}

        {/* Timer */}
        {!isOver&&!checking && (
          <div className="fiu" style={{textAlign:"center",width:"100%",animationDelay:".5s"}}>
            <p style={{fontFamily:"'Cinzel',serif",fontSize:".56rem",letterSpacing:".5em",color:"rgba(180,140,60,.4)",marginBottom:18}}>THE ENCHANTMENT BREAKS IN</p>
            <div style={{display:"flex",gap:"clamp(8px,3vw,16px)",justifyContent:"center",width:"100%"}}>
              {units.map(({l,v})=>(
                <div key={l} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,flex:1,maxWidth:110}}>
                  <div style={{
                    width:"100%",
                    background:"linear-gradient(145deg,rgba(10,16,28,.95),rgba(8,12,22,.98))",
                    border:"1px solid rgba(180,140,60,.18)",
                    borderRadius:3,padding:"16px 6px",textAlign:"center",
                    boxShadow:"0 0 20px rgba(180,140,60,.06),inset 0 0 20px rgba(0,0,0,.5)",
                    animation:"borderPulse 3.5s ease-in-out infinite",
                    position:"relative",overflow:"hidden",
                  }}>
                    {/* shimmer sweep */}
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(105deg,transparent 38%,rgba(180,140,60,.04) 50%,transparent 62%)",backgroundSize:"200% 100%",animation:"goldShimmer 5s linear infinite"}}/>
                    <span key={v} style={{display:"block",fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:"clamp(2rem,7.5vw,3.2rem)",color:"rgba(200,165,80,.95)",lineHeight:1,textShadow:"0 0 24px rgba(180,140,60,.55)",position:"relative",zIndex:1,animation:"countFlip .25s ease"}}>
                      {String(v).padStart(2,"0")}
                    </span>
                  </div>
                  <span style={{fontFamily:"'Cinzel',serif",fontSize:".52rem",letterSpacing:".42em",color:"rgba(180,140,60,.38)",textTransform:"uppercase"}}>{l}</span>
                </div>
              ))}
            </div>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:".82rem",letterSpacing:".2em",color:"rgba(180,140,60,.35)",marginTop:14,fontStyle:"italic"}}>
              25th March · XII · IST
            </p>
          </div>
        )}

        {checking && (
          <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.4)",fontSize:".75rem",letterSpacing:".4em"}}>Consulting the stars...</p>
        )}

        {/* Birthday message */}
        {isOver && (
          <Card glow className="fiu" style={{textAlign:"center"}}>
            <p style={{fontFamily:"'Cinzel',serif",fontSize:".56rem",letterSpacing:".5em",color:"rgba(180,140,60,.45)",marginBottom:16}}>THE ENCHANTMENT HAS LIFTED</p>
            <Divider style={{marginBottom:20}}/>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.08rem",color:"rgba(210,195,160,.85)",lineHeight:2.1}}>
              The night sky over Hogwarts glows golden.<br/>Your surprise awaits, Amritha.<br/><br/>
              <em style={{color:"rgba(200,165,80,.8)"}}>
                "Happiness can be found even in the darkest of times,<br/>
                if one only remembers to turn on the light."
              </em>
            </p>
            <Divider style={{marginTop:20}}/>
          </Card>
        )}

        {/* Wand light + Button */}
        <div className="fiu" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14,width:"100%",animationDelay:".65s"}}>
          {isOver && <WandLight style={{marginBottom:4}}/>}
          <Btn
            onClick={handleEnter}
            disabled={checking||launched}
            variant={isOver?"gold":"ghost"}
            style={{
              width:"100%",maxWidth:290,padding:"17px 20px",fontSize:".84rem",letterSpacing:".28em",
              animation:isOver?"lockPulse 2.5s infinite":"none",
            }}
          >
            {checking?"Consulting stars...":"Alohomora"}
          </Btn>
          {!isOver&&!checking && (
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:".76rem",letterSpacing:".14em",color:"rgba(180,185,210,.2)",fontStyle:"italic"}}>
              Sealed until 25th March · Midnight · IST
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
