# ATLAS · datos publicos (simulacion)

Este repositorio lo actualiza cada noche, de forma automatica, la auditora Mia desde la nube.

- `registro/registro.json`: una entrada por cierre diario UTC de la regla congelada atlas-slow-ensemble-v1 (BTC/USDT).
  Cada entrada guarda la huella SHA-256 de la anterior: si alguien cambiara una cifra del pasado, la cadena se romperia.
  El historial de commits de GitHub sirve ademas de sello de tiempo independiente.
- `estado/estado.json`: la foto del ultimo cierre (votos, exposicion, niveles de entrada y salida, carteras simuladas).

Solo simulacion. No es asesoramiento financiero ni una invitacion a invertir. https://atlascapitalai.com
