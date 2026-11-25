/* ATLAS · capa de datos en vivo sobre la oficina isométrica (no cambia la oficina; se dibuja encima).
   Uso en la web: <script src="atlas-live-layer.js" defer></script> después de los scripts de la oficina.
   Lee atlas-live.json (generado a diario a partir de status.json del bot y mia_veredicto.json).
   Si el archivo no está, usa la instantánea de abajo y lo indica. Solo simulación. */
(function () {
  const ROOMS = {
    execution: { who: "BOT · SIMULACIÓN", color: "#ff464e", lines: d => [`BOT 13-NOV · ${d.bot.votes}/${d.bot.rules} · EXPOSICIÓN ${d.bot.target * 100} %`, `CARTERA AL CIERRE ${fmt(d.bot.equity)} USDT`] },
    audit: { who: "MIA · AUDITORA", color: "#53d6e6", lines: d => [`MIA ${d.mia.verdict} · ${d.mia.checks} · ${d.sources.binance_votes}/${d.bot.rules}`, `DIFERENCIA CIERRES ${fmt(d.mia.close_gap_pct, 3)} %`] },
    risk: { who: "MAIA · RIESGO", color: "#f2b441", lines: d => [`EXPOSICIÓN OBJETIVO ${d.bot.target * 100} %`, "SIN INFORME DE MAIA EN ESTA COPIA"] },
    technical: { who: "CELIA · ANÁLISIS", color: "#f2b441", lines: d => [`${d.bot.votes}/${d.bot.rules} VOTOS DEL BOT`, "SIN INFORME DE CELIA EN ESTA COPIA"] },
    memory:    { who: "INVESTIGADORA", color: "#848e96", off: true, lines: () => ["EN CONSTRUCCIÓN", "SE ACTIVA CON SU PRIMER", "PROTOCOLO PRERREGISTRADO"] },
    data:      { who: "FUENTES", color: "#53d6e6", lines: d => [`BINANCE · KRAKEN`, `CIERRE ${day(d.sources.day)}`, `${fmt(d.sources.binance_close, 1)} · ${fmt(d.sources.kraken_close, 1)}`] }
  };
  const FLOWS = [["data", "execution", "#53d6e6"], ["data", "audit", "#53d6e6"], ["execution", "audit", "#ff2b3f"], ["execution", "risk", "#ff2b3f"], ["execution", "technical", "#ff2b3f"], ["audit", "risk", "#f2b441"], ["audit", "technical", "#f2b441"]];
  const fmt = (n, d = 2) => Number(n).toLocaleString("es-ES", { minimumFractionDigits: d, maximumFractionDigits: d });
  const day = s => { const [y, m, dd] = String(s).split("-"); return `${dd}-${["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"][+m - 1]}`; };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); if (parent) parent.appendChild(n); return n; };

  let data = null, layer = null, packets = [], centers = {}, on = true;

  async function load() {
    try { const r = await fetch("../atlas-live.json", { cache: "no-store" }); if (r.ok) { const raw = await r.json();
      if (raw.schema !== "atlas-live/1" || !raw.bot || !raw.mia?.sources) return;
      const {bot, mia} = raw;
      data = {
        asof:mia.folder, sources:mia.sources,
        bot:{votes:bot.signal.votes_long, rules:bot.signal.rules, target:bot.signal.target_exposure, equity:bot.portfolio.equity},
        mia:{verdict:mia.code_verdict, checks:mia.checks_passed,
          close_gap_pct:Math.abs(mia.sources.binance_close-mia.sources.kraken_close)/mia.sources.binance_close*100}
      }; } } catch (e) { /* Sin fuente disponible. */ }
  }

  function build(svg) {
    if (layer) layer.remove();
    layer = el("g", { class: "atlas-live-layer", "pointer-events": "none" });
    svg.appendChild(layer);
    const defs = el("defs", {}, layer);
    const f = el("filter", { id: "alv-glow", x: "-50%", y: "-50%", width: "200%", height: "200%" }, defs);
    el("feGaussianBlur", { stdDeviation: "3", result: "b" }, f);
    const m = el("feMerge", {}, f); el("feMergeNode", { in: "b" }, m); el("feMergeNode", { in: "SourceGraphic" }, m);
    const flowG = el("g", {}, layer), roomG = el("g", {}, layer);
    centers = {};
    for (const id in ROOMS) {
      const g = svg.querySelector(`g[data-room="${id}"]`); if (!g) continue;
      const b = g.getBBox(), cfg = ROOMS[id], col = typeof cfg.color === "function" ? cfg.color(data) : cfg.color;
      const cx = b.x + b.width / 2, floorY = b.y + b.height * 0.62;
      centers[id] = [cx, floorY];
      const room = el("g", { class: "alv-room", role: "button", tabindex: "0",
        "aria-label": cfg.who, "aria-haspopup": "dialog" }, roomG);
      el("ellipse", {class:"alv-hit",cx,cy:floorY,rx:52,ry:28,fill:"transparent"},room);
      room.addEventListener("click", event => {
        event.stopPropagation();
        openRoom(svg, cfg);
      });
      room.addEventListener("keydown", event => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        event.stopPropagation();
        openRoom(svg, cfg);
      });
      // anillo en el suelo de la sala
      const ring = el("ellipse", { cx, cy: floorY, rx: 46, ry: 22, fill: "none", stroke: col, "stroke-width": 2, opacity: cfg.off ? .35 : .8, "stroke-dasharray": cfg.off ? "5 5" : "none", filter: cfg.off ? "" : "url(#alv-glow)" }, room);
      ring.dataset.pulse = cfg.off ? "" : "1";

    }
    // flujos de datos entre salas
    FLOWS.forEach(([a, b, c]) => { if (!centers[a] || !centers[b]) return;
      el("line", { x1: centers[a][0], y1: centers[a][1], x2: centers[b][0], y2: centers[b][1], stroke: c, "stroke-width": 1, opacity: .22, "stroke-dasharray": "2 6" }, flowG); });
    packets = [];
    // pie de la capa

    layer.style.display = on ? "" : "none";
  }


  function tick(t) {
    if (layer && on) {
      layer.querySelectorAll('ellipse[data-pulse="1"]').forEach((r, i) => { const s = 1 + .12 * Math.sin(t / 600 + i); r.setAttribute("rx", 46 * s); r.setAttribute("ry", 22 * s); });
      if (packets.length < 14 && Math.random() < .05) {
        const [a, b, c] = FLOWS[Math.floor(Math.random() * FLOWS.length)];
        if (centers[a] && centers[b]) { const n = el("rect", { width: 6, height: 6, fill: c, filter: "url(#alv-glow)" }, layer); packets.push({ n, a: centers[a], b: centers[b], t: 0, sp: .004 + Math.random() * .004 }); }
      }
      for (let i = packets.length - 1; i >= 0; i--) { const p = packets[i]; p.t += p.sp; if (p.t >= 1) { p.n.remove(); packets.splice(i, 1); continue; }
        p.n.setAttribute("x", p.a[0] + (p.b[0] - p.a[0]) * p.t - 3); p.n.setAttribute("y", p.a[1] + (p.b[1] - p.a[1]) * p.t - 3); }
    }
    if (!reduce) requestAnimationFrame(tick);
  }

  function openRoom(svg, config) {
    const scene = svg.closest("#atlas-agent-office");
    let card = scene.querySelector(".signal-room-card");
    if (!card) {
      card = document.createElement("dialog");
      card.className = "signal-room-card";
      card.setAttribute("aria-labelledby", "signal-room-title");
      scene.append(card);
    }
    const title = document.createElement("h2");
    title.id = "signal-room-title";
    title.textContent = config.who;
    const close = document.createElement("button");
    close.type = "button";
    close.textContent = document.documentElement.lang === "es" ? "Cerrar" : "Close";
    close.addEventListener("click", () => card.close());
    const date = document.createElement("small");
    date.textContent = "ATLAS / " + data.asof;
    const rows = config.lines(data).map(value => {
      const row = document.createElement("p");
      row.textContent = value;
      return row;
    });
    card.replaceChildren(date, title, ...rows, close);
    if (!card.open) card.showModal();
  }

  function addToggle(svg) {
    const host = svg.closest("section") || svg.parentNode; if (!host || host.querySelector(".alv-toggle")) return;
    const b = document.createElement("button");
    b.type = "button"; b.className = "alv-toggle";
    b.style.cssText = "font:600 11px/1 JetBrains Mono,Consolas,monospace;letter-spacing:.08em;padding:8px 12px;margin:8px 0;background:#081016;color:#5be38c;border:1px solid #5be38c;cursor:pointer";
    const label = () => b.textContent = on ? "● CAPA DE DATOS: ACTIVADA" : "○ CAPA DE DATOS: DESACTIVADA";
    label(); b.onclick = () => { on = !on; if (layer) layer.style.display = on ? "" : "none"; label(); };
    const details = document.createElement("details");
    details.className = "signal-room-data";
    const summary = document.createElement("summary");
    summary.textContent = "Datos por sala · " + data.asof;
    const list = document.createElement("dl");
    for (const config of Object.values(ROOMS)) {
      const entry = document.createElement("div");
      const name = document.createElement("dt");
      name.textContent = config.who;
      entry.append(name);
      for (const line of config.lines(data)) {
        const row = document.createElement("dd");
        row.textContent = line;
        entry.append(row);
      }
      list.append(entry);
    }
    details.append(summary, list);
    const scene = svg.closest("#atlas-agent-office");
    scene.append(details);
    svg.parentNode.insertBefore(b, svg);
  }

  async function start() {
    await load();
    if (!data) return;
    const tryBuild = () => { const w = document.querySelector("g.ao-world"); if (!w) return false; const svg = w.ownerSVGElement; build(svg); addToggle(svg); return true; };
    if (!tryBuild()) { const mo = new MutationObserver(() => { if (tryBuild()) mo.disconnect(); }); mo.observe(document.body, { childList: true, subtree: true }); }
    // la oficina puede redibujarse (zoom, idioma): se reconstruye la capa si desaparece
    setInterval(() => { const w = document.querySelector("g.ao-world"); if (w && (!layer || !layer.isConnected)) build(w.ownerSVGElement); }, 2000);

    requestAnimationFrame(tick);
  }
  window.ATLAS_LIVE_LAYER = { start, set: d => { data = d; const w = document.querySelector("g.ao-world"); if (w) build(w.ownerSVGElement); } };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
