import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════
   DESIGN SYSTEM — Hogwarts Legacy Inspired
   Dark atmospheric, deep fog, warm gold, epic scale
═══════════════════════════════════════════════════ */
export const T = {
  bg:     "#080608",
  dark:   "#0a0810",
  gold:   "#c9a256",
  goldBr: "#e8c97a",
  goldDm: "#6b5520",
  mist:   "rgba(180,175,210,0.06)",
  silver: "rgba(220,215,235,0.75)",
  silverDm:"rgba(180,175,200,0.45)",
  crimson:"rgba(160,40,40,0.9)",
  parch:  "rgba(230,210,170,0.82)",
  parchDm:"rgba(190,170,130,0.6)",
};

export const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=IM+Fell+English:ital@0;1&display=swap');`;

export const G = `
${FONTS}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{width:100%;min-height:100vh;background:#080608;overflow-x:hidden;}
::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-track{background:#080608;}
::-webkit-scrollbar-thumb{background:rgba(201,162,86,.3);border-radius:2px;}

@keyframes fadeIn    {from{opacity:0}to{opacity:1}}
@keyframes fadeUp    {from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
@keyframes breathe   {0%,100%{opacity:.65}50%{opacity:1}}
@keyframes shimmer   {0%{background-position:200% center}100%{background-position:-200% center}}
@keyframes fogDrift  {0%{transform:translateX(0) scaleX(1)}100%{transform:translateX(-60px) scaleX(1.08)}}
@keyframes fogDrift2 {0%{transform:translateX(0)}100%{transform:translateX(60px)}}
@keyframes particleUp{0%{transform:translateY(0) translateX(0);opacity:0}8%{opacity:.7}88%{opacity:.3}100%{transform:translateY(-90vh) translateX(20px);opacity:0}}
@keyframes goldGlow  {0%,100%{text-shadow:0 0 20px rgba(201,162,86,.2)}50%{text-shadow:0 0 50px rgba(201,162,86,.6),0 0 100px rgba(201,162,86,.2)}}
@keyframes lightRay  {0%,100%{opacity:0}50%{opacity:1}}
@keyframes panSlow   {0%{transform:scale(1.04) translateX(0)}100%{transform:scale(1.04) translateX(-2%)}}
@keyframes runeRotate{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes orbPulse  {0%,100%{transform:scale(1);opacity:.4}50%{transform:scale(1.15);opacity:.7}}
@keyframes borderPulse{0%,100%{border-color:rgba(201,162,86,.18)}50%{border-color:rgba(201,162,86,.45)}}
@keyframes stampIn   {0%{transform:scale(3.5) rotate(-14deg);opacity:0}65%{transform:scale(.95) rotate(-6deg)}100%{transform:scale(1) rotate(-6deg);opacity:1}}
@keyframes confettiFall{0%{transform:translateY(-40px) rotate(0);opacity:1}100%{transform:translateY(110vh) rotate(600deg);opacity:0}}
@keyframes alertUp   {from{opacity:0;transform:translateY(24px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes countFlip {from{transform:rotateX(-30deg);opacity:.4}to{transform:rotateX(0);opacity:1}}
@keyframes lightning {0%,86%,100%{opacity:0}88%,94%{opacity:.08}91%,97%{opacity:0}}
@keyframes warpIn    {0%{clip-path:inset(0 100% 0 0);opacity:0}100%{clip-path:inset(0 0 0 0);opacity:1}}

.fi  {animation:fadeIn .8s ease forwards}
.fiu {animation:fadeUp .9s ease forwards}
.glow{animation:goldGlow 3s ease-in-out infinite}
.breathe{animation:breathe 4s ease-in-out infinite}
button:not([disabled]):hover{filter:brightness(1.18)!important;transform:translateY(-2px)!important;}
`;

/* ═══════════════════════════════════════════════════
   CANVAS — Magical floating particles (fireflies/embers)
═══════════════════════════════════════════════════ */
export function MagicDust({ count = 60, color = "#c9a256" }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let W = c.width = window.innerWidth;
    let H = c.height = window.innerHeight;
    const onResize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: H * 0.3 + Math.random() * H * 0.7,
      vx: (Math.random() - .5) * .35, vy: -(0.15 + Math.random() * .45),
      r: 0.6 + Math.random() * 1.6, a: Math.random(), da: (Math.random() > .5 ? 1 : -1) * .006,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy; p.a += p.da;
        if (p.a > .85 || p.a < .05) p.da *= -1;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        ctx.save();
        ctx.globalAlpha = p.a * .65;
        ctx.shadowBlur = 8; ctx.shadowColor = color;
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:2, opacity:.8 }}/>;
}

