// DataNusa — tampilan halaman (views).
// Setiap view mengembalikan HTML dan memasang grafik kanvasnya sendiri.

let dashYear = 2024;
let dashIndicator = 'pdb';
let dashChartType = 'line';

function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function kpiCard(indicator, year) {
  const latest = latestValue(indicator);
  const value = valueAt(indicator, year);
  const prev = valueAt(indicator, year - 1);
  let delta = '';
  if (value != null && prev != null) {
    const diff = value - prev;
    const sign = diff > 0 ? '+' : diff < 0 ? '−' : '';
    const arrow = diff > 0 ? '▲' : diff < 0 ? '▼' : '—';
    delta =
      '<span class="delta">' +
      arrow +
      ' ' +
      sign +
      formatNumber(Math.abs(diff), indicator.decimals) +
      ' dari ' +
      (year - 1) +
      '</span>';
  }
  return (
    '<a class="kpi" href="#/indikator/' +
    indicator.id +
    '" style="--kpi:' +
    indicator.color +
    '">' +
    '<span class="kpi-label">' +
    esc(indicator.name) +
    '</span>' +
    '<span class="kpi-value">' +
    formatIndicatorValue(indicator, value != null ? value : latest.value) +
    '</span>' +
    '<span class="kpi-unit">' +
    esc(indicator.unit) +
    ' · ' +
    (value != null ? year : latest.year) +
    '</span>' +
    delta +
    '</a>'
  );
}

function renderDashboard() {
  const featured = indicatorById(dashIndicator);
  const yearOptions = DATA_YEARS.map(
    (y) => '<option value="' + y + '"' + (y === dashYear ? ' selected' : '') + '>' + y + '</option>',
  ).join('');
  const indOptions = INDICATORS.map(
    (ind) =>
      '<option value="' +
      ind.id +
      '"' +
      (ind.id === dashIndicator ? ' selected' : '') +
      '>' +
      esc(ind.name) +
      '</option>',
  ).join('');
  const cards = INDICATORS.map((ind) => kpiCard(ind, dashYear)).join('');
  const poorest = PROVINCES.slice().sort((a, b) => b.poverty - a.poverty).slice(0, 5);
  const poorRows = poorest
    .map(
      (p, i) =>
        '<tr><td>' +
        (i + 1) +
        '</td><td>' +
        esc(p.name) +
        '</td><td>' +
        esc(p.island) +
        '</td><td class="num">' +
        formatNumber(p.poverty, 2) +
        '%</td></tr>',
    )
    .join('');
  return (
    '<section class="hero">' +
    '<div><p class="eyebrow">Statistik resmi Indonesia · Data BPS</p>' +
    '<h1>Angka Indonesia,<br>dalam satu dasbor.</h1>' +
    '<p class="lede">Enam indikator utama pembangunan — penduduk, ekonomi, harga, pekerjaan, kemiskinan, dan kualitas hidup — dengan angka asli Badan Pusat Statistik, lengkap dengan sumber dan tahunnya.</p>' +
    '<div class="hero-actions"><a class="btn primary" href="#/banding">Bandingkan provinsi</a>' +
    '<a class="btn" href="#/sumber">Lihat sumber data</a></div></div>' +
    '<div class="hero-fact"><span class="hero-fact-num">281,6 jt</span><span>penduduk Indonesia 2024 — negara ke-4 terbanyak di dunia. Sumber: BPS, Proyeksi Penduduk 2020–2050.</span></div>' +
    '</section>' +
    '<section class="controls card">' +
    '<label>Tahun data <select id="dash-year" aria-label="Pilih tahun">' +
    yearOptions +
    '</select></label>' +
    '<label>Indikator unggulan <select id="dash-indicator" aria-label="Pilih indikator">' +
    indOptions +
    '</select></label>' +
    '<span class="controls-note">Kartu di bawah mengikuti tahun yang dipilih.</span>' +
    '</section>' +
    '<section class="kpi-grid">' +
    cards +
    '</section>' +
    '<section class="grid-2">' +
    '<article class="card chart-card">' +
    '<div class="card-head"><h2>' +
    esc(featured.name) +
    ' 2019–2024</h2>' +
    '<div class="seg" role="group" aria-label="Jenis grafik">' +
    '<button type="button" data-chart="line"' +
    (dashChartType === 'line' ? ' class="active" aria-pressed="true"' : '') +
    '>Garis</button>' +
    '<button type="button" data-chart="bar"' +
    (dashChartType === 'bar' ? ' class="active" aria-pressed="true"' : '') +
    '>Batang</button>' +
    '</div></div>' +
    '<canvas id="dash-chart" height="260" aria-label="Grafik ' +
    esc(featured.name) +
    '"></canvas>' +
    '<p class="source">Sumber: ' +
    esc(featured.source) +
    ' (' +
    featured.sourceYear +
    ').</p>' +
    '<a class="more" href="#/indikator/' +
    featured.id +
    '">Buka halaman ' +
    esc(featured.short) +
    ' →</a>' +
    '</article>' +
    '<article class="card">' +
    '<div class="card-head"><h2>Kemiskinan tertinggi antarprovinsi</h2></div>' +
    '<table class="mini-table"><thead><tr><th>#</th><th>Provinsi</th><th>Pulau</th><th class="num">Miskin (%)</th></tr></thead>' +
    '<tbody>' +
    poorRows +
    '</tbody></table>' +
    '<p class="source">Persentase penduduk miskin, September 2024. Sumber: BPS, Susenas.</p>' +
    '<a class="more" href="#/provinsi">Lihat semua provinsi →</a>' +
    '</article>' +
    '</section>' +
    '<section class="card strip">' +
    '<h2>Jelajahi indikator</h2>' +
    '<div class="chip-row">' +
    INDICATORS.map(
      (ind) =>
        '<a class="chip" href="#/indikator/' +
        ind.id +
        '" style="--kpi:' +
        ind.color +
        '">' +
        esc(ind.short) +
        '</a>',
    ).join('') +
    '</div></section>'
  );
}

