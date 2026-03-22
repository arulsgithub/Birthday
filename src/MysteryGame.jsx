import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════ */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Special+Elite&family=Courier+Prime:wght@400;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{width:100%;min-height:100vh;background:#0d0a06;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:#0d0a06;}
::-webkit-scrollbar-thumb{background:#8b6914;border-radius:3px;}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes fadeInUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeInLeft{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}
@keyframes flicker{0%,19%,21%,23%,25%,54%,56%,100%{opacity:1}20%,24%,55%{opacity:.5}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes pulse{0%,100%{box-shadow:0 0 10px #8b691444}50%{box-shadow:0 0 30px #8b6914aa}}
@keyframes scanline{0%{top:-5%}100%{top:105%}}
@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
@keyframes glow{0%,100%{text-shadow:0 0 10px #8b691488}50%{text-shadow:0 0 30px #8b6914,0 0 60px #8b691466}}
@keyframes rain{0%{transform:translateY(-10px);opacity:0}10%{opacity:.6}90%{opacity:.4}100%{transform:translateY(100vh);opacity:0}}
@keyframes lightning{0%,90%,100%{opacity:0}92%,96%{opacity:.12}94%,98%{opacity:0}}
@keyframes noteFloat{0%,100%{transform:rotate(-1deg) translateY(0)}50%{transform:rotate(1deg) translateY(-4px)}}
@keyframes heartbeat{0%,100%{transform:scale(1)}14%{transform:scale(1.08)}28%{transform:scale(1)}42%{transform:scale(1.05)}70%{transform:scale(1)}}
@keyframes confetti{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
@keyframes avatarBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.fi{animation:fadeIn .6s ease forwards}
.fiu{animation:fadeInUp .7s ease forwards}
.fil{animation:fadeInLeft .6s ease forwards}
.flicker{animation:flicker 4s infinite}
.glow{animation:glow 2s infinite}
.pulse{animation:pulse 2s infinite}
.float{animation:float 3s ease-in-out infinite}
.heartbeat{animation:heartbeat 1.5s infinite}
`;

/* ═══════════════════════════════════════════════════════
   GHIBLI DETECTIVE AVATAR — Detailed redesign
   Inspired by: long dark hair, warm brown skin, calm
   confident expression, maroon outfit, detective coat
═══════════════════════════════════════════════════════ */
function DetectiveAvatar({ size = 120, expression = "determined" }) {
  const configs = {
    determined: { mouthD:"M72,124 Q80,129 88,124", browLY:76, browRY:76, browLAngle:-6, browRAngle:6, eyeOpen:7, pupilY:109 },
    thinking:   { mouthD:"M72,124 Q80,122 88,124", browLY:74, browRY:78, browLAngle:3,  browRAngle:-2, eyeOpen:6, pupilY:109 },
    shocked:    { mouthD:"M74,126 Q80,133 86,126", browLY:72, browRY:72, browLAngle:-10, browRAngle:10, eyeOpen:9, pupilY:108 },
    happy:      { mouthD:"M71,123 Q80,131 89,123", browLY:77, browRY:77, browLAngle:0,  browRAngle:0,  eyeOpen:6, pupilY:110 },
  };
  const c = configs[expression] || configs.determined;
  const s = size / 200;

  return (
    <svg
      width={size} height={size * 1.55}
      viewBox="0 0 200 310"
      style={{ filter:"drop-shadow(0 6px 20px rgba(139,105,20,0.35))", animation:"avatarBob 3s ease-in-out infinite", flexShrink:0 }}
    >
      <defs>
        <radialGradient id="skinGrad" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#d4956a"/>
          <stop offset="100%" stopColor="#b87348"/>
        </radialGradient>
        <radialGradient id="coatGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#5a1525"/>
          <stop offset="100%" stopColor="#3a0d18"/>
        </radialGradient>
        <radialGradient id="hairGrad" cx="50%" cy="20%" r="70%">
          <stop offset="0%" stopColor="#2a1408"/>
          <stop offset="100%" stopColor="#0d0604"/>
        </radialGradient>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── BODY / DETECTIVE COAT ── */}
      {/* Coat base */}
      <path d="M58,185 Q40,210 36,290 L164,290 Q160,210 142,185 Z" fill="url(#coatGrad)"/>
      {/* Coat lapels */}
      <path d="M100,185 L80,200 L72,240 L100,225 Z" fill="#4a1020"/>
      <path d="M100,185 L120,200 L128,240 L100,225 Z" fill="#4a1020"/>
      {/* Coat collar white */}
      <path d="M100,183 L86,196 L100,192 L114,196 Z" fill="#e8d8c0"/>
      {/* Gold detective badge */}
      <circle cx="120" cy="215" r="8" fill="#8b6914"/>
      <circle cx="120" cy="215" r="6" fill="#d4a017"/>
      <text x="120" y="219" textAnchor="middle" fontSize="5" fill="#3a2000" fontWeight="bold">DET</text>
      {/* Coat buttons */}
      <circle cx="100" cy="230" r="3" fill="#8b6914"/>
      <circle cx="100" cy="245" r="3" fill="#8b6914"/>
      {/* Arms */}
      <path d="M58,185 Q30,205 28,250 Q36,252 44,248 Q46,220 62,205 Z" fill="url(#coatGrad)"/>
      <path d="M142,185 Q170,205 172,250 Q164,252 156,248 Q154,220 138,205 Z" fill="url(#coatGrad)"/>
      {/* Hands */}
      <ellipse cx="36" cy="255" rx="10" ry="8" fill="url(#skinGrad)"/>
      <ellipse cx="164" cy="255" rx="10" ry="8" fill="url(#skinGrad)"/>
      {/* Magnifying glass in right hand */}
      <circle cx="178" cy="268" r="14" fill="none" stroke="#8b6914" strokeWidth="3"/>
      <circle cx="178" cy="268" r="10" fill="rgba(180,220,255,0.15)"/>
      <line x1="188" y1="278" x2="198" y2="292" stroke="#8b6914" strokeWidth="4" strokeLinecap="round"/>
      {/* Notebook in left hand */}
      <rect x="18" y="248" width="20" height="26" rx="2" fill="#c8a050"/>
      <rect x="20" y="250" width="16" height="22" rx="1" fill="#f5e6c8"/>
      <line x1="22" y1="255" x2="34" y2="255" stroke="#8b6914" strokeWidth="1"/>
      <line x1="22" y1="259" x2="34" y2="259" stroke="#8b6914" strokeWidth="1"/>
      <line x1="22" y1="263" x2="30" y2="263" stroke="#8b6914" strokeWidth="1"/>

      {/* ── NECK ── */}
      <rect x="90" y="165" width="20" height="26" rx="8" fill="url(#skinGrad)"/>

      {/* ── HEAD ── */}
      {/* Head shape - slightly oval, soft jaw */}
      <path d="M56,108 Q54,150 62,162 Q72,178 100,180 Q128,178 138,162 Q146,150 144,108 Q142,72 100,68 Q58,72 56,108 Z" fill="url(#skinGrad)"/>

      {/* ── HAIR ── */}
      {/* Main hair top */}
      <path d="M56,108 Q54,82 62,70 Q72,56 100,54 Q128,56 138,70 Q146,82 144,108 Q138,88 100,86 Q62,88 56,108 Z" fill="url(#hairGrad)"/>
      {/* Hair parting highlight */}
      <path d="M96,56 Q100,52 104,56 Q102,64 100,68 Q98,64 96,56 Z" fill="#3a1e0a" opacity="0.5"/>
      {/* Left side hair flowing down */}
      <path d="M56,108 Q46,120 42,145 Q40,168 44,185 Q52,182 56,170 Q54,148 58,130 Q58,118 62,110 Z" fill="url(#hairGrad)"/>
      {/* Right side hair flowing down */}
      <path d="M144,108 Q154,120 158,145 Q160,168 156,185 Q148,182 144,170 Q146,148 142,130 Q142,118 138,110 Z" fill="url(#hairGrad)"/>
      {/* Hair strands detail left */}
      <path d="M44,150 Q46,162 48,172" stroke="#1a0a04" strokeWidth="1.5" fill="none" opacity="0.6"/>
      <path d="M46,148 Q49,160 52,170" stroke="#1a0a04" strokeWidth="1" fill="none" opacity="0.4"/>
      {/* Hair strands detail right */}
      <path d="M156,150 Q154,162 152,172" stroke="#1a0a04" strokeWidth="1.5" fill="none" opacity="0.6"/>
      {/* Hair shine */}
      <path d="M68,70 Q80,64 90,66 Q80,72 70,76 Z" fill="#3d2010" opacity="0.5"/>

      {/* ── FACE FEATURES ── */}
      {/* Soft cheek blush */}
      <ellipse cx="68" cy="130" rx="10" ry="6" fill="#d4806a" opacity="0.25"/>
      <ellipse cx="132" cy="130" rx="10" ry="6" fill="#d4806a" opacity="0.25"/>

      {/* LEFT EYEBROW */}
      <path
        d={`M${62 - 12},${c.browLY + 2} Q${62},${c.browLY - 4} ${62 + 12},${c.browLY + 2}`}
        stroke="#2a1008" strokeWidth="2.5" fill="none" strokeLinecap="round"
        transform={`rotate(${c.browLAngle}, 62, ${c.browLY})`}
      />
      {/* RIGHT EYEBROW */}
      <path
        d={`M${132 - 12},${c.browRY + 2} Q${132},${c.browRY - 4} ${132 + 12},${c.browRY + 2}`}
        stroke="#2a1008" strokeWidth="2.5" fill="none" strokeLinecap="round"
        transform={`rotate(${-c.browRAngle}, 132, ${c.browRY})`}
      />

      {/* LEFT EYE */}
      <ellipse cx="68" cy="108" rx="13" ry={c.eyeOpen} fill="white"/>
      {/* Eye lid shadow */}
      <path d={`M55,104 Q68,${104 - c.eyeOpen * 0.8} 81,104`} fill="#d4956a" opacity="0.3"/>
      {/* Iris */}
      <ellipse cx="68" cy={c.pupilY} rx="8" ry="7.5" fill="#3d2010"/>
      {/* Pupil */}
      <ellipse cx="68" cy={c.pupilY} rx="5" ry="5" fill="#1a0a04"/>
      {/* Eye shine 1 */}
      <ellipse cx="71" cy={c.pupilY - 2} rx="2.5" ry="2" fill="white"/>
      {/* Eye shine 2 small */}
      <ellipse cx="65" cy={c.pupilY + 1} rx="1.2" ry="1" fill="white" opacity="0.6"/>
      {/* Upper lash line */}
      <path d={`M55,104 Q68,${104 - c.eyeOpen} 81,104`} stroke="#1a0a04" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      {/* Lower lash */}
      <path d={`M56,112 Q68,${114 + c.eyeOpen * 0.3} 80,112`} stroke="#1a0a04" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5"/>

      {/* RIGHT EYE */}
      <ellipse cx="132" cy="108" rx="13" ry={c.eyeOpen} fill="white"/>
      <path d={`M119,104 Q132,${104 - c.eyeOpen * 0.8} 145,104`} fill="#d4956a" opacity="0.3"/>
      <ellipse cx="132" cy={c.pupilY} rx="8" ry="7.5" fill="#3d2010"/>
      <ellipse cx="132" cy={c.pupilY} rx="5" ry="5" fill="#1a0a04"/>
      <ellipse cx="135" cy={c.pupilY - 2} rx="2.5" ry="2" fill="white"/>
      <ellipse cx="129" cy={c.pupilY + 1} rx="1.2" ry="1" fill="white" opacity="0.6"/>
      <path d={`M119,104 Q132,${104 - c.eyeOpen} 145,104`} stroke="#1a0a04" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d={`M120,112 Q132,${114 + c.eyeOpen * 0.3} 144,112`} stroke="#1a0a04" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5"/>

      {/* NOSE — soft, small */}
      <path d="M97,128 Q100,134 103,128" stroke="#a06848" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="95" cy="130" rx="3" ry="2" fill="#a06848" opacity="0.3"/>
      <ellipse cx="105" cy="130" rx="3" ry="2" fill="#a06848" opacity="0.3"/>

      {/* MOUTH */}
      <path d={c.mouthD} stroke="#8b4030" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Lip fill */}
      <path d="M72,124 Q80,126 88,124 Q84,128 80,129 Q76,128 72,124 Z" fill="#c06850" opacity="0.4"/>

      {/* EARS */}
      <ellipse cx="52" cy="118" rx="6" ry="8" fill="url(#skinGrad)"/>
      <ellipse cx="52" cy="118" rx="4" ry="5.5" fill="#c07858" opacity="0.4"/>
      <ellipse cx="148" cy="118" rx="6" ry="8" fill="url(#skinGrad)"/>
      <ellipse cx="148" cy="118" rx="4" ry="5.5" fill="#c07858" opacity="0.4"/>
      {/* Gold stud earrings */}
      <circle cx="52" cy="122" r="3.5" fill="#d4a017"/>
      <circle cx="52" cy="122" r="2" fill="#ffcc44"/>
      <circle cx="148" cy="122" r="3.5" fill="#d4a017"/>
      <circle cx="148" cy="122" r="2" fill="#ffcc44"/>

      {/* ── NAME TAG ── */}
      <rect x="62" y="258" width="76" height="20" rx="3" fill="#1a1200" opacity="0.8"/>
      <text x="100" y="272" textAnchor="middle" fontSize="9" fill="#d4a017" fontFamily="serif" letterSpacing="2">AMRITHA</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   EFFECTS
═══════════════════════════════════════════════════════ */
function Rain() {
  const drops = Array.from({length:35},(_,i)=>({id:i,left:`${Math.random()*100}%`,delay:`${Math.random()*3}s`,dur:`${0.6+Math.random()*0.8}s`,h:`${8+Math.random()*14}px`,op:0.08+Math.random()*0.18}));
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
      {drops.map(d=><div key={d.id} style={{position:"absolute",left:d.left,top:0,width:"1px",height:d.h,background:"linear-gradient(transparent,rgba(150,200,255,0.4))",animation:`rain ${d.dur} ${d.delay} linear infinite`,opacity:d.op}}/>)}
      <div style={{position:"absolute",inset:0,animation:"lightning 8s infinite",background:"rgba(200,220,255,0.04)"}}/>
    </div>
  );
}
function Scanline() {
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:990,overflow:"hidden"}}>
      <div style={{position:"absolute",left:0,right:0,height:"2px",background:"rgba(184,134,11,0.05)",animation:"scanline 5s linear infinite"}}/>
      <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.03) 3px,rgba(0,0,0,0.03) 4px)"}}/>
    </div>
  );
}
function Confetti() {
  const p=Array.from({length:60},(_,i)=>({id:i,left:`${Math.random()*100}%`,color:["#8b6914","#ff6ec4","#ffcc00","#00ffcc","#ff4466","#c0a060"][i%6],size:`${5+Math.random()*8}px`,delay:`${Math.random()*2}s`,dur:`${2.5+Math.random()*2}s`,br:i%3===0?"50%":"0"}));
  return <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:995}}>{p.map(c=><div key={c.id} style={{position:"absolute",top:"-20px",left:c.left,width:c.size,height:c.size,background:c.color,borderRadius:c.br,animation:`confetti ${c.dur} ${c.delay} ease-in forwards`}}/>)}</div>;
}

/* ═══════════════════════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════════════════════ */
function useTypewriter(text,speed=30,active=true){
  const [out,setOut]=useState("");
  const [done,setDone]=useState(false);
  useEffect(()=>{
    if(!active){setOut("");setDone(false);return;}
    setOut("");setDone(false);let i=0;
    const iv=setInterval(()=>{if(i<text.length){setOut(text.slice(0,++i));}else{setDone(true);clearInterval(iv);}},speed);
    return()=>clearInterval(iv);
  },[text,active]);
  return{out,done};
}

/* ═══════════════════════════════════════════════════════
   GAME DATA
═══════════════════════════════════════════════════════ */
const STORY_PREMISE = `A priceless diamond — the "Velvet Star" — has vanished from Lord Blackwood's vault the night before his granddaughter's birthday. The manor is locked. A storm rages outside. Five guests remain. One of them is guilty.\n\nYou are Detective Amritha. You have until midnight to solve this.`;

const ROOMS = [
  {id:"library",name:"The Library",icon:"📚",desc:"Walls of leather-bound books. Cold fireplace. Scent of old paper and secrets.",
   clues:[
    {id:"c1",text:"A torn ledger page dated March 23rd. The entry: 'V.S. transfer — midnight.' Handwriting rushed, almost panicked.",found:false,key:true},
    {id:"c2",text:"A half-smoked cigarette in the ashtray — not Lord Blackwood's brand. Someone else was here recently.",found:false,key:false},
    {id:"c3",text:"Behind the encyclopedia set: a hidden compartment — EMPTY. Fresh scratch marks on the shelf.",found:false,key:true},
  ]},
  {id:"vault",name:"The Vault Room",icon:"🔐",desc:"A heavy steel door hangs ajar. The vault's interior is bare where the Velvet Star once rested.",
   clues:[
    {id:"c4",text:"Vault combination lock shows expert tampering — no forced entry. Someone knew the code.",found:false,key:true},
    {id:"c5",text:"A single white glove dropped in haste. Size: small. Faint perfume — rose and amber.",found:false,key:true},
    {id:"c6",text:"Muddy footprints leading TO the vault — small heel marks. None leading away.",found:false,key:false},
  ]},
  {id:"garden",name:"The Winter Garden",icon:"🌿",desc:"Glass walls rattle in the storm. Exotic plants cast twisted shadows. A chill not from the weather.",
   clues:[
    {id:"c7",text:"Fresh soil disturbed near the east wall — something buried or dug up tonight.",found:false,key:true},
    {id:"c8",text:"A monogrammed handkerchief: 'E.V.' — dropped near the rose bushes. Still damp.",found:false,key:true},
    {id:"c9",text:"Claw marks on the garden gate latch — from inside. Someone tried to leave; the storm stopped them.",found:false,key:false},
  ]},
  {id:"study",name:"Lord Blackwood's Study",icon:"🕯️",desc:"Candlelight flickers over mahogany. A portrait of the lord watches with hollow eyes.",
   clues:[
    {id:"c10",text:"A crumpled letter: 'If you don't return what's mine by midnight, I will expose everything. — R.' The lord's hands shook when he found this.",found:false,key:true},
    {id:"c11",text:"The safe behind the portrait is open — not the main vault. Inside: a second insurance doc for the Velvet Star, dated yesterday.",found:false,key:true},
    {id:"c12",text:"A chess set mid-game. The black queen is positioned for checkmate — but it's white's turn.",found:false,key:false},
  ]},
  {id:"cellar",name:"The Wine Cellar",icon:"🍷",desc:"Stone walls weep moisture. Dust on every bottle — except three, recently touched.",
   clues:[
    {id:"c13",text:"Behind the Bordeaux rack: a black velvet pouch — EMPTY. Unmistakably the Velvet Star's carrying case.",found:false,key:true},
    {id:"c14",text:"A burner phone. One sent message: 'Done. Meet at the east gate at dawn.' Timestamp: 11:31 PM tonight.",found:false,key:true},
    {id:"c15",text:"A wine glass with lipstick on the rim — deep burgundy. Two glasses poured, one untouched.",found:false,key:true},
  ]},
];

const SUSPECTS = [
  {id:"elara",name:"Lady Elara Voss",role:"The Lord's Niece",icon:"👩‍💼",
   motive:"Inheritance — written out of the will last month",alibi:"Claims she was reading in her room all evening",guilty:true,
   questions:[
    {q:"Where were you between 11 and midnight?",options:[
      {text:"In my room, reading.",response:"She maintains eye contact... too steady. Almost rehearsed.",suspicious:true},
      {text:"I went for a short walk.",response:"A walk? In this storm? Her composure cracks for a moment.",suspicious:false},
    ]},
    {q:"Do you know the vault combination?",options:[
      {text:"Of course not, that's preposterous.",response:"She reaches for her glove — but only one glove is on her hand.",suspicious:true},
      {text:"Why would I? I'm just a guest.",response:"Her eyes flick to the vault door before she catches herself.",suspicious:true},
    ]},
    {q:"What does the initial 'R' in the threat letter mean to you?",options:[
      {text:"I have absolutely no idea.",response:"A bead of sweat. Her perfume — rose and amber — fills the room.",suspicious:true},
      {text:"That's a private family matter.",response:"She smoothes her dress — you notice dried soil on her heel.",suspicious:true},
    ]},
  ],
   tells:["Missing one white glove — matches vault find","Initials 'E.V.' match garden handkerchief","Rose & amber perfume matches glove scent","Soil on heel matches garden disturbance","Only person temporarily given vault combination","No verifiable alibi at 11:31 PM — burner phone timestamp"]},
  {id:"reginald",name:"Colonel Reginald Shaw",role:"Old Family Friend",icon:"🎖️",
   motive:"Gambling debts — owes dangerous people",alibi:"Claims chess with Lord Blackwood in the study",guilty:false,
   questions:[
    {q:"You were in the study all evening?",options:[
      {text:"Indeed. Ask the lord himself.",response:"Blackwood confirms it — but the chess game was unfinished, as if interrupted.",suspicious:false},
      {text:"Most of the evening, yes.",response:"'Most of' — an interesting qualifier, Colonel.",suspicious:true},
    ]},
    {q:"Do you know about the threat letter?",options:[
      {text:"What letter?",response:"Genuine confusion — or very good acting. You make a note.",suspicious:false},
      {text:"Blackwood has many enemies.",response:"He knows more than he's saying — but about what?",suspicious:false},
    ]},
  ],
   tells:["Gambling debts: motive exists, zero physical evidence","Alibi corroborated by Lord Blackwood","Letter 'R' — Reginald starts with R, but handwriting doesn't match","Innocent — a red herring"]},
  {id:"diana",name:"Dr. Diana Mercer",role:"Gemologist & Appraiser",icon:"💎",
   motive:"Professional jealousy — authenticated the diamond but denied credit",alibi:"Reviewing notes in the library",guilty:false,
   questions:[
    {q:"You were in the library all evening?",options:[
      {text:"Yes, reviewing my appraisal notes.",response:"She produces detailed notes. Handwriting neat, not rushed.",suspicious:false},
      {text:"I moved around the manor a bit.",response:"Butler saw her in the library at 11 PM. Her alibi holds.",suspicious:false},
    ]},
    {q:"Could someone steal the diamond without expert knowledge?",options:[
      {text:"Impossible — the vault was custom-built.",response:"She explains vault mechanics in detail — then stops, realizing she's said too much.",suspicious:true},
      {text:"It would take knowing exactly what to look for.",response:"Expertise is a double-edged sword. Means, but no evidence.",suspicious:false},
    ]},
  ],
   tells:["Library cigarette is HER brand — she was there","Deep vault knowledge: means, but strongly alibied","Motive exists, culprit she is not — red herring #2"]},
  {id:"thomas",name:"Thomas Crane",role:"The Butler",icon:"🎩",
   motive:"Loyalty to Lady Elara — served her family for 20 years",alibi:"Serving drinks in the drawing room all evening",guilty:false,
   questions:[
    {q:"Did you see anyone near the vault tonight?",options:[
      {text:"I saw Lady Elara near the east corridor at 11:20.",response:"He says this calmly — then immediately looks as if he regrets it.",suspicious:true},
      {text:"No one unusual, Detective.",response:"His hands clasp too tightly. He's protecting someone.",suspicious:true},
    ]},
    {q:"Did you help anyone access the vault?",options:[
      {text:"I would never betray Lord Blackwood.",response:"His loyalty is to Blackwood — but his eyes say something else entirely.",suspicious:false},
      {text:"My duties are strictly defined.",response:"He never answers the question directly. Never.",suspicious:true},
    ]},
  ],
   tells:["Spotted Lady Elara near east corridor 11:20 PM — key witness","Alibi confirmed by two other guests","Protective of Elara — old loyalty, not guilt"]},
  {id:"margot",name:"Margot Welles",role:"Journalist",icon:"📰",
   motive:"A story worth millions — investigating the diamond's origins",alibi:"On the phone with her editor all evening",guilty:false,
   questions:[
    {q:"What story are you investigating?",options:[
      {text:"The diamond's controversial ownership history.",response:"She opens her notebook — pages of research. This is journalism, not theft.",suspicious:false},
      {text:"That's confidential, I'm afraid.",response:"Her phone shows 8 calls to her editor. Alibi is airtight.",suspicious:false},
    ]},
    {q:"Did you know about the threat letter beforehand?",options:[
      {text:"Yes — I sent Blackwood a warning tip about it.",response:"SHE warned him. The letter came from a third party she was tracking.",suspicious:false},
      {text:"I've been following the diamond's shady ownership trail.",response:"She's a witness, not a criminal. Her investigation helped crack the case.",suspicious:false},
    ]},
  ],
   tells:["She WARNED Blackwood — not the criminal","Phone records confirm editor calls all evening","Her journalism work is actually critical evidence"]},
];

const CIPHER = {
  encrypted:"YJQQJ XYFW MZSYJW TSJB YMJ HTIJ",
  answer:"VELVET STAR HUNTER KNEW THE CODE",
  shift:5,
  hint:"Shift each letter BACK by 5 in the alphabet. A→V, B→W, etc.",
};

/* ═══════════════════════════════════════════════════════
   SHARED BUTTON
═══════════════════════════════════════════════════════ */
const Btn = ({children,onClick,color="#8b6914",style={}}) => (
  <button onClick={onClick} style={{padding:"12px 28px",background:"transparent",border:`1.5px solid ${color}`,color,cursor:"pointer",fontFamily:"'Courier Prime'",fontSize:"0.85rem",letterSpacing:3,borderRadius:2,transition:"all .2s",...style}}>{children}</button>
);

/* ═══════════════════════════════════════════════════════
   NOTEBOOK OVERLAY
═══════════════════════════════════════════════════════ */
function Notebook({clues,onClose}){
  const found=clues.filter(c=>c.found);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,zIndex:800}} className="fi">
      <div style={{width:"100%",maxWidth:540,maxHeight:"85vh",background:"#f5e6c8",borderRadius:4,display:"flex",flexDirection:"column",border:"2px solid #8b6914",boxShadow:"0 20px 60px rgba(0,0,0,0.8)"}}>
        <div style={{background:"#2c1a00",padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{color:"#8b6914",fontFamily:"'Cinzel'",fontSize:"0.9rem",letterSpacing:3}}>🔍 DETECTIVE'S NOTEBOOK</span>
          <button style={{background:"none",border:"none",color:"#8b6914",cursor:"pointer",fontSize:"1.1rem"}} onClick={onClose}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:20,display:"flex",flexDirection:"column",gap:10}}>
          {found.length===0&&<p style={{color:"#888",fontFamily:"'Crimson Text'",fontStyle:"italic",textAlign:"center",marginTop:20}}>No clues yet. Explore the manor!</p>}
          {found.map((c,i)=>(
            <div key={c.id} style={{display:"flex",gap:10,padding:"10px 14px",background:"rgba(139,105,20,0.1)",borderLeft:`3px solid ${c.key?"#8b6914":"#ccc"}`,borderRadius:"0 4px 4px 0"}} className="fil">
              <span style={{color:c.key?"#8b6914":"#aaa",flexShrink:0,marginTop:2}}>◆</span>
              <div>
                <p style={{color:"#3d2000",fontFamily:"'Crimson Text'",fontSize:"0.95rem",lineHeight:1.7}}>{c.text}</p>
                {c.key&&<span style={{color:"#8b6914",fontFamily:"'Courier Prime'",fontSize:"0.65rem",letterSpacing:2}}>KEY EVIDENCE</span>}
              </div>
            </div>
          ))}
        </div>
        <div style={{padding:"12px 20px",borderTop:"1px solid #c8a050",background:"rgba(139,105,20,0.05)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{color:"#8b6914",fontFamily:"'Courier Prime'",fontSize:"0.75rem",letterSpacing:2}}>{found.length}/{clues.length} clues</span>
            <div style={{width:"60%",height:4,background:"#ddd",borderRadius:2}}>
              <div style={{width:`${(found.length/clues.length)*100}%`,height:"100%",background:"linear-gradient(90deg,#8b6914,#d4a017)",borderRadius:2,transition:"width .5s"}}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOM EXPLORER
═══════════════════════════════════════════════════════ */
function RoomExplorer({room,allClues,onFindClue,onBack}){
  const [examining,setExamining]=useState(null);
  const roomClues=allClues.filter(c=>room.clues.some(rc=>rc.id===c.id));
  return(
    <div style={{minHeight:"100vh",background:"radial-gradient(ellipse at top,#0a0600,#050302)",color:"#d4b896",position:"relative",paddingBottom:40}} className="fi">
      <Rain/><Scanline/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",borderBottom:"1px solid #1a1200",background:"rgba(0,0,0,0.6)",position:"sticky",top:0,zIndex:50}}>
        <Btn onClick={onBack}>← Manor</Btn>
        <h2 style={{fontFamily:"'Cinzel'",fontSize:"clamp(1rem,4vw,1.4rem)",color:"#c8a050",letterSpacing:4}}>{room.icon} {room.name}</h2>
        <span style={{color:"#444",fontFamily:"'Courier Prime'",fontSize:"0.7rem",letterSpacing:2}}>INVESTIGATE</span>
      </div>
      <div style={{maxWidth:680,margin:"0 auto",padding:"28px 20px"}}>
        <p style={{fontFamily:"'Crimson Text'",fontSize:"1.1rem",color:"#a89070",lineHeight:1.8,fontStyle:"italic",textAlign:"center",marginBottom:28}}>{room.desc}</p>
        <div style={{textAlign:"center",marginBottom:28}}>
          <DetectiveAvatar size={90} expression="thinking"/>
          <p style={{color:"#8b6914",fontFamily:"'Courier Prime'",fontSize:"0.65rem",letterSpacing:3,marginTop:6}}>DETECTIVE AMRITHA</p>
        </div>
        <h3 style={{fontFamily:"'Cinzel'",fontSize:"0.85rem",color:"#8b6914",letterSpacing:4,marginBottom:14,textAlign:"center"}}>POINTS OF INTEREST</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10}}>
          {roomClues.map((clue,i)=>(
            <div key={clue.id} style={{border:`1px solid ${clue.found?"#8b6914":"#222"}`,borderRadius:4,padding:"18px 10px",textAlign:"center",cursor:"pointer",transition:"all .3s",background:clue.found?"rgba(139,105,20,0.1)":"rgba(255,255,255,0.01)",display:"flex",flexDirection:"column",gap:8,alignItems:"center"}} onClick={()=>{if(!clue.found)onFindClue(clue.id);setExamining(clue);}}>
              <span style={{fontSize:28}}>{clue.found?"🔍":"❓"}</span>
              <span style={{fontFamily:"'Courier Prime'",fontSize:"0.7rem",color:"#666",letterSpacing:2}}>{clue.found?"Evidence Found":`Area ${i+1}`}</span>
              {clue.key&&clue.found&&<span style={{background:"rgba(139,105,20,0.2)",border:"1px solid #8b691488",color:"#8b6914",padding:"2px 8px",fontSize:"0.6rem",letterSpacing:2,fontFamily:"'Courier Prime'",borderRadius:2}}>KEY</span>}
            </div>
          ))}
        </div>
      </div>
      {examining&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,zIndex:700}} className="fi">
          <div style={{background:"#0d0a06",border:"1px solid #8b6914",borderRadius:4,padding:28,maxWidth:480,width:"100%",animation:"noteFloat 3s ease-in-out infinite"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <span style={{color:examining.key?"#8b6914":"#555",fontFamily:"'Courier Prime'",fontSize:"0.7rem",letterSpacing:3}}>{examining.key?"⭐ KEY EVIDENCE":"OBSERVATION"}</span>
              <button style={{background:"none",border:"none",color:"#555",cursor:"pointer",fontSize:"1rem"}} onClick={()=>setExamining(null)}>✕</button>
            </div>
            <p style={{fontFamily:"'Crimson Text'",fontSize:"1rem",color:"#d4b896",lineHeight:1.9}}>{examining.text}</p>
            <div style={{textAlign:"center",marginTop:16}}><DetectiveAvatar size={60} expression={examining.key?"shocked":"thinking"}/></div>
            {examining.key&&<p style={{color:"#8b6914",fontFamily:"'Courier Prime'",fontSize:"0.7rem",letterSpacing:2,textAlign:"center",marginTop:10,fontStyle:"italic"}}>This could be important...</p>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   INTERROGATION
═══════════════════════════════════════════════════════ */
function Interrogation({suspect,onBack,onComplete,completed}){
  const [qIdx,setQIdx]=useState(0);
  const [answers,setAnswers]=useState([]);
  const [suspicion,setSuspicion]=useState(0);
  const [showTells,setShowTells]=useState(false);
  const done=qIdx>=suspect.questions.length;
  const suspColor=suspicion===0?"#00cc88":suspicion===1?"#ffcc00":"#ff4444";

  const handleAnswer=(opt)=>{
    const newA=[...answers,{q:suspect.questions[qIdx].q,a:opt.text,r:opt.response,s:opt.suspicious}];
    setAnswers(newA);
    if(opt.suspicious)setSuspicion(s=>s+1);
    if(qIdx<suspect.questions.length-1)setQIdx(q=>q+1);
    else{setQIdx(suspect.questions.length);onComplete(suspect.id);}
  };

  return(
    <div style={{minHeight:"100vh",background:"radial-gradient(ellipse at top right,#0a0600,#050302)",color:"#d4b896",paddingBottom:40}} className="fi">
      <Scanline/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",borderBottom:"1px solid #1a1200",background:"rgba(0,0,0,0.6)",position:"sticky",top:0,zIndex:50}}>
        <Btn onClick={onBack}>← Back</Btn>
        <h2 style={{fontFamily:"'Cinzel'",fontSize:"clamp(0.9rem,4vw,1.3rem)",color:"#c8a050",letterSpacing:4}}>INTERROGATION</h2>
        <span/>
      </div>
      <div style={{maxWidth:720,margin:"0 auto",padding:"24px 20px",display:"flex",gap:20,flexWrap:"wrap"}}>
        <div style={{flex:"0 0 190px",background:"rgba(255,255,255,0.02)",border:"1px solid #1a1200",borderRadius:4,padding:18,textAlign:"center"}}>
          <div style={{fontSize:48}}>{suspect.icon}</div>
          <h3 style={{fontFamily:"'Cinzel'",color:"#c8a050",fontSize:"0.95rem",marginTop:10,letterSpacing:2}}>{suspect.name}</h3>
          <p style={{color:"#555",fontFamily:"'Courier Prime'",fontSize:"0.7rem",letterSpacing:2,marginBottom:14}}>{suspect.role}</p>
          <div style={{marginBottom:14}}>
            <p style={{color:"#444",fontFamily:"'Courier Prime'",fontSize:"0.6rem",letterSpacing:2}}>SUSPICION</p>
            <div style={{height:4,background:"#111",borderRadius:2,marginTop:6}}>
              <div style={{width:`${(suspicion/suspect.questions.length)*100}%`,height:"100%",background:suspColor,borderRadius:2,transition:"all .5s"}}/>
            </div>
          </div>
          <p style={{fontFamily:"'Crimson Text'",fontSize:"0.82rem",color:"#a89070",lineHeight:1.6,textAlign:"left",marginBottom:8}}><strong style={{color:"#8b6914"}}>MOTIVE: </strong>{suspect.motive}</p>
          <p style={{fontFamily:"'Crimson Text'",fontSize:"0.82rem",color:"#666",lineHeight:1.6,textAlign:"left"}}><strong style={{color:"#444"}}>ALIBI: </strong>{suspect.alibi}</p>
        </div>
        <div style={{flex:1,minWidth:260}}>
          <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:18}}>
            <DetectiveAvatar size={65} expression={done?"happy":"determined"}/>
            <div style={{flex:1}}>
              <p style={{color:"#8b6914",fontFamily:"'Courier Prime'",fontSize:"0.6rem",letterSpacing:3,marginBottom:6}}>DETECTIVE AMRITHA</p>
              <p style={{fontFamily:"'Crimson Text'",fontSize:"1rem",color:"#d4b896",fontStyle:"italic",lineHeight:1.7}}>"{done?"I have all I need. For now.":suspect.questions[qIdx]?.q}"</p>
            </div>
          </div>
          {answers.map((a,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,0.02)",borderLeft:"2px solid #1a1200",padding:"10px 14px",marginBottom:10,borderRadius:"0 4px 4px 0"}}>
              <p style={{color:"#444",fontFamily:"'Courier Prime'",fontSize:"0.7rem",letterSpacing:1,marginBottom:4}}>Q: {a.q}</p>
              <p style={{color:"#a89070",fontFamily:"'Crimson Text'",fontSize:"0.95rem",fontStyle:"italic",marginBottom:4}}>"{a.a}"</p>
              <p style={{color:a.s?"#ff8866":"#66cc88",fontFamily:"'Courier Prime'",fontSize:"0.7rem",letterSpacing:1}}>{a.r}</p>
            </div>
          ))}
          {!done&&(
            <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:14}}>
              {suspect.questions[qIdx].options.map((opt,i)=>(
                <button key={i} style={{background:"rgba(255,255,255,0.02)",border:"1px solid #2a1800",color:"#d4b896",padding:"12px 16px",cursor:"pointer",fontFamily:"'Crimson Text'",fontSize:"1rem",textAlign:"left",borderRadius:4,transition:"all .2s",lineHeight:1.5}} onClick={()=>handleAnswer(opt)}>
                  <span style={{color:"#8b6914",marginRight:8}}>→</span>"{opt.text}"
                </button>
              ))}
            </div>
          )}
          {done&&(
            <div style={{marginTop:18,textAlign:"center"}} className="fiu">
              <p style={{color:"#8b6914",fontFamily:"'Courier Prime'",letterSpacing:3,fontSize:"0.8rem",marginBottom:14}}>Interrogation complete.</p>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}}>
                <Btn onClick={()=>setShowTells(!showTells)}>{showTells?"Hide Analysis":"View Analysis →"}</Btn>
                <Btn onClick={onBack} color="#555">← Return</Btn>
              </div>
              {showTells&&(
                <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:8,textAlign:"left"}} className="fiu">
                  {suspect.tells.map((t,i)=>(
                    <div key={i} style={{display:"flex",gap:10,padding:"8px 12px",background:"rgba(139,105,20,0.06)",borderRadius:2}}>
                      <span style={{color:"#8b6914",flexShrink:0}}>◆</span>
                      <p style={{color:"#a89070",fontFamily:"'Crimson Text'",fontSize:"0.9rem",lineHeight:1.6}}>{t}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CIPHER PUZZLE
═══════════════════════════════════════════════════════ */
function CipherPuzzle({onSolve,solved,onBack}){
  const [input,setInput]=useState("");
  const [wrong,setWrong]=useState(false);
  const [showHint,setShowHint]=useState(false);
  const check=()=>{
    if(input.trim().toUpperCase()===CIPHER.answer){onSolve();}
    else{setWrong(true);setTimeout(()=>setWrong(false),600);setInput("");}
  };
  return(
    <div style={{minHeight:"100vh",background:"radial-gradient(ellipse at bottom left,#000a0a,#050302)",color:"#d4b896",display:"flex",flexDirection:"column"}} className="fi">
      <Scanline/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",borderBottom:"1px solid #0a1a1a",background:"rgba(0,0,0,0.6)",position:"sticky",top:0,zIndex:50}}>
        <Btn onClick={onBack} color="#00cccc">← Manor</Btn>
        <h2 style={{fontFamily:"'Cinzel'",fontSize:"clamp(1rem,4vw,1.3rem)",color:"#00cccc",letterSpacing:4}}>VAULT CIPHER</h2>
        <span/>
      </div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px 20px 40px"}}>
        <div style={{maxWidth:700,width:"100%",textAlign:"center"}}>
          <h2 style={{fontFamily:"'Cinzel'",fontSize:"clamp(1.3rem,5vw,2rem)",color:"#00cccc",letterSpacing:5,marginBottom:6,animation:"glow 2s infinite"}}>🔐 THE CIPHER</h2>
          <p style={{color:"#336666",fontFamily:"'Courier Prime'",fontSize:"0.8rem",letterSpacing:3,marginBottom:20,fontStyle:"italic"}}>Scratched faintly into the vault wall...</p>
          <div style={{background:"rgba(0,30,30,0.7)",border:"1px solid #00cccc44",borderRadius:4,padding:"20px 28px",marginBottom:16}}>
            <p style={{fontFamily:"'Courier Prime'",fontSize:"clamp(0.8rem,3vw,1.1rem)",color:"#00ffff",letterSpacing:5,wordSpacing:14,lineHeight:1.8}}>{CIPHER.encrypted}</p>
          </div>
          <p style={{color:"#668888",fontFamily:"'Crimson Text'",fontSize:"0.95rem",lineHeight:1.7,marginBottom:20,fontStyle:"italic"}}>In the vault, scratched into the steel — a Caesar cipher. The shift key is the number of clues found in the wine cellar (3). Shift each letter back by 5 to reveal the truth.</p>
          <div style={{background:"rgba(0,0,0,0.5)",border:"1px solid #0a2020",borderRadius:4,padding:14,marginBottom:20}}>
            <p style={{color:"#336666",fontFamily:"'Courier Prime'",fontSize:"0.65rem",letterSpacing:3,marginBottom:10}}>CAESAR CIPHER — SHIFT BACK BY 5</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:3,justifyContent:"center"}}>
              {Array.from({length:26},(_,i)=>{
                const enc=String.fromCharCode(65+i);
                const dec=String.fromCharCode(((i-5+26)%26)+65);
                return(<div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",minWidth:20}}>
                  <div style={{color:"#00cccc",fontFamily:"'Courier Prime'",fontSize:"0.6rem"}}>{enc}</div>
                  <div style={{color:"#334444",fontSize:"0.5rem"}}>↓</div>
                  <div style={{color:"#ff9944",fontFamily:"'Courier Prime'",fontSize:"0.6rem"}}>{dec}</div>
                </div>);
              })}
            </div>
          </div>
          {!solved?(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
              <input style={{width:"100%",maxWidth:500,background:"rgba(0,0,0,0.7)",border:`1px solid ${wrong?"#ff4444":"#00cccc44"}`,color:"#00ffff",padding:"14px 20px",fontFamily:"'Courier Prime'",fontSize:"0.9rem",letterSpacing:3,outline:"none",borderRadius:2,textAlign:"center",animation:wrong?"shake .5s ease":"none"}} value={input} onChange={e=>setInput(e.target.value.toUpperCase())} onKeyDown={e=>e.key==="Enter"&&check()} placeholder="TYPE DECODED MESSAGE..."/>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}}>
                <Btn onClick={check} color="#00cccc">DECODE →</Btn>
                <Btn onClick={()=>setShowHint(s=>!s)} color="#335555">{showHint?"Hide Hint":"Hint?"}</Btn>
              </div>
              {wrong&&<p style={{color:"#ff4444",fontFamily:"'Courier Prime'",fontSize:"0.8rem",letterSpacing:2}}>⚠ INCORRECT. Try again.</p>}
              {showHint&&<p style={{color:"#445555",fontFamily:"'Courier Prime'",fontSize:"0.8rem",letterSpacing:1,fontStyle:"italic",maxWidth:400}}>{CIPHER.hint}</p>}
            </div>
          ):(
            <div style={{background:"rgba(0,204,136,0.06)",border:"1px solid #00cc88",borderRadius:4,padding:28}} className="fiu">
              <p style={{color:"#00cc88",fontFamily:"'Cinzel'",fontSize:"1.1rem",letterSpacing:4,marginBottom:10}}>✓ DECODED</p>
              <p style={{color:"#00ffcc",fontFamily:"'Courier Prime'",fontSize:"1rem",letterSpacing:3,marginBottom:14}}>"{CIPHER.answer}"</p>
              <p style={{color:"#668877",fontFamily:"'Crimson Text'",fontSize:"0.95rem",fontStyle:"italic"}}>The thief knew the vault code. Someone was let in — or had it given to them. This changes everything.</p>
              <div style={{marginTop:16}}><Btn onClick={onBack} color="#00cc88">← Return to Manor</Btn></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ACCUSATION ROOM
═══════════════════════════════════════════════════════ */
function AccusationRoom({clues,interrogated,cipherSolved,onAccuse,onBack}){
  const [selected,setSelected]=useState(null);
  const [result,setResult]=useState(null);
  const foundKey=clues.filter(c=>c.found&&c.key).length;
  const ready=foundKey>=5&&interrogated.length>=3&&cipherSolved;

  const accuse=()=>{
    if(!selected)return;
    const correct=selected==="elara";
    setResult(correct?"correct":"wrong");
    if(correct)setTimeout(()=>onAccuse(true),1200);
  };

  return(
    <div style={{minHeight:"100vh",background:"radial-gradient(ellipse at center,#0d0000,#050000)",color:"#d4b896",paddingBottom:60}} className="fi">
      <Scanline/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",borderBottom:"1px solid #200000",background:"rgba(0,0,0,0.7)",position:"sticky",top:0,zIndex:50}}>
        <Btn onClick={onBack} color="#555">← Back</Btn>
        <h2 style={{fontFamily:"'Cinzel'",fontSize:"clamp(1rem,4vw,1.3rem)",color:"#ff4444",letterSpacing:4}}>THE ACCUSATION</h2>
        <span/>
      </div>
      <div style={{maxWidth:720,margin:"0 auto",padding:"28px 20px",textAlign:"center"}}>
        <div style={{display:"inline-block",border:"2px solid #8b0000",color:"#8b0000",padding:"6px 24px",fontFamily:"'Cinzel'",fontSize:"0.9rem",letterSpacing:3,transform:"rotate(-2deg)",marginBottom:20}}>⚖️ MAKE YOUR ACCUSATION</div>
        <h2 style={{fontFamily:"'Cinzel'",fontSize:"clamp(1.5rem,6vw,2.2rem)",color:"#ff4444",letterSpacing:4,textShadow:"0 0 30px #ff000044",marginBottom:8,animation:"flicker 4s infinite"}}>THE FINAL VERDICT</h2>
        <p style={{color:"#556",fontFamily:"'Crimson Text'",fontSize:"1rem",fontStyle:"italic",marginBottom:24}}>Choose wisely. A wrong accusation destroys an innocent life.</p>
        {!ready&&(
          <div style={{background:"rgba(139,105,20,0.07)",border:"1px solid #8b691444",borderRadius:4,padding:16,marginBottom:24}}>
            <p style={{color:"#8b6914",fontFamily:"'Courier Prime'",fontSize:"0.8rem",letterSpacing:1,marginBottom:6}}>⚠ Gather more evidence before accusing.</p>
            <p style={{color:"#555",fontFamily:"'Courier Prime'",fontSize:"0.72rem",letterSpacing:1}}>Key evidence: {foundKey}/5 &nbsp;|&nbsp; Suspects questioned: {interrogated.length}/3 &nbsp;|&nbsp; Cipher: {cipherSolved?"✓":"✗"}</p>
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10,marginBottom:24}}>
          {SUSPECTS.map(s=>(
            <div key={s.id} style={{border:`1px solid ${selected===s.id?"#ff4444":"#222"}`,borderRadius:4,padding:"14px 10px",textAlign:"center",cursor:"pointer",transition:"all .3s",background:selected===s.id?"rgba(255,68,68,0.08)":"rgba(255,255,255,0.01)",transform:selected===s.id?"scale(1.04)":"scale(1)",display:"flex",flexDirection:"column",alignItems:"center",gap:6}} onClick={()=>{setSelected(s.id);setResult(null);}}>
              <span style={{fontSize:32}}>{s.icon}</span>
              <div style={{fontFamily:"'Cinzel'",fontSize:"0.7rem",color:"#c8a050",letterSpacing:1}}>{s.name}</div>
              <div style={{color:"#555",fontFamily:"'Courier Prime'",fontSize:"0.6rem",letterSpacing:1}}>{s.role}</div>
              {selected===s.id&&<div style={{background:"rgba(255,68,68,0.15)",border:"1px solid #ff4444",color:"#ff4444",padding:"2px 10px",fontSize:"0.6rem",fontFamily:"'Courier Prime'",letterSpacing:2,borderRadius:2}}>ACCUSED</div>}
            </div>
          ))}
        </div>
        {selected&&!result&&(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14}} className="fiu">
            <div style={{display:"flex",gap:16,alignItems:"center",justifyContent:"center",flexWrap:"wrap"}}>
              <DetectiveAvatar size={65} expression="determined"/>
              <p style={{fontFamily:"'Crimson Text'",fontSize:"1.05rem",color:"#a89070",fontStyle:"italic",maxWidth:280,lineHeight:1.7}}>"I accuse <strong style={{color:"#ff4444"}}>{SUSPECTS.find(s=>s.id===selected)?.name}</strong> of stealing the Velvet Star."</p>
            </div>
            <Btn onClick={accuse} color="#ff4444">MAKE ACCUSATION →</Btn>
          </div>
        )}
        {result==="wrong"&&(
          <div style={{background:"rgba(255,68,68,0.05)",border:"1px solid #ff444444",borderRadius:4,padding:24}} className="fiu">
            <p style={{color:"#ff4444",fontFamily:"'Cinzel'",fontSize:"1.1rem",letterSpacing:4,marginBottom:8}}>✗ WRONG ACCUSATION</p>
            <p style={{color:"#886666",fontFamily:"'Crimson Text'",fontSize:"0.95rem",fontStyle:"italic",marginBottom:16}}>The evidence doesn't support this conclusion. Look more carefully...</p>
            <Btn onClick={()=>{setSelected(null);setResult(null);}} color="#555">Try Again</Btn>
          </div>
        )}
        {result==="correct"&&(
          <div style={{background:"rgba(0,204,136,0.06)",border:"1px solid #00cc88",borderRadius:4,padding:24}} className="fiu">
            <p style={{color:"#00cc88",fontFamily:"'Cinzel'",fontSize:"1.3rem",letterSpacing:4,marginBottom:8}}>✓ CORRECT!</p>
            <p style={{color:"#66cc88",fontFamily:"'Crimson Text'",fontSize:"1rem",fontStyle:"italic"}}>The evidence all points to her. Case closing...</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VICTORY
═══════════════════════════════════════════════════════ */
function Victory({onFinish}){
  return(
    <div style={{minHeight:"100vh",background:"radial-gradient(ellipse at center,#0a0600,#020100)",paddingBottom:60,display:"flex",justifyContent:"center"}} className="fi">
      <Confetti/><Scanline/>
      <div style={{maxWidth:680,width:"100%",padding:"32px 20px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:20}}>
        <DetectiveAvatar size={140} expression="happy"/>
        <h1 style={{fontFamily:"'Cinzel'",fontSize:"clamp(2rem,8vw,3.5rem)",color:"#ffcc00",letterSpacing:6,textShadow:"0 0 40px #ffcc0088",animation:"glow 2s infinite"}}>CASE CLOSED!</h1>
        <div style={{background:"linear-gradient(135deg,#8b6914,#d4a017)",color:"#0d0a06",padding:"8px 28px",fontFamily:"'Cinzel'",fontSize:"0.9rem",letterSpacing:3,borderRadius:24}}>🏆 MASTER DETECTIVE — AMRITHA</div>
        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid #8b691444",borderRadius:4,padding:"24px 20px",textAlign:"left",width:"100%"}}>
          <p style={{color:"#8b6914",fontFamily:"'Cinzel'",fontSize:"0.8rem",letterSpacing:4,textAlign:"center",marginBottom:14}}>◆ OFFICIAL CASE RESOLUTION ◆</p>
          <p style={{fontFamily:"'Crimson Text'",fontSize:"1.05rem",color:"#d4b896",lineHeight:1.8,marginBottom:18,textAlign:"center"}}><strong style={{color:"#ff4444"}}>Lady Elara Voss</strong> is hereby found guilty of stealing the Velvet Star diamond from Lord Blackwood's vault on the night of March 24th.</p>
          <p style={{color:"#555",fontFamily:"'Courier Prime'",fontSize:"0.7rem",letterSpacing:3,marginBottom:10}}>EVIDENCE THAT BROKE THE CASE:</p>
          {["Missing white glove — matched the one found inside the vault","Initials 'E.V.' — on the handkerchief dropped in the garden","Rose & amber perfume — matched scent on the vault glove","Dried soil on her heel — matched disturbed garden soil","Empty velvet pouch — found hidden in the wine cellar","Burner phone message — 'Done. Meet at east gate at dawn' (11:31 PM)","She alone was temporarily given the vault combination","Cipher decoded: VELVET STAR HUNTER KNEW THE CODE","Butler Thomas saw her near vault corridor at 11:20 PM"].map((e,i)=>(
            <div key={i} style={{display:"flex",gap:10,padding:"6px 0",borderBottom:"1px solid #111"}}>
              <span style={{color:"#8b6914",flexShrink:0}}>✓</span>
              <span style={{color:"#a89070",fontFamily:"'Courier Prime'",fontSize:"0.78rem",letterSpacing:1}}>{e}</span>
            </div>
          ))}
        </div>
        <div style={{background:"linear-gradient(135deg,rgba(139,105,20,0.12),rgba(255,110,196,0.12))",border:"1px solid rgba(255,110,196,0.3)",borderRadius:8,padding:28,textAlign:"center",width:"100%"}}>
          <p style={{fontFamily:"'Cinzel'",fontSize:"clamp(1.2rem,5vw,1.8rem)",color:"#ffcc00",letterSpacing:3,marginBottom:16}}>🎂 HAPPY BIRTHDAY, AMRITHA! 🎂</p>
          <p style={{fontFamily:"'Crimson Text'",fontSize:"1rem",color:"#d4b896",lineHeight:2}}>
            You cracked every cipher, interrogated every suspect,<br/>
            and followed the evidence all the way to the truth.<br/><br/>
            <em style={{color:"#ffcc88"}}>
              "That's who you are — someone who never gives up,<br/>
              who thinks deeper than most, and faces every challenge head on.<br/>
              Wishing you a wonderful birthday filled with joy,<br/>
              great stories, and everything you deserve. 🎂"
            </em>
          </p>
        </div>
        <button style={{padding:"16px 44px",background:"linear-gradient(135deg,#8b6914,#d4a017)",border:"none",color:"#0d0a06",fontFamily:"'Cinzel'",fontSize:"1rem",letterSpacing:3,cursor:"pointer",borderRadius:4,fontWeight:700,animation:"heartbeat 1.5s infinite"}} onClick={onFinish}>
          🎀 Continue to Surprise →
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MANOR MAP HUB
═══════════════════════════════════════════════════════ */
function ManorMap({clues,interrogated,cipherSolved,setView,onFinish}){
  const [showNb,setShowNb]=useState(false);
  const found=clues.filter(c=>c.found).length;
  const total=clues.length;
  return(
    <div style={{minHeight:"100vh",background:"radial-gradient(ellipse at top,#0d0a06,#050302)",color:"#d4b896",position:"relative"}}>
      <style>{G}</style><Rain/><Scanline/>
      {showNb&&<Notebook clues={clues} onClose={()=>setShowNb(false)}/>}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 20px",background:"rgba(0,0,0,0.75)",borderBottom:"1px solid #1a1200",flexWrap:"wrap",gap:10,position:"sticky",top:0,zIndex:500}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <DetectiveAvatar size={46} expression="determined"/>
          <div>
            <p style={{fontFamily:"'Cinzel'",color:"#c8a050",fontSize:"0.85rem",letterSpacing:2}}>Det. Amritha</p>
            <p style={{color:"#444",fontFamily:"'Courier Prime'",fontSize:"0.6rem",letterSpacing:2}}>Case #2503</p>
          </div>
        </div>
        <div style={{display:"flex",gap:18,flexWrap:"wrap"}}>
          {[["CLUES",`${found}/${total}`,"#8b6914"],["SUSPECTS",`${interrogated.length}/${SUSPECTS.length}`,"#8b6914"],["CIPHER",cipherSolved?"✓":"✗",cipherSolved?"#00cc88":"#ff4444"]].map(([l,v,c])=>(
            <div key={l} style={{textAlign:"center"}}>
              <p style={{color:"#444",fontFamily:"'Courier Prime'",fontSize:"0.58rem",letterSpacing:2}}>{l}</p>
              <p style={{color:c,fontFamily:"'Courier Prime'",fontSize:"1rem",letterSpacing:2}}>{v}</p>
            </div>
          ))}
        </div>
        <button style={{background:"rgba(139,105,20,0.1)",border:"1px solid #8b691444",color:"#8b6914",padding:"8px 14px",cursor:"pointer",fontFamily:"'Courier Prime'",fontSize:"0.72rem",letterSpacing:2,borderRadius:2}} onClick={()=>setShowNb(true)}>📓 Notebook</button>
      </div>
      <div style={{maxWidth:760,margin:"0 auto",padding:"24px 20px",paddingBottom:60}}>
        <div style={{textAlign:"center",marginBottom:30}}>
          <h1 style={{fontFamily:"'Cinzel'",fontSize:"clamp(1.5rem,7vw,3rem)",color:"#c8a050",letterSpacing:6,textShadow:"0 0 30px #8b691444",marginBottom:4,animation:"flicker 4s infinite"}}>THE VELVET ENIGMA</h1>
          <p style={{color:"#444",fontFamily:"'Courier Prime'",fontSize:"0.72rem",letterSpacing:3,marginBottom:12}}>Blackwood Manor — March 24, 11:47 PM</p>
          <div style={{width:"100%",maxWidth:380,height:3,background:"#111",borderRadius:2,margin:"0 auto 6px"}}>
            <div style={{width:`${(found/total)*100}%`,height:"100%",background:"linear-gradient(90deg,#8b6914,#d4a017)",borderRadius:2,transition:"width .8s"}}/>
          </div>
          <p style={{color:"#333",fontFamily:"'Courier Prime'",fontSize:"0.68rem",letterSpacing:2}}>{Math.round((found/total)*100)}% investigated</p>
        </div>
        <div style={{marginBottom:28}}>
          <h3 style={{fontFamily:"'Cinzel'",color:"#8b6914",fontSize:"0.82rem",letterSpacing:4,marginBottom:12,textAlign:"center"}}>🏚️ EXPLORE THE MANOR</h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10}}>
            {ROOMS.map(room=>{
              const rc=clues.filter(c=>room.clues.some(x=>x.id===c.id)&&c.found).length;
              const rt=room.clues.length;
              const done=rc===rt;
              return(
                <div key={room.id} style={{border:`1px solid ${done?"#8b6914":"#1a1a1a"}`,borderRadius:4,padding:"14px 10px",textAlign:"center",cursor:"pointer",transition:"all .3s",background:done?"rgba(139,105,20,0.08)":"rgba(255,255,255,0.01)",display:"flex",flexDirection:"column",gap:6,alignItems:"center"}} onClick={()=>setView({type:"room",id:room.id})}>
                  <span style={{fontSize:28}}>{room.icon}</span>
                  <div style={{fontFamily:"'Cinzel'",fontSize:"0.72rem",color:"#c8a050",letterSpacing:1}}>{room.name}</div>
                  <div style={{color:"#444",fontFamily:"'Courier Prime'",fontSize:"0.62rem",letterSpacing:2}}>{rc}/{rt} clues</div>
                  {done&&<div style={{color:"#8b6914",fontFamily:"'Courier Prime'",fontSize:"0.58rem",letterSpacing:2}}>✓ CLEARED</div>}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{marginBottom:28}}>
          <h3 style={{fontFamily:"'Cinzel'",color:"#8b6914",fontSize:"0.82rem",letterSpacing:4,marginBottom:12,textAlign:"center"}}>🎭 INTERROGATE SUSPECTS</h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:10}}>
            {SUSPECTS.map(s=>(
              <div key={s.id} style={{border:`1px solid ${interrogated.includes(s.id)?"#8b6914":"#1a1a1a"}`,borderRadius:4,padding:"12px 8px",textAlign:"center",cursor:"pointer",transition:"all .3s",background:interrogated.includes(s.id)?"rgba(139,105,20,0.06)":"rgba(255,255,255,0.01)",display:"flex",flexDirection:"column",alignItems:"center",gap:4}} onClick={()=>setView({type:"interrogation",id:s.id})}>
                <span style={{fontSize:26}}>{s.icon}</span>
                <div style={{fontFamily:"'Cinzel'",fontSize:"0.68rem",color:"#c8a050",letterSpacing:1}}>{s.name}</div>
                <div style={{color:"#444",fontFamily:"'Courier Prime'",fontSize:"0.58rem",letterSpacing:1}}>{s.role}</div>
                {interrogated.includes(s.id)&&<div style={{color:"#8b6914",fontFamily:"'Courier Prime'",fontSize:"0.58rem",letterSpacing:2}}>QUESTIONED</div>}
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[
            {icon:"🔐",name:"Vault Cipher",sub:"Decode the inscription",color:cipherSolved?"#00cc88":"#00cccc44",type:"cipher",done:cipherSolved},
            {icon:"⚖️",name:"Make Accusation",sub:"Point your finger",color:"#ff444444",type:"accuse",red:true},
          ].map(c=>(
            <div key={c.type} style={{border:`1px solid ${c.color}`,borderRadius:4,padding:"18px 10px",textAlign:"center",cursor:"pointer",transition:"all .3s",background:c.red?"rgba(255,0,0,0.02)":"rgba(255,255,255,0.01)",display:"flex",flexDirection:"column",alignItems:"center",gap:6}} onClick={()=>setView({type:c.type})}>
              <span style={{fontSize:32}}>{c.icon}</span>
              <div style={{fontFamily:"'Cinzel'",fontSize:"0.8rem",color:c.red?"#ff6666":"#c8a050",letterSpacing:2}}>{c.name}</div>
              <div style={{color:"#444",fontFamily:"'Courier Prime'",fontSize:"0.62rem",letterSpacing:1}}>{c.sub}</div>
              {c.done&&<div style={{color:"#00cc88",fontFamily:"'Courier Prime'",fontSize:"0.62rem",letterSpacing:2}}>✓ SOLVED</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   INTRO SCREEN
═══════════════════════════════════════════════════════ */
function IntroScreen({onStart}){
  const [step,setStep]=useState(0);
  const {out,done}=useTypewriter(STORY_PREMISE,28,step===1);
  return(
    <div style={{minHeight:"100vh",background:"radial-gradient(ellipse at center,#0d0a06,#020100)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}} className="fi">
      <style>{G}</style><Rain/><Scanline/>
      {step===0&&(
        <div style={{textAlign:"center",maxWidth:540,width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:12}} className="fiu">
          <p style={{color:"#444",fontFamily:"'Courier Prime'",fontSize:"0.7rem",letterSpacing:5}}>A CRIME THRILLER MYSTERY</p>
          <h1 style={{fontFamily:"'Cinzel'",fontSize:"clamp(2rem,9vw,4rem)",color:"#c8a050",letterSpacing:6,textShadow:"0 0 40px #8b691444",animation:"flicker 4s infinite",lineHeight:1.1}}>THE VELVET<br/>ENIGMA</h1>
          <p style={{color:"#555",fontFamily:"'Crimson Text'",fontSize:"1rem",fontStyle:"italic",letterSpacing:2}}>A Manor Mystery</p>
          <div style={{width:60,height:1,background:"#8b691444"}}/>
          <DetectiveAvatar size={130} expression="determined"/>
          <p style={{color:"#8b6914",fontFamily:"'Courier Prime'",fontSize:"0.7rem",letterSpacing:4}}>DETECTIVE AMRITHA</p>
          <p style={{color:"#444",fontFamily:"'Crimson Text'",fontSize:"0.9rem",fontStyle:"italic"}}>Sharp mind. Calm under pressure. Built for this.</p>
          <div style={{width:60,height:1,background:"#8b691444"}}/>
          <p style={{color:"#333",fontFamily:"'Courier Prime'",fontSize:"0.72rem",letterSpacing:2}}>📍 Blackwood Manor, March 24, 11:47 PM</p>
          <Btn onClick={()=>setStep(1)} style={{marginTop:8,animation:"pulse 2s infinite"}}>BEGIN INVESTIGATION →</Btn>
        </div>
      )}
      {step===1&&(
        <div style={{width:"100%",maxWidth:660}} className="fi">
          <div style={{textAlign:"center",marginBottom:18}}>
            <span style={{display:"inline-block",border:"1px solid #8b691466",color:"#8b6914",padding:"6px 24px",fontFamily:"'Cinzel'",fontSize:"0.8rem",letterSpacing:4}}>CASE BRIEFING</span>
          </div>
          <div style={{background:"rgba(20,14,0,0.95)",border:"1px solid #1a1200",borderRadius:4,padding:"26px 22px",display:"flex",flexDirection:"column",gap:20}}>
            <div style={{display:"flex",gap:16,alignItems:"flex-start",flexWrap:"wrap"}}>
              <DetectiveAvatar size={85} expression="determined"/>
              <pre style={{fontFamily:"'Crimson Text'",fontSize:"1.05rem",color:"#d4b896",lineHeight:1.9,whiteSpace:"pre-wrap",flex:1,minWidth:200,minHeight:80}}>{out}{!done&&<span style={{animation:"flicker .8s infinite"}}>▌</span>}</pre>
            </div>
            {done&&(
              <div style={{display:"flex",flexDirection:"column",gap:18,alignItems:"center"}} className="fiu">
                <div style={{width:"100%",background:"rgba(139,105,20,0.04)",border:"1px solid #1a1200",borderRadius:4,padding:18}}>
                  <p style={{color:"#8b6914",fontFamily:"'Courier Prime'",fontSize:"0.68rem",letterSpacing:4,marginBottom:12,textAlign:"center"}}>HOW TO PLAY</p>
                  {[["🏚️","Explore 5 rooms","Find hidden clues — some are key evidence"],["🎭","Question suspects","Interrogate all 5 — watch for tells"],["🔐","Crack the cipher","Decode the vault wall inscription"],["⚖️","Accuse the culprit","One chance. Evidence must back you up."]].map(([icon,t,d],i)=>(
                    <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:10}}>
                      <span style={{fontSize:18,flexShrink:0}}>{icon}</span>
                      <div>
                        <p style={{color:"#c8a050",fontFamily:"'Courier Prime'",fontSize:"0.78rem",letterSpacing:2,marginBottom:2}}>{t}</p>
                        <p style={{color:"#555",fontFamily:"'Crimson Text'",fontSize:"0.9rem"}}>{d}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Btn onClick={onStart}>ENTER THE MANOR →</Btn>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT GAME CONTROLLER
═══════════════════════════════════════════════════════ */
export default function MysteryGame({onFinish}){
  const [phase,setPhase]=useState("intro");
  const [view,setViewState]=useState(null);
  const [clues,setClues]=useState(ROOMS.flatMap(r=>r.clues.map(c=>({...c,found:false}))));
  const [interrogated,setInterrogated]=useState([]);
  const [cipherSolved,setCipherSolved]=useState(false);

  const setView=(v)=>{setViewState(v);if(v)setPhase(v.type);else setPhase("manor");};

  const findClue=(id)=>setClues(prev=>prev.map(c=>c.id===id?{...c,found:true}:c));
  const completeInt=(id)=>setInterrogated(prev=>prev.includes(id)?prev:[...prev,id]);

  if(phase==="intro")return <IntroScreen onStart={()=>setPhase("manor")}/>;
  if(phase==="victory")return <Victory onFinish={onFinish}/>;

  const room=view?.type==="room"?ROOMS.find(r=>r.id===view.id):null;
  const suspect=view?.type==="interrogation"?SUSPECTS.find(s=>s.id===view.id):null;

  if(phase==="room"&&room)return <RoomExplorer room={room} allClues={clues} onFindClue={findClue} onBack={()=>setView(null)}/>;
  if(phase==="interrogation"&&suspect)return <Interrogation suspect={suspect} onBack={()=>setView(null)} onComplete={completeInt} completed={interrogated.includes(suspect.id)}/>;
  if(phase==="cipher")return <CipherPuzzle onSolve={()=>setCipherSolved(true)} solved={cipherSolved} onBack={()=>setView(null)}/>;
  if(phase==="accuse")return <AccusationRoom clues={clues} interrogated={interrogated} cipherSolved={cipherSolved} onAccuse={(c)=>{if(c)setPhase("victory");}} onBack={()=>setView(null)}/>;

  return <ManorMap clues={clues} interrogated={interrogated} cipherSolved={cipherSolved} setView={setView} onFinish={onFinish}/>;
}
