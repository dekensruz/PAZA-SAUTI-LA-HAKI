
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../LanguageContext';
import { Camera, X, ArrowLeft, Maximize2 } from 'lucide-react';

const Gallery: React.FC = () => {
  const { t } = useLanguage();
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = t.gallery.images;
  // Initially show only the first 5 images
  const initialImages = images.slice(0, 5);

  useEffect(() => {
    if (showFullGallery || selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showFullGallery, selectedImage]);

  return (
    <section id="gallery" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
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

        {/* Bento Grid Layout for Initial Display */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[500px] md:h-[600px]">
          {/* Main Large Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-xl cursor-pointer"
            onClick={() => setSelectedImage(initialImages[0])}
          >
            <img 
              src={initialImages[0]} 
              alt="Gallery highlight" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                 <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" size={32} />
            </div>
          </motion.div>

          {/* Smaller Images */}
          {initialImages.slice(1).map((img, idx) => (
             <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative group overflow-hidden rounded-xl cursor-pointer"
                onClick={() => setSelectedImage(img)}
             >
                <img 
                  src={img} 
                  alt={`Gallery ${idx + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" size={24} />
                </div>
             </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
            <button 
                onClick={() => setShowFullGallery(true)}
                className="px-8 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-paza-dark dark:text-white font-bold rounded-full shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
                {t.gallery.viewAll}
            </button>
        </div>
      </div>

      {/* Full Screen Gallery Modal */}
      <AnimatePresence>
        {showFullGallery && (
           <motion.div 
             initial={{ opacity: 0, y: '100%' }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: '100%' }}
             transition={{ type: "spring", damping: 25, stiffness: 200 }}
             className="fixed inset-0 z-[60] bg-white dark:bg-gray-900 overflow-y-auto"
           >
              <div className="min-h-screen pb-20">
                 {/* Header */}
                 <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 z-10 px-4 py-4 mb-8 shadow-sm">
                    <div className="container mx-auto flex items-center justify-between">
                       <button 
                         onClick={() => setShowFullGallery(false)}
                         className="flex items-center gap-2 text-paza-dark dark:text-white font-bold hover:text-paza-red transition-colors"
                       >
                         <ArrowLeft size={24} />
                         {t.team.back}
                       </button>
                       <span className="font-heading font-bold text-xl text-paza-dark dark:text-white hidden md:block">
                         {t.gallery.title}
                       </span>
                       <div className="w-8"></div>
                    </div>
                 </div>

                 {/* Grid of all images */}
                 <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((img, idx) => (
                           <motion.div 
                              key={idx}
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              className="aspect-square relative group overflow-hidden rounded-lg cursor-pointer bg-gray-100 dark:bg-gray-800"
                              onClick={() => setSelectedImage(img)}
                           >
                              <img 
                                src={img} 
                                alt={`Gallery full ${idx}`} 
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
              </div>
           </motion.div>
        )}
      </AnimatePresence>

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