/* ═══════════════════════════════════════════════════
   CINEMATIC CASTLE — Deep, layered, atmospheric
   Inspired by Hogwarts Legacy — no flat colors, depth
═══════════════════════════════════════════════════ */
export function CinematicScene() {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:0, overflow:"hidden" }}>
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice"
        style={{ position:"absolute", inset:0, width:"100%", height:"100%", animation:"panSlow 30s ease-in-out infinite alternate" }}>
        <defs>
          {/* Sky gradient — dark atmospheric */}
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#060409"/>
            <stop offset="35%"  stopColor="#0a0812"/>
            <stop offset="70%"  stopColor="#0c0a14"/>
            <stop offset="100%" stopColor="#100e1a"/>
          </linearGradient>
          {/* Far mist */}
          <radialGradient id="mistCenter" cx="50%" cy="85%" r="60%">
            <stop offset="0%"   stopColor="#b8b0d8" stopOpacity=".12"/>
            <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
          </radialGradient>
          {/* Castle stone */}
          <linearGradient id="stoneA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#18152a"/>
            <stop offset="100%" stopColor="#0d0b16"/>
          </linearGradient>
          <linearGradient id="stoneB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#1a1730"/>
            <stop offset="100%" stopColor="#0e0c1a"/>
          </linearGradient>
          <linearGradient id="stoneDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#141128"/>
            <stop offset="100%" stopColor="#08070f"/>
          </linearGradient>
          {/* Tower cap gradient */}
          <linearGradient id="towerCap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#201d38"/>
            <stop offset="100%" stopColor="#0e0c1a"/>
          </linearGradient>
          {/* Window warm glow */}
          <radialGradient id="winWarm" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#e8a030" stopOpacity=".9"/>
            <stop offset="60%"  stopColor="#c07010" stopOpacity=".5"/>
            <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="winCool" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#a0c8ff" stopOpacity=".6"/>
            <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
          </radialGradient>
          {/* Atmospheric glow around castle */}
          <radialGradient id="castleAura" cx="50%" cy="70%" r="45%">
            <stop offset="0%"   stopColor="#c9a256" stopOpacity=".07"/>
            <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="sunray" cx="62%" cy="20%" r="55%">
            <stop offset="0%"   stopColor="#e8c060" stopOpacity=".12"/>
            <stop offset="60%"  stopColor="#c09040" stopOpacity=".04"/>
            <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
          </radialGradient>
          {/* Fog layers */}
          <linearGradient id="fogBase" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#d0c8f0" stopOpacity="0"/>
            <stop offset="100%" stopColor="#d0c8f0" stopOpacity=".14"/>
          </linearGradient>
          {/* Window glow filter */}
          <filter id="winGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="softBlur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.5"/>
          </filter>
          <filter id="castleFilter" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation="0.4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Sky */}
        <rect width="1440" height="900" fill="url(#sky)"/>
        {/* Atmospheric sun ray (top right, subtle) */}
        <rect width="1440" height="900" fill="url(#sunray)" opacity=".6"/>

        {/* Stars — tiny points */}
        {[
          [120,60],[200,40],[350,80],[80,110],[450,30],[600,55],[750,35],[900,70],[1050,45],[1200,80],[1380,50],
          [160,145],[310,120],[500,130],[680,100],[850,125],[1100,110],[1320,140],[1420,90],
          [240,190],[420,170],[560,200],[720,165],[960,180],[1160,195],[1290,160],
        ].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={.8+Math.random()} fill="white" opacity={.2+i%5*.07}
            style={{ animation:`breathe ${2+i%4}s ${i*.3}s ease-in-out infinite` }}/>
        ))}

        {/* Castle ambient aura */}
        <ellipse cx="720" cy="620" rx="680" ry="180" fill="url(#castleAura)"/>

        {/* ── FAR MOUNTAINS (deepest layer) ── */}
        <path d="M0,520 L100,420 L180,470 L280,380 L380,440 L480,360 L580,420 L680,350 L780,410 L880,355 L980,415 L1080,360 L1180,415 L1280,370 L1380,430 L1440,400 L1440,900 L0,900Z"
          fill="#0c0a18" opacity=".9"/>
        <path d="M0,560 L120,480 L240,520 L360,460 L480,510 L600,455 L720,500 L840,452 L960,498 L1080,455 L1200,498 L1320,462 L1440,492 L1440,900 L0,900Z"
          fill="#0e0c1c" opacity=".95"/>

        {/* ── VIADUCT / BRIDGE (left) ── */}
        <rect x="60" y="540" width="220" height="20" fill="#12101e" rx="2"/>
        {[75,100,125,150,175,200,225,250].map((x,i)=>(
          <rect key={i} x={x} y="528" width="14" height="34" fill="#100e1c" rx="1"/>
        ))}
        {[82,107,132,157,182,207,232].map((x,i)=>(
          <path key={i} d={`M${x},542 Q${x+8},555 ${x+16},542`} fill="#0a0812"/>
        ))}
        {/* Viaduct side detail */}
        <rect x="60" y="540" width="220" height="3" fill="#1e1a32" opacity=".8"/>

        {/* ── LEFT WING BUILDINGS ── */}
        {/* Far left small tower */}
        <rect x="160" y="390" width="40" height="200" fill="url(#stoneDark)" rx="1"/>
        <polygon points="140,390 180,320 220,390" fill="#12101e"/>
        <line x1="180" y1="320" x2="180" y2="295" stroke="#3a2a10" strokeWidth="2"/>
        <polygon points="180,295 195,305 180,315" fill="#8b1a1a" opacity=".8"/>
        {/* Small windows */}
        {[[168,420],[168,455],[168,490]].map(([x,y],i)=>(
          <rect key={i} x={x} y={y} width={8} height={12} rx={4} fill="url(#winWarm)" filter="url(#winGlow)" opacity={.5+i*.1}/>
        ))}
        {/* Left main wing */}
        <rect x="220" y="440" width="100" height="190" fill="url(#stoneA)" rx="1"/>
        {[0,1,2,3,4,5,6].map(i=><rect key={i} x={220+i*16} y="432" width="10" height="14" rx="1" fill="#0e0c1a"/>)}
        {[[232,465],[260,465],[288,465],[232,500],[260,500],[288,500]].map(([x,y],i)=>(
          <rect key={i} x={x} y={y} width={9} height={13} rx={4.5} fill="url(#winWarm)" filter="url(#winGlow)" opacity={.45+i*.04}/>
        ))}

        {/* Left main tower */}
        <rect x="330" y="310" width="55" height="330" fill="url(#stoneB)" rx="1"/>
        {[0,1,2,3].map(i=><rect key={i} x={328+i*16} y="300" width="11" height="16" rx="1" fill="#0c0a18"/>)}
        <polygon points="308,310 357,230 406,310" fill="url(#towerCap)"/>
        <line x1="357" y1="230" x2="357" y2="205" stroke="#3a2a10" strokeWidth="2"/>
        <polygon points="357,205 375,215 357,225" fill="#1a2a6b" opacity=".9"/>
        {[[340,338],[362,338],[340,375],[362,375],[340,412],[362,412],[340,449],[362,449]].map(([x,y],i)=>(
          <rect key={i} x={x} y={y} width={9} height={13} rx={4.5} fill="url(#winWarm)" filter="url(#winGlow)" opacity={.5+i*.02}/>
        ))}
        {/* Stone texture lines */}
        {[350,385,420,455,490].map((y,i)=>(
          <line key={i} x1="330" y1={y} x2="385" y2={y} stroke="#ffffff" strokeWidth=".4" opacity=".04"/>
        ))}

        {/* ── CENTRAL GRAND SECTION ── */}
        {/* Main castle body */}
        <rect x="385" y="380" width="670" height="290" fill="url(#stoneA)" rx="1"/>
        {/* Battlements */}
        {Array.from({length:34},(_,i)=>(
          <rect key={i} x={385+i*20} y="368" width="12" height="18" rx="1" fill="#0e0c1a"/>
        ))}
        {/* Body windows — rows */}
        {[
          [405,408],[435,408],[465,408],[495,408],[525,408],[555,408],[585,408],[615,408],[645,408],[675,408],[705,408],[735,408],[765,408],[795,408],[825,408],[855,408],[885,408],[915,408],[945,408],[975,408],[1005,408],[1035,408],
          [405,450],[455,450],[505,450],[555,450],[605,450],[655,450],[705,450],[755,450],[805,450],[855,450],[905,450],[955,450],[1005,450],[1035,450],
          [420,492],[480,492],[540,492],[600,492],[660,492],[720,492],[780,492],[840,492],[900,492],[960,492],[1020,492],
          [435,534],[510,534],[585,534],[660,534],[735,534],[810,534],[885,534],[960,534],
        ].map(([x,y],i)=>(
          <rect key={i} x={x} y={y} width={10} height={14} rx={5}
            fill={i%3===0?"url(#winWarm)":i%3===1?"url(#winCool)":"url(#winWarm)"}
            filter="url(#winGlow)"
            opacity={.38+((i*7)%9)*.05}
          />
        ))}

        {/* GRAND CENTRAL TOWER */}
        <rect x="668" y="195" width="104" height="340" fill="url(#stoneB)" rx="1"/>
        {Array.from({length:8},(_,i)=>(
          <rect key={i} x={666+i*14} y="182" width="10" height="18" rx="1" fill="#0c0a18"/>
        ))}
        <polygon points="645,195 720,105 795,195" fill="url(#towerCap)"/>
        <line x1="720" y1="105" x2="720" y2="78" stroke="#3a2a10" strokeWidth="2.5"/>
        <polygon points="720,78 742,90 720,102" fill="#1a2a6b" opacity=".9"/>
        {/* Grand tower rose window */}
        <circle cx="720" cy="238" r="18" fill="none" stroke="rgba(201,162,86,.25)" strokeWidth="1"/>
        <circle cx="720" cy="238" r="12" fill="#d08020" opacity=".18" filter="url(#winGlow)"/>
        <circle cx="720" cy="238" r="6"  fill="#e09030" opacity=".25" filter="url(#winGlow)"/>
        {[0,45,90,135].map((a,i)=>(
          <line key={i}
            x1={720+Math.cos(a*Math.PI/180)*6} y1={238+Math.sin(a*Math.PI/180)*6}
            x2={720+Math.cos(a*Math.PI/180)*16} y2={238+Math.sin(a*Math.PI/180)*16}
            stroke="rgba(201,162,86,.2)" strokeWidth=".8"/>
        ))}
        {/* Grand tower windows */}
        {[[685,270],[715,270],[685,310],[715,310],[685,350],[715,350],[685,390],[715,390],[685,430],[715,430],[685,470],[715,470]].map(([x,y],i)=>(
          <rect key={i} x={x} y={y} width={11} height={15} rx={5.5}
            fill={i%2===0?"url(#winWarm)":"url(#winCool)"} filter="url(#winGlow)" opacity={.55+i*.02}/>
        ))}
        {/* Grand tower stone texture */}
        {[240,280,320,360,400,440,480].map((y,i)=>(
          <line key={i} x1="668" y1={y} x2="772" y2={y} stroke="#fff" strokeWidth=".35" opacity=".04"/>
        ))}

        {/* Left of grand tower — secondary tower */}
        <rect x="540" y="260" width="70" height="300" fill="url(#stoneA)" rx="1"/>
        {Array.from({length:5},(_,i)=><rect key={i} x={538+i*15} y="250" width="10" height="15" rx="1" fill="#0c0a18"/>)}
        <polygon points="522,260 575,188 628,260" fill="url(#towerCap)"/>
        <line x1="575" y1="188" x2="575" y2="165" stroke="#3a2a10" strokeWidth="2"/>
        <polygon points="575,165 590,174 575,183" fill="#8b1a1a" opacity=".8"/>
        {[[550,285],[568,285],[550,320],[568,320],[550,355],[568,355],[550,390],[568,390]].map(([x,y],i)=>(
          <rect key={i} x={x} y={y} width={9} height={13} rx={4.5} fill="url(#winWarm)" filter="url(#winGlow)" opacity={.48+i*.02}/>
        ))}

        {/* Right of grand tower — secondary tower */}
        <rect x="830" y="265" width="70" height="300" fill="url(#stoneA)" rx="1"/>
        {Array.from({length:5},(_,i)=><rect key={i} x={828+i*15} y="255" width="10" height="14" rx="1" fill="#0c0a18"/>)}
        <polygon points="812,265 865,190 918,265" fill="url(#towerCap)"/>
        <line x1="865" y1="190" x2="865" y2="165" stroke="#3a2a10" strokeWidth="2"/>
        <polygon points="865,165 880,175 865,185" fill="#2a6b1a" opacity=".8"/>
        {[[840,290],[858,290],[840,325],[858,325],[840,360],[858,360],[840,395],[858,395]].map(([x,y],i)=>(
          <rect key={i} x={x} y={y} width={9} height={13} rx={4.5} fill="url(#winWarm)" filter="url(#winGlow)" opacity={.48+i*.02}/>
        ))}

        {/* ── RIGHT WING ── */}
        <rect x="1055" y="420" width="130" height="250" fill="url(#stoneA)" rx="1"/>
        {Array.from({length:8},(_,i)=><rect key={i} x={1053+i*18} y="410" width="11" height="14" rx="1" fill="#0c0a18"/>)}
        {[[1070,448],[1100,448],[1130,448],[1070,485],[1100,485],[1130,485],[1070,522],[1100,522],[1130,522]].map(([x,y],i)=>(
          <rect key={i} x={x} y={y} width={9} height={13} rx={4.5} fill="url(#winWarm)" filter="url(#winGlow)" opacity={.42+i*.04}/>
        ))}

        {/* Astronomy Tower */}
        <rect x="1100" y="265" width="44" height="390" fill="url(#stoneDark)" rx="1"/>
        {[1098,1110,1122,1134].map((x,i)=><rect key={i} x={x} y="254" width="11" height="16" rx="1" fill="#0c0a18"/>)}
        <polygon points="1082,265 1122,175 1162,265" fill="url(#towerCap)"/>
        <line x1="1122" y1="175" x2="1122" y2="148" stroke="#3a2a10" strokeWidth="2"/>
        <polygon points="1122,148 1140,158 1122,168" fill="#8b1a1a" opacity=".85"/>
        {[[1107,295],[1122,295],[1107,330],[1122,330],[1107,365],[1122,365],[1107,400],[1122,400],[1107,435],[1122,435],[1107,470],[1122,470],[1107,505],[1122,505],[1107,540],[1122,540]].map(([x,y],i)=>(
          <rect key={i} x={x} y={y} width={8} height={11} rx={4}
            fill={i%3===0?"url(#winCool)":"url(#winWarm)"} filter="url(#winGlow)" opacity={.5+i*.01}/>
        ))}

        {/* Far right tower */}
        <rect x="1230" y="370" width="36" height="280" fill="url(#stoneDark)" rx="1"/>
        {[1228,1238,1248].map((x,i)=><rect key={i} x={x} y="360" width="10" height="14" rx="1" fill="#0c0a18"/>)}
        <polygon points="1214,370 1248,308 1282,370" fill="url(#towerCap)"/>
        {[[1234,395],[1248,395],[1234,428],[1248,428],[1234,461],[1248,461]].map(([x,y],i)=>(
          <rect key={i} x={x} y={y} width={8} height={11} rx={4} fill="url(#winWarm)" filter="url(#winGlow)" opacity={.45+i*.04}/>
        ))}

        {/* ── BLACK LAKE — reflective, moody ── */}
        <ellipse cx="720" cy="800" rx="720" ry="80" fill="#060410" opacity=".95"/>
        <ellipse cx="720" cy="795" rx="580" ry="55" fill="#080618" opacity=".8"/>
        {/* Lake surface shimmer */}
        <ellipse cx="720" cy="790" rx="450" ry="28" fill="none" stroke="rgba(180,175,220,.06)" strokeWidth="1"/>
        <ellipse cx="720" cy="788" rx="300" ry="18" fill="none" stroke="rgba(201,162,86,.05)" strokeWidth=".8"/>
        {/* Window reflections on lake */}
        {[[580,802],[620,806],[660,808],[700,804],[740,804],[780,806],[820,808],[860,804]].map(([x,y],i)=>(
          <ellipse key={i} cx={x} cy={y} rx={2.5} ry={1.2} fill="#c9a040" opacity={.08+i*.005}/>
        ))}
        {/* Lake dark base */}
        <rect x="0" y="820" width="1440" height="80" fill="#050408"/>

        {/* ── FOG / MIST LAYERS (front, thick) ── */}
        {/* Base ground mist */}
        <ellipse cx="720" cy="760" rx="900" ry="140" fill="#c8c0e8" opacity=".09"
          style={{ animation:"fogDrift 22s ease-in-out infinite alternate", transformOrigin:"720px 760px" }}/>
        <ellipse cx="720" cy="740" rx="750" ry="100" fill="#d0c8f0" opacity=".07"
          style={{ animation:"fogDrift2 18s ease-in-out infinite alternate", transformOrigin:"720px 740px" }}/>
        <ellipse cx="400" cy="700" rx="500" ry="80" fill="#c8c0e8" opacity=".08"
          style={{ animation:"fogDrift 28s ease-in-out infinite alternate", transformOrigin:"400px 700px" }}/>
        <ellipse cx="1100" cy="710" rx="480" ry="75" fill="#d0c8f8" opacity=".07"
          style={{ animation:"fogDrift2 24s ease-in-out infinite alternate", transformOrigin:"1100px 710px" }}/>
        {/* Mid-castle mist */}
        <ellipse cx="720" cy="620" rx="800" ry="90" fill="#b8b0d8" opacity=".06"
          style={{ animation:"fogDrift 32s ease-in-out infinite alternate" }}/>
        {/* Central mist radiating */}
        <ellipse cx="720" cy="680" rx="900" ry="100" fill="url(#mistCenter)"/>

        {/* ── FORBIDDEN FOREST (left) ── silhouetted, layered ── */}
        <path d="M0,680 L0,480 L22,440 L40,465 L60,418 L78,448 L96,410 L115,445 L132,415 L150,450 L168,422 L185,460 L202,432 L218,468 L234,440 L248,478 L262,455 L278,490 L290,680Z"
          fill="#06040c" opacity=".98"/>
        <path d="M0,700 L0,508 L18,475 L34,498 L50,460 L66,485 L82,452 L98,478 L114,448 L130,472 L146,445 L162,470 L178,450 L194,478 L210,460 L226,488 L240,470 L255,498 L268,700Z"
          fill="#050309" opacity="1"/>
        {/* Forest depth — even darker front layer */}
        <path d="M0,720 L0,540 L12,518 L24,535 L38,510 L52,530 L66,508 L80,528 L95,512 L108,534 L122,515 L138,540 L152,520 L165,720Z"
          fill="#030207" opacity="1"/>

        {/* ── FORBIDDEN FOREST (right) ── */}
        <path d="M1440,680 L1440,480 L1418,440 L1400,465 L1380,418 L1362,448 L1344,410 L1325,445 L1308,415 L1290,450 L1272,422 L1255,460 L1238,432 L1222,468 L1206,440 L1192,478 L1178,455 L1162,490 L1150,680Z"
          fill="#06040c" opacity=".98"/>
        <path d="M1440,700 L1440,508 L1422,475 L1406,498 L1390,460 L1374,485 L1358,452 L1342,478 L1326,448 L1310,472 L1294,445 L1278,470 L1262,450 L1246,478 L1230,460 L1214,488 L1200,470 L1185,498 L1172,700Z"
          fill="#050309" opacity="1"/>
        <path d="M1440,720 L1440,540 L1428,518 L1416,535 L1402,510 L1388,530 L1374,508 L1360,528 L1345,512 L1332,534 L1318,515 L1302,540 L1288,520 L1275,720Z"
          fill="#030207" opacity="1"/>

        {/* ── ATMOSPHERIC LIGHT RAYS (subtle, top right) ── */}
        {[0,1,2,3].map(i=>(
          <line key={i}
            x1={1050+i*40} y1={0}
            x2={480+i*30}  y2={900}
            stroke="rgba(220,190,100,.025)"
            strokeWidth={60+i*20}
            style={{ animation:`lightRay ${6+i*2}s ${i*1.5}s ease-in-out infinite` }}
          />
        ))}

        {/* Ground dark fade */}
        <rect x="0" y="840" width="1440" height="60" fill="#030207"/>
        {/* Vignette edges */}
        <rect x="0" y="0" width="140" height="900" fill="url(#leftVig)" opacity=".6"/>
        <rect x="1300" y="0" width="140" height="900" fill="url(#rightVig)" opacity=".6"/>
        <defs>
          <linearGradient id="leftVig"  x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#060409" stopOpacity="1"/><stop offset="100%" stopColor="transparent" stopOpacity="0"/></linearGradient>
          <linearGradient id="rightVig" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="transparent" stopOpacity="0"/><stop offset="100%" stopColor="#060409" stopOpacity="1"/></linearGradient>
        </defs>
        {/* Top vignette */}
        <rect x="0" y="0" width="1440" height="80">
          <animate attributeName="opacity" values=".8;.9;.8" dur="8s" repeatCount="indefinite"/>
        </rect>
        <defs>
          <linearGradient id="topVig" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#060409" stopOpacity="1"/><stop offset="100%" stopColor="transparent" stopOpacity="0"/></linearGradient>
        </defs>
        <rect x="0" y="0" width="1440" height="80" fill="url(#topVig)"/>
      </svg>

      {/* Lightning flash layer */}
      <div style={{ position:"absolute", inset:0, background:"rgba(180,200,255,.05)", animation:"lightning 9s infinite", pointerEvents:"none" }}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FOG OVERLAY — layered CSS fog bands
