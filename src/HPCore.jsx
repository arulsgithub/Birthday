import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════
   DESIGN SYSTEM
   Inspired by Hogwarts Legacy poster aesthetic:
   - Deep navy/teal → warm amber/gold sky gradient
   - Dramatic god rays behind castle
   - Layered atmospheric mist
   - Clean confident typography
   - Minimal UI — let the atmosphere speak
═══════════════════════════════════════════════════ */

export const G = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap');

*,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root {
  width: 100%; min-height: 100vh;
  background: #03080f;
  overflow-x: hidden;
}
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: #03080f; }
::-webkit-scrollbar-thumb { background: rgba(180,140,60,0.4); border-radius: 2px; }

/* ── Keyframes ── */
@keyframes fadeIn      { from{opacity:0} to{opacity:1} }
@keyframes fadeUp      { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeLeft    { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
@keyframes goldShimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
@keyframes godRay      { 0%,100%{opacity:.55;transform:scaleX(1)} 50%{opacity:.75;transform:scaleX(1.04)} }
@keyframes mistDrift   { 0%{transform:translateX(0) scaleY(1)} 100%{transform:translateX(-60px) scaleY(1.08)} }
@keyframes particleRise{ 0%{transform:translateY(0) translateX(0);opacity:0} 8%{opacity:.9} 92%{opacity:.3} 100%{transform:translateY(-90vh) translateX(20px);opacity:0} }
@keyframes breathe     { 0%,100%{opacity:.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.02)} }
@keyframes wandGlow    { 0%,100%{box-shadow:0 0 20px 4px rgba(100,160,255,.5)} 50%{box-shadow:0 0 50px 12px rgba(120,180,255,.8),0 0 100px 20px rgba(80,120,255,.3)} }
@keyframes borderPulse { 0%,100%{border-color:rgba(180,140,60,.2)} 50%{border-color:rgba(180,140,60,.55)} }
@keyframes runeRotate  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes stampIn     { 0%{transform:scale(4) rotate(-12deg);opacity:0} 70%{transform:scale(.96) rotate(-6deg);opacity:1} 100%{transform:scale(1) rotate(-6deg);opacity:1} }
@keyframes confettiFall{ 0%{transform:translateY(-20px) rotate(0);opacity:1} 100%{transform:translateY(110vh) rotate(600deg);opacity:0} }
@keyframes countFlip   { 0%{transform:translateY(-6px);opacity:0} 100%{transform:translateY(0);opacity:1} }
@keyframes alertIn     { 0%{opacity:0;transform:scale(.94) translateY(20px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
@keyframes lightBeam   { 0%,100%{opacity:.45;transform:rotate(-3deg) scaleY(1)} 50%{opacity:.65;transform:rotate(-3deg) scaleY(1.06)} }
@keyframes shake       { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
@keyframes lockPulse   { 0%,100%{box-shadow:0 0 0 0 rgba(180,140,60,0)} 50%{box-shadow:0 0 0 8px rgba(180,140,60,.12)} }
@keyframes spellBurst  { 0%{transform:scale(0) rotate(0);opacity:1} 100%{transform:scale(2.5) rotate(360deg);opacity:0} }

.fi    { animation: fadeIn  .7s ease forwards; }
.fiu   { animation: fadeUp  .8s ease forwards; }
.fil   { animation: fadeLeft .7s ease forwards; }
.breathe { animation: breathe 4s ease-in-out infinite; }

button:not([disabled]):hover {
  transform: translateY(-2px) !important;
  filter: brightness(1.12) !important;
}
`;

/* ═══════════════════════════════════════════════════
   CANVAS PARTICLES — floating magical embers
═══════════════════════════════════════════════════ */
export function Particles({ count = 45, color = "#c8a84c" }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: H + Math.random() * 300,
      vx: (Math.random() - .5) * .35, vy: -(0.15 + Math.random() * .45),
      r: .6 + Math.random() * 1.6, a: Math.random(), da: (Math.random() > .5 ? .004 : -.004),
    }));
    let raf;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.a += p.da;
        if (p.a > .85 || p.a < .05) p.da *= -1;
        if (p.y < -20) { p.y = H + 20; p.x = Math.random() * W; }
        ctx.save();
        ctx.globalAlpha = p.a * .65;
        ctx.shadowBlur = 8; ctx.shadowColor = color;
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:2,opacity:.7 }}/>;
}

/* ═══════════════════════════════════════════════════
   CINEMATIC BACKGROUND — Hogwarts Legacy sky
   God rays + layered atmosphere + deep color grade
═══════════════════════════════════════════════════ */
export function CinematicBG({ variant = "night" }) {
  const configs = {
    night:  { sky1:"#03080f", sky2:"#06121e", skyMid:"#0a1a2e", glow:"rgba(180,140,60,0.18)" },
    dawn:   { sky1:"#05080f", sky2:"#0f1830", skyMid:"#1a2a50", glow:"rgba(200,160,80,0.22)" },
    dusk:   { sky1:"#060408", sky2:"#120818", skyMid:"#1e0e28", glow:"rgba(160,100,180,0.18)" },
    storm:  { sky1:"#03050a", sky2:"#050a12", skyMid:"#080f1a", glow:"rgba(100,130,180,0.15)" },
  };
  const c = configs[variant] || configs.night;

  return (
    <div style={{ position:"fixed", inset:0, zIndex:0, overflow:"hidden" }}>
      {/* Deep sky gradient */}
      <div style={{ position:"absolute", inset:0, background:`linear-gradient(180deg, ${c.sky1} 0%, ${c.sky2} 35%, ${c.skyMid} 60%, #0a1520 80%, #06101a 100%)` }}/>

      {/* God rays from behind castle position */}
      {[
        { left:"42%", rotate:"-18deg", w:"160px", h:"70vh", op:.28, delay:"0s", dur:"6s" },
        { left:"48%", rotate:"-8deg",  w:"240px", h:"80vh", op:.38, delay:"-2s", dur:"8s" },
        { left:"50%", rotate:"0deg",   w:"200px", h:"75vh", op:.45, delay:"-4s", dur:"7s" },
        { left:"52%", rotate:"8deg",   w:"240px", h:"80vh", op:.38, delay:"-1s", dur:"9s" },
        { left:"58%", rotate:"18deg",  w:"160px", h:"70vh", op:.28, delay:"-3s", dur:"6s" },
      ].map((r, i) => (
        <div key={i} style={{
          position:"absolute", bottom:0, left:r.left,
          width:r.w, height:r.h,
          background:`linear-gradient(0deg, transparent 0%, ${c.glow} 30%, rgba(200,170,80,0.12) 60%, transparent 100%)`,
          transform:`rotate(${r.rotate}) translateX(-50%)`,
          transformOrigin:"bottom center",
          opacity:r.op,
          animation:`godRay ${r.dur} ${r.delay} ease-in-out infinite`,
          filter:"blur(22px)",
        }}/>
      ))}

      {/* Horizon warm glow — like the Legacy poster */}
      <div style={{
        position:"absolute", left:0, right:0, bottom:"28%", height:"22%",
        background:"radial-gradient(ellipse at 50% 80%, rgba(180,130,50,0.22) 0%, rgba(120,90,30,0.1) 40%, transparent 70%)",
        filter:"blur(30px)",
      }}/>

      {/* Stars */}
      {Array.from({ length: 90 }, (_, i) => ({
        top: `${Math.random() * 55}%`, left: `${Math.random() * 100}%`,
        s: .6 + Math.random() * 1.8,
        dur: `${2 + Math.random() * 4}s`, del: `${Math.random() * 5}s`,
        gold: i % 8 === 0,
      })).map((s, i) => (
        <div key={i} style={{
          position:"absolute", top:s.top, left:s.left,
          width:s.s, height:s.s, borderRadius:"50%",
          background: s.gold ? "#d4a84c" : "#c8d0e0",
          animation:`breathe ${s.dur} ${s.del} ease-in-out infinite`,
          boxShadow:`0 0 ${s.s*3}px ${s.gold?"rgba(212,168,76,.6)":"rgba(200,210,230,.5)"}`,
          opacity: s.gold ? .8 : .5,
        }}/>
      ))}

      {/* Atmospheric mist layers — bottom */}
      {[
        { bottom:"0%",  h:"28%", op:.7,  dur:"22s", del:"0s" },
        { bottom:"8%",  h:"20%", op:.5,  dur:"28s", del:"-8s" },
        { bottom:"16%", h:"14%", op:.3,  dur:"34s", del:"-16s" },
        { bottom:"22%", h:"10%", op:.18, dur:"40s", del:"-22s" },
      ].map((m, i) => (
        <div key={i} style={{
          position:"absolute", left:"-8%", right:"-8%", bottom:m.bottom, height:m.h,
          background:"radial-gradient(ellipse at 50% 100%, rgba(130,150,200,0.18) 0%, rgba(80,100,160,0.08) 50%, transparent 70%)",
          filter:"blur(24px)",
          animation:`mistDrift ${m.dur} ${m.del} ease-in-out infinite alternate`,
          opacity:m.op,
        }}/>
      ))}

      {/* Subtle lightning flash */}
      <div style={{ position:"absolute", inset:0, background:"rgba(160,180,255,0.04)", animation:"breathe 9s 0s ease-in-out infinite", pointerEvents:"none" }}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   HOGWARTS CASTLE — gothic silhouette inspired
   by Hogwarts Legacy / HP film series look
═══════════════════════════════════════════════════ */
export function Castle({ style = {} }) {
  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:3, pointerEvents:"none", ...style }}>
      <svg viewBox="0 0 1200 500" style={{ width:"100%", display:"block" }} preserveAspectRatio="xMidYMax meet">
        <defs>
          <linearGradient id="castleFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0e1828" stopOpacity="0.95"/>
            <stop offset="100%" stopColor="#060d15" stopOpacity="1"/>
          </linearGradient>
          <linearGradient id="towerFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1420" stopOpacity="1"/>
            <stop offset="100%" stopColor="#060d15" stopOpacity="1"/>
          </linearGradient>
          <linearGradient id="skyline" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#03080f" stopOpacity="0"/>
            <stop offset="100%" stopColor="#03080f" stopOpacity="1"/>
          </linearGradient>
          <filter id="castleSoftGlow">
            <feGaussianBlur stdDeviation="2.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="winGlow">
            <feGaussianBlur stdDeviation="1.8" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <radialGradient id="winColor" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d4a84c" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#a07030" stopOpacity="0.2"/>
          </radialGradient>
          <radialGradient id="horizGlow" cx="50%" cy="100%" r="60%">
            <stop offset="0%" stopColor="rgba(180,130,50,0.15)"/>
            <stop offset="100%" stopColor="transparent"/>
          </radialGradient>
        </defs>

        {/* Horizon warm glow beneath castle */}
        <ellipse cx="600" cy="490" rx="580" ry="80" fill="url(#horizGlow)" opacity="0.8"/>

        {/* ── Far background hills ── */}
        <path d="M0,340 L80,280 L160,310 L240,255 L330,290 L420,240 L510,275 L600,230 L690,268 L780,235 L870,270 L960,238 L1050,265 L1130,248 L1200,258 L1200,500 L0,500Z" fill="#050c16" opacity="0.7"/>
        <path d="M0,370 L100,320 L200,345 L350,305 L500,328 L650,308 L800,322 L950,305 L1100,318 L1200,310 L1200,500 L0,500Z" fill="#060d18" opacity="0.85"/>

        {/* ── Forbidden Forest LEFT ── */}
        <path d="M0,500 L0,305 L18,265 L30,290 L45,255 L60,282 L76,252 L92,278 L108,255 L124,282 L142,258 L158,285 L176,265 L194,298 L210,278 L224,308 L238,288 L252,312 L268,295 L280,325 L292,500Z" fill="#03080f"/>
        <path d="M0,500 L0,320 L14,288 L26,308 L40,272 L55,296 L70,278 L85,300 L100,282 L115,305 L132,285 L148,308 L165,290 L180,315 L195,295 L212,320 L228,302 L244,328 L260,312 L275,340 L288,500Z" fill="#020609"/>

        {/* ── Forbidden Forest RIGHT ── */}
        <path d="M1200,500 L1200,305 L1182,265 L1170,290 L1155,255 L1140,282 L1124,252 L1108,278 L1092,255 L1076,282 L1058,258 L1042,285 L1024,265 L1006,298 L990,278 L976,308 L962,288 L948,312 L932,295 L920,325 L908,500Z" fill="#03080f"/>
        <path d="M1200,500 L1200,320 L1186,288 L1174,308 L1160,272 L1145,296 L1130,278 L1115,300 L1100,282 L1085,305 L1068,285 L1052,308 L1035,290 L1020,315 L1005,295 L988,320 L972,302 L956,328 L940,312 L925,340 L912,500Z" fill="#020609"/>

        {/* ══ CASTLE MAIN STRUCTURE ══ */}

        {/* Left outer wall */}
        <rect x="260" y="295" width="140" height="205" fill="url(#castleFill)"/>
        {[260,272,284,296,308,320,332,344,356,368,380,392].map((x,i)=>(
          <rect key={i} x={x} y="282" width="9" height="16" rx="1" fill="#070e18"/>
        ))}

        {/* Left section tower */}
        <rect x="225" y="240" width="52" height="260" fill="url(#towerFill)"/>
        {[225,237,249,261,269].map((x,i)=>(
          <rect key={i} x={x} y="225" width="9" height="18" rx="1" fill="#060c14"/>
        ))}
        <path d="M222,240 L251,192 L280,240Z" fill="#09121e"/>
        {/* Spire */}
        <line x1="251" y1="192" x2="251" y2="162" stroke="#0c1828" strokeWidth="3"/>
        <polygon points="248,162 251,142 254,162" fill="#0c1828"/>

        {/* LEFT TALL TOWER — astronomy-inspired */}
        <rect x="305" y="165" width="60" height="335" fill="url(#towerFill)"/>
        {[305,318,331,344,357].map((x,i)=>(
          <rect key={i} x={x} y="150" width="10" height="18" rx="1" fill="#060c14"/>
        ))}
        <path d="M301,165 L335,108 L369,165Z" fill="#09121e"/>
        <line x1="335" y1="108" x2="335" y2="72" stroke="#0c1828" strokeWidth="3.5"/>
        <polygon points="331,72 335,48 339,72" fill="#0c1828"/>
        {/* Tower windows */}
        {[[320,195],[340,195],[320,228],[340,228],[320,265],[340,265],[320,302],[340,302],[320,340],[340,340]].map(([x,y],i)=>(
          <rect key={i} x={x} y={y} width={8} height={12} rx={4} fill="url(#winColor)" opacity={.35+i*.03} filter="url(#winGlow)"/>
        ))}

        {/* ── MAIN CASTLE BODY ── */}
        <rect x="365" y="220" width="470" height="280" fill="url(#castleFill)"/>
        {/* Battlements across top */}
        {Array.from({length:34},(_,i)=>(
          <rect key={i} x={365+i*14} y="205" width="9" height="18" rx="1" fill="#070e18"/>
        ))}

        {/* Large arched gateway */}
        <path d="M530,500 L530,350 Q565,320 600,350 L600,500Z" fill="#04090f"/>
        <path d="M533,500 L533,355 Q565,328 597,355 L597,500Z" fill="#030710"/>

        {/* Body windows - large gothic arched */}
        {[
          [390,240],[410,240],[430,240],[452,240],[474,240],[496,240],[520,240],[546,240],
          [622,240],[648,240],[672,240],[696,240],[720,240],[744,240],[768,240],[792,240],
          [390,288],[426,288],[462,288],[504,288],[546,288],
          [654,288],[696,288],[738,288],[780,288],[816,288],
          [390,338],[444,338],[498,338],
          [702,338],[756,338],[810,338],
        ].map(([x,y],i)=>(
          <rect key={i} x={x} y={y} width={10} height={15} rx={5}
            fill="url(#winColor)" opacity={.3+((i*5)%12)*.025} filter="url(#winGlow)"
          />
        ))}

        {/* ── GRAND CENTRAL TOWER ── tallest, iconic */}
        <rect x="548" y="88" width="104" height="412" fill="url(#towerFill)"/>
        {/* Battlements */}
        {Array.from({length:9},(_,i)=>(
          <rect key={i} x={546+i*14} y="72" width="10" height="20" rx="1" fill="#060c14"/>
        ))}
        <path d="M543,88 L600,22 L657,88Z" fill="#0a1524"/>
        {/* Tall spire */}
        <line x1="600" y1="22" x2="600" y2="-15" stroke="#0e1e30" strokeWidth="4"/>
        <polygon points="595,-15 600,-42 605,-15" fill="#0e1e30"/>
        {/* Flag */}
        <path d="M600,-42 L624,-32 L600,-22Z" fill="#1a2a44"/>
        {/* Large windows - grand tower */}
        {[[562,110],[578,110],[596,110],[612,110],[628,110],
          [558,148],[578,148],[598,148],[618,148],[638,148],
          [558,190],[578,190],[598,190],[618,190],[638,190],
          [558,232],[578,232],[598,232],[618,232],[638,232],
          [562,278],[582,278],[598,278],[618,278],[632,278],
        ].map(([x,y],i)=>(
          <rect key={i} x={x} y={y} width={12} height={16} rx={6}
            fill="url(#winColor)" opacity={.45+i*.008} filter="url(#winGlow)"
          />
        ))}
        {/* Rose window - great hall */}
        <circle cx="600" cy="162" r="18" fill="none" stroke="rgba(180,130,50,0.25)" strokeWidth="1"/>
        <circle cx="600" cy="162" r="11" fill="rgba(180,120,40,0.18)" filter="url(#winGlow)"/>
        {[0,45,90,135].map((a,i)=>(
          <line key={i}
            x1={600+Math.cos(a*Math.PI/180)*5} y1={162+Math.sin(a*Math.PI/180)*5}
            x2={600+Math.cos(a*Math.PI/180)*15} y2={162+Math.sin(a*Math.PI/180)*15}
            stroke="rgba(180,130,50,0.3)" strokeWidth="0.8"/>
        ))}

        {/* ── RIGHT TALL TOWER ── */}
        <rect x="835" y="178" width="60" height="322" fill="url(#towerFill)"/>
        {[835,848,861,874,887].map((x,i)=>(
          <rect key={i} x={x} y="163" width="10" height="18" rx="1" fill="#060c14"/>
        ))}
        <path d="M831,178 L865,118 L899,178Z" fill="#09121e"/>
        <line x1="865" y1="118" x2="865" y2="82" stroke="#0c1828" strokeWidth="3.5"/>
        <polygon points="861,82 865,58 869,82" fill="#0c1828"/>
        {[[845,205],[860,205],[845,238],[860,238],[845,272],[860,272],[845,308],[860,308],[845,342],[860,342]].map(([x,y],i)=>(
          <rect key={i} x={x} y={y} width={8} height={12} rx={4} fill="url(#winColor)" opacity={.32+i*.028} filter="url(#winGlow)"/>
        ))}

        {/* Right outer section */}
        <rect x="895" y="258" width="120" height="242" fill="url(#castleFill)"/>
        {[895,908,921,934,947,960,972,984,996,1008].map((x,i)=>(
          <rect key={i} x={x} y="244" width="9" height="16" rx="1" fill="#070e18"/>
        ))}

        {/* Far right tower */}
        <rect x="1005" y="220" width="46" height="280" fill="url(#towerFill)"/>
        {[1005,1017,1029,1041].map((x,i)=>(
          <rect key={i} x={x} y="206" width="9" height="16" rx="1" fill="#060c14"/>
        ))}
        <path d="M1002,220 L1028,172 L1054,220Z" fill="#09121e"/>
        <line x1="1028" y1="172" x2="1028" y2="142" stroke="#0c1828" strokeWidth="3"/>
        <polygon points="1024,142 1028,118 1032,142" fill="#0c1828"/>

        {/* ── VIADUCT — iconic HP element ── */}
        <rect x="160" y="338" width="168" height="16" fill="#06101a"/>
        {[172,195,218,242,266,290,312].map((x,i)=>(
          <rect key={i} x={x} y="322" width="12" height="34" fill="#06101a" rx="1"/>
        ))}
        {[176,200,224,248,272,296].map((x,i)=>(
          <path key={i} d={`M${x},338 Q${x+11},350 ${x+22},338`} fill="#040c14"/>
        ))}

        {/* ── BLACK LAKE ── */}
        <ellipse cx="600" cy="486" rx="520" ry="28" fill="#04090f" opacity="0.9"/>
        <ellipse cx="600" cy="484" rx="380" ry="16" fill="rgba(20,35,60,.8)"/>
        {/* Warm reflection */}
        <ellipse cx="600" cy="482" rx="200" ry="7" fill="rgba(180,130,50,.07)"/>
        {/* Castle tower reflections */}
        {[[335,488],[600,490],[865,488]].map(([x,y],i)=>(
          <ellipse key={i} cx={x} cy={y} rx={3} ry={1.5} fill="rgba(180,130,50,.12)"/>
        ))}
        <path d="M440,485 Q520,492 600,488 Q680,492 760,485" stroke="rgba(180,130,50,.06)" strokeWidth="1.5" fill="none"/>

        {/* Sky fade overlay at very top */}
        <rect x="0" y="0" width="1200" height="220" fill="url(#skyline)" opacity="0.4"/>

        {/* Ground fog at base */}
        <path d="M0,480 Q300,462 600,470 Q900,462 1200,480 L1200,500 L0,500Z" fill="#03080f" opacity="0.85"/>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   WAND LIGHT — the blue spell effect from Legacy poster
═══════════════════════════════════════════════════ */
export function WandLight({ style = {} }) {
  return (
    <div style={{
      width: 14, height: 14, borderRadius: "50%",
      background: "radial-gradient(circle, #a0c8ff 0%, #6090ff 35%, rgba(60,80,255,.3) 70%, transparent 100%)",
      animation: "wandGlow 2.5s ease-in-out infinite",
      ...style,
    }}/>
  );
}

/* ═══════════════════════════════════════════════════
   RUNE RING
═══════════════════════════════════════════════════ */
export function RuneRing({ size = 100 }) {
  const runes = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ";
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ position:"absolute", inset:0, animation:"runeRotate 25s linear infinite" }}>
        <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(180,140,60,0.15)" strokeWidth="0.8"/>
        <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(180,140,60,0.08)" strokeWidth="0.5"/>
        {Array.from({length:12},(_,i)=>{
          const a=(i*30-90)*Math.PI/180;
          const x=50+42*Math.cos(a), y=50+42*Math.sin(a);
          return <text key={i} x={x} y={y} fontSize="6" fill="rgba(180,140,60,.35)" textAnchor="middle" dominantBaseline="middle" fontFamily="serif">{runes[i%runes.length]}</text>;
        })}
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ color:"rgba(180,140,60,.7)", fontSize:size*.28, lineHeight:1, filter:"drop-shadow(0 0 8px rgba(180,140,60,.4))" }}>⚡</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   GOLD DIVIDER
═══════════════════════════════════════════════════ */
export function Divider({ style = {} }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, width:"100%", ...style }}>
      <div style={{ flex:1, height:"1px", background:"linear-gradient(90deg,transparent,rgba(180,140,60,.3))" }}/>
      <span style={{ color:"rgba(180,140,60,.45)", fontSize:"9px", letterSpacing:0 }}>◆</span>
      <div style={{ flex:1, height:"1px", background:"linear-gradient(90deg,rgba(180,140,60,.3),transparent)" }}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CARD — dark glass with gold border
═══════════════════════════════════════════════════ */
export function Card({ children, glow = false, style = {} }) {
  return (
    <div style={{
      width:"100%",
      background:"linear-gradient(145deg,rgba(12,18,30,.92) 0%,rgba(8,14,24,.96) 100%)",
      backdropFilter:"blur(12px)",
      border:`1px solid rgba(180,140,60,${glow?.42:.18})`,
      borderRadius:4,
      padding:"26px 24px",
      position:"relative",
      overflow:"hidden",
      boxShadow: glow
        ? "0 0 40px rgba(180,140,60,.1),0 24px 64px rgba(0,0,0,.65),inset 0 0 24px rgba(0,0,0,.4)"
        : "0 20px 60px rgba(0,0,0,.55),inset 0 0 20px rgba(0,0,0,.3)",
      animation: glow ? "borderPulse 3s ease-in-out infinite" : "none",
      ...style,
    }}>
      {/* Subtle grain */}
      <div style={{ position:"absolute",inset:0,background:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.035'/%3E%3C/svg%3E\")",pointerEvents:"none",zIndex:0,opacity:.5 }}/>
      <div style={{ position:"relative", zIndex:1 }}>{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   BUTTON
═══════════════════════════════════════════════════ */
export function Btn({ children, onClick, variant="gold", disabled=false, style={} }) {
  const v = {
    gold:    { bg:"linear-gradient(135deg,rgba(30,22,8,.95),rgba(22,16,6,.98))", bdr:"rgba(180,140,60,.55)", col:"rgba(200,165,80,.95)", sh:"rgba(180,140,60,.18)" },
    crimson: { bg:"linear-gradient(135deg,rgba(28,8,8,.95),rgba(20,6,6,.98))",  bdr:"rgba(160,40,40,.55)",  col:"rgba(200,80,80,.9)",   sh:"rgba(160,40,40,.2)" },
    blue:    { bg:"linear-gradient(135deg,rgba(8,18,32,.95),rgba(6,12,24,.98))", bdr:"rgba(80,120,200,.5)", col:"rgba(120,165,240,.9)", sh:"rgba(80,120,200,.2)" },
    ghost:   { bg:"rgba(255,255,255,.04)",                                         bdr:"rgba(255,255,255,.1)", col:"rgba(180,190,210,.55)", sh:"transparent" },
  }[variant]||{bg:"",bdr:"",col:"",sh:""};
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding:"15px 38px",
      background: disabled ? "rgba(255,255,255,.04)" : v.bg,
      border:`1px solid ${disabled?"rgba(255,255,255,.06)":v.bdr}`,
      color: disabled ? "rgba(180,185,200,.2)" : v.col,
      fontFamily:"'Cinzel',serif", fontSize:".82rem", letterSpacing:".22em",
      cursor:disabled?"default":"pointer", borderRadius:2,
      boxShadow: disabled?"none":`0 0 20px ${v.sh},inset 0 0 20px rgba(0,0,0,.35)`,
      transition:"all .4s cubic-bezier(.23,1,.32,1)",
      animation: disabled?"none":"none",
      ...style,
    }}>{children}</button>
  );
}

/* ═══════════════════════════════════════════════════
   TITLE COMPONENT
═══════════════════════════════════════════════════ */
export function Title({ eyebrow, children, sub, size="clamp(1.5rem,5.5vw,2.4rem)", align="center" }) {
  return (
    <div style={{ textAlign:align }}>
      {eyebrow && <p style={{ fontFamily:"'Cinzel',serif",fontSize:".58rem",letterSpacing:".55em",color:"rgba(180,140,60,.5)",marginBottom:12,textTransform:"uppercase" }}>{eyebrow}</p>}
      <h2 style={{ fontFamily:"'Cinzel',serif",fontWeight:600,fontSize:size,color:"rgba(200,165,80,.95)",letterSpacing:".05em",lineHeight:1.18,textShadow:"0 0 50px rgba(180,140,60,.3),0 2px 4px rgba(0,0,0,.8)" }}>{children}</h2>
      {sub && <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(.9rem,2.8vw,1.08rem)",color:"rgba(180,190,215,.65)",letterSpacing:".1em",marginTop:10,fontStyle:"italic",lineHeight:1.6 }}>{sub}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE WRAPPER — full cinematic layout
═══════════════════════════════════════════════════ */
export function Page({ children, variant="night", castle=true, particles=true }) {
  return (
    <div style={{ minHeight:"100vh",position:"relative",overflowX:"hidden",overflowY:"auto",paddingBottom: castle?280:60,display:"flex",flexDirection:"column",alignItems:"center" }}>
      <style>{G}</style>
      <CinematicBG variant={variant}/>
      {particles && <Particles count={40}/>}
      {castle && <Castle/>}
      <div style={{ width:"100%",maxWidth:560,padding:"52px 22px 24px",display:"flex",flexDirection:"column",alignItems:"center",gap:26,position:"relative",zIndex:10 }}>
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TRANSITION SCREEN
═══════════════════════════════════════════════════ */
export function Transition({ label="", onDone }) {
  useEffect(()=>{ const t=setTimeout(onDone,2600); return()=>clearTimeout(t); },[]);
  return (
    <div style={{ position:"fixed",inset:0,background:"#03080f",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:999 }} className="fi">
      <style>{G}</style>
      <CinematicBG variant="night"/>
      <Particles count={50}/>
      <div style={{ position:"relative",zIndex:10,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:20 }}>
        <RuneRing size={90}/>
        <div style={{ marginTop:12 }}>
          <p style={{ fontFamily:"'Cinzel',serif",color:"rgba(200,165,80,.9)",fontSize:"clamp(.82rem,3.5vw,1.1rem)",letterSpacing:".35em",animation:"breathe 2s infinite" }}>{label}</p>
          <Divider style={{ maxWidth:260,margin:"16px auto" }}/>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",color:"rgba(180,190,215,.45)",fontSize:".88rem",letterSpacing:".15em",fontStyle:"italic" }}>The next chapter unfolds...</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CONFETTI
═══════════════════════════════════════════════════ */
export function Confetti() {
  const p=Array.from({length:55},(_,i)=>({id:i,left:`${Math.random()*100}%`,color:["#c8a84c","#8b1a1a","#1a4a2a","#d4b870","#b8b8c8","#7a6530"][i%6],size:`${4+Math.random()*7}px`,delay:`${Math.random()*2.2}s`,dur:`${3+Math.random()*2.5}s`,br:i%4===0?"50%":"1px"}));
  return <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:990}}>{p.map(c=><div key={c.id} style={{position:"absolute",top:"-30px",left:c.left,width:c.size,height:c.size,background:c.color,borderRadius:c.br,animation:`confettiFall ${c.dur} ${c.delay} ease-in forwards`,boxShadow:`0 0 4px ${c.color}66`}}/>)}</div>;
}

/* ═══════════════════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════════════════ */
export function useTypewriter(text, speed=26, active=true) {
  const [out,setOut]=useState("");
  const [done,setDone]=useState(false);
  useEffect(()=>{
    if(!active){setOut("");setDone(false);return;}
    setOut("");setDone(false);let i=0;
    const iv=setInterval(()=>{if(i<text.length)setOut(text.slice(0,++i));else{setDone(true);clearInterval(iv);}},speed);
    return()=>clearInterval(iv);
  },[text,active]);
  return{out,done};
}
