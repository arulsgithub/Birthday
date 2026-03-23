import { useState, useEffect } from "react";
import { G,T,Page,RuneRing,Card,Divider,Btn,Title,Confetti,MagicDust,CinematicBG,HLCastle,useTypewriter } from "./HPCore";

/* ══ GAME DATA ══════════════════════════════════════════════════ */
const PREMISE = `The Philosopher's Stone has vanished from the third-floor corridor.\nDumbledore's enchantments were bypassed — perfectly.\nFive suspects remain within the castle walls.\nA storm gathers over the Forbidden Forest.\n\nYou are Detective Amritha.\nYou have until midnight.`;

const ROOMS = [
  { id:"potions",  name:"Potions Dungeon",      icon:"🧪", desc:"Stone walls, cold vapour. A cauldron still radiates warmth.", clues:[
    { id:"c1",  text:"A smashed Boomslang skin vial — residue matches Polyjuice Potion. Someone was here in disguise.",      found:false, key:true  },
    { id:"c2",  text:"Overturned stool near Snape's private cabinet. No forced entry — someone had a key.",                   found:false, key:false },
    { id:"c3",  text:"Monogrammed handkerchief: Q.Q. — found behind a warm cauldron. The ink on it is violet.",              found:false, key:true  },
  ]},
  { id:"corridor", name:"Third-Floor Corridor", icon:"🚪", desc:"The door stands open. Fluffy is asleep. A melody still lingers — refined, almost professorial.", clues:[
    { id:"c4",  text:"A wooden flute beside Fluffy. Too refined for Hagrid — almost professorial in its craftsmanship.",     found:false, key:true  },
    { id:"c5",  text:"The trapdoor: no forced entry. Enchantments lifted with precise, advanced spellwork.",                 found:false, key:true  },
    { id:"c6",  text:"A single black feather — no known Hogwarts bird. A peacock, perhaps? None are kept here officially.",  found:false, key:false },
  ]},
  { id:"library",  name:"Restricted Section",   icon:"📖", desc:"A page torn from its spine. The remaining books have fallen strangely silent.", clues:[
    { id:"c7",  text:"A torn page from 'Secrets of the Darkest Art' — specifically on stone transmutation.",                 found:false, key:true  },
    { id:"c8",  text:"Sign-out log: final entry smudged. The ink — distinctive violet — is the same shade as the handkerchief.", found:false, key:true  },
    { id:"c9",  text:"A Bertie Bott's bean — earwax flavour. Dumbledore's documented preference. He was here recently.",   found:false, key:false },
  ]},
  { id:"mirror",   name:"Mirror of Erised",     icon:"🪞", desc:"The Mirror glows with unusual intensity. Someone stood before it recently.", clues:[
    { id:"c10", text:"An unsigned note at the Mirror's base: 'I see myself holding it. I always have.'",                    found:false, key:true  },
    { id:"c11", text:"Trace droplets of Felix Felicis — Liquid Luck. This theft was meticulously planned.",                  found:false, key:true  },
    { id:"c12", text:"The Mirror shows a face tonight instead of desire — familiar, calculating, wearing a turban.",         found:false, key:false },
  ]},
  { id:"owlery",   name:"The Owlery",           icon:"🦉", desc:"One owl is absent. A letter was sent tonight to an unknown recipient.", clues:[
    { id:"c13", text:"Burned parchment — one phrase survived: '...the stone is hidden where only the worthy may claim it.'", found:false, key:true  },
    { id:"c14", text:"An unsent letter: 'Q.Q. to R.Q.' — 'Meet me at the stone. Tonight is the night.'",                    found:false, key:true  },
    { id:"c15", text:"An impression in the straw — someone waited here for hours. Small boots, precise heel placement.",     found:false, key:true  },
  ]},
];

const SUSPECTS = [
  { id:"quirrell", name:"Professor Quirrell", role:"Defence Against Dark Arts", icon:"🎓", guilty:true,
    motive:"Possessed by Voldemort — seeking the Stone to restore his master",
    alibi:"Claims he was in his office preparing lesson plans",
    tells:["Initials Q.Q. match the handkerchief in the Potions dungeon","His refined flute matches the instrument found with Fluffy","His violet ink appears in the Restricted Section sign-out log","Letter 'Q.Q. to R.Q.' — Quirrell writing to Voldemort","Felix Felicis traces match his apothecary purchases","He knew Fluffy's weakness — Dumbledore told him personally"],
    questions:[
      { q:"Where were you between ten and midnight?", options:[
        { text:"In my office, p-p-preparing lessons.", response:"His stutter worsens on 'preparing'. Violet ink on his fingers. His hand moves to his turban.", sus:true  },
        { text:"I walked the grounds. Night air settles the nerves.", response:"Walking the grounds on the night the Stone vanishes. You note this carefully.", sus:true  },
      ]},
      { q:"Do you know how one might bypass Fluffy?", options:[
        { text:"A three-headed dog? I have never been near it.", response:"His hand rises to his turban. Beneath it — something shifts. Something ancient.", sus:true  },
        { text:"Dumbledore may have mentioned something about music.", response:"He volunteers this unprompted. Why would an innocent man know this?", sus:true  },
      ]},
      { q:"What do you know of the Philosopher's Stone?", options:[
        { text:"Only what the history books record.", response:"There are two shadows behind his eyes. One is his. The other is ancient. Hungry.", sus:true  },
        { text:"A dangerous object. Better it were never found.", response:"The turban shifts. For a moment you hear it — a whisper that is not his voice.", sus:true  },
      ]},
    ]},
  { id:"snape", name:"Professor Snape", role:"Potions Master", icon:"🖤", guilty:false,
    motive:"Known antipathy — toward what, precisely, remains unclear",
    alibi:"Counter-cursing during Quidditch. Multiple eyewitnesses.",
    tells:["Snape was protecting the Stone — counter-cursing Quirrell throughout","His alibi is absolute — students and staff both witnessed him","He suspected Quirrell before anyone else. He is innocent."],
    questions:[
      { q:"Why were you muttering at the Quidditch match?", options:[
        { text:"Preparing notes. It does not concern you.", response:"Arrogant — but his alibi covers the entire theft window completely.", sus:false },
        { text:"Counter-jinxes. Someone was cursing Potter's broom.", response:"He states this as flat fact. Cross-referencing confirms it.", sus:false },
      ]},
      { q:"Were you at the third-floor corridor last night?", options:[
        { text:"I was bitten on the third floor while investigating.", response:"He shows the wound. Genuine. He suspected Quirrell before you did.", sus:false },
        { text:"My reasons are my own.", response:"Pride, not guilt.", sus:false },
      ]},
    ]},
  { id:"mcgonagall", name:"Prof. McGonagall", role:"Head of Gryffindor", icon:"🐱", guilty:false,
    motive:"Loyalty to students above all — but loyalty is not guilt",
    alibi:"Playing chess with Nearly Headless Nick. Corroborated by three portraits.",
    tells:["Chess alibi confirmed by Nick and three independent portraits","Animagus form leaves cat paw prints — none found at the scene","She suspected Snape. Snape is innocent. So is she."],
    questions:[
      { q:"Were you near the third-floor corridor?", options:[
        { text:"Certainly not. I was occupied elsewhere.", response:"Holds your gaze without flinching. No evasion.", sus:false },
        { text:"I patrol regularly. As is my duty.", response:"Her route on Tuesdays does not pass the third floor.", sus:false },
      ]},
      { q:"Do you have suspicions about who is responsible?", options:[
        { text:"I have a theory. Involving a greasy-haired colleague.", response:"She suspects Snape — who is innocent. A sincere misdirection.", sus:false },
        { text:"I trust Dumbledore's enchantments. This alarms me greatly.", response:"Genuine distress. Worry, not guilt.", sus:false },
      ]},
    ]},
  { id:"hagrid", name:"Rubeus Hagrid", role:"Gamekeeper", icon:"🌲", guilty:false,
    motive:"Accidentally disclosed Fluffy's weakness to a stranger — unknowingly",
    alibi:"In his hut all evening. Norbert the dragon confirms.",
    tells:["Told a turban-wearing stranger about Fluffy — Quirrell in disguise","Genuinely devastated. A victim of manipulation, not a perpetrator","The description of the stranger matches Quirrell precisely"],
    questions:[
      { q:"Did you share information about Fluffy with anyone?", options:[
        { text:"There was a fella at the Hog's Head... interested in creatures...", response:"Horror crosses his face as he understands. This guilt is not the theft kind.", sus:true  },
        { text:"I would never betray Fluffy. Never.", response:"He says this passionately. Then goes very pale.", sus:false },
      ]},
      { q:"Can you describe this stranger?", options:[
        { text:"Had a turban. Quiet sort. Bought me a drink.", response:"A turban. Your pulse quickens. Only one professor wears a turban.", sus:true  },
        { text:"Didn't see much. He kept to the shadow.", response:"Hagrid is not the villain here.", sus:false },
      ]},
    ]},
  { id:"peeves", name:"Peeves", role:"Poltergeist", icon:"👻", guilty:false,
    motive:"Pure entropy — but even Peeves has limitations",
    alibi:"Dropping water balloons on Filch, fifth floor. In Filch's complaint log.",
    tells:["Alibi confirmed in Filch's official log: fifth floor, 11:45 PM","Cannot hold objects with precision for this level of theft","This crime required silence — Peeves is constitutionally incapable of it"],
    questions:[
      { q:"Were you near the third floor last night?", options:[
        { text:"Oooooh the corridor! Peeves knows all about the doggy!", response:"Insufferably cheerful. But alibi is documented and precise.", sus:false },
        { text:"Peeves was busy! Very important business!", response:"Fifth floor confirmed. Rock solid.", sus:false },
      ]},
      { q:"Did you observe anyone near the corridor?", options:[
        { text:"The turban-man! Peeves saw him! Going somewhere forbidden!", response:"Peeves spotted Quirrell. Crucial — from the least credible witness.", sus:true  },
        { text:"Peeves sees everything. That's the point!", response:"He dissolves into cackling. But beneath it — a genuine witness.", sus:false },
      ]},
    ]},
];

