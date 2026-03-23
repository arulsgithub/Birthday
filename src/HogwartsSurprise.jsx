import { useState, useEffect } from "react";
import { G, THEME, CinePage, RuneRing, MagicOrb, ParchmentCard, GoldDivider, CineBtn, CineTitle, CineTransition, CineConfetti, useTypewriter } from "./HPCore";
import HogwartsMystery from "./HogwartsMystery";

/* ═══════════════════════════════════════════════════════════
   STAGE 1 — THE CASE OF THE MISSING BIRTHDAY
═══════════════════════════════════════════════════════════ */
function Stage1({ onNext }) {
  const [step,setStep]       = useState(0);
  const [suspect,setSuspect] = useState(null);
  const [solved,setSolved]   = useState(false);

  const intro = "MINISTRY OF MAGIC — DEPARTMENT OF MYSTERIES\nCase File #HP-2503 · MOST URGENT\n\nThe Birthday Witch has vanished from Hogwarts\non the eve of her most significant day.\nThree persons of interest remain.\n\nDetective Amritha. You are our only hope.";
  const { out, done } = useTypewriter(intro, 24, step === 1);

  const suspects = [
    { id:0, name:"Dobby",       sub:"House Elf",    verdict:"INNOCENT", col:THEME.goldDim,   icon:"🧦", evidence:"Was documented ironing his own fingers. A sock near the scene — but not the right size." },
    { id:1, name:"Peeves",      sub:"Poltergeist",  verdict:"INNOCENT", col:THEME.goldDim,   icon:"👻", evidence:"Confirmed dropping dungbombs, 7th floor, 11:47 PM. Two portraits gave sworn testimony." },
    { id:2, name:"Time Itself", sub:"The Real Thief",verdict:"GUILTY ❤️",col:"#ff9de2",      icon:"⏳", evidence:"Stole 365 enchanted days from Amritha... and returned them as wisdom, brilliance, and fire." },
  ];

  return (
    <CinePage>
      {step === 0 && (
        <>
          <div className="fiu" style={{ textAlign:"center" }}>
            <RuneRing size={90}/>
            <p style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:"0.5em",color:THEME.goldDim,marginTop:14,marginBottom:10 }}>MINISTRY OF MAGIC</p>
            <CineTitle eyebrow="DEPARTMENT OF MYSTERIES" size="clamp(1.3rem,5vw,2rem)">Case File #HP-2503</CineTitle>
          </div>
          <ParchmentCard>
            <p style={{ fontFamily:"'IM Fell English',serif",fontSize:"1rem",color:THEME.parchDark,lineHeight:1.95,textAlign:"center" }}>
              A most peculiar case has materialised on your desk.<br/>
              The Birthday Witch has disappeared on the very eve<br/>
              of her twenty-second year.<br/><br/>
              Only the sharpest mind at the Ministry can unravel it.
            </p>
          </ParchmentCard>
          <CineBtn onClick={()=>setStep(1)}>Open Case File</CineBtn>
        </>
      )}

      {step === 1 && (
        <>
          <CineTitle eyebrow="CLASSIFIED BRIEF" size="clamp(1.2rem,4.5vw,1.8rem)">The Incident Report</CineTitle>
          <ParchmentCard glowing>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:16,alignItems:"flex-start" }}>
              <span style={{ background:"#8b0000",color:"rgba(240,228,192,.9)",padding:"3px 14px",fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".3em" }}>TOP SECRET</span>
              <span style={{ color:THEME.goldDim,fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".3em" }}>MINISTRY OF MAGIC</span>
            </div>
            <pre style={{ fontFamily:"'IM Fell English',serif",fontSize:".97rem",color:THEME.parchDark,lineHeight:2,whiteSpace:"pre-wrap" }}>
              {out}<span style={{ color:THEME.gold,animation:"goldPulse .8s infinite" }}>{!done?"▌":""}</span>
            </pre>
            {done && (
              <div className="fiu" style={{ marginTop:20,textAlign:"center" }}>
                <GoldDivider style={{ marginBottom:18 }}/>
                <p style={{ color:THEME.silver,fontFamily:"'Cormorant Garamond',serif",fontSize:".95rem",marginBottom:16,fontStyle:"italic",opacity:.8 }}>
                  Three persons of interest await your interrogation.
                </p>
                <CineBtn onClick={()=>setStep(2)}>Begin Interrogation</CineBtn>
              </div>
            )}
          </ParchmentCard>
        </>
      )}

      {step === 2 && (
        <>
          <CineTitle eyebrow="SUSPECT ANALYSIS" size="clamp(1.2rem,4.5vw,1.8rem)">The Evidence Board</CineTitle>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.silver,fontSize:"1rem",letterSpacing:".1em",opacity:.7,fontStyle:"italic",textAlign:"center" }}>
            Select each suspect to examine their testimony
          </p>
          <div style={{ display:"flex",flexDirection:"column",gap:12,width:"100%" }}>
            {suspects.map(s=>(
              <div key={s.id} onClick={()=>setSuspect(s.id)} style={{
                background: suspect===s.id ? "linear-gradient(145deg,#1e1a2c,#181524)" : "linear-gradient(145deg,#12101c,#0e0c16)",
                border:`1px solid ${suspect===s.id?"rgba(201,168,76,.4)":"rgba(201,168,76,.1)"}`,
                borderRadius:3, padding:"18px 20px", cursor:"pointer",
                transition:"all .4s cubic-bezier(.23,1,.32,1)",
                boxShadow: suspect===s.id ? "0 0 30px rgba(201,168,76,.1)" : "none",
              }} className="fiu">
                <div style={{ display:"flex",alignItems:"center",gap:14 }}>
                  <span style={{ fontSize:28,filter:`drop-shadow(0 0 8px ${s.col})` }}>{s.icon}</span>
                  <div style={{ flex:1 }}>
                    <p style={{ fontFamily:"'Cinzel',serif",color:THEME.gold,fontSize:".9rem",letterSpacing:".1em" }}>{s.name}</p>
                    <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.silverDim,fontSize:".82rem",fontStyle:"italic" }}>{s.sub}</p>
                  </div>
                  <span style={{ fontFamily:"'Cinzel',serif",fontSize:".62rem",letterSpacing:".2em",color:s.col }}>{s.verdict}</span>
                </div>
                {suspect===s.id && (
                  <div className="fiu" style={{ marginTop:14,paddingTop:14,borderTop:"1px solid rgba(201,168,76,.1)" }}>
                    <p style={{ fontFamily:"'IM Fell English',serif",fontSize:".95rem",color:THEME.parchDark,lineHeight:1.8,fontStyle:"italic" }}>"{s.evidence}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {suspect===2 && !solved && (
            <CineBtn onClick={()=>setSolved(true)} style={{ animation:"lockPulse 2s infinite" }}>Declare Verdict</CineBtn>
          )}
          {solved && (
            <ParchmentCard glowing className="fiu" style={{ textAlign:"center" }}>
              <p style={{ fontFamily:"'Cinzel',serif",color:THEME.gold,fontSize:".7rem",letterSpacing:".45em",marginBottom:14 }}>CASE RESOLVED</p>
              <GoldDivider style={{ marginBottom:18 }}/>
              <p style={{ fontFamily:"'IM Fell English',serif",fontSize:"1rem",color:THEME.parchDark,lineHeight:2 }}>
                Time stood accused. Time was found guilty.<br/>
                It stole 365 enchanted days from Amritha —<br/>
                and returned them as brilliance, depth, and fire.
              </p>
              <GoldDivider style={{ margin:"18px 0" }}/>
              <CineBtn onClick={onNext} variant="gold">Proceed to Next Chapter</CineBtn>
            </ParchmentCard>
          )}
        </>
      )}
    </CinePage>
  );
}

