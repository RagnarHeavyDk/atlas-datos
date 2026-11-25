// ATLAS Slow Ensemble V1 - motor de evaluacion multimercado (JavaScript). Congelado el 13-nov-2026.
// Regla identica a atlas_rule.py (definida en velas; volatilidad anualizada con raiz de 365). Solo simulacion.
// Cada vela: {t (ms UTC), o, h, l, c}. Senal al cierre de i, ejecucion en la apertura de i+1. Larga o efectivo.
const ATLAS = (() => {
  function targets(d) {
    const n = d.length, c = d.map(x => x.c), h = d.map(x => x.h), l = d.map(x => x.l);
    const pre = [0]; for (let i = 0; i < n; i++) pre.push(pre[i] + c[i]);
    const votes = new Float64Array(n); let rules = 0;
    for (let p = 100; p < 260; p += 10) { rules++; for (let i = p - 1; i < n; i++) if (c[i] > (pre[i + 1] - pre[i + 1 - p]) / p) votes[i]++; }
    for (let p = 84; p < 260; p += 14) { rules++; for (let i = p; i < n; i++) if (c[i] > c[i - p]) votes[i]++; }
    for (let p = 40; p < 130; p += 10) { rules++; let s = 0; const q = Math.floor(p / 2);
      for (let i = 0; i < n; i++) { if (i >= p) { let hi = -Infinity, lo = Infinity; for (let j = i - p; j < i; j++) if (h[j] > hi) hi = h[j]; for (let j = i - q; j < i; j++) if (l[j] < lo) lo = l[j]; if (c[i] > hi) s = 1; else if (c[i] < lo) s = 0; } votes[i] += s; } }
    const w = new Float64Array(n); let e = 0; const lr = c.map((x, i) => i ? Math.log(x / c[i - 1]) : NaN);
    for (let i = 0; i < n; i++) { const sh = votes[i] / rules; if (sh >= 0.6) e = 1; else if (sh <= 0.4) e = 0;
      let vol = NaN; if (i >= 30) { let m = 0; for (let j = i - 29; j <= i; j++) m += lr[j]; m /= 30; let v = 0; for (let j = i - 29; j <= i; j++) v += (lr[j] - m) ** 2; vol = Math.sqrt(v / 29) * Math.sqrt(365); }
      const raw = (isNaN(vol) || vol === 0) ? 0 : e * Math.min(1, 0.5 / vol); w[i] = Math.max(0, Math.min(1, Math.floor(raw / 0.25 + 0.5) * 0.25)); }
    return w;
  }
  function sim(d, target, fee, i0, i1) {
    const eq = [], ex = []; let e = 1, wp = 0, cp = null, prevT = null, trades = 0;
    for (let i = i0; i <= i1; i++) { const wt = i > 0 ? target[i - 1] : 0, o = d[i].o, c = d[i].c;
      if (cp !== null && wp) { const g = 1 + wp * (o / cp - 1); wp = wp * (o / cp) / g; e *= g; }
      const dw = Math.abs(wt - wp); if (dw > 1e-12 && (prevT === null || Math.abs(wt - prevT) > 1e-12 || ((wp === 0) !== (wt === 0)))) { e *= 1 - fee * dw; wp = wt; trades++; }
      const g = 1 + wp * (c / o - 1); wp = g ? wp * (c / o) / g : 0; e *= g; eq.push(e); ex.push(wp); cp = c; prevT = wt; }
    return { eq, ex, trades };
  }
  function stats(r, d, i0, i1) {
    const yrs = (d[i1].t - d[i0].t) / 864e5 / 365.25; let peak = 1, dd = 0; for (const x of r.eq) { if (x > peak) peak = x; dd = Math.min(dd, x / peak - 1); }
    const fin = r.eq[r.eq.length - 1]; return { cagr: Math.pow(fin, 1 / yrs) - 1, maxdd: dd, total: fin - 1, trades: r.trades, expo: r.ex.reduce((a, b) => a + b, 0) / r.ex.length, years: yrs };
  }
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  // Prueba contra el azar: se barajan los tramos de exposicion de la propia regla (misma duracion y nivel, orden aleatorio).
  function shuffleTest(d, w, fee, i0, i1, nSims, seed) {
    const vals = Array.from(w.slice(i0 - 1, i1)); const cut = [0]; for (let k = 1; k < vals.length; k++) if (vals[k] !== vals[k - 1]) cut.push(k); cut.push(vals.length);
    const seg = []; for (let k = 0; k + 1 < cut.length; k++) seg.push(vals.slice(cut[k], cut[k + 1]));
    const R = rng(seed), out = [];
    for (let s = 0; s < nSims; s++) { const idx = seg.map((_, k) => k); for (let k = idx.length - 1; k > 0; k--) { const j = Math.floor(R() * (k + 1)); [idx[k], idx[j]] = [idx[j], idx[k]]; }
      const x = [].concat(...idx.map(k => seg[k])); const t = Float64Array.from(w); for (let k = 0; k < x.length; k++) t[i0 - 1 + k] = x[k];
      out.push(stats(sim(d, t, fee, i0, i1), d, i0, i1)); }
    return out;
  }
  function evaluate(d, fee, startMs, endMs, nSims = 1000, seed = 20261113) {
    const w = targets(d); let i0 = d.findIndex(x => x.t >= startMs); if (i0 < 260) i0 = 260; let i1 = d.length - 1; while (d[i1].t > endMs) i1--;
    const S = stats(sim(d, w, fee, i0, i1), d, i0, i1), H = stats(sim(d, new Float64Array(d.length).fill(1), fee, i0, i1), d, i0, i1);
    const Z = nSims ? shuffleTest(d, w, fee, i0, i1, nSims, seed) : [];
    const pDD = Z.length ? Z.filter(z => z.maxdd >= S.maxdd).length / Z.length : null, pCAGR = Z.length ? Z.filter(z => z.cagr >= S.cagr).length / Z.length : null;
    const A = S.maxdd / H.maxdd <= 0.6, B = H.cagr > 0 ? S.cagr >= 0.7 * H.cagr : S.cagr >= H.cagr, R = pDD !== null && pDD <= 0.05;
    return { from: new Date(d[i0].t).toISOString().slice(0, 10), to: new Date(d[i1].t).toISOString().slice(0, 10), rule: S, hold: H, ddRatio: S.maxdd / H.maxdd, pDD, pCAGR, A, B, R };
  }
  return { targets, sim, stats, shuffleTest, evaluate };
})();
