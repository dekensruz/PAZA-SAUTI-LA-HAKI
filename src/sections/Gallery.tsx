
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';
import { IconCamera as Camera, IconX as X, IconArrowsMaximize as CornersOut, IconArrowRight as ArrowRight, IconChevronLeft as CaretLeft, IconChevronRight as CaretRight } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { mediaUrl } from '@/lib/media';
import { useAsync } from '@/lib/useAsync';
import SectionHeader, { ViewAllClass } from '@/components/SectionHeader';

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

interface GalleryProps {
  isPage?: boolean;
}

const Gallery: React.FC<GalleryProps> = ({ isPage = false }) => {
  const { t, language } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const { data } = useAsync(() => fetchGallery(), []);
  const loading = data === undefined;
  const images = (data ?? []).map((g) => mediaUrl(g.path));
  const captions = (data ?? []).map((g) => (language === 'en' ? g.caption_en || g.caption_fr : g.caption_fr));
  const displayedImages = isPage ? images : images.slice(0, 5);
  // Mosaïque : la première photo est mise en avant
  const tileClass = (idx: number) => (idx === 0 ? 'col-span-2 row-span-2' : '');

  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImageIndex]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
    }
  }, [selectedImageIndex, images.length]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
    }
  }, [selectedImageIndex, images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setSelectedImageIndex(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, handleNext, handlePrev]);

  return (
    <section id="gallery" className={`py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300 ${isPage ? 'min-h-[80vh]' : ''}`}>
      <div className="container mx-auto px-4">
        <SectionHeader eyebrow={t.nav.gallery} title={t.gallery.title} subtitle={t.gallery.subtitle} icon={Camera} accent="red" />

        {/* Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[9.5rem] sm:auto-rows-[12rem] lg:auto-rows-[14rem] gap-3 md:gap-4">
            {loading && Array.from({ length: 5 }).map((_, i) => <div key={i} className={`rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse ${tileClass(i)}`} />)}
            {displayedImages.map((img, idx) => (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className={`relative group overflow-hidden rounded-xl cursor-pointer bg-gray-100 dark:bg-gray-800 shadow-md focus-within:ring-2 focus-within:ring-paza-red ${tileClass(idx)}`}
                    role="button"
                    tabIndex={0}
                    aria-label={captions[idx] || `${t.gallery.title} ${idx + 1}`}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedImageIndex(idx)}
                    onClick={() => setSelectedImageIndex(isPage ? idx : idx)} // Logic works because displayed matches source index in slice 0-3
                >
                    <img 
                    src={img} 
                    alt={captions[idx] || `${t.gallery.title} ${idx + 1}`} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <CornersOut className="text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" size={24} stroke={2.2} />
                    </div>
                </motion.div>
            ))}
        </div>

        {/* Show 'View All' button if not on full page */}
        {!isPage && (
          <div className="mt-12 text-center">
            <Link 
              to="/gallery" 
              className={ViewAllClass('red')}
            >
              {t.gallery.viewAll} <ArrowRight size={18} stroke={2.2} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>

      {/* Lightbox Modal with Navigation */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center p-4"
             onClick={() => setSelectedImageIndex(null)}
           >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedImageIndex(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-20"
                aria-label={t.gallery.close}
              >
                 <X size={32} stroke={2.2} />
              </button>

              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-20 hidden md:block"
              >
                <CaretLeft size={48} stroke={2.2} />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-20 hidden md:block"
              >
                <CaretRight size={48} stroke={2.2} />
              </button>
              
              <motion.img 
                key={selectedImageIndex} // Key allows animation when changing images
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                src={images[selectedImageIndex]} 
                alt="Full screen view" 
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl touch-pan-y"
                onClick={(e) => e.stopPropagation()}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, info) => (info.offset.x < -60 ? handleNext() : info.offset.x > 60 ? handlePrev() : undefined)}
              />
              {captions[selectedImageIndex] && (
                <p className="absolute bottom-14 left-1/2 -translate-x-1/2 max-w-xl px-4 text-center text-white/90 text-sm">{captions[selectedImageIndex]}</p>
              )}

              {/* Counter */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 font-mono text-sm">
                 {selectedImageIndex + 1} / {images.length}
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