/* ═══════════════════════════════════════════════════════════
   STAGE 2 — UNLOCK THE CHAMBER
═══════════════════════════════════════════════════════════ */
function Stage2({ onNext }) {
  const spells = [
    { q:"The unlocking charm. First taught in the dungeons of Hogwarts.", answer:"ALOHOMORA",    hint:"A·lo·ho·mo·ra" },
    { q:"The disarming spell. Used to defeat the Dark Lord himself.",      answer:"EXPELLIARMUS", hint:"Ex·pel·li·ar·mus" },
    { q:"The illumination charm. Lights the wand tip in darkness.",        answer:"LUMOS",        hint:"Lu·mos" },
  ];
  const CODE = "AEL";
  const [answers,setAnswers] = useState(["","",""]);
  const [checked,setChecked] = useState([false,false,false]);
  const [correct,setCorrect] = useState([false,false,false]);
  const [phase,setPhase]     = useState("spells");
  const [code,setCode]       = useState("");
  const [unlocked,setUnlk]   = useState(false);
  const [wrong,setWrong]     = useState(false);

  const checkSpell = i => {
    const c=[...checked];c[i]=true;setChecked(c);
    const r=[...correct];r[i]=answers[i].trim().toUpperCase()===spells[i].answer;setCorrect(r);
  };

  const tryCode = () => {
    if(code.toUpperCase()===CODE){ setUnlk(true); }
    else { setWrong(true);setTimeout(()=>setWrong(false),700);setCode(""); }
  };

  return (
    <CinePage>
      <CineTitle eyebrow="CHAMBER OF SECRETS" size="clamp(1.3rem,5vw,2rem)">The Sealed Door</CineTitle>
      <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.silver,fontSize:"1rem",opacity:.7,fontStyle:"italic",textAlign:"center",letterSpacing:".08em" }}>
        Three incantations stand between you and the truth
      </p>

      {phase==="spells" && (
        <div style={{ display:"flex",flexDirection:"column",gap:14,width:"100%" }}>
          {spells.map((sp,i)=>(
            <ParchmentCard key={i} style={{ border:`1px solid ${correct[i]?"rgba(201,168,76,.5)":"rgba(201,168,76,.1)"}`,transition:"border-color .4s" }}>
              <p style={{ fontFamily:"'Cinzel',serif",color:THEME.goldDim,fontSize:".6rem",letterSpacing:".4em",marginBottom:8 }}>INCANTATION {i+1}</p>
              <p style={{ fontFamily:"'IM Fell English',serif",fontSize:"1rem",color:THEME.parchDark,lineHeight:1.8,marginBottom:14,fontStyle:"italic" }}>"{sp.q}"</p>
              <div style={{ display:"flex",gap:10,alignItems:"center" }}>
                <input
                  style={{ flex:1,background:"rgba(0,0,0,.4)",border:`1px solid ${checked[i]?(correct[i]?"rgba(201,168,76,.6)":"rgba(139,26,26,.6)"):"rgba(201,168,76,.15)"}`,color:THEME.gold,padding:"12px 16px",fontFamily:"'Cinzel',serif",fontSize:".85rem",letterSpacing:".2em",outline:"none",borderRadius:2,transition:"border-color .3s" }}
                  value={answers[i]} onChange={e=>{const a=[...answers];a[i]=e.target.value;setAnswers(a);}}
                  onKeyDown={e=>e.key==="Enter"&&checkSpell(i)} placeholder="Cast your spell..." disabled={correct[i]}
                />
                {!correct[i] ? <CineBtn onClick={()=>checkSpell(i)} style={{ padding:"12px 18px",fontSize:".75rem",flexShrink:0 }}>Cast</CineBtn>
                              : <span style={{ color:THEME.gold,fontSize:"1.2rem",flexShrink:0 }}>✦</span>}
              </div>
              {checked[i]&&!correct[i]&&<p style={{ color:THEME.silverDim,fontFamily:"'Cormorant Garamond',serif",fontSize:".88rem",marginTop:8,fontStyle:"italic" }}>Hint: {sp.hint}</p>}
              {correct[i]&&<p style={{ color:THEME.gold,fontFamily:"'Cinzel',serif",fontSize:".62rem",letterSpacing:".3em",marginTop:8 }}>✦ Correct — Chamber Code: {sp.answer[0]}</p>}
            </ParchmentCard>
          ))}
          {correct.every(Boolean) && (
            <div className="fiu" style={{ textAlign:"center" }}>
              <CineBtn onClick={()=>setPhase("chamber")} style={{ animation:"lockPulse 2s infinite" }}>Approach the Chamber</CineBtn>
            </div>
          )}
        </div>
      )}

      {phase==="chamber"&&!unlocked && (
        <div className="fi" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:24,width:"100%" }}>
          {/* Mystical orb */}
          <div style={{ width:160,height:160,borderRadius:"50%",background:"radial-gradient(circle at 40% 35%,rgba(80,40,180,.25),rgba(40,20,90,.1))",border:"1px solid rgba(100,60,200,.3)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 60px rgba(100,60,200,.2),inset 0 0 40px rgba(80,40,160,.1)",animation:"mirrorGlow 4s ease-in-out infinite",position:"relative" }}>
            <style>{`@keyframes mirrorGlow{0%,100%{box-shadow:0 0 40px rgba(100,60,200,.15)}50%{box-shadow:0 0 80px rgba(100,60,200,.3)}}`}</style>
            <span style={{ fontSize:52,filter:"drop-shadow(0 0 12px rgba(100,60,200,.5))" }}>🐍</span>
          </div>
          <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
            {["A","E","L"].map((l,i)=>(
              <div key={i} style={{ width:52,height:52,border:"1px solid rgba(201,168,76,.35)",borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(201,168,76,.04)",color:THEME.gold,fontFamily:"'Cinzel',serif",fontSize:"1.4rem",letterSpacing:0 }}>{l}</div>
            ))}
          </div>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.silver,fontSize:".95rem",opacity:.7,fontStyle:"italic",textAlign:"center" }}>
            Enter the three-letter code formed by the first letter of each incantation
          </p>
          <input
            style={{ width:160,background:"rgba(0,0,0,.5)",border:`1.5px solid ${wrong?"rgba(139,26,26,.8)":"rgba(100,60,200,.4)"}`,color:THEME.gold,padding:"14px 18px",fontFamily:"'Cinzel',serif",fontSize:"1.3rem",letterSpacing:"0.5em",textAlign:"center",outline:"none",borderRadius:2,animation:wrong?"shake .6s ease":"none",transition:"border-color .3s" }}
            value={code} onChange={e=>setCode(e.target.value.toUpperCase().slice(0,3))}
            onKeyDown={e=>e.key==="Enter"&&tryCode()} placeholder="_ _ _"
          />
          <CineBtn onClick={tryCode} variant="crimson">Open the Chamber</CineBtn>
          {wrong && <p style={{ color:"rgba(192,64,64,.8)",fontFamily:"'Cinzel',serif",fontSize:".72rem",letterSpacing:".3em" }}>The serpent stirs. Wrong code.</p>}
        </div>
      )}

      {unlocked && (
        <div className="fi" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:20,width:"100%" }}>
          <CineConfetti/>
          <RuneRing size={100}/>
          <CineTitle size="clamp(1.3rem,5vw,2rem)">Chamber Unlocked</CineTitle>
          <ParchmentCard glowing style={{ textAlign:"center" }}>
            <p style={{ fontFamily:"'IM Fell English',serif",fontSize:"1.05rem",color:THEME.parchDark,lineHeight:2 }}>
              Deep within the Chamber, carved into the stone:<br/><br/>
              <em style={{ color:THEME.gold }}>"The brightest witch of her age<br/>cannot be contained by any spell.<br/>Happy Birthday, Amritha."</em>
            </p>
            <GoldDivider style={{ margin:"20px 0" }}/>
            <CineBtn onClick={onNext}>Next Chapter</CineBtn>
          </ParchmentCard>
        </div>
      )}
    </CinePage>
  );
}

