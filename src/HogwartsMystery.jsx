import { useState, useEffect } from "react";

/* ══════════════════════════════════════════════════════════
   GLOBALS
══════════════════════════════════════════════════════════ */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{width:100%;min-height:100vh;background:#050308;overflow-x:hidden;}
::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:#080612;}::-webkit-scrollbar-thumb{background:#8b6914;border-radius:3px;}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeInLeft{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@keyframes starTwinkle{0%,100%{opacity:.15;transform:scale(1)}50%{opacity:.9;transform:scale(1.5)}}
@keyframes goldGlow{0%,100%{text-shadow:0 0 10px rgba(212,175,55,.4)}50%{text-shadow:0 0 30px rgba(212,175,55,.9),0 0 60px rgba(212,175,55,.3)}}
@keyframes wandPulse{0%,100%{filter:drop-shadow(0 0 4px #d4af37)}50%{filter:drop-shadow(0 0 16px #d4af37) drop-shadow(0 0 30px rgba(212,175,55,.5))}}
@keyframes candleFlicker{0%,100%{opacity:1}50%{opacity:.7}}
@keyframes heartbeat{0%,100%{transform:scale(1)}14%{transform:scale(1.08)}28%{transform:scale(1)}42%{transform:scale(1.05)}}
@keyframes confettiFall{0%{transform:translateY(-10px) rotate(0);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
@keyframes runeReveal{from{opacity:0;transform:scale(0) rotate(-180deg)}to{opacity:1;transform:scale(1) rotate(0deg)}}
@keyframes parchmentUnroll{from{clip-path:inset(0 0 100% 0)}to{clip-path:inset(0 0 0% 0)}}
@keyframes potionBubble{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes mirrorGlow{0%,100%{box-shadow:0 0 20px rgba(100,180,255,.2)}50%{box-shadow:0 0 50px rgba(100,180,255,.5),0 0 100px rgba(100,180,255,.2)}}
@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
@keyframes stampIn{from{transform:scale(3) rotate(-12deg);opacity:0}to{transform:scale(1) rotate(-12deg);opacity:1}}
.fi{animation:fadeIn .6s ease forwards}
.fiu{animation:fadeInUp .7s ease forwards}
.fil{animation:fadeInLeft .6s ease forwards}
.goldGlow{animation:goldGlow 2.5s ease-in-out infinite}
.wandPulse{animation:wandPulse 2s ease-in-out infinite}
`;

/* ── Stars ── */
function Stars({ count = 50 }) {
  const s = Array.from({ length: count }, (_, i) => ({ id: i, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, size: 1 + Math.random() * 2, delay: `${Math.random() * 4}s`, dur: `${2 + Math.random() * 3}s` }));
  return <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>{s.map(x => <div key={x.id} style={{ position: "absolute", left: x.left, top: x.top, width: x.size, height: x.size, background: "#fff", borderRadius: "50%", animation: `starTwinkle ${x.dur} ${x.delay} ease-in-out infinite`, boxShadow: `0 0 ${x.size * 2}px rgba(212,175,55,0.4)` }} />)}</div>;
}

/* ── Floating candles ── */
function Candles() {
  const c = Array.from({ length: 12 }, (_, i) => ({ id: i, left: `${8 + i * 7.5}%`, delay: `${i * 0.3}s`, height: 20 + Math.random() * 20 }));
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 120, pointerEvents: "none", zIndex: 1 }}>
      {c.map(x => (
        <div key={x.id} style={{ position: "absolute", left: x.left, top: 30, animation: `potionBubble ${2 + Math.random()}s ${x.delay} ease-in-out infinite` }}>
          <div style={{ width: 4, height: x.height, background: "linear-gradient(#f5e6c8,#c8a878)", borderRadius: "2px 2px 0 0", margin: "0 auto", position: "relative" }}>
            <div style={{ width: 1, height: 6, background: "#555", position: "absolute", top: -5, left: "50%", transform: "translateX(-50%)" }} />
            <div style={{ width: 6, height: 10, background: "radial-gradient(ellipse at bottom,#ffcc00,#ff6600,transparent)", borderRadius: "50% 50% 30% 30%", position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", animation: "candleFlicker 0.4s infinite alternate", boxShadow: "0 0 6px 2px rgba(255,160,0,0.35)" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Confetti ── */
function Confetti() {
  const p = Array.from({ length: 60 }, (_, i) => ({ id: i, left: `${Math.random() * 100}%`, color: ["#d4af37", "#8b1a1a", "#1a3a6b", "#2d6b1a", "#c8b89a"][i % 5], size: `${5 + Math.random() * 8}px`, delay: `${Math.random() * 2}s`, dur: `${2.5 + Math.random() * 2}s`, br: i % 3 === 0 ? "50%" : "0" }));
  return <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 990 }}>{p.map(c => <div key={c.id} style={{ position: "absolute", top: "-20px", left: c.left, width: c.size, height: c.size, background: c.color, borderRadius: c.br, animation: `confettiFall ${c.dur} ${c.delay} ease-in forwards` }} />)}</div>;
}

/* ── Typewriter ── */
function useTypewriter(text, speed = 30, active = true) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active) { setOut(""); setDone(false); return; }
    setOut(""); setDone(false); let i = 0;
    const iv = setInterval(() => { if (i < text.length) setOut(text.slice(0, ++i)); else { setDone(true); clearInterval(iv); } }, speed);
    return () => clearInterval(iv);
  }, [text, active]);
  return { out, done };
}

/* ── Shared btn ── */
const Btn = ({ children, onClick, bg = "linear-gradient(135deg,#8b1a1a,#a52020)", disabled = false, style = {} }) => (
  <button onClick={onClick} disabled={disabled} style={{ padding: "12px 28px", background: disabled ? "rgba(255,255,255,0.04)" : bg, border: `1.5px solid ${disabled ? "#2a1e08" : "#d4af37"}`, color: disabled ? "#4a3a20" : "#f0e6c8", fontFamily: "'Cinzel', serif", fontSize: "0.85rem", letterSpacing: 2, cursor: disabled ? "default" : "pointer", borderRadius: 2, transition: "all .3s", boxShadow: disabled ? "none" : "0 0 15px rgba(212,175,55,0.15)", ...style }}>
    {children}
  </button>
);

/* ── Notebook overlay ── */
function Spellbook({ clues, onClose }) {
  const found = clues.filter(c => c.found);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 800 }} className="fi">
      <div style={{ width: "100%", maxWidth: 540, maxHeight: "85vh", background: "linear-gradient(145deg,#2a1e08,#1e1408)", borderRadius: 4, display: "flex", flexDirection: "column", border: "2px solid #8b6914", boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}>
        <div style={{ background: "#1a0f04", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "2px 2px 0 0" }}>
          <span style={{ color: "#d4af37", fontFamily: "'Cinzel Decorative'", fontSize: "0.85rem", letterSpacing: 3 }}>📜 Spell & Clue Book</span>
          <button style={{ background: "none", border: "none", color: "#8b6914", cursor: "pointer", fontSize: "1.1rem" }} onClick={onClose}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          {found.length === 0 && <p style={{ color: "#4a3a20", fontFamily: "'Crimson Text'", fontStyle: "italic", textAlign: "center", marginTop: 20 }}>No clues yet. Explore Hogwarts!</p>}
          {found.map((c, i) => (
            <div key={c.id} style={{ display: "flex", gap: 10, padding: "10px 14px", background: "rgba(212,175,55,0.05)", borderLeft: `3px solid ${c.key ? "#d4af37" : "#4a3a20"}`, borderRadius: "0 4px 4px 0" }} className="fil">
              <span style={{ color: c.key ? "#d4af37" : "#4a3a20", flexShrink: 0 }}>⚡</span>
              <div>
                <p style={{ color: "#c8b89a", fontFamily: "'Crimson Text'", fontSize: "0.95rem", lineHeight: 1.7 }}>{c.text}</p>
                {c.key && <span style={{ color: "#8b6914", fontFamily: "'Cinzel'", fontSize: "0.6rem", letterSpacing: 2 }}>KEY EVIDENCE</span>}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "10px 20px", borderTop: "1px solid #2a1e08" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#8b6914", fontFamily: "'Cinzel'", fontSize: "0.72rem", letterSpacing: 2 }}>{found.length}/{clues.length} clues</span>
            <div style={{ width: "55%", height: 4, background: "#1a1208", borderRadius: 2 }}>
              <div style={{ width: `${(found.length / clues.length) * 100}%`, height: "100%", background: "linear-gradient(90deg,#8b6914,#d4af37)", borderRadius: 2, transition: "width .5s" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   GAME DATA — THE PHILOSOPHER'S THIEF
══════════════════════════════════════════════════════════ */
const CASE = {
  title: "THE PHILOSOPHER'S THIEF",
  subtitle: "A Hogwarts Mystery",
  setting: "Hogwarts School of Witchcraft & Wizardry, 11:47 PM",
  premise: `The Philosopher's Stone has vanished from the third-floor corridor.\nProfessor Dumbledore's enchantments were bypassed — perfectly.\nFive suspects remain within the castle walls.\nA storm howls over the Forbidden Forest.\n\nYou are Detective Amritha, the brightest witch of the age.\nYou have until midnight to name the thief.`,
};

const HP_ROOMS = [
  { id: "potions", name: "Potions Dungeon", icon: "🧪", desc: "Stone walls drip with moisture. Shelves of unblinking ingredients stare back. A cauldron still warm.", clues: [
    { id: "h1", text: "A smashed Boomslang skin vial — still smoking. The residue matches a potion that grants disguise.", found: false, key: true },
    { id: "h2", text: "An overturned stool near Snape's private shelf. The restricted cabinet is ajar — not forced.", found: false, key: false },
    { id: "h3", text: "A monogrammed handkerchief — the initials Q.Q. Dropped behind a cauldron, still warm.", found: false, key: true },
  ]},
  { id: "corridor", name: "Third-Floor Corridor", icon: "🚪", desc: "The door hangs open. Fluffy's paw prints end abruptly. A melody lingers — someone played a flute.", clues: [
    { id: "h4", text: "Fluffy is asleep — a small wooden flute rests beside him. Not Hagrid's style — too refined.", found: false, key: true },
    { id: "h5", text: "The trapdoor shows no forced entry. The enchantments were lifted with precise, advanced spellwork.", found: false, key: true },
    { id: "h6", text: "A single black feather — not from any bird in the Owlery. Peacock? No peacocks at Hogwarts... officially.", found: false, key: false },
  ]},
  { id: "library", name: "Restricted Section", icon: "📚", desc: "Pages flutter on their own. Screaming books have gone strangely silent. Something was read — and removed.", clues: [
    { id: "h7", text: "A page torn from 'Secrets of the Darkest Art' — specifically the chapter on stone transmutation.", found: false, key: true },
    { id: "h8", text: "Madam Pince's sign-out log: the last entry is smudged. But the ink — violet — is distinctive.", found: false, key: true },
    { id: "h9", text: "A Bertie Bott's Every Flavour Bean on the floor — earwax flavour. Dumbledore's known weakness.", found: false, key: false },
  ]},
  { id: "mirrorroom", name: "The Mirror of Erised", icon: "🪞", desc: "The Mirror glows faintly. Someone stood before it recently — the dust pattern on the floor is fresh.", clues: [
    { id: "h10", text: "A note left at the Mirror's base: 'I see myself holding it. I always have.' — unsigned.", found: false, key: true },
    { id: "h11", text: "Tiny droplets of a shimmering gold liquid — Liquid Luck (Felix Felicis). Someone prepared meticulously.", found: false, key: true },
    { id: "h12", text: "The Mirror shows something unusual tonight — instead of desire, it shows a face. Familiar. Calculating.", found: false, key: false },
  ]},
  { id: "owlery", name: "The Owlery", icon: "🦉", desc: "Feathers everywhere. One owl is missing its usual perch. A letter was sent tonight — but to whom?", clues: [
    { id: "h13", text: "A burned parchment in the corner — nearly destroyed, but one phrase survives: '...the stone is hidden where...'", found: false, key: true },
    { id: "h14", text: "A second letter, unsent, addressed to 'R.Q.' from 'Q.Q.' — 'Meet me at the stone. Tonight is the night.'", found: false, key: true },
    { id: "h15", text: "An imprint in the straw — someone waited here for hours. Small boots, precise heel placement.", found: false, key: true },
  ]},
];

const HP_SUSPECTS = [
  { id: "quirrell", name: "Prof. Quirrell", role: "Defence Against Dark Arts", icon: "🎓", guilty: true,
    motive: "Possessed by Voldemort — desperate to obtain the Stone to restore his master",
    alibi: "Claims he was in his office preparing lesson plans all evening",
    tells: ["Initials Q.Q. match the handkerchief found in Potions dungeon","He plays a flute — matched instrument found with Fluffy","His distinctive violet ink appears in the library sign-out log","The letter from 'Q.Q.' to 'R.Q.' — Quirinus Quirrell to R = his master","Felix Felicis traces match his known apothecary purchases","He knew Fluffy's weakness — Dumbledore told him the same night the Stone arrived"],
    questions: [
      { q: "Where were you between 10 PM and midnight?", options: [
        { text: "In my office, p-p-preparing tomorrow's lesson.", response: "His stutter worsens when he says 'preparing'. The ink on his fingers is violet.", suspicious: true },
        { text: "I took a walk. The night air helps my nerves.", response: "A walk on the night the Stone goes missing. You make a careful note.", suspicious: true },
      ]},
      { q: "Do you know how to put Fluffy to sleep?", options: [
        { text: "A three-headed dog? I've n-never even been near it!", response: "His hand moves involuntarily to his turban. You notice it moves — as if something shifts.", suspicious: true },
        { text: "Dumbledore may have mentioned something about music.", response: "He volunteers this information. Why would an innocent man know this?", suspicious: true },
      ]},
      { q: "What do you know about the Philosopher's Stone?", options: [
        { text: "Only what's in the history books, I assure you.", response: "His eyes — there's a second shadow in them. Something old. Something hungry.", suspicious: true },
        { text: "A dangerous object. Better it were never found.", response: "The turban twitches. Behind it — for just a moment — you hear a whisper.", suspicious: true },
      ]},
    ]
  },
  { id: "snape", name: "Prof. Snape", role: "Potions Master", icon: "🖤", guilty: false,
    motive: "Known rivalry with Dumbledore — or is it more?",
    alibi: "Was seen counter-cursing something in the stands. Multiple witnesses.",
    tells: ["Snape was PROTECTING the Stone — counter-cursing Quirrell all evening","His alibi is ironclad — dozens of students witnessed it","He appears suspicious but is entirely innocent — the ultimate red herring"],
    questions: [
      { q: "Why were you seen muttering during the Quidditch match?", options: [
        { text: "Classroom preparation. Nothing that concerns you.", response: "Arrogant dismissal — but his alibi covers him completely during the theft window.", suspicious: false },
        { text: "Counter-jinxes. Someone was cursing Potter's broom.", response: "He says this flatly, as fact. Cross-checking confirms it: he was protecting, not stealing.", suspicious: false },
      ]},
      { q: "Did you try to get past Fluffy?", options: [
        { text: "I was bitten on the third floor, yes. Investigating suspicious activity.", response: "He shows you the bite. It's genuine. He suspected Quirrell before you did.", suspicious: false },
        { text: "I have my reasons. They are not your business.", response: "Not an admission — a deflection born of pride, not guilt.", suspicious: false },
      ]},
    ]
  },
  { id: "mcgonagall", name: "Prof. McGonagall", role: "Transfiguration", icon: "🐱", guilty: false,
    motive: "Head of Gryffindor — would do anything to protect her students",
    alibi: "Was playing chess with Nearly Headless Nick until 1 AM — corroborated",
    tells: ["Chess alibi corroborated by three portraits AND Nearly Headless Nick","Her Animagus form leaves cat paw prints — not found at any scene","She suspected Snape, ironically — also not the culprit"],
    questions: [
      { q: "Were you near the third floor corridor tonight?", options: [
        { text: "Certainly not. I was occupied elsewhere.", response: "She meets your gaze without flinching. No tells. No guilt.", suspicious: false },
        { text: "I patrol the corridors regularly. As is my duty.", response: "Routine patrol — her route doesn't cross the third floor on Tuesdays.", suspicious: false },
      ]},
      { q: "Do you have suspicions about who might be behind this?", options: [
        { text: "I have my theories. Involving a certain greasy-haired colleague.", response: "She suspects Snape — who is innocent. A telling misdirection.", suspicious: false },
        { text: "I trust Dumbledore's protections were sufficient. This concerns me greatly.", response: "Genuine distress. Not guilt — worry.", suspicious: false },
      ]},
    ]
  },
  { id: "hagrid", name: "Rubeus Hagrid", role: "Gamekeeper", icon: "🌲", guilty: false,
    motive: "Accidentally sold information about Fluffy — unknowingly",
    alibi: "Was in his hut all evening — Norbert the dragon witnessed everything",
    tells: ["Hagrid innocently told a stranger (Quirrell in disguise) how to get past Fluffy","He's heartbroken about this — but entirely innocent","The 'stranger at the pub' matches Quirrell's description perfectly"],
    questions: [
      { q: "Did you tell anyone how to get past Fluffy?", options: [
        { text: "Well... there was a fella at the Hog's Head... seemed interested in magical creatures...", response: "His eyes fill with horror as he realizes what he's admitted. Genuine, devastating guilt — not the theft kind.", suspicious: true },
        { text: "I would never! Fluffy's safety is sacred to me.", response: "He says this passionately. Then pauses. Then goes very pale.", suspicious: false },
      ]},
      { q: "What did this stranger look like?", options: [
        { text: "Had a turban on. Quiet fella. Bought me a drink.", response: "A turban. Your pulse quickens. Only one professor wears a turban.", suspicious: true },
        { text: "Didn't get a good look. He kept to the shadows.", response: "Hagrid is not the villain here — just a victim of manipulation.", suspicious: false },
      ]},
    ]
  },
  { id: "peeves", name: "Peeves", role: "Poltergeist", icon: "👻", guilty: false,
    motive: "Chaos — but even Peeves has limits",
    alibi: "Was dropping water balloons on Filch on the 5th floor — documented in Filch's complaint log",
    tells: ["Alibi confirmed in Filch's official complaint log at 11:45 PM","Peeves can't physically hold objects with enough precision for this theft","Peeves would have been too loud — this crime required silence and planning"],
    questions: [
      { q: "Were you near the third floor last night?", options: [
        { text: "Oooooh the third floor! Peeves knows all about the doggy!", response: "He's insufferably cheerful. And alibied. Filch's log confirms 5th floor at time of theft.", suspicious: false },
        { text: "Peeves was busy! Very busy! Very important chaos business!", response: "His alibi — water balloons at 11:45 — is documented in Filch's official complaint. Rock solid.", suspicious: false },
      ]},
      { q: "Did you see anyone suspicious near the corridor?", options: [
        { text: "The turban-man! Peeves saw him! Going somewhere he shouldn't!", response: "Peeves spotted Quirrell near the corridor. Crucial witness — despite being the least credible.", suspicious: true },
        { text: "Peeves sees EVERYTHING. That's the point of being Peeves!", response: "He dissolves into cackling. But beneath the chaos — a useful witness.", suspicious: false },
      ]},
    ]
  },
];

const HP_CIPHER = {
  prompt: "Scratched into the trapdoor in Ancient Runes — Dumbledore's final clue to the investigator:",
  encrypted: "DHLLHO DHZ AOL AOPLS",
  answer: "QUIRRELL WAS THE THIEF",
  hint: "ROT-13 variant: shift each letter by 7 forward. A→H, B→I... T→A, U→B...",
  shift: 7,
};

/* ══════════════════════════════════════════════════════════
   ROOM EXPLORER
══════════════════════════════════════════════════════════ */
function RoomExplorer({ room, allClues, onFindClue, onBack }) {
  const [examining, setExamining] = useState(null);
  const roomClues = allClues.filter(c => room.clues.some(rc => rc.id === c.id));
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#0a0608,#050308)", paddingBottom: 40 }} className="fi">
      <Stars count={40} /><Candles />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #1a1208", background: "rgba(0,0,0,0.7)", position: "sticky", top: 0, zIndex: 50 }}>
        <Btn onClick={onBack} style={{ padding: "8px 16px", fontSize: "0.75rem" }}>← Hogwarts</Btn>
        <h2 style={{ fontFamily: "'Cinzel'", fontSize: "clamp(0.9rem,4vw,1.3rem)", color: "#d4af37", letterSpacing: 4 }} className="goldGlow">{room.icon} {room.name}</h2>
        <span style={{ color: "#4a3a20", fontFamily: "'Cinzel'", fontSize: "0.65rem", letterSpacing: 2 }}>INVESTIGATE</span>
      </div>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "28px 20px" }}>
        <p style={{ fontFamily: "'Crimson Text'", fontSize: "1.1rem", color: "#a89070", lineHeight: 1.8, fontStyle: "italic", textAlign: "center", marginBottom: 24 }}>{room.desc}</p>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 56, animation: "wandPulse 2s infinite" }}>🔍</div>
          <p style={{ color: "#8b6914", fontFamily: "'Cinzel'", fontSize: "0.65rem", letterSpacing: 3, marginTop: 6 }}>DETECTIVE AMRITHA</p>
        </div>
        <h3 style={{ fontFamily: "'Cinzel'", fontSize: "0.8rem", color: "#8b6914", letterSpacing: 4, marginBottom: 14, textAlign: "center" }}>POINTS OF INTEREST</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(148px,1fr))", gap: 10 }}>
          {roomClues.map((clue, i) => (
            <div key={clue.id} style={{ border: `1px solid ${clue.found ? "#d4af37" : "#1a1208"}`, borderRadius: 4, padding: "16px 10px", textAlign: "center", cursor: "pointer", transition: "all .3s", background: clue.found ? "rgba(212,175,55,0.07)" : "rgba(255,255,255,0.01)", display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }} onClick={() => { if (!clue.found) onFindClue(clue.id); setExamining(clue); }}>
              <span style={{ fontSize: 26 }}>{clue.found ? "✨" : "❓"}</span>
              <span style={{ fontFamily: "'Cinzel'", fontSize: "0.65rem", color: "#4a3a20", letterSpacing: 2 }}>{clue.found ? "Evidence" : `Area ${i + 1}`}</span>
              {clue.key && clue.found && <span style={{ background: "rgba(212,175,55,0.1)", border: "1px solid #d4af3766", color: "#d4af37", padding: "2px 8px", fontSize: "0.6rem", fontFamily: "'Cinzel'", letterSpacing: 2, borderRadius: 2 }}>KEY</span>}
            </div>
          ))}
        </div>
      </div>
      {examining && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 700 }} className="fi">
          <div style={{ background: "linear-gradient(145deg,#1a1208,#0f0a04)", border: "1px solid #d4af37", borderRadius: 4, padding: 28, maxWidth: 480, width: "100%", animation: "potionBubble 3s ease-in-out infinite" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ color: examining.key ? "#d4af37" : "#4a3a20", fontFamily: "'Cinzel'", fontSize: "0.68rem", letterSpacing: 3 }}>{examining.key ? "⚡ KEY EVIDENCE" : "OBSERVATION"}</span>
              <button style={{ background: "none", border: "none", color: "#4a3a20", cursor: "pointer" }} onClick={() => setExamining(null)}>✕</button>
            </div>
            <p style={{ fontFamily: "'Crimson Text'", fontSize: "1rem", color: "#c8b89a", lineHeight: 1.9 }}>{examining.text}</p>
            <div style={{ textAlign: "center", marginTop: 16, fontSize: 40 }}>🔍</div>
            {examining.key && <p style={{ color: "#8b6914", fontFamily: "'Cinzel'", fontSize: "0.7rem", letterSpacing: 2, textAlign: "center", marginTop: 10, fontStyle: "italic" }}>This could change everything...</p>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   INTERROGATION
══════════════════════════════════════════════════════════ */
function Interrogation({ suspect, onBack, onComplete }) {
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [suspicion, setSuspicion] = useState(0);
  const [showTells, setShowTells] = useState(false);
  const done = qIdx >= suspect.questions.length;
  const suspColor = suspicion === 0 ? "#00cc88" : suspicion === 1 ? "#ffcc00" : "#ff4444";

  const handleAnswer = (opt) => {
    setAnswers(prev => [...prev, { q: suspect.questions[qIdx].q, a: opt.text, r: opt.response, s: opt.suspicious }]);
    if (opt.suspicious) setSuspicion(s => s + 1);
    if (qIdx < suspect.questions.length - 1) setQIdx(q => q + 1);
    else { setQIdx(suspect.questions.length); onComplete(suspect.id); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top right,#0a0008,#050308)", paddingBottom: 40 }} className="fi">
      <Stars count={35} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #1a1208", background: "rgba(0,0,0,0.7)", position: "sticky", top: 0, zIndex: 50 }}>
        <Btn onClick={onBack} style={{ padding: "8px 16px", fontSize: "0.75rem" }}>← Back</Btn>
        <h2 style={{ fontFamily: "'Cinzel'", fontSize: "clamp(0.85rem,4vw,1.2rem)", color: "#d4af37", letterSpacing: 4 }}>INTERROGATION</h2>
        <span />
      </div>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 20px", display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 185px", background: "rgba(255,255,255,0.02)", border: "1px solid #1a1208", borderRadius: 4, padding: 18, textAlign: "center" }}>
          <div style={{ fontSize: 48 }}>{suspect.icon}</div>
          <h3 style={{ fontFamily: "'Cinzel'", color: "#d4af37", fontSize: "0.9rem", marginTop: 10, letterSpacing: 2 }}>{suspect.name}</h3>
          <p style={{ color: "#4a3a20", fontFamily: "'Cinzel'", fontSize: "0.68rem", letterSpacing: 2, marginBottom: 14 }}>{suspect.role}</p>
          <p style={{ color: "#4a3a20", fontFamily: "'Cinzel'", fontSize: "0.6rem", letterSpacing: 2, marginBottom: 6 }}>SUSPICION</p>
          <div style={{ height: 4, background: "#111", borderRadius: 2, marginBottom: 14 }}>
            <div style={{ width: `${(suspicion / suspect.questions.length) * 100}%`, height: "100%", background: suspColor, borderRadius: 2, transition: "all .5s" }} />
          </div>
          <p style={{ fontFamily: "'Crimson Text'", fontSize: "0.82rem", color: "#a89070", lineHeight: 1.6, textAlign: "left", marginBottom: 8 }}><strong style={{ color: "#8b6914" }}>MOTIVE: </strong>{suspect.motive}</p>
          <p style={{ fontFamily: "'Crimson Text'", fontSize: "0.82rem", color: "#4a3a20", lineHeight: 1.6, textAlign: "left" }}><strong>ALIBI: </strong>{suspect.alibi}</p>
        </div>
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 18 }}>
            <div style={{ fontSize: 52, animation: "wandPulse 2s infinite", flexShrink: 0 }}>🔍</div>
            <div style={{ flex: 1 }}>
              <p style={{ color: "#8b6914", fontFamily: "'Cinzel'", fontSize: "0.6rem", letterSpacing: 3, marginBottom: 6 }}>DETECTIVE AMRITHA</p>
              <p style={{ fontFamily: "'Crimson Text'", fontSize: "1rem", color: "#c8b89a", fontStyle: "italic", lineHeight: 1.7 }}>"{done ? "I have what I need. For now." : suspect.questions[qIdx]?.q}"</p>
            </div>
          </div>
          {answers.map((a, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", borderLeft: "2px solid #1a1208", padding: "10px 14px", marginBottom: 10, borderRadius: "0 4px 4px 0" }}>
              <p style={{ color: "#4a3a20", fontFamily: "'Cinzel'", fontSize: "0.68rem", letterSpacing: 1, marginBottom: 4 }}>{a.q}</p>
              <p style={{ color: "#a89070", fontFamily: "'Crimson Text'", fontSize: "0.95rem", fontStyle: "italic", marginBottom: 4 }}>"{a.a}"</p>
              <p style={{ color: a.s ? "#ff8866" : "#66cc88", fontFamily: "'Cinzel'", fontSize: "0.68rem", letterSpacing: 1 }}>{a.r}</p>
            </div>
          ))}
          {!done && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
              {suspect.questions[qIdx].options.map((opt, i) => (
                <button key={i} style={{ background: "rgba(212,175,55,0.03)", border: "1px solid #2a1e08", color: "#c8b89a", padding: "12px 16px", cursor: "pointer", fontFamily: "'Crimson Text'", fontSize: "1rem", textAlign: "left", borderRadius: 4, transition: "all .2s", lineHeight: 1.5 }} onClick={() => handleAnswer(opt)}>
                  <span style={{ color: "#d4af37", marginRight: 8 }}>→</span>"{opt.text}"
                </button>
              ))}
            </div>
          )}
          {done && (
            <div style={{ marginTop: 18, textAlign: "center" }} className="fiu">
              <p style={{ color: "#8b6914", fontFamily: "'Cinzel'", letterSpacing: 3, fontSize: "0.8rem", marginBottom: 14 }}>Interrogation complete.</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                <Btn onClick={() => setShowTells(!showTells)}>{showTells ? "Hide Analysis" : "View Analysis →"}</Btn>
                <Btn onClick={onBack} bg="rgba(255,255,255,0.04)" style={{ borderColor: "#2a1e08", color: "#4a3a20" }}>← Return</Btn>
              </div>
              {showTells && (
                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8, textAlign: "left" }} className="fiu">
                  {suspect.tells.map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "8px 12px", background: "rgba(212,175,55,0.04)", borderRadius: 2 }}>
                      <span style={{ color: "#d4af37", flexShrink: 0 }}>⚡</span>
                      <p style={{ color: "#a89070", fontFamily: "'Crimson Text'", fontSize: "0.9rem", lineHeight: 1.6 }}>{t}</p>
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

/* ══════════════════════════════════════════════════════════
   ANCIENT RUNES CIPHER
══════════════════════════════════════════════════════════ */
function RunesCipher({ onSolve, solved, onBack }) {
  const [input, setInput] = useState("");
  const [wrong, setWrong] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const check = () => {
    if (input.trim().toUpperCase() === HP_CIPHER.answer) { onSolve(); }
    else { setWrong(true); setTimeout(() => setWrong(false), 600); setInput(""); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at bottom,#050010,#050308)", display: "flex", flexDirection: "column" }} className="fi">
      <Stars count={40} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #0a0a20", background: "rgba(0,0,0,0.7)", position: "sticky", top: 0, zIndex: 50 }}>
        <Btn onClick={onBack} bg="linear-gradient(135deg,#1a1a6b,#2a2a9b)" style={{ padding: "8px 16px", fontSize: "0.75rem" }}>← Hogwarts</Btn>
        <h2 style={{ fontFamily: "'Cinzel'", fontSize: "clamp(0.85rem,4vw,1.2rem)", color: "#9090ff", letterSpacing: 4 }}>ANCIENT RUNES</h2>
        <span />
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 20px 40px" }}>
        <div style={{ maxWidth: 680, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 8, animation: "runeReveal 1s ease" }}>🔮</div>
          <h2 style={{ fontFamily: "'Cinzel Decorative'", fontSize: "clamp(1.2rem,5vw,2rem)", color: "#9090ff", letterSpacing: 4, marginBottom: 6, animation: "goldGlow 2s infinite" }}>The Trapdoor Inscription</h2>
          <p style={{ color: "#4a4a80", fontFamily: "'Crimson Text'", fontSize: "0.85rem", letterSpacing: 3, marginBottom: 20, fontStyle: "italic" }}>{HP_CIPHER.prompt}</p>
          <div style={{ background: "rgba(50,50,150,0.1)", border: "1px solid #4040aa44", borderRadius: 4, padding: "20px 28px", marginBottom: 16, animation: "mirrorGlow 3s ease-in-out infinite" }}>
            <p style={{ fontFamily: "'Cinzel Decorative'", fontSize: "clamp(0.9rem,3vw,1.3rem)", color: "#a0a0ff", letterSpacing: 6, wordSpacing: 14, lineHeight: 1.8 }}>{HP_CIPHER.encrypted}</p>
          </div>
          <p style={{ color: "#4a4a80", fontFamily: "'Crimson Text'", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>
            Dumbledore left this cipher on the trapdoor for the investigator he trusted most.<br />
            Shift each letter back by 7 to reveal the truth. (A=1, G→A, H→B... Z→S)
          </p>
          <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid #1a1a3a", borderRadius: 4, padding: 14, marginBottom: 20 }}>
            <p style={{ color: "#4a4a80", fontFamily: "'Cinzel'", fontSize: "0.65rem", letterSpacing: 3, marginBottom: 10 }}>SHIFT BACK BY 7 — REFERENCE TABLE</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
              {Array.from({ length: 26 }, (_, i) => {
                const enc = String.fromCharCode(65 + i);
                const dec = String.fromCharCode(((i - 7 + 26) % 26) + 65);
                return (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 20 }}>
                    <div style={{ color: "#9090ff", fontFamily: "'Courier Prime'", fontSize: "0.6rem" }}>{enc}</div>
                    <div style={{ color: "#333366", fontSize: "0.5rem" }}>↓</div>
                    <div style={{ color: "#d4af37", fontFamily: "'Courier Prime'", fontSize: "0.6rem" }}>{dec}</div>
                  </div>
                );
              })}
            </div>
          </div>
          {!solved ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <input
                style={{ width: "100%", maxWidth: 500, background: "rgba(0,0,0,0.6)", border: `1px solid ${wrong ? "#ff4444" : "#4040aa66"}`, color: "#a0a0ff", padding: "14px 20px", fontFamily: "'Cinzel'", fontSize: "0.85rem", letterSpacing: 3, outline: "none", borderRadius: 2, textAlign: "center", animation: wrong ? "shake .5s ease" : "none" }}
                value={input}
                onChange={e => setInput(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === "Enter" && check()}
                placeholder="TYPE DECODED MESSAGE..."
              />
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                <Btn onClick={check} bg="linear-gradient(135deg,#1a1a6b,#2a2aab)">🔮 DECODE →</Btn>
                <Btn onClick={() => setShowHint(s => !s)} bg="rgba(255,255,255,0.04)" style={{ borderColor: "#2a2a4a", color: "#4a4a80" }}>{showHint ? "Hide Hint" : "Hint?"}</Btn>
              </div>
              {wrong && <p style={{ color: "#ff4444", fontFamily: "'Cinzel'", fontSize: "0.78rem", letterSpacing: 2 }}>⚠ The runes reject your answer.</p>}
              {showHint && <p style={{ color: "#4a4a80", fontFamily: "'Crimson Text'", fontSize: "0.85rem", fontStyle: "italic", maxWidth: 400 }}>{HP_CIPHER.hint}</p>}
            </div>
          ) : (
            <div style={{ background: "rgba(0,200,100,0.06)", border: "1px solid #00cc88", borderRadius: 4, padding: 28 }} className="fiu">
              <p style={{ color: "#00cc88", fontFamily: "'Cinzel Decorative'", fontSize: "1.1rem", letterSpacing: 4, marginBottom: 10 }}>✦ DECODED ✦</p>
              <p style={{ color: "#00ffcc", fontFamily: "'Cinzel'", fontSize: "1rem", letterSpacing: 3, marginBottom: 14 }}>"{HP_CIPHER.answer}"</p>
              <p style={{ color: "#446655", fontFamily: "'Crimson Text'", fontSize: "0.95rem", fontStyle: "italic" }}>Dumbledore knew. He always knew. He was waiting for YOU to find it.</p>
              <div style={{ marginTop: 16 }}><Btn onClick={onBack} bg="linear-gradient(135deg,#1a3a1a,#2a5a2a)">← Return to Hogwarts</Btn></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ACCUSATION
══════════════════════════════════════════════════════════ */
function HPAccusation({ clues, interrogated, cipherSolved, onAccuse, onBack }) {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const foundKey = clues.filter(c => c.found && c.key).length;
  const ready = foundKey >= 5 && interrogated.length >= 3 && cipherSolved;

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at center,#100005,#050308)", paddingBottom: 60 }} className="fi">
      <Stars count={40} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #200010", background: "rgba(0,0,0,0.7)", position: "sticky", top: 0, zIndex: 50 }}>
        <Btn onClick={onBack} bg="rgba(255,255,255,0.04)" style={{ borderColor: "#2a1e08", color: "#4a3a20", padding: "8px 16px", fontSize: "0.75rem" }}>← Back</Btn>
        <h2 style={{ fontFamily: "'Cinzel'", fontSize: "clamp(0.9rem,4vw,1.2rem)", color: "#ff4444", letterSpacing: 4, animation: "goldGlow 2s infinite" }}>THE ACCUSATION</h2>
        <span />
      </div>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px", textAlign: "center" }}>
        <div style={{ display: "inline-block", border: "2px solid #8b0000", color: "#8b0000", padding: "6px 24px", fontFamily: "'Cinzel'", fontSize: "0.85rem", letterSpacing: 3, transform: "rotate(-2deg)", marginBottom: 20 }}>⚖️ NAME THE THIEF</div>
        <h2 style={{ fontFamily: "'Cinzel Decorative'", fontSize: "clamp(1.4rem,5vw,2rem)", color: "#ff4444", letterSpacing: 4, marginBottom: 8 }}>THE FINAL VERDICT</h2>
        <p style={{ color: "#4a2020", fontFamily: "'Crimson Text'", fontSize: "1rem", fontStyle: "italic", marginBottom: 24 }}>Choose carefully. A wrong accusation could give Voldemort time to escape.</p>
        {!ready && (
          <div style={{ background: "rgba(139,105,20,0.07)", border: "1px solid #8b691433", borderRadius: 4, padding: 16, marginBottom: 24 }}>
            <p style={{ color: "#8b6914", fontFamily: "'Cinzel'", fontSize: "0.78rem", letterSpacing: 1, marginBottom: 6 }}>⚠ Gather more evidence before making your accusation.</p>
            <p style={{ color: "#4a3a20", fontFamily: "'Cinzel'", fontSize: "0.68rem", letterSpacing: 1 }}>Key evidence: {foundKey}/5 · Suspects: {interrogated.length}/3 · Runes: {cipherSolved ? "✓" : "✗"}</p>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(115px,1fr))", gap: 10, marginBottom: 24 }}>
          {HP_SUSPECTS.map(s => (
            <div key={s.id} style={{ border: `1px solid ${selected === s.id ? "#ff4444" : "#1a1208"}`, borderRadius: 4, padding: "14px 10px", textAlign: "center", cursor: "pointer", transition: "all .3s", background: selected === s.id ? "rgba(255,68,68,0.07)" : "rgba(255,255,255,0.01)", transform: selected === s.id ? "scale(1.04)" : "scale(1)", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }} onClick={() => { setSelected(s.id); setResult(null); }}>
              <span style={{ fontSize: 30 }}>{s.icon}</span>
              <div style={{ fontFamily: "'Cinzel'", fontSize: "0.68rem", color: "#d4af37", letterSpacing: 1 }}>{s.name}</div>
              <div style={{ color: "#4a3a20", fontFamily: "'Crimson Text'", fontSize: "0.7rem" }}>{s.role}</div>
              {selected === s.id && <div style={{ background: "rgba(255,68,68,0.12)", border: "1px solid #ff4444", color: "#ff4444", padding: "2px 10px", fontSize: "0.6rem", fontFamily: "'Cinzel'", letterSpacing: 2, borderRadius: 2 }}>ACCUSED</div>}
            </div>
          ))}
        </div>
        {selected && !result && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }} className="fiu">
            <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 48, animation: "wandPulse 2s infinite" }}>🔍</span>
              <p style={{ fontFamily: "'Crimson Text'", fontSize: "1.05rem", color: "#a89070", fontStyle: "italic", maxWidth: 280, lineHeight: 1.7 }}>"I accuse <strong style={{ color: "#ff4444" }}>{HP_SUSPECTS.find(s => s.id === selected)?.name}</strong> of stealing the Philosopher's Stone."</p>
            </div>
            <Btn onClick={() => { const c = selected === "quirrell"; setResult(c ? "correct" : "wrong"); if (c) setTimeout(() => onAccuse(true), 1200); }} bg="linear-gradient(135deg,#8b0000,#aa1a1a)" style={{ border: "1.5px solid #ff4444", color: "#ffaaaa" }}>
              ⚡ MAKE ACCUSATION
            </Btn>
          </div>
        )}
        {result === "wrong" && (
          <div style={{ background: "rgba(255,68,68,0.05)", border: "1px solid #ff444433", borderRadius: 4, padding: 24 }} className="fiu">
            <p style={{ color: "#ff4444", fontFamily: "'Cinzel Decorative'", fontSize: "1.1rem", letterSpacing: 4, marginBottom: 8 }}>✗ WRONG ACCUSATION</p>
            <p style={{ color: "#886666", fontFamily: "'Crimson Text'", fontSize: "0.95rem", fontStyle: "italic", marginBottom: 16 }}>The evidence doesn't support this. Look more carefully at the runes...</p>
            <Btn onClick={() => { setSelected(null); setResult(null); }} bg="rgba(255,255,255,0.04)" style={{ borderColor: "#2a1e08", color: "#4a3a20" }}>Try Again</Btn>
          </div>
        )}
        {result === "correct" && (
          <div style={{ background: "rgba(0,200,100,0.05)", border: "1px solid #00cc88", borderRadius: 4, padding: 24 }} className="fiu">
            <p style={{ color: "#00cc88", fontFamily: "'Cinzel Decorative'", fontSize: "1.2rem", letterSpacing: 4, marginBottom: 8 }}>✓ CORRECT!</p>
            <p style={{ color: "#66cc88", fontFamily: "'Crimson Text'", fontSize: "1rem", fontStyle: "italic" }}>The turban falls. The truth is revealed. The Stone is safe...</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   VICTORY
══════════════════════════════════════════════════════════ */
function HPVictory() {
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at center,#0a0a00,#050308)", paddingBottom: 60, display: "flex", justifyContent: "center" }} className="fi">
      <Confetti /><Stars count={80} /><Candles />
      <div style={{ maxWidth: 680, width: "100%", padding: "32px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{ fontSize: 80, animation: "wandPulse 2s infinite" }}>⚡</div>
        <h1 style={{ fontFamily: "'Cinzel Decorative'", fontSize: "clamp(1.8rem,7vw,3rem)", color: "#d4af37", letterSpacing: 4, animation: "goldGlow 1.5s infinite" }}>CASE SOLVED!</h1>
        <div style={{ background: "linear-gradient(135deg,#8b6914,#d4a017)", color: "#0d0a06", padding: "8px 28px", fontFamily: "'Cinzel'", fontSize: "0.85rem", letterSpacing: 3, borderRadius: 24 }}>🏆 MASTER AUROR — DETECTIVE AMRITHA</div>
        <div style={{ background: "linear-gradient(145deg,#1a1208,#0f0a04)", border: "1px solid #d4af3766", borderRadius: 4, padding: "24px 20px", width: "100%", textAlign: "left" }}>
          <p style={{ color: "#8b6914", fontFamily: "'Cinzel'", fontSize: "0.75rem", letterSpacing: 4, textAlign: "center", marginBottom: 14 }}>◆ OFFICIAL CASE RESOLUTION ◆</p>
          <p style={{ fontFamily: "'Crimson Text'", fontSize: "1.05rem", color: "#c8b89a", lineHeight: 1.8, marginBottom: 16, textAlign: "center" }}>
            <strong style={{ color: "#ff4444" }}>Professor Quirinus Quirrell</strong>, possessed by Lord Voldemort, is hereby found guilty of attempting to steal the Philosopher's Stone from Hogwarts.
          </p>
          <p style={{ color: "#4a3a20", fontFamily: "'Cinzel'", fontSize: "0.68rem", letterSpacing: 3, marginBottom: 10 }}>EVIDENCE THAT BROKE THE CASE:</p>
          {[
            "Handkerchief with initials Q.Q. found in the Potions dungeon",
            "His refined flute matched the instrument found near sleeping Fluffy",
            "His violet ink appeared in the Restricted Section sign-out log",
            "Letter from 'Q.Q. to R.Q.' — Quirrell to his master Voldemort",
            "Felix Felicis traces matched his known apothecary purchases",
            "Peeves spotted him near the third-floor corridor at 11:20 PM",
            "Hagrid confirmed a 'turban-wearing stranger' asked about Fluffy's weakness",
            "Ancient Runes decoded: QUIRRELL WAS THE THIEF",
            "The Mirror of Erised note: 'I see myself holding it. I always have.'",
          ].map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: "1px solid #1a1208" }}>
              <span style={{ color: "#d4af37", flexShrink: 0 }}>⚡</span>
              <span style={{ color: "#a89070", fontFamily: "'Cinzel'", fontSize: "0.75rem", letterSpacing: 1 }}>{e}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "linear-gradient(135deg,rgba(139,105,20,0.12),rgba(139,26,26,0.12))", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, padding: 28, textAlign: "center", width: "100%" }}>
          <p style={{ fontFamily: "'Cinzel Decorative'", fontSize: "clamp(1.1rem,5vw,1.8rem)", color: "#d4af37", letterSpacing: 3, marginBottom: 16, animation: "goldGlow 2s infinite" }}>
            ⚡ Happy Birthday, Amritha! ⚡
          </p>
          <p style={{ fontFamily: "'Crimson Text'", fontSize: "1.05rem", color: "#c8b89a", lineHeight: 2.1 }}>
            You cracked the cipher, interrogated every suspect,<br />
            explored every shadowed corridor of Hogwarts,<br />
            and found the truth hidden in the runes.<br /><br />
            <em style={{ color: "#d4af37" }}>
              "You are the brightest witch of your age, Amritha.<br />
              Not because of what you know —<br />
              but because of how fiercely you love,<br />
              how bravely you seek,<br />
              and how brilliantly you shine.<br /><br />
              May your 25th year be full of magic<br />
              that even Dumbledore couldn't predict. 💕"
            </em>
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16, fontSize: "1.6rem" }}>
            {["⚡", "🦁", "📚", "🦉", "🪄", "🎂", "✨", "💕"].map((e, i) => (
              <span key={i} style={{ animation: `heartbeat 1.2s ${i * 0.15}s infinite` }}>{e}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   HOGWARTS MAP HUB
══════════════════════════════════════════════════════════ */
function HogwartsMap({ clues, interrogated, cipherSolved, setView }) {
  const [showBook, setShowBook] = useState(false);
  const found = clues.filter(c => c.found).length;
  const total = clues.length;

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#0d0a06,#050308)", position: "relative" }}>
      <Stars count={60} /><Candles />
      {showBook && <Spellbook clues={clues} onClose={() => setShowBook(false)} />}
      {/* HUD */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", background: "rgba(0,0,0,0.8)", borderBottom: "1px solid #1a1208", flexWrap: "wrap", gap: 10, position: "sticky", top: 0, zIndex: 500 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 36, animation: "wandPulse 2s infinite" }}>🔍</span>
          <div>
            <p style={{ fontFamily: "'Cinzel'", color: "#d4af37", fontSize: "0.85rem", letterSpacing: 2 }}>Det. Amritha</p>
            <p style={{ color: "#4a3a20", fontFamily: "'Cinzel'", fontSize: "0.58rem", letterSpacing: 2 }}>Hogwarts Auror</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          {[["CLUES", `${found}/${total}`, "#d4af37"], ["SUSPECTS", `${interrogated.length}/${HP_SUSPECTS.length}`, "#d4af37"], ["RUNES", cipherSolved ? "✓" : "✗", cipherSolved ? "#00cc88" : "#ff4444"]].map(([l, v, c]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <p style={{ color: "#4a3a20", fontFamily: "'Cinzel'", fontSize: "0.56rem", letterSpacing: 2 }}>{l}</p>
              <p style={{ color: c, fontFamily: "'Cinzel Decorative'", fontSize: "0.95rem", letterSpacing: 2 }}>{v}</p>
            </div>
          ))}
        </div>
        <button style={{ background: "rgba(212,175,55,0.08)", border: "1px solid #d4af3733", color: "#d4af37", padding: "8px 14px", cursor: "pointer", fontFamily: "'Cinzel'", fontSize: "0.68rem", letterSpacing: 2, borderRadius: 2 }} onClick={() => setShowBook(true)}>📜 Spell Book</button>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 20px", paddingBottom: 60 }}>
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <p style={{ color: "#4a3a20", fontFamily: "'Cinzel'", fontSize: "0.68rem", letterSpacing: 5, marginBottom: 6 }}>A HOGWARTS MYSTERY</p>
          <h1 style={{ fontFamily: "'Cinzel Decorative'", fontSize: "clamp(1.3rem,6vw,2.5rem)", color: "#d4af37", letterSpacing: 4, animation: "goldGlow 3s infinite", marginBottom: 4 }}>THE PHILOSOPHER'S THIEF</h1>
          <p style={{ color: "#4a3a20", fontFamily: "'Crimson Text'", fontSize: "0.8rem", letterSpacing: 3, fontStyle: "italic", marginBottom: 14 }}>Hogwarts · 11:47 PM · A storm gathers</p>
          <div style={{ width: "100%", maxWidth: 360, height: 3, background: "#1a1208", borderRadius: 2, margin: "0 auto 6px" }}>
            <div style={{ width: `${(found / total) * 100}%`, height: "100%", background: "linear-gradient(90deg,#8b6914,#d4af37)", borderRadius: 2, transition: "width .8s" }} />
          </div>
          <p style={{ color: "#2a1e08", fontFamily: "'Cinzel'", fontSize: "0.65rem", letterSpacing: 2 }}>{Math.round((found / total) * 100)}% investigated</p>
        </div>

        {/* Rooms */}
        <div style={{ marginBottom: 26 }}>
          <h3 style={{ fontFamily: "'Cinzel'", color: "#8b6914", fontSize: "0.78rem", letterSpacing: 4, marginBottom: 12, textAlign: "center" }}>🏰 EXPLORE HOGWARTS</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(128px,1fr))", gap: 10 }}>
            {HP_ROOMS.map(room => {
              const rc = clues.filter(c => room.clues.some(x => x.id === c.id) && c.found).length;
              const done = rc === room.clues.length;
              return (
                <div key={room.id} style={{ border: `1px solid ${done ? "#d4af37" : "#1a1208"}`, borderRadius: 4, padding: "14px 10px", textAlign: "center", cursor: "pointer", transition: "all .3s", background: done ? "rgba(212,175,55,0.06)" : "rgba(255,255,255,0.01)", display: "flex", flexDirection: "column", gap: 5, alignItems: "center" }} onClick={() => setView({ type: "room", id: room.id })}>
                  <span style={{ fontSize: 26 }}>{room.icon}</span>
                  <div style={{ fontFamily: "'Cinzel'", fontSize: "0.68rem", color: "#d4af37", letterSpacing: 1 }}>{room.name}</div>
                  <div style={{ color: "#4a3a20", fontFamily: "'Cinzel'", fontSize: "0.6rem", letterSpacing: 2 }}>{rc}/{room.clues.length}</div>
                  {done && <div style={{ color: "#8b6914", fontFamily: "'Cinzel'", fontSize: "0.56rem", letterSpacing: 2 }}>✓ CLEARED</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Suspects */}
        <div style={{ marginBottom: 26 }}>
          <h3 style={{ fontFamily: "'Cinzel'", color: "#8b6914", fontSize: "0.78rem", letterSpacing: 4, marginBottom: 12, textAlign: "center" }}>🎭 INTERROGATE SUSPECTS</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(108px,1fr))", gap: 10 }}>
            {HP_SUSPECTS.map(s => (
              <div key={s.id} style={{ border: `1px solid ${interrogated.includes(s.id) ? "#d4af37" : "#1a1208"}`, borderRadius: 4, padding: "12px 8px", textAlign: "center", cursor: "pointer", transition: "all .3s", background: interrogated.includes(s.id) ? "rgba(212,175,55,0.05)" : "rgba(255,255,255,0.01)", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }} onClick={() => setView({ type: "interrogation", id: s.id })}>
                <span style={{ fontSize: 24 }}>{s.icon}</span>
                <div style={{ fontFamily: "'Cinzel'", fontSize: "0.65rem", color: "#d4af37", letterSpacing: 1 }}>{s.name}</div>
                <div style={{ color: "#4a3a20", fontFamily: "'Crimson Text'", fontSize: "0.68rem" }}>{s.role}</div>
                {interrogated.includes(s.id) && <div style={{ color: "#8b6914", fontFamily: "'Cinzel'", fontSize: "0.56rem", letterSpacing: 2 }}>QUESTIONED</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Special actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ border: `1px solid ${cipherSolved ? "#00cc88" : "#1a1a4a"}`, borderRadius: 4, padding: "18px 10px", textAlign: "center", cursor: "pointer", transition: "all .3s", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }} onClick={() => setView({ type: "cipher" })}>
            <span style={{ fontSize: 30 }}>🔮</span>
            <div style={{ fontFamily: "'Cinzel'", fontSize: "0.78rem", color: cipherSolved ? "#00cc88" : "#9090ff", letterSpacing: 2 }}>Ancient Runes</div>
            <div style={{ color: "#4a3a20", fontFamily: "'Crimson Text'", fontSize: "0.68rem" }}>Decode the inscription</div>
            {cipherSolved && <div style={{ color: "#00cc88", fontFamily: "'Cinzel'", fontSize: "0.6rem", letterSpacing: 2 }}>✓ SOLVED</div>}
          </div>
          <div style={{ border: "1px solid #4a0000", borderRadius: 4, padding: "18px 10px", textAlign: "center", cursor: "pointer", transition: "all .3s", background: "rgba(255,0,0,0.02)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }} onClick={() => setView({ type: "accuse" })}>
            <span style={{ fontSize: 30 }}>⚖️</span>
            <div style={{ fontFamily: "'Cinzel'", fontSize: "0.78rem", color: "#ff6666", letterSpacing: 2 }}>Make Accusation</div>
            <div style={{ color: "#4a3a20", fontFamily: "'Crimson Text'", fontSize: "0.68rem" }}>Name the thief</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   INTRO
══════════════════════════════════════════════════════════ */
function HPIntro({ onStart }) {
  const [step, setStep] = useState(0);
  const { out, done } = useTypewriter(CASE.premise, 28, step === 1);
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at center,#0d0a06,#020100)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} className="fi">
      <Stars count={80} /><Candles />
      {step === 0 && (
        <div style={{ textAlign: "center", maxWidth: 540, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, position: "relative", zIndex: 5 }} className="fiu">
          <p style={{ color: "#4a3a20", fontFamily: "'Cinzel'", fontSize: "0.68rem", letterSpacing: 5 }}>A HOGWARTS MYSTERY</p>
          <h1 style={{ fontFamily: "'Cinzel Decorative'", fontSize: "clamp(1.6rem,8vw,3.2rem)", color: "#d4af37", letterSpacing: 4, animation: "goldGlow 3s infinite", lineHeight: 1.15, textAlign: "center" }}>THE PHILOSOPHER'S<br />THIEF</h1>
          <p style={{ color: "#4a3a20", fontFamily: "'Crimson Text'", fontSize: "0.95rem", fontStyle: "italic", letterSpacing: 2 }}>A Hogwarts Mystery</p>
          <div style={{ width: 60, height: 1, background: "#8b691433" }} />
          <div style={{ fontSize: 80, animation: "wandPulse 2s infinite" }}>⚡</div>
          <p style={{ color: "#8b6914", fontFamily: "'Cinzel'", fontSize: "0.7rem", letterSpacing: 4 }}>DETECTIVE AMRITHA</p>
          <p style={{ color: "#4a3a20", fontFamily: "'Crimson Text'", fontSize: "0.9rem", fontStyle: "italic" }}>The brightest witch of her age. Born for this.</p>
          <div style={{ width: 60, height: 1, background: "#8b691433" }} />
          <p style={{ color: "#2a1e08", fontFamily: "'Cinzel'", fontSize: "0.7rem", letterSpacing: 2 }}>📍 {CASE.setting}</p>
          <Btn onClick={() => setStep(1)} style={{ animation: "wandPulse 2s infinite", marginTop: 8 }}>🪄 Begin Investigation →</Btn>
        </div>
      )}
      {step === 1 && (
        <div style={{ width: "100%", maxWidth: 660, position: "relative", zIndex: 5 }} className="fi">
          <div style={{ textAlign: "center", marginBottom: 18 }}>
            <span style={{ display: "inline-block", border: "1px solid #d4af3744", color: "#d4af37", padding: "6px 24px", fontFamily: "'Cinzel'", fontSize: "0.78rem", letterSpacing: 4 }}>CASE BRIEFING</span>
          </div>
          <div style={{ background: "linear-gradient(145deg,#1a1208,#0f0a04)", border: "1px solid #1a1208", borderRadius: 4, padding: "26px 22px", display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ fontSize: 60, animation: "wandPulse 2s infinite", flexShrink: 0 }}>⚡</div>
              <pre style={{ fontFamily: "'Crimson Text'", fontSize: "1.05rem", color: "#c8b89a", lineHeight: 1.9, whiteSpace: "pre-wrap", flex: 1, minWidth: 200, minHeight: 80 }}>{out}{!done && <span style={{ animation: "goldGlow .8s infinite" }}>▌</span>}</pre>
            </div>
            {done && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }} className="fiu">
                <div style={{ width: "100%", background: "rgba(212,175,55,0.03)", border: "1px solid #1a1208", borderRadius: 4, padding: 18 }}>
                  <p style={{ color: "#8b6914", fontFamily: "'Cinzel'", fontSize: "0.66rem", letterSpacing: 4, marginBottom: 12, textAlign: "center" }}>HOW TO PLAY</p>
                  {[["🏰", "Explore 5 locations", "Find clues hidden across Hogwarts"],["🎭", "Interrogate 5 suspects", "Question everyone — watch for tells"],["🔮", "Decode Ancient Runes", "Crack the trapdoor inscription"],["⚖️", "Name the thief", "One accusation — make it count"]].map(([icon, t, d], i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                      <div>
                        <p style={{ color: "#d4af37", fontFamily: "'Cinzel'", fontSize: "0.75rem", letterSpacing: 2, marginBottom: 2 }}>{t}</p>
                        <p style={{ color: "#4a3a20", fontFamily: "'Crimson Text'", fontSize: "0.9rem" }}>{d}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Btn onClick={onStart} style={{ animation: "wandPulse 2s infinite" }}>🏰 Enter Hogwarts →</Btn>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ROOT CONTROLLER
══════════════════════════════════════════════════════════ */
export default function HogwartsMystery() {
  const [phase, setPhase] = useState("intro");
  const [view, setViewState] = useState(null);
  const [clues, setClues] = useState(HP_ROOMS.flatMap(r => r.clues.map(c => ({ ...c, found: false }))));
  const [interrogated, setInterrogated] = useState([]);
  const [cipherSolved, setCipherSolved] = useState(false);

  const setView = v => { setViewState(v); setPhase(v ? v.type : "manor"); };
  const findClue = id => setClues(prev => prev.map(c => c.id === id ? { ...c, found: true } : c));
  const completeInt = id => setInterrogated(prev => prev.includes(id) ? prev : [...prev, id]);

  if (phase === "intro") return <><style>{G}</style><HPIntro onStart={() => setPhase("manor")} /></>;
  if (phase === "victory") return <><style>{G}</style><HPVictory /></>;

  const room = view?.type === "room" ? HP_ROOMS.find(r => r.id === view.id) : null;
  const suspect = view?.type === "interrogation" ? HP_SUSPECTS.find(s => s.id === view.id) : null;

  if (phase === "room" && room) return <><style>{G}</style><RoomExplorer room={room} allClues={clues} onFindClue={findClue} onBack={() => setView(null)} /></>;
  if (phase === "interrogation" && suspect) return <><style>{G}</style><Interrogation suspect={suspect} onBack={() => setView(null)} onComplete={completeInt} /></>;
  if (phase === "cipher") return <><style>{G}</style><RunesCipher onSolve={() => setCipherSolved(true)} solved={cipherSolved} onBack={() => setView(null)} /></>;
  if (phase === "accuse") return <><style>{G}</style><HPAccusation clues={clues} interrogated={interrogated} cipherSolved={cipherSolved} onAccuse={c => { if (c) setPhase("victory"); }} onBack={() => setView(null)} /></>;

  return <><style>{G}</style><HogwartsMap clues={clues} interrogated={interrogated} cipherSolved={cipherSolved} setView={setView} /></>;
}