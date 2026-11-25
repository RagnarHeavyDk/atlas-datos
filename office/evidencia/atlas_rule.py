"""ATLAS Slow Ensemble V1 — regla congelada el 11-nov-2026. Python puro (sin dependencias).

Conjunto de 38 reglas lentas con mayoria 60/40 y exposicion ajustada por volatilidad
(objetivo 50 %, ventana 30 dias, pasos de 0,25). Larga o efectivo. Solo calculo: no opera.
Cada vela: dict con t (ms UTC de apertura), o, h, l, c.
"""
from __future__ import annotations
import math

RULE_ID = "atlas-slow-ensemble-v1"
SMA_N = list(range(100, 260, 10))      # 16
MOM_N = list(range(84, 260, 14))       # 13
DON_N = list(range(40, 130, 10))       # 9
ENTER, EXIT = 0.6, 0.4
VOL_TARGET, VOL_WIN, STEP = 0.50, 30, 0.25
WARMUP = 260  # velas necesarias para que todas las reglas tengan historial


def signals(candles: list[dict]) -> list[dict]:
    """Devuelve, por vela, lo conocido a su cierre: votos, conjunto, volatilidad y exposicion objetivo."""
    n = len(candles)
    c = [x["c"] for x in candles]; h = [x["h"] for x in candles]; l = [x["l"] for x in candles]
    pre = [0.0]
    for v in c: pre.append(pre[-1] + v)
    votes = [0] * n
    for p in SMA_N:
        for i in range(p - 1, n):
            if c[i] > (pre[i + 1] - pre[i + 1 - p]) / p: votes[i] += 1
    for p in MOM_N:
        for i in range(p, n):
            if c[i] > c[i - p]: votes[i] += 1
    for p in DON_N:
        s, q = 0, p // 2
        for i in range(n):
            if i >= p:
                if c[i] > max(h[i - p:i]): s = 1
                elif c[i] < min(l[i - q:i]): s = 0
            votes[i] += s
    rules = len(SMA_N) + len(MOM_N) + len(DON_N)
    lr = [float("nan")] + [math.log(c[i] / c[i - 1]) for i in range(1, n)]
    out, ens = [], 0
    for i in range(n):
        share = votes[i] / rules
        if share >= ENTER: ens = 1
        elif share <= EXIT: ens = 0
        vol = None
        if i >= VOL_WIN:
            w = lr[i - VOL_WIN + 1:i + 1]; m = sum(w) / VOL_WIN
            vol = math.sqrt(sum((x - m) ** 2 for x in w) / (VOL_WIN - 1)) * math.sqrt(365)
        raw = 0.0 if not vol else ens * min(1.0, VOL_TARGET / vol)
        target = max(0.0, min(1.0, math.floor(raw / STEP + 0.5) * STEP))
        out.append({"t": candles[i]["t"], "votes": votes[i], "rules": rules, "share": share, "ens": ens,
                    "vol": vol, "target": target, "warm": i >= WARMUP})
    return out


def replay(candles: list[dict], targets: list[float], fee: float, i0: int, i1: int, capital: float = 1.0):
    """Simula de i0 a i1 (incluidos). La exposicion decidida al cierre de i-1 se ejecuta en la apertura de i."""
    eq, w_prev, c_prev, prev_t = capital, 0.0, None, None
    rows, trades = [], []
    for i in range(i0, i1 + 1):
        wt = targets[i - 1] if i > 0 else 0.0
        o, c = candles[i]["o"], candles[i]["c"]
        if c_prev is not None and w_prev:
            g = 1 + w_prev * (o / c_prev - 1); w_prev = w_prev * (o / c_prev) / g; eq *= g
        dw = abs(wt - w_prev)
        if dw > 1e-12 and (prev_t is None or abs(wt - prev_t) > 1e-12 or ((w_prev == 0) != (wt == 0))):
            cost = eq * fee * dw; eq -= cost
            trades.append({"t": candles[i]["t"], "price": o, "from": round(w_prev, 4), "to": wt, "fee": cost, "equity": eq})
            w_prev = wt
        g = 1 + w_prev * (c / o - 1); w_prev = w_prev * (c / o) / g if g else 0.0; eq *= g
        rows.append({"t": candles[i]["t"], "equity": eq, "expo": w_prev})
        c_prev, prev_t = c, wt
    return rows, trades


def max_drawdown(values: list[float], start: float) -> float:
    peak, dd = start, 0.0
    for v in values:
        peak = max(peak, v); dd = min(dd, v / peak - 1)
    return dd
