// Télécharge toutes les images encore hébergées sur imgbb / pexels,
// les compresse (WebP + JPEG Open Graph) et les écrit dans supabase/media/.
// Ces fichiers sont ensuite envoyés dans le bucket Supabase par scripts/upload-media.mjs.
//
// Usage : npm run media:migrate
import sharp from 'sharp';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'supabase', 'media');

/** Préréglages de compression */
const presets = {
  // Photos affichées dans le contenu ou la galerie
  photo: (img) => img.rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).webp({ quality: 78, effort: 6 }),
  // Portraits de l'équipe
  portrait: (img) => img.rotate().resize({ width: 800, height: 1000, fit: 'inside', withoutEnlargement: true }).webp({ quality: 80, effort: 6 }),
  // Logos / emblèmes (transparence conservée)
  logo: (img) => img.resize({ width: 512, height: 512, fit: 'inside', withoutEnlargement: true }).webp({ quality: 90, alphaQuality: 100, effort: 6 }),
  // Image de partage (Facebook, WhatsApp, X, LinkedIn) : 1200x630, JPEG pour une compatibilité maximale
  og: (img) => img.rotate().resize({ width: 1200, height: 630, fit: 'cover', position: 'attention' }).jpeg({ quality: 80, mozjpeg: true }),
  // Favicon PNG
  favicon: (img) => img.resize({ width: 192, height: 192, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ compressionLevel: 9 }),
};

const LOGO = 'https://i.ibb.co/5gCvZcKM/Logo.png';

/** [url source, chemin cible (bucket media), préréglage] */
const jobs = [
  // Identité
  [LOGO, 'brand/logo.webp', 'logo'],
  [LOGO, 'brand/logo-og.jpg', 'og'],
  ['https://i.ibb.co/RWPHrYS/rdc-flag.png', 'brand/rdc-flag.webp', 'logo'],
  ['https://i.ibb.co/23Rwc5Hj/armoirie.png', 'brand/armoirie.webp', 'logo'],
  // Sections du site
  ['https://images.pexels.com/photos/9685285/pexels-photo-9685285.jpeg', 'site/hero-justice.webp', 'photo'],
  ['https://i.ibb.co/xSQtN5SZ/IMG-131.jpg', 'site/formation-pole-institute.webp', 'photo'],
  // Équipe
  ['https://i.ibb.co/5xJD99Jh/17.jpg', 'team/mwangilwa-kitungano-gedeon.webp', 'portrait'],
  ['https://i.ibb.co/BVSPJLgv/18.jpg', 'team/balola-mugisho-daniel.webp', 'portrait'],
  ['https://i.ibb.co/s9zQCqbj/16.jpg', 'team/dekens-ruzuba.webp', 'portrait'],
  ['https://i.ibb.co/4ZKVCQDd/14.jpg', 'team/byeka-kipanga-chanceline.webp', 'portrait'],
  ['https://i.ibb.co/PsYjyTpT/13.jpg', 'team/safari-muzero-xavier.webp', 'portrait'],
  ['https://i.ibb.co/BVsfwjtK/6.jpg', 'team/nabintu-bisimwa-clemence.webp', 'portrait'],
  ['https://i.ibb.co/LmSdgZq/15.jpg', 'team/irazika-bamporiki-vertueuse.webp', 'portrait'],
  ['https://i.ibb.co/LdGtgBmv/12.jpg', 'team/miderho-magadju-dieumerci.webp', 'portrait'],
  ['https://i.ibb.co/LDnPtQ1L/11.jpg', 'team/furaha-zirimwagabo-nessia.webp', 'portrait'],
  ['https://i.ibb.co/bgqk2mHD/8.jpg', 'team/habamungu-magendo-augustin.webp', 'portrait'],
  ['https://i.ibb.co/VYF1VDs8/19.jpg', 'team/karisi-kaboyo-benedicte.webp', 'portrait'],
  // Galerie
  ...[
    'https://i.ibb.co/21WwKYxw/IMG-106.jpg',
    'https://i.ibb.co/LDjJBZdK/IMG-146.jpg',
    'https://i.ibb.co/HpLdwmjB/IMG-99.jpg',
    'https://i.ibb.co/mFgStt02/IMG-139.jpg',
    'https://i.ibb.co/FL9hHLzJ/IMG-126.jpg',
    'https://i.ibb.co/Q7FNK3vJ/IMG-33.jpg',
    'https://i.ibb.co/F4FXgDfy/IMG-112.jpg',
    'https://i.ibb.co/wXdQTqt/IMG-12.jpg',
    'https://i.ibb.co/Zz7Fwbtb/IMG-25.jpg',
    'https://i.ibb.co/FLLFfYHH/IMG-8.jpg',
    'https://i.ibb.co/WWVHTzc4/IMG-170.jpg',
  ].map((url) => [url, `gallery/${url.split('/').pop().replace(/\.jpg$/i, '').toLowerCase()}.webp`, 'photo']),
];

