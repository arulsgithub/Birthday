import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════
   DESIGN SYSTEM — Hogwarts Legacy Cinematic v2
   Inspired by: Portkey Games / Warner Bros aesthetic
   Full-bleed. Cinematic scale. Atmospheric depth.
═══════════════════════════════════════════════════════ */
export const T = {
  bg:       "#04060d",
  bg2:      "#080c18",
  navy:     "#0a1020",
  steel:    "#141e35",
  gold:     "#c9a84c",
  goldL:    "#e8c96d",
  goldD:    "#7a6530",
  goldGlow: "rgba(201,168,76,0.15)",
  mist:     "rgba(140,170,220,0.06)",
  silver:   "#c8d0de",
  silverD:  "#7a8494",
  parch:    "#ede0c4",
  parchD:   "#c8b890",
  crimson:  "#8b1a1a",
  light:    "rgba(220,235,255,0.92)",
};

export const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;900&family=IM+Fell+English:ital@0;1&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap');
`;

export const G = `
${FONTS}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{width:100%;min-height:100vh;background:#04060d;overflow-x:hidden;}
::-webkit-scrollbar{width:2px;}
::-webkit-scrollbar-track{background:#02030a;}
::-webkit-scrollbar-thumb{background:rgba(201,168,76,.35);border-radius:2px;}

@keyframes fadeIn      {from{opacity:0}to{opacity:1}}
@keyframes fadeUp      {from{opacity:0;transform:translateY(34px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeDown    {from{opacity:0;transform:translateY(-22px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeLeft    {from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
@keyframes fadeRight   {from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
@keyframes scaleIn     {from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
@keyframes goldShimmer {0%,100%{opacity:.55}50%{opacity:1}}
@keyframes shimmerSlide{0%{background-position:200% center}100%{background-position:-200% center}}
@keyframes mistDrift   {0%{transform:translateX(0) scaleX(1)}100%{transform:translateX(-4%) scaleX(1.04)}}
@keyframes mistDrift2  {0%{transform:translateX(0) scaleX(1)}100%{transform:translateX(4%) scaleX(1.04)}}
@keyframes godRayPulse {0%,100%{opacity:.1}50%{opacity:.24}}
@keyframes particleRise{0%{transform:translateY(0);opacity:0}10%{opacity:.9}90%{opacity:.2}100%{transform:translateY(-85vh);opacity:0}}
@keyframes runeRotate  {from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes cardGlow    {0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,0),0 32px 80px rgba(0,0,0,.7)}50%{box-shadow:0 0 70px rgba(201,168,76,.08),0 32px 80px rgba(0,0,0,.7)}}
@keyframes confettiF   {0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(110vh) rotate(540deg);opacity:0}}
@keyframes alertIn     {0%{opacity:0;transform:scale(.94) translateY(22px)}100%{opacity:1;transform:scale(1) translateY(0)}}
@keyframes lightning   {0%,89%,100%{opacity:0}91%,97%{opacity:.06}93%,99%{opacity:0}}
@keyframes breathe     {0%,100%{transform:scale(1);opacity:.85}50%{transform:scale(1.04);opacity:1}}
@keyframes launchWipe  {0%{opacity:0}12%{opacity:1}88%{opacity:1}100%{opacity:0;pointer-events:none}}
@keyframes buttonGlow  {0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,0),0 6px 24px rgba(0,0,0,.6)}50%{box-shadow:0 0 0 7px rgba(201,168,76,.08),0 6px 24px rgba(0,0,0,.6)}}
@keyframes glowPulse   {0%,100%{filter:drop-shadow(0 0 8px rgba(201,168,76,.35))}50%{filter:drop-shadow(0 0 20px rgba(201,168,76,.7))}}
@keyframes panDown     {0%{transform:translateY(-2%)}100%{transform:translateY(0)}}

.fi  {animation:fadeIn  .8s ease both}
.fiu {animation:fadeUp  .95s cubic-bezier(.23,1,.32,1) both}
.fil {animation:fadeLeft .85s cubic-bezier(.23,1,.32,1) both}
.fir {animation:fadeRight .85s cubic-bezier(.23,1,.32,1) both}
.fis {animation:scaleIn .75s cubic-bezier(.23,1,.32,1) both}
.breathe{animation:breathe 4s ease-in-out infinite}
.goldShimmer{animation:goldShimmer 3.5s ease-in-out infinite}
.glowPulse{animation:glowPulse 3s ease-in-out infinite}

button{transition:all .4s cubic-bezier(.23,1,.32,1);}
button:not([disabled]):hover{filter:brightness(1.22)!important;transform:translateY(-3px)!important;}
button:not([disabled]):active{transform:translateY(-1px)!important;}
`;

/* ─── MAGIC DUST PARTICLES ─────────────────────────── */
export function MagicDust({ count = 50 }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: H * .15 + Math.random() * H * .85,
      vx: (Math.random() - .5) * .22, vy: -.1 - Math.random() * .28,
      r: .5 + Math.random() * 1.7,
      a: Math.random(), da: .002 + Math.random() * .004,
      type: Math.random() > .6 ? "gold" : Math.random() > .5 ? "blue" : "silver",
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.a += p.da; if (p.a > .9 || p.a < .04) p.da *= -1;
        if (p.y < -30) { p.y = H + 30; p.x = Math.random() * W; }
        const color = p.type === "gold" ? "#c9a84c" : p.type === "blue" ? "#5080c8" : "#8090b0";
        ctx.save();
        ctx.globalAlpha = p.a * .65;
        ctx.shadowBlur = p.type === "gold" ? 12 : 6;
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:2,opacity:.78 }}/>;
}

/* ─── CINEMATIC BACKGROUND ──────────────────────────── */
export function CinematicBG() {
  return (
    <div style={{ position:"fixed",inset:0,zIndex:0,overflow:"hidden",pointerEvents:"none" }}>
      {/* Base sky — deep Hogwarts Legacy navy */}
      <div style={{ position:"absolute",inset:0,background:"linear-gradient(192deg,#020509 0%,#050a1a 20%,#08122c 46%,#060e20 72%,#03060d 100%)" }}/>
      {/* Atmospheric sky bloom */}
      <div style={{ position:"absolute",top:0,left:"20%",right:"20%",height:"50%",background:"radial-gradient(ellipse,rgba(28,58,130,.16) 0%,transparent 72%)" }}/>
      <div style={{ position:"absolute",top:"4%",left:"30%",right:"30%",height:"35%",background:"radial-gradient(ellipse,rgba(55,95,180,.1) 0%,transparent 66%)" }}/>
      {/* God rays */}
      {[
        { left:"43%", width:"9%",  opacity:.16, rotate:"-7deg",  delay:"0s",   blur:24 },
        { left:"48%", width:"6%",  opacity:.25, rotate:"-1deg",  delay:".5s",  blur:17 },
        { left:"52%", width:"8%",  opacity:.18, rotate:"6deg",   delay:"1s",   blur:22 },
        { left:"38%", width:"5%",  opacity:.1,  rotate:"-15deg", delay:"1.5s", blur:26 },
        { left:"60%", width:"4%",  opacity:.08, rotate:"12deg",  delay:"2s",   blur:28 },
      ].map((r,i)=>(
        <div key={i} style={{
          position:"absolute",top:"-8%",left:r.left,
          width:r.width,height:"80%",
          background:"linear-gradient(180deg,rgba(215,235,255,.92) 0%,rgba(195,218,252,.38) 28%,rgba(175,205,245,.14) 58%,transparent 100%)",
          transform:`rotate(${r.rotate})`,transformOrigin:"top center",
          opacity:r.opacity,filter:`blur(${r.blur}px)`,
          animation:`godRayPulse ${5+i}s ${r.delay} ease-in-out infinite`,
        }}/>
      ))}
      {/* Mountains — 3 layers */}
      <svg style={{ position:"absolute",bottom:"31%",left:0,right:0,width:"100%",pointerEvents:"none" }} viewBox="0 0 1440 200" preserveAspectRatio="xMidYMax meet">
        <path d="M0,200 L0,126 Q110,66 210,100 Q310,135 410,68 Q510,8 620,56 Q730,104 820,48 Q910,0 1020,44 Q1130,90 1230,52 Q1335,18 1440,70 L1440,200Z" fill="rgba(16,26,52,.42)"/>
      </svg>
      <svg style={{ position:"absolute",bottom:"23%",left:0,right:0,width:"100%" }} viewBox="0 0 1440 220" preserveAspectRatio="xMidYMax meet">
        <path d="M0,220 L0,150 Q90,98 185,132 Q280,166 380,104 Q480,42 585,85 Q690,128 790,72 Q890,16 1000,64 Q1110,110 1200,68 Q1300,28 1440,88 L1440,220Z" fill="rgba(10,18,40,.58)"/>
      </svg>
      <svg style={{ position:"absolute",bottom:"16%",left:0,right:0,width:"100%" }} viewBox="0 0 1440 240" preserveAspectRatio="xMidYMax meet">
        <path d="M0,240 L0,175 Q88,133 175,160 Q262,188 355,140 Q448,92 550,126 Q652,160 750,108 Q848,56 955,96 Q1062,136 1165,98 Q1268,62 1440,108 L1440,240Z" fill="rgba(7,13,30,.7)"/>
      </svg>
      {/* Fog layers */}
      <div style={{ position:"absolute",bottom:"27%",left:"-8%",right:"-8%",height:"34%",background:"linear-gradient(180deg,transparent 0%,rgba(70,100,162,.13) 38%,rgba(90,128,186,.2) 66%,transparent 100%)",filter:"blur(30px)",animation:"mistDrift 22s ease-in-out infinite alternate",opacity:.9 }}/>
      <div style={{ position:"absolute",bottom:"18%",left:"-10%",right:"-10%",height:"28%",background:"linear-gradient(180deg,transparent 0%,rgba(52,82,148,.15) 46%,rgba(70,108,168,.25) 72%,transparent 100%)",filter:"blur(36px)",animation:"mistDrift2 30s ease-in-out infinite alternate",opacity:.95 }}/>
      <div style={{ position:"absolute",bottom:"8%",left:"-4%",right:"-4%",height:"22%",background:"linear-gradient(180deg,transparent 0%,rgba(40,65,128,.18) 56%,rgba(55,88,148,.28) 80%,transparent 100%)",filter:"blur(24px)",animation:"mistDrift 40s ease-in-out infinite alternate",opacity:1 }}/>
      {/* Foreground treeline */}
      <svg style={{ position:"absolute",bottom:0,left:0,right:0,width:"100%",pointerEvents:"none" }} viewBox="0 0 1440 180" preserveAspectRatio="xMidYMax meet">
        <path d="M940,180 L940,108 L962,74 L986,108 L998,80 L1024,50 L1050,78 L1064,56 L1090,28 L1118,56 L1132,38 L1160,16 L1188,38 L1218,22 L1248,48 L1280,28 L1316,56 L1356,38 L1400,64 L1440,48 L1440,180Z" fill="#020407"/>
        <path d="M0,180 L0,76 L26,52 L52,78 L80,44 L108,70 L136,36 L168,62 L196,40 L226,66 L256,30 L288,56 L320,36 L352,60 L384,46 L416,70 L448,52 L482,80 L500,180Z" fill="#020407"/>
        <path d="M0,165 Q360,148 720,156 Q1080,146 1440,154 L1440,180 L0,180Z" fill="#010205"/>
      </svg>
      {/* Vignettes */}
      <div style={{ position:"absolute",bottom:0,left:0,right:0,height:"18%",background:"linear-gradient(0deg,#04060d 0%,transparent 100%)" }}/>
      <div style={{ position:"absolute",top:0,left:0,right:0,height:"22%",background:"linear-gradient(180deg,#04060d 0%,transparent 100%)" }}/>
      <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at center,transparent 32%,rgba(2,3,8,.78) 100%)" }}/>
      {/* Film grain */}
      <div style={{ position:"absolute",inset:0,opacity:.025,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.9'/%3E%3C/svg%3E")`,backgroundSize:"200px 200px" }}/>
      <div style={{ position:"absolute",inset:0,animation:"lightning 9s infinite",background:"rgba(160,200,255,.04)" }}/>
    </div>
  );
}

/* ─── HOGWARTS CASTLE ───────────────────────────────── */
export function HLCastle() {
  return (
    <svg
      viewBox="0 0 1440 440"
      style={{ position:"fixed",bottom:0,left:0,right:0,width:"100%",pointerEvents:"none",zIndex:3 }}
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <linearGradient id="cBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1a2e" stopOpacity=".96"/>
          <stop offset="100%" stopColor="#0d0b18" stopOpacity="1"/>
        </linearGradient>
        <linearGradient id="cDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#151024" stopOpacity="1"/>
          <stop offset="100%" stopColor="#070510" stopOpacity="1"/>
        </linearGradient>
        <linearGradient id="cTower" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#221e32" stopOpacity=".93"/>
          <stop offset="100%" stopColor="#0e0c1a" stopOpacity="1"/>
        </linearGradient>
        <radialGradient id="winGold" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb040" stopOpacity=".95"/>
          <stop offset="55%" stopColor="#e07820" stopOpacity=".5"/>
          <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="castleAura" cx="50%" cy="78%" r="52%">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity=".055"/>
          <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
        </radialGradient>
        <filter id="wg" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="sBlur"><feGaussianBlur stdDeviation="2.2"/></filter>
      </defs>

      <ellipse cx="720" cy="425" rx="580" ry="52" fill="url(#castleAura)"/>

      {/* Far left tower */}
      <rect x="115" y="196" width="34" height="234" fill="url(#cDark)"/>
      {[115,124,133].map((x,i)=><rect key={i} x={x} y="183" width="7" height="16" rx="1.5" fill="#060410"/>)}
      <path d="M112,196 L132,140 L152,196Z" fill="#1b1528"/>
      <line x1="132" y1="140" x2="132" y2="116" stroke="#3a2e18" strokeWidth="2"/>
      <polygon points="132,116 149,125 132,134" fill="#8b1a1a"/>
      {[[119,224],[119,252],[119,280]].map(([x,y],i)=>(
        <rect key={i} x={x} y={y} width={9} height={13} rx={4.5} fill="url(#winGold)" opacity={.45} filter="url(#wg)"/>
      ))}

      {/* Left main tower */}
      <rect x="190" y="140" width="52" height="290" fill="url(#cBody)"/>
      {[190,201,212,223,234].map((x,i)=><rect key={i} x={x} y="127" width="8" height="17" rx="2" fill="#0c0a18"/>)}
      <path d="M187,140 L216,74 L245,140Z" fill="#1e1a30"/>
      <line x1="216" y1="74" x2="216" y2="48" stroke="#3a2e18" strokeWidth="2"/>
      <polygon points="216,48 236,58 216,68" fill="#1a3860"/>
      {[[196,168],[218,165],[196,198],[218,195],[196,228],[218,225],[196,258],[218,255]].map(([x,y],i)=>(
        <rect key={i} x={x} y={y} width={12} height={16} rx={6} fill="url(#winGold)" opacity={.48+i*.02} filter="url(#wg)"/>
      ))}

      {/* Left wing */}
      <rect x="242" y="218" width="172" height="212" fill="url(#cBody)"/>
      {Array.from({length:14},(_,i)=><rect key={i} x={242+i*13} y="205" width="8" height="16" rx="1.5" fill="#0c0a18"/>)}
      {[240,268,298,328,358,388].map((y,i)=>(
        <line key={i} x1="242" y1={y} x2="414" y2={y} stroke="rgba(255,255,255,.02)" strokeWidth=".5"/>
      ))}
      {[[254,240],[282,240],[310,240],[338,240],[366,240],[392,240],
        [254,275],[282,275],[310,275],[338,275],[366,275],
        [254,310],[310,310],[366,310]].map(([x,y],i)=>(
        <rect key={i} x={x} y={y} width={12} height={16} rx={6} fill="url(#winGold)" opacity={.4+i*.012} filter="url(#wg)"/>
      ))}

      {/* Viaduct */}
      <rect x="95" y="270" width="100" height="22" fill="#0c0a1a"/>
      {[104,120,136,152,168].map((x,i)=>(<rect key={i} x={x} y="258" width="13" height="38" fill="#0a0818" rx="1"/>))}
      {[108,124,140,156].map((x,i)=>(<path key={i} d={`M${x},270 Q${x+9},288 ${x+18},270`} fill="#060412"/>))}

      {/* Grand central tower */}
      <rect x="570" y="46" width="108" height="374" fill="url(#cBody)"/>
      {Array.from({length:10},(_,i)=><rect key={i} x={568+i*12} y="30" width="9" height="20" rx="2" fill="#0c0a18"/>)}
      <path d="M566,46 L624,−4 L682,46Z" fill="#201c34"/>
      <path d="M566,46 L624,0 L682,46Z" fill="#201c34"/>
      <line x1="624" y1="0" x2="624" y2="-22" stroke="#4a3a18" strokeWidth="2.5"/>
      <polygon points="624,-22 645,-12 624,-2" fill="#1a3860"/>
      {[82,116,150,184,218,252,286,320].map((y,i)=>(
        <line key={i} x1="570" y1={y} x2="678" y2={y} stroke="rgba(255,255,255,.02)" strokeWidth=".5"/>
      ))}
      {[[578,76],[600,76],[622,76],[578,116],[600,116],[622,116],
        [578,156],[600,156],[622,156],[578,196],[600,196],[622,196],
        [578,236],[600,236],[622,236],[578,276],[600,276],[622,276],
        [578,316],[600,316],[622,316]].map(([x,y],i)=>(
        <rect key={i} x={x} y={y} width={14} height={20} rx={7} fill="url(#winGold)" opacity={.5+i*.015} filter="url(#wg)"/>
      ))}
      {/* Rose window */}
      <circle cx="624" cy="98" r="22" fill="none" stroke="rgba(201,168,76,.2)" strokeWidth="1.3"/>
      <circle cx="624" cy="98" r="13" fill="rgba(255,148,30,.15)" filter="url(#sBlur)"/>
      <circle cx="624" cy="98" r="6" fill="rgba(255,190,50,.18)" filter="url(#sBlur)"/>
      {[0,45,90,135].map((a,i)=>(
        <line key={i}
          x1={624+Math.cos(a*Math.PI/180)*6} y1={98+Math.sin(a*Math.PI/180)*6}
          x2={624+Math.cos(a*Math.PI/180)*19} y2={98+Math.sin(a*Math.PI/180)*19}
          stroke="rgba(201,168,76,.26)" strokeWidth="1"/>
      ))}

      {/* Main castle body */}
      <rect x="414" y="170" width="420" height="260" fill="url(#cBody)"/>
      {Array.from({length:34},(_,i)=><rect key={i} x={412+i*13} y="155" width="8" height="18" rx="1.5" fill="#0c0a18"/>)}
      {[205,238,270,304,336,370].map((y,i)=>(
        <line key={i} x1="414" y1={y} x2="834" y2={y} stroke="rgba(255,255,255,.018)" strokeWidth=".5"/>
      ))}
      {[
        [428,196],[452,196],[476,196],[500,196],[524,196],[572,196],[620,196],[668,196],[716,196],[764,196],[812,196],
        [428,232],[476,232],[524,232],[572,232],[620,232],[668,232],[716,232],[764,232],[812,232],
        [428,268],[484,268],[572,268],[620,268],[668,268],[716,268],[764,268],[812,268],
        [428,304],[512,304],[620,304],[716,304],[800,304],
        [428,340],[572,340],[716,340],
      ].map(([x,y],i)=>(
        <rect key={i} x={x} y={y} width={12} height={16} rx={6} fill="url(#winGold)" opacity={.32+((i*7)%9)*.04} filter="url(#wg)"/>
      ))}
      {/* Great Hall arch window */}
      <path d="M600,198 L600,244 Q624,264 648,244 L648,198Z" fill="url(#winGold)" opacity=".35" filter="url(#wg)"/>
      <path d="M600,198 L600,244 Q624,264 648,244 L648,198Z" fill="none" stroke="rgba(201,168,76,.22)" strokeWidth="1.2"/>

      {/* Right wing */}
      <rect x="834" y="218" width="168" height="212" fill="url(#cBody)"/>
      {Array.from({length:13},(_,i)=><rect key={i} x={832+i*14} y="204" width="8" height="17" rx="1.5" fill="#0c0a18"/>)}
      {[[846,242],[870,242],[896,242],[924,242],[952,242],[978,242],
        [846,276],[870,276],[896,276],[924,276],[952,276],
        [846,308],[896,308],[952,308]].map(([x,y],i)=>(
        <rect key={i} x={x} y={y} width={11} height={15} rx={5.5} fill="url(#winGold)" opacity={.42+i*.02} filter="url(#wg)"/>
      ))}

      {/* Astronomy tower */}
      <rect x="978" y="84" width="44" height="346" fill="url(#cTower)"/>
      {[978,990,1002,1014].map((x,i)=><rect key={i} x={x} y="70" width="8" height="18" rx="1.5" fill="#0c0a18"/>)}
      <path d="M975,84 L1000,26 L1025,84Z" fill="#1e1a32"/>
      <line x1="1000" y1="26" x2="1000" y2="2" stroke="#3a2e18" strokeWidth="2"/>
      <polygon points="1000,2 1020,12 1000,22" fill="#8b1a1a"/>
      {[[982,112],[998,112],[982,140],[998,140],[982,168],[998,168],
        [982,196],[998,196],[982,224],[998,224],[982,252],[998,252]].map(([x,y],i)=>(
        <rect key={i} x={x} y={y} width={9} height={13} rx={4.5} fill="url(#winGold)" opacity={.48} filter="url(#wg)"/>
      ))}

      {/* Far right tower */}
      <rect x="1058" y="200" width="38" height="230" fill="url(#cDark)"/>
      {[1058,1070,1082].map((x,i)=><rect key={i} x={x} y="186" width="7" height="17" rx="1.5" fill="#060410"/>)}
      <path d="M1055,200 L1077,150 L1099,200Z" fill="#161228"/>
      {[[1062,226],[1062,254],[1062,282]].map(([x,y],i)=>(
        <rect key={i} x={x} y={y} width={9} height={13} rx={4.5} fill="url(#winGold)" opacity={.4} filter="url(#wg)"/>
      ))}

      {/* Connectors */}
      <rect x="412" y="250" width="9" height="60" fill="#100e1c"/>
      <rect x="834" y="258" width="9" height="54" fill="#100e1c"/>

      {/* Forbidden forest left */}
      <path d="M0,430 L0,216 L22,180 L42,214 L64,178 L88,212 L112,180 L138,214 L162,186 L186,220 L214,192 L240,226 L268,202 L294,232 L322,212 L350,435Z" fill="#030407"/>
      <path d="M0,435 L0,234 L18,208 L36,238 L56,210 L76,240 L96,216 L118,246 L140,222 L164,252 L190,228 L218,258 L248,234 L278,262 L310,238 L350,435Z" fill="#020305"/>

      {/* Forbidden forest right */}
      <path d="M1440,430 L1440,218 L1418,182 L1396,216 L1372,180 L1348,214 L1324,182 L1300,216 L1276,184 L1252,220 L1226,196 L1200,230 L1174,204 L1146,236 L1118,216 L1090,435Z" fill="#030407"/>
      <path d="M1440,435 L1440,236 L1420,210 L1400,240 L1378,212 L1356,242 L1332,218 L1308,248 L1282,224 L1256,254 L1228,230 L1200,260 L1170,236 L1140,264 L1108,240 L1090,435Z" fill="#020305"/>

      {/* Black Lake */}
      <ellipse cx="720" cy="430" rx="510" ry="22" fill="rgba(4,6,16,.92)"/>
      <ellipse cx="720" cy="426" rx="370" ry="13" fill="rgba(8,14,34,.82)"/>
      <ellipse cx="720" cy="422" rx="210" ry="7" fill="rgba(201,168,76,.038)"/>
      <path d="M510,424 Q615,436 720,428 Q825,436 930,424" stroke="rgba(201,168,76,.048)" strokeWidth="1.8" fill="none"/>

      {/* Ground */}
      <rect x="0" y="422" width="1440" height="18" fill="#020408"/>
    </svg>
  );
}

/* ─── RUNE RING ──────────────────────────────────────── */
export function RuneRing({ size = 100 }) {
  const runes = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ";
  return (
    <div style={{ position:"relative",width:size,height:size,flexShrink:0 }}>
      <div style={{ position:"absolute",inset:0,borderRadius:"50%",border:"1px solid rgba(201,168,76,.2)",animation:"runeRotate 24s linear infinite" }}>
        {Array.from({length:12},(_,i)=>(
          <span key={i} style={{ position:"absolute",left:"50%",top:"50%",transform:`rotate(${i*30}deg) translateY(-${size/2-9}px) translateX(-50%)`,color:"rgba(201,168,76,.35)",fontSize:size/12,fontFamily:"serif" }}>
            {runes[i%runes.length]}
          </span>
        ))}
      </div>
      <div style={{ position:"absolute",inset:size*.14,borderRadius:"50%",border:"1px solid rgba(201,168,76,.09)",animation:"runeRotate 16s linear reverse infinite" }}/>
      <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",color:"#c9a84c",fontSize:size*.34,lineHeight:1,filter:"drop-shadow(0 0 12px rgba(201,168,76,.58))",animation:"goldShimmer 3.5s ease-in-out infinite" }}>⚡</div>
    </div>
  );
}

/* ─── DIVIDER ───────────────────────────────────────── */
export function Divider({ style = {} }) {
  return (
    <div style={{ display:"flex",alignItems:"center",gap:12,width:"100%",...style }}>
      <div style={{ flex:1,height:"1px",background:"linear-gradient(90deg,transparent,rgba(201,168,76,.28))" }}/>
      <span style={{ color:"rgba(201,168,76,.48)",fontSize:9,letterSpacing:2 }}>✦</span>
      <div style={{ flex:1,height:"1px",background:"linear-gradient(90deg,rgba(201,168,76,.28),transparent)" }}/>
    </div>
  );
}

/* ─── CARD ──────────────────────────────────────────── */
export function Card({ children, glow = false, style = {} }) {
  return (
    <div style={{
      width:"100%",
      background:"linear-gradient(160deg,rgba(26,22,44,.97) 0%,rgba(15,13,28,.98) 65%,rgba(20,17,36,.97) 100%)",
      border:`1px solid rgba(201,168,76,${glow?.42:.18})`,
      borderRadius:2,
      padding:"28px 26px",
      position:"relative",
      overflow:"hidden",
      backdropFilter:"blur(18px)",
      animation:glow?"cardGlow 5s ease-in-out infinite":"none",
      boxShadow:"0 32px 80px rgba(0,0,0,.72),inset 0 0 40px rgba(0,0,0,.35)",
      ...style,
    }}>
      <div style={{ position:"absolute",inset:0,opacity:.2,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.05'/%3E%3C/svg%3E")`,pointerEvents:"none",zIndex:0 }}/>
      {[{top:8,left:10},{top:8,right:10},{bottom:8,left:10},{bottom:8,right:10}].map((pos,i)=>(
        <span key={i} style={{ position:"absolute",color:"rgba(201,168,76,.2)",fontSize:10,...pos }}>✦</span>
      ))}
      <div style={{ position:"relative",zIndex:1 }}>{children}</div>
    </div>
  );
}

/* ─── BUTTON ────────────────────────────────────────── */
export function Btn({ children, onClick, variant="gold", disabled=false, style={} }) {
  const styles = {
    gold:    { bg:"linear-gradient(160deg,rgba(52,38,8,.96),rgba(32,22,4,.98))", bc:"rgba(201,168,76,.62)", tc:"#c9a84c", sh:"rgba(201,168,76,.12)" },
    crimson: { bg:"linear-gradient(160deg,rgba(52,8,8,.96),rgba(32,4,4,.98))",   bc:"rgba(160,38,38,.66)", tc:"#d05050", sh:"rgba(160,50,50,.12)" },
    ghost:   { bg:"rgba(255,255,255,.018)",                                        bc:"rgba(255,255,255,.09)",tc:"rgba(200,210,225,.52)", sh:"transparent" },
    emerald: { bg:"linear-gradient(160deg,rgba(8,52,20,.96),rgba(4,32,12,.98))",  bc:"rgba(38,112,62,.66)", tc:"#50b070", sh:"rgba(50,120,70,.12)" },
  }[variant] || {};
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding:"15px 42px",
      background:disabled?"rgba(255,255,255,.015)":styles.bg,
      border:`1px solid ${disabled?"rgba(255,255,255,.05)":styles.bc}`,
      color:disabled?"rgba(200,210,225,.14)":styles.tc,
      fontFamily:"'Cinzel',serif", fontSize:".82rem", letterSpacing:".3em",
      cursor:disabled?"default":"pointer", borderRadius:2,
      boxShadow:disabled?"none":`0 0 32px ${styles.sh},inset 0 0 18px rgba(0,0,0,.48)`,
      transition:"all .4s cubic-bezier(.23,1,.32,1)",
      animation:!disabled&&variant==="gold"?"buttonGlow 3.5s ease-in-out infinite":"none",
      ...style,
    }}>{children}</button>
  );
}

/* ─── TITLE ─────────────────────────────────────────── */
export function Title({ children, sub, eyebrow, size="clamp(1.4rem,5vw,2.2rem)" }) {
  return (
    <div style={{ textAlign:"center",width:"100%" }}>
      {eyebrow&&<p style={{ fontFamily:"'Cinzel',serif",fontSize:".56rem",letterSpacing:".6em",color:"#7a6530",marginBottom:13,textTransform:"uppercase" }}>{eyebrow}</p>}
      <h2 style={{ fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:size,color:"#c9a84c",letterSpacing:".06em",lineHeight:1.16,textShadow:"0 0 65px rgba(201,168,76,.34),0 2px 4px rgba(0,0,0,.95)" }}>{children}</h2>
      {sub&&<p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(.9rem,2.8vw,1.08rem)",color:"#c8d0de",letterSpacing:".14em",marginTop:10,fontStyle:"italic",opacity:.72 }}>{sub}</p>}
    </div>
  );
}

/* ─── CONFETTI ──────────────────────────────────────── */
export function Confetti() {
  const p=Array.from({length:60},(_,i)=>({id:i,left:`${Math.random()*100}%`,color:["#c9a84c","#8b2020","#1a3860","#2a6040","#b8bfcc","#7a6530"][i%6],size:`${4+Math.random()*8}px`,delay:`${Math.random()*2.5}s`,dur:`${3.5+Math.random()*2}s`,br:i%4===0?"50%":"1px"}));
  return (
    <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:990 }}>
      {p.map(c=><div key={c.id} style={{ position:"absolute",top:"-20px",left:c.left,width:c.size,height:c.size,background:c.color,borderRadius:c.br,animation:`confettiF ${c.dur} ${c.delay} ease-in forwards`,boxShadow:`0 0 5px ${c.color}44` }}/>)}
    </div>
  );
}

/* ─── TRANSITION ────────────────────────────────────── */
export function Transition({ label="", onDone }) {
  useEffect(()=>{ const t=setTimeout(onDone,2800); return()=>clearTimeout(t); },[]);
  return (
    <div style={{ position:"fixed",inset:0,background:"#04060d",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:999 }} className="fi">
      <style>{G}</style>
      <MagicDust count={45}/>
      <div style={{ position:"relative",zIndex:10,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:20 }}>
        <RuneRing size={95}/>
        <div style={{ marginTop:14 }}>
          <p style={{ fontFamily:"'Cinzel',serif",color:"#c9a84c",fontSize:"clamp(.82rem,3vw,1.1rem)",letterSpacing:".44em",animation:"breathe 2s ease-in-out infinite" }}>{label}</p>
          <Divider style={{ marginTop:16,maxWidth:256 }}/>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",color:"#7a6530",fontSize:".9rem",letterSpacing:".16em",marginTop:12,fontStyle:"italic" }}>The next chapter unfolds...</p>
        </div>
      </div>
    </div>
  );
}

/* ─── TYPEWRITER ────────────────────────────────────── */
export function useTypewriter(text,speed=26,active=true) {
  const [out,setOut]=useState("");
  const [done,setDone]=useState(false);
  useEffect(()=>{
    if(!active){setOut("");setDone(false);return;}
    setOut("");setDone(false);let i=0;
    const iv=setInterval(()=>{ if(i<text.length)setOut(text.slice(0,++i)); else{setDone(true);clearInterval(iv);} },speed);
    return()=>clearInterval(iv);
  },[text,active]);
  return{out,done};
}

/* ─── PAGE WRAPPER ──────────────────────────────────── */
export function Page({ children, castle=true, particles=true }) {
  return (
    <div style={{ minHeight:"100vh",background:"#04060d",display:"flex",flexDirection:"column",alignItems:"center",overflowX:"hidden",overflowY:"auto",position:"relative",paddingBottom:castle?300:72 }}>
      <style>{G}</style>
      <CinematicBG/>
      {particles&&<MagicDust count={45}/>}
      {castle&&<HLCastle/>}
      <div style={{ width:"100%",maxWidth:610,padding:"54px 24px 32px",display:"flex",flexDirection:"column",alignItems:"center",gap:28,position:"relative",zIndex:10 }}>
        {children}
      </div>
    </div>
  );
}