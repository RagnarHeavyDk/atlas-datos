function enhance(data) {
  const make = (tag, text, cls) => {
    const e = document.createElement(tag);
    e.textContent = text ?? '';
    e.className = cls ?? '';
    return e;
  };
  const fmt = n => n == null || n === '' ? '—' : Number(n).toLocaleString('es-ES');
  const sources = data.mia?.sources;
  const stage = document.querySelector('#bot-summary');
  if (stage && data.bot) {
    const bot = data.bot;
    const grid = make('section', '', 'diagnostic-grid');
    const votes = make('article', '', 'instrument');
    const dial = make('strong', fmt(sources?.binance_votes) + '/' + bot.signal.rules, 'vote-dial');
    dial.style.setProperty('--vote', (100 * (sources?.binance_votes ?? 0) / bot.signal.rules) + '%');
    votes.append(make('h2',atlasText('Votos al cierre auditado','Votes at audited close')),dial,
      make('p',atlasText('40 % salida · 60 % entrada','40% exit · 60% entry')),
      make('small',sources?.day ? 'Binance · ' + sources.day : '—'));
    const timeline = make('article','','instrument');
    timeline.append(make('h2','Cierres y decisiones'));
    const closes = bot.decisions.map(d => [d.signal_day, d.signal_close]);
    if (sources?.day && !closes.some(([day]) => day === sources.day)) {
      closes.push([sources.day, sources.binance_close]);
    }
    const points = closes.filter(([,price]) => price != null && price !== '' && Number.isFinite(Number(price)));
    if (points.length > 1) {
      const ns = 'http://www.w3.org/2000/svg';
      const chart = document.createElementNS(ns, 'svg');
      chart.setAttribute('viewBox', '0 0 400 100');
      chart.setAttribute('role', 'img');
      chart.setAttribute('aria-label', 'Cierres BTCUSDT registrados');
      chart.style.width = '100%';
      const values = points.map(([,price]) => Number(price));
      const min = Math.min(...values), span = Math.max(...values) - min || 1;
      const trace = document.createElementNS(ns, 'polyline');
      trace.setAttribute('points', values.map((price,i) => [12 + i * 376 / (values.length - 1), 88 - 76 * (price-min)/span].join(',')).join(' '));
      trace.setAttribute('fill', 'none');
      trace.setAttribute('stroke', '#a3e1dd');
      trace.setAttribute('stroke-width', '3');
      chart.append(trace);
      timeline.append(chart);
    }
    for (const d of bot.decisions) {
      const trade = bot.trades.find(t => t.day === d.exec_day);
      const row = make('div','','timeline-row');
      const action = !trade ? 'Sin ejecución registrada' : Number(trade.to_exposure) > Number(trade.from_exposure) ? 'Entrada' : 'Salida';
      row.append(make('small','CIERRE ' + d.signal_day),make('strong',fmt(d.signal_close) + ' USDT'),make('p',d.exec_day + ' · ' + action + (trade ? ' · ' + fmt(trade.price_open) + ' USDT' : '')));
      timeline.append(row);
    }
    if (sources?.day && !bot.decisions.some(d => d.signal_day === sources.day)) {
      const row = make('div','','timeline-row');
      row.append(make('small',atlasText('CIERRE AUDITADO ','AUDITED CLOSE ') + sources.day),
        make('strong',fmt(sources.binance_close) + ' USDT'),
        make('p','Mia · Binance · ' + fmt(sources.binance_votes) + '/' + bot.signal.rules));
      timeline.append(row);
    }
    grid.append(votes,timeline);
    stage.after(grid);
  }
  const audit = document.querySelector('#audit');
  if (audit && data.mia) {
    const mia = data.mia;
    const comparison = make('section','','diagnostic-grid comparison');
    for (const [label,value] of [['Binance',sources?.binance_close],['Kraken',sources?.kraken_close]]) {
      const panel = make('article','','instrument');
      panel.append(make('small',label),make('strong',fmt(value)),make('p','Cierre · ' + (sources?.day ?? '—')));
      comparison.append(panel);
    }
    const matrix = make('div','','check-matrix');
    for (const [i,c] of (mia.checks ?? []).entries()) {
      const tile = make('details','',c.ok ? 'pass' : 'fail');
      tile.style.setProperty('--delay', i * 100 + 'ms');
      tile.append(make('summary',c.id.replaceAll('_',' ') + ' · ' + (c.ok ? 'OK' : 'FALLO')),make('p',typeof c.detail === 'string' ? c.detail : JSON.stringify(c.detail ?? '—')));
      matrix.append(tile);
    }
    const failures = (mia.checks ?? []).filter(check => check.ok === false).length;
    const gap = mia.checks?.find(check => check.id === 'C7_close_gap');
    audit.querySelector('h2').after(comparison,make('h2','Comprobaciones'),
      make('p',atlasText('Fallos registrados: ','Recorded failures: ') + failures +
        ' · ' + atlasText('Ejecución UTC: ','Run date (UTC): ') + mia.folder),
      make('p',gap?.detail),matrix,make('h2','Historial disponible'),make('p',mia.folder + ' · ' + mia.code_verdict));
  }
}
