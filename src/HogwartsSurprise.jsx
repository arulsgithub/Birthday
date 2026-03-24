import { useState, useEffect } from "react";
import { G, Page, Card, Btn, Title, Divider, RuneRing, WandLight, Confetti, Transition, useTypewriter } from "./HPCore";
import HogwartsMystery from "./HogwartsMystery";

/* ══════════════════════════════════════════════════
   STAGE 1 — THE CASE OF THE MISSING BIRTHDAY
══════════════════════════════════════════════════ */
function Stage1({ onNext }) {
  const [step,setStep]=[useState(0),(v)=>setStep(v)][1] || (() => {});
  const [_step,_setStep] = useState(0);
  const [suspect,setSuspect] = useState(null);
  const [solved,setSolved]   = useState(false);
  const step = _step; const setStep = _setStep;

  const intro = "MINISTRY OF MAGIC — DEPARTMENT OF MYSTERIES\nCase File #HP-2503 · MOST URGENT\n\nThe Birthday Witch has vanished from Hogwarts\non the eve of her most significant day.\nThree persons of interest remain.\n\nDetective Amritha — you are our only hope.";
  const {out,done} = useTypewriter(intro, 24, step===1);

  const suspects = [
    {id:0, name:"Dobby",       role:"House Elf",    icon:"🧦", verdict:"INNOCENT", col:"rgba(80,180,100,.8)", evidence:"Was documented ironing his own fingers. A sock near the scene — but not the right size." },
    {id:1, name:"Peeves",      role:"Poltergeist",  icon:"👻", verdict:"INNOCENT", col:"rgba(80,180,100,.8)", evidence:"Confirmed dropping dungbombs on the 7th floor at 11:47 PM. Two portraits gave sworn testimony." },
    {id:2, name:"Time Itself", role:"The Real Thief",icon:"⏳", verdict:"GUILTY ❤️", col:"rgba(220,160,200,.9)", evidence:"Stole 365 enchanted days from Amritha — and returned them as wisdom, brilliance, and fire." },
  ];

  return (
    <Page>
      {step===0 && (
        <>
          <div className="fiu" style={{textAlign:"center"}}>
            <RuneRing size={88}/>
            <Title eyebrow="MINISTRY OF MAGIC — DEPARTMENT OF MYSTERIES" size="clamp(1.3rem,5vw,2rem)" style={{marginTop:16}}>Case File #HP-2503</Title>
          </div>
          <Card>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.05rem",color:"rgba(210,195,160,.8)",lineHeight:2,textAlign:"center"}}>
              A most peculiar case has materialised on your desk.<br/>
              The Birthday Witch has disappeared on the very eve<br/>
              of her twenty-second year.<br/><br/>
              Only the sharpest mind at the Ministry can solve it.
            </p>
          </Card>
          <Btn onClick={()=>setStep(1)}>Open Case File</Btn>
        </>
      )}

      {step===1 && (
        <>
          <Title eyebrow="CLASSIFIED BRIEF">The Incident Report</Title>
          <Card glow>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:16,alignItems:"flex-start"}}>
              <span style={{background:"rgba(139,26,26,.8)",color:"rgba(240,225,190,.9)",padding:"3px 14px",fontFamily:"'Cinzel',serif",fontSize:".58rem",letterSpacing:".3em"}}>TOP SECRET</span>
              <span style={{color:"rgba(180,140,60,.5)",fontFamily:"'Cinzel',serif",fontSize:".58rem",letterSpacing:".3em"}}>MINISTRY OF MAGIC</span>
            </div>
            <pre style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",color:"rgba(210,195,160,.85)",lineHeight:2,whiteSpace:"pre-wrap"}}>
              {out}<span style={{color:"rgba(200,165,80,.8)",animation:"breathe .8s infinite"}}>{!done?"▌":""}</span>
            </pre>
            {done && (
              <div className="fiu" style={{marginTop:18,textAlign:"center"}}>
                <Divider style={{marginBottom:18}}/>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:".98rem",color:"rgba(180,190,215,.6)",marginBottom:16,fontStyle:"italic"}}>
                  Three persons of interest await interrogation.
                </p>
                <Btn onClick={()=>setStep(2)}>Begin Interrogation</Btn>
              </div>
            )}
          </Card>
        </>
      )}

      {step===2 && (
        <>
          <Title eyebrow="SUSPECT ANALYSIS">The Evidence Board</Title>
          <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%"}}>
            {suspects.map(s=>(
              <div key={s.id} onClick={()=>setSuspect(s.id)} className="fiu" style={{
                background: suspect===s.id?"linear-gradient(145deg,rgba(20,16,28,.95),rgba(15,12,22,.98))":"linear-gradient(145deg,rgba(10,14,24,.92),rgba(8,11,20,.96))",
                border:`1px solid ${suspect===s.id?"rgba(180,140,60,.4)":"rgba(180,140,60,.1)"}`,
                borderRadius:4,padding:"18px 20px",cursor:"pointer",
                transition:"all .4s cubic-bezier(.23,1,.32,1)",
                boxShadow:suspect===s.id?"0 0 30px rgba(180,140,60,.08)":"none",
              }}>
                <div style={{display:"flex",alignItems:"center",gap:14}}>
                  <span style={{fontSize:26,filter:`drop-shadow(0 0 8px ${s.col})`}}>{s.icon}</span>
                  <div style={{flex:1}}>
                    <p style={{fontFamily:"'Cinzel',serif",color:"rgba(200,165,80,.9)",fontSize:".88rem",letterSpacing:".08em"}}>{s.name}</p>
                    <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,190,215,.45)",fontSize:".82rem",fontStyle:"italic"}}>{s.role}</p>
                  </div>
                  <span style={{fontFamily:"'Cinzel',serif",fontSize:".58rem",letterSpacing:".2em",color:s.col}}>{s.verdict}</span>
                </div>
                {suspect===s.id && (
                  <div className="fiu" style={{marginTop:14,paddingTop:14,borderTop:"1px solid rgba(180,140,60,.1)"}}>
                    <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:".98rem",color:"rgba(210,195,160,.78)",lineHeight:1.85,fontStyle:"italic"}}>"{s.evidence}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {suspect===2&&!solved && <Btn onClick={()=>setSolved(true)} style={{animation:"lockPulse 2s infinite"}}>Declare Verdict</Btn>}
          {solved && (
            <Card glow className="fiu" style={{textAlign:"center"}}>
              <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.5)",fontSize:".58rem",letterSpacing:".45em",marginBottom:14}}>CASE RESOLVED</p>
              <Divider style={{marginBottom:18}}/>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.02rem",color:"rgba(210,195,160,.82)",lineHeight:2}}>
                Time stood accused. Time was found guilty.<br/>
                It stole 365 enchanted days from Amritha —<br/>and returned them as brilliance, depth, and fire.
              </p>
              <Divider style={{margin:"18px 0"}}/>
              <Btn onClick={onNext}>Proceed to Next Chapter</Btn>
            </Card>
          )}
        </>
      )}
    </Page>
  );
}

