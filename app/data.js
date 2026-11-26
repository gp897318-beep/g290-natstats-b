// DataNusa — data statistik Indonesia.
// Semua angka berasal dari publikasi Badan Pusat Statistik (BPS).
// Setiap indikator mencantumkan sumber dan tahun rilisnya di layar.
// Tahun acuan utama: 2024 (angka terbaru yang dirilis BPS saat situs ini dibuat).

const DATA_YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

// value: angka; note: catatan singkat tentang angka itu.
const INDICATORS = [
  {
    id: 'penduduk',
    name: 'Penduduk',
    short: 'Penduduk',
    unit: 'juta jiwa',
    format: 'jt',
    decimals: 1,
    color: '#0f766e',
    source: 'BPS — Proyeksi Penduduk Indonesia 2020–2050 & Sensus Penduduk 2020',
    sourceYear: 2024,
    blurb:
      'Indonesia adalah negara berpenduduk terbesar keempat di dunia. Jumlah penduduk terus tumbuh, tetapi laju pertumbuhannya melambat: dari 1,25% per tahun pada 2019 menjadi 1,04% pada 2024.',
    series: [
      { year: 2019, value: 268.1 },
      { year: 2020, value: 270.2 },
      { year: 2021, value: 272.7 },
      { year: 2022, value: 275.8 },
      { year: 2023, value: 278.7 },
      { year: 2024, value: 281.6 },
    ],
    facts: [
      { label: 'Laju tumbuh 2024', value: '1,04% per tahun' },
      { label: 'Penduduk terbanyak', value: 'Jawa Barat — 50,35 juta jiwa' },
      { label: 'Peringkat dunia', value: 'ke-4 terbanyak di dunia' },
    ],
  },
  {
    id: 'pdb',
    name: 'PDB & Pertumbuhan Ekonomi',
    short: 'PDB',
    unit: '% per tahun',
    format: 'pct',
    decimals: 2,
    color: '#c2410c',
    source: 'BPS — Berita Resmi Statistik, 5 Februari 2025',
    sourceYear: 2024,
    blurb:
      'Perekonomian Indonesia tumbuh 5,03% pada 2024, dengan PDB atas dasar harga berlaku Rp22.139,0 triliun dan PDB per kapita Rp78,62 juta. Konsumsi rumah tangga tetap menjadi penopang utama, tumbuh 4,94% sepanjang tahun.',
    series: [
      { year: 2019, value: 5.02 },
      { year: 2020, value: -2.07 },
      { year: 2021, value: 3.7 },
      { year: 2022, value: 5.31 },
      { year: 2023, value: 5.05 },
      { year: 2024, value: 5.03 },
    ],
    facts: [
      { label: 'PDB nominal 2024', value: 'Rp22.139,0 triliun' },
      { label: 'PDB per kapita 2024', value: 'Rp78,62 juta' },
      { label: 'Konsumsi rumah tangga', value: 'tumbuh 4,94% (2024)' },
    ],
  },
  {
    id: 'inflasi',
    name: 'Inflasi',
    short: 'Inflasi',
    unit: '% (y-on-y)',
    format: 'pct',
    decimals: 2,
    color: '#b45309',
    source: 'BPS — Berita Resmi Statistik, 2 Januari 2025',
    sourceYear: 2024,
    blurb:
      'Inflasi tahun kalender 2024 tercatat 1,57% (year-on-year Desember 2024), terendah dalam enam tahun terakhir dan berada di bawah sasaran Bank Indonesia 2,5% ± 1%. Lonjakan 2022 (5,51%) dipicu penyesuaian harga BBM bersubsidi.',
    series: [
      { year: 2019, value: 2.72 },
      { year: 2020, value: 1.68 },
      { year: 2021, value: 1.87 },
      { year: 2022, value: 5.51 },
      { year: 2023, value: 2.61 },
      { year: 2024, value: 1.57 },
    ],
    facts: [
      { label: 'Sasaran Bank Indonesia', value: '2,5% ± 1%' },
      { label: 'Inflasi tertinggi 6 tahun', value: '5,51% pada 2022' },
      { label: 'Inflasi inti 2024', value: 'terkendali di bawah 2,5%' },
    ],
  },
  {
    id: 'pengangguran',
    name: 'Pengangguran Terbuka',
    short: 'Pengangguran',
    unit: '% angkatan kerja',
    format: 'pct',
    decimals: 2,
    color: '#9d174d',
    source: 'BPS — Survei Angkatan Kerja Nasional (Sakernas), Agustus 2024',
    sourceYear: 2024,
    blurb:
      'Tingkat Pengangguran Terbuka (TPT) Agustus 2024 turun menjadi 4,91%, terendah sejak 2019. Jumlah penganggur 7,47 juta orang, berkurang 0,39 juta dibanding Agustus 2023, sementara penduduk bekerja bertambah 4,79 juta menjadi 144,64 juta orang.',
    series: [
      { year: 2019, value: 5.28 },
      { year: 2020, value: 7.07 },
      { year: 2021, value: 6.49 },
      { year: 2022, value: 5.86 },
      { year: 2023, value: 5.32 },
      { year: 2024, value: 4.91 },
    ],
    facts: [
      { label: 'Jumlah penganggur', value: '7,47 juta orang (Agu 2024)' },
      { label: 'Penduduk bekerja', value: '144,64 juta orang' },
      { label: 'Pekerja informal', value: '57,95% dari pekerja' },
    ],
  },
  {
    id: 'kemiskinan',
    name: 'Kemiskinan',
    short: 'Kemiskinan',
    unit: '% penduduk',
    format: 'pct',
    decimals: 2,
    color: '#1d4ed8',
    source: 'BPS — Profil Kemiskinan, Susenas September 2024 (rilis 15 Januari 2025)',
    sourceYear: 2024,
    blurb:
      'Persentase penduduk miskin September 2024 turun menjadi 8,57% — 24,06 juta orang — terendah sepanjang sejarah pencatatan BPS. Garis kemiskinan nasional Rp595.242 per kapita per bulan. Ketimpangan pengeluaran (Rasio Gini) Maret 2024 tercatat 0,379.',
    series: [
      { year: 2019, value: 9.22 },
      { year: 2020, value: 10.19 },
      { year: 2021, value: 9.71 },
      { year: 2022, value: 9.57 },
      { year: 2023, value: 9.36 },
      { year: 2024, value: 8.57 },
    ],
    facts: [
      { label: 'Jumlah penduduk miskin', value: '24,06 juta orang (Sep 2024)' },
      { label: 'Garis kemiskinan', value: 'Rp595.242/kapita/bulan' },
      { label: 'Rasio Gini', value: '0,379 (Maret 2024)' },
    ],
  },
  {
    id: 'ipm',
    name: 'Indeks Pembangunan Manusia',
    short: 'IPM',
    unit: 'skala 0–100',
    format: 'num',
    decimals: 2,
    color: '#15803d',
    source: 'BPS — Berita Resmi Statistik IPM, 15 November 2024',
    sourceYear: 2024,
    blurb:
      'IPM Indonesia 2024 mencapai 75,02 (kategori tinggi), naik 0,63 poin dari 74,39 pada 2023. Seluruh dimensi naik: umur harapan hidup 74,15 tahun, harapan lama sekolah 13,21 tahun, rata-rata lama sekolah 8,85 tahun, dan pengeluaran riil per kapita Rp12,34 juta per tahun.',
    series: [
      { year: 2019, value: 71.92 },
      { year: 2020, value: 72.81 },
      { year: 2021, value: 73.29 },
      { year: 2022, value: 73.77 },
      { year: 2023, value: 74.39 },
      { year: 2024, value: 75.02 },
    ],
    facts: [
      { label: 'Umur harapan hidup', value: '74,15 tahun (2024)' },
      { label: 'Harapan lama sekolah', value: '13,21 tahun (2024)' },
      { label: 'Rata-rata lama sekolah', value: '8,85 tahun (2024)' },
    ],
  },
];

