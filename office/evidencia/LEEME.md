# ATLAS · Paquete de evidencia (13-nov-2026)

Todo lo necesario para comprobar, sin fiarse de ATLAS, las dos pruebas preregistradas de la regla ATLAS Slow Ensemble V1.

## Qué contiene
| Archivo | Para qué sirve |
|---|---|
| `PROTOCOLO_MULTIMERCADO_V1.md` | Protocolo y criterios de la prueba 1, escritos antes de ejecutarla |
| `HUELLAS.txt` | SHA-256 del protocolo V1, del motor y de los archivos de la regla. Huella de este archivo: `08c07416401d1d6bca7b91687d000a8dfc2e6d7727cd1e383a9ce0b595add549` |
| `RESULTADO_MULTIMERCADO_V1.md` | Resultado de la prueba 1: no generaliza con comisión del 0,8 % |
| `PROTOCOLO_INDICES_V2.md` | Protocolo y criterios de la prueba 2, escritos antes de ejecutarla |
| `HUELLAS_V2.txt` | SHA-256 del protocolo V2 y del motor. Huella de este archivo: `742b2843ab83696d7b8e0e650d76aab65bb39752968b954c049cc1c49b297dce` |
| `RESULTADO_INDICES_V2.md` | Resultado de la prueba 2: confirmado en 6 de 8 índices nuevos con comisión del 0,1 % |
| `engine_v1.js` | Motor con el que se ejecutaron las pruebas (huella `8e9a0d93…69f5`) |
| `reproducir.py` | Traducción línea a línea del motor a Python, sin dependencias, que descarga los datos y repite las dos pruebas |

## Cómo comprobarlo
1. Verificar que nada ha cambiado: calcular el SHA-256 de cada archivo (`sha256sum archivo`; en Windows, `Get-FileHash archivo`) y compararlo con `HUELLAS.txt` y `HUELLAS_V2.txt`. En la web todos los archivos están en la misma carpeta, así que se ignoran las rutas `../bot/` y `../tradingview/` que aparecen en `HUELLAS.txt`. Después, comprobar la huella del propio `HUELLAS.txt` (`08c07416…d549`) y de `HUELLAS_V2.txt` (`742b2843…7dce`).
2. Repetir las pruebas: `python reproducir.py` (unos minutos; `--sims 200` para una comprobación rápida).
3. Comparar la salida con los dos archivos de resultados.

`reproducir.py` se comprobó contra `engine_v1.js` con una serie sintética común: mismos resultados en todos los decimales, incluida la prueba contra el azar.

## Limitaciones conocidas
- Los datos de Yahoo Finance pueden corregirse con el tiempo; pequeñas diferencias en mercados concretos son posibles.
- Índices de precio sin dividendos; futuros continuos con saltos de vencimiento; errores conocidos en divisas (2008, 2022).
- Un resultado histórico no garantiza resultados futuros. Solo simulación.

## Prueba 3 (añadida el 14-nov-2026)
`PROTOCOLO_CRIPTO_V3.md`, `HUELLAS_V3.txt` (huella `4d1e1385…2e2b`) y `RESULTADO_CRIPTO_V3.md`: 12 criptomonedas nuevas con comisión del 0,8 %. Resultado: no confirmada. Se ejecutó con `engine_v1.js` y velas diarias de Binance; `reproducir.py` todavía no la incluye.
