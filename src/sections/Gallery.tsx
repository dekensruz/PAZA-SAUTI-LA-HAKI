import React, { useState } from 'react';
import { ArrowRight, CornersOut } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/lib/supabase';
import { mediaUrl } from '@/lib/media';
import { useAsync } from '@/lib/useAsync';
import { ErrorNote, Img, Reveal, SectionHeading } from '@/components/ui';
import Lightbox from '@/components/Lightbox';

export interface GalleryImage {
  id: string;
  path: string;
  caption_fr: string | null;
  caption_en: string | null;
  position: number;
}

export async function fetchGallery(limit?: number): Promise<GalleryImage[]> {
  let q = supabase.from('gallery_images').select('*').order('position').order('created_at', { ascending: false });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) throw error;
  return data as GalleryImage[];
}

const Gallery: React.FC<{ isPage?: boolean }> = ({ isPage = false }) => {
  const { t, language } = useLanguage();
  const [index, setIndex] = useState<number | null>(null);
  const { data, error, loading } = useAsync(() => fetchGallery(isPage ? undefined : 6), [isPage]);
  const images = (data ?? []).map((g) => ({ src: mediaUrl(g.path), caption: language === 'en' ? g.caption_en || g.caption_fr : g.caption_fr }));

  // Mosaïque : certaines tuiles occupent 2 lignes / 2 colonnes
  const span = (i: number) => (isPage ? ['md:row-span-2', '', '', 'md:col-span-2', '', 'md:row-span-2', '', ''][i % 8] : ['md:col-span-2 md:row-span-2', '', '', '', '', 'md:col-span-2'][i] ?? '');

  return (
    <section id="gallery" className={`scroll-mt-24 py-24 md:py-32 ${isPage ? 'pt-36 md:pt-44' : ''}`}>
      <div className="container-page">
        <SectionHeading
          eyebrow={t.nav.gallery}
          title={t.gallery.title}
          subtitle={t.gallery.subtitle}
          action={
            !isPage && (
              <Link to="/gallery" className="btn-ghost group shrink-0">
                {t.gallery.viewAll} <ArrowRight size={16} weight="bold" className="transition group-hover:translate-x-1" />
              </Link>
            )
          }
        />
        {error && <ErrorNote>{t.blog.loadError}</ErrorNote>}
        <div className="grid auto-rows-[11rem] grid-cols-2 gap-3 md:auto-rows-[14rem] md:grid-cols-4 md:gap-4">
          {loading && Array.from({ length: 6 }).map((_, i) => <div key={i} className={`animate-pulse rounded-3xl bg-slate-200 dark:bg-white/5 ${span(i)}`} />)}
          {images.map((img, i) => (
            <Reveal key={img.src} delay={(i % 6) * 0.04} className={span(i)}>
              <button onClick={() => setIndex(i)} className="group relative size-full overflow-hidden rounded-3xl" aria-label={img.caption ?? `Photo ${i + 1}`}>
                <Img src={img.src} alt={img.caption ?? ''} wrapperClassName="size-full" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-ink/50 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                  <CornersOut size={22} weight="bold" className="text-white" />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
      <Lightbox images={images} index={index} onChange={setIndex} />
    </section>
  );
};

export default Gallery;