// Provinsi: penduduk pertengahan 2024 (proyeksi BPS, juta jiwa) dan
// persentase penduduk miskin September 2024 (BPS, Susenas).
const PROVINCES = [
  { name: 'Jawa Barat', island: 'Jawa', pop: 50.35, poverty: 7.08 },
  { name: 'Jawa Timur', island: 'Jawa', pop: 41.81, poverty: 9.56 },
  { name: 'Jawa Tengah', island: 'Jawa', pop: 37.89, poverty: 9.58 },
  { name: 'Sumatera Utara', island: 'Sumatera', pop: 16.18, poverty: 7.19 },
  { name: 'Banten', island: 'Jawa', pop: 12.43, poverty: 5.7 },
  { name: 'DKI Jakarta', island: 'Jawa', pop: 10.68, poverty: 4.14 },
  { name: 'Sulawesi Selatan', island: 'Sulawesi', pop: 9.46, poverty: 7.77 },
  { name: 'Lampung', island: 'Sumatera', pop: 9.32, poverty: 10.62 },
  { name: 'Sumatera Selatan', island: 'Sumatera', pop: 8.99, poverty: 10.51 },
  { name: 'Riau', island: 'Sumatera', pop: 7.2, poverty: 6.36 },
  { name: 'Sumatera Barat', island: 'Sumatera', pop: 6.06, poverty: 5.42 },
  { name: 'Kalimantan Barat', island: 'Kalimantan', pop: 5.88, poverty: 6.25 },
  { name: 'Nusa Tenggara Timur', island: 'Nusa Tenggara', pop: 5.66, poverty: 19.02 },
  { name: 'Aceh', island: 'Sumatera', pop: 5.55, poverty: 12.64 },
  { name: 'Kalimantan Selatan', island: 'Kalimantan', pop: 4.3, poverty: 4.02 },
  { name: 'Bali', island: 'Nusa Tenggara', pop: 4.41, poverty: 3.8 },
  { name: 'Papua Pegunungan', island: 'Papua', pop: 1.47, poverty: 29.66 },
  { name: 'Papua Tengah', island: 'Papua', pop: 1.4, poverty: 27.6 },
];

function indicatorById(id) {
  return INDICATORS.find((item) => item.id === id) || INDICATORS[0];
}

function valueAt(indicator, year) {
  const point = indicator.series.find((item) => item.year === year);
  return point ? point.value : null;
}

function latestValue(indicator) {
  return indicator.series[indicator.series.length - 1];
}

function formatNumber(value, decimals) {
  return value.toLocaleString('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatIndicatorValue(indicator, value) {
  if (indicator.format === 'pct') return formatNumber(value, indicator.decimals) + '%';
  if (indicator.format === 'jt') return formatNumber(value, indicator.decimals) + ' jt';
  return formatNumber(value, indicator.decimals);
}