/* ═══════════════════════════════════════════════════════════
   STAGE 3 — MINISTRY OF MAGIC DOSSIER
═══════════════════════════════════════════════════════════ */
function Stage3({ onNext }) {
  const [revealed,setRevealed] = useState(false);
  const [stamp,setStamp]       = useState(false);
  const handleReveal = () => { setRevealed(true); setTimeout(()=>setStamp(true),600); };

  const profile = [
    ["SUBJECT",       "AMRITHA"],
    ["CLASSIFICATION","EXTRAORDINARILY GIFTED"],
    ["MAGICAL STATUS","ACTIVE — THREAT LEVEL: MAXIMUM"],
    ["DATE OF BIRTH", "25TH MARCH — CLASSIFIED"],
    ["KNOWN FOR",     "Solving mysteries before others notice them"],
  ];

  const evidence = [
    { tag:"EXHIBIT I",   icon:"⚡", title:"MAGICAL SIGNATURE",   body:"Pattern: Unique. Database match: None found. Classification: One of a kind. There will never be another." },
    { tag:"EXHIBIT II",  icon:"📖", title:"READING RECORD",      body:"847 volumes. All finished. Margin notes: extensive. Threat to the Dark Arts: Absolute." },
    { tag:"EXHIBIT III", icon:"🔎", title:"DEDUCTIVE ABILITY",   body:"94th percentile of trained Aurors. Solved three cold cases before breakfast. Twice." },
    { tag:"EXHIBIT IV",  icon:"🎂", title:"ITEM CONFISCATED",    body:"One birthday — enchanted with precisely one year of adventure, magic, and joy. Recovered from Time itself." },
  ];

  return (
    <CinePage>
      {!revealed ? (
        <>
          <div className="fiu" style={{ textAlign:"center" }}>
            <RuneRing size={90}/>
            <CineTitle eyebrow="MINISTRY OF MAGIC" size="clamp(1.3rem,5vw,2rem)" style={{ marginTop:16 }}>Subject Dossier</CineTitle>
          </div>
          <ParchmentCard style={{ textAlign:"center",border:"1px solid rgba(139,26,26,.3)" }}>
            <div style={{ display:"inline-block",border:"2px solid rgba(139,26,26,.6)",color:"rgba(192,64,64,.9)",padding:"6px 24px",fontFamily:"'Cinzel',serif",fontSize:".8rem",letterSpacing:".4em",transform:"rotate(-6deg)",marginBottom:18,boxShadow:"0 0 20px rgba(139,26,26,.2)" }}>CLASSIFIED</div>
            <p style={{ fontFamily:"'Cinzel',serif",color:THEME.goldDim,fontSize:".62rem",letterSpacing:".4em",marginBottom:18 }}>FILE REF: AMR-2503 · EYES ONLY</p>
            {[1,2,3].map(i=><div key={i} style={{ height:10,background:"rgba(255,255,255,.04)",borderRadius:1,margin:"8px 0" }}/>)}
            <GoldDivider style={{ margin:"18px 0" }}/>
            <CineBtn onClick={handleReveal}>Declassify File</CineBtn>
          </ParchmentCard>
        </>
      ) : (
        <>
          {stamp && (
            <div className="fiu" style={{ textAlign:"center" }}>
              <span style={{ display:"inline-block",border:"2px solid rgba(201,168,76,.6)",color:THEME.gold,padding:"6px 24px",fontFamily:"'Cinzel',serif",fontSize:".8rem",letterSpacing:".4em",animation:"stampDrop .6s cubic-bezier(.34,1.56,.64,1) forwards",boxShadow:"0 0 20px rgba(201,168,76,.15)" }}>DECLASSIFIED</span>
            </div>
          )}
          <CineTitle eyebrow="AUROR DIVISION FILE" size="clamp(1.3rem,5vw,2rem)">Amritha</CineTitle>
          <ParchmentCard glowing>
            {profile.map(([k,v],i)=>(
              <div key={i} style={{ display:"flex",gap:12,padding:"9px 0",borderBottom:"1px solid rgba(201,168,76,.07)" }}>
                <span style={{ fontFamily:"'Cinzel',serif",color:THEME.goldDim,fontSize:".62rem",letterSpacing:".3em",minWidth:120,flexShrink:0,paddingTop:2 }}>{k}</span>
                <span style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.silver,fontSize:".92rem",lineHeight:1.6 }}>{v}</span>
              </div>
            ))}
          </ParchmentCard>
          <div style={{ width:"100%" }}>
            <p style={{ fontFamily:"'Cinzel',serif",color:THEME.goldDim,fontSize:".62rem",letterSpacing:".4em",marginBottom:14,textAlign:"center" }}>EVIDENCE COLLECTED</p>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12 }}>
              {evidence.map((e,i)=>(
                <div key={i} className="fiu" style={{ background:"linear-gradient(145deg,#121020,#0e0c1a)",border:"1px solid rgba(201,168,76,.12)",borderRadius:3,padding:"18px 16px",animationDelay:`${i*.1}s` }}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:10 }}>
                    <span style={{ fontFamily:"'Cinzel',serif",color:"rgba(139,26,26,.7)",fontSize:".58rem",letterSpacing:".3em" }}>{e.tag}</span>
                    <span style={{ fontSize:20,filter:"drop-shadow(0 0 6px rgba(201,168,76,.3))" }}>{e.icon}</span>
                  </div>
                  <p style={{ fontFamily:"'Cinzel',serif",color:THEME.gold,fontSize:".65rem",letterSpacing:".25em",marginBottom:8 }}>{e.title}</p>
                  <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.silverDim,fontSize:".9rem",lineHeight:1.7,fontStyle:"italic" }}>{e.body}</p>
                </div>
              ))}
            </div>
          </div>
          <ParchmentCard style={{ textAlign:"center" }}>
            <p style={{ fontFamily:"'IM Fell English',serif",fontSize:"1rem",color:THEME.parchDark,lineHeight:2 }}>
              <em style={{ color:THEME.gold }}>Official Ministry Verdict:</em><br/>
              "Amritha is hereby found guilty of being extraordinary,<br/>
              dangerously brilliant, and permanently magical.<br/>
              Sentenced to: a lifetime of adventures beyond imagination."
            </p>
            <GoldDivider style={{ margin:"20px 0" }}/>
            <CineBtn onClick={onNext}>Next Chapter</CineBtn>
          </ParchmentCard>
        </>
      )}
    </CinePage>
  );
}

