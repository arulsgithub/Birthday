import { useState, useEffect } from "react";

export const HP_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{width:100%;min-height:100vh;background:#050308;overflow-x:hidden;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:#080612;}
::-webkit-scrollbar-thumb{background:#8b6914;border-radius:3px;}
@keyframes twinkle{0%,100%{opacity:.12;transform:scale(1)}50%{opacity:1;transform:scale(1.6)}}
@keyframes goldGlow{0%,100%{text-shadow:0 0 12px rgba(212,175,55,.35)}50%{text-shadow:0 0 30px rgba(212,175,55,.95),0 0 60px rgba(212,175,55,.3)}}
@keyframes timerGlow{0%,100%{box-shadow:0 0 8px rgba(212,175,55,.08)}50%{box-shadow:0 0 22px rgba(212,175,55,.3),inset 0 0 10px rgba(212,175,55,.04)}}
@keyframes letterReveal{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes candleFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes flameFlicker{from{transform:translateX(-50%) scaleY(1)}to{transform:translateX(-50%) scaleY(1.25) scaleX(0.8)}}
@keyframes witchFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
@keyframes broomFly{0%{left:-140px;top:16%}35%{top:12%}65%{top:20%}100%{left:110vw;top:15%}}
@keyframes broomBob{from{transform:rotate(-4deg)}to{transform:rotate(4deg)}}
@keyframes shootingStar{0%{left:-10%;top:6%;opacity:0}5%{opacity:1}30%{left:105%;top:22%;opacity:0}100%{left:105%;opacity:0}}
@keyframes alertPop{from{opacity:0;transform:scale(.7) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes wandWave{from{transform:rotate(-18deg)}to{transform:rotate(18deg)}}
@keyframes wandPulse{0%,100%{filter:drop-shadow(0 0 4px #d4af37)}50%{filter:drop-shadow(0 0 16px #d4af37) drop-shadow(0 0 30px rgba(212,175,55,.5))}}
@keyframes wandSpinLaunch{0%{transform:scale(1) rotate(0)}50%{transform:scale(1.5) rotate(180deg)}100%{transform:scale(.3) rotate(360deg);opacity:0}}
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes fadeInLeft{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@keyframes confettiFall{0%{transform:translateY(-10px) rotate(0);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
@keyframes stampIn{from{transform:scale(3) rotate(-12deg);opacity:0}to{transform:scale(1) rotate(-12deg);opacity:1}}
@keyframes heartbeat{0%,100%{transform:scale(1)}14%{transform:scale(1.1)}28%{transform:scale(1)}42%{transform:scale(1.06)}}
@keyframes spellBurst{0%{transform:scale(0) rotate(0);opacity:1}100%{transform:scale(3) rotate(360deg);opacity:0}}
@keyframes mirrorGlow{0%,100%{box-shadow:0 0 20px rgba(100,160,255,.15)}50%{box-shadow:0 0 50px rgba(100,160,255,.4)}}
@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
@keyframes potionBubble{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes crestPulse{0%,100%{box-shadow:0 0 18px rgba(212,175,55,.2)}50%{box-shadow:0 0 40px rgba(212,175,55,.5),0 0 80px rgba(212,175,55,.12)}}
@keyframes launchFlash{0%{opacity:0}20%{opacity:1}80%{opacity:1}100%{opacity:0}}
@keyframes runeReveal{from{opacity:0;transform:scale(0) rotate(-180deg)}to{opacity:1;transform:scale(1) rotate(0)}}
.goldGlow{animation:goldGlow 2.5s ease-in-out infinite}
.fiu{animation:fadeInUp .7s ease forwards}
.fi{animation:fadeIn .6s ease forwards}
.fil{animation:fadeInLeft .6s ease forwards}
.wandPulse{animation:wandPulse 2s ease-in-out infinite}
button:not([disabled]):hover{transform:scale(1.04) translateY(-2px)!important;filter:brightness(1.15)!important;}
`;

export function AmrithaWitch({ size = 160, expression = "happy", showWand = true, showBook = true }) {
  const mouths = {
    happy:      "M70,122 Q80,130 90,122",
    determined: "M70,122 Q80,126 90,122",
    thinking:   "M70,121 Q80,119 90,121",
    shocked:    "M72,122 Q80,132 88,122",
  };
  const mouth = mouths[expression] || mouths.happy;
  return (
    <div style={{ display:"inline-block", animation:"witchFloat 4s ease-in-out infinite", filter:"drop-shadow(0 6px 24px rgba(212,175,55,.28))" }}>
      <svg width={size} height={size * 1.55} viewBox="0 0 200 310" style={{ overflow:"visible" }}>
        <path d="M62,185 Q42,240 30,310 L170,310 Q158,240 138,185 Z" fill="#6b1728"/>
        <path d="M68,178 Q55,215 48,260 Q80,255 100,258 Q120,255 152,260 Q145,215 132,178 Z" fill="#8b1f35"/>
        <line x1="100" y1="182" x2="100" y2="265" stroke="#4a0f1e" strokeWidth="1.5" opacity="0.5"/>
        <path d="M68,178 Q100,190 132,178" stroke="#d4af37" strokeWidth="2" fill="none" opacity="0.65"/>
        <path d="M68,178 Q45,198 36,238 Q55,230 62,205 Z" fill="#4a0f1e"/>
        <path d="M132,178 Q155,198 164,238 Q145,230 138,205 Z" fill="#4a0f1e"/>
        <rect x="68" y="200" width="64" height="9" rx="4" fill="#2a0a12"/>
        <rect x="95" y="200" width="10" height="9" rx="2" fill="#d4af37" opacity="0.85"/>
        <text x="100" y="228" fontSize="13" textAnchor="middle" fill="#d4af37" opacity="0.45">⚡</text>
        <rect x="90" y="162" width="20" height="24" rx="10" fill="#c8906a"/>
        <ellipse cx="100" cy="136" rx="42" ry="44" fill="#c8906a"/>
        <ellipse cx="78"  cy="143" rx="9" ry="6" fill="#e09880" opacity="0.3"/>
        <ellipse cx="122" cy="143" rx="9" ry="6" fill="#e09880" opacity="0.3"/>
        <ellipse cx="100" cy="108" rx="42" ry="24" fill="#1a0a06"/>
        <path d="M58,108 Q46,148 48,210 Q60,200 66,182 Q60,155 68,136 Z" fill="#1a0a06"/>
        <path d="M142,108 Q154,148 152,210 Q140,200 134,182 Q140,155 132,136 Z" fill="#1a0a06"/>
        <path d="M58,108 Q56,88 76,78 Q100,72 124,78 Q144,88 142,108" fill="#1a0a06"/>
        <path d="M66,84 Q82,76 100,75 Q88,80 76,92" fill="#2d1408" opacity="0.5"/>
        <path d="M106,73 Q124,77 138,88 Q126,84 114,94" fill="#2d1408" opacity="0.38"/>
        <path d="M72,82 Q90,76 108,76" stroke="#3d1a0a" strokeWidth="1.8" fill="none" opacity="0.35"/>
        <ellipse cx="100" cy="91" rx="48" ry="11" fill="#14120e"/>
        <path d="M67,91 L84,30 Q100,18 116,30 L133,91 Z" fill="#14120e"/>
        <path d="M78,91 L90,36 Q100,24 110,36 L122,91 Z" fill="#1c1a12"/>
        <rect x="67" y="86" width="66" height="9" rx="2" fill="#8b6914"/>
        <rect x="72" y="87" width="56" height="7" rx="2" fill="#a07820"/>
        <text x="100" y="68" fontSize="13" textAnchor="middle" fill="#d4af37" style={{ filter:"drop-shadow(0 0 4px #d4af37)" }}>⚡</text>
        <ellipse cx="90" cy="52" rx="3" ry="7" fill="rgba(255,255,255,0.05)" transform="rotate(-15,90,52)"/>
        <ellipse cx="82"  cy="136" rx="9"   ry="7.5" fill="white"/>
        <ellipse cx="82"  cy="137" rx="5.5" ry="5.5" fill="#3d2010"/>
        <ellipse cx="83.5" cy="135" rx="2"  ry="2"   fill="white"/>
        <path d="M73,131 Q82,126 91,131" stroke="#1a0806" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <ellipse cx="118" cy="136" rx="9"   ry="7.5" fill="white"/>
        <ellipse cx="118" cy="137" rx="5.5" ry="5.5" fill="#3d2010"/>
        <ellipse cx="119.5" cy="135" rx="2" ry="2"   fill="white"/>
        <path d="M109,131 Q118,126 127,131" stroke="#1a0806" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <ellipse cx="100" cy="147" rx="4" ry="3" fill="#b07850"/>
        <path d={mouth} stroke="#7a3020" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <circle cx="57"  cy="140" r="3.5" fill="#d4af37" opacity="0.9"/>
        <circle cx="57"  cy="147" r="2.5" fill="#d4af37" opacity="0.7"/>
        <circle cx="143" cy="140" r="3.5" fill="#d4af37" opacity="0.9"/>
        <circle cx="143" cy="147" r="2.5" fill="#d4af37" opacity="0.7"/>
        <rect x="52" y="226" width="16" height="9" rx="2" fill="#1a1a1a"/>
        <rect x="53" y="227" width="14" height="7" rx="1" fill="#2a2a2a"/>
        <line x1="60" y1="228" x2="60" y2="233" stroke="#d4af37" strokeWidth="0.8"/>
        <line x1="57" y1="231" x2="63" y2="231" stroke="#d4af37" strokeWidth="0.8"/>
        {showWand && <>
          <line x1="138" y1="230" x2="170" y2="198" stroke="#6b3a18" strokeWidth="4" strokeLinecap="round"/>
          <ellipse cx="170" cy="198" rx="4" ry="4" fill="#d4af37" style={{ filter:"drop-shadow(0 0 6px #d4af37)" }}/>
          <circle cx="176" cy="191" r="2.5" fill="#d4af37" opacity="0.8"/>
          <circle cx="181" cy="185" r="1.8" fill="#ffcc00" opacity="0.6"/>
          <text x="184" y="180" fontSize="10" fill="#d4af37" opacity="0.5">✦</text>
          <circle cx="170" cy="198" r="9" fill="none" stroke="#d4af37" strokeWidth="0.8" opacity="0.25" style={{ animation:"spellBurst 2s ease-in-out infinite" }}/>
        </>}
        {showBook && <>
          <rect x="28" y="215" width="26" height="34" rx="3" fill="#8b1a1a" transform="rotate(-10,41,232)"/>
          <rect x="29" y="216" width="24" height="32" rx="2" fill="#a52020" transform="rotate(-10,41,232)"/>
          <text x="41" y="231" fontSize="7" fill="#d4af37" textAnchor="middle" transform="rotate(-10,41,232)" fontFamily="Cinzel">HP</text>
          <line x1="28" y1="224" x2="54" y2="222" stroke="#6b1010" strokeWidth="0.8" transform="rotate(-10,41,232)"/>
        </>}
      </svg>
    </div>
  );
}

export function HogwartsCastle() {
  return (
    <svg viewBox="0 0 800 340" style={{ position:"fixed", bottom:0, left:0, right:0, width:"100%", pointerEvents:"none", zIndex:2 }} preserveAspectRatio="xMidYMax meet">
      <defs>
        <filter id="wg"><feGaussianBlur stdDeviation="1.5" result="cb"/><feMerge><feMergeNode in="cb"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0e0c18"/><stop offset="100%" stopColor="#0a0810"/></linearGradient>
      </defs>
      <path d="M0,230 L60,165 L110,210 L170,145 L230,190 L290,130 L350,175 L410,140 L470,180 L530,135 L590,168 L650,118 L710,158 L770,132 L800,148 L800,340 L0,340Z" fill="#080610" opacity="0.6"/>
      <rect x="255" y="148" width="290" height="175" fill="url(#cg)"/>
      {Array.from({length:20},(_,i)=><rect key={i} x={255+i*15} y="138" width="9" height="13" fill="#0d0b16" rx="1"/>)}
      <rect x="172" y="178" width="104" height="145" fill="#0c0a14"/>
      {Array.from({length:8},(_,i)=><rect key={i} x={172+i*14} y="169" width="9" height="11" fill="#0c0a14" rx="1"/>)}
      <rect x="524" y="182" width="104" height="141" fill="#0c0a14"/>
      {Array.from({length:8},(_,i)=><rect key={i} x={524+i*14} y="173" width="9" height="11" fill="#0c0a14" rx="1"/>)}
      <rect x="572" y="62" width="30" height="138" fill="#0d0b18"/>
      {Array.from({length:5},(_,i)=><rect key={i} x={570+i*7} y="54" width="6" height="10" fill="#0d0b18" rx="1"/>)}
      <path d="M569,62 L587,18 L605,62Z" fill="#13111e"/>
      <line x1="587" y1="18" x2="587" y2="4" stroke="#8b1a1a" strokeWidth="1.5"/>
      <polygon points="587,4 600,10 587,16" fill="#8b1a1a"/>
      <rect x="368" y="52" width="64" height="108" fill="#0e0c1a"/>
      {Array.from({length:7},(_,i)=><rect key={i} x={366+i*10} y="43" width="7" height="11" fill="#0e0c1a" rx="1"/>)}
      <path d="M364,52 L400,8 L436,52Z" fill="#14111e"/>
      <line x1="400" y1="8" x2="400" y2="-6" stroke="#1a3a6b" strokeWidth="1.8"/>
      <polygon points="400,-6 413,2 400,10" fill="#1a3a6b"/>
      <rect x="195" y="95" width="28" height="120" fill="#0c0a16"/>
      <path d="M192,95 L209,55 L226,95Z" fill="#120e1c"/>
      <line x1="209" y1="55" x2="209" y2="40" stroke="#2d6b1a" strokeWidth="1.5"/>
      <polygon points="209,40 220,47 209,54" fill="#2d6b1a"/>
      <rect x="140" y="120" width="25" height="140" fill="#0b0912"/>
      <path d="M137,120 L152,86 L167,120Z" fill="#110e1a"/>
      <rect x="632" y="106" width="24" height="118" fill="#0b0914"/>
      <path d="M629,106 L644,72 L659,106Z" fill="#110e1c"/>
      <rect x="88" y="228" width="96" height="16" fill="#090810"/>
      {[100,116,132,148,164].map((x,i)=><rect key={i} x={x} y="218" width="10" height="28" fill="#090810" rx="1"/>)}
      {[
        [272,168],[288,168],[304,168],[320,162],[340,165],[360,162],[380,162],[400,158],[420,162],[440,162],[460,165],[480,168],[500,168],[518,168],
        [275,195],[310,192],[345,188],[380,188],[415,188],[450,192],[485,195],[518,195],
        [280,222],[330,218],[380,215],[430,215],[480,218],[530,222],
        [190,205],[210,205],[190,225],[210,225],[540,210],[560,210],[540,228],[560,228],
        [376,78],[396,75],[416,78],[376,92],[416,92],
        [578,88],[592,88],[578,106],[592,106],[578,124],[592,124],[578,142],[592,142],
        [200,125],[215,125],[200,142],[215,142],[148,138],[158,138],[148,155],[158,155],
      ].map(([x,y],i)=>(
        <rect key={i} x={x} y={y} width={7} height={9} rx={3.5}
          fill={i%4===0?"#ffd700":i%4===1?"#ff9900":i%4===2?"#ffcc44":"#ffaa22"}
          opacity={0.45+((i*7)%10)*0.04} filter="url(#wg)"
        />
      ))}
      <path d="M378,155 L378,185 Q390,195 402,185 L402,155Z" fill="#ff8800" opacity="0.22" filter="url(#wg)"/>
      <line x1="390" y1="155" x2="390" y2="185" stroke="#8b6914" strokeWidth="1" opacity="0.35"/>
      <line x1="378" y1="170" x2="402" y2="170" stroke="#8b6914" strokeWidth="1" opacity="0.35"/>
      <ellipse cx="400" cy="312" rx="290" ry="20" fill="rgba(16,14,35,.85)"/>
      <ellipse cx="400" cy="310" rx="210" ry="11" fill="none" stroke="rgba(100,120,220,.07)" strokeWidth="2"/>
      <ellipse cx="400" cy="308" rx="35" ry="5" fill="rgba(212,175,55,.09)"/>
      <path d="M310,310 Q360,318 400,314 Q440,318 490,310" stroke="rgba(212,175,55,.06)" strokeWidth="1.5" fill="none"/>
      <path d="M0,310 L0,216 L18,182 L32,212 L48,172 L64,208 L80,176 L96,210 L112,188 L128,222 L144,198 L158,234 L172,220 L172,310Z" fill="#040208"/>
      <path d="M800,310 L800,216 L782,185 L768,218 L752,178 L738,212 L724,184 L710,218 L696,192 L682,226 L668,202 L654,234 L628,310Z" fill="#040208"/>
      <path d="M0,318 Q200,308 400,312 Q600,308 800,318 L800,340 L0,340Z" fill="#030208"/>
    </svg>
  );
}

export function Stars({ count = 80 }) {
  const [stars] = useState(() => Array.from({ length: count }, (_, i) => ({
    id:i, left:`${Math.random()*100}%`, top:`${Math.random()*68}%`,
    size:1+Math.random()*2.2, delay:`${Math.random()*5}s`, dur:`${2+Math.random()*4}s`, gold:i%6===0,
  })));
  return (
    <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0 }}>
      {stars.map(s=><div key={s.id} style={{ position:"absolute",left:s.left,top:s.top,width:s.size,height:s.size,background:s.gold?"#d4af37":"#ffffff",borderRadius:"50%",animation:`twinkle ${s.dur} ${s.delay} ease-in-out infinite`,boxShadow:`0 0 ${s.size*2}px ${s.gold?"#d4af3799":"#ffffff44"}` }}/>)}
    </div>
  );
}

export function FloatingCandles({ count = 12 }) {
  const [candles] = useState(() => Array.from({ length: count }, (_, i) => ({
    id:i, left:`${4+i*(92/count)}%`, dur:`${4.5+Math.random()*3}s`, delay:`${i*0.45}s`, h:16+Math.floor(Math.random()*14),
  })));
  return (
    <div style={{ position:"fixed",top:0,left:0,right:0,height:110,pointerEvents:"none",zIndex:1,overflow:"hidden" }}>
      {candles.map(c=>(
        <div key={c.id} style={{ position:"absolute",left:c.left,top:14,animation:`candleFloat ${c.dur} ${c.delay} ease-in-out infinite` }}>
          <div style={{ width:5,height:c.h,background:"linear-gradient(#f5e8d2,#d4b87a)",borderRadius:"2px 2px 1px 1px",margin:"0 auto",position:"relative" }}>
            <div style={{ width:1,height:7,background:"#555",position:"absolute",top:-6,left:"50%",transform:"translateX(-50%)" }}/>
            <div style={{ width:7,height:11,background:"radial-gradient(ellipse at 40% 80%,#ffe840,#ff8800,transparent 80%)",borderRadius:"50% 50% 30% 30%",position:"absolute",top:-15,left:"50%",transform:"translateX(-50%)",animation:"flameFlicker .35s ease-in-out infinite alternate",boxShadow:"0 0 7px 2px rgba(255,155,0,.28)" }}/>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FlyingBroom() {
  return (
    <div style={{ position:"fixed",top:"17%",left:0,pointerEvents:"none",zIndex:4,animation:"broomFly 16s linear infinite" }}>
      <div style={{ display:"flex",alignItems:"center",position:"relative",animation:"broomBob 1.8s ease-in-out infinite alternate" }}>
        <div style={{ width:58,height:4,background:"linear-gradient(90deg,#7a4f1e,#c8a060,#7a4f1e)",borderRadius:2,position:"relative" }}>
          <div style={{ position:"absolute",right:-14,top:-5,display:"flex",flexDirection:"column",gap:1 }}>
            {[0,1,2,3,4].map(i=><div key={i} style={{ width:16,height:2,background:"#7a4f1e",borderRadius:1,transform:`rotate(${(i-2)*9}deg)`,transformOrigin:"left center" }}/>)}
          </div>
        </div>
        <div style={{ position:"absolute",left:6,top:-24,fontSize:22 }}>🧙‍♀️</div>
      </div>
    </div>
  );
}

export function ShootingStar() {
  return (
    <div style={{ position:"fixed",top:"8%",left:"-12%",pointerEvents:"none",zIndex:3,animation:"shootingStar 12s linear infinite",opacity:0 }}>
      <div style={{ width:90,height:2,background:"linear-gradient(90deg,transparent,#d4af37,rgba(255,255,255,0.8),transparent)",borderRadius:2,transform:"rotate(-28deg)",boxShadow:"0 0 6px 1px rgba(212,175,55,.4)" }}/>
    </div>
  );
}

export function Confetti() {
  const pieces = Array.from({length:65},(_,i)=>({ id:i,left:`${Math.random()*100}%`,color:["#d4af37","#8b1a1a","#1a3a6b","#2d6b1a","#c8b89a","#ff9de2"][i%6],size:`${5+Math.random()*8}px`,delay:`${Math.random()*2.2}s`,dur:`${2.5+Math.random()*2}s`,br:i%3===0?"50%":"2px" }));
  return (
    <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:990 }}>
      {pieces.map(p=><div key={p.id} style={{ position:"absolute",top:"-20px",left:p.left,width:p.size,height:p.size,background:p.color,borderRadius:p.br,animation:`confettiFall ${p.dur} ${p.delay} ease-in forwards` }}/>)}
    </div>
  );
}

export function SpellTransition({ label = "", onDone }) {
  useEffect(()=>{ const t=setTimeout(onDone,2200); return()=>clearTimeout(t); },[]);
  return (
    <div style={{ position:"fixed",inset:0,background:"#050308",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:999 }} className="fi">
      <style>{HP_CSS}</style>
      <Stars count={60}/>
      <div style={{ position:"relative",zIndex:10,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:16 }}>
        <div style={{ fontSize:72,animation:"wandSpinLaunch 2.2s ease forwards" }}>🪄</div>
        <p style={{ color:"#d4af37",fontFamily:"'Cinzel Decorative'",fontSize:"clamp(1rem,4vw,1.6rem)",letterSpacing:4,textAlign:"center" }}>{label}</p>
        <p style={{ color:"#4a3a20",fontFamily:"'Crimson Text'",fontSize:"0.9rem",letterSpacing:3 }}>The next enchantment unfolds...</p>
        <div style={{ display:"flex",gap:10,marginTop:8 }}>
          {[0,1,2].map(i=><div key={i} style={{ width:8,height:8,borderRadius:"50%",background:"#d4af37",animation:`heartbeat 1s ${i*0.22}s infinite` }}/>)}
        </div>
      </div>
    </div>
  );
}

export function HPBtn({ children, onClick, bg="linear-gradient(135deg,#8b1a1a,#a52020)", disabled=false, style={}, fullWidth=false }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ width:fullWidth?"100%":"auto",padding:"13px 28px",background:disabled?"rgba(255,255,255,0.04)":bg,border:`1.5px solid ${disabled?"#2a1e08":"#d4af37"}`,color:disabled?"#4a3a20":"#f0e6c8",fontFamily:"'Cinzel',serif",fontSize:"0.88rem",letterSpacing:2,cursor:disabled?"default":"pointer",borderRadius:3,boxShadow:disabled?"none":"0 0 14px rgba(212,175,55,.18)",transition:"all .3s",display:"flex",alignItems:"center",justifyContent:"center",gap:8,...style }}>
      {children}
    </button>
  );
}

export function HPPage({ children, bg="radial-gradient(ellipse at 50% 0%,#100820 0%,#080612 45%,#050308 100%)", castle=true, candles=true, broom=false, shooting=true }) {
  return (
    <div style={{ minHeight:"100vh",background:bg,display:"flex",flexDirection:"column",alignItems:"center",overflowX:"hidden",overflowY:"auto",position:"relative",paddingBottom:castle?220:60 }}>
      <style>{HP_CSS}</style>
      <Stars count={75}/>
      {candles && <FloatingCandles count={11}/>}
      {broom   && <FlyingBroom/>}
      {shooting && <ShootingStar/>}
      {castle  && <HogwartsCastle/>}
      <div style={{ width:"100%",maxWidth:500,padding:"28px 18px 20px",display:"flex",flexDirection:"column",alignItems:"center",gap:20,position:"relative",zIndex:10 }}>
        {children}
      </div>
    </div>
  );
}

export function useTypewriter(text, speed=30, active=true) {
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

export function Parchment({ children, style={} }) {
  return (
    <div style={{ width:"100%",background:"linear-gradient(145deg,#1e1608,#160f04)",border:"1px solid #d4af3755",borderRadius:4,padding:"22px 20px",boxShadow:"0 8px 28px rgba(0,0,0,.5),inset 0 0 18px rgba(139,105,20,.04)",...style }}>
      {children}
    </div>
  );
}

export function HPTitle({ children, sub, size="clamp(1.2rem,5vw,2rem)" }) {
  return (
    <div style={{ textAlign:"center" }}>
      <h2 className="goldGlow" style={{ fontFamily:"'Cinzel Decorative'",fontSize:size,color:"#d4af37",letterSpacing:3,lineHeight:1.2 }}>{children}</h2>
      {sub && <p style={{ fontFamily:"'Cinzel'",color:"#8b6914",fontSize:".7rem",letterSpacing:4,marginTop:6 }}>{sub}</p>}
    </div>
  );
}
