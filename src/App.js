import { useState, useEffect, useRef } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────
const BUDGET_TOTAL = 50_000_000;

const INITIAL_TEAMS = [
  { id: 1,  name: "A puerta gayola",       valor: 28_870_000 },
  { id: 2,  name: "La bota de Arda Turan", valor: 28_810_000 },
  { id: 3,  name: "Los Cojos del Barrio",  valor: 28_840_000 },
  { id: 4,  name: "Maccabi_deLevantar",    valor: 28_930_000 },
  { id: 5,  name: "Manuel Ruiz de Lopera", valor: 28_830_000 },
  { id: 6,  name: "Sabio de hortaleza",    valor: 28_790_000 },
  { id: 7,  name: "Sr Coordinador",        valor: 28_880_000 },
  { id: 8,  name: "Sr. Lobo",             valor: 28_870_000, isMe: true },
  { id: 9,  name: "TheSpecialOne",         valor: 28_830_000 },
  { id: 10, name: "Vodka Juniors",         valor: 28_970_000 },
];

const MY_SQUAD = [
  { name: "Yüksek",          pos: "MC", valor: 4_890_000, flag: "🇹🇷", sel: "Turquía",    mundialScore: 2 },
  { name: "Pathé Ciss",      pos: "MC", valor: 1_590_000, flag: "🇸🇳", sel: "Senegal",    mundialScore: 3 },
  { name: "Sunjic",          pos: "MC", valor: 1_090_000, flag: "🇧🇦", sel: "Bosnia",     mundialScore: 2 },
  { name: "Ermin Mahmić",    pos: "MC", valor:   530_000, flag: "🇧🇦", sel: "Bosnia",     mundialScore: 2 },
  { name: "Akgün",           pos: "DL", valor: 4_560_000, flag: "🇹🇷", sel: "Turquía",    mundialScore: 2 },
  { name: "Jhon Lucumí",     pos: "DF", valor: 2_990_000, flag: "🇨🇴", sel: "Colombia",   mundialScore: 3 },
  { name: "Axel Tuanzebe",   pos: "DF", valor:   400_000, flag: "🇨🇩", sel: "Congo",      mundialScore: 1 },
  { name: "Hassan Tambakti", pos: "DF", valor:   240_000, flag: "🇸🇦", sel: "Arabia S.",  mundialScore: 1 },
  { name: "Andrés Andrade",  pos: "DF", valor:   170_000, flag: "🇵🇦", sel: "Panamá",     mundialScore: 1 },
  { name: "Vlasic",          pos: "MC", valor: 5_710_000, flag: "🇭🇷", sel: "Croacia",    mundialScore: 3 },
  { name: "Gue-sung Cho",    pos: "DL", valor: 2_990_000, flag: "🇰🇷", sel: "Corea Sur",  mundialScore: 2 },
  { name: "Echghouyab",      pos: "DL", valor:   200_000, flag: "🇲🇦", sel: "Marruecos",  mundialScore: 3 },
  { name: "Anang",           pos: "PT", valor:   270_000, flag: "🇬🇭", sel: "Ghana",      mundialScore: 1 },
  { name: "Paul Izzo",       pos: "PT", valor:   200_000, flag: "🇦🇺", sel: "Australia",  mundialScore: 1 },
  { name: "Kristoffer Ajer", pos: "DF", valor: 3_040_000, flag: "🇳🇴", sel: "Noruega",    mundialScore: 3 },
];

const SELLS = [
  { name: "Andrés Andrade",  valor: 170_000,  reason: "Panamá — eliminación rápida segura" },
  { name: "Axel Tuanzebe",   valor: 400_000,  reason: "Congo — no es favorita" },
  { name: "Hassan Tambakti", valor: 240_000,  reason: "Valor muy bajo, poca proyección" },
  { name: "Ermin Mahmić",    valor: 530_000,  reason: "Bosnia — grupo complicado" },
  { name: "Paul Izzo",       valor: 200_000,  reason: "Australia — poca progresión esperada" },
  { name: "Anang",           valor: 270_000,  reason: "Ghana — rendimiento bajo" },
];

