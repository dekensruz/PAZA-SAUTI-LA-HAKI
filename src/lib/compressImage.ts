/**
 * Compresseur d'images côté navigateur (aucune dépendance).
 * Redimensionne, corrige l'orientation EXIF et ré-encode en WebP (ou JPEG).
 * Les GIF animés et SVG sont laissés intacts.
 */
export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  /** 0..1 */
  quality?: number;
  type?: 'image/webp' | 'image/jpeg';
  /** Recadrage exact (cover centré), ex. 1200x630 pour Open Graph */
  crop?: { width: number; height: number };
}

const PASSTHROUGH = new Set(['image/gif', 'image/svg+xml']);

let webpSupported: boolean | null = null;
function supportsWebp(): boolean {
  if (webpSupported === null) {
    const c = document.createElement('canvas');
    c.width = c.height = 1;
    webpSupported = c.toDataURL('image/webp').startsWith('data:image/webp');
  }
  return webpSupported;
}

async function decode(file: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      /* repli ci-dessous */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function compressImage(file: File | Blob, options: CompressOptions = {}): Promise<Blob> {
  if (PASSTHROUGH.has(file.type)) return file;
  const { maxWidth = 1920, maxHeight = 1920, quality = 0.8, crop } = options;
  let type = options.type ?? 'image/webp';
  if (type === 'image/webp' && !supportsWebp()) type = 'image/jpeg';

  const source = await decode(file);
  const sw = source.width;
  const sh = source.height;

  let sx = 0, sy = 0, sWidth = sw, sHeight = sh, dw: number, dh: number;
  if (crop) {
    const targetRatio = crop.width / crop.height;
    if (sw / sh > targetRatio) {
      sWidth = sh * targetRatio;
      sx = (sw - sWidth) / 2;
    } else {
      sHeight = sw / targetRatio;
      sy = (sh - sHeight) / 2;
    }
    dw = crop.width;
    dh = crop.height;
  } else {
    const scale = Math.min(1, maxWidth / sw, maxHeight / sh);
    dw = Math.round(sw * scale);
    dh = Math.round(sh * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = dw;
  canvas.height = dh;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  if (type === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, dw, dh);
  }
  ctx.drawImage(source as CanvasImageSource, sx, sy, sWidth, sHeight, 0, 0, dw, dh);
  if ('close' in source) source.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
  if (!blob) return file;
  // Si l'original est déjà plus léger et n'a pas besoin d'être redimensionné/recadré, on le garde
  if (!crop && blob.size >= file.size && dw === sw && dh === sh && file.type === type) return file;
  return blob;
}
