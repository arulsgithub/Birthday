import { useState, useEffect } from "react";
import { G, CinematicBG, Castle, Particles, Card, Btn, Title, Divider, RuneRing, WandLight, Confetti, useTypewriter } from "./HPCore";

/* ══════════════════════════════════════════════════
   GAME DATA
══════════════════════════════════════════════════ */
const PREMISE=`The Philosopher's Stone has vanished from the third-floor corridor.\nDumbledore's enchantments were bypassed — perfectly.\nFive suspects remain within the castle walls.\nA storm gathers over the Forbidden Forest.\n\nYou are Detective Amritha.\nYou have until midnight.`;

const ROOMS=[
  {id:"potions",  name:"Potions Dungeon",      icon:"🧪",desc:"Stone walls, cold vapour, shelves of motionless ingredients. A cauldron still radiates warmth.",clues:[
    {id:"c1",text:"A smashed Boomslang skin vial — residue matches Polyjuice Potion. Someone was here in disguise.",found:false,key:true},
    {id:"c2",text:"Overturned stool near Snape's private cabinet. The lock shows no force — someone had a key.",found:false,key:false},
    {id:"c3",text:"Monogrammed handkerchief: Q.Q. Found behind a warm cauldron. The ink is violet.",found:false,key:true},
  ]},
  {id:"corridor", name:"Third-Floor Corridor", icon:"🚪",desc:"The door stands open. Fluffy is asleep. A melody still lingers — refined, almost professorial.",clues:[
    {id:"c4",text:"A small wooden flute beside Fluffy. Too refined for Hagrid — almost professorial in craftsmanship.",found:false,key:true},
    {id:"c5",text:"The trapdoor: no forced entry. The enchantments were lifted with precise, advanced spellwork.",found:false,key:true},
    {id:"c6",text:"A single black feather — no known Hogwarts bird. A peacock, perhaps? None are kept here officially.",found:false,key:false},
  ]},
  {id:"library",  name:"Restricted Section",   icon:"📖",desc:"A page has been torn from its spine. The remaining books have fallen strangely, completely silent.",clues:[
    {id:"c7",text:"A torn page from 'Secrets of the Darkest Art' — specifically on stone transmutation.",found:false,key:true},
    {id:"c8",text:"The sign-out log: final entry smudged. The ink — violet — matches the handkerchief.",found:false,key:true},
    {id:"c9",text:"A Bertie Bott's bean — earwax flavour. Dumbledore's documented preference. He was here.",found:false,key:false},
  ]},
  {id:"mirror",   name:"Mirror of Erised",     icon:"🪞",desc:"The Mirror glows with unusual intensity. Someone stood before it recently — dust patterns confirm it.",clues:[
    {id:"c10",text:"An unsigned note at the Mirror's base: 'I see myself holding it. I always have.'",found:false,key:true},
    {id:"c11",text:"Trace droplets of Felix Felicis — Liquid Luck. This theft was planned meticulously.",found:false,key:true},
    {id:"c12",text:"The Mirror shows a face tonight instead of desire — calculating, wearing a turban.",found:false,key:false},
  ]},
  {id:"owlery",   name:"The Owlery",           icon:"🦉",desc:"One owl is absent. A letter was sent tonight to an unknown recipient. Ash of burned parchment.",clues:[
    {id:"c13",text:"Burned parchment — one phrase survived: '...the stone is hidden where only the worthy may claim it.'",found:false,key:true},
    {id:"c14",text:"An unsent letter: 'Q.Q. to R.Q.' — 'Meet me at the stone. Tonight is the night.'",found:false,key:true},
    {id:"c15",text:"An impression in the straw — someone waited here for hours. Small boots, meticulous heel placement.",found:false,key:true},
  ]},
];