═══════════════════════════════════════════════════ */
export function FogOverlay() {
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:3, overflow:"hidden" }}>
      {[
        { bottom:"0%",   h:"45%", op:.7,  dur:"20s", del:"0s",   color:"rgba(140,132,185,.1)" },
        { bottom:"12%",  h:"30%", op:.5,  dur:"26s", del:"-8s",  color:"rgba(160,152,205,.08)" },
        { bottom:"25%",  h:"22%", op:.35, dur:"32s", del:"-15s", color:"rgba(150,145,195,.06)" },
        { bottom:"40%",  h:"16%", op:.2,  dur:"38s", del:"-22s", color:"rgba(140,135,185,.04)" },
      ].map((f,i)=>(
        <div key={i} style={{
          position:"absolute", left:"-8%", right:"-8%", bottom:f.bottom, height:f.h,
          background:`radial-gradient(ellipse at 50% 100%,${f.color} 0%,transparent 70%)`,
          opacity:f.op, filter:"blur(24px)",
          animation:`${i%2===0?"fogDrift":"fogDrift2"} ${f.dur} ${f.del} ease-in-out infinite alternate`,
        }}/>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   DECORATIVE RUNE RING
═══════════════════════════════════════════════════ */
export function RuneRing({ size = 120 }) {
  const RUNES = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗ";
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        style={{ position:"absolute", inset:0, animation:"runeRotate 28s linear infinite" }}>
        <circle cx={size/2} cy={size/2} r={size/2-4} fill="none" stroke="rgba(201,162,86,.14)" strokeWidth="1"/>
        {Array.from({length:16},(_,i)=>{
          const a = (i/16)*Math.PI*2;
          const r = size/2-10;
          return (
            <text key={i}
              x={size/2 + Math.cos(a)*r} y={size/2 + Math.sin(a)*r}
              textAnchor="middle" dominantBaseline="middle"
              fill="rgba(201,162,86,.35)" fontSize={size/14}
              fontFamily="serif"
              transform={`rotate(${i*(360/16)},${size/2+Math.cos(a)*r},${size/2+Math.sin(a)*r})`}
            >{RUNES[i%RUNES.length]}</text>
          );
        })}
        <circle cx={size/2} cy={size/2} r={size/2-20} fill="none" stroke="rgba(201,162,86,.07)" strokeWidth=".8"/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ color:T.gold, fontSize:size*.32, lineHeight:1, filter:`drop-shadow(0 0 ${size*.1}px rgba(201,162,86,.6))`, animation:"breathe 3s ease-in-out infinite" }}>⚡</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CINEMATIC CARD — glass morphism, dark luxury
═══════════════════════════════════════════════════ */
export function Card({ children, style={}, glow=false }) {
  return (
    <div style={{
      width:"100%",
      background:"linear-gradient(145deg,rgba(20,16,32,.96),rgba(14,12,24,.98))",
      border:`1px solid ${glow?"rgba(201,162,86,.38)":"rgba(201,162,86,.14)"}`,
      borderRadius:2,
      padding:"26px 24px",
      backdropFilter:"blur(20px)",
      boxShadow: glow
        ? "0 0 60px rgba(201,162,86,.1),0 30px 80px rgba(0,0,0,.7),inset 0 1px 0 rgba(201,162,86,.12)"
        : "0 20px 60px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.04)",
      animation: glow ? "borderPulse 4s ease-in-out infinite" : "none",
      position:"relative",
      overflow:"hidden",
      ...style,
    }}>
      <div style={{ position:"absolute",top:10,left:12,color:"rgba(201,162,86,.2)",fontSize:9,lineHeight:1,fontFamily:"serif" }}>✦</div>
      <div style={{ position:"absolute",top:10,right:12,color:"rgba(201,162,86,.2)",fontSize:9,lineHeight:1,fontFamily:"serif" }}>✦</div>
      <div style={{ position:"absolute",bottom:10,left:12,color:"rgba(201,162,86,.2)",fontSize:9,lineHeight:1,fontFamily:"serif" }}>✦</div>
      <div style={{ position:"absolute",bottom:10,right:12,color:"rgba(201,162,86,.2)",fontSize:9,lineHeight:1,fontFamily:"serif" }}>✦</div>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   GOLD RULE
═══════════════════════════════════════════════════ */
export function Rule({ style={} }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, width:"100%", ...style }}>
      <div style={{ flex:1, height:1, background:"linear-gradient(90deg,transparent,rgba(201,162,86,.28))" }}/>
      <span style={{ color:"rgba(201,162,86,.4)", fontSize:9, fontFamily:"serif", flexShrink:0 }}>✦</span>
      <div style={{ flex:1, height:1, background:"linear-gradient(90deg,rgba(201,162,86,.28),transparent)" }}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SECTION HEADING
═══════════════════════════════════════════════════ */
export function Heading({ children, sub, eyebrow, size="clamp(1.5rem,5.5vw,2.4rem)", align="center" }) {
  return (
    <div style={{ textAlign:align }}>
      {eyebrow && <p style={{ fontFamily:"'Cinzel',serif", fontSize:".58rem", letterSpacing:".55em", color:T.goldDm, marginBottom:12, textTransform:"uppercase" }}>{eyebrow}</p>}
      <h2 className="glow" style={{ fontFamily:"'Cinzel',serif", fontSize:size, color:T.gold, letterSpacing:".06em", lineHeight:1.18, fontWeight:600, textShadow:"0 2px 4px rgba(0,0,0,.8)" }}>{children}</h2>
      {sub && <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(.95rem,3vw,1.15rem)", color:T.silver, letterSpacing:".1em", marginTop:10, fontStyle:"italic", opacity:.75 }}>{sub}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   BUTTON
═══════════════════════════════════════════════════ */
export function Btn({ children, onClick, variant="gold", disabled=false, style={} }) {
  const V = {
    gold:    { bg:"linear-gradient(135deg,rgba(30,22,8,.95),rgba(22,16,6,.95))", b:"rgba(201,162,86,.55)", c:T.gold,   sh:"rgba(201,162,86,.18)" },
    crimson: { bg:"linear-gradient(135deg,rgba(28,8,8,.95),rgba(18,6,6,.95))",  b:"rgba(160,40,40,.6)",  c:"rgba(200,80,80,.9)", sh:"rgba(160,40,40,.2)" },
    ghost:   { bg:"rgba(255,255,255,.03)", b:"rgba(255,255,255,.08)", c:"rgba(200,195,220,.5)", sh:"transparent" },
    emerald: { bg:"linear-gradient(135deg,rgba(8,22,12,.95),rgba(6,16,8,.95))", b:"rgba(40,120,60,.6)", c:"rgba(80,180,100,.9)", sh:"rgba(40,120,60,.15)" },
  };
  const v = V[variant]||V.gold;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding:"15px 40px",
      background: disabled?"rgba(255,255,255,.03)":v.bg,
      border:`1px solid ${disabled?"rgba(255,255,255,.06)":v.b}`,
      color: disabled?"rgba(200,195,220,.2)":v.c,
      fontFamily:"'Cinzel',serif", fontSize:".82rem", letterSpacing:".2em",
      cursor:disabled?"default":"pointer", borderRadius:2,
      boxShadow:disabled?"none":`0 0 24px ${v.sh},inset 0 1px 0 rgba(255,255,255,.06)`,
      transition:"all .4s cubic-bezier(.23,1,.32,1)",
      ...style,
    }}>{children}</button>
  );
}

/* ═══════════════════════════════════════════════════
   SPELL TRANSITION
═══════════════════════════════════════════════════ */
export function SpellTrans({ label="", onDone }) {
  useEffect(()=>{ const t=setTimeout(onDone,2600); return()=>clearTimeout(t); },[]);
  return (
    <div style={{ position:"fixed",inset:0,background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:999 }} className="fi">
      <style>{G}</style>
      <MagicDust count={50}/>
      <div style={{ position:"relative",zIndex:10,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:20 }}>
        <RuneRing size={110}/>
        <p style={{ fontFamily:"'Cinzel',serif",color:T.gold,fontSize:"clamp(.85rem,3.5vw,1.1rem)",letterSpacing:".4em",animation:"breathe 2s ease-in-out infinite" }}>{label}</p>
        <Rule style={{ maxWidth:220 }}/>
        <p style={{ fontFamily:"'Cormorant Garamond',serif",color:T.goldDm,fontSize:".9rem",letterSpacing:".15em",fontStyle:"italic" }}>The next chapter unfolds...</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CONFETTI
═══════════════════════════════════════════════════ */
export function Confetti() {
  const p=Array.from({length:55},(_,i)=>({ id:i,left:`${Math.random()*100}%`,color:["#c9a256","#8b1a1a","#1a4a2a","#e8c97a","#b8b8c8"][i%5],size:`${4+Math.random()*7}px`,delay:`${Math.random()*2}s`,dur:`${3+Math.random()*2}s`,br:i%4===0?"50%":"1px" }));
  return <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:990}}>{p.map(c=><div key={c.id} style={{position:"absolute",top:"-30px",left:c.left,width:c.size,height:c.size,background:c.color,borderRadius:c.br,animation:`confettiFall ${c.dur} ${c.delay} ease-in forwards`,boxShadow:`0 0 4px ${c.color}55`}}/>)}</div>;
}

/* ═══════════════════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════════════════ */
export function useTypewriter(text, speed=26, active=true) {
  const [out,setOut] = useState("");
  const [done,setDone] = useState(false);
  useEffect(()=>{
    if(!active){setOut("");setDone(false);return;}
    setOut("");setDone(false);let i=0;
    const iv=setInterval(()=>{ if(i<text.length)setOut(text.slice(0,++i)); else{setDone(true);clearInterval(iv);} },speed);
    return()=>clearInterval(iv);
  },[text,active]);
  return{out,done};
}

/* ═══════════════════════════════════════════════════
   PAGE WRAPPER
═══════════════════════════════════════════════════ */
export function Page({ children, dust=true, fog=true }) {
  return (
    <div style={{ minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",overflowX:"hidden",overflowY:"auto",position:"relative",paddingBottom:220 }}>
      <style>{G}</style>
      <CinematicScene/>
      {dust && <MagicDust count={55}/>}
      {fog  && <FogOverlay/>}
      <div style={{ width:"100%",maxWidth:560,padding:"48px 22px 28px",display:"flex",flexDirection:"column",alignItems:"center",gap:26,position:"relative",zIndex:10 }}>
        {children}
      </div>
    </div>
  );
}
