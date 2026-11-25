# ATLAS · Protocolo de prueba multimercado V1 (preregistro)

Fecha de congelación: 13-nov-2026. Autor: Claude (por encargo de Miguel). Solo simulación.

## Pregunta
¿La regla ATLAS Slow Ensemble V1, diseñada mirando solo BTC, reduce las caídas de forma no aleatoria en mercados que nunca se usaron para diseñarla?

## Regla
Sin ningún cambio: `engine_v1.js` (misma lógica que `claude-work/bot/atlas_rule.py` y el Pine `ATLAS_SLOW_ENSEMBLE_V1.pine`). Definida en velas diarias; la volatilidad se anualiza con raíz de 365 también en mercados que no cotizan a diario (no se adapta: se prueba tal cual).

## Datos
Velas diarias de Yahoo Finance (chart API v8), precios sin ajustar por dividendos ni cupones, para la regla y para la referencia por igual.
Mercados (17), elegidos antes de ver ningún resultado: ^GSPC, ^NDX, ^GDAXI, ^N225, ^HSI, ^FTSE, ^KS11, ^BVSP, GC=F, SI=F, HG=F, ZN=F, TLT, EURUSD=X, JPY=X, GBPUSD=X, AUDUSD=X.
Excluido antes de ver resultados: CL=F (precio negativo en abril de 2020; la regla larga/efectivo no está definida ahí).
Se descartan velas con algún precio nulo o no positivo. Los futuros continuos incluyen saltos de vencimiento (limitación conocida).

## Ventana
Desde el 01-01-2000, o desde la vela 261 del histórico si es posterior (calentamiento), hasta el 30-09-2026.

## Costes
Principal: 0,8 % por lado (el mismo supuesto que en BTC). Secundario, solo informativo: 0,1 % por lado.

## Medidas por mercado (comisión principal)
- A: caída máxima de la regla ≤ 60 % de la de comprar y mantener el mismo mercado.
- B: si mantener tiene rentabilidad anual positiva, la regla ≥ 70 % de ella; si no, la regla ≥ mantener.
- R (contra el azar): se barajan 1.000 veces los tramos de exposición de la propia regla (misma duración y nivel, orden aleatorio, semilla 20261113). R se cumple si la caída de la regla es mejor que la de al menos el 95 % de las barajadas.

## Veredicto global (fijado antes de ejecutar)
- Indicio sólido: R en ≥ 9 de 17 mercados y A+B en ≥ 6 de 17.
- Indicio débil: R en ≥ 6 de 17.
- No generaliza: en otro caso.
Si no generaliza, se documenta y no se modifica la regla para rescatar el resultado.

## Integridad
SHA-256 de este protocolo y de `engine_v1.js` en `HUELLAS.txt`. El motor que se ejecuta debe tener la misma huella.