const SUSPECTS=[
  {id:"quirrell",name:"Professor Quirrell",role:"Defence Against Dark Arts",icon:"🎓",guilty:true,
   motive:"Possessed by Voldemort — seeking the Stone to restore his master",
   alibi:"Claims he was in his office preparing lesson plans throughout the evening",
   tells:["Initials Q.Q. match the handkerchief found in the Potions dungeon","His refined flute matches the instrument found beside Fluffy","His violet ink appears in the Restricted Section sign-out log","Letter 'Q.Q. to R.Q.' — Quirinus Quirrell to Voldemort","Felix Felicis traces match his known apothecary purchases","He knew Fluffy's weakness — Dumbledore told him personally on arrival"],
   questions:[
     {q:"Where were you between ten and midnight?",options:[
       {t:"In my office, p-p-preparing lessons.",r:"His stutter worsens on 'preparing'. Violet ink on his fingers. His hand moves to his turban.",s:true},
       {t:"I walked the grounds. Night air settles the nerves.",r:"Walking the grounds on the night the Stone vanishes. You note this carefully.",s:true},
     ]},
     {q:"Do you know how one might bypass Fluffy?",options:[
       {t:"A three-headed dog? I have never been near it.",r:"His hand rises to his turban. Beneath it — something shifts. Something old.",s:true},
       {t:"Dumbledore may have mentioned something about music.",r:"He volunteers this unprompted. Why would an innocent man know this?",s:true},
     ]},
     {q:"What do you know of the Philosopher's Stone?",options:[
       {t:"Only what the history books record.",r:"Two shadows behind his eyes. One is his. The other is ancient. Hungry.",s:true},
       {t:"A dangerous object. Better it were never found.",r:"The turban shifts. For just a moment — a whisper that is not his voice.",s:true},
     ]},
   ]},
  {id:"snape",name:"Professor Snape",role:"Potions Master",icon:"🖤",guilty:false,
   motive:"Known antipathy — though toward what, precisely, remains unclear",
   alibi:"Was observed counter-cursing during the Quidditch match. Multiple eyewitnesses.",
   tells:["Snape was protecting the Stone — counter-cursing Quirrell all evening","His alibi is absolute — students and staff both witnessed his actions","He suspected Quirrell before anyone. He is innocent."],
   questions:[
     {q:"Why were you muttering during the Quidditch match?",options:[
       {t:"Preparing notes. It does not concern you.",r:"Arrogant — but his alibi covers the entire theft window. He was in the stands.",s:false},
       {t:"Counter-jinxes. Someone was cursing Potter's broom.",r:"He states this as flat fact. Cross-referencing confirms it: he was protecting, not stealing.",s:false},
     ]},
     {q:"Were you at the third-floor corridor last night?",options:[
       {t:"I was bitten there investigating suspicious activity.",r:"He shows you the wound. Genuine. He suspected Quirrell before you did.",s:false},
       {t:"My reasons are my own.",r:"A deflection born of pride. Not guilt.",s:false},
     ]},
   ]},
  {id:"mcgonagall",name:"Prof. McGonagall",role:"Head of Gryffindor",icon:"🐱",guilty:false,
   motive:"Her loyalty to students — but loyalty is not guilt",
   alibi:"Playing chess with Nearly Headless Nick. Corroborated by three portraits.",
   tells:["Chess alibi confirmed by Nearly Headless Nick and three portraits","Her Animagus form leaves cat prints — none at the scene","She suspected Snape. Snape is innocent. So is she."],
   questions:[
     {q:"Were you near the third-floor corridor?",options:[
       {t:"Certainly not. I was occupied elsewhere.",r:"She holds your gaze without flinching. No evasion. No guilt.",s:false},
       {t:"I patrol the corridors as is my duty.",r:"Her route on Tuesdays doesn't pass the third floor. Confirmed.",s:false},
     ]},
     {q:"Do you have suspicions about who is responsible?",options:[
       {t:"I have a theory involving a certain greasy-haired colleague.",r:"She suspects Snape — who is entirely innocent. A sincere misdirection.",s:false},
       {t:"I trust Dumbledore's enchantments. This alarms me greatly.",r:"Genuine distress. Worry, not guilt.",s:false},
     ]},
   ]},
  {id:"hagrid",name:"Rubeus Hagrid",role:"Gamekeeper",icon:"🌲",guilty:false,
   motive:"Accidentally disclosed Fluffy's weakness to a stranger — unknowingly",
   alibi:"In his hut all evening. Norbert the dragon confirms his presence.",
   tells:["Told a turban-wearing stranger how to get past Fluffy — Quirrell in disguise","Genuinely devastated when he realises. A victim of manipulation, not a perpetrator","The description of the stranger matches Quirrell precisely"],
   questions:[
     {q:"Did you share information about Fluffy with anyone?",options:[
       {t:"There was a fella at the Hog's Head... very interested in magical creatures...",r:"Horror crosses his face as he understands. This guilt is not the theft kind.",s:true},
       {t:"I would never betray Fluffy. Never.",r:"He says this passionately. Then goes very pale.",s:false},
     ]},
     {q:"Can you describe this stranger?",options:[
       {t:"Had a turban. Quiet sort. Bought me a drink.",r:"A turban. Your pulse quickens. Only one professor at Hogwarts wears one.",s:true},
       {t:"Didn't see much. He kept to the shadow.",r:"Hagrid is not the villain here. A victim.",s:false},
     ]},
   ]},
  {id:"peeves",name:"Peeves",role:"Poltergeist",icon:"👻",guilty:false,
   motive:"Pure entropy — but even Peeves has physical limitations",
   alibi:"Documented dropping water balloons on Filch, fifth floor. In Filch's complaint log.",
   tells:["Alibi in Filch's official log: fifth floor, 11:45 PM","Peeves cannot hold objects with sufficient precision for this theft","This crime required silence — Peeves is constitutionally incapable"],
   questions:[
     {q:"Were you near the third floor last night?",options:[
       {t:"Oooooh the corridor! Peeves knows about the doggy!",r:"Insufferably cheerful. But his alibi — water balloons at 11:45 — is documented and precise.",s:false},
       {t:"Peeves was occupied! Very important business!",r:"Filch's log places him firmly on the fifth floor. Rock solid.",s:false},
     ]},
     {q:"Did you observe anyone near the corridor?",options:[
       {t:"The turban-man! Peeves saw him! Going somewhere forbidden!",r:"Peeves spotted Quirrell. Crucial testimony from the least credible witness in the castle.",s:true},
       {t:"Peeves sees everything. That's the point of being Peeves.",r:"He dissolves into cackling. But beneath the chaos — a genuine witness.",s:false},
     ]},
   ]},
];

const CIPHER={
  prompt:"Scratched into the base of the trapdoor — Dumbledore's final message:",
  encoded:"DHLLHO DHZ AOL AOPLS",
  answer:"QUIRRELL WAS THE THIEF",
  shift:7,
  hint:"Caesar cipher. Shift each letter back by 7. D→Q, H→U, L→I, O→H...",
};