/* ══════════════════════════════════════════════════
   STAGE 2 — UNLOCK THE CHAMBER
══════════════════════════════════════════════════ */
function Stage2({ onNext }) {
  const spells=[
    {q:"The unlocking charm. First taught in the dungeons of Hogwarts.",  answer:"ALOHOMORA",    hint:"A·lo·ho·mo·ra"},
    {q:"The disarming spell. Used to defeat the Dark Lord himself.",       answer:"EXPELLIARMUS", hint:"Ex·pel·li·ar·mus"},
    {q:"The illumination charm. It lights the wand tip in darkness.",     answer:"LUMOS",        hint:"Lu·mos"},
  ];
  const CODE="AEL";
  const [answers,setAnswers]=useState(["","",""]);
  const [checked,setChecked]=useState([false,false,false]);
  const [correct,setCorrect]=useState([false,false,false]);
  const [phase,setPhase]=useState("spells");
  const [code,setCode]=useState("");
  const [unlocked,setUnlocked]=useState(false);
  const [wrong,setWrong]=useState(false);

  const check=i=>{
    const c=[...checked];c[i]=true;setChecked(c);
    const r=[...correct];r[i]=answers[i].trim().toUpperCase()===spells[i].answer;setCorrect(r);
  };
  const tryCode=()=>{
    if(code.toUpperCase()===CODE) setUnlocked(true);
    else{setWrong(true);setTimeout(()=>setWrong(false),700);setCode("");}
  };

  return (
    <Page>
      <Title eyebrow="CHAMBER OF SECRETS">The Sealed Door</Title>
      <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,190,215,.55)",fontSize:"1rem",fontStyle:"italic",textAlign:"center",letterSpacing:".08em"}}>
        Three incantations stand between you and the truth
      </p>

      {phase==="spells" && (
        <div style={{display:"flex",flexDirection:"column",gap:12,width:"100%"}}>
          {spells.map((sp,i)=>(
            <Card key={i} style={{border:`1px solid rgba(180,140,60,${correct[i]?.4:.12})`,transition:"border-color .4s"}}>
              <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.4)",fontSize:".58rem",letterSpacing:".42em",marginBottom:8}}>INCANTATION {i+1}</p>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.02rem",color:"rgba(210,195,160,.82)",lineHeight:1.85,marginBottom:14,fontStyle:"italic"}}>"{sp.q}"</p>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <input
                  style={{flex:1,background:"rgba(0,0,0,.5)",border:`1px solid ${checked[i]?(correct[i]?"rgba(180,140,60,.55)":"rgba(160,40,40,.55)"):"rgba(180,140,60,.15)"}`,color:"rgba(200,165,80,.9)",padding:"12px 16px",fontFamily:"'Cinzel',serif",fontSize:".82rem",letterSpacing:".2em",outline:"none",borderRadius:2,transition:"border-color .3s"}}
                  value={answers[i]} onChange={e=>{const a=[...answers];a[i]=e.target.value;setAnswers(a);}}
                  onKeyDown={e=>e.key==="Enter"&&check(i)} placeholder="Cast your spell..." disabled={correct[i]}
                />
                {!correct[i]?<Btn onClick={()=>check(i)} style={{padding:"12px 18px",fontSize:".75rem",flexShrink:0}}>Cast</Btn>
                            :<span style={{color:"rgba(200,165,80,.8)",fontSize:"1rem",flexShrink:0}}>✦</span>}
              </div>
              {checked[i]&&!correct[i]&&<p style={{color:"rgba(180,190,215,.4)",fontFamily:"'Cormorant Garamond',serif",fontSize:".88rem",marginTop:8,fontStyle:"italic"}}>Hint: {sp.hint}</p>}
              {correct[i]&&<p style={{color:"rgba(180,140,60,.6)",fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".3em",marginTop:8}}>✦ Correct — Code letter: {sp.answer[0]}</p>}
            </Card>
          ))}
          {correct.every(Boolean) && (
            <div className="fiu" style={{textAlign:"center"}}>
              <Btn onClick={()=>setPhase("chamber")} style={{animation:"lockPulse 2s infinite"}}>Approach the Chamber</Btn>
            </div>
          )}
        </div>
      )}

      {phase==="chamber"&&!unlocked && (
        <div className="fi" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:22,width:"100%"}}>
          {/* Orb */}
          <div style={{width:150,height:150,borderRadius:"50%",background:"radial-gradient(circle at 38% 32%,rgba(80,50,180,.22),rgba(40,25,100,.08))",border:"1px solid rgba(80,60,200,.28)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 60px rgba(80,50,180,.18),inset 0 0 40px rgba(60,40,160,.1)",animation:"borderPulse 3s ease-in-out infinite",position:"relative"}}>
            <span style={{fontSize:46,filter:"drop-shadow(0 0 14px rgba(100,70,220,.5))"}}>🐍</span>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"center"}}>
            {["A","E","L"].map((l,i)=>(
              <div key={i} style={{width:52,height:52,border:"1px solid rgba(180,140,60,.3)",borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(180,140,60,.04)",color:"rgba(200,165,80,.85)",fontFamily:"'Cinzel',serif",fontSize:"1.35rem"}}>{l}</div>
            ))}
          </div>
          <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,190,215,.55)",fontSize:".98rem",fontStyle:"italic",textAlign:"center"}}>
            Enter the three-letter code — first letter of each incantation
          </p>
          <input
            style={{width:160,background:"rgba(0,0,0,.55)",border:`1.5px solid ${wrong?"rgba(160,40,40,.7)":"rgba(80,60,200,.38)"}`,color:"rgba(200,165,80,.9)",padding:"14px 18px",fontFamily:"'Cinzel',serif",fontSize:"1.28rem",letterSpacing:".5em",textAlign:"center",outline:"none",borderRadius:2,animation:wrong?"shake .6s ease":"none",transition:"border-color .3s"}}
            value={code} onChange={e=>setCode(e.target.value.toUpperCase().slice(0,3))}
            onKeyDown={e=>e.key==="Enter"&&tryCode()} placeholder="_ _ _"
          />
          <Btn onClick={tryCode} variant="crimson">Open the Chamber</Btn>
          {wrong&&<p style={{color:"rgba(192,60,60,.7)",fontFamily:"'Cinzel',serif",fontSize:".7rem",letterSpacing:".3em"}}>The serpent stirs. Wrong code.</p>}
        </div>
      )}

      {unlocked && (
        <div className="fi" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:20,width:"100%"}}>
          <Confetti/>
          <RuneRing size={90}/>
          <Title>Chamber Unlocked</Title>
          <Card glow style={{textAlign:"center"}}>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.05rem",color:"rgba(210,195,160,.85)",lineHeight:2}}>
              Deep within the Chamber, carved into stone:<br/><br/>
              <em style={{color:"rgba(200,165,80,.85)"}}>
                "The brightest witch of her age<br/>
                cannot be contained by any spell.<br/>
                Happy Birthday, Amritha."
              </em>
            </p>
            <Divider style={{margin:"20px 0"}}/>
            <Btn onClick={onNext}>Next Chapter</Btn>
          </Card>
        </div>
      )}
    </Page>
  );
}

