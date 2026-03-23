import { useState, useEffect } from "react";
import { G, THEME, CinePage, RuneRing, MagicOrb, ParchmentCard, GoldDivider, CineBtn, CineTitle, CineConfetti, MagicParticles, FogLayers, AtmosphericLightning, CinematicCastle, useTypewriter } from "./HPCore";

/* ══════════════════════════════════════════════════════════
   GAME DATA
══════════════════════════════════════════════════════════ */
const PREMISE = `The Philosopher's Stone has vanished from the third-floor corridor.\nProfessor Dumbledore's enchantments were bypassed — perfectly.\nFive suspects remain within the castle walls.\nA storm gathers over the Forbidden Forest.\n\nYou are Detective Amritha.\nYou have until midnight.`;

const ROOMS = [
  { id:"potions",  name:"Potions Dungeon",      icon:"🧪", desc:"Stone walls, cold vapour, shelves of motionless ingredients. A cauldron still radiates warmth.", clues:[
    { id:"c1", text:"A smashed Boomslang skin vial — residue matches Polyjuice Potion. Someone was here in disguise.",         found:false, key:true  },
    { id:"c2", text:"Overturned stool near Snape's private cabinet. The lock shows no force — someone had a key.",              found:false, key:false },
    { id:"c3", text:"Monogrammed handkerchief: Q.Q. — found behind a warm cauldron. The ink on it is violet.",                  found:false, key:true  },
  ]},
  { id:"corridor", name:"Third-Floor Corridor", icon:"🚪", desc:"The door stands open. Fluffy is asleep. A melody still lingers in the air — refined, almost professorial.", clues:[
    { id:"c4", text:"A small wooden flute beside Fluffy. Too refined for Hagrid — almost professorial in its craftsmanship.",    found:false, key:true  },
    { id:"c5", text:"The trapdoor: no forced entry. The enchantments were lifted with precise advanced spellwork.",              found:false, key:true  },
    { id:"c6", text:"A single black feather — no known Hogwarts bird. A peacock, perhaps? None are kept here... officially.",   found:false, key:false },
  ]},
  { id:"library",  name:"Restricted Section",   icon:"📖", desc:"A page has been torn from its spine. The remaining books have fallen strangely, completely silent.", clues:[
    { id:"c7", text:"A torn page from 'Secrets of the Darkest Art' — specifically the chapter on stone transmutation.",         found:false, key:true  },
    { id:"c8", text:"The sign-out log: final entry smudged. The ink — distinctive violet — is the same shade as the handkerchief.", found:false, key:true },
    { id:"c9", text:"A Bertie Bott's bean — earwax flavour. Dumbledore's documented preference. He was here recently.",         found:false, key:false },
  ]},
  { id:"mirror",   name:"Mirror of Erised",     icon:"🪞", desc:"The Mirror glows with unusual intensity. Someone stood before it recently — the dust pattern shows it.", clues:[
    { id:"c10",text:"An unsigned note at the Mirror's base: 'I see myself holding it. I always have.'",                         found:false, key:true  },
    { id:"c11",text:"Trace droplets of Felix Felicis — Liquid Luck. This theft was not improvised. It was planned.",            found:false, key:true  },
    { id:"c12",text:"The Mirror shows a face tonight instead of desire — familiar, calculating, wearing a turban.",              found:false, key:false },
  ]},
  { id:"owlery",   name:"The Owlery",           icon:"🦉", desc:"One owl is absent. A letter was sent tonight to an unknown recipient. The ash of burned parchment.", clues:[
    { id:"c13",text:"Burned parchment — one phrase survived: '...the stone is hidden where only the worthy may claim it.'",    found:false, key:true  },
    { id:"c14",text:"An unsent letter: 'Q.Q. to R.Q.' — 'Meet me at the stone. Tonight is the night.'",                        found:false, key:true  },
    { id:"c15",text:"An impression in the straw — someone waited here for hours. Small boots, meticulous heel placement.",      found:false, key:true  },
  ]},
];

