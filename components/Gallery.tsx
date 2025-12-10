
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../LanguageContext';
import { Camera, X, Maximize2 } from 'lucide-react';

const Gallery: React.FC = () => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = t.gallery.images;

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  return (
    <section id="gallery" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300 min-h-screen">
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

        {/* Full Grid Layout for Page */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, idx) => (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="aspect-square relative group overflow-hidden rounded-lg cursor-pointer bg-gray-100 dark:bg-gray-800 shadow-md"
                    onClick={() => setSelectedImage(img)}
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
      </div>

      {/* Lightbox Modal for Single Image */}
      <AnimatePresence>
        {selectedImage && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center p-4"
             onClick={() => setSelectedImage(null)}
           >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
              >
                 <X size={32} />
              </button>
              
              <motion.img 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={selectedImage} 
                alt="Full screen view" 
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
           </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
