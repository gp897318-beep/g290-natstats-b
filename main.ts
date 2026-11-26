// DataNusa — program penyerahan entri (Node 22, pustaka standar saja).
//
// Situsnya adalah berkas statis di app/ (index.html, style.css, dan
// modul JavaScript-nya sendiri, tanpa build step dan tanpa permintaan
// jaringan). Program ini menyerahkan situs itu: menyalin app/ dan
// screenshots/ dari repositori ini ke /output, lalu menulis
// /output/dossier.json memakai buildDossier dari pustaka make.fun
// yang divendor di vendor/makefun-frontend.ts (jangan diubah: penilai
// membangun ulang dossier dengan salinan yang sama dan membandingkan
// byte demi byte).
//
// Di luar grader, MAKEFUN_OUTPUT_DIR menggantikan /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// Batas penilai (lihat reference/gate.json di kit): hanya text_max_bytes
// yang membentuk isi dossier; batas lainnya menolak entri yang memang
// akan ditolak penilai (lebih dari 4 screenshot atau satu di atas
// 256 KiB; lebih dari 993 berkas/direktori di app/ atau 16 MiB berkas
// app/ — app/ berbagi batas 1000 entri /output dengan screenshots/
// dan dossier.json). buildDossier deterministik: dua kali jalan
// menghasilkan byte yang sama, selama berkas sumbernya tidak berubah.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