const SUSPECTS = [
  { id:"quirrell", name:"Professor Quirrell", role:"Defence Against Dark Arts", icon:"🎓", guilty:true,
    motive:"Possessed by Voldemort — seeking the Stone to restore his master to power",
    alibi:"Claims he was in his office preparing lesson plans throughout the evening",
    tells:["Initials Q.Q. match the handkerchief discovered in the Potions dungeon","His refined flute matches the instrument found beside Fluffy","His violet ink appears in the Restricted Section sign-out log","The letter 'Q.Q. to R.Q.' — Quirinus Quirrell writing to Voldemort","Felix Felicis traces correspond to his known apothecary purchases","He knew Fluffy's weakness — Dumbledore told him personally on arrival"],
    questions:[
      { q:"Where were you between ten and midnight?", options:[
        { text:"In my office, p-p-preparing lessons.", response:"His stutter worsens on 'preparing'. Violet ink on his fingers. His hand moves involuntarily to his turban.", sus:true  },
        { text:"I walked the grounds. The night air settles the nerves.", response:"Walking the grounds on the night the Stone vanishes. You note this carefully in your book.", sus:true  },
      ]},
      { q:"Do you know how one might bypass Fluffy?", options:[
        { text:"A three-headed dog? I have never been near it.", response:"His hand rises to his turban. Beneath it — something shifts. Something old.", sus:true  },
        { text:"Dumbledore may have mentioned something about music.", response:"He volunteers this unprompted. Why would an innocent man know this?", sus:true  },
      ]},
      { q:"What do you know of the Philosopher's Stone?", options:[
        { text:"Only what the history books record.", response:"There are two shadows behind his eyes. One is his. The other is ancient. Hungry.", sus:true  },
        { text:"A dangerous object. Better it were never found.", response:"The turban shifts. For just a moment you hear it — a whisper that is not his voice.", sus:true  },
      ]},
    ]},
  { id:"snape", name:"Professor Snape", role:"Potions Master", icon:"🖤", guilty:false,
    motive:"Known antipathy — though toward what, precisely, remains unclear",
    alibi:"Was observed counter-cursing during the Quidditch match. Multiple eyewitnesses.",
    tells:["Snape was protecting the Stone — counter-cursing Quirrell throughout the evening","His alibi is absolute — students and staff both witnessed his actions","He suspected Quirrell before anyone else. He is innocent."],
    questions:[
      { q:"Why were you observed muttering at the Quidditch match?", options:[
        { text:"Preparing notes. It does not concern you.", response:"Arrogant — but his alibi covers the entire theft window completely. He was in the stands.", sus:false },
        { text:"Counter-jinxes. Someone was cursing Potter's broom.", response:"He states this as flat fact. Cross-referencing confirms it — he was protecting, not stealing.", sus:false },
      ]},
      { q:"Were you at the third-floor corridor last night?", options:[
        { text:"I was bitten on the third floor while investigating suspicious activity.", response:"He shows you the wound. Genuine. He suspected Quirrell before you did.", sus:false },
        { text:"My reasons are my own.", response:"A deflection born of pride. Not guilt.", sus:false },
      ]},
    ]},
  { id:"mcgonagall", name:"Professor McGonagall", role:"Head of Gryffindor", icon:"🐱", guilty:false,
    motive:"Her loyalty to students above all — but loyalty is not guilt",
    alibi:"Playing chess with Nearly Headless Nick. Corroborated by three portraits.",
    tells:["Chess alibi confirmed by Nearly Headless Nick and three independent portraits","Her Animagus form leaves cat paw prints — none found at the scene","She suspected Snape. Snape is innocent. So is she."],
    questions:[
      { q:"Were you near the third-floor corridor?", options:[
        { text:"Certainly not. I was occupied elsewhere.", response:"She holds your gaze without flinching. No evasion. No guilt.", sus:false },
        { text:"I patrol the corridors. As is my duty.", response:"Her route on Tuesdays does not pass the third floor. The duty roster confirms it.", sus:false },
      ]},
      { q:"Do you have suspicions about who is responsible?", options:[
        { text:"I have a theory. It involves a certain colleague of mine.", response:"She suspects Snape — who is entirely innocent. A misdirection, however sincere.", sus:false },
        { text:"I trust Dumbledore's enchantments. This alarms me greatly.", response:"Genuine distress. This is worry, not guilt.", sus:false },
      ]},
    ]},
  { id:"hagrid", name:"Rubeus Hagrid", role:"Gamekeeper", icon:"🌲", guilty:false,
    motive:"Accidentally disclosed Fluffy's weakness to a stranger — unknowingly",
    alibi:"Was in his hut all evening. Norbert the Norwegian Ridgeback confirms his presence.",
    tells:["Told a turban-wearing stranger how to get past Fluffy — Quirrell in disguise","Genuinely devastated when he realises. He is a victim of manipulation, not a perpetrator","The description of the stranger matches Quirrell precisely"],
    questions:[
      { q:"Did you share information about Fluffy with anyone?", options:[
        { text:"There was a fella at the Hog's Head... very interested in magical creatures...", response:"Horror crosses his face as he understands what he has admitted. This guilt is not the theft kind.", sus:true  },
        { text:"I would never betray Fluffy. Never.", response:"He says this passionately. Then he goes very pale.", sus:false },
      ]},
      { q:"Can you describe this stranger?", options:[
        { text:"Had a turban. Quiet sort. Bought me a drink.", response:"A turban. Your pulse quickens. Only one professor at Hogwarts wears a turban.", sus:true  },
        { text:"Didn't see much. He kept to the shadow.", response:"Hagrid is not the villain here. He is a victim.", sus:false },
      ]},
    ]},
  { id:"peeves", name:"Peeves", role:"Poltergeist", icon:"👻", guilty:false,
    motive:"Pure entropy — but even Peeves has physical limitations",
    alibi:"Documented dropping water balloons on Argus Filch, fifth floor. Noted in Filch's complaint log.",
    tells:["Alibi confirmed in Filch's official complaint log: fifth floor, 11:45 PM","Peeves cannot hold objects with sufficient precision for this level of theft","This crime required silence — Peeves is constitutionally incapable of silence"],
    questions:[
      { q:"Were you near the third floor last night?", options:[
        { text:"Oooooh the corridor! Peeves knows all about the doggy!", response:"Insufferably cheerful. But his alibi — water balloons at 11:45 — is documented and precise.", sus:false },
        { text:"Peeves was occupied! Very important business!", response:"Filch's log places him firmly on the fifth floor. Rock solid.", sus:false },
      ]},
      { q:"Did you observe anyone near the corridor?", options:[
        { text:"The turban-man! Peeves saw him! Going somewhere forbidden!", response:"Peeves spotted Quirrell. A crucial piece of testimony from the least credible witness in the castle.", sus:true  },
        { text:"Peeves sees everything. That's the point of being Peeves.", response:"He dissolves into cackling. But beneath the chaos — a genuine witness.", sus:false },
      ]},
    ]},
];

const CIPHER = {
  prompt:"Scratched into the base of the trapdoor — Dumbledore's final message to the investigator he trusted:",
  encoded:"DHLLHO DHZ AOL AOPLS",
  answer:"QUIRRELL WAS THE THIEF",
  shift:7,
  hint:"Caesar cipher. Shift each letter back by 7 positions. D→Q, H→U, L→I, O→H...",
};