function mountDashboard() {
  const chart = document.getElementById('dash-chart');
  const featured = indicatorById(dashIndicator);
  if (chart) {
    if (dashChartType === 'bar') {
      drawBarChart(
        chart,
        featured.series.map((p) => ({ label: p.year, value: p.value, color: featured.color })),
        { unit: featured.unit, decimals: featured.decimals },
      );
    } else {
      drawLineChart(chart, featured.series, {
        unit: featured.unit,
        color: featured.color,
        decimals: featured.decimals,
      });
    }
  }
  const yearSel = document.getElementById('dash-year');
  if (yearSel) yearSel.addEventListener('change', () => {
    dashYear = Number(yearSel.value);
    render();
  });
  const indSel = document.getElementById('dash-indicator');
  if (indSel) indSel.addEventListener('change', () => {
    dashIndicator = indSel.value;
    render();
  });
  document.querySelectorAll('[data-chart]').forEach((btn) => {
    btn.addEventListener('click', () => {
      dashChartType = btn.getAttribute('data-chart');
      render();
    });
  });
}

let detailTab = 'chart';

function renderIndicator(id) {
  const ind = indicatorById(id);
  const latest = latestValue(ind);
  const first = ind.series[0];
  const change = latest.value - first.value;
  const changeText =
    (change >= 0 ? '+' : '−') + formatNumber(Math.abs(change), ind.decimals) + ' poin';
  const rows = ind.series
    .slice()
    .reverse()
    .map((p) => {
      const prev = valueAt(ind, p.year - 1);
      const d = prev == null ? '—' : (p.value - prev >= 0 ? '+' : '−') + formatNumber(Math.abs(p.value - prev), ind.decimals);
      return (
        '<tr><td>' +
        p.year +
        '</td><td class="num">' +
        formatIndicatorValue(ind, p.value) +
        '</td><td class="num">' +
        d +
        '</td></tr>'
      );
    })
    .join('');
  const factCards = ind.facts
    .map(
      (f) =>
        '<div class="fact"><span class="fact-label">' +
        esc(f.label) +
        '</span><span class="fact-value">' +
        esc(f.value) +
        '</span></div>',
    )
    .join('');
  return (
    '<nav class="crumbs"><a href="#/">Dasbor</a> / <a href="#/indikator">Indikator</a> / ' +
    esc(ind.name) +
    '</nav>' +
    '<header class="page-head" style="--kpi:' +
    ind.color +
    '">' +
    '<h1>' +
    esc(ind.name) +
    '</h1>' +
    '<p class="lede">' +
    esc(ind.blurb) +
    '</p>' +
    '<p class="source">Sumber: ' +
    esc(ind.source) +
    ' (' +
    ind.sourceYear +
    '). Semua angka pada halaman ini berasal dari sumber tersebut.</p>' +
    '</header>' +
    '<section class="kpi-grid three">' +
    '<div class="kpi static"><span class="kpi-label">Nilai terbaru</span><span class="kpi-value">' +
    formatIndicatorValue(ind, latest.value) +
    '</span><span class="kpi-unit">' +
    esc(ind.unit) +
    ' · ' +
    latest.year +
    '</span></div>' +
    '<div class="kpi static"><span class="kpi-label">Perubahan 2019–' +
    latest.year +
    '</span><span class="kpi-value">' +
    esc(changeText) +
    '</span><span class="kpi-unit">dari ' +
    formatIndicatorValue(ind, first.value) +
    ' pada ' +
    first.year +
    '</span></div>' +
    '<div class="kpi static"><span class="kpi-label">Cakupan data</span><span class="kpi-value">2019–' +
    latest.year +
    '</span><span class="kpi-unit">' +
    ind.series.length +
    ' tahun pengamatan</span></div>' +
    '</section>' +
    '<section class="card chart-card">' +
    '<div class="card-head"><h2>Tren ' +
    esc(ind.short) +
    ' 2019–' +
    latest.year +
    '</h2>' +
    '<div class="seg" role="group" aria-label="Tampilan data">' +
    '<button type="button" data-tab="chart"' +
    (detailTab === 'chart' ? ' class="active" aria-pressed="true"' : '') +
    '>Grafik</button>' +
    '<button type="button" data-tab="table"' +
    (detailTab === 'table' ? ' class="active" aria-pressed="true"' : '') +
    '>Tabel</button>' +
    '</div></div>' +
    (detailTab === 'chart'
      ? '<canvas id="detail-chart" height="300" aria-label="Grafik ' + esc(ind.name) + '"></canvas>'
      : '<table class="data-table"><thead><tr><th>Tahun</th><th class="num">Nilai (' +
        esc(ind.unit) +
        ')</th><th class="num">Perubahan</th></tr></thead><tbody>' +
        rows +
        '</tbody></table>') +
    '<p class="source">Sumber: ' +
    esc(ind.source) +
    ' (' +
    ind.sourceYear +
    ').</p>' +
    '</section>' +
    '<section class="grid-2"><article class="card"><div class="card-head"><h2>Yang perlu diketahui</h2></div><div class="fact-grid">' +
    factCards +
    '</div></article>' +
    '<article class="card"><div class="card-head"><h2>Indikator lain</h2></div><ul class="link-list">' +
    INDICATORS.filter((o) => o.id !== ind.id)
      .map(
        (o) =>
          '<li><a href="#/indikator/' +
          o.id +
          '">' +
          esc(o.name) +
          ' — <strong>' +
          formatIndicatorValue(o, latestValue(o).value) +
          '</strong> (' +
          latestValue(o).year +
          ')</a></li>',
      )
      .join('') +
    '</ul></article></section>'
  );
}