const BUYS = [
  {
    name: "Maignan", pos: "PT", flag: "🇫🇷", sel: "Francia",
    valor: 5_570_000, trend: +130_000, priority: 1,
    reason: "Francia top 3 favorita (13%). Portero titular indiscutible. Sustituye a Paul Izzo y Anang.",
    mundialScore: 5,
  },
  {
    name: "Hakimi", pos: "DF", flag: "🇲🇦", sel: "Marruecos",
    valor: 7_730_000, trend: +150_000, priority: 1,
    reason: "Marruecos llegó a semis en 2022. Lateral top mundial. Sube 150K ya.",
    mundialScore: 4,
  },
  {
    name: "Mamadou Sarr", pos: "DF", flag: "🇸🇳", sel: "Senegal",
    valor: 2_210_000, trend: -10_000, priority: 2,
    reason: "Senegal tiene potencial de sorpresa. Precio razonable para la calidad.",
    mundialScore: 3,
  },
  {
    name: "Vitinha", pos: "MC", flag: "🇵🇹", sel: "Portugal",
    valor: 17_050_000, trend: +90_000, priority: 2,
    reason: "Portugal llega lejos. Grupo K fácil. Jugador de clase mundial. Caro pero rentable.",
    mundialScore: 4,
  },
  {
    name: "Schlager", pos: "MC", flag: "🇦🇹", sel: "Austria",
    valor: 1_620_000, trend: +30_000, priority: 3,
    reason: "Austria puede sorprender en el Grupo J. Precio accesible.",
    mundialScore: 3,
  },
  {
    name: "Lindelöf", pos: "DF", flag: "🇸🇪", sel: "Suecia",
    valor: 1_800_000, trend: +70_000, priority: 3,
    reason: "Suecia en grupo F con Países Bajos. Defensa sólido con recorrido.",
    mundialScore: 3,
  },
];