/* ══════════════════════════════════════════════════════════
   CASE NOTES PANEL
══════════════════════════════════════════════════════════ */
function CaseNotes({ clues, onClose }) {
  const found = clues.filter(c=>c.found);
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(4,3,8,.94)",backdropFilter:"blur(14px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,zIndex:800 }} className="fi">
      <style>{G}</style>
      <div style={{ width:"100%",maxWidth:520,maxHeight:"88vh",background:"linear-gradient(145deg,#141020,#0f0d1a)",borderRadius:3,display:"flex",flexDirection:"column",border:"1px solid rgba(201,168,76,.2)",boxShadow:"0 40px 80px rgba(0,0,0,.8)" }}>
        <div style={{ background:"rgba(0,0,0,.4)",padding:"16px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(201,168,76,.1)" }}>
          <div>
            <p style={{ fontFamily:"'Cinzel',serif",color:THEME.gold,fontSize:".75rem",letterSpacing:".35em" }}>CASE NOTES</p>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.goldDim,fontSize:".78rem",fontStyle:"italic" }}>Evidence collected so far</p>
          </div>
          <button style={{ background:"none",border:"none",color:THEME.goldDim,cursor:"pointer",fontSize:"1.1rem",opacity:.6 }} onClick={onClose}>✕</button>
        </div>
        <div style={{ flex:1,overflowY:"auto",padding:"20px 22px",display:"flex",flexDirection:"column",gap:10 }}>
          {found.length===0 && (
            <p style={{ color:THEME.silverDim,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",textAlign:"center",marginTop:24,opacity:.6 }}>
              No evidence collected yet.<br/>Begin your investigation.
            </p>
          )}
          {found.map((c,i)=>(
            <div key={c.id} style={{ display:"flex",gap:12,padding:"12px 16px",background:"rgba(201,168,76,.03)",borderLeft:`2px solid ${c.key?"rgba(201,168,76,.45)":"rgba(201,168,76,.12)"}`,borderRadius:"0 2px 2px 0" }} className="fil">
              <span style={{ color:c.key?"rgba(201,168,76,.6)":"rgba(201,168,76,.2)",flexShrink:0,marginTop:2,fontSize:".8rem" }}>✦</span>
              <div>
                <p style={{ color:THEME.silver,fontFamily:"'Cormorant Garamond',serif",fontSize:".95rem",lineHeight:1.7 }}>{c.text}</p>
                {c.key && <p style={{ color:THEME.goldDim,fontFamily:"'Cinzel',serif",fontSize:".58rem",letterSpacing:".3em",marginTop:4 }}>KEY EVIDENCE</p>}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding:"12px 22px",borderTop:"1px solid rgba(201,168,76,.08)" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <span style={{ color:THEME.goldDim,fontFamily:"'Cinzel',serif",fontSize:".62rem",letterSpacing:".3em" }}>{found.length} / {clues.length}</span>
            <div style={{ width:"55%",height:2,background:"rgba(201,168,76,.08)",borderRadius:1 }}>
              <div style={{ width:`${(found.length/clues.length)*100}%`,height:"100%",background:"rgba(201,168,76,.5)",borderRadius:1,transition:"width .6s ease" }}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ROOM EXPLORER
══════════════════════════════════════════════════════════ */
function RoomExplorer({ room, allClues, onFindClue, onBack }) {
  const [examining,setEx] = useState(null);
  const roomClues = allClues.filter(c=>room.clues.some(rc=>rc.id===c.id));

  return (
    <div style={{ minHeight:"100vh",background:THEME.bg,paddingBottom:60 }} className="fi">
      <style>{G}</style>
      <MagicParticles count={35}/><FogLayers/><AtmosphericLightning/>
      {/* Sticky header */}
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",background:"rgba(6,5,10,.85)",borderBottom:"1px solid rgba(201,168,76,.1)",backdropFilter:"blur(10px)",position:"sticky",top:0,zIndex:50 }}>
        <CineBtn onClick={onBack} variant="ghost" style={{ padding:"9px 18px",fontSize:".72rem" }}>← Back</CineBtn>
        <div style={{ textAlign:"center" }}>
          <p style={{ fontFamily:"'Cinzel',serif",color:THEME.gold,fontSize:"clamp(.8rem,3.5vw,1rem)",letterSpacing:".2em" }}>{room.icon} {room.name}</p>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.goldDim,fontSize:".72rem",fontStyle:"italic" }}>Investigation in progress</p>
        </div>
        <div style={{ width:80 }}/>
      </div>

      <div style={{ width:"100%",maxWidth:520,margin:"0 auto",padding:"28px 20px",display:"flex",flexDirection:"column",gap:22 }}>
        <p style={{ fontFamily:"'IM Fell English',serif",fontSize:"1rem",color:THEME.silverDim,lineHeight:1.85,fontStyle:"italic",textAlign:"center" }}>{room.desc}</p>
        <GoldDivider/>
        <p style={{ fontFamily:"'Cinzel',serif",color:THEME.goldDim,fontSize:".62rem",letterSpacing:".45em",textAlign:"center" }}>EXAMINE THE ROOM</p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:10 }}>
          {roomClues.map((clue,i)=>(
            <div key={clue.id} onClick={()=>{ if(!clue.found)onFindClue(clue.id); setEx(clue); }} style={{
              background: clue.found ? "linear-gradient(145deg,#181424,#141020)" : "linear-gradient(145deg,#111020,#0e0c18)",
              border:`1px solid ${clue.found?"rgba(201,168,76,.35)":"rgba(201,168,76,.08)"}`,
              borderRadius:3, padding:"18px 12px", textAlign:"center", cursor:"pointer",
              transition:"all .4s cubic-bezier(.23,1,.32,1)",
              boxShadow: clue.found ? "0 0 20px rgba(201,168,76,.08)" : "none",
              display:"flex",flexDirection:"column",gap:8,alignItems:"center",
            }}>
              <span style={{ fontSize:20,opacity:clue.found?.9:.4,filter:clue.found?"drop-shadow(0 0 8px rgba(201,168,76,.4))":"none",transition:"all .3s" }}>
                {clue.found ? "✦" : "○"}
              </span>
              <span style={{ fontFamily:"'Cinzel',serif",fontSize:".58rem",color:clue.found?THEME.goldDim:"rgba(201,168,76,.25)",letterSpacing:".3em",textTransform:"uppercase" }}>
                {clue.found ? "Examined" : `Area ${i+1}`}
              </span>
              {clue.key&&clue.found&&<span style={{ fontFamily:"'Cinzel',serif",fontSize:".55rem",color:"rgba(201,168,76,.5)",letterSpacing:".25em",borderTop:"1px solid rgba(201,168,76,.2)",paddingTop:6,width:"100%",textAlign:"center" }}>KEY</span>}
            </div>
          ))}
        </div>
      </div>

      {examining && (
        <div style={{ position:"fixed",inset:0,background:"rgba(4,3,8,.88)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,zIndex:700 }} className="fi">
          <ParchmentCard style={{ maxWidth:460,width:"100%",border:`1px solid rgba(201,168,76,${examining.key?.4:.15})`,animation:"breathe 4s ease-in-out infinite" }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:14,alignItems:"flex-start" }}>
              <p style={{ fontFamily:"'Cinzel',serif",color:examining.key?THEME.gold:THEME.goldDim,fontSize:".6rem",letterSpacing:".4em" }}>{examining.key?"KEY EVIDENCE":"OBSERVATION"}</p>
              <button style={{ background:"none",border:"none",color:THEME.goldDim,cursor:"pointer",opacity:.5,fontSize:".9rem" }} onClick={()=>setEx(null)}>✕</button>
            </div>
            <GoldDivider style={{ marginBottom:18 }}/>
            <p style={{ fontFamily:"'IM Fell English',serif",fontSize:"1rem",color:THEME.parchDark,lineHeight:1.9 }}>{examining.text}</p>
            {examining.key && <p style={{ fontFamily:"'Cinzel',serif",color:THEME.goldDim,fontSize:".6rem",letterSpacing:".4em",textAlign:"center",marginTop:16,fontStyle:"italic" }}>This changes things.</p>}
          </ParchmentCard>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   INTERROGATION
══════════════════════════════════════════════════════════ */
function Interrogation({ suspect, onBack, onComplete }) {
  const [qIdx,setQIdx]     = useState(0);
  const [log,setLog]       = useState([]);
  const [sus,setSus]       = useState(0);
  const [tells,setTells]   = useState(false);
  const done = qIdx >= suspect.questions.length;
  const susColor = sus===0?"rgba(64,160,96,.8)":sus===1?"rgba(201,168,76,.8)":"rgba(192,64,64,.8)";

  const answer = opt => {
    setLog(p=>[...p,{q:suspect.questions[qIdx].q,a:opt.text,r:opt.response,s:opt.sus}]);
    if(opt.sus) setSus(s=>s+1);
    if(qIdx<suspect.questions.length-1) setQIdx(q=>q+1);
    else { setQIdx(suspect.questions.length); onComplete(suspect.id); }
  };

  return (
    <div style={{ minHeight:"100vh",background:THEME.bg,paddingBottom:40 }} className="fi">
      <style>{G}</style>
      <MagicParticles count={30}/><FogLayers/><AtmosphericLightning/>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",background:"rgba(6,5,10,.85)",borderBottom:"1px solid rgba(201,168,76,.1)",backdropFilter:"blur(10px)",position:"sticky",top:0,zIndex:50 }}>
        <CineBtn onClick={onBack} variant="ghost" style={{ padding:"9px 18px",fontSize:".72rem" }}>← Back</CineBtn>
        <p style={{ fontFamily:"'Cinzel',serif",color:THEME.gold,fontSize:".85rem",letterSpacing:".3em" }}>INTERROGATION</p>
        <div style={{ width:80 }}/>
      </div>

      <div style={{ width:"100%",maxWidth:520,margin:"0 auto",padding:"24px 20px",display:"flex",flexDirection:"column",gap:18 }}>
        {/* Suspect profile */}
        <ParchmentCard>
          <div style={{ display:"flex",gap:16,alignItems:"flex-start" }}>
            <div style={{ flexShrink:0,textAlign:"center" }}>
              <div style={{ fontSize:44,filter:"drop-shadow(0 0 10px rgba(201,168,76,.2))" }}>{suspect.icon}</div>
              <p style={{ fontFamily:"'Cinzel',serif",color:THEME.gold,fontSize:".8rem",letterSpacing:".15em",marginTop:6 }}>{suspect.name}</p>
              <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.goldDim,fontSize:".75rem",fontStyle:"italic" }}>{suspect.role}</p>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ marginBottom:10 }}>
                <p style={{ fontFamily:"'Cinzel',serif",color:THEME.goldDim,fontSize:".58rem",letterSpacing:".35em",marginBottom:4 }}>SUSPICION LEVEL</p>
                <div style={{ height:2,background:"rgba(255,255,255,.06)",borderRadius:1 }}>
                  <div style={{ width:`${(sus/suspect.questions.length)*100}%`,height:"100%",background:susColor,borderRadius:1,transition:"width .6s ease" }}/>
                </div>
              </div>
              <GoldDivider style={{ marginBottom:10 }}/>
              <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.silverDim,fontSize:".88rem",lineHeight:1.6,marginBottom:6 }}><span style={{ color:THEME.goldDim,fontFamily:"'Cinzel',serif",fontSize:".58rem",letterSpacing:".3em" }}>MOTIVE — </span>{suspect.motive}</p>
              <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.silverDim,fontSize:".88rem",lineHeight:1.6,opacity:.7 }}><span style={{ color:THEME.goldDim,fontFamily:"'Cinzel',serif",fontSize:".58rem",letterSpacing:".3em" }}>ALIBI — </span>{suspect.alibi}</p>
            </div>
          </div>
        </ParchmentCard>

        {/* Current question */}
        {!done && (
          <div className="fiu">
            <p style={{ fontFamily:"'Cinzel',serif",color:THEME.goldDim,fontSize:".6rem",letterSpacing:".45em",marginBottom:12 }}>DETECTIVE AMRITHA</p>
            <p style={{ fontFamily:"'IM Fell English',serif",fontSize:"1.05rem",color:THEME.parchDark,lineHeight:1.85,fontStyle:"italic",marginBottom:18 }}>
              "{suspect.questions[qIdx]?.q}"
            </p>
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              {suspect.questions[qIdx]?.options.map((opt,i)=>(
                <button key={i} onClick={()=>answer(opt)} style={{
                  background:"rgba(201,168,76,.03)",border:"1px solid rgba(201,168,76,.12)",
                  color:THEME.parchDark,padding:"14px 18px",cursor:"pointer",
                  fontFamily:"'IM Fell English',serif",fontSize:"1rem",textAlign:"left",
                  borderRadius:2,transition:"all .3s cubic-bezier(.23,1,.32,1)",lineHeight:1.6,
                }}>
                  <span style={{ color:"rgba(201,168,76,.4)",marginRight:10,fontFamily:"serif" }}>›</span>
                  <em>"{opt.text}"</em>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Previous exchange log */}
        {log.map((entry,i)=>(
          <div key={i} style={{ borderLeft:"1px solid rgba(201,168,76,.12)",paddingLeft:16 }}>
            <p style={{ fontFamily:"'Cinzel',serif",color:THEME.goldDim,fontSize:".58rem",letterSpacing:".3em",marginBottom:6 }}>{entry.q}</p>
            <p style={{ fontFamily:"'IM Fell English',serif",color:THEME.silverDim,fontSize:".9rem",fontStyle:"italic",marginBottom:6 }}>"{entry.a}"</p>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",color:entry.s?"rgba(192,100,80,.8)":"rgba(80,160,100,.7)",fontSize:".85rem",letterSpacing:".05em" }}>{entry.r}</p>
          </div>
        ))}

        {done && (
          <div className="fiu" style={{ textAlign:"center" }}>
            <GoldDivider style={{ marginBottom:16 }}/>
            <p style={{ fontFamily:"'Cinzel',serif",color:THEME.goldDim,fontSize:".62rem",letterSpacing:".45em",marginBottom:16 }}>INTERROGATION CONCLUDED</p>
            <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
              <CineBtn onClick={()=>setTells(!tells)}>{tells?"Conceal Analysis":"View Analysis"}</CineBtn>
              <CineBtn onClick={onBack} variant="ghost">Return</CineBtn>
            </div>
            {tells && (
              <div className="fiu" style={{ marginTop:18,textAlign:"left" }}>
                <GoldDivider style={{ marginBottom:14 }}/>
                {suspect.tells.map((t,i)=>(
                  <div key={i} style={{ display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid rgba(201,168,76,.06)" }}>
                    <span style={{ color:"rgba(201,168,76,.4)",flexShrink:0,fontSize:".8rem" }}>✦</span>
                    <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.silverDim,fontSize:".92rem",lineHeight:1.65 }}>{t}</p>
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

/* ══════════════════════════════════════════════════════════
   ANCIENT RUNES CIPHER
══════════════════════════════════════════════════════════ */
function RunesCipher({ onSolve, solved, onBack }) {
  const [input,setInput]   = useState("");
  const [wrong,setWrong]   = useState(false);
  const [hint,setHint]     = useState(false);

  const check = () => {
    if(input.trim().toUpperCase()===CIPHER.answer) onSolve();
    else { setWrong(true);setTimeout(()=>setWrong(false),700);setInput(""); }
  };

  return (
    <div style={{ minHeight:"100vh",background:THEME.bg,display:"flex",flexDirection:"column" }} className="fi">
      <style>{G}</style>
      <MagicParticles count={35} color="#6060cc"/>
      <FogLayers/><AtmosphericLightning/>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",background:"rgba(6,5,10,.85)",borderBottom:"1px solid rgba(100,80,200,.15)",backdropFilter:"blur(10px)",position:"sticky",top:0,zIndex:50 }}>
        <CineBtn onClick={onBack} variant="ghost" style={{ padding:"9px 18px",fontSize:".72rem" }}>← Back</CineBtn>
        <p style={{ fontFamily:"'Cinzel',serif",color:"rgba(140,130,220,.8)",fontSize:".85rem",letterSpacing:".35em" }}>ANCIENT RUNES</p>
        <div style={{ width:80 }}/>
      </div>

      <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px 20px 60px" }}>
        <div style={{ width:"100%",maxWidth:500,display:"flex",flexDirection:"column",alignItems:"center",gap:24 }}>
          <div style={{ animation:"runeReveal 1s ease",textAlign:"center" }}>
            <RuneRing size={90}/>
          </div>
          <CineTitle eyebrow="TRAPDOOR INSCRIPTION" size="clamp(1.2rem,4.5vw,1.8rem)">The Cipher</CineTitle>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.silverDim,fontSize:".95rem",fontStyle:"italic",textAlign:"center",opacity:.8 }}>{CIPHER.prompt}</p>

          {/* Encoded message display */}
          <div style={{ width:"100%",background:"rgba(60,50,120,.08)",border:"1px solid rgba(100,80,200,.2)",borderRadius:3,padding:"20px 24px",textAlign:"center",animation:"mirrorGlow 4s ease-in-out infinite",boxShadow:"0 0 40px rgba(60,50,120,.1)" }}>
            <style>{`@keyframes mirrorGlow{0%,100%{box-shadow:0 0 20px rgba(60,50,120,.1)}50%{box-shadow:0 0 50px rgba(60,50,120,.25)}}`}</style>
            <p style={{ fontFamily:"'Cinzel',serif",fontSize:"clamp(.9rem,3.5vw,1.2rem)",color:"rgba(160,150,240,.85)",letterSpacing:".4em",wordSpacing:"1em",lineHeight:2 }}>
              {CIPHER.encoded}
            </p>
          </div>

          <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.silverDim,fontSize:".95rem",lineHeight:1.85,fontStyle:"italic",textAlign:"center",opacity:.75 }}>
            Shift each letter back by 7 positions in the alphabet.<br/>
            A→T · B→U · ... · H→A · G→Z
          </p>

          {/* Reference table */}
          <ParchmentCard style={{ border:"1px solid rgba(100,80,200,.15)" }}>
            <p style={{ fontFamily:"'Cinzel',serif",color:THEME.goldDim,fontSize:".6rem",letterSpacing:".4em",marginBottom:12,textAlign:"center" }}>SHIFT REFERENCE — BACK BY 7</p>
            <div style={{ display:"flex",flexWrap:"wrap",gap:3,justifyContent:"center" }}>
              {Array.from({length:26},(_,i)=>{
                const enc=String.fromCharCode(65+i);
                const dec=String.fromCharCode(((i-7+26)%26)+65);
                return(
                  <div key={i} style={{ display:"flex",flexDirection:"column",alignItems:"center",minWidth:22 }}>
                    <span style={{ color:"rgba(140,130,220,.7)",fontFamily:"'Cinzel',serif",fontSize:".55rem" }}>{enc}</span>
                    <span style={{ color:"rgba(100,100,160,.4)",fontSize:".4rem" }}>↓</span>
                    <span style={{ color:THEME.gold,fontFamily:"'Cinzel',serif",fontSize:".55rem" }}>{dec}</span>
                  </div>
                );
              })}
            </div>
          </ParchmentCard>

          {!solved ? (
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:14,width:"100%" }}>
              <input
                style={{ width:"100%",maxWidth:460,background:"rgba(0,0,0,.5)",border:`1px solid ${wrong?"rgba(139,26,26,.7)":"rgba(100,80,200,.3)"}`,color:"rgba(160,150,240,.9)",padding:"14px 20px",fontFamily:"'Cinzel',serif",fontSize:".88rem",letterSpacing:".3em",outline:"none",borderRadius:2,textAlign:"center",transition:"border-color .3s",animation:wrong?"shake .6s ease":"none" }}
                value={input} onChange={e=>setInput(e.target.value.toUpperCase())}
                onKeyDown={e=>e.key==="Enter"&&check()} placeholder="Enter decoded message"
              />
              <div style={{ display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center" }}>
                <CineBtn onClick={check} variant="crimson">Decode</CineBtn>
                <CineBtn onClick={()=>setHint(s=>!s)} variant="ghost" style={{ padding:"14px 24px" }}>{hint?"Conceal Hint":"Request Hint"}</CineBtn>
              </div>
              {wrong && <p style={{ color:"rgba(192,64,64,.7)",fontFamily:"'Cinzel',serif",fontSize:".68rem",letterSpacing:".3em" }}>The runes do not yield.</p>}
              {hint  && <p style={{ color:THEME.silverDim,fontFamily:"'Cormorant Garamond',serif",fontSize:".92rem",fontStyle:"italic",textAlign:"center",opacity:.7 }}>{CIPHER.hint}</p>}
            </div>
          ) : (
            <ParchmentCard glowing className="fiu" style={{ border:"1px solid rgba(64,160,96,.35)",textAlign:"center" }}>
              <p style={{ fontFamily:"'Cinzel',serif",color:"rgba(64,160,96,.8)",fontSize:".65rem",letterSpacing:".45em",marginBottom:14 }}>DECODED</p>
              <GoldDivider style={{ marginBottom:16 }}/>
              <p style={{ fontFamily:"'Cinzel',serif",color:THEME.gold,fontSize:".95rem",letterSpacing:".2em",marginBottom:14 }}>"{CIPHER.answer}"</p>
              <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.silverDim,fontSize:".92rem",fontStyle:"italic",lineHeight:1.7 }}>
                Dumbledore knew from the beginning.<br/>
                He was waiting for the right person to find it.<br/>
                He was waiting for you.
              </p>
              <GoldDivider style={{ margin:"18px 0" }}/>
              <CineBtn onClick={onBack} variant="emerald">Return to Investigation</CineBtn>
            </ParchmentCard>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ACCUSATION
══════════════════════════════════════════════════════════ */
function Accusation({ clues, interrogated, cipherSolved, onAccuse, onBack }) {
  const [selected,setSelected] = useState(null);
  const [result,setResult]     = useState(null);
  const foundKey = clues.filter(c=>c.found&&c.key).length;
  const ready = foundKey>=5 && interrogated.length>=3 && cipherSolved;

  return (
    <div style={{ minHeight:"100vh",background:THEME.bg,paddingBottom:60 }} className="fi">
      <style>{G}</style>
      <MagicParticles count={30}/><FogLayers/><AtmosphericLightning/>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",background:"rgba(6,5,10,.85)",borderBottom:"1px solid rgba(139,26,26,.2)",backdropFilter:"blur(10px)",position:"sticky",top:0,zIndex:50 }}>
        <CineBtn onClick={onBack} variant="ghost" style={{ padding:"9px 18px",fontSize:".72rem" }}>← Back</CineBtn>
        <p style={{ fontFamily:"'Cinzel',serif",color:"rgba(192,64,64,.8)",fontSize:".85rem",letterSpacing:".3em" }}>THE ACCUSATION</p>
        <div style={{ width:80 }}/>
      </div>

      <div style={{ width:"100%",maxWidth:520,margin:"0 auto",padding:"28px 20px",display:"flex",flexDirection:"column",gap:22 }}>
        <CineTitle eyebrow="FINAL JUDGEMENT" size="clamp(1.3rem,5vw,2rem)">Name the Thief</CineTitle>
        <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.silverDim,fontSize:".95rem",fontStyle:"italic",textAlign:"center",opacity:.75 }}>
          Choose with precision. A wrong accusation gives Voldemort time.
        </p>

        {!ready && (
          <ParchmentCard style={{ border:"1px solid rgba(201,168,76,.12)",textAlign:"center" }}>
            <p style={{ fontFamily:"'Cinzel',serif",color:THEME.goldDim,fontSize:".68rem",letterSpacing:".3em",marginBottom:8 }}>INSUFFICIENT EVIDENCE</p>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.silverDim,fontSize:".88rem",opacity:.7 }}>
              Key evidence: {foundKey}/5 · Suspects: {interrogated.length}/3 · Cipher: {cipherSolved?"✓":"✗"}
            </p>
          </ParchmentCard>
        )}

        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {SUSPECTS.map(s=>(
            <div key={s.id} onClick={()=>{setSelected(s.id);setResult(null);}} style={{
              background: selected===s.id ? "linear-gradient(145deg,#1e1020,#18101a)" : "linear-gradient(145deg,#121020,#0e0c18)",
              border:`1px solid ${selected===s.id?"rgba(192,64,64,.45)":"rgba(201,168,76,.08)"}`,
              borderRadius:3, padding:"16px 20px", cursor:"pointer",
              transition:"all .4s cubic-bezier(.23,1,.32,1)",
            }}>
              <div style={{ display:"flex",alignItems:"center",gap:14 }}>
                <span style={{ fontSize:28,filter:`drop-shadow(0 0 8px ${selected===s.id?"rgba(192,64,64,.4)":"rgba(201,168,76,.2)"})` }}>{s.icon}</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:"'Cinzel',serif",color:selected===s.id?"rgba(220,100,100,.9)":THEME.gold,fontSize:".85rem",letterSpacing:".15em" }}>{s.name}</p>
                  <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.goldDim,fontSize:".8rem",fontStyle:"italic" }}>{s.role}</p>
                </div>
                {selected===s.id && <span style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",letterSpacing:".2em",color:"rgba(192,64,64,.7)" }}>ACCUSED</span>}
              </div>
            </div>
          ))}
        </div>

        {selected&&!result && (
          <div className="fiu" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:16 }}>
            <ParchmentCard style={{ textAlign:"center",border:"1px solid rgba(192,64,64,.2)" }}>
              <p style={{ fontFamily:"'IM Fell English',serif",color:THEME.parchDark,fontSize:"1rem",lineHeight:1.8 }}>
                "I hereby accuse <strong style={{ color:"rgba(220,100,100,.9)" }}>{SUSPECTS.find(s=>s.id===selected)?.name}</strong> of stealing the Philosopher's Stone from Hogwarts."
              </p>
            </ParchmentCard>
            <CineBtn onClick={()=>{ const c=selected==="quirrell"; setResult(c?"correct":"wrong"); if(c)setTimeout(()=>onAccuse(true),1400); }} variant="crimson" style={{ padding:"15px 40px" }}>
              Make Accusation
            </CineBtn>
          </div>
        )}

        {result==="wrong" && (
          <ParchmentCard className="fiu" style={{ border:"1px solid rgba(139,26,26,.3)",textAlign:"center" }}>
            <p style={{ fontFamily:"'Cinzel',serif",color:"rgba(192,64,64,.8)",fontSize:".72rem",letterSpacing:".4em",marginBottom:10 }}>INCORRECT</p>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.silverDim,fontSize:".95rem",fontStyle:"italic",marginBottom:16,opacity:.8 }}>
              The evidence does not support this conclusion.<br/>Return to the investigation.
            </p>
            <CineBtn onClick={()=>{setSelected(null);setResult(null);}} variant="ghost">Reconsider</CineBtn>
          </ParchmentCard>
        )}

        {result==="correct" && (
          <ParchmentCard className="fiu" style={{ border:"1px solid rgba(64,160,96,.3)",textAlign:"center" }}>
            <p style={{ fontFamily:"'Cinzel',serif",color:"rgba(64,160,96,.8)",fontSize:".72rem",letterSpacing:".4em",marginBottom:10 }}>CORRECT</p>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.silverDim,fontSize:"1rem",fontStyle:"italic",opacity:.8 }}>
              The turban falls. The truth surfaces.<br/>The Stone is safe.
            </p>
          </ParchmentCard>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   VICTORY
