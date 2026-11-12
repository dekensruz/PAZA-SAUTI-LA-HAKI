import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Trash, UploadSimple } from '@phosphor-icons/react';
import { supabase } from '@/lib/supabase';
import { formatBytes, mediaUrl, removeMedia, uploadImage } from '@/lib/media';
import { useAsync } from '@/lib/useAsync';
import { fetchGallery, type GalleryImage } from '@/sections/Gallery';
import { ErrorNote, Spinner } from '@/components/ui';

const GalleryAdminPage: React.FC = () => {
  const { data, error, loading, reload } = useAsync(() => fetchGallery(), []);
  const [status, setStatus] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const images = data ?? [];

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    let saved = 0;
    let before = 0;
    let after = 0;
    const startPos = images.reduce((m, i) => Math.max(m, i.position), 0);
    for (const [i, file] of Array.from(files).entries()) {
      if (!file.type.startsWith('image/')) continue;
      setStatus(`Compression et envoi ${i + 1}/${files.length}…`);
      try {
        const res = await uploadImage(file, 'gallery', { maxWidth: 1600, maxHeight: 1600, quality: 0.78 });
        const { error } = await supabase.from('gallery_images').insert({ path: res.path, position: startPos + i + 1 });
        if (error) throw error;
        saved++;
        before += res.originalBytes;
        after += res.bytes;
      } catch (e) {
        setErr((e as Error).message);
      }
    }
    setStatus(saved ? `${saved} photo(s) ajoutée(s) — ${formatBytes(before)} → ${formatBytes(after)}` : null);
    reload();
  };

  const update = async (img: GalleryImage, patch: Partial<GalleryImage>) => {
    const { error } = await supabase.from('gallery_images').update(patch).eq('id', img.id);
    if (error) setErr(error.message);
  };

  const swap = async (a: GalleryImage, b?: GalleryImage) => {
    if (!b) return;
    const pa = a.position === b.position ? b.position + 1 : b.position;
    await Promise.all([update(a, { position: pa }), update(b, { position: a.position })]);
    reload();
  };

  const remove = async (img: GalleryImage) => {
    if (!confirm('Supprimer définitivement cette photo de la galerie ?')) return;
    const { error } = await supabase.from('gallery_images').delete().eq('id', img.id);
    if (error) return setErr(error.message);
    await removeMedia([img.path]);
    reload();
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold">Galerie</h1>
          <p className="mt-1 text-slate-500">Les photos sont compressées automatiquement avant l'envoi.</p>
        </div>
        <label className="btn-blue cursor-pointer">
          <UploadSimple size={18} weight="bold" /> Ajouter des photos
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
        </label>
      </div>
      {status && <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">{status.includes('…') && <Spinner className="size-4" />} {status}</p>}
      {(error || err) && <div className="mb-4"><ErrorNote>{error?.message ?? err}</ErrorNote></div>}
      {loading && <div className="flex justify-center py-20 text-paza-blue"><Spinner /></div>}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {images.map((img, i) => (
          <div key={img.id} className="card overflow-hidden">
            <img src={mediaUrl(img.path)} alt="" className="aspect-square w-full object-cover" loading="lazy" />
            <div className="space-y-2 p-3">
              <input className="input !py-2 !text-xs" placeholder="Légende (FR)" defaultValue={img.caption_fr ?? ''} onBlur={(e) => e.target.value !== (img.caption_fr ?? '') && update(img, { caption_fr: e.target.value || null })} />
              <input className="input !py-2 !text-xs" placeholder="Caption (EN)" defaultValue={img.caption_en ?? ''} onBlur={(e) => e.target.value !== (img.caption_en ?? '') && update(img, { caption_en: e.target.value || null })} />
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <button disabled={i === 0} onClick={() => swap(img, images[i - 1])} className="flex size-8 items-center justify-center rounded-full hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-white/10" aria-label="Avant"><ArrowLeft size={14} /></button>
                  <button disabled={i === images.length - 1} onClick={() => swap(img, images[i + 1])} className="flex size-8 items-center justify-center rounded-full hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-white/10" aria-label="Après"><ArrowRight size={14} /></button>
                </div>
                <button onClick={() => remove(img)} className="flex size-8 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-paza-red dark:hover:bg-white/10" aria-label="Supprimer"><Trash size={15} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryAdminPage;
