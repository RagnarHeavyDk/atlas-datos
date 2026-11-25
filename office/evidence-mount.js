const evidenceScript = document.createElement('script');
evidenceScript.src = atlasSpanish ? 'evidence-viz.js' : 'evidence-viz-en.js';
evidenceScript.onload = () => ATLASEvidence.mount(document.getElementById('atlas-evidence'), {
  live: 'atlas-live.json',
  evidence: 'evidencia/'
}).catch(() => {
  document.getElementById('load-error').textContent = atlasText('Expedientes no disponibles.', 'Evidence records unavailable.');
});
document.head.append(evidenceScript);