function mountIndicator(id) {
  const ind = indicatorById(id);
  const chart = document.getElementById('detail-chart');
  if (chart) {
    drawLineChart(chart, ind.series, {
      unit: ind.unit,
      color: ind.color,
      decimals: ind.decimals,
    });
  }
  document.querySelectorAll('[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      detailTab = btn.getAttribute('data-tab');
      render();
    });
  });
}

let comparePicked = ['Jawa Barat', 'Jawa Timur', 'DKI Jakarta', 'Papua Pegunungan'];
let compareMetric = 'pop';

function renderCompare() {
  const metricLabel = compareMetric === 'pop' ? 'Penduduk (juta jiwa, 2024)' : 'Penduduk miskin (%, Sep 2024)';
  const boxes = PROVINCES.map((p) => {
    const checked = comparePicked.indexOf(p.name) >= 0;
    return (
      '<label class="pick"><input type="checkbox" value="' +
      esc(p.name) +
      '"' +
      (checked ? ' checked' : '') +
      '> ' +
      esc(p.name) +
      '</label>'
    );
  }).join('');
  const picked = PROVINCES.filter((p) => comparePicked.indexOf(p.name) >= 0);
  const rows = picked
    .map(
      (p) =>
        '<tr><td>' +
        esc(p.name) +
        '</td><td>' +
        esc(p.island) +
        '</td><td class="num">' +
        formatNumber(p.pop, 2) +
        '</td><td class="num">' +
        formatNumber(p.poverty, 2) +
        '%</td></tr>',
    )
    .join('');
  return (
    '<nav class="crumbs"><a href="#/">Dasbor</a> / Banding Provinsi</nav>' +
    '<header class="page-head"><h1>Bandingkan provinsi</h1>' +
    '<p class="lede">Pilih sampai empat provinsi, lalu bandingkan jumlah penduduk dan tingkat kemiskinannya. Angka penduduk dari proyeksi BPS 2024; angka kemiskinan dari Susenas September 2024.</p></header>' +
    '<section class="card"><div class="card-head"><h2>Pilih provinsi (maks. 4)</h2>' +
    '<span class="controls-note" id="compare-count">' +
    picked.length +
    ' dipilih</span></div>' +
    '<div class="pick-grid">' +
    boxes +
    '</div></section>' +
    '<section class="card chart-card"><div class="card-head"><h2>' +
    esc(metricLabel) +
    '</h2>' +
    '<div class="seg" role="group" aria-label="Metrik perbandingan">' +
    '<button type="button" data-metric="pop"' +
    (compareMetric === 'pop' ? ' class="active" aria-pressed="true"' : '') +
    '>Penduduk</button>' +
    '<button type="button" data-metric="poverty"' +
    (compareMetric === 'poverty' ? ' class="active" aria-pressed="true"' : '') +
    '>Kemiskinan</button>' +
    '</div></div>' +
    '<canvas id="compare-chart" height="300" aria-label="Grafik perbandingan provinsi"></canvas>' +
    '<p class="source">Sumber: BPS — Proyeksi Penduduk 2020–2050 dan Susenas September 2024.</p></section>' +
    '<section class="card"><div class="card-head"><h2>Angka perbandingan</h2></div>' +
    '<table class="data-table"><thead><tr><th>Provinsi</th><th>Pulau</th><th class="num">Penduduk (jt)</th><th class="num">Miskin (%)</th></tr></thead>' +
    '<tbody>' +
    rows +
    '</tbody></table></section>'
  );
}

