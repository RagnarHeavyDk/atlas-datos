const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const hero = canvas.closest('.hero');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const toggle = document.querySelector('#motion');
const seal = document.querySelector('.seal');
const mark = document.querySelector('.hero-mark');
let active = true;
let visible = true;
let frame, width, height, points, links;
let aimX = 0, aimY = 0, cameraX = 0, cameraY = 0;
let time = 0, previous = 0;

function resize() {
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  const compact = width < 701;
  const resolution = Math.min(devicePixelRatio, compact ? 1 : 1.5);
  canvas.width = width * resolution;
  canvas.height = height * resolution;
  ctx.setTransform(resolution, 0, 0, resolution, 0, 0);
  let state = 401;
  function random() {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  }
  points = [];
  links = [];
  const arms = compact ? 8 : 15;
  const strands = compact ? 4 : 8;
  const steps = compact ? 13 : 20;
  for (let arm = 0; arm < arms; arm++) {
    for (let strand = 0; strand < strands; strand++) {
      const angle = arm * Math.PI * 2 / arms + (strand / strands - .5) * .37;
      const depth = random() * .8 + .2;
      for (let step = 0; step < steps; step++) {
        const radius = (step + random() * .75) / steps;
        const curve = angle + radius * (1.4 + depth * .5);
        const point = {
          x: Math.cos(curve) * radius,
          y: Math.sin(curve) * radius,
          depth, radius, phase: arm * .19
        };
        if (step) links.push([points.at(-1), point]);
        if (strand && step && random() < .28) links.push([points.at(-steps), point]);
        points.push(point);
      }
    }
  }
  draw();
}

function draw() {
  const cx = width * (width < 701 ? .66 : .75);
  const cy = height * (width < 701 ? .63 : .48);
  const radius = Math.max(width * .52, height * .69);
  ctx.clearRect(0, 0, width, height);
  const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  halo.addColorStop(0, '#571522');
  halo.addColorStop(.44, '#250a14');
  halo.addColorStop(1, '#090a0b');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, width, height);
  const angle = time * .065;
  const cos = Math.cos(angle), sin = Math.sin(angle);
  for (const p of points) {
    const scale = radius * (.55 + p.depth * .63);
    p.px = cx + (p.x * cos - p.y * sin) * scale + cameraX * p.depth;
    p.py = cy + (p.x * sin + p.y * cos) * scale * .68 + cameraY * p.depth;
    const wave = (time * .42 - p.radius + p.phase + 20) % 1;
    p.lit = wave < .13 && p.depth > .43;
  }
  for (const lit of [false, true]) {
    ctx.beginPath();
    for (const [a,b] of links) {
      if ((a.lit && b.lit) !== lit) continue;
      ctx.moveTo(a.px, a.py);
      ctx.lineTo(b.px, b.py);
    }
    ctx.strokeStyle = lit ? '#ff5b668f' : '#bd3d5440';
    ctx.lineWidth = lit ? 1.25 : .7;
    ctx.stroke();
  }
  for (const lit of [false, true]) {
    ctx.fillStyle = lit ? '#ffadb3' : '#aa495b';
    for (const p of points) {
      if (p.lit !== lit) continue;
      const size = lit ? 2.4 + p.depth : .65 + p.depth;
      ctx.fillRect(p.px, p.py, size, size);
    }
  }
}

function tick(now) {
  if (previous) time += Math.min(now - previous, 50) / 1000;
  previous = now;
  cameraX += (aimX - cameraX) * .06;
  cameraY += (aimY - cameraY) * .06;
  draw();
  frame = requestAnimationFrame(tick);
}

function sync() {
  cancelAnimationFrame(frame);
  previous = 0;
  toggle.textContent = active ? atlasText('PAUSAR RED', 'PAUSE NETWORK') : atlasText('ACTIVAR RED', 'PLAY NETWORK');
  toggle.setAttribute('aria-pressed', String(!active));
  if (active && visible && !document.hidden) frame = requestAnimationFrame(tick);
}

if (ctx) {
  resize();
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(hero);
  hero.addEventListener('pointermove', event => {
    const rect = hero.getBoundingClientRect();
    aimX = (event.clientX - rect.left - width / 2) * .10;
    aimY = (event.clientY - rect.top - height / 2) * .08;
  });
  hero.addEventListener('pointerleave', () => { aimX = 0; aimY = 0; });
  addEventListener('scroll', () => { aimY = -Math.min(scrollY, height) * .075; }, {passive:true});
  document.addEventListener('visibilitychange', sync);

  toggle.addEventListener('click', () => { active = !active; sync(); });
  sync();
} else toggle.hidden = true;

function boot(explicit = false) {

  seal.classList.remove('booting');
  void seal.offsetWidth;
  seal.classList.add('booting');
}
mark.classList.remove('boot');
boot();
document.querySelector('#replay').addEventListener('click', () => boot(true));