══════════════════════════════════════════════════════════ */
function Victory() {
  return (
    <div style={{ minHeight:"100vh",background:THEME.bg,paddingBottom:80,display:"flex",justifyContent:"center" }} className="fi">
      <style>{G}</style>
      <CineConfetti/>
      <MagicParticles count={70} color="#c9a84c"/>
      <FogLayers/><AtmosphericLightning/><CinematicCastle/>

      <div style={{ width:"100%",maxWidth:520,padding:"40px 20px",display:"flex",flexDirection:"column",alignItems:"center",gap:24,position:"relative",zIndex:10 }}>
        <RuneRing size={110}/>
        <CineTitle eyebrow="THE INVESTIGATION IS COMPLETE" size="clamp(1.8rem,7vw,3rem)">Case Solved</CineTitle>
        <GoldDivider/>

        <ParchmentCard glowing>
          <p style={{ fontFamily:"'Cinzel',serif",color:THEME.goldDim,fontSize:".62rem",letterSpacing:".45em",textAlign:"center",marginBottom:14 }}>OFFICIAL VERDICT</p>
          <p style={{ fontFamily:"'IM Fell English',serif",fontSize:"1rem",color:THEME.parchDark,lineHeight:1.9,textAlign:"center",marginBottom:16 }}>
            <strong style={{ color:"rgba(192,64,64,.9)" }}>Professor Quirinus Quirrell</strong>, acting under the possession of Lord Voldemort, is hereby found guilty of attempting to steal the Philosopher's Stone.
          </p>
          <GoldDivider style={{ marginBottom:14 }}/>
          <p style={{ fontFamily:"'Cinzel',serif",color:THEME.goldDim,fontSize:".6rem",letterSpacing:".35em",marginBottom:12 }}>EVIDENCE</p>
          {[
            "Handkerchief Q.Q. — Potions dungeon","Refined flute — used to subdue Fluffy",
            "Violet ink — Restricted Section sign-out log","Letter: Q.Q. to R.Q. — Quirrell to Voldemort",
            "Felix Felicis traces — his apothecary purchases","Peeves: spotted him near the corridor at 11:20",
            "Hagrid: confirmed turban-wearing stranger at the pub","Cipher decoded: QUIRRELL WAS THE THIEF",
            "Mirror of Erised note: 'I see myself holding it. I always have.'",
          ].map((e,i)=>(
            <div key={i} style={{ display:"flex",gap:10,padding:"6px 0",borderBottom:"1px solid rgba(201,168,76,.05)" }}>
              <span style={{ color:"rgba(201,168,76,.3)",flexShrink:0,fontSize:".75rem" }}>✦</span>
              <span style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.silverDim,fontSize:".88rem" }}>{e}</span>
            </div>
          ))}
        </ParchmentCard>

        <div style={{ width:"100%",background:"linear-gradient(145deg,rgba(30,20,10,.8),rgba(20,15,8,.8))",border:"1px solid rgba(201,168,76,.2)",borderRadius:3,padding:"32px 24px",textAlign:"center",boxShadow:"0 0 60px rgba(201,168,76,.06)" }}>
          <p style={{ fontFamily:"'Cinzel',serif",color:THEME.gold,fontSize:"clamp(.85rem,3.5vw,1.1rem)",letterSpacing:".15em",marginBottom:20,animation:"goldPulse 3s ease-in-out infinite" }}>
            Happy Birthday, Amritha
          </p>
          <GoldDivider style={{ marginBottom:20 }}/>
          <p style={{ fontFamily:"'IM Fell English',serif",fontSize:"clamp(.95rem,3vw,1.1rem)",color:THEME.parchDark,lineHeight:2.2 }}>
            You cracked the cipher.<br/>
            You interrogated every suspect.<br/>
            You explored every shadowed corridor,<br/>
            and found the truth hidden in the runes.<br/><br/>
            <em style={{ color:THEME.gold }}>
              "You are the brightest witch of your age —<br/>
              not because of what you know,<br/>
              but because of how fiercely you love,<br/>
              how bravely you seek,<br/>
              and how brilliantly you shine.<br/><br/>
              May your twenty-second year hold<br/>
              magic even Dumbledore couldn't predict."
            </em>
          </p>
          <GoldDivider style={{ margin:"24px 0" }}/>
          <div style={{ display:"flex",justifyContent:"center",gap:12,fontSize:"1.3rem",flexWrap:"wrap" }}>
            {["⚡","🦁","📖","🦉","🪄","✦","💕"].map((e,i)=>(
              <span key={i} style={{ animation:`breathe ${1.8+i*.2}s ${i*.18}s ease-in-out infinite`,filter:"drop-shadow(0 0 8px rgba(201,168,76,.35))" }}>{e}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   INVESTIGATION HUB
══════════════════════════════════════════════════════════ */
function InvestigationHub({ clues, interrogated, cipherSolved, setView }) {
  const [notes,setNotes] = useState(false);
  const found = clues.filter(c=>c.found).length;
  const total = clues.length;
  const pct = Math.round((found/total)*100);

  return (
    <div style={{ minHeight:"100vh",background:THEME.bg,position:"relative",paddingBottom:260 }}>
      <style>{G}</style>
      <MagicParticles count={50}/><FogLayers/><AtmosphericLightning/><CinematicCastle/>
      {notes && <CaseNotes clues={clues} onClose={()=>setNotes(false)}/>}

      {/* HUD */}
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 20px",background:"rgba(6,5,10,.88)",borderBottom:"1px solid rgba(201,168,76,.1)",backdropFilter:"blur(12px)",flexWrap:"wrap",gap:10,position:"sticky",top:0,zIndex:500 }}>
        <div>
          <p style={{ fontFamily:"'Cinzel',serif",color:THEME.gold,fontSize:".75rem",letterSpacing:".2em" }}>Detective Amritha</p>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.goldDim,fontSize:".7rem",fontStyle:"italic" }}>Hogwarts Investigation</p>
        </div>
        <div style={{ display:"flex",gap:20 }}>
          {[["CLUES",`${found}/${total}`,THEME.gold],["SUSPECTS",`${interrogated.length}/${SUSPECTS.length}`,THEME.gold],["CIPHER",cipherSolved?"✓":"✗",cipherSolved?"rgba(64,160,96,.8)":"rgba(192,64,64,.7)"]].map(([l,v,c])=>(
            <div key={l} style={{ textAlign:"center" }}>
              <p style={{ fontFamily:"'Cinzel',serif",color:THEME.goldDim,fontSize:".52rem",letterSpacing:".4em" }}>{l}</p>
              <p style={{ fontFamily:"'Cinzel',serif",color:c,fontSize:".88rem",letterSpacing:".15em" }}>{v}</p>
            </div>
          ))}
        </div>
        <CineBtn onClick={()=>setNotes(true)} variant="ghost" style={{ padding:"8px 16px",fontSize:".68rem" }}>Case Notes</CineBtn>
      </div>

      <div style={{ width:"100%",maxWidth:520,margin:"0 auto",padding:"28px 20px" }}>
        {/* Title */}
        <div style={{ textAlign:"center",marginBottom:28 }}>
          <p style={{ fontFamily:"'Cinzel',serif",color:THEME.goldDim,fontSize:".6rem",letterSpacing:".55em",marginBottom:10 }}>A HOGWARTS MYSTERY</p>
          <h1 style={{ fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:"clamp(1.3rem,5.5vw,2.2rem)",color:THEME.gold,letterSpacing:".06em",lineHeight:1.2,textShadow:"0 0 40px rgba(201,168,76,.25)",animation:"goldPulse 4s ease-in-out infinite" }}>
            The Philosopher's Thief
          </h1>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.silverDim,fontSize:".82rem",letterSpacing:".15em",fontStyle:"italic",marginTop:6,opacity:.7 }}>Hogwarts · 11:47 PM · A storm gathers</p>
          {/* Progress */}
          <div style={{ width:"100%",maxWidth:320,height:1,background:"rgba(201,168,76,.1)",borderRadius:1,margin:"16px auto 6px" }}>
            <div style={{ width:`${pct}%`,height:"100%",background:"rgba(201,168,76,.4)",borderRadius:1,transition:"width 1s ease" }}/>
          </div>
          <p style={{ fontFamily:"'Cinzel',serif",color:"rgba(201,168,76,.3)",fontSize:".55rem",letterSpacing:".4em" }}>{pct}% INVESTIGATED</p>
        </div>

        {/* Locations */}
        <p style={{ fontFamily:"'Cinzel',serif",color:THEME.goldDim,fontSize:".6rem",letterSpacing:".5em",marginBottom:12,textAlign:"center" }}>LOCATIONS</p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8,marginBottom:22 }}>
          {ROOMS.map(room=>{
            const rc=clues.filter(c=>room.clues.some(x=>x.id===c.id)&&c.found).length;
            const cleared=rc===room.clues.length;
            return(
              <div key={room.id} onClick={()=>setView({type:"room",id:room.id})} style={{
                background: cleared ? "linear-gradient(145deg,#181424,#141020)" : "linear-gradient(145deg,#111020,#0e0c18)",
                border:`1px solid ${cleared?"rgba(201,168,76,.3)":"rgba(201,168,76,.07)"}`,
                borderRadius:3, padding:"14px 10px", textAlign:"center", cursor:"pointer",
                transition:"all .4s cubic-bezier(.23,1,.32,1)",
                display:"flex",flexDirection:"column",gap:5,alignItems:"center",
                boxShadow: cleared ? "0 0 20px rgba(201,168,76,.06)" : "none",
              }}>
                <span style={{ fontSize:22,opacity:cleared?.9:.5,filter:cleared?"drop-shadow(0 0 6px rgba(201,168,76,.3))":"none",transition:"all .3s" }}>{room.icon}</span>
                <p style={{ fontFamily:"'Cinzel',serif",fontSize:".62rem",color:cleared?THEME.gold:"rgba(201,168,76,.4)",letterSpacing:".1em" }}>{room.name}</p>
                <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.goldDim,fontSize:".7rem" }}>{rc}/{room.clues.length}</p>
                {cleared&&<p style={{ fontFamily:"'Cinzel',serif",color:"rgba(201,168,76,.4)",fontSize:".52rem",letterSpacing:".35em" }}>CLEARED</p>}
              </div>
            );
          })}
        </div>

        {/* Suspects */}
        <p style={{ fontFamily:"'Cinzel',serif",color:THEME.goldDim,fontSize:".6rem",letterSpacing:".5em",marginBottom:12,textAlign:"center" }}>PERSONS OF INTEREST</p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:8,marginBottom:22 }}>
          {SUSPECTS.map(s=>(
            <div key={s.id} onClick={()=>setView({type:"interrogation",id:s.id})} style={{
              background: interrogated.includes(s.id) ? "linear-gradient(145deg,#181424,#141020)" : "linear-gradient(145deg,#111020,#0e0c18)",
              border:`1px solid ${interrogated.includes(s.id)?"rgba(201,168,76,.25)":"rgba(201,168,76,.07)"}`,
              borderRadius:3, padding:"12px 8px", textAlign:"center", cursor:"pointer",
              transition:"all .4s cubic-bezier(.23,1,.32,1)", display:"flex",flexDirection:"column",alignItems:"center",gap:4,
            }}>
              <span style={{ fontSize:22,opacity:interrogated.includes(s.id)?.9:.45,filter:interrogated.includes(s.id)?"drop-shadow(0 0 6px rgba(201,168,76,.3))":"none",transition:"all .3s" }}>{s.icon}</span>
              <p style={{ fontFamily:"'Cinzel',serif",fontSize:".6rem",color:interrogated.includes(s.id)?THEME.gold:"rgba(201,168,76,.35)",letterSpacing:".1em" }}>{s.name}</p>
              <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.goldDim,fontSize:".68rem" }}>{s.role}</p>
              {interrogated.includes(s.id)&&<p style={{ fontFamily:"'Cinzel',serif",color:"rgba(201,168,76,.35)",fontSize:".5rem",letterSpacing:".3em" }}>INTERVIEWED</p>}
            </div>
          ))}
        </div>

        {/* Special */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
          {[
            { icon:"◈", name:"Ancient Runes", sub:"Decode the trapdoor", type:"cipher", active:cipherSolved, color:cipherSolved?"rgba(64,160,96,.5)":"rgba(100,80,200,.2)", textColor:cipherSolved?"rgba(64,160,96,.8)":"rgba(140,130,220,.7)" },
            { icon:"⚖", name:"Accusation",    sub:"Name the thief",     type:"accuse", active:false,          color:"rgba(139,26,26,.25)",                                 textColor:"rgba(192,64,64,.7)" },
          ].map(c=>(
            <div key={c.type} onClick={()=>setView({type:c.type})} style={{
              background:"linear-gradient(145deg,#111020,#0e0c18)",
              border:`1px solid ${c.color}`,
              borderRadius:3, padding:"16px 10px", textAlign:"center", cursor:"pointer",
              transition:"all .4s cubic-bezier(.23,1,.32,1)",
              display:"flex",flexDirection:"column",alignItems:"center",gap:5,
            }}>
              <span style={{ fontSize:24,color:c.textColor,filter:`drop-shadow(0 0 6px ${c.color})` }}>{c.icon}</span>
              <p style={{ fontFamily:"'Cinzel',serif",fontSize:".68rem",color:c.textColor,letterSpacing:".15em" }}>{c.name}</p>
              <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.goldDim,fontSize:".72rem",fontStyle:"italic" }}>{c.sub}</p>
              {c.active&&<p style={{ fontFamily:"'Cinzel',serif",color:"rgba(64,160,96,.5)",fontSize:".52rem",letterSpacing:".3em" }}>SOLVED</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   INTRO
══════════════════════════════════════════════════════════ */
function Intro({ onStart }) {
  const [step,setStep] = useState(0);
  const {out,done}     = useTypewriter(PREMISE, 24, step===1);

  return (
    <div style={{ minHeight:"100vh",background:THEME.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px 20px 260px" }} className="fi">
      <style>{G}</style>
      <MagicParticles count={55}/><FogLayers/><AtmosphericLightning/><CinematicCastle/>

      {step===0 && (
        <div className="fiu" style={{ textAlign:"center",maxWidth:480,width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:18,position:"relative",zIndex:10 }}>
          <p style={{ fontFamily:"'Cinzel',serif",color:THEME.goldDim,fontSize:".6rem",letterSpacing:".6em" }}>A HOGWARTS MYSTERY</p>
          <RuneRing size={100}/>
          <h1 style={{ fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:"clamp(1.6rem,7vw,3rem)",color:THEME.gold,letterSpacing:".06em",lineHeight:1.15,textAlign:"center",textShadow:"0 0 60px rgba(201,168,76,.3)" }}>
            The Philosopher's<br/>Thief
          </h1>
          <GoldDivider style={{ maxWidth:240 }}/>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.silverDim,fontSize:".95rem",fontStyle:"italic",opacity:.75 }}>For the sharpest detective in the room</p>
          <p style={{ fontFamily:"'Cinzel',serif",color:"rgba(201,168,76,.3)",fontSize:".62rem",letterSpacing:".35em" }}>📍 Hogwarts · 11:47 PM</p>
          <CineBtn onClick={()=>setStep(1)} style={{ animation:"lockPulse 2.5s infinite",marginTop:8 }}>Begin Investigation</CineBtn>
        </div>
      )}

      {step===1 && (
        <div className="fi" style={{ width:"100%",maxWidth:480,position:"relative",zIndex:10 }}>
          <ParchmentCard glowing>
            <div style={{ textAlign:"center",marginBottom:18 }}>
              <p style={{ fontFamily:"'Cinzel',serif",color:THEME.goldDim,fontSize:".6rem",letterSpacing:".5em",marginBottom:12 }}>CASE BRIEFING</p>
              <GoldDivider/>
            </div>
            <pre style={{ fontFamily:"'IM Fell English',serif",fontSize:"1rem",color:THEME.parchDark,lineHeight:2,whiteSpace:"pre-wrap",minHeight:80 }}>
              {out}<span style={{ color:THEME.gold,animation:"goldPulse .8s infinite" }}>{!done?"▌":""}</span>
            </pre>
            {done && (
              <div className="fiu" style={{ display:"flex",flexDirection:"column",gap:18,alignItems:"center" }}>
                <GoldDivider/>
                <div style={{ width:"100%",background:"rgba(0,0,0,.2)",border:"1px solid rgba(201,168,76,.1)",borderRadius:2,padding:"18px 20px" }}>
                  <p style={{ fontFamily:"'Cinzel',serif",color:THEME.goldDim,fontSize:".6rem",letterSpacing:".45em",marginBottom:12,textAlign:"center" }}>INVESTIGATION GUIDE</p>
                  {[["🏰","Explore 5 locations","Uncover hidden evidence"],["🎭","Question 5 suspects","Read between the lines"],["◈","Decode ancient runes","Break the trapdoor cipher"],["⚖","Make your accusation","One chance — use it wisely"]].map(([icon,t,d],i)=>(
                    <div key={i} style={{ display:"flex",gap:12,alignItems:"flex-start",padding:"8px 0",borderBottom:"1px solid rgba(201,168,76,.06)" }}>
                      <span style={{ fontSize:16,flexShrink:0,marginTop:2 }}>{icon}</span>
                      <div>
                        <p style={{ fontFamily:"'Cinzel',serif",color:THEME.gold,fontSize:".7rem",letterSpacing:".2em",marginBottom:3 }}>{t}</p>
                        <p style={{ fontFamily:"'Cormorant Garamond',serif",color:THEME.silverDim,fontSize:".88rem",fontStyle:"italic" }}>{d}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <CineBtn onClick={onStart} style={{ animation:"lockPulse 2.5s infinite" }}>Enter Hogwarts</CineBtn>
              </div>
            )}
          </ParchmentCard>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════ */
export default function HogwartsMystery() {
  const [phase,setPhase]     = useState("intro");
  const [view,setViewState]  = useState(null);
  const [clues,setClues]     = useState(ROOMS.flatMap(r=>r.clues.map(c=>({...c,found:false}))));
  const [interrogated,setInt]= useState([]);
  const [cipher,setCipher]   = useState(false);

  const setView = v => { setViewState(v); setPhase(v?v.type:"hub"); };
  const findClue = id => setClues(p=>p.map(c=>c.id===id?{...c,found:true}:c));
  const completeInt = id => setInt(p=>p.includes(id)?p:[...p,id]);

  if(phase==="intro")   return <Intro onStart={()=>setPhase("hub")}/>;
  if(phase==="victory") return <Victory/>;

  const room    = view?.type==="room"          ? ROOMS.find(r=>r.id===view.id)    : null;
  const suspect = view?.type==="interrogation" ? SUSPECTS.find(s=>s.id===view.id) : null;

  if(phase==="room"&&room)             return <RoomExplorer room={room} allClues={clues} onFindClue={findClue} onBack={()=>setView(null)}/>;
  if(phase==="interrogation"&&suspect) return <Interrogation suspect={suspect} onBack={()=>setView(null)} onComplete={completeInt}/>;
  if(phase==="cipher")                 return <RunesCipher onSolve={()=>setCipher(true)} solved={cipher} onBack={()=>setView(null)}/>;
  if(phase==="accuse")                 return <Accusation clues={clues} interrogated={interrogated} cipherSolved={cipher} onAccuse={c=>{if(c)setPhase("victory");}} onBack={()=>setView(null)}/>;

  return <InvestigationHub clues={clues} interrogated={interrogated} cipherSolved={cipher} setView={setView}/>;
}