function mountCompare() {
  const chart = document.getElementById('compare-chart');
  const picked = PROVINCES.filter((p) => comparePicked.indexOf(p.name) >= 0);
  const palette = ['#0f766e', '#c2410c', '#1d4ed8', '#9d174d'];
  const shortName = (name) =>
    ({
      'Jawa Barat': 'Jabar',
      'Jawa Timur': 'Jatim',
      'Jawa Tengah': 'Jateng',
      'Sumatera Utara': 'Sumut',
      'DKI Jakarta': 'DKI',
      'Sulawesi Selatan': 'Sulsel',
      'Sumatera Selatan': 'Sumsel',
      'Sumatera Barat': 'Sumbar',
      'Kalimantan Barat': 'Kalbar',
      'Kalimantan Selatan': 'Kalsel',
      'Nusa Tenggara Timur': 'NTT',
      'Papua Pegunungan': 'Papua Pgn.',
      'Papua Tengah': 'Papua Tgh.',
    })[name] || name;
  if (chart) {
    drawBarChart(
      chart,
      picked.map((p, i) => ({
        label: shortName(p.name),
        value: compareMetric === 'pop' ? p.pop : p.poverty,
        color: palette[i % palette.length],
      })),
      { unit: compareMetric === 'pop' ? 'juta jiwa' : '% penduduk', decimals: compareMetric === 'pop' ? 1 : 2 },
    );
  }
  document.querySelectorAll('.pick input').forEach((box) => {
    box.addEventListener('change', () => {
      const name = box.value;
      if (box.checked) {
        if (comparePicked.length >= 4) {
          box.checked = false;
          alert('Pilih maksimal 4 provinsi untuk dibandingkan.');
          return;
        }
        comparePicked.push(name);
      } else {
        comparePicked = comparePicked.filter((n) => n !== name);
      }
      render();
    });
  });
  document.querySelectorAll('[data-metric]').forEach((btn) => {
    btn.addEventListener('click', () => {
      compareMetric = btn.getAttribute('data-metric');
      render();
    });
  });
}