const COACHES = [
  {
    name: "Deschamps", flag: "🇫🇷", sel: "Francia",
    valor: 5_380_000, trend: -10_000,
    reason: "Francia favorita #2 (13%). Máximos +3 por victoria garantizados.",
    rec: true,
  },
  {
    name: "Javier Aguirre", flag: "🇲🇽", sel: "México",
    valor: 1_240_000, trend: +20_000,
    reason: "México juega en casa. Motivación extra. Precio intermedio.",
    rec: false,
  },
  {
    name: "Lopetegui", flag: "🇶🇦", sel: "Qatar",
    valor: 230_000, trend: 0,
    reason: "Precio irrisorio. Qatar juega en casa. Cualquier victoria son +3 gratis.",
    rec: false,
  },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
const fmt = (n) => {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return (n / 1_000_000).toFixed(2).replace(".", ",") + "M€";
  if (abs >= 1_000) return Math.round(n / 1_000) + "K€";
  return n.toLocaleString("es-ES") + "€";
};

const MUNDIAL_STARS = (s) => "★".repeat(s) + "☆".repeat(5 - s);

const POS_COLOR = { PT: "#6366f1", DF: "#22c55e", MC: "#f59e0b", DL: "#ef4444" };

// ── TABS ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "liga",     label: "Liga",     icon: "🏆" },
  { id: "equipo",   label: "Equipo",   icon: "⚽" },
  { id: "analisis", label: "Análisis", icon: "📊" },
  { id: "scout",    label: "Scout IA", icon: "🤖" },
];

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]         = useState("liga");
  const [teams, setTeams]     = useState(null);
  const [movements, setMov]   = useState([]);
  const [toast, setToast]     = useState(null);
  const [scoutImgs, setScoutImgs] = useState([]);
  const [scoutText, setScoutText] = useState("");
  const [scoutMode, setScoutMode] = useState("imagen"); // "imagen" | "texto"
  const [scoutResult, setScoutResult] = useState(null);
  const [scoutLoading, setScoutLoading] = useState(false);
  const [expandedPlayer, setExpandedPlayer] = useState(null);
  const fileRef = useRef();

  // Load storage
  useEffect(() => {
    (async () => {
      try {
        const t = await window.storage.get("bw_teams2");
        setTeams(t ? JSON.parse(t.value) : INITIAL_TEAMS.map(team => ({
          ...team, presupuesto: BUDGET_TOTAL - team.valor, valorActual: team.valor, movs: [],
        })));
      } catch {
        setTeams(INITIAL_TEAMS.map(team => ({
          ...team, presupuesto: BUDGET_TOTAL - team.valor, valorActual: team.valor, movs: [],
        })));
      }
      try {
        const m = await window.storage.get("bw_movs2");
        setMov(m ? JSON.parse(m.value) : []);
      } catch { setMov([]); }
    })();
  }, []);

  const saveTeams = async (t) => { setTeams(t); await window.storage.set("bw_teams2", JSON.stringify(t)); };
  const showToast = (msg, type = "ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const me = teams?.find(t => t.isMe);
  const sellTotal = SELLS.reduce((a, s) => a + s.valor, 0);
  const buyTotal  = BUYS.filter(b => b.priority === 1).reduce((a, b) => a + b.valor, 0);
  const coachCost = COACHES.find(c => c.rec)?.valor || 0;
  const saldoTras = (me?.presupuesto || 0) + sellTotal - buyTotal - coachCost;

  // Scout IA
  const handleScoutFiles = async (files) => {
    const imgs = [];
    for (const f of files) {
      const b64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(",")[1]);
        r.onerror = rej;
        r.readAsDataURL(f);
      });
      imgs.push({ b64, type: f.type || "image/jpeg", preview: URL.createObjectURL(f) });
    }
    setScoutImgs(imgs);
  };

  const runScout = async () => {
    if (!scoutImgs.length && !scoutText.trim()) return;
    setScoutLoading(true);
    setScoutResult(null);
    try {
      const imgBlocks = scoutImgs.map(img => ({
        type: "image",
        source: { type: "base64", media_type: img.type, data: img.b64 },
      }));

      const PROMPT_BASE = `Eres un experto en fantasy fútbol Biwenger analizando el mercado del Mundial 2026.

Contexto del Mundial 2026:
- Favoritas al título: España (18%), Francia (13%), Inglaterra (14%), Argentina/Brasil (11%), Portugal
- Selecciones con buen recorrido: Marruecos, Croacia, Noruega, Senegal, Colombia, México
- Selecciones de eliminación temprana probable: Panamá, Qatar, Congo, Uzbekistán, Arabia Saudita

Mi plantilla actual: Yüksek (MC,Turquía), Pathé Ciss (MC,Senegal), Sunjic (MC,Bosnia), Ermin Mahmić (MC,Bosnia), Akgün (DL,Turquía), Jhon Lucumí (DF,Colombia), Axel Tuanzebe (DF,Congo), Hassan Tambakti (DF,ArabiaSaudita), Andrés Andrade (DF,Panamá), Vlasic (MC,Croacia), Gue-sung Cho (DL,CoreaSur), Echghouyab (DL,Marruecos), Anang (PT,Ghana), Paul Izzo (PT,Australia), Kristoffer Ajer (DF,Noruega).
Saldo disponible: 21.13M€

El formato de texto de movimientos de mercado es: "Jugador: Cambia por X € a NombreEquipo"
Esto indica que ese jugador ha sido fichado por ese equipo por ese precio.

Para CADA jugador mencionado, devuelve SOLO JSON válido sin backticks:
{
  "jugadores": [
    {
      "nombre": "nombre",
      "pos": "PT/DF/MC/DL/E",
      "seleccion": "país",
      "valor": número en euros,
      "tendencia": 0,
      "mundialScore": número del 1 al 5,
      "recomendacion": "FICHAR" o "PASAR" o "VIGILAR",
      "razon": "explicación breve en español máx 20 palabras",
      "prioridad": 1, 2 o 3,
      "equipo_destino": "nombre del equipo que lo fichó si aparece, sino null"
    }
  ],
  "resumen": "análisis de los movimientos y estrategia recomendada en 2-3 frases"
}`;

      const textContent = scoutText.trim()
        ? `${PROMPT_BASE}\n\nMovimientos de mercado a analizar:\n${scoutText.trim()}`
        : `${PROMPT_BASE}\n\nAnaliza los jugadores que aparecen en estas capturas del mercado de Biwenger.`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
  "Content-Type": "application/json",
  "x-api-key": "sk-ant-sk-ant-api03-4tjX1gaFdoOqgTFTK0FXG68wNLMGJptDSJiG8Gp6tp4UDd2jFc7vvN2ifH1sSa5nbZgHSano1W8yqnN3RfO8cg-_vYyTAAA",
  "anthropic-version": "2023-06-01",
  "anthropic-dangerous-direct-browser-access": "true"
},
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              ...imgBlocks,
              { type: "text", text: textContent },
            ],
          }],
        }),
      });

      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setScoutResult(parsed);
      showToast(`Scout analizó ${parsed.jugadores?.length || 0} jugadores`, "ok");
    } catch (e) {
      showToast("Error: " + e.message, "err");
    }
    setScoutLoading(false);
  };

  if (!teams) return (
    <div style={{ background: "#050508", color: "#fff", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>⚽</div>
        <div>Cargando...</div>
      </div>
    </div>
  );

  return (
    <div style={{
      background: "#050508",
      minHeight: "100vh",
      color: "#f0ede8",
      fontFamily: "Georgia, 'Times New Roman', serif",
      maxWidth: 430,
      margin: "0 auto",
      paddingBottom: 80,
      position: "relative",
    }}>

      {/* HEADER */}
      <div style={{
        background: "linear-gradient(160deg, #0d0d1f 0%, #1a0a2e 60%, #0f1a3d 100%)",
        padding: "20px 18px 14px",
        borderBottom: "1px solid #d4af3720",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#d4af3780", textTransform: "uppercase", marginBottom: 2 }}>Biwenger</div>
            <div style={{ fontSize: 20, fontWeight: "bold", color: "#d4af37", letterSpacing: 0.5 }}>Sr. Lobo ⚽</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 18, fontWeight: "bold", color: (me?.presupuesto || 0) > 0 ? "#4ade80" : "#f87171" }}>
              {fmt(me?.presupuesto || 0)}
            </div>
            <div style={{ fontSize: 9, color: "#ffffff40", letterSpacing: 1, textTransform: "uppercase" }}>Saldo disponible</div>
          </div>
        </div>
      </div>

      {/* TAB CONTENT */}
      <div style={{ padding: "0 0 8px" }}>

        {/* ── LIGA ── */}
        {tab === "liga" && (
          <div style={{ padding: "16px 14px" }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "#d4af3770", marginBottom: 14, textTransform: "uppercase" }}>
              Clasificación — Presupuesto estimado
            </div>
            {[...teams].sort((a, b) => b.presupuesto - a.presupuesto).map((team, i) => {
              const isMe = team.isMe;
              const pct = Math.max(0, (team.presupuesto / BUDGET_TOTAL) * 100);
              return (
                <div key={team.id} style={{
                  marginBottom: 8,
                  background: isMe ? "linear-gradient(135deg, #d4af3712, #d4af3705)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isMe ? "#d4af3740" : "#ffffff0d"}`,
                  borderRadius: 14,
                  padding: "12px 14px",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  {isMe && <div style={{ position: "absolute", top: 0, left: 0, width: "3px", height: "100%", background: "#d4af37" }} />}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: "50%",
                        background: i === 0 ? "#d4af37" : i === 1 ? "#a8a8b0" : i === 2 ? "#cd7f32" : "#ffffff15",
                        color: i < 3 ? "#000" : "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: "bold",
                      }}>{i + 1}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: isMe ? "bold" : "normal", color: isMe ? "#d4af37" : "#f0ede8" }}>
                          {team.name}
                        </div>
                        <div style={{ fontSize: 10, color: "#ffffff40" }}>Valor: {fmt(team.valorActual)}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 15, fontWeight: "bold", color: team.presupuesto >= 0 ? "#4ade80" : "#f87171" }}>
                        {fmt(team.presupuesto)}
                      </div>
                    </div>
                  </div>
                  <div style={{ height: 2, background: "#ffffff08", borderRadius: 2 }}>
                    <div style={{
                      height: "100%", borderRadius: 2,
                      width: `${pct}%`,
                      background: isMe ? "#d4af37" : pct > 50 ? "#4ade80" : pct > 25 ? "#facc15" : "#f87171",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── EQUIPO ── */}
        {tab === "equipo" && (
          <div style={{ padding: "16px 14px" }}>
            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
              {[
                { label: "Valor equipo",  val: fmt(me?.valorActual || 28_870_000), color: "#d4af37" },
                { label: "Saldo",         val: fmt(me?.presupuesto || 21_130_000), color: "#4ade80" },
                { label: "Total",         val: fmt((me?.valorActual || 28_870_000) + (me?.presupuesto || 21_130_000)), color: "#60a5fa" },
                { label: "Jugadores",     val: "15",                               color: "#c084fc" },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ background: "#ffffff05", border: "1px solid #ffffff0d", borderRadius: 14, padding: "14px 12px" }}>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: "#ffffff40", marginBottom: 4, textTransform: "uppercase" }}>{label}</div>
                  <div style={{ fontSize: 17, fontWeight: "bold", color }}>{val}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 10, letterSpacing: 3, color: "#d4af3770", marginBottom: 12, textTransform: "uppercase" }}>
              Plantilla completa
            </div>
            {MY_SQUAD.map((p, i) => (
              <div key={i} onClick={() => setExpandedPlayer(expandedPlayer === i ? null : i)} style={{
                background: "#ffffff04",
                border: "1px solid #ffffff0d",
                borderRadius: 12,
                padding: "11px 13px",
                marginBottom: 7,
                cursor: "pointer",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 32, height: 20, borderRadius: 5,
                      background: POS_COLOR[p.pos] + "33",
                      border: `1px solid ${POS_COLOR[p.pos]}60`,
                      color: POS_COLOR[p.pos],
                      fontSize: 10, fontWeight: "bold",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{p.pos}</div>
                    <div>
                      <div style={{ fontSize: 14 }}>{p.flag} {p.name}</div>
                      <div style={{ fontSize: 10, color: "#ffffff40" }}>{p.sel}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: "bold", color: "#d4af37" }}>{fmt(p.valor)}</div>
                    <div style={{ fontSize: 10, color: p.mundialScore >= 4 ? "#4ade80" : p.mundialScore >= 3 ? "#facc15" : "#f87171" }}>
                      {"★".repeat(p.mundialScore)}{"☆".repeat(5 - p.mundialScore)}
                    </div>
                  </div>
                </div>
                {expandedPlayer === i && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #ffffff10", fontSize: 12, color: "#ffffff70" }}>
                    Potencial Mundial: {p.mundialScore >= 4 ? "🟢 Alto" : p.mundialScore >= 3 ? "🟡 Medio" : "🔴 Bajo"}
                    {SELLS.find(s => s.name === p.name) && (
                      <div style={{ marginTop: 6, color: "#f87171", fontStyle: "italic" }}>
                        ⚠️ Recomendado vender: {SELLS.find(s => s.name === p.name).reason}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── ANÁLISIS ── */}
        {tab === "analisis" && (
          <div style={{ padding: "16px 14px" }}>

            {/* Simulación saldo */}
            <div style={{
              background: "linear-gradient(135deg, #0f3d2a, #0a2a1e)",
              border: "1px solid #4ade8040",
              borderRadius: 16,
              padding: "16px 16px",
              marginBottom: 18,
            }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: "#4ade8080", marginBottom: 12, textTransform: "uppercase" }}>
                Simulación de operaciones
              </div>
              {[
                { label: "Saldo actual",                    val: me?.presupuesto || 21_130_000, sign: 1 },
                { label: `Ventas (${SELLS.length} jugadores)`, val: sellTotal,                 sign: 1 },
                { label: "Fichar Maignan",                  val: -5_570_000,                   sign: -1 },
                { label: "Fichar Hakimi",                   val: -7_730_000,                   sign: -1 },
                { label: "Entrenador Deschamps",            val: -5_380_000,                   sign: -1 },
              ].map(({ label, val, sign }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: "#ffffff80" }}>{label}</span>
                  <span style={{ color: sign > 0 ? "#4ade80" : "#f87171", fontWeight: "bold" }}>
                    {sign > 0 ? "+" : ""}{fmt(val)}
                  </span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid #4ade8030", paddingTop: 10, marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#4ade80", fontWeight: "bold" }}>Saldo resultante</span>
                <span style={{ color: saldoTras >= 0 ? "#4ade80" : "#f87171", fontSize: 16, fontWeight: "bold" }}>
                  {fmt(saldoTras)}
                </span>
              </div>
            </div>

            {/* VENDER */}
            <div style={{ fontSize: 10, letterSpacing: 3, color: "#f8717170", marginBottom: 10, textTransform: "uppercase" }}>
              🔴 Vender
            </div>
            {SELLS.map((s, i) => (
              <div key={i} style={{
                background: "#f8717108",
                border: "1px solid #f8717125",
                borderRadius: 12,
                padding: "11px 13px",
                marginBottom: 7,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: "bold" }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: "#ffffff50", marginTop: 2 }}>{s.reason}</div>
                </div>
                <div style={{ color: "#4ade80", fontWeight: "bold", fontSize: 13, marginLeft: 8, flexShrink: 0 }}>
                  +{fmt(s.valor)}
                </div>
              </div>
            ))}

            {/* FICHAR */}
            <div style={{ fontSize: 10, letterSpacing: 3, color: "#4ade8070", marginBottom: 10, marginTop: 18, textTransform: "uppercase" }}>
              ✅ Fichar jugadores
            </div>
            {BUYS.map((b, i) => (
              <div key={i} style={{
                background: b.priority === 1 ? "#4ade8008" : "#ffffff04",
                border: `1px solid ${b.priority === 1 ? "#4ade8030" : "#ffffff10"}`,
                borderRadius: 12,
                padding: "12px 13px",
                marginBottom: 8,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <div style={{
                        fontSize: 9, padding: "2px 7px", borderRadius: 20,
                        background: b.priority === 1 ? "#d4af37" : b.priority === 2 ? "#6366f1" : "#ffffff20",
                        color: b.priority <= 2 ? "#000" : "#fff",
                        fontWeight: "bold", letterSpacing: 1,
                      }}>P{b.priority}</div>
                      <span style={{ fontSize: 15, fontWeight: "bold" }}>{b.flag} {b.name}</span>
                      <span style={{
                        fontSize: 9, padding: "2px 7px", borderRadius: 4,
                        background: POS_COLOR[b.pos] + "33",
                        color: POS_COLOR[b.pos],
                        border: `1px solid ${POS_COLOR[b.pos]}60`,
                      }}>{b.pos}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#ffffff55", marginBottom: 4 }}>{b.sel}</div>
                    <div style={{ fontSize: 11, color: "#ffffff80" }}>{b.reason}</div>
                  </div>
                  <div style={{ textAlign: "right", marginLeft: 10, flexShrink: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: "bold", color: "#d4af37" }}>{fmt(b.valor)}</div>
                    <div style={{ fontSize: 11, color: b.trend > 0 ? "#4ade80" : "#f87171" }}>
                      {b.trend > 0 ? "▲" : "▼"} {fmt(Math.abs(b.trend))}
                    </div>
                    <div style={{ fontSize: 10, color: b.mundialScore >= 4 ? "#4ade80" : b.mundialScore >= 3 ? "#facc15" : "#f87171" }}>
                      {"★".repeat(b.mundialScore)}{"☆".repeat(5 - b.mundialScore)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* ENTRENADORES */}
            <div style={{ fontSize: 10, letterSpacing: 3, color: "#6366f170", marginBottom: 10, marginTop: 18, textTransform: "uppercase" }}>
              👔 Entrenadores
            </div>
            {COACHES.map((c, i) => (
              <div key={i} style={{
                background: c.rec ? "#6366f110" : "#ffffff04",
                border: `1px solid ${c.rec ? "#6366f140" : "#ffffff10"}`,
                borderRadius: 12,
                padding: "12px 13px",
                marginBottom: 8,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    {c.rec && <div style={{ fontSize: 9, padding: "2px 7px", borderRadius: 20, background: "#d4af37", color: "#000", fontWeight: "bold" }}>REC</div>}
                    <span style={{ fontSize: 15, fontWeight: "bold" }}>{c.flag} {c.name}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#ffffff55", marginBottom: 3 }}>{c.sel}</div>
                  <div style={{ fontSize: 11, color: "#ffffff80" }}>{c.reason}</div>
                </div>
                <div style={{ textAlign: "right", marginLeft: 10, flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: "bold", color: "#d4af37" }}>{fmt(c.valor)}</div>
                  <div style={{ fontSize: 11, color: c.trend > 0 ? "#4ade80" : c.trend < 0 ? "#f87171" : "#ffffff40" }}>
                    {c.trend > 0 ? "▲" : c.trend < 0 ? "▼" : "—"} {c.trend !== 0 ? fmt(Math.abs(c.trend)) : "estable"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── SCOUT IA ── */}
        {tab === "scout" && (
          <div style={{ padding: "16px 14px" }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "#d4af3770", marginBottom: 14, textTransform: "uppercase" }}>
              Scout de mercado con IA
            </div>

            {/* Mode selector */}
            <div style={{ display: "flex", background: "#ffffff08", borderRadius: 12, padding: 4, marginBottom: 16, gap: 4 }}>
              {[["imagen", "📸 Imagen"], ["texto", "📋 Texto"]].map(([mode, label]) => (
                <button key={mode} onClick={() => { setScoutMode(mode); setScoutResult(null); setScoutImgs([]); setScoutText(""); }} style={{
                  flex: 1, padding: "10px", border: "none", borderRadius: 9,
                  background: scoutMode === mode ? "#d4af37" : "none",
                  color: scoutMode === mode ? "#000" : "#ffffff60",
                  fontFamily: "Georgia, serif", fontSize: 13, fontWeight: scoutMode === mode ? "bold" : "normal",
                  cursor: "pointer", transition: "all 0.2s",
                }}>{label}</button>
              ))}
            </div>

            {/* IMAGE MODE */}
            {scoutMode === "imagen" && (
              <>
                <div onClick={() => fileRef.current?.click()} style={{
                  border: "2px dashed #d4af3740", borderRadius: 18, padding: "28px 20px",
                  textAlign: "center", cursor: "pointer", background: "#d4af3706", marginBottom: 14,
                }}>
                  {scoutImgs.length > 0 ? (
                    <div>
                      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 10 }}>
                        {scoutImgs.map((img, i) => (
                          <img key={i} src={img.preview} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10 }} />
                        ))}
                      </div>
                      <div style={{ color: "#d4af37", fontSize: 13 }}>{scoutImgs.length} imagen{scoutImgs.length > 1 ? "es" : ""} lista{scoutImgs.length > 1 ? "s" : ""}</div>
                      <div style={{ color: "#ffffff40", fontSize: 11, marginTop: 3 }}>Toca para añadir más</div>
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: 44, marginBottom: 8 }}>📸</div>
                      <div style={{ color: "#d4af37", fontSize: 15, marginBottom: 4 }}>Subir capturas del mercado</div>
                      <div style={{ color: "#ffffff40", fontSize: 12 }}>Puedes subir varias a la vez</div>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }}
                  onChange={e => handleScoutFiles(Array.from(e.target.files || []))} />
              </>
            )}

            {/* TEXT MODE */}
            {scoutMode === "texto" && (
              <>
                <div style={{ fontSize: 11, color: "#ffffff50", marginBottom: 8 }}>
                  Pega los movimientos en el formato:<br/>
                  <span style={{ color: "#d4af3790", fontStyle: "italic" }}>Jugador: Cambia por X € a Equipo</span>
                </div>
                <textarea
                  value={scoutText}
                  onChange={e => setScoutText(e.target.value)}
                  placeholder={"Hakimi: Cambia por 7.888.888 € a Sabio de hortaleza\nMaignan: Cambia por 5.777.777 € a Sabio de hortaleza\nLopetegui: Cambia por 230.000 € a Sr. Lobo"}
                  style={{
                    width: "100%", minHeight: 160, background: "#ffffff08",
                    border: "1px solid #d4af3740", borderRadius: 14,
                    color: "#f0ede8", fontSize: 13, fontFamily: "Georgia, serif",
                    padding: "14px", boxSizing: "border-box", resize: "vertical",
                    outline: "none", lineHeight: 1.6,
                  }}
                />
              </>
            )}

            {(scoutImgs.length > 0 || scoutText.trim()) && !scoutLoading && (
              <button onClick={runScout} style={{
                width: "100%", padding: "14px", marginBottom: 14, marginTop: 12,
                background: "linear-gradient(135deg, #d4af37, #b8860b)",
                border: "none", borderRadius: 14,
                color: "#000", fontSize: 15, fontWeight: "bold",
                fontFamily: "Georgia, serif", cursor: "pointer",
              }}>
                🤖 Analizar con IA
              </button>
            )}

            {scoutLoading && (
              <div style={{ textAlign: "center", padding: "30px 0", color: "#d4af37" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🤖</div>
                <div style={{ fontSize: 14 }}>Analizando jugadores y cruzando datos del Mundial...</div>
                <div style={{ fontSize: 12, color: "#ffffff40", marginTop: 6 }}>Puede tardar unos segundos</div>
              </div>
            )}

            {scoutResult && (
              <div>
                {scoutResult.resumen && (
                  <div style={{
                    background: "#d4af3710",
                    border: "1px solid #d4af3730",
                    borderRadius: 14,
                    padding: "14px 14px",
                    marginBottom: 14,
                    fontSize: 13,
                    color: "#d4af37",
                    lineHeight: 1.5,
                  }}>
                    📋 {scoutResult.resumen}
                  </div>
                )}

                {["FICHAR", "VIGILAR", "PASAR"].map(rec => {
                  const group = scoutResult.jugadores?.filter(j => j.recomendacion === rec);
                  if (!group?.length) return null;
                  const colors = { FICHAR: "#4ade80", VIGILAR: "#facc15", PASAR: "#f87171" };
                  const icons  = { FICHAR: "✅", VIGILAR: "👁", PASAR: "❌" };
                  return (
                    <div key={rec} style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 10, letterSpacing: 2, color: colors[rec] + "90", marginBottom: 8, textTransform: "uppercase" }}>
                        {icons[rec]} {rec} ({group.length})
                      </div>
                      {group.sort((a, b) => a.prioridad - b.prioridad).map((j, i) => (
                        <div key={i} style={{
                          background: colors[rec] + "08",
                          border: `1px solid ${colors[rec]}25`,
                          borderRadius: 12,
                          padding: "11px 13px",
                          marginBottom: 7,
                          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                              <span style={{ fontSize: 14, fontWeight: "bold" }}>{j.nombre}</span>
                              <span style={{
                                fontSize: 9, padding: "2px 6px", borderRadius: 4,
                                background: (POS_COLOR[j.pos] || "#ffffff20") + "33",
                                color: POS_COLOR[j.pos] || "#ffffff",
                                border: `1px solid ${POS_COLOR[j.pos] || "#ffffff"}40`,
                              }}>{j.pos}</span>
                            </div>
                            <div style={{ fontSize: 11, color: "#ffffff50", marginBottom: 2 }}>{j.seleccion}</div>
                            {j.equipo_destino && (
                              <div style={{ fontSize: 11, color: "#60a5fa", marginBottom: 4 }}>
                                → {j.equipo_destino}
                              </div>
                            )}
                            <div style={{ fontSize: 11, color: "#ffffff75" }}>{j.razon}</div>
                            <div style={{ fontSize: 10, color: j.mundialScore >= 4 ? "#4ade80" : j.mundialScore >= 3 ? "#facc15" : "#f87171", marginTop: 4 }}>
                              Mundial: {"★".repeat(j.mundialScore)}{"☆".repeat(5 - j.mundialScore)}
                            </div>
                          </div>
                          <div style={{ textAlign: "right", marginLeft: 10, flexShrink: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: "bold", color: "#d4af37" }}>{fmt(j.valor)}</div>
                            {j.tendencia !== 0 && (
                              <div style={{ fontSize: 11, color: j.tendencia > 0 ? "#4ade80" : "#f87171" }}>
                                {j.tendencia > 0 ? "▲" : "▼"} {fmt(Math.abs(j.tendencia))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}

                <button onClick={() => { setScoutImgs([]); setScoutText(""); setScoutResult(null); }} style={{
                  width: "100%", padding: "11px", marginTop: 4,
                  background: "none", border: "1px solid #ffffff20",
                  borderRadius: 12, color: "#ffffff50", fontSize: 13,
                  fontFamily: "Georgia, serif", cursor: "pointer",
                }}>
                  Nueva búsqueda
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: "#0d0d1f",
        borderTop: "1px solid #d4af3720",
        display: "flex",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, border: "none",
            background: tab === t.id ? "#d4af3710" : "none",
            color: tab === t.id ? "#d4af37" : "#ffffff35",
            fontSize: 10, cursor: "pointer",
            fontFamily: "Georgia, serif",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 3, padding: "10px 4px",
            borderTop: tab === t.id ? "2px solid #d4af37" : "2px solid transparent",
            transition: "all 0.15s",
          }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)",
          background: toast.type === "ok" ? "#4ade80" : "#f87171",
          color: "#000", padding: "10px 22px", borderRadius: 24,
          fontSize: 13, fontWeight: "bold", zIndex: 999, whiteSpace: "nowrap",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}>{toast.msg}</div>
      )}
    </div>
  );
}
