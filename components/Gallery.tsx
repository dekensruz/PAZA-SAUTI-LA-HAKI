
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../LanguageContext';
import { Camera, X, Maximize2, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GalleryProps {
  isPage?: boolean;
}

const Gallery: React.FC<GalleryProps> = ({ isPage = false }) => {
  const { t } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const images = t.gallery.images;
  // Modification ici : slice(0, 4) au lieu de slice(0, 3)
  const displayedImages = isPage ? images : images.slice(0, 4);

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
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
             <Camera className="text-paza-red" size={28} />
             <h2 className="font-heading font-bold text-3xl md:text-4xl text-paza-dark dark:text-white">{t.gallery.title}</h2>
          </div>
          <div className="w-20 h-1 bg-paza-red mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t.gallery.subtitle}
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedImages.map((img, idx) => (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="aspect-square relative group overflow-hidden rounded-lg cursor-pointer bg-gray-100 dark:bg-gray-800 shadow-md"
                    onClick={() => setSelectedImageIndex(isPage ? idx : idx)} // Logic works because displayed matches source index in slice 0-3
                >
                    <img 
                    src={img} 
                    alt={`Gallery ${idx + 1}`} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" size={24} />
                    </div>
                </motion.div>
            ))}
        </div>

        {/* Show 'View All' button if not on full page */}
        {!isPage && (
          <div className="mt-12 text-center">
            <Link 
              to="/gallery" 
              className="px-8 py-3 bg-white dark:bg-gray-800 text-paza-red border-2 border-paza-red font-bold rounded-lg shadow-sm hover:bg-paza-red hover:text-white transition-all transform hover:-translate-y-1 inline-flex items-center gap-2"
            >
              {t.gallery.viewAll} <ArrowRight size={20} />
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
              >
                 <X size={32} />
              </button>

              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-20 hidden md:block"
              >
                <ChevronLeft size={48} />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-20 hidden md:block"
              >
                <ChevronRight size={48} />
              </button>
              
              <motion.img 
                key={selectedImageIndex} // Key allows animation when changing images
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                src={images[selectedImageIndex]} 
                alt="Full screen view" 
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />

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