let provQuery = '';
let provSort = 'pop';
let provDir = -1;

function renderProvinces() {
  let list = PROVINCES.filter(
    (p) =>
      provQuery === '' ||
      p.name.toLowerCase().indexOf(provQuery.toLowerCase()) >= 0 ||
      p.island.toLowerCase().indexOf(provQuery.toLowerCase()) >= 0,
  );
  list = list.slice().sort((a, b) => {
    if (provSort === 'name') return provDir * a.name.localeCompare(b.name, 'id');
    if (provSort === 'island') return provDir * a.island.localeCompare(b.island, 'id');
    return provDir * (a[provSort] - b[provSort]);
  });
  const arrow = (key) => (provSort === key ? (provDir === 1 ? ' ▲' : ' ▼') : '');
  const rows = list
    .map(
      (p) =>
        '<tr><td>' +
        esc(p.name) +
        '</td><td>' +
        esc(p.island) +
        '</td><td class="num">' +
        formatNumber(p.pop, 2) +
        '</td><td class="num">' +
        formatNumber(p.poverty, 2) +
        '%</td></tr>',
    )
    .join('');
  return (
    '<nav class="crumbs"><a href="#/">Dasbor</a> / Provinsi</nav>' +
    '<header class="page-head"><h1>Provinsi</h1>' +
    '<p class="lede">Delapan belas provinsi yang terwakili di DataNusa, diurutkan dan dicari sesuka Anda. Klik judul kolom untuk mengurutkan; ketik di kotak cari untuk menyaring.</p></header>' +
    '<section class="card"><div class="card-head"><h2>Semua provinsi</h2>' +
    '<label class="search">Cari <input id="prov-search" type="search" placeholder="Nama provinsi atau pulau…" value="' +
    esc(provQuery) +
    '" aria-label="Cari provinsi"></label></div>' +
    '<table class="data-table sortable"><thead><tr>' +
    '<th><button type="button" data-sort="name">Provinsi' +
    arrow('name') +
    '</button></th>' +
    '<th><button type="button" data-sort="island">Pulau' +
    arrow('island') +
    '</button></th>' +
    '<th class="num"><button type="button" data-sort="pop">Penduduk (jt)' +
    arrow('pop') +
    '</button></th>' +
    '<th class="num"><button type="button" data-sort="poverty">Miskin (%)' +
    arrow('poverty') +
    '</button></th>' +
    '</tr></thead><tbody>' +
    (rows || '<tr><td colspan="4">Tidak ada provinsi yang cocok dengan pencarian.</td></tr>') +
    '</tbody></table>' +
    '<p class="source">Penduduk: proyeksi BPS pertengahan 2024. Kemiskinan: BPS, Susenas September 2024. Menampilkan ' +
    list.length +
    ' dari ' +
    PROVINCES.length +
    ' provinsi.</p></section>'
  );
}

function mountProvinces() {
  const input = document.getElementById('prov-search');
  if (input) {
    input.addEventListener('input', () => {
      provQuery = input.value;
      const pos = input.selectionStart;
      render();
      const again = document.getElementById('prov-search');
      if (again) {
        again.focus();
        again.setSelectionRange(pos, pos);
      }
    });
  }
  document.querySelectorAll('[data-sort]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-sort');
      if (provSort === key) provDir = -provDir;
      else {
        provSort = key;
        provDir = key === 'name' || key === 'island' ? 1 : -1;
      }
      render();
    });
  });
}

