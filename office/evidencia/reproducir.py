"""ATLAS · reproduccion independiente de las pruebas preregistradas V1 y V2 (13-nov-2026).

Cualquiera puede ejecutarlo:  python reproducir.py            (V1 y V2, 1.000 barajadas)
                              python reproducir.py --sims 200 (mas rapido, p aproximadas)
Solo biblioteca estandar de Python 3.9+. Descarga velas diarias publicas de Yahoo Finance.
Es una traduccion linea a linea de engine_v1.js (misma regla, mismo generador aleatorio, misma semilla),
asi que con los mismos datos debe dar los mismos numeros que RESULTADO_MULTIMERCADO_V1.md y RESULTADO_INDICES_V2.md.
Yahoo puede corregir datos antiguos con el tiempo; diferencias pequenas en mercados concretos son esperables.
Solo simulacion: no opera, no usa claves.
"""
from __future__ import annotations
import argparse, json, math, sys, time, urllib.parse, urllib.request
from datetime import datetime, timezone

M32 = 0xFFFFFFFF
V1 = ['^GSPC', '^NDX', '^GDAXI', '^N225', '^HSI', '^FTSE', '^KS11', '^BVSP', 'GC=F', 'SI=F', 'HG=F', 'ZN=F', 'TLT', 'EURUSD=X', 'JPY=X', 'GBPUSD=X', 'AUDUSD=X']
V2 = ['^FCHI', '^IBEX', '^AEX', '^SSMI', '^GSPTSE', '^TWII', '^RUT', '^DJI']
START = int(datetime(2000, 1, 1, tzinfo=timezone.utc).timestamp() * 1000)
END = int(datetime(2026, 9, 30, tzinfo=timezone.utc).timestamp() * 1000)
P2 = int(datetime(2026, 10, 1, tzinfo=timezone.utc).timestamp())


def fetch(sym):
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{urllib.parse.quote(sym)}?period1=0&period2={P2}&interval=1d"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (ATLAS reproduccion)"})
    with urllib.request.urlopen(req, timeout=60) as r:
        res = json.loads(r.read())["chart"]["result"][0]
    q = res["indicators"]["quote"][0]; d = []
    for i, t in enumerate(res.get("timestamp") or []):
        o, h, l, c = q["open"][i], q["high"][i], q["low"][i], q["close"][i]
        if all(v is not None and v > 0 for v in (o, h, l, c)):
            d.append({"t": t * 1000, "o": o, "h": max(h, o, c), "l": min(l, o, c), "c": c})
    return d


def targets(d):
    n = len(d); c = [x["c"] for x in d]; h = [x["h"] for x in d]; l = [x["l"] for x in d]
    pre = [0.0]
    for i in range(n): pre.append(pre[i] + c[i])
    votes = [0.0] * n; rules = 0
    for p in range(100, 260, 10):
        rules += 1
        for i in range(p - 1, n):
            if c[i] > (pre[i + 1] - pre[i + 1 - p]) / p: votes[i] += 1
    for p in range(84, 260, 14):
        rules += 1
        for i in range(p, n):
            if c[i] > c[i - p]: votes[i] += 1
    for p in range(40, 130, 10):
        rules += 1; s = 0; q = p // 2
        for i in range(n):
            if i >= p:
                hi = max(h[i - p:i]); lo = min(l[i - q:i])
                if c[i] > hi: s = 1
                elif c[i] < lo: s = 0
            votes[i] += s
    w = [0.0] * n; e = 0; lr = [float("nan")] + [math.log(c[i] / c[i - 1]) for i in range(1, n)]
    for i in range(n):
        sh = votes[i] / rules
        if sh >= 0.6: e = 1
        elif sh <= 0.4: e = 0
        vol = float("nan")
        if i >= 30:
            win = lr[i - 29:i + 1]; m = 0.0
            for x in win: m += x
            m /= 30; v = 0.0
            for x in win: v += (x - m) ** 2
            vol = math.sqrt(v / 29) * math.sqrt(365)
        raw = 0.0 if (math.isnan(vol) or vol == 0) else e * min(1.0, 0.5 / vol)
        w[i] = max(0.0, min(1.0, math.floor(raw / 0.25 + 0.5) * 0.25))
    return w


def sim(d, target, fee, i0, i1):
    eq = []; ex = []; e = 1.0; wp = 0.0; cp = None; prev_t = None; trades = 0
    for i in range(i0, i1 + 1):
        wt = target[i - 1] if i > 0 else 0.0; o = d[i]["o"]; c = d[i]["c"]
        if cp is not None and wp:
            g = 1 + wp * (o / cp - 1); wp = wp * (o / cp) / g; e *= g
        dw = abs(wt - wp)
        if dw > 1e-12 and (prev_t is None or abs(wt - prev_t) > 1e-12 or ((wp == 0) != (wt == 0))):
            e *= 1 - fee * dw; wp = wt; trades += 1
        g = 1 + wp * (c / o - 1); wp = wp * (c / o) / g if g else 0.0; e *= g
        eq.append(e); ex.append(wp); cp = c; prev_t = wt
    return eq, ex, trades


