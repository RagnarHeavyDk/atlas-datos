async function render() {
  const response = await fetch('atlas-live.json', {cache:'no-store'});
  if (!response.ok) throw new Error('Missing snapshot');
  const data = await response.json();
  if (data.schema !== 'atlas-live/1') throw new Error('Unsupported schema');
  const bot = data.bot;
  const mia = data.mia;
  const format = value => value == null ? '—' : Number(value).toLocaleString('es-ES');
  switch (document.body.dataset.page) {
    case 'home':
      document.querySelector('#snapshot-summary').textContent = bot && mia
        ? 'Auditoría ' + mia.folder + ' · ' + format(mia.sources?.binance_votes) + '/' + bot.signal.rules + ' votos al cierre · Simulación'
        : 'Instantánea parcial';
      break;
    case 'evidence':
      for (const [index, test] of data.tests.entries()) {
        const file = test.result_file.replace(/^RESULTADO_|\.md$/g, '');
        const verdict = test.verdict_line;
        const limits = test.passed + '/' + test.total + ' mercados cumplen el criterio R. Consulta el resultado íntegro para los fallos y limitaciones.';

        const card = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = 'Prueba ' + (index + 1) + ' · ' + verdict;
        const note = document.createElement('p');
        note.textContent = limits;
        card.append(summary, note);
        const markets = document.createElement('ul');
        for (const market of test.markets) {
          const item = document.createElement('li');
          item.textContent = market.market + ' · R: ' + (market.passes_random ? 'sí' : 'no');
          markets.append(item);
        }
        card.append(markets);
        for (const [kind, label] of [['RESULTADO','Resultado íntegro'],['PROTOCOLO','Protocolo']]) {
          const link = document.createElement('a');
          link.href = 'evidence-files/' + kind + '_' + file + '.md';
          link.textContent = label + ' ↗';
          const row = document.createElement('p');
          row.append(link);
          card.append(row);
        }
        const hash = document.createElement('a');
        hash.href = 'evidence-files/HUELLAS' + ['', '_V2', '_V3'][index] + '.txt';
        hash.textContent = 'Huellas del expediente ↗';
        card.append(hash);
        document.querySelector('#trials').append(card);
      }
      break;
    case 'simulation':
      if (!bot) throw new Error('Missing bot');
      document.querySelector('#bot-summary').textContent =
        'Comisión ' + format(bot.fee_per_side * 100) + ' % por lado · Cartera simulada: ' +
        format(bot.portfolio.equity) + ' USDT · Corte del bot: ' + bot.status_generated_utc +
        ' · Mia: ' + format(mia?.sources?.binance_votes) + '/' + bot.signal.rules +
        ' al cierre del ' + (mia?.sources?.day ?? '—') + '.';
      replay(bot.decisions.map(decision => {
        const trade = bot.trades.find(row => row.day === decision.exec_day);
        const action = trade ? (Number(trade.to_exposure) > Number(trade.from_exposure) ? 'Entrada simulada' : 'Salida simulada') : 'Sin fill registrado';
        return {day:decision.exec_day, action, price:trade ? format(trade.price_open) : null, votes:Math.round(Number(decision.share_long) * bot.signal.rules)};
      }), bot.signal.rules);
      break;
    case 'mia': {
      const audit = document.querySelector('#audit');
      const heading = document.createElement('h2');
      if (!mia) throw new Error('Missing audit');
      heading.textContent = mia.code_verdict + ' · ' + mia.checks_passed + ' comprobaciones';
      audit.append(heading);
      for (const finding of [
        mia.verdict?.resumen,
        'Cierre ' + (mia.sources?.day ?? '—') + ' · Binance ' + format(mia.sources?.binance_close) + ' · Kraken ' + format(mia.sources?.kraken_close),
        ...(mia.verdict?.hallazgos ?? []).map(item => item.explicacion)
      ].filter(Boolean)) {
        const item = document.createElement('p');
        item.textContent = finding;
        audit.append(item);
      }
      break;
    }
  }
  if (typeof enhance === 'function') enhance(data);
}

function replay(events, rules) {
  const play = document.querySelector('#play');
  const step = document.querySelector('#step');
  const state = document.querySelector('#state');
  const log = document.querySelector('#events');
  let count = 0;
  let timer;
  function sync() {
    const done = count === events.length;
    state.textContent = count + ' / ' + events.length + ' registros';
    play.disabled = done;
    step.disabled = done || timer !== undefined;
    play.textContent = timer === undefined ? 'Reproducir' : 'Pausar';
  }
  function pause() {
    clearInterval(timer);
    timer = undefined;
  }
  function stepForward() {
    const event = events[count++];
    const row = document.createElement('li');
    row.textContent = [event.day, event.action, event.price, event.votes + '/' + rules + ' votos'].filter(value => value !== null).join(' · ');
    log.append(row);
    if (count === events.length) pause();
    sync();
  }
  play.onclick = () => {
    if (timer === undefined) timer = setInterval(stepForward, 1250);
    else pause();
    sync();
  };
  step.onclick = stepForward;
  document.querySelector('#reset').onclick = () => {
    pause();
    count = 0;
    log.replaceChildren();
    sync();
  };
  sync();
}

render().catch(() => {
  document.querySelector('#load-error').textContent = 'Instantánea no disponible.';
});
