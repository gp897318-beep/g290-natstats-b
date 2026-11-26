// DataNusa — grafik kanvas tanpa pustaka luar.
// drawLineChart dan drawBarChart menggambar sumbu, grid, label nilai,
// dan judul kecil langsung di atas elemen <canvas>.

function setupCanvas(canvas) {
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { ctx, width, height };
}

function niceBounds(values, padFrac) {
  let min = Math.min.apply(null, values);
  let max = Math.max.apply(null, values);
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const pad = (max - min) * (padFrac || 0.15);
  min -= pad;
  max += pad;
  if (min > 0 && min - pad < 0) min = 0;
  return { min, max };
}

function drawAxes(ctx, box, labels, min, max, unit) {
  const ticks = 4;
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  for (let i = 0; i <= ticks; i++) {
    const v = min + ((max - min) * i) / ticks;
    const y = box.y + box.h - (box.h * i) / ticks;
    ctx.beginPath();
    ctx.moveTo(box.x, y);
    ctx.lineTo(box.x + box.w, y);
    ctx.stroke();
    ctx.textAlign = 'right';
    ctx.fillText(formatNumber(v, 1), box.x - 8, y + 4);
  }
  ctx.textAlign = 'center';
  labels.forEach((label, i) => {
    const x = box.x + (box.w * (i + 0.5)) / labels.length;
    ctx.fillText(String(label), x, box.y + box.h + 18);
  });
  if (unit) {
    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(unit, box.x, box.y - 8);
  }
}

function drawLineChart(canvas, series, opts) {
  const options = opts || {};
  const { ctx, width, height } = setupCanvas(canvas);
  ctx.clearRect(0, 0, width, height);
  const values = series.map((p) => p.value);
  const bounds = niceBounds(values, 0.2);
  const box = { x: 52, y: 28, w: width - 72, h: height - 62 };
  drawAxes(ctx, box, series.map((p) => p.year), bounds.min, bounds.max, options.unit || '');
  const xAt = (i) => box.x + (box.w * (i + 0.5)) / series.length;
  const yAt = (v) => box.y + box.h - ((v - bounds.min) / (bounds.max - bounds.min)) * box.h;
  // Area di bawah garis.
  ctx.beginPath();
  ctx.moveTo(xAt(0), yAt(series[0].value));
  series.forEach((p, i) => ctx.lineTo(xAt(i), yAt(p.value)));
  ctx.lineTo(xAt(series.length - 1), box.y + box.h);
  ctx.lineTo(xAt(0), box.y + box.h);
  ctx.closePath();
  ctx.fillStyle = (options.color || '#0f766e') + '22';
  ctx.fill();
  // Garis utama.
  ctx.beginPath();
  series.forEach((p, i) => {
    if (i === 0) ctx.moveTo(xAt(i), yAt(p.value));
    else ctx.lineTo(xAt(i), yAt(p.value));
  });
  ctx.strokeStyle = options.color || '#0f766e';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.stroke();
  // Titik dan label nilai.
  ctx.font = 'bold 12px system-ui, sans-serif';
  series.forEach((p, i) => {
    const x = xAt(i);
    const y = yAt(p.value);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = options.color || '#0f766e';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.fillText(formatNumber(p.value, options.decimals == null ? 1 : options.decimals), x, y - 10);
  });
}

function drawBarChart(canvas, items, opts) {
  const options = opts || {};
  const { ctx, width, height } = setupCanvas(canvas);
  ctx.clearRect(0, 0, width, height);
  const values = items.map((p) => p.value);
  const max = Math.max.apply(null, values) * 1.15;
  const min = Math.min(0, Math.min.apply(null, values) * 1.15);
  const box = { x: 52, y: 28, w: width - 72, h: height - 62 };
  drawAxes(ctx, box, items.map((p) => p.label), min, max, options.unit || '');
  const slot = box.w / items.length;
  const barW = Math.min(64, slot * 0.62);
  ctx.font = 'bold 12px system-ui, sans-serif';
  items.forEach((item, i) => {
    const x = box.x + slot * i + (slot - barW) / 2;
    const zeroY = box.y + box.h - ((0 - min) / (max - min)) * box.h;
    const y = box.y + box.h - ((item.value - min) / (max - min)) * box.h;
    const top = Math.min(y, zeroY);
    const h = Math.abs(zeroY - y);
    ctx.fillStyle = item.color || options.color || '#0f766e';
    ctx.beginPath();
    ctx.roundRect(x, top, barW, Math.max(h, 2), [4, 4, 0, 0]);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.fillText(
      formatNumber(item.value, options.decimals == null ? 1 : options.decimals),
      x + barW / 2,
      top - 6,
    );
  });
}