/* ══════════════════════════════════════════════════
   STAGE 3 — MINISTRY DOSSIER
══════════════════════════════════════════════════ */
function Stage3({ onNext }) {
  const [revealed,setRevealed]=useState(false);
  const [stamp,setStamp]=useState(false);
  const reveal=()=>{ setRevealed(true); setTimeout(()=>setStamp(true),600); };

  const profile=[["SUBJECT","AMRITHA"],["CLASSIFICATION","EXTRAORDINARILY GIFTED"],["MAGICAL STATUS","ACTIVE — THREAT LEVEL: MAXIMUM"],["DATE OF BIRTH","25TH MARCH — CLASSIFIED"],["KNOWN FOR","Solving mysteries before others notice them"]];
  const evidence=[
    {tag:"EXHIBIT I",  icon:"⚡",title:"MAGICAL SIGNATURE",body:"Pattern: Unique. Database match: None. Classification: One of a kind."},
    {tag:"EXHIBIT II", icon:"📖",title:"READING RECORD",   body:"847 volumes, all finished. Margin notes: extensive. Threat to Dark Arts: Absolute."},
    {tag:"EXHIBIT III",icon:"🔎",title:"DEDUCTIVE ABILITY",body:"94th percentile of trained Aurors. Solved three cold cases before breakfast. Twice."},
    {tag:"EXHIBIT IV", icon:"🎂",title:"ITEM CONFISCATED", body:"One birthday enchanted with precisely one year of adventure, magic, and joy."},
  ];

  return (
    <Page>
      {!revealed ? (
        <>
          <RuneRing size={88}/>
          <Title eyebrow="MINISTRY OF MAGIC">Subject Dossier</Title>
          <Card style={{textAlign:"center",border:"1px solid rgba(160,40,40,.28)"}}>
            <div style={{display:"inline-block",border:"2px solid rgba(160,40,40,.55)",color:"rgba(192,64,64,.85)",padding:"5px 22px",fontFamily:"'Cinzel',serif",fontSize:".78rem",letterSpacing:".4em",transform:"rotate(-6deg)",marginBottom:18}}>CLASSIFIED</div>
            <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.4)",fontSize:".58rem",letterSpacing:".42em",marginBottom:18}}>FILE REF: AMR-2503 · EYES ONLY</p>
            {[1,2,3].map(i=><div key={i} style={{height:9,background:"rgba(255,255,255,.04)",borderRadius:1,margin:"7px 0"}}/>)}
            <Divider style={{margin:"18px 0"}}/>
            <Btn onClick={reveal}>Declassify File</Btn>
          </Card>
        </>
      ) : (
        <>
          {stamp && (
            <div className="fiu" style={{textAlign:"center"}}>
              <span style={{display:"inline-block",border:"2px solid rgba(180,140,60,.55)",color:"rgba(200,165,80,.85)",padding:"5px 22px",fontFamily:"'Cinzel',serif",fontSize:".78rem",letterSpacing:".4em",animation:"stampIn .6s cubic-bezier(.34,1.56,.64,1) forwards",boxShadow:"0 0 20px rgba(180,140,60,.12)"}}>DECLASSIFIED</span>
            </div>
          )}
          <Title eyebrow="AUROR DIVISION FILE">Amritha</Title>
          <Card glow>
            {profile.map(([k,v],i)=>(
              <div key={i} style={{display:"flex",gap:12,padding:"9px 0",borderBottom:"1px solid rgba(180,140,60,.07)"}}>
                <span style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.45)",fontSize:".58rem",letterSpacing:".32em",minWidth:115,flexShrink:0,paddingTop:2}}>{k}</span>
                <span style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,190,215,.7)",fontSize:".92rem",lineHeight:1.6}}>{v}</span>
              </div>
            ))}
          </Card>
          <div style={{width:"100%"}}>
            <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.4)",fontSize:".58rem",letterSpacing:".5em",marginBottom:12,textAlign:"center"}}>EVIDENCE COLLECTED</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10}}>
              {evidence.map((e,i)=>(
                <div key={i} className="fiu" style={{background:"linear-gradient(145deg,rgba(10,14,24,.92),rgba(8,11,20,.96))",border:"1px solid rgba(180,140,60,.1)",borderRadius:3,padding:"18px 16px",animationDelay:`${i*.1}s`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                    <span style={{fontFamily:"'Cinzel',serif",color:"rgba(160,40,40,.65)",fontSize:".56rem",letterSpacing:".32em"}}>{e.tag}</span>
                    <span style={{fontSize:18,filter:"drop-shadow(0 0 6px rgba(180,140,60,.3))"}}>{e.icon}</span>
                  </div>
                  <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.65)",fontSize:".62rem",letterSpacing:".25em",marginBottom:8}}>{e.title}</p>
                  <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,190,215,.5)",fontSize:".9rem",lineHeight:1.7,fontStyle:"italic"}}>{e.body}</p>
                </div>
              ))}
            </div>
          </div>
          <Card style={{textAlign:"center"}}>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.02rem",color:"rgba(210,195,160,.82)",lineHeight:2}}>
              <em style={{color:"rgba(200,165,80,.8)"}}>Official Ministry Verdict:</em><br/>
              "Amritha is hereby found guilty of being extraordinary,<br/>
              dangerously brilliant, and permanently magical.<br/>
              Sentenced to: a lifetime of adventures."
            </p>
            <Divider style={{margin:"20px 0"}}/>
            <Btn onClick={onNext}>Next Chapter</Btn>
          </Card>
        </>
      )}
    </Page>
  );
}