def stats(r, d, i0, i1):
    eq, ex, trades = r; yrs = (d[i1]["t"] - d[i0]["t"]) / 864e5 / 365.25; peak = 1.0; dd = 0.0
    for x in eq:
        if x > peak: peak = x
        dd = min(dd, x / peak - 1)
    fin = eq[-1]
    return {"cagr": fin ** (1 / yrs) - 1, "maxdd": dd, "total": fin - 1, "trades": trades, "expo": sum(ex) / len(ex)}


def rng(seed):
    st = [seed & M32]
    def nxt():
        s = (st[0] + 0x6D2B79F5) & M32; st[0] = s
        t = ((s ^ (s >> 15)) * (1 | s)) & M32
        t = ((t + (((t ^ (t >> 7)) * (61 | t)) & M32)) & M32) ^ t
        return ((t ^ (t >> 14)) & M32) / 4294967296
    return nxt


def shuffle_test(d, w, fee, i0, i1, nsims, seed):
    vals = w[i0 - 1:i1]; cut = [0] + [k for k in range(1, len(vals)) if vals[k] != vals[k - 1]] + [len(vals)]
    seg = [vals[cut[k]:cut[k + 1]] for k in range(len(cut) - 1)]; R = rng(seed); out = []
    for _ in range(nsims):
        idx = list(range(len(seg)))
        for k in range(len(idx) - 1, 0, -1):
            j = math.floor(R() * (k + 1)); idx[k], idx[j] = idx[j], idx[k]
        x = [v for k in idx for v in seg[k]]; t = list(w); t[i0 - 1:i0 - 1 + len(x)] = x
        out.append(stats(sim(d, t, fee, i0, i1), d, i0, i1))
    return out


def evaluate(d, fee, nsims, seed=20261113):
    w = targets(d); i0 = next(i for i, x in enumerate(d) if x["t"] >= START); i0 = max(i0, 260)
    i1 = len(d) - 1
    while d[i1]["t"] > END: i1 -= 1
    S = stats(sim(d, w, fee, i0, i1), d, i0, i1); H = stats(sim(d, [1.0] * len(d), fee, i0, i1), d, i0, i1)
    Z = shuffle_test(d, w, fee, i0, i1, nsims, seed) if nsims else []
    p_dd = sum(z["maxdd"] >= S["maxdd"] for z in Z) / len(Z) if Z else None
    A = S["maxdd"] / H["maxdd"] <= 0.6; B = S["cagr"] >= 0.7 * H["cagr"] if H["cagr"] > 0 else S["cagr"] >= H["cagr"]
    return {"rule": S, "hold": H, "p_dd": p_dd, "A": A, "B": B, "R": p_dd is not None and p_dd <= 0.05}


def run(name, syms, fee, nsims):
    print(f"\n=== {name} · comision {fee*100:.1f} % por lado · {nsims} barajadas ===")
    print(f"{'mercado':<10} {'regla anual':>11} {'regla caida':>11} {'mant. anual':>11} {'mant. caida':>11} {'p azar':>7}  A  B  R")
    res = {}
    for s in syms:
        t0 = time.time(); r = evaluate(fetch(s), fee, nsims); res[s] = r; f = lambda x: f"{x*100:.1f} %"
        print(f"{s:<10} {f(r['rule']['cagr']):>11} {f(r['rule']['maxdd']):>11} {f(r['hold']['cagr']):>11} {f(r['hold']['maxdd']):>11} {r['p_dd']:>7.3f}  {'s' if r['A'] else '-'}  {'s' if r['B'] else '-'}  {'s' if r['R'] else '-'}  ({time.time()-t0:.0f} s)", flush=True)
    return res


if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("--sims", type=int, default=1000); ap.add_argument("--solo", choices=["v1", "v2"])
    a = ap.parse_args()
    if a.solo != "v2":
        r1 = run("V1: 17 mercados", V1, 0.008, a.sims); nR = sum(x["R"] for x in r1.values()); nAB = sum(x["A"] and x["B"] for x in r1.values())
        print(f"R {nR}/17 · A+B {nAB}/17 · veredicto: {'INDICIO SOLIDO' if nR >= 9 and nAB >= 6 else 'INDICIO DEBIL' if nR >= 6 else 'NO GENERALIZA'}")
    if a.solo != "v1":
        r2 = run("V2: 8 indices nuevos", V2, 0.001, a.sims); nR = sum(x["R"] for x in r2.values())
        print(f"R {nR}/8 · veredicto: {'CONFIRMADO' if nR >= 5 else 'DEBIL' if nR >= 3 else 'NO CONFIRMADO'}")
