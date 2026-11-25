# ATLAS · Protocolo V2: confirmación en índices bursátiles nuevos (preregistro)

Fecha: 13-nov-2026, después de ver el resultado V1 y antes de ejecutar esta prueba.

## Hipótesis (surge del secundario de V1, por eso se confirma en mercados NUEVOS)
Con una comisión de mercado realista (0,1 % por lado), la regla ATLAS Slow Ensemble V1, sin cambios, reduce la caída máxima de forma no aleatoria en índices bursátiles amplios.

## Regla y motor
`engine_v1.js` sin cambios (misma huella 8e9a0d938b0c189c8e2e13d4b790963e6dcf858a3a7b63c1914d1678e21d69f5).

## Mercados (ninguno usado en V1)
Elegidos antes de ver resultados, entre los índices de Yahoo con historial desde antes de 2000 y menos de 50 velas planas: ^FCHI, ^IBEX, ^AEX, ^SSMI, ^GSPTSE, ^TWII, ^RUT, ^DJI.
Descartados por calidad o longitud antes de ver resultados: ^STOXX50E y ^NSEI (empiezan en 2007), ^AXJO, ^MXX, ^JKSE, ^STI, ^BFX (más de 50 velas planas), ^OMXS30 (sin datos).
Advertencia: ^DJI y ^RUT son índices de EE. UU. muy correlacionados con ^GSPC (usado en V1).

## Ventana y costes
01-01-2000 (o tras 260 velas) a 30-09-2026. Comisión 0,1 % por lado. Mismas medidas A, B y R (1.000 barajadas, semilla 20261113).

## Veredicto (fijado antes de ejecutar)
- Confirmado: R en ≥ 5 de 8.
- Débil: R en 3 o 4 de 8.
- No confirmado: R en ≤ 2 de 8.
