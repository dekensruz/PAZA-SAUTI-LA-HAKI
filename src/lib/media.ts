import { MEDIA_BUCKET, SUPABASE_URL, supabase } from './supabase';
import { compressImage, type CompressOptions } from './compressImage';

/** URL publique d'un fichier du bucket « media ». Les URL absolues sont renvoyées telles quelles. */
export function mediaUrl(path?: string | null): string {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${path.replace(/^\//, '')}`;
}

/** Chemin dans le bucket à partir d'une URL publique (null si l'URL est externe). */
export function pathFromMediaUrl(url: string): string | null {
  const prefix = `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/`;
  return url.startsWith(prefix) ? decodeURIComponent(url.slice(prefix.length)) : null;
}

export const brand = {
  logo: mediaUrl('brand/logo.webp'),
  flag: mediaUrl('brand/rdc-flag.webp'),
  coatOfArms: mediaUrl('brand/armoirie.webp'),
  hero: mediaUrl('site/hero-justice.webp'),
  formation: mediaUrl('site/formation-pole-institute.webp'),
};

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

function safeName(name: string) {
  return (
    name
      .replace(/\.[^.]+$/, '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'image'
  );
}

export interface UploadResult {
  path: string;
  url: string;
  bytes: number;
  originalBytes: number;
}

async function putBlob(path: string, blob: Blob): Promise<void> {
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, blob, {
    contentType: blob.type,
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) throw error;
}

/** Compresse puis envoie une image dans le bucket. */
export async function uploadImage(file: File, folder: string, options?: CompressOptions): Promise<UploadResult> {
  const compressed = await compressImage(file, options);
  const ext = compressed.type === 'image/jpeg' ? 'jpg' : compressed.type === 'image/png' ? 'png' : compressed.type === 'image/gif' ? 'gif' : 'webp';
  const path = `${folder.replace(/\/$/, '')}/${Date.now()}-${randomId()}-${safeName(file.name)}.${ext}`;
  await putBlob(path, compressed);
  return { path, url: mediaUrl(path), bytes: compressed.size, originalBytes: file.size };
}

/**
 * Image de couverture d'article : une version WebP pour l'affichage
 * et une version 1200x630 JPEG pour les aperçus de partage (Facebook, WhatsApp…).
 */
export async function uploadCover(file: File, folder: string) {
  const base = `${folder.replace(/\/$/, '')}/${Date.now()}-${randomId()}`;
  const [cover, og] = await Promise.all([
    compressImage(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.8 }),
    compressImage(file, { crop: { width: 1200, height: 630 }, type: 'image/jpeg', quality: 0.82 }),
  ]);
  await Promise.all([putBlob(`${base}-cover.webp`, cover), putBlob(`${base}-og.jpg`, og)]);
  return {
    coverPath: `${base}-cover.webp`,
    ogPath: `${base}-og.jpg`,
    bytes: cover.size + og.size,
    originalBytes: file.size,
  };
}

export async function removeMedia(paths: (string | null | undefined)[]) {
  const list = paths.filter((p): p is string => Boolean(p) && !/^https?:/.test(p as string));
  if (!list.length) return;
  await supabase.storage.from(MEDIA_BUCKET).remove(list);
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}
