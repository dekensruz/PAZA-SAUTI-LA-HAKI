// Envoie toutes les images compressées de supabase/media/ dans le bucket « media ».
// Nécessite dans .env.local : VITE_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY
// (clé « service_role », à ne JAMAIS exposer côté navigateur ni committer).
//
// Usage : npm run media:upload
import { createClient } from '@supabase/supabase-js';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// .env.local est prioritaire sur .env (comme Vite) ; les variables déjà définies ne sont pas écrasées
for (const file of ['.env.local', '.env']) {
  try { process.loadEnvFile(join(root, file)); } catch { /* fichier absent */ }
}

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error('VITE_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis (voir .env.example).');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
const mediaDir = join(root, 'supabase', 'media');
const types = { '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png' };

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

let ok = 0;
let failed = 0;
for await (const file of walk(mediaDir)) {
  const path = relative(mediaDir, file).split('\\').join('/');
  const contentType = types[extname(file).toLowerCase()];
  if (!contentType) continue;
  const { error } = await supabase.storage.from('media').upload(path, await readFile(file), {
    contentType,
    upsert: true,
    cacheControl: '31536000',
  });
  if (error) { failed++; console.error(`✗ ${path} — ${error.message}`); }
  else { ok++; console.log(`✓ ${path}`); }
}
console.log(`\n${ok} fichier(s) envoyé(s), ${failed} échec(s).`);
process.exit(failed ? 1 : 0);
