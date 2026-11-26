# DataNusa — Statistik Indonesia

[![Situs](https://img.shields.io/badge/situs-statis%20offline-brightgreen)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Data](https://img.shields.io/badge/data-BPS%202024-blue)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Lisensi](https://img.shields.io/badge/lisensi-MIT-orange)](LICENSE)

DataNusa adalah penjelajah statistik Indonesia: dasbor interaktif dengan enam
indikator utama — penduduk, PDB & pertumbuhan ekonomi, inflasi, pengangguran
terbuka, kemiskinan, dan Indeks Pembangunan Manusia — lengkap dengan halaman
detail per indikator, perbandingan antarprovinsi, dan daftar provinsi yang bisa
dicari dan diurutkan.

## Angka asli, sumber jelas

Setiap angka berasal dari publikasi resmi **Badan Pusat Statistik (BPS)** dan
mencantumkan sumber beserta tahunnya di layar:

- Penduduk 2024: **281,6 juta jiwa** — BPS, Proyeksi Penduduk 2020–2050
- Pertumbuhan ekonomi 2024: **5,03%**, PDB Rp22.139,0 triliun — BPS, 5 Feb 2025
- Inflasi 2024: **1,57%** — BPS, 2 Jan 2025
- Pengangguran terbuka Agustus 2024: **4,91%** — BPS, Sakernas
- Penduduk miskin September 2024: **8,57%** (24,06 juta orang) — BPS, Susenas
- IPM 2024: **75,02** — BPS, 15 Nov 2024

## Fitur

- **Dasbor**: kartu KPI enam indikator dengan pemilih tahun (2019–2024),
  pemilih indikator unggulan, dan grafik garis/batang yang digambar sendiri
  di kanvas — tanpa pustaka luar.
- **Halaman indikator**: tren 2019–2024 sebagai grafik atau tabel, fakta kunci,
  dan tautan ke indikator lain.
- **Banding provinsi**: pilih sampai 4 provinsi, bandingkan penduduk dan
  kemiskinan dalam grafik batang dan tabel.
- **Daftar provinsi**: cari berdasarkan nama/pulau, urutkan dengan mengklik
  judul kolom.
- **Sumber data & metodologi**: asal tiap angka, lengkap dengan tahun rilis.
- Berfungsi di desktop dan ponsel; seluruh situs berjalan dari berkasnya
  sendiri tanpa permintaan jaringan.

## Menjalankan

Buka `app/index.html` langsung di peramban, atau layani `app/` dengan server
statis apa pun:

```sh
node serve.mjs   # melayani app/ di http://localhost:8080
```

## Penyerahan

Entri untuk kompetisi [Make the best national statistics site](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
di make.fun. `main.ts` menyalin `app/` dan `screenshots/` ke `/output` dan
menulis `dossier.json` dengan pustaka make.fun yang divendor:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Lisensi

MIT — lihat [LICENSE](LICENSE).
