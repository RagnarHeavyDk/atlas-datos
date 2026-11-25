/* ATLAS · franja «Parte de hoy» para la portada (debajo de la red neuronal).
   Uso: <div id="parte-hoy"></div><script src="parte/parte-strip.js" data-base="parte/"></script>
   Lee parte.json y datos.json del parte; muestra titular, las tres señales del día y un botón al parte completo. ES/EN según la web. */
(function () {
  const me = document.currentScript, base = (me && me.dataset.base) || "parte/";
  const css = `.ph{border:1px solid #23252c;background:linear-gradient(120deg,#130c10,#0f1014 60%);padding:20px 22px;display:grid;gap:14px;font-family:Inter,"Helvetica Neue",Arial,sans-serif;color:#f2efe9}
  .ph-top{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:baseline;justify-content:space-between}
  .ph-ey{font:600 11px/1 "JetBrains Mono",Consolas,monospace;letter-spacing:.14em;color:#ff4757;text-transform:uppercase}
  .ph h2{margin:0;font:700 clamp(22px,3.2vw,34px)/1.05 "Space Grotesk","Helvetica Neue",Arial,sans-serif;text-wrap:balance}
  .ph h2 em{font-style:normal;color:#ff4757}
  .ph-k{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:#23252c;border:1px solid #23252c}
  .ph-k div{background:#0f1014;padding:12px 14px;min-width:0}
  .ph-k b{display:block;font:700 22px/1.1 "Space Grotesk",Arial,sans-serif}
  .ph-k span{font-size:13px;color:#9095a0}
  .ph a.ph-go{justify-self:start;font:600 11px/1 "JetBrains Mono",Consolas,monospace;letter-spacing:.08em;text-transform:uppercase;padding:10px 14px;background:#ff4757;color:#0b0b0b;text-decoration:none}
  @media (max-width:700px){.ph-k{grid-template-columns:minmax(0,1fr)}}`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const md = s => esc(s).replace(/\*(.+?)\*/g, "<em>$1</em>");
  async function go() {
    const el = document.getElementById("parte-hoy"); if (!el) return;
    if (!document.getElementById("ph-css")) { const s = document.createElement("style"); s.id = "ph-css"; s.textContent = css; document.head.appendChild(s); }
    let P; try { const r = await fetch(base + "parte.json", {cache:"no-store"}); if (!r.ok) throw 0; P = await r.json(); } catch (e) { el.hidden = true; return; }
    const lang = (document.documentElement.lang || "es").startsWith("en") ? "en" : "es", L = P[lang];
    const date = new Date(P.date + "T12:00:00Z").toLocaleDateString(lang === "es" ? "es-ES" : "en-GB", {weekday:"long", day:"numeric", month:"long"});
    el.innerHTML = `<div class="ph"><div class="ph-top"><span class="ph-ey">${lang === "es" ? "Parte de hoy" : "Today's brief"} · ${esc(date)}</span></div>
      <h2>${md(L.headline)}</h2><div class="ph-k">${L.keys.map(k => `<div><b>${esc(k.title)}</b><span>${esc(k.text.split(". ")[0])}.</span></div>`).join("")}</div>
      <a class="ph-go" href="${base}${lang === "en" ? "#en" : "#es"}">${lang === "es" ? "Leer el parte · 3 min" : "Read the brief · 3 min"}</a></div>`;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
})();
