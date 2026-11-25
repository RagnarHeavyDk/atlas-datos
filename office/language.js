const atlasSpanish = new URLSearchParams(location.search).get('lang') === 'es';
document.documentElement.lang = atlasSpanish ? 'es' : 'en';
const atlasText = (es, en) => atlasSpanish ? es : en;
const languageButton = document.createElement('button');
languageButton.type = 'button';
languageButton.textContent = atlasText('English', 'Español');
languageButton.addEventListener('click', () => {
  const url = new URL(location.href);
  if (atlasSpanish) url.searchParams.delete('lang');
  else url.searchParams.set('lang', 'es');
  location.assign(url);
});
document.querySelector('header nav')?.append(languageButton);
if (atlasSpanish) {
  const routes = new Set(['index.html', 'office.html', 'evidence.html', 'simulation.html', 'mia.html']);
  for (const link of document.querySelectorAll('a[href]')) {
    const url = new URL(link.href);
    if (url.origin === location.origin && url.pathname.endsWith('/parte/')) { url.hash = 'es'; link.href = url.href; }
    if (url.origin === location.origin && routes.has(url.pathname.split('/').at(-1))) {
      url.searchParams.set('lang', 'es');
      link.href = url.href;
    }
  }
}
if (atlasSpanish) document.querySelectorAll('[data-es]').forEach(element => {
  element.textContent = element.dataset.es;
});
const englishLabels = {
  "Bot en simulación.": "Bot simulation.",
  "Auditoría de Mia.": "Mia audit.",
  "Evidencia.": "Evidence.",
  "Oficina ATLAS.": "ATLAS office.",
  "REGISTRO DE INVESTIGACIÓN": "RESEARCH RECORD",
  "CONTROL DE SIMULACIÓN": "SIMULATION AUDIT",
  "OFICINA ISOMÉTRICA": "ISOMETRIC OFFICE",
  "Reproducir": "Play",
  "Pausar": "Pause",
  "Avanzar": "Step",
  "Reiniciar": "Reset",
  "Cierres y decisiones": "Closes and decisions",
  "Votos al cierre auditado": "Votes at audited close",
  "40 % salida · 60 % entrada": "40% exit · 60% entry",
  "Historial disponible": "Available history",
  "Comprobaciones": "Checks",
  "Entrada simulada": "Simulated entry",
  "Salida simulada": "Simulated exit",
  "PROTOTIPO LOCAL": "LOCAL PROTOTYPE",
  "Ejecución del 14 de noviembre de 2026. Cierre auditado del 13 de noviembre.": "Audit run on 14 November 2026, covering the 13 November close.",
  "Tres pruebas prerregistradas con resultados, fallos y limitaciones.": "Three preregistered trials with results, failures and limitations."
};
if (!atlasSpanish) {
  const translateLabels = root => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const text = walker.currentNode;
      const replacement = englishLabels[text.nodeValue.trim()];
      if (replacement) text.nodeValue = replacement;
    }
  };
  translateLabels(document.body);
  new MutationObserver(records => {
    for (const record of records) for (const added of record.addedNodes) {
      if (added.nodeType === Node.TEXT_NODE) {
        const replacement = englishLabels[added.nodeValue.trim()];
        if (replacement) added.nodeValue = replacement;
      } else if (added.nodeType === Node.ELEMENT_NODE) translateLabels(added);
    }
  }).observe(document.body, {childList:true,subtree:true});
}