/* ═══════════════════════════════════════════════════════════
   STAGE 4 — THE MARAUDER'S MAP
═══════════════════════════════════════════════════════════ */
function Stage4({ onNext }) {
  const [clue,setClue]   = useState(0);
  const [final,setFinal] = useState(false);

  const clues = [
    { loc:"Gryffindor Common Room", rune:"I solemnly swear I am up to no good.",        text:"Every great story begins beside a fire, with people who feel like home. Yours did too — with a heart brave enough to feel everything deeply, and a mind sharp enough to see through everything clearly.", btn:"Follow the Map →" },
    { loc:"Astronomy Tower",         rune:"The stars remember every name whispered here.", text:"From this tower she could see the entire world laid out below her — the way you see every story, every person, every hidden truth. You've always had that rare gift: seeing what others miss entirely.", btn:"Continue →" },
    { loc:"The Restricted Section",  rune:"Knowledge is the most dangerous magic.",       text:"You've lived inside books the way others live in houses — completely, without reservation. Every story you've read has made you more fully, brilliantly, irreplaceably yourself. One clue remains.", btn:"Final Location →" },
    { loc:"The Great Hall",          rune:"Mischief Managed.",                             text:"The enchanted ceiling mirrors your stars tonight. Every candle in this hall burns for you. This is where you are celebrated, admired, and loved — by everyone who has ever had the privilege of knowing you.", btn:"Reveal the Surprise →" },
  ];

  const c = clues[clue];

  return (
    <CinePage>
      {!final ? (
        <div className="fi" style={{ width:"100%",display:"flex",flexDirection:"column",gap:22 }} key={clue}>
          <CineTitle eyebrow="THE MARAUDER'S MAP" size="clamp(1.2rem,4.5vw,1.8rem)">{c.loc}</CineTitle>
          <ParchmentCard glowing>
            {/* Progress indicator */}
            <div style={{ display:"flex",justifyContent:"center",gap:8,marginBottom:18 }}>
              {clues.map((_,i)=>(
                <div key={i} style={{ width:i===clue?24:8,height:3,borderRadius:2,background:i<=clue?"rgba(201,168,76,.7)":"rgba(201,168,76,.15)",transition:"all .4s ease" }}/>
              ))}
            </div>
            <p style={{ fontFamily:"'Cinzel',serif",color:THEME.goldDim,fontSize:".6rem",letterSpacing:".4em",textAlign:"center",marginBottom:14 }}>
              CLUE {clue+1} OF {clues.length}
            </p>
            <GoldDivider style={{ marginBottom:18 }}/>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.parchDark,fontSize:".95rem",lineHeight:1.95,fontStyle:"italic",textAlign:"center",marginBottom:16 }}>
              "{c.rune}"
            </p>
            <div style={{ background:"rgba(0,0,0,.25)",borderLeft:"2px solid rgba(201,168,76,.25)",padding:"16px 18px",borderRadius:"0 3px 3px 0",marginBottom:18 }}>
              <p style={{ fontFamily:"'IM Fell English',serif",fontSize:"1rem",color:THEME.parchDark,lineHeight:1.95 }}>{c.text}</p>
            </div>
            <div style={{ textAlign:"center" }}>
              <CineBtn onClick={()=>{ if(clue<clues.length-1)setClue(c=>c+1); else setFinal(true); }}>{c.btn}</CineBtn>
            </div>
          </ParchmentCard>
        </div>
      ) : (
        <div className="fi" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:24,width:"100%",textAlign:"center" }}>
          <CineConfetti/>
          <RuneRing size={110}/>
          <CineTitle eyebrow="THE MAP IS COMPLETE" size="clamp(1.5rem,6vw,2.5rem)">Mischief Managed</CineTitle>
          <ParchmentCard glowing style={{ textAlign:"center" }}>
            <p style={{ fontFamily:"'Cinzel',serif",color:THEME.goldDim,fontSize:".6rem",letterSpacing:".45em",marginBottom:16 }}>TWENTY-SECOND YEAR</p>
            <GoldDivider style={{ marginBottom:20 }}/>
            <p style={{ fontFamily:"'IM Fell English',serif",fontSize:"1.1rem",color:THEME.parchDark,lineHeight:2.1 }}>
              Happy Birthday, Amritha.<br/><br/>
              <em style={{ color:THEME.gold }}>
                "It does not do to dwell on dreams<br/>and forget to live.<br/><br/>
                You have always known how to do both —<br/>
                dream with precision<br/>and live with intention."
              </em>
            </p>
            <GoldDivider style={{ margin:"22px 0" }}/>
            <div style={{ display:"flex",justifyContent:"center",gap:10,marginBottom:22,flexWrap:"wrap" }}>
              {["⚡","🦁","📖","🦉","🪄","✦","💕"].map((e,i)=>(
                <span key={i} style={{ fontSize:"1.3rem",animation:`breathe ${1.5+i*.2}s ${i*.15}s ease-in-out infinite`,filter:"drop-shadow(0 0 6px rgba(201,168,76,.4))" }}>{e}</span>
              ))}
            </div>
            <CineBtn onClick={onNext} style={{ animation:"lockPulse 2.5s infinite" }}>One Final Mystery Awaits</CineBtn>
          </ParchmentCard>
        </div>
      )}
    </CinePage>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT CONTROLLER
═══════════════════════════════════════════════════════════ */
export default function HogwartsSurprise() {
  const [stage,setStage]     = useState(1);
  const [trans,setTrans]     = useState(false);
  const [fromStage,setFrom]  = useState(1);
  const labels = ["","Case Resolved","Chamber Sealed","Dossier Filed","Map Folded"];

  const next = () => { setFrom(stage); setTrans(true); };
  const after = () => { setStage(s=>s+1); setTrans(false); };

  return (
    <>
      <style>{G}</style>
      {trans && <CineTransition label={labels[fromStage]} onDone={after}/>}
      {!trans && stage===1 && <Stage1 onNext={next}/>}
      {!trans && stage===2 && <Stage2 onNext={next}/>}
      {!trans && stage===3 && <Stage3 onNext={next}/>}
      {!trans && stage===4 && <Stage4 onNext={next}/>}
      {!trans && stage===5 && <HogwartsMystery/>}
    </>
  );
}
