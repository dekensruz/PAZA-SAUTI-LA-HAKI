import React, { useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconChevronLeft as CaretLeft, IconChevronRight as CaretRight, IconX as X } from '@tabler/icons-react';

interface Props {
  images: { src: string; caption?: string | null }[];
  index: number | null;
  onChange: (index: number | null) => void;
}

const Lightbox: React.FC<Props> = ({ images, index, onChange }) => {
  const open = index !== null;
  const next = useCallback(() => index !== null && onChange((index + 1) % images.length), [index, images.length, onChange]);
  const prev = useCallback(() => index !== null && onChange((index - 1 + images.length) % images.length), [index, images.length, onChange]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') onChange(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, next, prev, onChange]);

  return (
    <AnimatePresence>
      {open && index !== null && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/95 p-4 backdrop-blur" onClick={() => onChange(null)} role="dialog" aria-modal>
          <button onClick={() => onChange(null)} className="absolute top-5 right-5 flex size-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Fermer">
            <X size={22} stroke={2.2} />
          </button>
          <button onClick={(e) => (e.stopPropagation(), prev())} className="absolute left-4 hidden size-14 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:flex" aria-label="Précédente">
            <CaretLeft size={26} stroke={2.2} />
          </button>
          <button onClick={(e) => (e.stopPropagation(), next())} className="absolute right-4 hidden size-14 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:flex" aria-label="Suivante">
            <CaretRight size={26} stroke={2.2} />
          </button>
          <motion.figure key={index} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex max-h-full flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <motion.img
              src={images[index].src}
              alt={images[index].caption ?? ''}
              className="max-h-[82vh] max-w-full rounded-2xl object-contain shadow-2xl"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => (info.offset.x < -60 ? next() : info.offset.x > 60 ? prev() : undefined)}
            />
            <figcaption className="mt-4 text-center text-sm text-white/70">
              {images[index].caption && <span className="mr-3 text-white">{images[index].caption}</span>}
              <span className="font-mono">
                {index + 1} / {images.length}
              </span>
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;
