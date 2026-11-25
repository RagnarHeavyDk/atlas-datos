/* ATLAS · Evidencia: constelación de mercados + verificador de huellas en vivo.
   Uso:  <div id="atlas-evidence"></div>
         <script src="evidence-viz.js"></script>
         <script>ATLASEvidence.mount(document.getElementById("atlas-evidence"), { live: "atlas-live.json", evidence: "evidencia/" })</script>
   - live: ruta a atlas-live.json (make_atlas_live.py) o el objeto ya cargado.
   - evidence: carpeta pública con los archivos y HUELLAS*.txt. El navegador descarga cada archivo,
     calcula su SHA-256 y lo compara con la huella registrada. Nada se da por bueno sin recalcularlo. */
(function () {
  const C = { v1: "#ff4757", v2: "#4fd8e8", v3: "#f2b441" };
  const NAMES = { v1: "Prueba 1", v2: "Prueba 2", v3: "Prueba 3" };
  const NS = "http://www.w3.org/2000/svg";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fmt = (n, d = 1) => n == null ? "—" : Number(n).toLocaleString("es-ES", { minimumFractionDigits: d, maximumFractionDigits: d });
  const fp = p => p == null ? "—" : p < 0.001 ? "< 0,001" : fmt(p, 3);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const CSS = `
  .aev{--aev-bg:#07080a;--aev-panel:#0e1013;--aev-line:#262a30;--aev-fg:#eceae6;--aev-mute:#8a8f96;--aev-red:#ff4757;--aev-ok:#5be38c;
    color:var(--aev-fg);font-family:Inter,"Helvetica Neue",Arial,sans-serif;display:grid;gap:28px}
  .aev *{box-sizing:border-box}
  .aev-mono{font-family:"JetBrains Mono",ui-monospace,Consolas,monospace;letter-spacing:.06em}
  .aev-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:var(--aev-line);border:1px solid var(--aev-line)}
  .aev-stat{background:var(--aev-bg);padding:16px 18px;display:grid;gap:4px;min-width:0}
  .aev-stat b{font-size:clamp(28px,4vw,44px);line-height:1;font-weight:800;font-variant-numeric:tabular-nums}
  .aev-stat span{font-size:11px;color:var(--aev-mute);text-transform:uppercase}
  .aev-stage{position:relative;border:1px solid var(--aev-line);background:radial-gradient(ellipse 80% 70% at 20% 30%,#1a0d10 0%,var(--aev-bg) 60%)}
  .aev-stage svg{display:block;width:100%;height:auto}
  .aev-filters{display:flex;flex-wrap:wrap;gap:8px}
  .aev-filters button{font:600 11px/1 "JetBrains Mono",Consolas,monospace;letter-spacing:.06em;padding:9px 12px;background:var(--aev-panel);color:var(--aev-fg);border:1px solid var(--aev-line);cursor:pointer;display:inline-flex;gap:8px;align-items:center}
  .aev-filters button i{width:9px;height:9px;display:inline-block}
  .aev-filters button[aria-pressed="false"]{opacity:.4}
  .aev-filters button:focus-visible,.aev-pt:focus-visible{outline:2px solid #fff;outline-offset:2px}
  .aev-tip{position:absolute;pointer-events:none;min-width:220px;max-width:280px;background:rgba(7,8,10,.95);border:1px solid var(--aev-line);padding:12px 14px;font-size:12.5px;line-height:1.5;transform:translate(-50%,calc(-100% - 14px));opacity:0;transition:opacity .15s}
  .aev-tip.on{opacity:1}
  .aev-tip h4{margin:0 0 6px;font-size:14px}
  .aev-tip dl{display:grid;grid-template-columns:1fr auto;gap:2px 12px;margin:0}
  .aev-tip dt{color:var(--aev-mute)}.aev-tip dd{margin:0;text-align:right;font-variant-numeric:tabular-nums}
  .aev-tests{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
  .aev-test{border:1px solid var(--aev-line);background:var(--aev-panel);padding:16px;display:grid;gap:8px;min-width:0}
  .aev-test .v{font-size:11px;text-transform:uppercase}
  .aev-test b{font-size:36px;line-height:1;font-weight:800}
  .aev-test b small{font-size:16px;color:var(--aev-mute);font-weight:500}
  .aev-test p{margin:0;color:var(--aev-mute);font-size:13px}
  .aev-ver{border:1px solid var(--aev-line);background:var(--aev-panel)}
  .aev-ver header{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;align-items:center;padding:14px 16px;border-bottom:1px solid var(--aev-line)}
  .aev-ver header h3{margin:0;font-size:15px;letter-spacing:.04em;text-transform:uppercase}
  .aev-ver header button{font:600 11px/1 "JetBrains Mono",Consolas,monospace;padding:9px 12px;background:var(--aev-red);color:#0b0b0b;border:0;cursor:pointer;letter-spacing:.06em}
  .aev-rows{display:grid}
  .aev-row{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,2fr) auto;gap:12px;padding:10px 16px;border-bottom:1px solid #16191d;font-size:12px;align-items:center}
  .aev-row:last-child{border-bottom:0}
  .aev-row .h{color:var(--aev-mute);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .aev-row .s{font-weight:600;white-space:nowrap}
  .aev-row .s.ok{color:var(--aev-ok)}.aev-row .s.bad{color:var(--aev-red)}.aev-row .s.na{color:var(--aev-mute)}
  .aev-drop{padding:14px 16px;border-top:1px dashed var(--aev-line);font-size:12.5px;color:var(--aev-mute)}
  .aev-drop.hot{background:#13161a;color:var(--aev-fg)}
  @media (max-width:760px){.aev-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.aev-tests{grid-template-columns:minmax(0,1fr)}.aev-row{grid-template-columns:minmax(0,1fr) auto}.aev-row .h{display:none}}
  @keyframes aev-pulse{0%{r:7;opacity:.9}100%{r:22;opacity:0}}
  .aev-ring{animation:aev-pulse 2.4s ease-out infinite}
  @media (prefers-reduced-motion:reduce){.aev-ring{animation:none;opacity:.4}}`;

  function el(tag, attrs, parent) { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); if (parent) parent.appendChild(n); return n; }

  function constellation(root, tests, tip) {
    const W = 960, H = 500, L = 64, R = 24, T = 30, B = 56;
    const x = p => { const v = Math.log10(Math.max(p, 0.0005)); return L + (v + 3.3) / 3.3 * (W - L - R); };
    const y = r => T + (Math.min(Math.max(r, 0.3), 2.7) - 0.3) / 2.4 * (H - T - B);
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Constelación: cada punto es un mercado probado, situado según su p frente al azar y su caída frente a mantener" }, root);
    const defs = el("defs", {}, svg);
    const g = el("filter", { id: "aev-glow", x: "-100%", y: "-100%", width: "300%", height: "300%" }, defs);
    el("feGaussianBlur", { stdDeviation: 4, result: "b" }, g); const m = el("feMerge", {}, g); el("feMergeNode", { in: "b" }, m); el("feMergeNode", { in: "SourceGraphic" }, m);
    // zona de ventaja
    el("rect", { x: L, y: T, width: x(0.05) - L, height: H - T - B, fill: "rgba(91,227,140,.05)" }, svg);
    // rejilla
    [0.001, 0.01, 0.05, 0.1, 0.5, 1].forEach(p => {
      el("line", { x1: x(p), x2: x(p), y1: T, y2: H - B, stroke: p === 0.05 ? "#5be38c" : "#1d2126", "stroke-width": p === 0.05 ? 1.5 : 1, "stroke-dasharray": p === 0.05 ? "6 5" : "none" }, svg);
      const t = el("text", { x: x(p), y: H - B + 20, fill: p === 0.05 ? "#5be38c" : "#8a8f96", "font-size": 12, "text-anchor": "middle", "font-family": "JetBrains Mono, Consolas, monospace" }, svg);
      t.textContent = p < 0.01 ? "0,001" : String(p).replace(".", ",");
    });
    [0.5, 1, 1.5, 2, 2.5].forEach(r => {
      el("line", { x1: L, x2: W - R, y1: y(r), y2: y(r), stroke: r === 1 ? "#3a3f46" : "#15181c", "stroke-width": 1, "stroke-dasharray": r === 1 ? "4 4" : "none" }, svg);
      const t = el("text", { x: L - 10, y: y(r) + 4, fill: "#8a8f96", "font-size": 12, "text-anchor": "end", "font-family": "JetBrains Mono, Consolas, monospace" }, svg);
      t.textContent = "×" + String(r).replace(".", ",");
    });
    const lab = (txt, X, Y, anchor, col, size = 12) => { const t = el("text", { x: X, y: Y, fill: col, "font-size": size, "text-anchor": anchor, "font-family": "JetBrains Mono, Consolas, monospace", "letter-spacing": 1 }, svg); t.textContent = txt; return t; };
    lab("p FRENTE AL AZAR (escala log) →  más a la izquierda = menos probable que sea suerte", (L + W - R) / 2, H - 8, "middle", "#8a8f96", 11);
    lab("ZONA DE VENTAJA · p < 0,05", L + 8, T + 16, "start", "#5be38c", 11);
    lab("CAÍDA REGLA ÷ CAÍDA MANTENER", L + 8, H - B - 10, "start", "#8a8f96", 11);
    lab("cae igual que mantener", W - R - 6, y(1) - 6, "end", "#5d636a", 11);
    // puntos
    const all = []; tests.forEach(t => t.markets.forEach(mk => all.push({ t, mk })));
    const layer = el("g", {}, svg);
    all.forEach(({ t, mk }, i) => {
      if (mk.p_random_dd == null || mk.rule_maxdd_pct == null || !mk.hold_maxdd_pct) return;
      const ratio = mk.rule_maxdd_pct / mk.hold_maxdd_pct, X = x(mk.p_random_dd), Y = y(ratio), col = C[t.id] || "#fff";
      const grp = el("g", { class: "aev-pt", tabindex: 0, "data-test": t.id, role: "button", "aria-label": `${mk.market}, ${NAMES[t.id]}, p ${fp(mk.p_random_dd)}, caída ${fmt(ratio, 2)} veces la de mantener` }, layer);
      grp.style.cursor = "pointer";
      if (mk.passes_random) { const ring = el("circle", { cx: X, cy: Y, r: 7, fill: "none", stroke: col, "stroke-width": 1.5, class: "aev-ring" }, grp); ring.style.animationDelay = (i * 0.13 % 2.4) + "s"; }
      const dot = el("circle", { cx: X, cy: Y, r: mk.passes_random ? 6.5 : 5, fill: mk.passes_random ? col : "#07080a", stroke: col, "stroke-width": 2, filter: mk.passes_random ? "url(#aev-glow)" : "" }, grp);
      if (!reduce) { dot.style.transformOrigin = `${X}px ${Y}px`; dot.animate([{ transform: "scale(0)", opacity: 0 }, { transform: "scale(1.6)", opacity: 1, offset: .7 }, { transform: "scale(1)", opacity: 1 }], { duration: 700, delay: 200 + i * 45, fill: "backwards", easing: "cubic-bezier(.2,.8,.2,1)" }); }
      if (mk.passes_random) { const n = el("text", { x: X + 11, y: Y - 9, fill: col, "font-size": 11, "font-family": "JetBrains Mono, Consolas, monospace" }, grp); n.textContent = mk.market.replace(/\s*\(.*\)/, "").replace("^", ""); }
      const show = () => {
        tip.innerHTML = `<h4 style="color:${col}">${esc(mk.market)}</h4><div class="aev-mono" style="font-size:10.5px;color:#8a8f96;margin-bottom:8px">${NAMES[t.id]} · ${mk.passes_random ? "SUPERA AL AZAR" : "NO SUPERA AL AZAR"}</div>
          <dl><dt>p frente al azar</dt><dd>${fp(mk.p_random_dd)}</dd><dt>Caída regla</dt><dd>${fmt(mk.rule_maxdd_pct)} %</dd><dt>Caída mantener</dt><dd>${fmt(mk.hold_maxdd_pct)} %</dd>
          <dt>Rent. anual regla</dt><dd>${fmt(mk.rule_cagr_pct)} %</dd><dt>Rent. anual mantener</dt><dd>${fmt(mk.hold_cagr_pct)} %</dd></dl>`;
        const r = svg.getBoundingClientRect(), k = r.width / W;
        tip.style.left = Math.min(Math.max(X * k, 140), r.width - 140) + "px"; tip.style.top = Y * k + "px"; tip.classList.add("on");
      };
      grp.addEventListener("mouseenter", show); grp.addEventListener("focus", show);
      grp.addEventListener("mouseleave", () => tip.classList.remove("on")); grp.addEventListener("blur", () => tip.classList.remove("on"));
    });
    return svg;
  }

  async function sha256(buf) { const h = await crypto.subtle.digest("SHA-256", buf); return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, "0")).join(""); }

  async function registry(base, tests) {
    // huellas registradas: HUELLAS*.txt (protocolos, motor y regla, registrados ANTES de ejecutar) + resultados (atlas-live.json)
    const reg = new Map();
    for (const f of ["HUELLAS.txt", "HUELLAS_V2.txt", "HUELLAS_V3.txt"]) {
      try { const r = await fetch(base + f, { cache: "no-store" }); if (!r.ok) continue;
        (await r.text()).split(/\r?\n/).forEach(l => { const m = l.trim().match(/^([0-9a-f]{64})\s+(.+)$/); if (m) { const name = m[2].split("/").pop(); if (!reg.has(name)) reg.set(name, { hash: m[1], from: f }); } });
      } catch (e) { /* sin acceso a la carpeta: se usa solo lo que haya */ }
    }
    tests.forEach(t => { if (t.result_file && t.result_sha256) reg.set(t.result_file, { hash: t.result_sha256, from: "atlas-live.json" }); });
    return reg;
  }

  function verifier(root, base, tests) {
    const box = document.createElement("section"); box.className = "aev-ver";
    box.innerHTML = `<header><div><h3>Verificador de huellas</h3><div class="aev-mono" style="font-size:11px;color:#8a8f96;margin-top:4px">Tu navegador descarga cada archivo y recalcula su SHA-256. Si alguien cambiara una coma, no coincidiría.</div></div><button type="button">VERIFICAR AHORA</button></header><div class="aev-rows"></div>
      <div class="aev-drop" tabindex="0">¿Te has descargado un archivo de la evidencia? Arrástralo aquí y comprobamos su huella sin subirlo a ningún sitio.</div>`;
    root.appendChild(box);
    const rows = box.querySelector(".aev-rows"), btn = box.querySelector("button"), drop = box.querySelector(".aev-drop");
    let reg = null;
    const render = async () => {
      btn.disabled = true; btn.textContent = "VERIFICANDO…";
      reg = await registry(base, tests); rows.innerHTML = "";
      if (!reg.size) { rows.innerHTML = `<div class="aev-row"><span>Sin acceso a la carpeta de evidencia desde esta vista.</span><span class="h"></span><span class="s na">—</span></div>`; }
      let ok = 0, n = 0;
      for (const [name, { hash, from }] of reg) {
        const row = document.createElement("div"); row.className = "aev-row";
        row.innerHTML = `<span class="aev-mono">${esc(name)}</span><span class="h aev-mono" title="${hash}">${hash.slice(0, 16)}… · ${esc(from)}</span><span class="s na aev-mono">…</span>`;
        rows.appendChild(row); const s = row.querySelector(".s"); n++;
        try { const r = await fetch(base + name, { cache: "no-store" }); if (!r.ok) throw 0;
          const h = await sha256(await r.arrayBuffer()); if (h === hash) { ok++; s.className = "s ok aev-mono"; s.textContent = "✓ COINCIDE"; } else { s.className = "s bad aev-mono"; s.textContent = "✕ NO COINCIDE"; }
        } catch (e) { s.textContent = "SIN ACCESO"; }
      }
      btn.disabled = false; btn.textContent = n ? `${ok}/${n} COINCIDEN · REPETIR` : "REPETIR";
    };
    btn.addEventListener("click", render);
    const check = async file => {
      if (!reg) reg = await registry(base, tests);
      const h = await sha256(await file.arrayBuffer()), hit = [...reg].find(([, v]) => v.hash === h);
      drop.innerHTML = hit ? `<b style="color:#5be38c">✓ ${esc(file.name)} coincide con la huella registrada de ${esc(hit[0])}</b> (${h.slice(0, 16)}…)` : `<b style="color:#ff4757">✕ ${esc(file.name)} no coincide con ninguna huella registrada</b> (${h.slice(0, 16)}…)`;
    };
    drop.addEventListener("dragover", e => { e.preventDefault(); drop.classList.add("hot"); });
    drop.addEventListener("dragleave", () => drop.classList.remove("hot"));
    drop.addEventListener("drop", e => { e.preventDefault(); drop.classList.remove("hot"); const f = e.dataTransfer.files[0]; if (f) check(f); });
    return render;
  }

  async function mount(root, opts = {}) {
    if (!document.getElementById("aev-css")) { const s = document.createElement("style"); s.id = "aev-css"; s.textContent = CSS; document.head.appendChild(s); }
    let live = opts.live || "atlas-live.json";
    if (typeof live === "string") { const r = await fetch(live, { cache: "no-store" }); live = await r.json(); }
    const tests = live.tests || [], base = opts.evidence || "evidencia/";
    const total = tests.reduce((a, t) => a + t.total, 0), passed = tests.reduce((a, t) => a + t.passed, 0);
    const lessDD = tests.reduce((a, t) => a + t.markets.filter(m => m.rule_maxdd_pct > m.hold_maxdd_pct).length, 0);
    root.classList.add("aev"); root.innerHTML = "";
    const stats = document.createElement("div"); stats.className = "aev-stats";
    stats.innerHTML = [[tests.length, "pruebas prerregistradas"], [total, "mercados probados"], [passed, "superan al azar"], [lessDD, "caen menos que mantener"]]
      .map(([v, l]) => `<div class="aev-stat"><b>${v}</b><span class="aev-mono">${l}</span></div>`).join("");
    root.appendChild(stats);
    const filters = document.createElement("div"); filters.className = "aev-filters";
    filters.innerHTML = tests.map(t => `<button type="button" aria-pressed="true" data-t="${t.id}"><i style="background:${C[t.id]}"></i>${NAMES[t.id]} · ${t.passed}/${t.total}</button>`).join("");
    root.appendChild(filters);
    const stage = document.createElement("div"); stage.className = "aev-stage"; root.appendChild(stage);
    const tip = document.createElement("div"); tip.className = "aev-tip";
    const svg = constellation(stage, tests, tip); stage.appendChild(tip);
    filters.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
      const on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", on);
      svg.querySelectorAll(`[data-test="${b.dataset.t}"]`).forEach(n => n.style.display = on ? "" : "none");
    }));
    const cards = document.createElement("div"); cards.className = "aev-tests";
    cards.innerHTML = tests.map(t => { const good = /CONFIRMAD/.test(t.verdict_line || "") && !/NO CONFIRMAD/.test(t.verdict_line || "");
      return `<article class="aev-test" style="border-top:2px solid ${C[t.id]}"><div class="v aev-mono" style="color:${good ? "#5be38c" : "#ff4757"}">${NAMES[t.id]} · ${esc((t.verdict_line || "").split("(")[0].trim())}</div>
      <b>${t.passed}<small> / ${t.total} superan al azar</small></b><p>${esc(t.description)}</p>
      <p class="aev-mono" style="font-size:10.5px" title="${t.result_sha256 || ""}">resultado · sha256 ${t.result_sha256 ? t.result_sha256.slice(0, 12) + "…" : "—"}</p></article>`; }).join("");
    root.appendChild(cards);
    const run = verifier(root, base, tests);
    if (opts.autoVerify !== false) run();
  }

  window.ATLASEvidence = { mount };
})();
