# ATLAS · Protocolo V3: criptomonedas nuevas con la comisión real de Miguel (preregistro)

Fecha: 14-nov-2026, antes de ejecutar.

## Pregunta
Con la comisión real de Miguel (0,8 % por lado), ¿la regla ATLAS Slow Ensemble V1, sin cambios, reduce la caída máxima de forma no aleatoria en criptomonedas que no se usaron para diseñarla ni en pruebas anteriores?

## Regla y motor
`engine_v1.js` sin cambios (huella 8e9a0d938b0c189c8e2e13d4b790963e6dcf858a3a7b63c1914d1678e21d69f5).

## Mercados
Criterio, fijado antes de ver datos: criptomonedas conocidas con par USDT en Binance listado antes del 1-ene-2021, excluyendo monedas estables y las ya usadas (BTC, ETH, SOL, ADA, BNB, XRP, LTC).
Lista (12): BCHUSDT, LINKUSDT, DOGEUSDT, TRXUSDT, XLMUSDT, ETCUSDT, ATOMUSDT, DOTUSDT, AVAXUSDT, UNIUSDT, FILUSDT, AAVEUSDT.
Si alguno no tiene datos suficientes (menos de 2 años tras el calentamiento), se excluye y se informa.

## Datos y ventana
Velas diarias de Binance (data-api.binance.vision), desde la vela 261 de cada par hasta el 30-09-2026.

## Medidas (comisión 0,8 % por lado)
A, B y R como en V1 (R: caída mejor que el 95 % de 1.000 barajadas, semilla 20261113).

## Veredicto (fijado antes de ejecutar)
- Confirmado: R en ≥ 8 de los mercados válidos (sobre 12; si se excluye alguno, ≥ 2/3 de los válidos, redondeando hacia arriba).
- Débil: R en ≥ 5 (o ≥ 40 % de los válidos).
- No confirmado: en otro caso.
Advertencia: las criptomonedas se mueven muy juntas con BTC; no son pruebas independientes.