function renderSources() {
  const items = INDICATORS.map(
    (ind) =>
      '<article class="source-item"><h3>' +
      esc(ind.name) +
      '</h3><p>' +
      esc(ind.source) +
      '</p><p class="source">Tahun data: ' +
      ind.series[0].year +
      '–' +
      latestValue(ind).year +
      ' · Rilis ' +
      ind.sourceYear +
      '</p></article>',
  ).join('');
  return (
    '<nav class="crumbs"><a href="#/">Dasbor</a> / Sumber Data</nav>' +
    '<header class="page-head"><h1>Sumber data</h1>' +
    '<p class="lede">Setiap angka di DataNusa berasal dari publikasi resmi Badan Pusat Statistik (BPS). Tidak ada angka karangan: di bawah ini sumber tiap indikator, beserta tahun rilisnya.</p></header>' +
    '<section class="source-list">' +
    items +
    '<article class="source-item"><h3>Data provinsi</h3><p>BPS — Proyeksi Penduduk Indonesia 2020–2050 (penduduk pertengahan 2024) dan Survei Sosial Ekonomi Nasional (Susenas) September 2024 (kemiskinan per provinsi).</p><p class="source">Tahun data: 2024 · Rilis 2024–2025</p></article>' +
    '</section>' +
    '<section class="card"><div class="card-head"><h2>Catatan metodologi</h2></div>' +
    '<ul class="notes">' +
    '<li>Angka penduduk 2024 adalah proyeksi pertengahan tahun dari Sensus Penduduk 2020.</li>' +
    '<li>Inflasi memakai angka tahun kalender (year-on-year Desember).</li>' +
    '<li>Tingkat pengangguran memakai Sakernas Agustus setiap tahun.</li>' +
    '<li>Kemiskinan memakai Susenas September setiap tahun; garis kemiskinan nasional September 2024 adalah Rp595.242 per kapita per bulan.</li>' +
    '<li>IPM memakai metode BPS yang berlaku sejak 2020; angka 2019 memakai seri lama yang dipublikasikan BPS.</li>' +
    '</ul></section>'
  );
}

function renderAbout() {
  return (
    '<nav class="crumbs"><a href="#/">Dasbor</a> / Tentang</nav>' +
    '<header class="page-head"><h1>Tentang DataNusa</h1>' +
    '<p class="lede">DataNusa adalah penjelajah data statistik Indonesia yang dibuat mandiri: desain, teks, dan grafiknya ditulis dari nol untuk situs ini. Tujuannya sederhana — siapa pun bisa menemukan angka resmi Indonesia dengan cepat, lengkap dengan sumber dan tahunnya.</p></header>' +
    '<section class="grid-2"><article class="card"><div class="card-head"><h2>Yang bisa dilakukan di sini</h2></div>' +
    '<ul class="notes"><li>Dasbor: enam indikator utama dengan pilihan tahun dan jenis grafik.</li>' +
    '<li>Halaman indikator: tren 2019–2024 sebagai grafik atau tabel, plus fakta kunci.</li>' +
    '<li>Banding provinsi: sampai empat provinsi dalam satu grafik batang.</li>' +
    '<li>Daftar provinsi: cari dan urutkan menurut penduduk atau kemiskinan.</li>' +
    '<li>Sumber data: asal tiap angka, lengkap dengan tahun rilis BPS.</li></ul></article>' +
    '<article class="card"><div class="card-head"><h2>Prinsip situs ini</h2></div>' +
    '<ul class="notes"><li>Angka asli saja — setiap angka mencantumkan sumber dan tahun.</li>' +
    '<li>Tanpa jaringan — seluruh situs berjalan dari berkasnya sendiri.</li>' +
    '<li>Berfungsi di desktop dan di ponsel.</li>' +
    '<li>Setiap tombol dan pilihan benar-benar mengubah tampilan.</li></ul></article></section>'
  );
}

function renderIndicatorsIndex() {
  return (
    '<nav class="crumbs"><a href="#/">Dasbor</a> / Indikator</nav>' +
    '<header class="page-head"><h1>Semua indikator</h1>' +
    '<p class="lede">Enam indikator utama Indonesia, 2019–2024, dari publikasi resmi BPS.</p></header>' +
    '<section class="kpi-grid">' +
    INDICATORS.map((ind) => kpiCard(ind, 2024)).join('') +
    '</section>'
  );
}