const CIPHER = {
  prompt:"Scratched into the base of the trapdoor — Dumbledore's final message to the investigator he trusted:",
  encoded:"DHLLHO DHZ AOL AOPLS",
  answer:"QUIRRELL WAS THE THIEF",
  shift:7,
  hint:"Caesar cipher. Shift each letter back by 7. D→Q, H→U, L→I, O→H...",
};

/* ══ SHARED STYLED NAV BAR ══════════════════════════════════════ */
function NavBar({ left, center, right, accent="rgba(201,168,76,.1)" }) {
  return (
    <div style={{
      display:"flex",justifyContent:"space-between",alignItems:"center",
      padding:"12px 20px",
      background:"rgba(4,5,10,.9)",
      borderBottom:`1px solid ${accent}`,
      backdropFilter:"blur(16px)",
      position:"sticky",top:0,zIndex:500,
    }}>
      <div style={{ minWidth:80 }}>{left}</div>
      <div style={{ textAlign:"center",flex:1 }}>{center}</div>
      <div style={{ minWidth:80,display:"flex",justifyContent:"flex-end" }}>{right}</div>
    </div>
  );
}

/* ══ CASE NOTES ═════════════════════════════════════════════════ */
function CaseNotes({ clues, onClose }) {
  const found = clues.filter(c=>c.found);
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(2,3,8,.95)",backdropFilter:"blur(18px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,zIndex:800 }} className="fi">
      <style>{G}</style>
      <div style={{ width:"100%",maxWidth:520,maxHeight:"88vh",background:"linear-gradient(160deg,#141028,#0f0c20)",borderRadius:3,display:"flex",flexDirection:"column",border:"1px solid rgba(201,168,76,.18)",boxShadow:"0 50px 100px rgba(0,0,0,.9)" }}>
        <div style={{ padding:"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(201,168,76,.1)" }}>
          <div>
            <p style={{ fontFamily:"'Cinzel',serif",color:T.gold,fontSize:".72rem",letterSpacing:".36em" }}>CASE NOTES</p>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",color:T.goldD,fontSize:".76rem",fontStyle:"italic" }}>Evidence collected so far</p>
          </div>
          <button style={{ background:"none",border:"none",color:T.goldD,cursor:"pointer",fontSize:"1.1rem",opacity:.6,transition:"opacity .2s" }} onClick={onClose}>✕</button>
        </div>
        <div style={{ flex:1,overflowY:"auto",padding:"20px 24px",display:"flex",flexDirection:"column",gap:10 }}>
          {found.length===0 && (
            <p style={{ color:T.silverD,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",textAlign:"center",marginTop:24,opacity:.6 }}>No evidence collected yet.</p>
          )}
          {found.map(c=>(
            <div key={c.id} style={{ display:"flex",gap:12,padding:"13px 16px",background:"rgba(201,168,76,.03)",borderLeft:`2px solid rgba(201,168,76,${c.key?.4:.12})`,borderRadius:"0 2px 2px 0" }}>
              <span style={{ color:`rgba(201,168,76,${c.key?.58:.2})`,flexShrink:0,marginTop:2,fontSize:".75rem" }}>✦</span>
              <div>
                <p style={{ color:T.silver,fontFamily:"'Cormorant Garamond',serif",fontSize:".95rem",lineHeight:1.75 }}>{c.text}</p>
                {c.key&&<p style={{ color:T.goldD,fontFamily:"'Cinzel',serif",fontSize:".54rem",letterSpacing:".34em",marginTop:5 }}>KEY EVIDENCE</p>}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding:"12px 24px",borderTop:"1px solid rgba(201,168,76,.08)" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <span style={{ color:T.goldD,fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".3em" }}>{found.length} / {clues.length}</span>
            <div style={{ width:"55%",height:2,background:"rgba(201,168,76,.08)",borderRadius:1 }}>
              <div style={{ width:`${(found.length/clues.length)*100}%`,height:"100%",background:"rgba(201,168,76,.45)",borderRadius:1,transition:"width .7s ease" }}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ ROOM EXPLORER ══════════════════════════════════════════════ */
function RoomExplorer({ room, allClues, onFindClue, onBack }) {
  const [ex,setEx] = useState(null);
  const roomClues  = allClues.filter(c=>room.clues.some(rc=>rc.id===c.id));

  return (
    <div style={{ minHeight:"100vh",background:T.bg,paddingBottom:60 }} className="fi">
      <style>{G}</style>
      <CinematicBG/><MagicDust count={32}/><HLCastle/>
      <NavBar
        left={<Btn onClick={onBack} variant="ghost" style={{ padding:"9px 16px",fontSize:".7rem" }}>← Back</Btn>}
        center={
          <div>
            <p style={{ fontFamily:"'Cinzel',serif",color:T.gold,fontSize:"clamp(.78rem,3.5vw,1rem)",letterSpacing:".2em" }}>{room.icon} {room.name}</p>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",color:T.goldD,fontSize:".7rem",fontStyle:"italic" }}>Investigation in progress</p>
          </div>
        }
      />
      <div style={{ width:"100%",maxWidth:560,margin:"0 auto",padding:"28px 20px",display:"flex",flexDirection:"column",gap:22,position:"relative",zIndex:10 }}>
        <p style={{ fontFamily:"'IM Fell English',serif",fontSize:"1.06rem",color:T.silverD,lineHeight:1.92,fontStyle:"italic",textAlign:"center" }}>{room.desc}</p>
        <Divider/>
        <p style={{ fontFamily:"'Cinzel',serif",color:T.goldD,fontSize:".56rem",letterSpacing:".5em",textAlign:"center" }}>EXAMINE THE ROOM</p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))",gap:10 }}>
          {roomClues.map((clue,i)=>(
            <div key={clue.id} onClick={()=>{ if(!clue.found)onFindClue(clue.id); setEx(clue); }} style={{
              background:clue.found?"linear-gradient(160deg,#181230,#131024)":"linear-gradient(160deg,#110e20,#0d0b1a)",
              border:`1px solid ${clue.found?"rgba(201,168,76,.3)":"rgba(201,168,76,.08)"}`,
              borderRadius:3,padding:"18px 12px",textAlign:"center",cursor:"pointer",
              transition:"all .4s cubic-bezier(.23,1,.32,1)",
              boxShadow:clue.found?"0 0 24px rgba(201,168,76,.06)":"none",
              display:"flex",flexDirection:"column",gap:8,alignItems:"center",
            }}>
              <span style={{ fontSize:20,opacity:clue.found?.9:.38,filter:clue.found?"drop-shadow(0 0 7px rgba(201,168,76,.4))":"none",transition:"all .3s",color:T.gold }}>
                {clue.found?"✦":"○"}
              </span>
              <span style={{ fontFamily:"'Cinzel',serif",fontSize:".55rem",color:clue.found?T.goldD:"rgba(201,168,76,.22)",letterSpacing:".3em" }}>
                {clue.found?"Examined":`Area ${i+1}`}
              </span>
              {clue.key&&clue.found&&(
                <span style={{ fontFamily:"'Cinzel',serif",fontSize:".5rem",color:"rgba(201,168,76,.45)",letterSpacing:".28em",borderTop:"1px solid rgba(201,168,76,.18)",paddingTop:6,width:"100%",textAlign:"center" }}>KEY</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Clue reveal modal */}
      {ex && (
        <div style={{ position:"fixed",inset:0,background:"rgba(2,3,8,.9)",backdropFilter:"blur(18px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,zIndex:700 }} className="fi">
          <Card style={{ maxWidth:460,width:"100%",border:`1px solid rgba(201,168,76,${ex.key?.4:.18})` }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:14 }}>
              <p style={{ fontFamily:"'Cinzel',serif",color:ex.key?T.gold:T.goldD,fontSize:".56rem",letterSpacing:".44em" }}>{ex.key?"KEY EVIDENCE":"OBSERVATION"}</p>
              <button style={{ background:"none",border:"none",color:T.goldD,cursor:"pointer",opacity:.55,fontSize:".9rem" }} onClick={()=>setEx(null)}>✕</button>
            </div>
            <Divider style={{ marginBottom:18 }}/>
            <p style={{ fontFamily:"'IM Fell English',serif",fontSize:"1.05rem",color:T.parchD,lineHeight:1.95 }}>{ex.text}</p>
            {ex.key&&<p style={{ fontFamily:"'Cinzel',serif",color:T.goldD,fontSize:".56rem",letterSpacing:".44em",textAlign:"center",marginTop:16,fontStyle:"italic" }}>This changes things.</p>}
          </Card>
        </div>
      )}
    </div>
  );
}

/* ══ INTERROGATION ══════════════════════════════════════════════ */
function Interrogation({ suspect, onBack, onComplete }) {
  const [qIdx,setQIdx]   = useState(0);
  const [log,setLog]     = useState([]);
  const [sus,setSus]     = useState(0);
  const [tells,setTells] = useState(false);
  const done             = qIdx >= suspect.questions.length;
  const susRatio         = sus / suspect.questions.length;
  const susColor         = susRatio === 0 ? "rgba(52,160,82,.75)" : susRatio < .6 ? "rgba(201,168,76,.75)" : "rgba(192,64,64,.75)";

  const answer = opt => {
    setLog(p=>[...p,{q:suspect.questions[qIdx].q,a:opt.text,r:opt.response,s:opt.sus}]);
    if(opt.sus) setSus(s=>s+1);
    if(qIdx < suspect.questions.length-1) setQIdx(q=>q+1);
    else { setQIdx(suspect.questions.length); onComplete(suspect.id); }
  };

  return (
    <div style={{ minHeight:"100vh",background:T.bg,paddingBottom:40 }} className="fi">
      <style>{G}</style>
      <CinematicBG/><MagicDust count={28}/>
      <NavBar
        left={<Btn onClick={onBack} variant="ghost" style={{ padding:"9px 16px",fontSize:".7rem" }}>← Back</Btn>}
        center={<p style={{ fontFamily:"'Cinzel',serif",color:T.gold,fontSize:".84rem",letterSpacing:".32em" }}>INTERROGATION</p>}
      />
      <div style={{ width:"100%",maxWidth:560,margin:"0 auto",padding:"24px 20px",display:"flex",flexDirection:"column",gap:18,position:"relative",zIndex:10 }}>
        {/* Suspect card */}
        <Card>
          <div style={{ display:"flex",gap:16,alignItems:"flex-start" }}>
            <div style={{ flexShrink:0,textAlign:"center" }}>
              <div style={{ fontSize:46,filter:"drop-shadow(0 0 12px rgba(201,168,76,.2))" }}>{suspect.icon}</div>
              <p style={{ fontFamily:"'Cinzel',serif",color:T.gold,fontSize:".8rem",letterSpacing:".12em",marginTop:8 }}>{suspect.name}</p>
              <p style={{ fontFamily:"'Cormorant Garamond',serif",color:T.goldD,fontSize:".74rem",fontStyle:"italic" }}>{suspect.role}</p>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ marginBottom:10 }}>
                <p style={{ fontFamily:"'Cinzel',serif",color:T.goldD,fontSize:".54rem",letterSpacing:".36em",marginBottom:5 }}>SUSPICION</p>
                <div style={{ height:2,background:"rgba(255,255,255,.06)",borderRadius:1 }}>
                  <div style={{ width:`${susRatio*100}%`,height:"100%",background:susColor,borderRadius:1,transition:"width .65s ease" }}/>
                </div>
              </div>
              <Divider style={{ marginBottom:10 }}/>
              <p style={{ fontFamily:"'Cormorant Garamond',serif",color:T.silverD,fontSize:".88rem",lineHeight:1.65,marginBottom:7 }}>
                <span style={{ color:T.goldD,fontFamily:"'Cinzel',serif",fontSize:".54rem",letterSpacing:".32em" }}>MOTIVE — </span>
                {suspect.motive}
              </p>
              <p style={{ fontFamily:"'Cormorant Garamond',serif",color:T.silverD,fontSize:".88rem",lineHeight:1.65,opacity:.7 }}>
                <span style={{ color:T.goldD,fontFamily:"'Cinzel',serif",fontSize:".54rem",letterSpacing:".32em" }}>ALIBI — </span>
                {suspect.alibi}
              </p>
            </div>
          </div>
        </Card>

        {/* Question */}
        {!done && (
          <div className="fiu">
            <p style={{ fontFamily:"'Cinzel',serif",color:T.goldD,fontSize:".56rem",letterSpacing:".46em",marginBottom:11 }}>DETECTIVE AMRITHA</p>
            <p style={{ fontFamily:"'IM Fell English',serif",fontSize:"1.06rem",color:T.parchD,lineHeight:1.92,fontStyle:"italic",marginBottom:18 }}>"{suspect.questions[qIdx]?.q}"</p>
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              {suspect.questions[qIdx]?.options.map((opt,i)=>(
                <button key={i} onClick={()=>answer(opt)} style={{
                  background:"rgba(201,168,76,.025)",border:"1px solid rgba(201,168,76,.1)",
                  color:T.parchD,padding:"14px 18px",cursor:"pointer",
                  fontFamily:"'IM Fell English',serif",fontSize:"1.02rem",
                  textAlign:"left",borderRadius:2,
                  transition:"all .35s cubic-bezier(.23,1,.32,1)",lineHeight:1.65,
                }}>
                  <span style={{ color:"rgba(201,168,76,.4)",marginRight:10,fontFamily:"serif" }}>›</span>
                  <em>"{opt.text}"</em>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Log */}
        {log.map((e,i)=>(
          <div key={i} style={{ borderLeft:"1px solid rgba(201,168,76,.1)",paddingLeft:16 }}>
            <p style={{ fontFamily:"'Cinzel',serif",color:T.goldD,fontSize:".54rem",letterSpacing:".32em",marginBottom:6 }}>{e.q}</p>
            <p style={{ fontFamily:"'IM Fell English',serif",color:T.silverD,fontSize:".9rem",fontStyle:"italic",marginBottom:6 }}>"{e.a}"</p>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",color:e.s?"rgba(192,90,70,.8)":"rgba(52,160,82,.74)",fontSize:".85rem" }}>{e.r}</p>
          </div>
        ))}

        {/* Done */}
        {done && (
          <div className="fiu" style={{ textAlign:"center" }}>
            <Divider style={{ marginBottom:16 }}/>
            <p style={{ fontFamily:"'Cinzel',serif",color:T.goldD,fontSize:".56rem",letterSpacing:".46em",marginBottom:16 }}>INTERROGATION CONCLUDED</p>
            <div style={{ display:"flex",gap:11,justifyContent:"center",flexWrap:"wrap" }}>
              <Btn onClick={()=>setTells(!tells)}>{tells?"Conceal Analysis":"View Analysis"}</Btn>
              <Btn onClick={onBack} variant="ghost">Return</Btn>
            </div>
            {tells && (
              <div className="fiu" style={{ marginTop:18,textAlign:"left" }}>
                <Divider style={{ marginBottom:14 }}/>
                {suspect.tells.map((t,i)=>(
                  <div key={i} style={{ display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid rgba(201,168,76,.06)" }}>
                    <span style={{ color:"rgba(201,168,76,.38)",flexShrink:0,fontSize:".75rem" }}>✦</span>
                    <p style={{ fontFamily:"'Cormorant Garamond',serif",color:T.silverD,fontSize:".92rem",lineHeight:1.7 }}>{t}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══ RUNES CIPHER ═══════════════════════════════════════════════ */
function RunesCipher({ onSolve, solved, onBack }) {
  const [input,setInput] = useState("");
  const [wrong,setWrong] = useState(false);
  const [hint,setHint]   = useState(false);

  const check = () => {
    if(input.trim().toUpperCase()===CIPHER.answer) onSolve();
    else { setWrong(true); setTimeout(()=>setWrong(false),700); setInput(""); }
  };

  return (
    <div style={{ minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column" }} className="fi">
      <style>{G}</style>
      <CinematicBG/><MagicDust count={32}/>
      <NavBar
        left={<Btn onClick={onBack} variant="ghost" style={{ padding:"9px 16px",fontSize:".7rem" }}>← Back</Btn>}
        center={<p style={{ fontFamily:"'Cinzel',serif",color:"rgba(120,112,200,.82)",fontSize:".84rem",letterSpacing:".38em" }}>ANCIENT RUNES</p>}
        accent="rgba(80,60,180,.18)"
      />
      <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"26px 20px 70px",position:"relative",zIndex:10 }}>
        <div style={{ width:"100%",maxWidth:540,display:"flex",flexDirection:"column",alignItems:"center",gap:24 }}>
          <div style={{ textAlign:"center" }}><RuneRing size={90}/></div>
          <Title eyebrow="TRAPDOOR INSCRIPTION" size="clamp(1.1rem,4.5vw,1.85rem)">The Cipher</Title>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",color:T.silverD,fontSize:".97rem",fontStyle:"italic",textAlign:"center",opacity:.8 }}>{CIPHER.prompt}</p>
          <Card style={{ border:"1px solid rgba(80,60,180,.22)",textAlign:"center" }}>
            <p style={{ fontFamily:"'Cinzel',serif",fontSize:"clamp(.9rem,3.5vw,1.18rem)",color:"rgba(148,140,228,.88)",letterSpacing:".44em",wordSpacing:"1em",lineHeight:1.95 }}>{CIPHER.encoded}</p>
          </Card>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",color:T.silverD,fontSize:".97rem",lineHeight:1.9,fontStyle:"italic",textAlign:"center",opacity:.75 }}>
            Shift each letter back by 7 positions in the alphabet.<br/>
            A→T · B→U · ... · H→A · G→Z
          </p>
          <Card style={{ border:"1px solid rgba(80,60,180,.16)" }}>
            <p style={{ fontFamily:"'Cinzel',serif",color:T.goldD,fontSize:".56rem",letterSpacing:".44em",marginBottom:12,textAlign:"center" }}>SHIFT REFERENCE — BACK BY 7</p>
            <div style={{ display:"flex",flexWrap:"wrap",gap:3,justifyContent:"center" }}>
              {Array.from({length:26},(_,i)=>{
                const enc=String.fromCharCode(65+i);
                const dec=String.fromCharCode(((i-7+26)%26)+65);
                return (
                  <div key={i} style={{ display:"flex",flexDirection:"column",alignItems:"center",minWidth:20 }}>
                    <span style={{ color:"rgba(120,112,205,.65)",fontFamily:"'Cinzel',serif",fontSize:".54rem" }}>{enc}</span>
                    <span style={{ color:"rgba(90,80,148,.38)",fontSize:".4rem" }}>↓</span>
                    <span style={{ color:T.gold,fontFamily:"'Cinzel',serif",fontSize:".54rem" }}>{dec}</span>
                  </div>
                );
              })}
            </div>
          </Card>
          {!solved ? (
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:13,width:"100%" }}>
              <input
                style={{ width:"100%",maxWidth:460,background:"rgba(0,0,0,.55)",border:`1px solid ${wrong?"rgba(139,32,32,.75)":"rgba(80,60,180,.3)"}`,color:"rgba(148,140,228,.92)",padding:"14px 20px",fontFamily:"'Cinzel',serif",fontSize:".86rem",letterSpacing:".32em",outline:"none",borderRadius:2,textAlign:"center",transition:"border-color .3s" }}
                value={input} onChange={e=>setInput(e.target.value.toUpperCase())}
                onKeyDown={e=>e.key==="Enter"&&check()}
                placeholder="Enter decoded message"
              />
              <div style={{ display:"flex",gap:11,flexWrap:"wrap",justifyContent:"center" }}>
                <Btn onClick={check} variant="crimson">Decode</Btn>
                <Btn onClick={()=>setHint(s=>!s)} variant="ghost" style={{ padding:"15px 24px" }}>{hint?"Conceal Hint":"Request Hint"}</Btn>
              </div>
              {wrong && <p style={{ color:"rgba(192,64,64,.75)",fontFamily:"'Cinzel',serif",fontSize:".66rem",letterSpacing:".32em" }}>The runes do not yield.</p>}
              {hint  && <p style={{ color:T.silverD,fontFamily:"'Cormorant Garamond',serif",fontSize:".92rem",fontStyle:"italic",textAlign:"center",opacity:.74 }}>{CIPHER.hint}</p>}
            </div>
          ) : (
            <Card className="fiu" style={{ border:"1px solid rgba(52,160,82,.32)",textAlign:"center" }}>
              <p style={{ fontFamily:"'Cinzel',serif",color:"rgba(52,160,82,.8)",fontSize:".62rem",letterSpacing:".46em",marginBottom:14 }}>DECODED</p>
              <Divider style={{ marginBottom:16 }}/>
              <p style={{ fontFamily:"'Cinzel',serif",color:T.gold,fontSize:".94rem",letterSpacing:".22em",marginBottom:14 }}>"{CIPHER.answer}"</p>
              <p style={{ fontFamily:"'Cormorant Garamond',serif",color:T.silverD,fontSize:".92rem",fontStyle:"italic",lineHeight:1.78 }}>Dumbledore knew from the beginning.<br/>He was waiting for the right person to find it.<br/>He was waiting for you.</p>
              <Divider style={{ margin:"18px 0" }}/>
              <Btn onClick={onBack} variant="emerald">Return to Investigation</Btn>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══ ACCUSATION ═════════════════════════════════════════════════ */
function Accusation({ clues, interrogated, cipherSolved, onAccuse, onBack }) {
  const [sel,setSel] = useState(null);
  const [res,setRes] = useState(null);
  const foundKey     = clues.filter(c=>c.found&&c.key).length;
  const ready        = foundKey>=5 && interrogated.length>=3 && cipherSolved;

  return (
    <div style={{ minHeight:"100vh",background:T.bg,paddingBottom:60 }} className="fi">
      <style>{G}</style>
      <CinematicBG/><MagicDust count={28}/>
      <NavBar
        left={<Btn onClick={onBack} variant="ghost" style={{ padding:"9px 16px",fontSize:".7rem" }}>← Back</Btn>}
        center={<p style={{ fontFamily:"'Cinzel',serif",color:"rgba(192,64,64,.8)",fontSize:".84rem",letterSpacing:".32em" }}>THE ACCUSATION</p>}
        accent="rgba(139,32,32,.2)"
      />
      <div style={{ width:"100%",maxWidth:560,margin:"0 auto",padding:"28px 20px",display:"flex",flexDirection:"column",gap:22,position:"relative",zIndex:10 }}>
        <Title eyebrow="FINAL JUDGEMENT" size="clamp(1.3rem,5vw,2rem)">Name the Thief</Title>
        <p style={{ fontFamily:"'Cormorant Garamond',serif",color:T.silverD,fontSize:".97rem",fontStyle:"italic",textAlign:"center",opacity:.76 }}>Choose with precision. A wrong accusation gives Voldemort time.</p>
        {!ready && (
          <Card style={{ border:"1px solid rgba(201,168,76,.1)",textAlign:"center" }}>
            <p style={{ fontFamily:"'Cinzel',serif",color:T.goldD,fontSize:".65rem",letterSpacing:".32em",marginBottom:8 }}>INSUFFICIENT EVIDENCE</p>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",color:T.silverD,fontSize:".88rem",opacity:.72 }}>Key evidence: {foundKey}/5 · Suspects: {interrogated.length}/3 · Cipher: {cipherSolved?"✓":"✗"}</p>
          </Card>
        )}
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {SUSPECTS.map(s=>(
            <div key={s.id} onClick={()=>{setSel(s.id);setRes(null);}} style={{
              background:sel===s.id?"linear-gradient(160deg,#1c1032,#160f28)":"linear-gradient(160deg,#110e20,#0d0b1a)",
              border:`1px solid ${sel===s.id?"rgba(192,64,64,.42)":"rgba(201,168,76,.08)"}`,
              borderRadius:3,padding:"16px 20px",cursor:"pointer",
              transition:"all .4s cubic-bezier(.23,1,.32,1)",
            }}>
              <div style={{ display:"flex",alignItems:"center",gap:14 }}>
                <span style={{ fontSize:28,filter:`drop-shadow(0 0 8px ${sel===s.id?"rgba(192,64,64,.4)":"rgba(201,168,76,.18)"})` }}>{s.icon}</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:"'Cinzel',serif",color:sel===s.id?"rgba(218,90,90,.92)":T.gold,fontSize:".86rem",letterSpacing:".13em" }}>{s.name}</p>
                  <p style={{ fontFamily:"'Cormorant Garamond',serif",color:T.goldD,fontSize:".8rem",fontStyle:"italic" }}>{s.role}</p>
                </div>
                {sel===s.id&&<span style={{ fontFamily:"'Cinzel',serif",fontSize:".56rem",letterSpacing:".22em",color:"rgba(192,64,64,.72)" }}>ACCUSED</span>}
              </div>
            </div>
          ))}
        </div>
        {sel&&!res && (
          <div className="fiu" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:16 }}>
            <Card style={{ border:"1px solid rgba(192,64,64,.22)",textAlign:"center" }}>
              <p style={{ fontFamily:"'IM Fell English',serif",color:T.parchD,fontSize:"1.02rem",lineHeight:1.9 }}>
                "I hereby accuse <strong style={{ color:"rgba(218,90,90,.92)" }}>{SUSPECTS.find(s=>s.id===sel)?.name}</strong> of stealing the Philosopher's Stone."
              </p>
            </Card>
            <Btn onClick={()=>{ const c=sel==="quirrell"; setRes(c?"correct":"wrong"); if(c)setTimeout(()=>onAccuse(true),1300); }} variant="crimson" style={{ padding:"15px 42px" }}>Make Accusation</Btn>
          </div>
        )}
        {res==="wrong" && (
          <Card className="fiu" style={{ border:"1px solid rgba(139,32,32,.28)",textAlign:"center" }}>
            <p style={{ fontFamily:"'Cinzel',serif",color:"rgba(192,64,64,.76)",fontSize:".66rem",letterSpacing:".44em",marginBottom:10 }}>INCORRECT</p>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",color:T.silverD,fontSize:".95rem",fontStyle:"italic",marginBottom:16,opacity:.78 }}>The evidence does not support this conclusion.</p>
            <Btn onClick={()=>{setSel(null);setRes(null);}} variant="ghost">Reconsider</Btn>
          </Card>
        )}
        {res==="correct" && (
          <Card className="fiu" style={{ border:"1px solid rgba(52,160,82,.28)",textAlign:"center" }}>
            <p style={{ fontFamily:"'Cinzel',serif",color:"rgba(52,160,82,.8)",fontSize:".66rem",letterSpacing:".44em",marginBottom:10 }}>CORRECT</p>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",color:T.silverD,fontSize:"1.02rem",fontStyle:"italic",opacity:.82 }}>The turban falls. The truth surfaces. The Stone is safe.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

/* ══ VICTORY ════════════════════════════════════════════════════ */
function Victory() {
  return (
    <div style={{ minHeight:"100vh",background:T.bg,paddingBottom:90,display:"flex",justifyContent:"center" }} className="fi">
      <style>{G}</style>
      <Confetti/>
      <CinematicBG/>
      <MagicDust count={70}/>
      <HLCastle/>
      <div style={{ width:"100%",maxWidth:560,padding:"48px 20px",display:"flex",flexDirection:"column",alignItems:"center",gap:24,position:"relative",zIndex:10 }}>
        <RuneRing size={108} className="glowPulse"/>
        <Title eyebrow="THE INVESTIGATION IS COMPLETE" size="clamp(1.9rem,7.5vw,3.2rem)">Case Solved</Title>
        <Divider/>
        <Card glow>
          <p style={{ fontFamily:"'Cinzel',serif",color:T.goldD,fontSize:".6rem",letterSpacing:".46em",textAlign:"center",marginBottom:14 }}>OFFICIAL VERDICT</p>
          <p style={{ fontFamily:"'IM Fell English',serif",fontSize:"1.04rem",color:T.parchD,lineHeight:1.95,textAlign:"center",marginBottom:16 }}>
            <strong style={{ color:"rgba(192,64,64,.92)" }}>Professor Quirinus Quirrell</strong>, acting under possession by Lord Voldemort, is hereby found guilty of attempting to steal the Philosopher's Stone.
          </p>
          <Divider style={{ marginBottom:14 }}/>
          <p style={{ fontFamily:"'Cinzel',serif",color:T.goldD,fontSize:".58rem",letterSpacing:".36em",marginBottom:12 }}>EVIDENCE</p>
          {[
            "Handkerchief Q.Q. — Potions dungeon",
            "Refined flute — used to subdue Fluffy",
            "Violet ink — Restricted Section log",
            "Letter Q.Q. to R.Q. — Quirrell to Voldemort",
            "Felix Felicis traces — his apothecary purchases",
            "Peeves: spotted him near corridor at 11:20",
            "Hagrid: confirmed turban-wearing stranger",
            "Cipher decoded: QUIRRELL WAS THE THIEF",
            "Mirror note: 'I see myself holding it. I always have.'",
          ].map((e,i)=>(
            <div key={i} style={{ display:"flex",gap:10,padding:"6px 0",borderBottom:"1px solid rgba(201,168,76,.05)" }}>
              <span style={{ color:"rgba(201,168,76,.28)",flexShrink:0,fontSize:".72rem" }}>✦</span>
              <span style={{ fontFamily:"'Cormorant Garamond',serif",color:T.silverD,fontSize:".88rem" }}>{e}</span>
            </div>
          ))}
        </Card>

        {/* Birthday message */}
        <div style={{ width:"100%",background:"linear-gradient(160deg,rgba(24,18,10,.88),rgba(14,10,6,.92))",border:"1px solid rgba(201,168,76,.2)",borderRadius:3,padding:"34px 24px",textAlign:"center" }}>
          <p style={{ fontFamily:"'Cinzel',serif",color:T.gold,fontSize:"clamp(.86rem,3.5vw,1.1rem)",letterSpacing:".18em",marginBottom:20,animation:"goldShimmer 3.5s ease-in-out infinite" }}>
            Happy Birthday, Amritha
          </p>
          <Divider style={{ marginBottom:20 }}/>
          <p style={{ fontFamily:"'IM Fell English',serif",fontSize:"clamp(.98rem,3vw,1.1rem)",color:T.parchD,lineHeight:2.3 }}>
            You cracked the cipher.<br/>
            You interrogated every suspect.<br/>
            You explored every shadowed corridor,<br/>
            and found the truth hidden in the runes.<br/><br/>
            <em style={{ color:T.gold }}>
              "You are the brightest witch of your age —<br/>
              not because of what you know,<br/>
              but because of how fiercely you love,<br/>
              how bravely you seek,<br/>
              and how brilliantly you shine.<br/><br/>
              May your twenty-second year hold<br/>
              magic even Dumbledore couldn't predict."
            </em>
          </p>
          <Divider style={{ margin:"24px 0" }}/>
          <div style={{ display:"flex",justifyContent:"center",gap:13,fontSize:"1.25rem",flexWrap:"wrap" }}>
            {["⚡","🦁","📖","🦉","🪄","✦","💕"].map((e,i)=>(
              <span key={i} style={{ animation:`breathe ${1.8+i*.2}s ${i*.18}s ease-in-out infinite`,filter:"drop-shadow(0 0 8px rgba(201,168,76,.35))" }}>{e}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ INVESTIGATION HUB ══════════════════════════════════════════ */
function Hub({ clues, interrogated, cipherSolved, setView }) {
  const [notes,setNotes] = useState(false);
  const found = clues.filter(c=>c.found).length;
  const total = clues.length;

  return (
    <div style={{ minHeight:"100vh",background:T.bg,position:"relative",paddingBottom:290 }}>
      <style>{G}</style>
      <CinematicBG/><MagicDust count={42}/><HLCastle/>
      {notes && <CaseNotes clues={clues} onClose={()=>setNotes(false)}/>}

      {/* Sticky top bar */}
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 20px",background:"rgba(4,5,10,.9)",borderBottom:"1px solid rgba(201,168,76,.1)",backdropFilter:"blur(16px)",flexWrap:"wrap",gap:10,position:"sticky",top:0,zIndex:500 }}>
        <div>
          <p style={{ fontFamily:"'Cinzel',serif",color:T.gold,fontSize:".74rem",letterSpacing:".22em" }}>Detective Amritha</p>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",color:T.goldD,fontSize:".7rem",fontStyle:"italic" }}>Hogwarts Investigation</p>
        </div>
        <div style={{ display:"flex",gap:20 }}>
          {[["CLUES",`${found}/${total}`,T.gold],["SUSPECTS",`${interrogated.length}/${SUSPECTS.length}`,T.gold],["CIPHER",cipherSolved?"✓":"✗",cipherSolved?"rgba(52,160,82,.8)":"rgba(192,64,64,.74)"]].map(([l,v,c])=>(
            <div key={l} style={{ textAlign:"center" }}>
              <p style={{ fontFamily:"'Cinzel',serif",color:T.goldD,fontSize:".5rem",letterSpacing:".42em" }}>{l}</p>
              <p style={{ fontFamily:"'Cinzel',serif",color:c,fontSize:".88rem",letterSpacing:".16em" }}>{v}</p>
            </div>
          ))}
        </div>
        <Btn onClick={()=>setNotes(true)} variant="ghost" style={{ padding:"8px 15px",fontSize:".65rem" }}>Notes</Btn>
      </div>

      <div style={{ width:"100%",maxWidth:560,margin:"0 auto",padding:"28px 20px",position:"relative",zIndex:10 }}>

        {/* Hub title */}
        <div style={{ textAlign:"center",marginBottom:28 }}>
          <p style={{ fontFamily:"'Cinzel',serif",color:T.goldD,fontSize:".56rem",letterSpacing:".58em",marginBottom:10 }}>A HOGWARTS MYSTERY</p>
          <h1 style={{ fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:"clamp(1.3rem,5.5vw,2.2rem)",color:T.gold,letterSpacing:".06em",lineHeight:1.18,textShadow:"0 0 50px rgba(201,168,76,.24)",animation:"goldShimmer 4.5s ease-in-out infinite" }}>
            The Philosopher's Thief
          </h1>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",color:T.silverD,fontSize:".82rem",letterSpacing:".15em",fontStyle:"italic",marginTop:8,opacity:.66 }}>
            Hogwarts · 11:47 PM · A storm gathers
          </p>
          {/* Progress bar */}
          <div style={{ width:"100%",maxWidth:310,height:2,background:"rgba(201,168,76,.09)",borderRadius:1,margin:"15px auto 5px" }}>
            <div style={{ width:`${Math.round((found/total)*100)}%`,height:"100%",background:"rgba(201,168,76,.4)",borderRadius:1,transition:"width .9s ease" }}/>
          </div>
          <p style={{ fontFamily:"'Cinzel',serif",color:"rgba(201,168,76,.28)",fontSize:".52rem",letterSpacing:".42em" }}>{Math.round((found/total)*100)}% INVESTIGATED</p>
        </div>

        {/* Locations */}
        <p style={{ fontFamily:"'Cinzel',serif",color:T.goldD,fontSize:".56rem",letterSpacing:".52em",marginBottom:12,textAlign:"center" }}>LOCATIONS</p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:9,marginBottom:22 }}>
          {ROOMS.map(room=>{
            const rc = clues.filter(c=>room.clues.some(x=>x.id===c.id)&&c.found).length;
            const done = rc===room.clues.length;
            return (
              <div key={room.id} onClick={()=>setView({type:"room",id:room.id})} style={{
                background:done?"linear-gradient(160deg,#181230,#131024)":"linear-gradient(160deg,#110e20,#0d0b1a)",
                border:`1px solid ${done?"rgba(201,168,76,.28)":"rgba(201,168,76,.07)"}`,
                borderRadius:3,padding:"15px 10px",textAlign:"center",cursor:"pointer",
                transition:"all .4s cubic-bezier(.23,1,.32,1)",
                display:"flex",flexDirection:"column",gap:6,alignItems:"center",
                boxShadow:done?"0 0 22px rgba(201,168,76,.05)":"none",
              }}>
                <span style={{ fontSize:22,opacity:done?.9:.45,filter:done?"drop-shadow(0 0 6px rgba(201,168,76,.3))":"none",transition:"all .3s" }}>{room.icon}</span>
                <p style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",color:done?T.gold:"rgba(201,168,76,.36)",letterSpacing:".12em" }}>{room.name}</p>
                <p style={{ fontFamily:"'Cormorant Garamond',serif",color:T.goldD,fontSize:".7rem" }}>{rc}/{room.clues.length}</p>
                {done&&<p style={{ fontFamily:"'Cinzel',serif",color:"rgba(201,168,76,.4)",fontSize:".5rem",letterSpacing:".38em" }}>CLEARED</p>}
              </div>
            );
          })}
        </div>

        {/* Suspects */}
        <p style={{ fontFamily:"'Cinzel',serif",color:T.goldD,fontSize:".56rem",letterSpacing:".52em",marginBottom:12,textAlign:"center" }}>PERSONS OF INTEREST</p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:9,marginBottom:22 }}>
          {SUSPECTS.map(s=>(
            <div key={s.id} onClick={()=>setView({type:"interrogation",id:s.id})} style={{
              background:interrogated.includes(s.id)?"linear-gradient(160deg,#181230,#131024)":"linear-gradient(160deg,#110e20,#0d0b1a)",
              border:`1px solid ${interrogated.includes(s.id)?"rgba(201,168,76,.24)":"rgba(201,168,76,.07)"}`,
              borderRadius:3,padding:"13px 8px",textAlign:"center",cursor:"pointer",
              transition:"all .4s cubic-bezier(.23,1,.32,1)",
              display:"flex",flexDirection:"column",alignItems:"center",gap:5,
            }}>
              <span style={{ fontSize:22,opacity:interrogated.includes(s.id)?.9:.4,transition:"all .3s",filter:interrogated.includes(s.id)?"drop-shadow(0 0 6px rgba(201,168,76,.26))":"none" }}>{s.icon}</span>
              <p style={{ fontFamily:"'Cinzel',serif",fontSize:".58rem",color:interrogated.includes(s.id)?T.gold:"rgba(201,168,76,.34)",letterSpacing:".1em" }}>{s.name}</p>
              <p style={{ fontFamily:"'Cormorant Garamond',serif",color:T.goldD,fontSize:".68rem" }}>{s.role}</p>
              {interrogated.includes(s.id)&&<p style={{ fontFamily:"'Cinzel',serif",color:"rgba(201,168,76,.34)",fontSize:".5rem",letterSpacing:".32em" }}>QUESTIONED</p>}
            </div>
          ))}
        </div>

        {/* Special actions */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:9 }}>
          {[
            { icon:"◈",name:"Ancient Runes",sub:"Decode the inscription",type:"cipher",bc:cipherSolved?"rgba(52,160,82,.45)":"rgba(80,60,180,.2)",tc:cipherSolved?"rgba(52,160,82,.78)":"rgba(128,118,208,.68)",done:cipherSolved },
            { icon:"⚖",name:"Accusation",sub:"Name the thief",type:"accuse",bc:"rgba(139,32,32,.22)",tc:"rgba(192,64,64,.68)",done:false },
          ].map(c=>(
            <div key={c.type} onClick={()=>setView({type:c.type})} style={{
              background:"linear-gradient(160deg,#110e20,#0d0b1a)",
              border:`1px solid ${c.bc}`,borderRadius:3,padding:"17px 10px",
              textAlign:"center",cursor:"pointer",
              transition:"all .4s cubic-bezier(.23,1,.32,1)",
              display:"flex",flexDirection:"column",alignItems:"center",gap:6,
            }}>
              <span style={{ fontSize:24,color:c.tc,filter:`drop-shadow(0 0 6px ${c.bc})` }}>{c.icon}</span>
              <p style={{ fontFamily:"'Cinzel',serif",fontSize:".65rem",color:c.tc,letterSpacing:".16em" }}>{c.name}</p>
              <p style={{ fontFamily:"'Cormorant Garamond',serif",color:T.goldD,fontSize:".72rem",fontStyle:"italic" }}>{c.sub}</p>
              {c.done&&<p style={{ fontFamily:"'Cinzel',serif",color:"rgba(52,160,82,.5)",fontSize:".5rem",letterSpacing:".32em" }}>SOLVED</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══ INTRO ══════════════════════════════════════════════════════ */
function Intro({ onStart }) {
  const [step,setStep]  = useState(0);
  const {out,done}      = useTypewriter(PREMISE,24,step===1);

  return (
    <div style={{ minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px 20px 300px" }} className="fi">
      <style>{G}</style>
      <CinematicBG/><MagicDust count={50}/><HLCastle/>

      {step===0 && (
        <div className="fiu" style={{ textAlign:"center",maxWidth:520,width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:18,position:"relative",zIndex:10 }}>
          <p style={{ fontFamily:"'Cinzel',serif",color:T.goldD,fontSize:".56rem",letterSpacing:".62em" }}>A HOGWARTS MYSTERY</p>
          <RuneRing size={104}/>
          <h1 style={{ fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:"clamp(2rem,8vw,3.4rem)",color:T.gold,letterSpacing:".04em",lineHeight:1.1,textAlign:"center",textShadow:"0 0 70px rgba(201,168,76,.32),0 0 140px rgba(201,168,76,.14),0 3px 6px rgba(0,0,0,.95)" }}>
            The Philosopher's<br/>Thief
          </h1>
          <Divider style={{ maxWidth:240 }}/>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",color:T.silverD,fontSize:".96rem",fontStyle:"italic",opacity:.74 }}>For the sharpest detective in the room</p>
          <p style={{ fontFamily:"'Cinzel',serif",color:"rgba(201,168,76,.28)",fontSize:".6rem",letterSpacing:".38em" }}>📍 Hogwarts · 11:47 PM</p>
          <Btn onClick={()=>setStep(1)} style={{ animation:"buttonGlow 2.5s infinite",marginTop:10 }}>Begin Investigation</Btn>
        </div>
      )}

      {step===1 && (
        <div className="fi" style={{ width:"100%",maxWidth:520,position:"relative",zIndex:10 }}>
          <Card glow>
            <div style={{ textAlign:"center",marginBottom:18 }}>
              <p style={{ fontFamily:"'Cinzel',serif",color:T.goldD,fontSize:".56rem",letterSpacing:".52em",marginBottom:13 }}>CASE BRIEFING</p>
              <Divider/>
            </div>
            <pre style={{ fontFamily:"'IM Fell English',serif",fontSize:"1.04rem",color:T.parchD,lineHeight:2.05,whiteSpace:"pre-wrap",minHeight:72 }}>
              {out}<span style={{ color:T.gold,animation:"goldShimmer .8s infinite" }}>{!done?"▌":""}</span>
            </pre>
            {done && (
              <div className="fiu" style={{ display:"flex",flexDirection:"column",gap:18,alignItems:"center" }}>
                <Divider/>
                <div style={{ width:"100%",background:"rgba(0,0,0,.2)",border:"1px solid rgba(201,168,76,.1)",borderRadius:2,padding:"18px 20px" }}>
                  <p style={{ fontFamily:"'Cinzel',serif",color:T.goldD,fontSize:".56rem",letterSpacing:".46em",marginBottom:13,textAlign:"center" }}>INVESTIGATION GUIDE</p>
                  {[["🏰","Explore 5 locations","Find hidden evidence"],["🎭","Question 5 suspects","Watch for tells"],["◈","Decode ancient runes","Break the cipher"],["⚖","Name the thief","One chance — choose wisely"]].map(([icon,t,d],i)=>(
                    <div key={i} style={{ display:"flex",gap:12,alignItems:"flex-start",padding:"8px 0",borderBottom:"1px solid rgba(201,168,76,.06)" }}>
                      <span style={{ fontSize:16,flexShrink:0,marginTop:2 }}>{icon}</span>
                      <div>
                        <p style={{ fontFamily:"'Cinzel',serif",color:T.gold,fontSize:".68rem",letterSpacing:".22em",marginBottom:3 }}>{t}</p>
                        <p style={{ fontFamily:"'Cormorant Garamond',serif",color:T.silverD,fontSize:".88rem",fontStyle:"italic" }}>{d}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Btn onClick={onStart} style={{ animation:"buttonGlow 2.5s infinite" }}>Enter Hogwarts</Btn>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

/* ══ ROOT ════════════════════════════════════════════════════════ */
export default function HogwartsMystery() {
  const [phase,setPhase]    = useState("intro");
  const [view,setViewState] = useState(null);
  const [clues,setClues]    = useState(ROOMS.flatMap(r=>r.clues.map(c=>({...c,found:false}))));
  const [inter,setInter]    = useState([]);
  const [cipher,setCipher]  = useState(false);

  const setView      = v => { setViewState(v); setPhase(v?v.type:"hub"); };
  const findClue     = id => setClues(p=>p.map(c=>c.id===id?{...c,found:true}:c));
  const completeInt  = id => setInter(p=>p.includes(id)?p:[...p,id]);

  if(phase==="intro")   return <Intro onStart={()=>setPhase("hub")}/>;
  if(phase==="victory") return <Victory/>;

  const room    = view?.type==="room"          ? ROOMS.find(r=>r.id===view.id)    : null;
  const suspect = view?.type==="interrogation" ? SUSPECTS.find(s=>s.id===view.id) : null;

  if(phase==="room"&&room)             return <RoomExplorer room={room} allClues={clues} onFindClue={findClue} onBack={()=>setView(null)}/>;
  if(phase==="interrogation"&&suspect) return <Interrogation suspect={suspect} onBack={()=>setView(null)} onComplete={completeInt}/>;
  if(phase==="cipher")                 return <RunesCipher onSolve={()=>setCipher(true)} solved={cipher} onBack={()=>setView(null)}/>;
  if(phase==="accuse")                 return <Accusation clues={clues} interrogated={inter} cipherSolved={cipher} onAccuse={c=>{if(c)setPhase("victory");}} onBack={()=>setView(null)}/>;

  return <Hub clues={clues} interrogated={inter} cipherSolved={cipher} setView={setView}/>;
}