import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   DESIGN SYSTEM — Cinematic Dark Fantasy
   Palette: Near-black bg · Aged gold · Deep crimson · Emerald · Silver
   Aesthetic: HP film poster · luxury editorial · atmospheric depth
═══════════════════════════════════════════════════════════════ */
export const THEME = {
  bg:        "#06050a",
  bg2:       "#0c0a12",
  bg3:       "#100e18",
  gold:      "#c9a84c",
  goldLight: "#e8c96d",
  goldDim:   "#7a6530",
  crimson:   "#8b1a1a",
  crimsonL:  "#b52020",
  emerald:   "#1a4a2a",
  emeraldL:  "#2a6a3a",
  silver:    "#b8b8c8",
  silverDim: "#6a6a7a",
  parchment: "#f0e4c0",
  parchDark: "#c8b490",
  fog:       "rgba(180,170,220,0.04)",
};

export const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;900&family=IM+Fell+English:ital@0;1&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&display=swap');
`;

/* ═══════════════════════════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════════════════════════ */
export const G = `
${FONTS}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{width:100%;min-height:100vh;background:${THEME.bg};overflow-x:hidden;}
::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-track{background:#06050a;}
::-webkit-scrollbar-thumb{background:#c9a84c55;border-radius:2px;}

@keyframes fadeIn       {from{opacity:0}to{opacity:1}}
@keyframes fadeUp       {from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeLeft     {from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}
@keyframes fadeRight    {from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
@keyframes goldPulse    {0%,100%{opacity:.6}50%{opacity:1}}
@keyframes shimmer      {0%{background-position:200% center}100%{background-position:-200% center}}
@keyframes runeRotate   {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes breathe      {0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.04);opacity:1}}
@keyframes lightning    {0%,88%,100%{opacity:0}90%,96%{opacity:.06}93%,99%{opacity:0}}
@keyframes fog          {0%{transform:translateX(0) scaleY(1)}100%{transform:translateX(-40px) scaleY(1.05)}}
@keyframes particleDrift{0%{transform:translateY(0) translateX(0);opacity:0}10%{opacity:1}90%{opacity:.4}100%{transform:translateY(-80vh) translateX(30px);opacity:0}}
@keyframes glowPulse    {0%,100%{box-shadow:0 0 20px rgba(201,168,76,.15),inset 0 0 20px rgba(201,168,76,.04)}50%{box-shadow:0 0 40px rgba(201,168,76,.35),inset 0 0 30px rgba(201,168,76,.08)}}
@keyframes borderFlow   {0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes castleGlow   {0%,100%{filter:drop-shadow(0 0 8px rgba(201,168,76,.15))}50%{filter:drop-shadow(0 0 20px rgba(201,168,76,.35))}}
@keyframes spellBeam    {0%{width:0;opacity:1}80%{opacity:1}100%{width:100%;opacity:0}}
@keyframes countUp      {from{transform:scale(.9);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes stampDrop    {0%{transform:scale(4) rotate(-15deg) translateY(-40px);opacity:0}70%{transform:scale(.95) rotate(-6deg);opacity:1}100%{transform:scale(1) rotate(-6deg);opacity:1}}
@keyframes confettiHP   {0%{transform:translateY(-30px) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(540deg);opacity:0}}
@keyframes lockPulse    {0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,0)}50%{box-shadow:0 0 0 6px rgba(201,168,76,.15)}}
@keyframes alertReveal  {0%{opacity:0;transform:translateY(30px) scale(.95)}100%{opacity:1;transform:translateY(0) scale(1)}}
@keyframes wandGlow     {0%,100%{filter:drop-shadow(0 0 6px #c9a84c)}50%{filter:drop-shadow(0 0 18px #c9a84c) drop-shadow(0 0 40px rgba(201,168,76,.4))}}
@keyframes textReveal   {0%{clip-path:inset(0 100% 0 0)}100%{clip-path:inset(0 0% 0 0)}}
@keyframes orbFloat     {0%,100%{transform:translateY(0) rotate(0deg)}33%{transform:translateY(-12px) rotate(5deg)}66%{transform:translateY(-6px) rotate(-3deg)}}

.fi   {animation:fadeIn  .7s ease forwards}
.fiu  {animation:fadeUp  .8s ease forwards}
.fil  {animation:fadeLeft .7s ease forwards}
.fir  {animation:fadeRight .7s ease forwards}
.breathe{animation:breathe 4s ease-in-out infinite}
.goldPulse{animation:goldPulse 3s ease-in-out infinite}

button:not([disabled]):hover{
  transform:translateY(-2px) !important;
  box-shadow:0 8px 30px rgba(201,168,76,.25) !important;
}
`;

/* ═══════════════════════════════════════════════════════════════
   CANVAS PARTICLE SYSTEM — magical dust
═══════════════════════════════════════════════════════════════ */
export function MagicParticles({ count = 55, color = "#c9a84c" }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: H + Math.random() * 200,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(0.2 + Math.random() * 0.5),
      size: 0.8 + Math.random() * 1.8,
      alpha: Math.random(),
      alphaDir: Math.random() > 0.5 ? 0.005 : -0.005,
      hue: Math.random() * 30 - 15,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.alphaDir;
        if (p.alpha > 0.8 || p.alpha < 0.1) p.alphaDir *= -1;
        if (p.y < -20) { p.y = H + 20; p.x = Math.random() * W; }

        ctx.save();
        ctx.globalAlpha = p.alpha * 0.7;
        ctx.fillStyle = color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf); };
  }, []);

  return <canvas ref={canvasRef} style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:1, opacity:.6 }}/>;
}

/* ═══════════════════════════════════════════════════════════════
   VOLUMETRIC FOG LAYERS
═══════════════════════════════════════════════════════════════ */
export function FogLayers() {
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:2, overflow:"hidden" }}>
      {[
        { bottom:"0%", height:"35%", opacity:.55, dur:"18s", delay:"0s" },
        { bottom:"10%", height:"25%", opacity:.35, dur:"24s", delay:"-8s" },
        { bottom:"20%", height:"18%", opacity:.2,  dur:"30s", delay:"-15s" },
      ].map((f, i) => (
        <div key={i} style={{
          position:"absolute", left:"-5%", right:"-5%",
          bottom:f.bottom, height:f.height,
          background:"radial-gradient(ellipse at 50% 100%, rgba(140,130,180,0.12) 0%, transparent 70%)",
          animation:`fog ${f.dur} ${f.delay} ease-in-out infinite alternate`,
          opacity:f.opacity,
          filter:"blur(18px)",
        }}/>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ATMOSPHERIC LIGHTNING
═══════════════════════════════════════════════════════════════ */
export function AtmosphericLightning() {
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, animation:"lightning 7s infinite", background:"rgba(180,200,255,0.05)" }}/>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HOGWARTS CASTLE — cinematic SVG, no cartoons
═══════════════════════════════════════════════════════════════ */
export function CinematicCastle() {
  return (
    <svg viewBox="0 0 1000 420" style={{ position:"fixed", bottom:0, left:0, right:0, width:"100%", pointerEvents:"none", zIndex:3, animation:"castleGlow 6s ease-in-out infinite" }} preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="skyFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#06050a" stopOpacity="0"/>
          <stop offset="100%" stopColor="#06050a" stopOpacity="1"/>
        </linearGradient>
        <linearGradient id="castleStone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1824"/>
          <stop offset="100%" stopColor="#0e0c14"/>
        </linearGradient>
        <linearGradient id="towerGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#161420"/>
          <stop offset="100%" stopColor="#0a0810"/>
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="windowGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#ff8800" stopOpacity="0.2"/>
        </radialGradient>
        <radialGradient id="castleAura" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.08"/>
          <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Castle ambient aura */}
      <ellipse cx="500" cy="380" rx="450" ry="60" fill="url(#castleAura)"/>

      {/* Far mountain range */}
      <path d="M0,300 L80,220 L150,268 L220,195 L300,248 L380,178 L460,235 L540,185 L620,240 L700,190 L780,235 L860,180 L940,220 L1000,200 L1000,420 L0,420Z" fill="#0c0a14" opacity="0.8"/>
      <path d="M0,330 L100,268 L200,298 L320,255 L440,278 L560,260 L680,275 L800,258 L920,272 L1000,265 L1000,420 L0,420Z" fill="#0e0c16" opacity="0.9"/>

      {/* Stone texture base — castle body */}
      {/* Left far tower */}
      <rect x="115" y="168" width="36" height="220" fill="url(#towerGrad)"/>
      {/* Battlements */}
      {[115,124,133,142].map((x,i)=><rect key={i} x={x} y="158" width="7" height="14" rx="1" fill="#14121e"/>)}
      <path d="M113,168 L133,125 L153,168Z" fill="#13111c"/>
      {/* Left tower flag pole */}
      <line x1="133" y1="125" x2="133" y2="108" stroke="#4a3a20" strokeWidth="1.5"/>
      <path d="M133,108 L148,114 L133,120Z" fill="#8b1a1a"/>

      {/* Left main tower */}
      <rect x="188" y="128" width="44" height="250" fill="url(#castleStone)"/>
      {[188,198,208,218,228].map((x,i)=><rect key={i} x={x} y="118" width="8" height="14" rx="1" fill="#12101a"/>)}
      <path d="M185,128 L210,82 L235,128Z" fill="#141220"/>
      <line x1="210" y1="82" x2="210" y2="62" stroke="#4a3a20" strokeWidth="1.5"/>
      <path d="M210,62 L228,70 L210,78Z" fill="#1a3a6b"/>

      {/* Left wing building */}
      <rect x="232" y="195" width="140" height="183" fill="url(#castleStone)"/>
      {Array.from({length:11},(_,i)=><rect key={i} x={232+i*14} y="185" width="8" height="13" rx="1" fill="#12101a"/>)}
      {/* Wing windows */}
      {[[248,220],[276,220],[304,220],[248,250],[276,250],[304,250]].map(([x,y],i)=>(
        <rect key={i} x={x} y={y} width={8} height={12} rx={4} fill="url(#windowGlow)" opacity={.4+i*.05} filter="url(#glow)"/>
      ))}

      {/* Central grand tower — tallest */}
      <rect x="430" y="68" width="80" height="310" fill="url(#castleStone)"/>
      {Array.from({length:8},(_,i)=><rect key={i} x={428+i*12} y="56" width="9" height="16" rx="1" fill="#13111c"/>)}
      <path d="M425,68 L470,18 L515,68Z" fill="#14121e"/>
      <line x1="470" y1="18" x2="470" y2="-2" stroke="#5a4a28" strokeWidth="2"/>
      <path d="M470,-2 L490,8 L470,18Z" fill="#1a3a6b"/>
      {/* Grand tower windows */}
      {[[444,95],[466,95],[444,130],[466,130],[444,165],[466,165],[444,200],[466,200]].map(([x,y],i)=>(
        <rect key={i} x={x} y={y} width={10} height={14} rx={5} fill="url(#windowGlow)" opacity={.55+i*.03} filter="url(#glow)"/>
      ))}
      {/* Great hall rose window */}
      <circle cx="470" cy="110" r="14" fill="none" stroke="#c9a84c" strokeWidth="0.8" opacity="0.3"/>
      <circle cx="470" cy="110" r="8"  fill="#ff8800" opacity="0.2" filter="url(#softGlow)"/>
      {[0,45,90,135].map((a,i)=>(
        <line key={i} x1={470+Math.cos(a*Math.PI/180)*4} y1={110+Math.sin(a*Math.PI/180)*4}
          x2={470+Math.cos(a*Math.PI/180)*12} y2={110+Math.sin(a*Math.PI/180)*12}
          stroke="#c9a84c" strokeWidth="0.6" opacity="0.4"/>
      ))}

      {/* Main castle body */}
      <rect x="372" y="155" width="316" height="223" fill="url(#castleStone)"/>
      {Array.from({length:24},(_,i)=><rect key={i} x={372+i*14} y="143" width="8" height="15" rx="1" fill="#12101a"/>)}
      {/* Body windows */}
      {[
        [390,185],[418,185],[446,185],[474,185],[502,185],[530,185],[558,185],[586,185],[614,185],
        [390,220],[418,220],[474,220],[530,220],[586,220],[614,220],
        [390,255],[446,255],[502,255],[558,255],[614,255],
      ].map(([x,y],i)=>(
        <rect key={i} x={x} y={y} width={9} height={13} rx={4.5}
          fill="url(#windowGlow)" opacity={.35+((i*3)%8)*.04} filter="url(#glow)"/>
      ))}

      {/* Right wing */}
      <rect x="688" y="198" width="130" height="180" fill="url(#castleStone)"/>
      {Array.from({length:10},(_,i)=><rect key={i} x={688+i*14} y="188" width="8" height="13" rx="1" fill="#12101a"/>)}
      {[[700,225],[726,225],[752,225],[700,255],[726,255],[752,255]].map(([x,y],i)=>(
        <rect key={i} x={x} y={y} width={8} height={12} rx={4} fill="url(#windowGlow)" opacity={.4+i*.05} filter="url(#glow)"/>
      ))}

      {/* Astronomy tower — right, very tall */}
      <rect x="745" y="82" width="38" height="296" fill="url(#towerGrad)"/>
      {[745,754,763,772,781].map((x,i)=><rect key={i} x={x} y="70" width="7" height="15" rx="1" fill="#13111c"/>)}
      <path d="M742,82 L764,30 L786,82Z" fill="#14121e"/>
      <line x1="764" y1="30" x2="764" y2="10" stroke="#4a3a20" strokeWidth="1.5"/>
      <path d="M764,10 L780,18 L764,26Z" fill="#8b1a1a"/>
      {/* Astronomy windows */}
      {[[750,105],[762,105],[750,130],[762,130],[750,155],[762,155],[750,180],[762,180],[750,205],[762,205]].map(([x,y],i)=>(
        <rect key={i} x={x} y={y} width={7} height={10} rx={3.5} fill="url(#windowGlow)" opacity={.4+i*.03} filter="url(#glow)"/>
      ))}

      {/* Right far tower */}
      <rect x="828" y="185" width="32" height="193" fill="url(#towerGrad)"/>
      {[828,836,844,852].map((x,i)=><rect key={i} x={x} y="175" width="6" height="13" rx="1" fill="#13111c"/>)}
      <path d="M826,185 L844,148 L862,185Z" fill="#141220"/>

      {/* Viaduct / bridge left */}
      <rect x="108" y="252" width="112" height="18" fill="#0e0c16"/>
      {[118,135,152,169,186,203].map((x,i)=><rect key={i} x={x} y="240" width="10" height="32" fill="#0d0b14" rx="1"/>)}
      {/* Arch shadows under viaduct */}
      {[122,139,156,173,190].map((x,i)=><path key={i} d={`M${x},252 Q${x+7},264 ${x+14},252`} fill="#08060e"/>)}

      {/* Covered walkways / connectors */}
      <rect x="370" y="218" width="8" height="60" fill="#0e0c16"/>
      <rect x="688" y="218" width="8" height="60" fill="#0e0c16"/>

      {/* Forbidden Forest — LEFT, layered depth */}
      <path d="M0,370 L0,248 L22,210 L38,242 L55,198 L72,235 L88,204 L105,238 L122,215 L135,258 L150,230 L164,268 L178,248 L192,378Z" fill="#08060c" opacity="0.95"/>
      <path d="M0,378 L0,270 L16,240 L28,265 L42,228 L58,258 L72,235 L86,262 L100,245 L116,274 L130,255 L144,280 L158,265 L172,378Z" fill="#050309" opacity="1"/>

      {/* Forbidden Forest — RIGHT */}
      <path d="M1000,370 L1000,248 L978,210 L962,242 L945,198 L928,235 L912,204 L895,238 L878,215 L865,258 L850,230 L836,268 L822,248 L808,378Z" fill="#08060c" opacity="0.95"/>
      <path d="M1000,378 L1000,270 L984,240 L972,265 L958,228 L942,258 L928,235 L914,262 L900,245 L884,274 L870,255 L856,280 L842,265 L828,378Z" fill="#050309"/>

      {/* Black Lake — reflective */}
      <ellipse cx="500" cy="400" rx="380" ry="24" fill="#08060e"/>
      <ellipse cx="500" cy="398" rx="280" ry="14" fill="rgba(30,28,50,0.8)"/>
      {/* Lake gold shimmer */}
      <ellipse cx="500" cy="396" rx="180" ry="6" fill="rgba(201,168,76,0.06)"/>
      <path d="M350,398 Q430,408 500,402 Q570,408 650,398" stroke="rgba(201,168,76,0.08)" strokeWidth="1.5" fill="none"/>
      {/* Reflection of tower lights */}
      {[[430,405],[450,408],[470,410],[490,406],[510,406],[530,408],[550,406]].map(([x,y],i)=>(
        <ellipse key={i} cx={x} cy={y} rx={2} ry={1.2} fill="#c9a84c" opacity={0.1+i*.01}/>
      ))}

      {/* Atmospheric haze at base */}
      <rect x="0" y="360" width="1000" height="60" fill="url(#skyFade)"/>

      {/* Subtle stone texture lines on towers */}
      {[210,230,250,270,290,310].map((y,i)=>(
        <line key={i} x1="188" y1={y} x2="232" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
      ))}
      {[170,195,220,245,270].map((y,i)=>(
        <line key={i} x1="430" y1={y} x2="510" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GOLDEN RUNE RING — decorative, mature
═══════════════════════════════════════════════════════════════ */
export function RuneRing({ size = 120 }) {
  const runes = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ";
  return (
    <div style={{ position:"relative", width:size, height:size }}>
      <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:`1px solid rgba(201,168,76,0.2)`, animation:"runeRotate 20s linear infinite" }}>
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} style={{
            position:"absolute", left:"50%", top:"50%",
            transform:`rotate(${i*30}deg) translateY(-${size/2-8}px) translateX(-50%)`,
            color:"#c9a84c", fontSize:size/12, opacity:0.4,
            fontFamily:"serif", letterSpacing:0,
          }}>{runes[i % runes.length]}</span>
        ))}
      </div>
      <div style={{ position:"absolute", inset:8, borderRadius:"50%", border:`1px solid rgba(201,168,76,0.1)` }}/>
      <div style={{ position:"absolute", inset:"50%", transform:"translate(-50%,-50%)", color:"#c9a84c", fontSize:size/3, animation:"wandGlow 3s ease-in-out infinite", lineHeight:1 }}>⚡</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAGIC ORB — floating light sphere, cinematic
═══════════════════════════════════════════════════════════════ */
export function MagicOrb({ size = 80, color = "#c9a84c", style = {} }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `radial-gradient(circle at 35% 35%, ${color}44 0%, ${color}11 50%, transparent 70%)`,
      border: `1px solid ${color}33`,
      boxShadow: `0 0 ${size/2}px ${color}22, inset 0 0 ${size/3}px ${color}11`,
      animation: "orbFloat 5s ease-in-out infinite",
      ...style,
    }}/>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PARCHMENT CARD — aged, textured appearance
═══════════════════════════════════════════════════════════════ */
export function ParchmentCard({ children, style = {}, glowing = false }) {
  return (
    <div style={{
      width: "100%",
      background: `linear-gradient(145deg, #141020 0%, #0f0d1a 40%, #131028 100%)`,
      border: `1px solid rgba(201,168,76,${glowing ? "0.5" : "0.18"})`,
      borderRadius: 3,
      padding: "24px 22px",
      position: "relative",
      overflow: "hidden",
      boxShadow: glowing
        ? "0 0 40px rgba(201,168,76,0.12), 0 20px 60px rgba(0,0,0,0.6), inset 0 0 30px rgba(201,168,76,0.03)"
        : "0 20px 60px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.3)",
      animation: glowing ? "glowPulse 3s ease-in-out infinite" : "none",
      ...style,
    }}>
      {/* Corner ornaments */}
      <div style={{ position:"absolute", top:8, left:8, color:"rgba(201,168,76,0.3)", fontSize:10, lineHeight:1 }}>✦</div>
      <div style={{ position:"absolute", top:8, right:8, color:"rgba(201,168,76,0.3)", fontSize:10, lineHeight:1 }}>✦</div>
      <div style={{ position:"absolute", bottom:8, left:8, color:"rgba(201,168,76,0.3)", fontSize:10, lineHeight:1 }}>✦</div>
      <div style={{ position:"absolute", bottom:8, right:8, color:"rgba(201,168,76,0.3)", fontSize:10, lineHeight:1 }}>✦</div>
      {/* Subtle grain overlay */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")", opacity:0.4, pointerEvents:"none" }}/>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DIVIDER — ornamental gold line
═══════════════════════════════════════════════════════════════ */
export function GoldDivider({ style = {} }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, width:"100%", ...style }}>
      <div style={{ flex:1, height:"1px", background:"linear-gradient(90deg,transparent,rgba(201,168,76,0.3))" }}/>
      <span style={{ color:"rgba(201,168,76,0.5)", fontSize:10 }}>✦</span>
      <div style={{ flex:1, height:"1px", background:"linear-gradient(90deg,rgba(201,168,76,0.3),transparent)" }}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CINEMATIC BUTTON
═══════════════════════════════════════════════════════════════ */
export function CineBtn({ children, onClick, variant="gold", disabled=false, style={} }) {
  const variants = {
    gold:    { bg:"linear-gradient(135deg,#2a1f08,#1e1608)", border:"rgba(201,168,76,0.6)", color:"#c9a84c", shadow:"rgba(201,168,76,0.2)" },
    crimson: { bg:"linear-gradient(135deg,#1e0808,#160606)", border:"rgba(139,26,26,0.7)",  color:"#c04040", shadow:"rgba(139,26,26,0.25)" },
    emerald: { bg:"linear-gradient(135deg,#081e10,#061208)", border:"rgba(26,100,50,0.7)",  color:"#40a060", shadow:"rgba(26,100,50,0.2)" },
    ghost:   { bg:"rgba(255,255,255,0.03)",                   border:"rgba(255,255,255,0.1)",color:"rgba(184,184,200,0.6)", shadow:"transparent" },
  };
  const v = variants[variant] || variants.gold;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding:"14px 36px",
      background: disabled ? "rgba(255,255,255,0.03)" : v.bg,
      border:`1px solid ${disabled ? "rgba(255,255,255,0.06)" : v.border}`,
      color: disabled ? "rgba(184,184,200,0.2)" : v.color,
      fontFamily:"'Cinzel', serif", fontSize:".85rem", letterSpacing:"0.2em",
      cursor: disabled ? "default" : "pointer", borderRadius:2,
      boxShadow: disabled ? "none" : `0 0 20px ${v.shadow}, inset 0 0 15px rgba(0,0,0,0.3)`,
      transition:"all 0.4s cubic-bezier(0.23,1,0.32,1)",
      position:"relative", overflow:"hidden",
      ...style,
    }}>
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SPELL TRANSITION — cinematic wipe
═══════════════════════════════════════════════════════════════ */
export function CineTransition({ label = "", onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position:"fixed", inset:0, background:THEME.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", zIndex:999 }} className="fi">
      <style>{G}</style>
      <MagicParticles count={40}/>
      <div style={{ position:"relative", zIndex:10, textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:20 }}>
        <RuneRing size={100}/>
        <div style={{ marginTop:16 }}>
          <p style={{ color:THEME.gold, fontFamily:"'Cinzel', serif", fontSize:"clamp(.85rem,3.5vw,1.2rem)", letterSpacing:"0.35em", textAlign:"center", animation:"breathe 2s ease-in-out infinite" }}>
            {label}
          </p>
          <GoldDivider style={{ marginTop:16, maxWidth:260 }}/>
          <p style={{ color:THEME.goldDim, fontFamily:"'Cormorant Garamond', serif", fontSize:".9rem", letterSpacing:"0.15em", marginTop:10, fontStyle:"italic" }}>
            The next chapter unfolds...
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CONFETTI — subtle gold/crimson
═══════════════════════════════════════════════════════════════ */
export function CineConfetti() {
  const pieces = Array.from({ length: 55 }, (_, i) => ({
    id:i, left:`${Math.random()*100}%`,
    color:["#c9a84c","#8b1a1a","#1a4a2a","#e8c96d","#b8b8c8","#7a6530"][i%6],
    size:`${4+Math.random()*7}px`,
    delay:`${Math.random()*2}s`, dur:`${3+Math.random()*2}s`,
    br: i%4===0?"50%":"1px",
  }));
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:990 }}>
      {pieces.map(p=>(
        <div key={p.id} style={{ position:"absolute", top:"-30px", left:p.left, width:p.size, height:p.size, background:p.color, borderRadius:p.br, animation:`confettiHP ${p.dur} ${p.delay} ease-in forwards`, boxShadow:`0 0 4px ${p.color}66` }}/>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION TITLE — cinematic typography
═══════════════════════════════════════════════════════════════ */
export function CineTitle({ children, sub, eyebrow, align="center", size="clamp(1.4rem,5vw,2.2rem)" }) {
  return (
    <div style={{ textAlign:align }}>
      {eyebrow && <p style={{ fontFamily:"'Cinzel', serif", fontSize:".62rem", letterSpacing:"0.45em", color:THEME.goldDim, marginBottom:10, textTransform:"uppercase" }}>{eyebrow}</p>}
      <h2 style={{ fontFamily:"'Cinzel', serif", fontSize:size, color:THEME.gold, letterSpacing:"0.08em", lineHeight:1.2, fontWeight:600, textShadow:`0 0 40px rgba(201,168,76,0.3)` }}>{children}</h2>
      {sub && <p style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(.9rem,2.8vw,1.1rem)", color:THEME.silver, letterSpacing:"0.12em", marginTop:8, fontStyle:"italic", opacity:.7 }}>{sub}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TYPEWRITER HOOK
═══════════════════════════════════════════════════════════════ */
export function useTypewriter(text, speed=28, active=true) {
  const [out,setOut]   = useState("");
  const [done,setDone] = useState(false);
  useEffect(() => {
    if (!active) { setOut(""); setDone(false); return; }
    setOut(""); setDone(false); let i=0;
    const iv = setInterval(() => {
      if (i < text.length) setOut(text.slice(0,++i));
      else { setDone(true); clearInterval(iv); }
    }, speed);
    return () => clearInterval(iv);
  }, [text, active]);
  return { out, done };
}

/* ═══════════════════════════════════════════════════════════════
   PAGE WRAPPER — consistent cinematic layout
═══════════════════════════════════════════════════════════════ */
export function CinePage({ children, particles=true, fog=true, castle=true, lightning=true }) {
  return (
    <div style={{ minHeight:"100vh", background:THEME.bg, display:"flex", flexDirection:"column", alignItems:"center", overflowX:"hidden", overflowY:"auto", position:"relative", paddingBottom: castle ? 260 : 60 }}>
      <style>{G}</style>
      {particles   && <MagicParticles count={50}/>}
      {fog         && <FogLayers/>}
      {lightning   && <AtmosphericLightning/>}
      {castle      && <CinematicCastle/>}
      <div style={{ width:"100%", maxWidth:540, padding:"40px 20px 24px", display:"flex", flexDirection:"column", alignItems:"center", gap:24, position:"relative", zIndex:10 }}>
        {children}
      </div>
    </div>
  );
}