/* ══════════════════════════════════════════════════
   STAGE 4 — THE MARAUDER'S MAP
══════════════════════════════════════════════════ */
function Stage4({ onNext }) {
  const [clue,setClue]=useState(0);
  const [final,setFinal]=useState(false);

  const clues=[
    {loc:"Gryffindor Common Room",rune:"I solemnly swear I am up to no good.",text:"Every great story begins beside a fire, with those who feel like home. Yours did too — with a heart brave enough to feel everything, and a mind sharp enough to see through everything.",btn:"Follow the Map →"},
    {loc:"Astronomy Tower",rune:"The stars remember every name whispered here.",text:"From this tower she could see the entire world laid out below — the way you see every story, every person, every hidden truth. You have always had that rare gift: seeing what others miss.",btn:"Continue →"},
    {loc:"The Restricted Section",rune:"Knowledge is the most dangerous magic.",text:"You've lived inside books the way others live in houses — completely, without reservation. Every story you've read has made you more fully, brilliantly, irreplaceably yourself.",btn:"Final Location →"},
    {loc:"The Great Hall",rune:"Mischief Managed.",text:"The enchanted ceiling mirrors your stars tonight. Every candle in this hall burns for you. This is where you are celebrated, admired, and loved — by everyone who has had the privilege of knowing you.",btn:"Reveal the Surprise →"},
  ];
  const c=clues[clue];

  return (
    <Page>
      {!final ? (
        <div className="fi" style={{width:"100%",display:"flex",flexDirection:"column",gap:22}} key={clue}>
          <Title eyebrow="THE MARAUDER'S MAP">{c.loc}</Title>
          <Card glow>
            <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:18}}>
              {clues.map((_,i)=>(
                <div key={i} style={{width:i===clue?26:7,height:2,borderRadius:2,background:i<=clue?"rgba(180,140,60,.65)":"rgba(180,140,60,.15)",transition:"all .5s ease"}}/>
              ))}
            </div>
            <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.4)",fontSize:".58rem",letterSpacing:".45em",textAlign:"center",marginBottom:14}}>CLUE {clue+1} OF {clues.length}</p>
            <Divider style={{marginBottom:18}}/>
            <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(200,180,130,.7)",fontSize:".98rem",fontStyle:"italic",textAlign:"center",marginBottom:16}}>"{c.rune}"</p>
            <div style={{background:"rgba(0,0,0,.28)",borderLeft:"2px solid rgba(180,140,60,.2)",padding:"16px 18px",borderRadius:"0 3px 3px 0",marginBottom:18}}>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.02rem",color:"rgba(210,195,160,.82)",lineHeight:2}}>{c.text}</p>
            </div>
            <div style={{textAlign:"center"}}>
              <Btn onClick={()=>{ if(clue<clues.length-1)setClue(c=>c+1); else setFinal(true); }}>{c.btn}</Btn>
            </div>
          </Card>
        </div>
      ) : (
        <div className="fi" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:24,width:"100%",textAlign:"center"}}>
          <Confetti/>
          <RuneRing size={100}/>
          <Title eyebrow="THE MAP IS COMPLETE" size="clamp(1.5rem,6vw,2.6rem)">Mischief Managed</Title>
          <Card glow style={{textAlign:"center"}}>
            <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.45)",fontSize:".58rem",letterSpacing:".48em",marginBottom:16}}>TWENTY-SECOND YEAR</p>
            <Divider style={{marginBottom:20}}/>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",color:"rgba(210,195,160,.85)",lineHeight:2.15}}>
              Happy Birthday, Amritha.<br/><br/>
              <em style={{color:"rgba(200,165,80,.82)"}}>
                "It does not do to dwell on dreams<br/>and forget to live.<br/><br/>
                You have always known how to do both —<br/>
                dream with precision,<br/>and live with intention."
              </em>
            </p>
            <Divider style={{margin:"22px 0"}}/>
            <div style={{display:"flex",justifyContent:"center",gap:12,marginBottom:22,flexWrap:"wrap"}}>
              {["⚡","🦁","📖","🦉","🪄","✦","💕"].map((e,i)=>(
                <span key={i} style={{fontSize:"1.25rem",animation:`breathe ${1.6+i*.18}s ${i*.14}s ease-in-out infinite`,filter:"drop-shadow(0 0 6px rgba(180,140,60,.35))"}}>{e}</span>
              ))}
            </div>
            <Btn onClick={onNext} style={{animation:"lockPulse 2.5s infinite"}}>One Final Mystery Awaits</Btn>
          </Card>
        </div>
      )}
    </Page>
  );
}

/* ══════════════════════════════════════════════════
   ROOT CONTROLLER
══════════════════════════════════════════════════ */
export default function HogwartsSurprise() {
  const [stage,setStage]=useState(1);
  const [trans,setTrans]=useState(false);
  const [from,setFrom]=useState(1);
  const labels=["","Case Resolved","Chamber Sealed","Dossier Filed","Map Folded"];
  const next=()=>{ setFrom(stage); setTrans(true); };
  const after=()=>{ setStage(s=>s+1); setTrans(false); };
  return (
    <>
      <style>{G}</style>
      {trans && <Transition label={labels[from]} onDone={after}/>}
      {!trans && stage===1 && <Stage1 onNext={next}/>}
      {!trans && stage===2 && <Stage2 onNext={next}/>}
      {!trans && stage===3 && <Stage3 onNext={next}/>}
      {!trans && stage===4 && <Stage4 onNext={next}/>}
      {!trans && stage===5 && <HogwartsMystery/>}
    </>
  );
}
