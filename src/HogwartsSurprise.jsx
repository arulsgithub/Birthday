import { useState, useEffect } from "react";
import { HP_CSS, AmrithaWitch, HPPage, HPBtn, HPTitle, Parchment, Confetti, SpellTransition, useTypewriter } from "./HPShared";
import HogwartsMystery from "./HogwartsMystery";

/* ══════════════════════════════════════════════════════════
   STAGE 1 — MYSTERY OF THE MISSING BIRTHDAY WITCH
══════════════════════════════════════════════════════════ */
function Stage1({ onNext }) {
  const [step,setStep]     = useState(0);
  const [suspect,setSuspect] = useState(null);
  const [solved,setSolved]  = useState(false);
  const intro = "CLASSIFIED — Ministry of Magic\nCase File #HP-2503\n\nThe Birthday Witch has vanished from Hogwarts\non the eve of her most special day.\nThree suspects remain in the Great Hall.\n\nDetective Amritha, crack the case.";
  const { out, done } = useTypewriter(intro, 26, step===1);

  const suspects = [
    { id:0, name:"Dobby",       icon:"🧦", alibi:"Was ironing his hands in the kitchen. A sock found near the scene.",                                   verdict:"INNOCENT", col:"#00cc88" },
    { id:1, name:"Peeves",      icon:"👻", alibi:"Documented dropping dungbombs on 7th floor. Two portraits confirm.",                                    verdict:"INNOCENT", col:"#00cc88" },
    { id:2, name:"Time Itself", icon:"⏳", alibi:"Stole 365 magical days from Amritha... and returned them as wisdom, courage & brilliance.",             verdict:"GUILTY ❤️", col:"#ff9de2" },
  ];

  return (
    <HPPage broom castle shooting>
      {/* Badge */}
      <div style={{ textAlign:"center" }}>
        <div className="wandPulse" style={{ fontSize:52,marginBottom:8 }}>🔍</div>
        <HPTitle size="clamp(1.2rem,5vw,2rem)">Ministry of Magic</HPTitle>
        <p style={{ fontFamily:"'Cinzel'",color:"#8b6914",fontSize:".7rem",letterSpacing:4,marginTop:4 }}>DEPARTMENT OF MYSTERIES · CASE #HP-2503</p>
      </div>

      {/* Witch */}
      <div style={{ textAlign:"center" }}>
        <AmrithaWitch size={130} expression="determined" showWand showBook/>
        <p style={{ color:"#8b6914",fontFamily:"'Cinzel'",fontSize:".58rem",letterSpacing:3,marginTop:4 }}>DETECTIVE AMRITHA · HOGWARTS AUROR</p>
      </div>

      {step===0 && (
        <div className="fiu" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:16,width:"100%" }}>
          <Parchment>
            <p style={{ color:"#c8b89a",fontFamily:"'Crimson Text'",fontSize:"1rem",lineHeight:1.9,textAlign:"center" }}>
              A most peculiar case has landed on your desk, Detective.<br/>
              Only the sharpest wizard mind can solve it.<br/>
              The Birthday Witch has gone missing. Find her.
            </p>
          </Parchment>
          <HPBtn onClick={()=>setStep(1)}>📜 Open Case File →</HPBtn>
        </div>
      )}

      {step===1 && (
        <div className="fi" style={{ display:"flex",flexDirection:"column",gap:16,width:"100%" }}>
          <Parchment style={{ border:"1px solid #d4af3766",position:"relative" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
              <span style={{ background:"#8b0000",color:"#fff",padding:"3px 12px",fontFamily:"'Cinzel'",fontSize:".62rem",letterSpacing:3,transform:"rotate(-2deg)",display:"inline-block" }}>TOP SECRET</span>
              <span style={{ color:"#8b6914",fontFamily:"'Cinzel'",fontSize:".65rem",letterSpacing:3 }}>MINISTRY OF MAGIC</span>
            </div>
            <pre style={{ fontFamily:"'Crimson Text'",fontSize:".97rem",color:"#c8b89a",lineHeight:2,whiteSpace:"pre-wrap" }}>{out}{!done && <span className="goldGlow">▌</span>}</pre>
            {done && (
              <div className="fiu" style={{ marginTop:18,textAlign:"center" }}>
                <p style={{ color:"#c8b89a",fontFamily:"'Crimson Text'",fontSize:".95rem",marginBottom:14 }}>Three suspects await in the Great Hall.</p>
                <HPBtn onClick={()=>setStep(2)}>⚔️ Begin Interrogation →</HPBtn>
              </div>
            )}
          </Parchment>
        </div>
      )}

      {step===2 && (
        <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:16,width:"100%" }}>
          <HPTitle sub="TAP EACH SUSPECT TO INTERROGATE">The Suspect Board</HPTitle>
          <div style={{ display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center",width:"100%" }}>
            {suspects.map(s=>(
              <div key={s.id} className="fiu" style={{ background:"linear-gradient(145deg,#1a1208,#120d04)",border:`1.5px solid ${suspect===s.id?"#d4af37":"#2a1e08"}`,borderRadius:4,padding:18,flex:"1 1 140px",maxWidth:180,cursor:"pointer",transition:"all .3s",textAlign:"center" }} onClick={()=>setSuspect(s.id)}>
                <div style={{ fontSize:44,marginBottom:8 }}>{s.icon}</div>
                <p style={{ color:"#d4af37",fontFamily:"'Cinzel'",fontSize:".82rem",letterSpacing:2 }}>{s.name}</p>
                {suspect===s.id && (
                  <div className="fiu">
                    <p style={{ color:"#a89070",fontFamily:"'Crimson Text'",fontSize:".85rem",lineHeight:1.7,marginTop:10,fontStyle:"italic" }}>"{s.alibi}"</p>
                    <p style={{ color:s.col,fontFamily:"'Cinzel'",fontSize:".72rem",letterSpacing:2,marginTop:8 }}>{s.verdict}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {suspect===2 && !solved && (
            <HPBtn onClick={()=>setSolved(true)} style={{ animation:"wandPulse 1.5s infinite" }}>✦ Case Solved! Reveal Finding ✦</HPBtn>
          )}
          {solved && (
            <div className="fiu" style={{ width:"100%" }}>
              <Parchment style={{ border:"1px solid #d4af37",textAlign:"center" }}>
                <p className="goldGlow" style={{ fontFamily:"'Cinzel Decorative'",fontSize:"1.2rem",letterSpacing:3,color:"#d4af37",marginBottom:12 }}>⚡ Case Closed! ⚡</p>
                <p style={{ color:"#c8b89a",fontFamily:"'Crimson Text'",fontSize:"1rem",lineHeight:1.9 }}>
                  Time stole Amritha away for 365 enchanted days...<br/>and returned her more brilliant, more magical,<br/>more extraordinary than ever before.
                </p>
                <div style={{ marginTop:18,display:"flex",justifyContent:"center" }}>
                  <HPBtn onClick={onNext} bg="linear-gradient(135deg,#1a3a6b,#2a5a9b)">Proceed to Next Chapter →</HPBtn>
                </div>
              </Parchment>
            </div>
          )}
        </div>
      )}
    </HPPage>
  );
}

/* ══════════════════════════════════════════════════════════
   STAGE 2 — UNLOCK THE CHAMBER
══════════════════════════════════════════════════════════ */
function Stage2({ onNext }) {
  const spells = [
    { q:"The spell that unlocks any door. Hermione teaches it in first year.", answer:"ALOHOMORA",    hint:"🔓 A-lo-ho-mo-ra" },
    { q:"Harry's signature spell. Used it to defeat Voldemort himself.",       answer:"EXPELLIARMUS", hint:"⚡ Expel... arms!" },
    { q:"The spell that illuminates the tip of your wand in darkness.",        answer:"LUMOS",        hint:"💡 Latin for 'light'" },
  ];
  const CODE = "AEL";
  const [answers,setAnswers]   = useState(["","",""]);
  const [checked,setChecked]   = useState([false,false,false]);
  const [correct,setCorrect]   = useState([false,false,false]);
  const [phase,setPhase]       = useState("spells");
  const [codeInput,setCode]    = useState("");
  const [unlocked,setUnlocked] = useState(false);
  const [wrong,setWrong]       = useState(false);

  const checkSpell = (i) => {
    const c=[...checked];c[i]=true;setChecked(c);
    const r=[...correct];r[i]=answers[i].trim().toUpperCase()===spells[i].answer;setCorrect(r);
  };
  const allCorrect = correct.every(Boolean);

  const tryCode = () => {
    if(codeInput.toUpperCase()===CODE){ setUnlocked(true); }
    else{ setWrong(true);setTimeout(()=>setWrong(false),600);setCode(""); }
  };

  return (
    <HPPage castle shooting>
      <div className="wandPulse" style={{ fontSize:50,textAlign:"center" }}>🔮</div>
      <HPTitle sub="CAST THE THREE SPELLS TO REVEAL THE CODE">Unlock the Chamber</HPTitle>

      {/* Witch */}
      <div style={{ textAlign:"center" }}>
        <AmrithaWitch size={110} expression={unlocked?"happy":"determined"} showWand/>
        <p style={{ color:"#8b6914",fontFamily:"'Cinzel'",fontSize:".58rem",letterSpacing:3,marginTop:4 }}>DETECTIVE AMRITHA</p>
      </div>

      {phase==="spells" && (
        <div style={{ display:"flex",flexDirection:"column",gap:14,width:"100%" }}>
          {spells.map((sp,i)=>(
            <Parchment key={i} style={{ border:`1.5px solid ${correct[i]?"#d4af37":"#2a1e08"}`,transition:"border-color .3s" }}>
              <p style={{ color:"#8b6914",fontFamily:"'Cinzel'",fontSize:".68rem",letterSpacing:3,marginBottom:6 }}>SPELL {i+1}</p>
              <p style={{ color:"#c8b89a",fontFamily:"'Crimson Text'",fontSize:"1rem",lineHeight:1.8,marginBottom:12,fontStyle:"italic" }}>"{sp.q}"</p>
              <div style={{ display:"flex",gap:10,alignItems:"center" }}>
                <input
                  style={{ flex:1,background:"rgba(0,0,0,.4)",border:`1px solid ${checked[i]?(correct[i]?"#d4af37":"#ff4444"):"#3a2a10"}`,color:"#f0e6c8",padding:"10px 14px",fontFamily:"'Cinzel'",fontSize:".85rem",letterSpacing:2,outline:"none",borderRadius:2 }}
                  value={answers[i]} onChange={e=>{const a=[...answers];a[i]=e.target.value;setAnswers(a);}}
                  onKeyDown={e=>e.key==="Enter"&&checkSpell(i)} placeholder="Cast your spell..." disabled={correct[i]}
                />
                {!correct[i] && <HPBtn onClick={()=>checkSpell(i)} style={{ padding:"10px 14px",fontSize:".75rem",flexShrink:0 }}>CAST</HPBtn>}
                {correct[i]  && <span style={{ fontSize:"1.4rem" }}>✨</span>}
              </div>
              {checked[i]&&!correct[i]&&<p style={{ color:"#8b5014",fontFamily:"'Crimson Text'",fontSize:".85rem",marginTop:6,fontStyle:"italic" }}>Hint: {sp.hint}</p>}
              {correct[i]&&<p style={{ color:"#d4af37",fontFamily:"'Cinzel'",fontSize:".68rem",letterSpacing:2,marginTop:6 }}>✦ Correct! First letter: {sp.answer[0]}</p>}
            </Parchment>
          ))}
          {allCorrect && (
            <div className="fiu" style={{ textAlign:"center" }}>
              <HPBtn onClick={()=>setPhase("chamber")} bg="linear-gradient(135deg,#1a3a6b,#2a5a9b)" style={{ animation:"wandPulse 1.5s infinite" }}>
                🗝️ Approach the Chamber →
              </HPBtn>
            </div>
          )}
        </div>
      )}

      {phase==="chamber" && !unlocked && (
        <div className="fi" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:18,width:"100%" }}>
          <div style={{ width:160,height:160,borderRadius:"50%",background:"radial-gradient(circle,rgba(100,50,200,.2),rgba(50,20,100,.1))",border:"2px solid #4a2a8b",display:"flex",alignItems:"center",justifyContent:"center",animation:"mirrorGlow 3s ease-in-out infinite",boxShadow:"0 0 40px rgba(100,50,200,.3)" }}>
            <span style={{ fontSize:60 }}>🐍</span>
          </div>
          <p style={{ color:"#c8b89a",fontFamily:"'Crimson Text'",fontSize:"1rem",fontStyle:"italic",textAlign:"center" }}>Enter the three-letter code — first letters of each spell.</p>
          <div style={{ display:"flex",gap:8 }}>
            {["A","E","L"].map((l,i)=>(
              <div key={i} style={{ width:50,height:50,border:"1px solid #d4af37",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(212,175,55,.05)",color:"#d4af37",fontFamily:"'Cinzel Decorative'",fontSize:"1.4rem" }}>{l}</div>
            ))}
          </div>
          <input
            style={{ width:160,background:"rgba(0,0,0,.5)",border:`1.5px solid ${wrong?"#ff4444":"#4a2a8b"}`,color:"#d4af37",padding:"12px 16px",fontFamily:"'Cinzel Decorative'",fontSize:"1.2rem",letterSpacing:8,textAlign:"center",outline:"none",borderRadius:4,animation:wrong?"shake .5s ease":"none" }}
            value={codeInput} onChange={e=>setCode(e.target.value.toUpperCase().slice(0,3))}
            onKeyDown={e=>e.key==="Enter"&&tryCode()} placeholder="_ _ _" maxLength={3}
          />
          <HPBtn onClick={tryCode} bg="linear-gradient(135deg,#4a1a8b,#6a2aab)">🐍 OPEN CHAMBER</HPBtn>
          {wrong && <p style={{ color:"#ff4444",fontFamily:"'Cinzel'",fontSize:".78rem",letterSpacing:2 }}>⚠ The serpent stirs... wrong code.</p>}
        </div>
      )}

      {unlocked && (
        <div className="fi" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:16,width:"100%" }}>
          <Confetti/>
          <div style={{ fontSize:56,textAlign:"center" }}>🎊</div>
          <HPTitle>Chamber Unlocked!</HPTitle>
          <Parchment style={{ border:"1px solid #d4af37",textAlign:"center" }}>
            <p style={{ color:"#c8b89a",fontFamily:"'Crimson Text'",fontSize:"1.05rem",lineHeight:1.9 }}>
              Deep in the Chamber, etched in parseltongue:<br/><br/>
              <em style={{ color:"#d4af37" }}>"The brightest witch of her age<br/>cannot be contained by any spell.<br/>Happy Birthday, Amritha. ⚡"</em>
            </p>
            <div style={{ marginTop:18,display:"flex",justifyContent:"center" }}>
              <HPBtn onClick={onNext} bg="linear-gradient(135deg,#1a3a6b,#2a5a9b)">Next Chapter →</HPBtn>
            </div>
          </Parchment>
        </div>
      )}
    </HPPage>
  );
}

/* ══════════════════════════════════════════════════════════
   STAGE 3 — MINISTRY OF MAGIC DOSSIER
══════════════════════════════════════════════════════════ */
function Stage3({ onNext }) {
  const [revealed,setRevealed] = useState(false);
  const [stamp,setStamp]       = useState(false);
  const handleReveal = () => { setRevealed(true); setTimeout(()=>setStamp(true),800); };

  const evidence = [
    { tag:"EXHIBIT I",   icon:"⚡", label:"MAGICAL SIGNATURE",  text:"Unique lightning-bolt pattern. Classification: Extraordinary. Matches no known witch — entirely original." },
    { tag:"EXHIBIT II",  icon:"📚", label:"LIBRARY RECORD",     text:"847 books borrowed. 847 finished. Annotation quality: Outstanding. Threat to Dark Arts: Maximum." },
    { tag:"EXHIBIT III", icon:"🔍", label:"DETECTIVE RATING",   text:"Deduction ability exceeds 94th percentile of Aurors. Solved 3 cold cases before finishing her tea." },
    { tag:"EXHIBIT IV",  icon:"🎂", label:"ITEM #2503",         text:"One birthday cake enchanted with exactly 1 year of adventures, laughter, and pure magic." },
  ];

  return (
    <HPPage castle shooting>
      {!revealed ? (
        <>
          <div className="wandPulse" style={{ fontSize:52,textAlign:"center" }}>🏛️</div>
          <HPTitle sub="MINISTRY OF MAGIC · AUROR DIVISION">Subject Dossier</HPTitle>
          <div style={{ textAlign:"center" }}>
            <AmrithaWitch size={120} expression="determined" showWand showBook/>
            <p style={{ color:"#8b6914",fontFamily:"'Cinzel'",fontSize:".58rem",letterSpacing:3,marginTop:4 }}>SUBJECT: AMRITHA</p>
          </div>
          <Parchment style={{ textAlign:"center",border:"2px solid #8b6914" }}>
            <div style={{ display:"inline-block",border:"2px solid #8b0000",color:"#8b0000",padding:"5px 18px",fontFamily:"'Cinzel'",fontSize:".88rem",letterSpacing:4,transform:"rotate(-8deg)",marginBottom:16 }}>CLASSIFIED</div>
            <p style={{ color:"#4a3a20",fontFamily:"'Cinzel'",fontSize:".68rem",letterSpacing:3,marginBottom:18 }}>FILE REF: AMR-2503 · EYES ONLY</p>
            {[1,2,3].map(i=><div key={i} style={{ height:12,background:"#1a1208",borderRadius:2,margin:"8px 0" }}/>)}
            <div style={{ marginTop:18,display:"flex",justifyContent:"center" }}>
              <HPBtn onClick={handleReveal}>🔓 Accio — Reveal File</HPBtn>
            </div>
          </Parchment>
        </>
      ) : (
        <>
          <div style={{ textAlign:"center" }}>
            {stamp && (
              <span style={{ display:"inline-block",border:"3px solid #d4af37",color:"#d4af37",padding:"6px 20px",fontFamily:"'Cinzel'",fontSize:".9rem",letterSpacing:4,animation:"stampIn .5s ease forwards",transformOrigin:"center",marginBottom:10 }}>
                DECLASSIFIED ⚡
              </span>
            )}
          </div>
          <HPTitle sub="OFFICIAL AUROR DIVISION FILE">Amritha's Dossier</HPTitle>

          {/* Profile */}
          <div style={{ display:"flex",gap:16,width:"100%",alignItems:"flex-start",flexWrap:"wrap" }}>
            <div style={{ flexShrink:0,textAlign:"center" }}>
              <AmrithaWitch size={100} expression="happy" showWand showBook/>
              <p style={{ color:"#4a3a20",fontFamily:"'Cinzel'",fontSize:".58rem",letterSpacing:2,marginTop:4 }}>SUBJECT DOB: 25 MARCH</p>
            </div>
            <Parchment style={{ flex:1,minWidth:180 }}>
              {[["SUBJECT","AMRITHA"],["STATUS","MOST DANGEROUS (to boredom)"],["HOUSE","All four claimed her — she chose herself"],["DOB","25th March · Classified"],["THREAT LEVEL","⚡⚡⚡⚡⚡ EXTRAORDINARY"]].map(([k,v],i)=>(
                <div key={i} style={{ display:"flex",gap:10,borderBottom:"1px solid #1a1208",paddingBottom:8,marginBottom:8 }}>
                  <span style={{ color:"#8b6914",fontFamily:"'Cinzel'",fontSize:".65rem",letterSpacing:2,minWidth:90,flexShrink:0 }}>{k}</span>
                  <span style={{ color:"#c8b89a",fontFamily:"'Crimson Text'",fontSize:".88rem" }}>{v}</span>
                </div>
              ))}
            </Parchment>
          </div>

          {/* Evidence */}
          <div style={{ width:"100%" }}>
            <p style={{ color:"#8b6914",fontFamily:"'Cinzel'",fontSize:".7rem",letterSpacing:4,marginBottom:12,textAlign:"center" }}>EVIDENCE COLLECTED</p>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10 }}>
              {evidence.map((e,i)=>(
                <div key={i} className="fiu" style={{ background:"rgba(255,255,255,.02)",border:"1px solid #2a1e08",padding:14,borderRadius:4,textAlign:"center",animationDelay:`${i*.1}s` }}>
                  <p style={{ color:"#8b0000",fontFamily:"'Cinzel'",fontSize:".6rem",letterSpacing:2,marginBottom:6 }}>{e.tag}</p>
                  <div style={{ fontSize:28,marginBottom:6 }}>{e.icon}</div>
                  <p style={{ color:"#d4af37",fontFamily:"'Cinzel'",fontSize:".62rem",letterSpacing:2,marginBottom:6 }}>{e.label}</p>
                  <p style={{ color:"#a89070",fontFamily:"'Crimson Text'",fontSize:".82rem",lineHeight:1.6,fontStyle:"italic" }}>{e.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Verdict */}
          <Parchment style={{ border:"1px solid #8b691444",textAlign:"center" }}>
            <p style={{ color:"#c8b89a",fontFamily:"'Crimson Text'",fontSize:"1rem",lineHeight:2 }}>
              🏛️ <strong style={{ color:"#d4af37" }}>OFFICIAL MINISTRY VERDICT:</strong><br/>
              <em>"Amritha is found guilty of being extraordinarily brilliant, dangerously kind, and permanently magical. Sentenced to: a lifetime of adventures beyond imagination."</em>
            </p>
            <div style={{ marginTop:16,display:"flex",justifyContent:"center" }}>
              <HPBtn onClick={onNext} bg="linear-gradient(135deg,#1a3a6b,#2a5a9b)">Next Chapter →</HPBtn>
            </div>
          </Parchment>
        </>
      )}
    </HPPage>
  );
}

/* ══════════════════════════════════════════════════════════
   STAGE 4 — THE MARAUDER'S MAP
══════════════════════════════════════════════════════════ */
function Stage4({ onNext }) {
  const [clue,setClue]       = useState(0);
  const [showFinal,setFinal] = useState(false);

  const clues = [
    { loc:"Gryffindor Common Room", icon:"🦁", note:"I solemnly swear I am up to no good.",     text:"Every great story begins by the fire, surrounded by warmth and those who feel like home. Your story started the same way — with a heart brave enough to feel everything deeply.", btn:"To the Astronomy Tower →" },
    { loc:"Astronomy Tower",        icon:"🌙", note:"The stars remember your name.",             text:"From this tower, she saw the whole world laid out beneath her — the way you see every story, every mystery, every person. You've always had that gift: seeing what others miss.", btn:"To the Library →" },
    { loc:"Hogwarts Library",       icon:"📚", note:"Restricted section: contains truths.",      text:"You've lived in books the way others live in houses — completely, joyfully, without reservation. Every story you've read has made you more brilliantly, uniquely you.", btn:"To the Great Hall →" },
    { loc:"The Great Hall",         icon:"✨", note:"Mischief Managed.",                         text:"The enchanted ceiling shows your stars. Every floating candle lights the way for you. This is where your story is celebrated. You've arrived, witch. You always arrive.", btn:"🎂 Reveal the Final Surprise →" },
  ];

  const current = clues[clue];

  return (
    <HPPage castle broom shooting>
      {!showFinal ? (
        <div className="fi" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:18,width:"100%" }} key={clue}>
          {/* Witch following the map */}
          <div style={{ textAlign:"center" }}>
            <AmrithaWitch size={110} expression="thinking" showBook/>
            <p style={{ color:"#8b6914",fontFamily:"'Cinzel'",fontSize:".58rem",letterSpacing:3,marginTop:4 }}>DETECTIVE AMRITHA</p>
          </div>

          {/* Map parchment */}
          <div style={{ width:"100%",background:"linear-gradient(145deg,#2a1e08,#1e1408,#2a1e08)",border:"2px solid #8b6914",borderRadius:4,padding:"22px 18px",boxShadow:"0 8px 28px rgba(0,0,0,.6),inset 0 0 24px rgba(139,105,20,.08)",position:"relative" }}>
            <p style={{ color:"#8b6914",fontFamily:"'Cinzel'",fontSize:".62rem",letterSpacing:4,textAlign:"center",marginBottom:6 }}>THE MARAUDER'S MAP</p>
            <p style={{ color:"#d4af37",fontFamily:"'Crimson Text'",fontSize:".88rem",fontStyle:"italic",textAlign:"center",marginBottom:16 }}>"{current.note}"</p>
            {/* Progress */}
            <div style={{ display:"flex",justifyContent:"center",gap:8,marginBottom:16 }}>
              {clues.map((_,i)=><div key={i} style={{ width:10,height:10,borderRadius:"50%",background:i<=clue?"#d4af37":"#2a1e08",border:"1px solid #8b6914",transition:"background .3s" }}/>)}
            </div>
            <div style={{ textAlign:"center",marginBottom:12 }}>
              <div className="wandPulse" style={{ fontSize:48,marginBottom:6 }}>{current.icon}</div>
              <p style={{ color:"#8b6914",fontFamily:"'Cinzel'",fontSize:".68rem",letterSpacing:4 }}>CLUE {clue+1} · {current.loc.toUpperCase()}</p>
            </div>
            <p style={{ color:"#c8b89a",fontFamily:"'Crimson Text'",fontSize:"1rem",lineHeight:1.9,fontStyle:"italic",background:"rgba(0,0,0,.2)",padding:"14px 16px",borderLeft:"2px solid #8b691466",borderRadius:"0 4px 4px 0",marginBottom:18 }}>{current.text}</p>
            {/* Footprints */}
            <div style={{ display:"flex",justifyContent:"center",gap:4,marginBottom:16,opacity:.35 }}>
              {["👣","👣","👣"].map((e,i)=><span key={i} style={{ fontSize:".8rem" }}>{e}</span>)}
            </div>
            <div style={{ display:"flex",justifyContent:"center" }}>
              <HPBtn onClick={()=>{ if(clue<clues.length-1)setClue(c=>c+1); else setFinal(true); }}>{current.btn}</HPBtn>
            </div>
          </div>
        </div>
      ) : (
        <div className="fi" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:16,width:"100%",textAlign:"center" }}>
          <Confetti/>
          <div style={{ animation:"witchFloat 4s ease-in-out infinite" }}>
            <AmrithaWitch size={140} expression="happy" showWand showBook/>
          </div>
          <h1 className="goldGlow" style={{ fontFamily:"'Cinzel Decorative'",fontSize:"clamp(1.5rem,6vw,2.4rem)",color:"#d4af37",letterSpacing:4 }}>Mischief Managed!</h1>
          <Parchment style={{ border:"1px solid #d4af37",textAlign:"center" }}>
            <p style={{ color:"#d4af37",fontFamily:"'Cinzel Decorative'",fontSize:"1.1rem",letterSpacing:2,marginBottom:14 }}>🎂 Happy Birthday, Amritha! 🎂</p>
            <p style={{ color:"#c8b89a",fontFamily:"'Crimson Text'",fontSize:"1.05rem",lineHeight:2 }}>
              You've followed every clue through the castle,<br/>
              solved every mystery, cast every spell.<br/><br/>
              <em style={{ color:"#d4af37" }}>
                "It does not do to dwell on dreams and forget to live.<br/>
                You, Amritha, have always known how to do both —<br/>
                dream wildly and live brilliantly. 💕"
              </em>
            </p>
            <div style={{ display:"flex",justifyContent:"center",gap:6,marginTop:14,fontSize:"1.4rem" }}>
              {["⚡","🦁","📚","🦉","🪄","🎂","✨","💕"].map((e,i)=><span key={i} style={{ animation:`heartbeat 1s ${i*.12}s infinite` }}>{e}</span>)}
            </div>
            <div style={{ marginTop:18,display:"flex",justifyContent:"center" }}>
              <HPBtn onClick={onNext} bg="linear-gradient(135deg,#4a1a8b,#6a2aab)" style={{ animation:"wandPulse 1.5s infinite" }}>
                🕵️ One Final Mystery Awaits... →
              </HPBtn>
            </div>
          </Parchment>
        </div>
      )}
    </HPPage>
  );
}

/* ══════════════════════════════════════════════════════════
   ROOT CONTROLLER
══════════════════════════════════════════════════════════ */
export default function HogwartsSurprise() {
  const [stage,setStage]           = useState(1);
  const [transitioning,setTrans]   = useState(false);
  const [fromStage,setFromStage]   = useState(1);
  const labels = ["","⚡ Case Filed!","🐍 Chamber Sealed!","🏛️ Dossier Filed!","🗺️ Map Folded!"];

  const next = () => { setFromStage(stage); setTrans(true); };
  const afterTrans = () => { setStage(s=>s+1); setTrans(false); };

  return (
    <>
      <style>{HP_CSS}</style>
      {transitioning && <SpellTransition label={labels[fromStage]} onDone={afterTrans}/>}
      {!transitioning && stage===1 && <Stage1 onNext={next}/>}
      {!transitioning && stage===2 && <Stage2 onNext={next}/>}
      {!transitioning && stage===3 && <Stage3 onNext={next}/>}
      {!transitioning && stage===4 && <Stage4 onNext={next}/>}
      {!transitioning && stage===5 && <HogwartsMystery/>}
    </>
  );
}