/* ══════════════════════════════════════════════════
   CASE NOTES
══════════════════════════════════════════════════ */
function CaseNotes({ clues, onClose }) {
  const found=clues.filter(c=>c.found);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(3,8,15,.95)",backdropFilter:"blur(16px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,zIndex:800}} className="fi">
      <style>{G}</style>
      <div style={{width:"100%",maxWidth:520,maxHeight:"88vh",background:"linear-gradient(145deg,rgba(10,16,28,.96),rgba(7,12,20,.98))",borderRadius:4,display:"flex",flexDirection:"column",border:"1px solid rgba(180,140,60,.18)",boxShadow:"0 40px 80px rgba(0,0,0,.8)"}}>
        <div style={{background:"rgba(0,0,0,.45)",padding:"16px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(180,140,60,.1)"}}>
          <div>
            <p style={{fontFamily:"'Cinzel',serif",color:"rgba(200,165,80,.85)",fontSize:".72rem",letterSpacing:".35em"}}>CASE NOTES</p>
            <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,140,60,.4)",fontSize:".76rem",fontStyle:"italic"}}>Evidence collected</p>
          </div>
          <button style={{background:"none",border:"none",color:"rgba(180,140,60,.4)",cursor:"pointer",fontSize:"1rem",opacity:.6}} onClick={onClose}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"20px 22px",display:"flex",flexDirection:"column",gap:10}}>
          {found.length===0 && <p style={{color:"rgba(180,190,215,.3)",fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",textAlign:"center",marginTop:24}}>No evidence yet. Begin your investigation.</p>}
          {found.map(c=>(
            <div key={c.id} style={{display:"flex",gap:12,padding:"12px 16px",background:"rgba(180,140,60,.03)",borderLeft:`2px solid rgba(180,140,60,${c.key?.4:.12})`,borderRadius:"0 2px 2px 0"}}>
              <span style={{color:`rgba(180,140,60,${c.key?.55:.2})`,flexShrink:0,marginTop:2,fontSize:".75rem"}}>✦</span>
              <div>
                <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(210,195,160,.78)",fontSize:".96rem",lineHeight:1.75}}>{c.text}</p>
                {c.key&&<p style={{color:"rgba(180,140,60,.4)",fontFamily:"'Cinzel',serif",fontSize:".56rem",letterSpacing:".32em",marginTop:4}}>KEY EVIDENCE</p>}
              </div>
            </div>
          ))}
        </div>
        <div style={{padding:"12px 22px",borderTop:"1px solid rgba(180,140,60,.08)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.38)",fontSize:".6rem",letterSpacing:".32em"}}>{found.length} / {clues.length}</span>
            <div style={{width:"55%",height:1,background:"rgba(180,140,60,.1)",borderRadius:1}}>
              <div style={{width:`${(found.length/clues.length)*100}%`,height:"100%",background:"rgba(180,140,60,.45)",borderRadius:1,transition:"width .6s ease"}}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   ROOM EXPLORER
══════════════════════════════════════════════════ */
function RoomExplorer({ room, allClues, onFindClue, onBack }) {
  const [ex,setEx]=useState(null);
  const rc=allClues.filter(c=>room.clues.some(r=>r.id===c.id));
  return (
    <div style={{minHeight:"100vh",background:"#03080f",paddingBottom:60}} className="fi">
      <style>{G}</style>
      <CinematicBG variant="night"/>
      <Particles count={30}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",background:"rgba(3,8,15,.88)",borderBottom:"1px solid rgba(180,140,60,.1)",backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:50}}>
        <Btn onClick={onBack} variant="ghost" style={{padding:"9px 16px",fontSize:".7rem"}}>← Back</Btn>
        <div style={{textAlign:"center"}}>
          <p style={{fontFamily:"'Cinzel',serif",color:"rgba(200,165,80,.85)",fontSize:"clamp(.78rem,3.5vw,.98rem)",letterSpacing:".18em"}}>{room.icon} {room.name}</p>
          <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,140,60,.38)",fontSize:".7rem",fontStyle:"italic"}}>Investigation in progress</p>
        </div>
        <div style={{width:76}}/>
      </div>
      <div style={{width:"100%",maxWidth:520,margin:"0 auto",padding:"28px 20px",display:"flex",flexDirection:"column",gap:22,position:"relative",zIndex:10}}>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",color:"rgba(180,190,215,.5)",lineHeight:1.9,fontStyle:"italic",textAlign:"center"}}>{room.desc}</p>
        <Divider/>
        <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.4)",fontSize:".58rem",letterSpacing:".5em",textAlign:"center"}}>EXAMINE THE ROOM</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:9}}>
          {rc.map((clue,i)=>(
            <div key={clue.id} onClick={()=>{ if(!clue.found)onFindClue(clue.id); setEx(clue); }} style={{
              background:clue.found?"linear-gradient(145deg,rgba(16,22,34,.95),rgba(12,18,28,.98))":"linear-gradient(145deg,rgba(8,13,22,.92),rgba(7,11,19,.96))",
              border:`1px solid rgba(180,140,60,${clue.found?.32:.08})`,
              borderRadius:3,padding:"16px 10px",textAlign:"center",cursor:"pointer",
              transition:"all .4s cubic-bezier(.23,1,.32,1)",
              display:"flex",flexDirection:"column",gap:7,alignItems:"center",
              boxShadow:clue.found?"0 0 18px rgba(180,140,60,.06)":"none",
            }}>
              <span style={{fontSize:18,opacity:clue.found?.85:.35,filter:clue.found?"drop-shadow(0 0 6px rgba(180,140,60,.35))":"none",transition:"all .3s"}}>
                {clue.found?"✦":"○"}
              </span>
              <span style={{fontFamily:"'Cinzel',serif",fontSize:".55rem",color:`rgba(180,140,60,${clue.found?.42:.22})`,letterSpacing:".32em",textTransform:"uppercase"}}>
                {clue.found?"Examined":`Area ${i+1}`}
              </span>
              {clue.key&&clue.found&&<span style={{fontFamily:"'Cinzel',serif",fontSize:".52rem",color:"rgba(180,140,60,.38)",letterSpacing:".28em",borderTop:"1px solid rgba(180,140,60,.18)",paddingTop:5,width:"100%",textAlign:"center"}}>KEY</span>}
            </div>
          ))}
        </div>
      </div>
      {ex && (
        <div style={{position:"fixed",inset:0,background:"rgba(3,8,15,.9)",backdropFilter:"blur(14px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,zIndex:700}} className="fi">
          <Card style={{maxWidth:440,width:"100%",border:`1px solid rgba(180,140,60,${ex.key?.38:.15})`,animation:"breathe 4s ease-in-out infinite"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:14,alignItems:"flex-start"}}>
              <p style={{fontFamily:"'Cinzel',serif",color:`rgba(180,140,60,${ex.key?.55:.3})`,fontSize:".58rem",letterSpacing:".42em"}}>{ex.key?"KEY EVIDENCE":"OBSERVATION"}</p>
              <button style={{background:"none",border:"none",color:"rgba(180,140,60,.35)",cursor:"pointer",opacity:.6}} onClick={()=>setEx(null)}>✕</button>
            </div>
            <Divider style={{marginBottom:16}}/>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",color:"rgba(210,195,160,.82)",lineHeight:1.95}}>{ex.text}</p>
            {ex.key&&<p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.38)",fontSize:".58rem",letterSpacing:".4em",textAlign:"center",marginTop:14,fontStyle:"italic"}}>This changes things.</p>}
          </Card>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   INTERROGATION
══════════════════════════════════════════════════ */
function Interrogation({ suspect, onBack, onComplete }) {
  const [qi,setQi]=useState(0);
  const [log,setLog]=useState([]);
  const [sus,setSus]=useState(0);
  const [tells,setTells]=useState(false);
  const done=qi>=suspect.questions.length;
  const susC=sus===0?"rgba(70,170,100,.75)":sus===1?"rgba(190,160,60,.8)":"rgba(190,60,60,.8)";

  const answer=opt=>{
    setLog(p=>[...p,{q:suspect.questions[qi].q,a:opt.t,r:opt.r,s:opt.s}]);
    if(opt.s)setSus(s=>s+1);
    if(qi<suspect.questions.length-1)setQi(q=>q+1);
    else{setQi(suspect.questions.length);onComplete(suspect.id);}
  };

  return (
    <div style={{minHeight:"100vh",background:"#03080f",paddingBottom:40}} className="fi">
      <style>{G}</style>
      <CinematicBG variant="night"/>
      <Particles count={25}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",background:"rgba(3,8,15,.88)",borderBottom:"1px solid rgba(180,140,60,.1)",backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:50}}>
        <Btn onClick={onBack} variant="ghost" style={{padding:"9px 16px",fontSize:".7rem"}}>← Back</Btn>
        <p style={{fontFamily:"'Cinzel',serif",color:"rgba(200,165,80,.8)",fontSize:".82rem",letterSpacing:".3em"}}>INTERROGATION</p>
        <div style={{width:76}}/>
      </div>
      <div style={{width:"100%",maxWidth:520,margin:"0 auto",padding:"24px 20px",display:"flex",flexDirection:"column",gap:18,position:"relative",zIndex:10}}>
        <Card>
          <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
            <div style={{flexShrink:0,textAlign:"center"}}>
              <div style={{fontSize:42,filter:"drop-shadow(0 0 10px rgba(180,140,60,.2))"}}>{suspect.icon}</div>
              <p style={{fontFamily:"'Cinzel',serif",color:"rgba(200,165,80,.85)",fontSize:".8rem",letterSpacing:".12em",marginTop:6}}>{suspect.name}</p>
              <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,140,60,.4)",fontSize:".75rem",fontStyle:"italic"}}>{suspect.role}</p>
            </div>
            <div style={{flex:1}}>
              <div style={{marginBottom:10}}>
                <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.38)",fontSize:".55rem",letterSpacing:".38em",marginBottom:5}}>SUSPICION LEVEL</p>
                <div style={{height:2,background:"rgba(255,255,255,.06)",borderRadius:1}}>
                  <div style={{width:`${(sus/suspect.questions.length)*100}%`,height:"100%",background:susC,borderRadius:1,transition:"width .6s ease"}}/>
                </div>
              </div>
              <Divider style={{marginBottom:10}}/>
              <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,190,215,.5)",fontSize:".88rem",lineHeight:1.65,marginBottom:6}}><span style={{color:"rgba(180,140,60,.4)",fontFamily:"'Cinzel',serif",fontSize:".55rem",letterSpacing:".32em"}}>MOTIVE — </span>{suspect.motive}</p>
              <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,190,215,.5)",fontSize:".88rem",lineHeight:1.65,opacity:.8}}><span style={{color:"rgba(180,140,60,.38)",fontFamily:"'Cinzel',serif",fontSize:".55rem",letterSpacing:".32em"}}>ALIBI — </span>{suspect.alibi}</p>
            </div>
          </div>
        </Card>
        {!done && (
          <div className="fiu">
            <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.38)",fontSize:".58rem",letterSpacing:".45em",marginBottom:12}}>DETECTIVE AMRITHA</p>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.05rem",color:"rgba(210,195,160,.82)",lineHeight:1.9,fontStyle:"italic",marginBottom:18}}>"{suspect.questions[qi]?.q}"</p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {suspect.questions[qi]?.options.map((opt,i)=>(
                <button key={i} onClick={()=>answer(opt)} style={{background:"rgba(180,140,60,.03)",border:"1px solid rgba(180,140,60,.1)",color:"rgba(210,195,160,.78)",padding:"14px 18px",cursor:"pointer",fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",textAlign:"left",borderRadius:2,transition:"all .3s cubic-bezier(.23,1,.32,1)",lineHeight:1.6}}>
                  <span style={{color:"rgba(180,140,60,.35)",marginRight:10}}>›</span><em>"{opt.t}"</em>
                </button>
              ))}
            </div>
          </div>
        )}
        {log.map((e,i)=>(
          <div key={i} style={{borderLeft:"1px solid rgba(180,140,60,.1)",paddingLeft:16}}>
            <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.38)",fontSize:".56rem",letterSpacing:".32em",marginBottom:5}}>{e.q}</p>
            <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,190,215,.45)",fontSize:".9rem",fontStyle:"italic",marginBottom:5}}>"{e.a}"</p>
            <p style={{fontFamily:"'Cormorant Garamond',serif",color:e.s?"rgba(190,90,70,.75)":"rgba(70,155,90,.7)",fontSize:".86rem",letterSpacing:".04em"}}>{e.r}</p>
          </div>
        ))}
        {done && (
          <div className="fiu" style={{textAlign:"center"}}>
            <Divider style={{marginBottom:16}}/>
            <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.38)",fontSize:".6rem",letterSpacing:".45em",marginBottom:16}}>INTERROGATION CONCLUDED</p>
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
              <Btn onClick={()=>setTells(!tells)}>{tells?"Conceal Analysis":"View Analysis"}</Btn>
              <Btn onClick={onBack} variant="ghost">Return</Btn>
            </div>
            {tells && (
              <div className="fiu" style={{marginTop:18,textAlign:"left"}}>
                <Divider style={{marginBottom:14}}/>
                {suspect.tells.map((t,i)=>(
                  <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid rgba(180,140,60,.06)"}}>
                    <span style={{color:"rgba(180,140,60,.35)",flexShrink:0,fontSize:".75rem"}}>✦</span>
                    <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,190,215,.5)",fontSize:".92rem",lineHeight:1.65}}>{t}</p>
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

/* ══════════════════════════════════════════════════
   CIPHER
══════════════════════════════════════════════════ */
function CipherScreen({ onSolve, solved, onBack }) {
  const [input,setInput]=useState("");
  const [wrong,setWrong]=useState(false);
  const [hint,setHint]=useState(false);
  const check=()=>{
    if(input.trim().toUpperCase()===CIPHER.answer) onSolve();
    else{setWrong(true);setTimeout(()=>setWrong(false),700);setInput("");}
  };
  return (
    <div style={{minHeight:"100vh",background:"#03080f",display:"flex",flexDirection:"column"}} className="fi">
      <style>{G}</style>
      <CinematicBG variant="storm"/>
      <Particles count={30} color="#8090c0"/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",background:"rgba(3,8,15,.88)",borderBottom:"1px solid rgba(100,90,180,.12)",backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:50}}>
        <Btn onClick={onBack} variant="ghost" style={{padding:"9px 16px",fontSize:".7rem"}}>← Back</Btn>
        <p style={{fontFamily:"'Cinzel',serif",color:"rgba(140,130,210,.75)",fontSize:".82rem",letterSpacing:".35em"}}>ANCIENT RUNES</p>
        <div style={{width:76}}/>
      </div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px 20px 60px",position:"relative",zIndex:10}}>
        <div style={{width:"100%",maxWidth:500,display:"flex",flexDirection:"column",alignItems:"center",gap:22}}>
          <div style={{animation:"runeRotate 25s linear infinite",opacity:.8}}><RuneRing size={88}/></div>
          <Title eyebrow="TRAPDOOR INSCRIPTION" size="clamp(1.2rem,4.5vw,1.8rem)">The Cipher</Title>
          <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,190,215,.45)",fontSize:".96rem",fontStyle:"italic",textAlign:"center",opacity:.8}}>{CIPHER.prompt}</p>
          <div style={{width:"100%",background:"rgba(60,50,120,.07)",border:"1px solid rgba(100,80,200,.18)",borderRadius:3,padding:"20px 22px",textAlign:"center",animation:"borderPulse 4s ease-in-out infinite"}}>
            <p style={{fontFamily:"'Cinzel',serif",fontSize:"clamp(.88rem,3.5vw,1.18rem)",color:"rgba(150,140,230,.82)",letterSpacing:".42em",wordSpacing:"1em",lineHeight:1.9}}>{CIPHER.encoded}</p>
          </div>
          <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,190,215,.45)",fontSize:".96rem",lineHeight:1.85,fontStyle:"italic",textAlign:"center"}}>
            Shift each letter back by 7 positions in the alphabet.<br/>A→T · B→U · ... · H→A · G→Z
          </p>
          <Card style={{border:"1px solid rgba(100,80,200,.14)"}}>
            <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.38)",fontSize:".58rem",letterSpacing:".42em",marginBottom:12,textAlign:"center"}}>SHIFT BACK BY 7</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:3,justifyContent:"center"}}>
              {Array.from({length:26},(_,i)=>{
                const e=String.fromCharCode(65+i);
                const d=String.fromCharCode(((i-7+26)%26)+65);
                return(
                  <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",minWidth:21}}>
                    <span style={{color:"rgba(140,130,210,.65)",fontFamily:"monospace",fontSize:".55rem"}}>{e}</span>
                    <span style={{color:"rgba(100,100,160,.35)",fontSize:".42rem"}}>↓</span>
                    <span style={{color:"rgba(200,165,80,.8)",fontFamily:"monospace",fontSize:".55rem"}}>{d}</span>
                  </div>
                );
              })}
            </div>
          </Card>
          {!solved?(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,width:"100%"}}>
              <input
                style={{width:"100%",maxWidth:440,background:"rgba(0,0,0,.55)",border:`1px solid ${wrong?"rgba(160,40,40,.65)":"rgba(100,80,200,.28)"}`,color:"rgba(150,140,230,.88)",padding:"13px 18px",fontFamily:"'Cinzel',serif",fontSize:".84rem",letterSpacing:".28em",outline:"none",borderRadius:2,textAlign:"center",transition:"border-color .3s",animation:wrong?"shake .6s ease":"none"}}
                value={input} onChange={e=>setInput(e.target.value.toUpperCase())}
                onKeyDown={e=>e.key==="Enter"&&check()} placeholder="Enter decoded message"
              />
              <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
                <Btn onClick={check} variant="blue">Decode</Btn>
                <Btn onClick={()=>setHint(s=>!s)} variant="ghost" style={{padding:"15px 22px"}}>{hint?"Hide Hint":"Hint?"}</Btn>
              </div>
              {wrong&&<p style={{color:"rgba(192,60,60,.65)",fontFamily:"'Cinzel',serif",fontSize:".68rem",letterSpacing:".32em"}}>The runes do not yield.</p>}
              {hint&&<p style={{color:"rgba(180,190,215,.4)",fontFamily:"'Cormorant Garamond',serif",fontSize:".92rem",fontStyle:"italic",textAlign:"center",opacity:.8}}>{CIPHER.hint}</p>}
            </div>
          ):(
            <Card glow className="fiu" style={{border:"1px solid rgba(60,160,100,.32)",textAlign:"center"}}>
              <p style={{fontFamily:"'Cinzel',serif",color:"rgba(60,160,100,.75)",fontSize:".62rem",letterSpacing:".45em",marginBottom:14}}>DECODED</p>
              <Divider style={{marginBottom:16}}/>
              <p style={{fontFamily:"'Cinzel',serif",color:"rgba(200,165,80,.88)",fontSize:".94rem",letterSpacing:".2em",marginBottom:14}}>"{CIPHER.answer}"</p>
              <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,190,215,.5)",fontSize:".92rem",fontStyle:"italic",lineHeight:1.75}}>Dumbledore knew from the beginning.<br/>He was waiting for the right person to find it.<br/>He was waiting for you.</p>
              <Divider style={{margin:"18px 0"}}/>
              <Btn onClick={onBack} variant="blue">Return to Investigation</Btn>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   ACCUSATION
══════════════════════════════════════════════════ */
function Accusation({ clues, interrogated, cipherSolved, onAccuse, onBack }) {
  const [sel,setSel]=useState(null);
  const [res,setRes]=useState(null);
  const fk=clues.filter(c=>c.found&&c.key).length;
  const ready=fk>=5&&interrogated.length>=3&&cipherSolved;
  return (
    <div style={{minHeight:"100vh",background:"#03080f",paddingBottom:60}} className="fi">
      <style>{G}</style>
      <CinematicBG variant="dusk"/>
      <Particles count={25} color="#c06060"/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",background:"rgba(3,8,15,.88)",borderBottom:"1px solid rgba(160,40,40,.15)",backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:50}}>
        <Btn onClick={onBack} variant="ghost" style={{padding:"9px 16px",fontSize:".7rem"}}>← Back</Btn>
        <p style={{fontFamily:"'Cinzel',serif",color:"rgba(190,80,80,.75)",fontSize:".82rem",letterSpacing:".3em"}}>THE ACCUSATION</p>
        <div style={{width:76}}/>
      </div>
      <div style={{width:"100%",maxWidth:520,margin:"0 auto",padding:"28px 20px",display:"flex",flexDirection:"column",gap:20,position:"relative",zIndex:10}}>
        <Title eyebrow="FINAL JUDGEMENT" size="clamp(1.3rem,5vw,2rem)">Name the Thief</Title>
        <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,190,215,.45)",fontSize:".98rem",fontStyle:"italic",textAlign:"center",opacity:.8}}>Choose with precision. A wrong accusation gives Voldemort time.</p>
        {!ready && (
          <Card style={{border:"1px solid rgba(180,140,60,.1)",textAlign:"center"}}>
            <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.45)",fontSize:".66rem",letterSpacing:".32em",marginBottom:8}}>INSUFFICIENT EVIDENCE</p>
            <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,190,215,.4)",fontSize:".88rem",opacity:.8}}>Key evidence: {fk}/5 · Suspects: {interrogated.length}/3 · Cipher: {cipherSolved?"✓":"✗"}</p>
          </Card>
        )}
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {SUSPECTS.map(s=>(
            <div key={s.id} onClick={()=>{setSel(s.id);setRes(null);}} style={{
              background:sel===s.id?"linear-gradient(145deg,rgba(22,10,10,.96),rgba(18,8,8,.98))":"linear-gradient(145deg,rgba(8,13,22,.92),rgba(7,11,19,.96))",
              border:`1px solid rgba(${sel===s.id?"160,50,50":"180,140,60"},${sel===s.id?.4:.08})`,
              borderRadius:3,padding:"16px 18px",cursor:"pointer",transition:"all .4s cubic-bezier(.23,1,.32,1)",
            }}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <span style={{fontSize:24,filter:`drop-shadow(0 0 8px ${sel===s.id?"rgba(180,60,60,.4)":"rgba(180,140,60,.2)"})`}}>{s.icon}</span>
                <div style={{flex:1}}>
                  <p style={{fontFamily:"'Cinzel',serif",color:sel===s.id?"rgba(210,100,100,.88)":"rgba(200,165,80,.85)",fontSize:".84rem",letterSpacing:".1em"}}>{s.name}</p>
                  <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,140,60,.38)",fontSize:".8rem",fontStyle:"italic"}}>{s.role}</p>
                </div>
                {sel===s.id&&<span style={{fontFamily:"'Cinzel',serif",fontSize:".58rem",letterSpacing:".2em",color:"rgba(190,70,70,.7)"}}>ACCUSED</span>}
              </div>
            </div>
          ))}
        </div>
        {sel&&!res&&(
          <div className="fiu" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
            <Card style={{textAlign:"center",border:"1px solid rgba(160,50,50,.2)"}}>
              <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(210,190,160,.78)",fontSize:"1rem",lineHeight:1.85}}>
                "I hereby accuse <strong style={{color:"rgba(210,100,100,.88)"}}>{SUSPECTS.find(s=>s.id===sel)?.name}</strong> of stealing the Philosopher's Stone."
              </p>
            </Card>
            <Btn onClick={()=>{const c=sel==="quirrell";setRes(c?"ok":"no");if(c)setTimeout(()=>onAccuse(true),1400);}} variant="crimson" style={{padding:"15px 40px"}}>Make Accusation</Btn>
          </div>
        )}
        {res==="no"&&(
          <Card className="fiu" style={{border:"1px solid rgba(140,30,30,.28)",textAlign:"center"}}>
            <p style={{fontFamily:"'Cinzel',serif",color:"rgba(190,70,70,.75)",fontSize:".7rem",letterSpacing:".42em",marginBottom:10}}>INCORRECT</p>
            <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,190,215,.5)",fontSize:".96rem",fontStyle:"italic",marginBottom:16,opacity:.8}}>The evidence does not support this. Return to the investigation.</p>
            <Btn onClick={()=>{setSel(null);setRes(null);}} variant="ghost">Reconsider</Btn>
          </Card>
        )}
        {res==="ok"&&(
          <Card className="fiu" style={{border:"1px solid rgba(60,140,80,.28)",textAlign:"center"}}>
            <p style={{fontFamily:"'Cinzel',serif",color:"rgba(60,155,80,.75)",fontSize:".7rem",letterSpacing:".42em",marginBottom:10}}>CORRECT</p>
            <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,190,215,.55)",fontSize:"1rem",fontStyle:"italic",opacity:.85}}>The turban falls. The truth surfaces. The Stone is safe.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   VICTORY
══════════════════════════════════════════════════ */
function Victory() {
  return (
    <div style={{minHeight:"100vh",background:"#03080f",paddingBottom:80,display:"flex",justifyContent:"center"}} className="fi">
      <style>{G}</style>
      <Confetti/>
      <CinematicBG variant="dawn"/>
      <Particles count={65}/>
      <Castle/>
      <div style={{width:"100%",maxWidth:520,padding:"44px 20px",display:"flex",flexDirection:"column",alignItems:"center",gap:24,position:"relative",zIndex:10}}>
        <RuneRing size={100}/>
        <WandLight style={{marginTop:-8,marginBottom:-4}}/>
        <Title eyebrow="THE INVESTIGATION IS COMPLETE" size="clamp(1.8rem,7vw,3rem)">Case Solved</Title>
        <Divider/>
        <Card glow>
          <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.45)",fontSize:".6rem",letterSpacing:".45em",textAlign:"center",marginBottom:14}}>OFFICIAL VERDICT</p>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",color:"rgba(210,195,160,.82)",lineHeight:1.92,textAlign:"center",marginBottom:16}}>
            <strong style={{color:"rgba(200,90,90,.88)"}}>Professor Quirinus Quirrell</strong>, possessed by Lord Voldemort, is hereby found guilty of attempting to steal the Philosopher's Stone from Hogwarts.
          </p>
          <Divider style={{marginBottom:14}}/>
          <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.38)",fontSize:".58rem",letterSpacing:".38em",marginBottom:12}}>EVIDENCE</p>
          {["Handkerchief Q.Q. — Potions dungeon","Refined flute — used to subdue Fluffy","Violet ink — Restricted Section sign-out log","Letter Q.Q. to R.Q. — Quirrell to Voldemort","Felix Felicis traces — his apothecary purchases","Peeves spotted him near the corridor at 11:20 PM","Hagrid confirmed turban-wearing stranger at pub","Cipher decoded: QUIRRELL WAS THE THIEF","Mirror note: 'I see myself holding it. I always have.'"].map((e,i)=>(
            <div key={i} style={{display:"flex",gap:10,padding:"6px 0",borderBottom:"1px solid rgba(180,140,60,.05)"}}>
              <span style={{color:"rgba(180,140,60,.28)",flexShrink:0,fontSize:".72rem"}}>✦</span>
              <span style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,190,215,.5)",fontSize:".9rem"}}>{e}</span>
            </div>
          ))}
        </Card>
        <div style={{width:"100%",background:"linear-gradient(145deg,rgba(16,12,6,.92),rgba(12,9,4,.96))",border:"1px solid rgba(180,140,60,.18)",borderRadius:3,padding:"32px 24px",textAlign:"center"}}>
          <p style={{fontFamily:"'Cinzel',serif",color:"rgba(200,165,80,.85)",fontSize:"clamp(.9rem,3.5vw,1.15rem)",letterSpacing:".12em",marginBottom:20,animation:"breathe 3s ease-in-out infinite"}}>Happy Birthday, Amritha</p>
          <Divider style={{marginBottom:20}}/>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(.96rem,3vw,1.08rem)",color:"rgba(210,195,160,.8)",lineHeight:2.2}}>
            You cracked the cipher.<br/>You interrogated every suspect.<br/>You explored every shadowed corridor,<br/>and found the truth hidden in the runes.<br/><br/>
            <em style={{color:"rgba(200,165,80,.8)"}}>
              "You are the brightest witch of your age —<br/>
              not because of what you know,<br/>
              but because of how fiercely you love,<br/>
              how bravely you seek,<br/>and how brilliantly you shine.<br/><br/>
              May your twenty-second year hold<br/>
              magic even Dumbledore couldn't predict."
            </em>
          </p>
          <Divider style={{margin:"24px 0"}}/>
          <div style={{display:"flex",justifyContent:"center",gap:14,fontSize:"1.3rem",flexWrap:"wrap"}}>
            {["⚡","🦁","📖","🦉","🪄","✦","💕"].map((e,i)=>(
              <span key={i} style={{animation:`breathe ${1.8+i*.2}s ${i*.18}s ease-in-out infinite`,filter:"drop-shadow(0 0 8px rgba(180,140,60,.32))"}}>{e}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   INVESTIGATION HUB
══════════════════════════════════════════════════ */
function Hub({ clues, interrogated, cipherSolved, setView }) {
  const [notes,setNotes]=useState(false);
  const found=clues.filter(c=>c.found).length;
  const total=clues.length;
  const pct=Math.round((found/total)*100);
  return (
    <div style={{minHeight:"100vh",background:"#03080f",position:"relative",paddingBottom:270}}>
      <style>{G}</style>
      <CinematicBG variant="night"/>
      <Particles count={40}/>
      <Castle/>
      {notes&&<CaseNotes clues={clues} onClose={()=>setNotes(false)}/>}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 20px",background:"rgba(3,8,15,.88)",borderBottom:"1px solid rgba(180,140,60,.08)",backdropFilter:"blur(14px)",flexWrap:"wrap",gap:10,position:"sticky",top:0,zIndex:500}}>
        <div>
          <p style={{fontFamily:"'Cinzel',serif",color:"rgba(200,165,80,.8)",fontSize:".72rem",letterSpacing:".2em"}}>Detective Amritha</p>
          <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,140,60,.35)",fontSize:".68rem",fontStyle:"italic"}}>Hogwarts Investigation</p>
        </div>
        <div style={{display:"flex",gap:18,flexWrap:"wrap"}}>
          {[["CLUES",`${found}/${total}`,"rgba(200,165,80,.8)"],["SUSPECTS",`${interrogated.length}/${SUSPECTS.length}`,"rgba(200,165,80,.8)"],["CIPHER",cipherSolved?"✓":"✗",cipherSolved?"rgba(60,160,90,.8)":"rgba(190,60,60,.7)"]].map(([l,v,c])=>(
            <div key={l} style={{textAlign:"center"}}>
              <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.32)",fontSize:".5rem",letterSpacing:".42em"}}>{l}</p>
              <p style={{fontFamily:"'Cinzel',serif",color:c,fontSize:".88rem",letterSpacing:".15em"}}>{v}</p>
            </div>
          ))}
        </div>
        <Btn onClick={()=>setNotes(true)} variant="ghost" style={{padding:"8px 14px",fontSize:".66rem"}}>Notes</Btn>
      </div>
      <div style={{width:"100%",maxWidth:520,margin:"0 auto",padding:"28px 20px",position:"relative",zIndex:10}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.38)",fontSize:".58rem",letterSpacing:".55em",marginBottom:10}}>A HOGWARTS MYSTERY</p>
          <h1 style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:"clamp(1.3rem,5.5vw,2.2rem)",color:"rgba(200,165,80,.9)",letterSpacing:".05em",lineHeight:1.15,textShadow:"0 0 50px rgba(180,140,60,.25)",animation:"breathe 4s infinite"}}>The Philosopher's Thief</h1>
          <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,190,215,.35)",fontSize:".8rem",letterSpacing:".14em",fontStyle:"italic",marginTop:6}}>Hogwarts · 11:47 PM · A storm gathers</p>
          <div style={{width:"100%",maxWidth:300,height:1,background:"rgba(180,140,60,.1)",borderRadius:1,margin:"14px auto 5px"}}>
            <div style={{width:`${pct}%`,height:"100%",background:"rgba(180,140,60,.38)",borderRadius:1,transition:"width 1s ease"}}/>
          </div>
          <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.25)",fontSize:".52rem",letterSpacing:".42em"}}>{pct}% INVESTIGATED</p>
        </div>
        <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.38)",fontSize:".58rem",letterSpacing:".5em",marginBottom:10,textAlign:"center"}}>LOCATIONS</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8,marginBottom:20}}>
          {ROOMS.map(room=>{
            const rc=clues.filter(c=>room.clues.some(x=>x.id===c.id)&&c.found).length;
            const cleared=rc===room.clues.length;
            return(
              <div key={room.id} onClick={()=>setView({type:"room",id:room.id})} style={{
                background:cleared?"linear-gradient(145deg,rgba(16,22,34,.95),rgba(12,18,28,.98))":"linear-gradient(145deg,rgba(8,13,22,.92),rgba(7,11,19,.96))",
                border:`1px solid rgba(180,140,60,${cleared?.28:.06})`,
                borderRadius:3,padding:"13px 9px",textAlign:"center",cursor:"pointer",
                transition:"all .4s cubic-bezier(.23,1,.32,1)",
                display:"flex",flexDirection:"column",gap:5,alignItems:"center",
                boxShadow:cleared?"0 0 16px rgba(180,140,60,.05)":"none",
              }}>
                <span style={{fontSize:20,opacity:cleared?.85:.4,filter:cleared?"drop-shadow(0 0 5px rgba(180,140,60,.3))":"none",transition:"all .3s"}}>{room.icon}</span>
                <p style={{fontFamily:"'Cinzel',serif",fontSize:".6rem",color:`rgba(200,165,80,${cleared?.82:.35})`,letterSpacing:".1em"}}>{room.name}</p>
                <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,140,60,.35)",fontSize:".7rem"}}>{rc}/{room.clues.length}</p>
                {cleared&&<p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.32)",fontSize:".5rem",letterSpacing:".32em"}}>CLEARED</p>}
              </div>
            );
          })}
        </div>
        <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.38)",fontSize:".58rem",letterSpacing:".5em",marginBottom:10,textAlign:"center"}}>PERSONS OF INTEREST</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:8,marginBottom:20}}>
          {SUSPECTS.map(s=>(
            <div key={s.id} onClick={()=>setView({type:"int",id:s.id})} style={{
              background:interrogated.includes(s.id)?"linear-gradient(145deg,rgba(16,22,34,.95),rgba(12,18,28,.98))":"linear-gradient(145deg,rgba(8,13,22,.92),rgba(7,11,19,.96))",
              border:`1px solid rgba(180,140,60,${interrogated.includes(s.id)?.22:.06})`,
              borderRadius:3,padding:"11px 7px",textAlign:"center",cursor:"pointer",
              transition:"all .4s cubic-bezier(.23,1,.32,1)",
              display:"flex",flexDirection:"column",alignItems:"center",gap:4,
            }}>
              <span style={{fontSize:20,opacity:interrogated.includes(s.id)?.85:.38,transition:"all .3s"}}>{s.icon}</span>
              <p style={{fontFamily:"'Cinzel',serif",fontSize:".58rem",color:`rgba(200,165,80,${interrogated.includes(s.id)?.78:.3})`,letterSpacing:".08em"}}>{s.name}</p>
              <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,140,60,.32)",fontSize:".68rem"}}>{s.role}</p>
              {interrogated.includes(s.id)&&<p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.28)",fontSize:".5rem",letterSpacing:".3em"}}>INTERVIEWED</p>}
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {[
            {icon:"◈",name:"Ancient Runes",sub:"Decode the trapdoor",type:"cipher",done:cipherSolved,c:cipherSolved?"rgba(60,160,100,.4)":"rgba(100,80,200,.18)",tc:cipherSolved?"rgba(60,160,100,.75)":"rgba(140,130,210,.65)"},
            {icon:"⚖",name:"Accusation",   sub:"Name the thief",    type:"accuse",done:false,          c:"rgba(160,40,40,.2)",                                  tc:"rgba(190,80,80,.65)"},
          ].map(c=>(
            <div key={c.type} onClick={()=>setView({type:c.type})} style={{
              background:"linear-gradient(145deg,rgba(8,13,22,.92),rgba(7,11,19,.96))",
              border:`1px solid ${c.c}`,borderRadius:3,padding:"15px 9px",textAlign:"center",cursor:"pointer",
              transition:"all .4s cubic-bezier(.23,1,.32,1)",display:"flex",flexDirection:"column",alignItems:"center",gap:5,
            }}>
              <span style={{fontSize:22,color:c.tc,filter:`drop-shadow(0 0 5px ${c.c})`}}>{c.icon}</span>
              <p style={{fontFamily:"'Cinzel',serif",fontSize:".66rem",color:c.tc,letterSpacing:".15em"}}>{c.name}</p>
              <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,140,60,.35)",fontSize:".7rem",fontStyle:"italic"}}>{c.sub}</p>
              {c.done&&<p style={{fontFamily:"'Cinzel',serif",color:"rgba(60,160,100,.45)",fontSize:".5rem",letterSpacing:".32em"}}>SOLVED</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   INTRO
══════════════════════════════════════════════════ */
function Intro({ onStart }) {
  const [step,setStep]=useState(0);
  const {out,done}=useTypewriter(PREMISE,24,step===1);
  return (
    <div style={{minHeight:"100vh",background:"#03080f",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px 20px 270px"}} className="fi">
      <style>{G}</style>
      <CinematicBG variant="night"/>
      <Particles count={50}/>
      <Castle/>
      {step===0&&(
        <div className="fiu" style={{textAlign:"center",maxWidth:480,width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:18,position:"relative",zIndex:10}}>
          <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.38)",fontSize:".58rem",letterSpacing:".6em"}}>A HOGWARTS MYSTERY</p>
          <RuneRing size={96}/>
          <h1 style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:"clamp(1.6rem,7.5vw,3.2rem)",color:"rgba(200,165,80,.92)",letterSpacing:".04em",lineHeight:1.12,textAlign:"center",textShadow:"0 0 70px rgba(180,140,60,.3)"}}>
            The Philosopher's<br/>Thief
          </h1>
          <Divider style={{maxWidth:240}}/>
          <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,190,215,.45)",fontSize:".98rem",fontStyle:"italic",opacity:.82}}>For the sharpest detective in the room</p>
          <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.28)",fontSize:".6rem",letterSpacing:".35em"}}>📍 Hogwarts · 11:47 PM</p>
          <Btn onClick={()=>setStep(1)} style={{animation:"lockPulse 2.5s infinite",marginTop:8}}>Begin Investigation</Btn>
        </div>
      )}
      {step===1&&(
        <div className="fi" style={{width:"100%",maxWidth:480,position:"relative",zIndex:10}}>
          <Card glow>
            <div style={{textAlign:"center",marginBottom:18}}>
              <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.42)",fontSize:".58rem",letterSpacing:".5em",marginBottom:12}}>CASE BRIEFING</p>
              <Divider/>
            </div>
            <pre style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",color:"rgba(210,195,160,.82)",lineHeight:2,whiteSpace:"pre-wrap",minHeight:60}}>
              {out}<span style={{color:"rgba(200,165,80,.75)",animation:"breathe .8s infinite"}}>{!done?"▌":""}</span>
            </pre>
            {done&&(
              <div className="fiu" style={{display:"flex",flexDirection:"column",gap:18,alignItems:"center"}}>
                <Divider/>
                <div style={{width:"100%",background:"rgba(0,0,0,.2)",border:"1px solid rgba(180,140,60,.08)",borderRadius:2,padding:"18px 18px"}}>
                  <p style={{fontFamily:"'Cinzel',serif",color:"rgba(180,140,60,.38)",fontSize:".58rem",letterSpacing:".45em",marginBottom:12,textAlign:"center"}}>INVESTIGATION GUIDE</p>
                  {[["🏰","Explore 5 locations","Uncover hidden evidence"],["🎭","Question 5 suspects","Read between the lines"],["◈","Decode ancient runes","Break the trapdoor cipher"],["⚖","Make your accusation","One chance — use it wisely"]].map(([ic,t,d],i)=>(
                    <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"8px 0",borderBottom:"1px solid rgba(180,140,60,.06)"}}>
                      <span style={{fontSize:15,flexShrink:0,marginTop:2}}>{ic}</span>
                      <div>
                        <p style={{fontFamily:"'Cinzel',serif",color:"rgba(200,165,80,.7)",fontSize:".68rem",letterSpacing:".2em",marginBottom:3}}>{t}</p>
                        <p style={{fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,190,215,.4)",fontSize:".88rem",fontStyle:"italic"}}>{d}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Btn onClick={onStart} style={{animation:"lockPulse 2.5s infinite"}}>Enter Hogwarts</Btn>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════ */
export default function HogwartsMystery() {
  const [phase,setPhase]=useState("intro");
  const [view,setViewS]=useState(null);
  const [clues,setClues]=useState(ROOMS.flatMap(r=>r.clues.map(c=>({...c,found:false}))));
  const [inter,setInter]=useState([]);
  const [cipher,setCipher]=useState(false);

  const setView=v=>{setViewS(v);setPhase(v?v.type:"hub");};
  const findClue=id=>setClues(p=>p.map(c=>c.id===id?{...c,found:true}:c));
  const completeInt=id=>setInter(p=>p.includes(id)?p:[...p,id]);

  if(phase==="intro") return <Intro onStart={()=>setPhase("hub")}/>;
  if(phase==="victory") return <Victory/>;

  const room=view?.type==="room"?ROOMS.find(r=>r.id===view.id):null;
  const suspect=view?.type==="int"?SUSPECTS.find(s=>s.id===view.id):null;

  if(phase==="room"&&room) return <RoomExplorer room={room} allClues={clues} onFindClue={findClue} onBack={()=>setView(null)}/>;
  if(phase==="int"&&suspect) return <Interrogation suspect={suspect} onBack={()=>setView(null)} onComplete={completeInt}/>;
  if(phase==="cipher") return <CipherScreen onSolve={()=>setCipher(true)} solved={cipher} onBack={()=>setView(null)}/>;
  if(phase==="accuse") return <Accusation clues={clues} interrogated={inter} cipherSolved={cipher} onAccuse={c=>{if(c)setPhase("victory");}} onBack={()=>setView(null)}/>;

  return <Hub clues={clues} interrogated={inter} cipherSolved={cipher} setView={setView}/>;
}