// Articles : couverture WebP + image de partage JPEG
const articleCovers = {
  'stop-ebola': 'https://i.ibb.co/FbcW9k1J/stop-ebola.jpg',
  'journee-internationale-des-droits-de-l-homme-2025': 'https://i.ibb.co/Q3bgRjkZ/Publication-instagram-journ-e-internationale-des-droits-des-femmes-photographie-simple-violet-1.jpg',
  'journee-mondiale-du-climat-2025': 'https://i.ibb.co/fw8zJ4R/Vert-Publication-Instagram-Engagement-cologique-Moderne.jpg',
  'sensibilisation-institut-uwezo': 'https://i.ibb.co/21WwKYxw/IMG-106.jpg',
  'l-acces-a-la-justice': 'https://images.pexels.com/photos/6077091/pexels-photo-6077091.jpeg',
  'paix-et-sensibilite-aux-conflits': 'https://images.pexels.com/photos/1835016/pexels-photo-1835016.jpeg',
};
for (const [slug, url] of Object.entries(articleCovers)) {
  jobs.push([url, `articles/${slug}/cover.webp`, 'photo']);
  jobs.push([url, `articles/${slug}/og.jpg`, 'og']);
}

const cache = new Map();
async function download(url) {
  if (!cache.has(url)) {
    cache.set(url, (async () => {
      for (let attempt = 1; ; attempt++) {
        const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (media migration)' } }).catch((e) => ({ ok: false, status: e.message }));
        if (res.ok) return Buffer.from(await res.arrayBuffer());
        if (attempt >= 10) throw new Error(`${res.status} ${url}`);
        await new Promise((r) => setTimeout(r, 1500 * attempt));
      }
    })());
  }
  return cache.get(url);
}

const fmt = (n) => `${(n / 1024).toFixed(0)} Ko`;
let totalIn = 0;
let totalOut = 0;
const seenIn = new Set();

const force = process.argv.includes('--force');
const exists = (f) => stat(f).then(() => true, () => false);

for (const [url, target, preset] of jobs) {
  if (!force && (await exists(join(outDir, target)))) { console.log(`${target.padEnd(62)} déjà migré`); continue; }
  const input = await download(url);
  let output = await presets[preset](sharp(input)).toBuffer();
  if (preset === 'logo' && output.length > input.length) {
    // Petits PNG déjà optimisés : on tente le WebP sans perte
    const lossless = await sharp(input).webp({ lossless: true, effort: 6 }).toBuffer();
    if (lossless.length < output.length) output = lossless;
  }
  const file = join(outDir, target);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, output);
  if (!seenIn.has(url)) { totalIn += input.length; seenIn.add(url); }
  totalOut += output.length;
  console.log(`${target.padEnd(62)} ${fmt(input.length).padStart(8)} → ${fmt(output.length).padStart(7)}`);
}

// Favicon local (servi depuis /public pour rester disponible même hors ligne du bucket)
const favicon = await presets.favicon(sharp(await download(LOGO))).toBuffer();
await writeFile(join(root, 'public', 'favicon.png'), favicon);

console.log(`\nTotal : ${fmt(totalIn)} téléchargés → ${fmt(totalOut)} compressés (${jobs.length} fichiers).`);
await stat(outDir);
