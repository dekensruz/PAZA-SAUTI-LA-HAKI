
import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { Calendar, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../LanguageContext';
import { Link } from 'react-router-dom';

interface BlogProps {
  isPage?: boolean;
}

const Blog: React.FC<BlogProps> = ({ isPage = false }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const { t } = useLanguage();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPost]);

  // Modification ici : slice(0, 4) au lieu de slice(0, 3)
  const displayedPosts = isPage ? t.blog.posts : t.blog.posts.slice(0, 4);

  return (
    <section id="blog" className={`py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300 ${isPage ? 'min-h-screen' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-paza-dark dark:text-white mb-4">{t.blog.title}</h2>
                <div className="w-20 h-1 bg-paza-red rounded-full mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">{t.blog.subtitle}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {displayedPosts.map((post, index) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full"
            >
              <div className="h-64 overflow-hidden relative group cursor-pointer" onClick={() => setSelectedPost(post)}>
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-paza-blue flex items-center gap-1">
                    <Calendar size={12} /> {post.date}
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <h3 
                  className="font-heading font-bold text-2xl text-gray-800 dark:text-white mb-4 group-hover:text-paza-blue transition-colors cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  {post.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6 flex-1">
                  {post.summary}
                </p>

                <button 
                  onClick={() => setSelectedPost(post)}
                  className="self-start text-paza-blue font-bold flex items-center gap-2 hover:gap-3 transition-all text-sm uppercase tracking-wide"
                >
                    {t.blog.readMore} <ArrowRight size={16} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Show 'View All' button if not on full page */}
        {!isPage && (
          <div className="mt-12 text-center">
            <Link 
              to="/blog" 
              className="px-8 py-3 bg-white dark:bg-gray-800 text-paza-blue border-2 border-paza-blue font-bold rounded-lg shadow-sm hover:bg-paza-blue hover:text-white transition-all transform hover:-translate-y-1 inline-flex items-center gap-2"
            >
              {t.blog.viewAll} <ArrowRight size={20} />
            </Link>
          </div>
        )}
      </div>

      {/* Blog Post Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
               {/* Sticky Image Header - Fixed height, won't scroll away */}
               <div className="h-48 md:h-64 relative flex-shrink-0">
                  <img 
                    src={selectedPost.image} 
                    alt={selectedPost.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                   <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-paza-blue flex items-center gap-1">
                      <Calendar size={12} /> {selectedPost.date}
                  </div>
               </div>

               {/* Scrollable Content Area */}
               <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar bg-white dark:bg-gray-900">
                  <h2 className="font-heading font-bold text-2xl md:text-3xl text-paza-dark dark:text-white mb-6">
                    {selectedPost.title}
                  </h2>
                  
                  <div className="space-y-4">
                     {selectedPost.contentPoints.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-4">
                            <div className="min-w-[8px] h-[8px] rounded-full bg-paza-red mt-2.5 flex-shrink-0"></div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{point}</p>
                        </div>
                     ))}
                  </div>

                  <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                      <button 
                        onClick={() => setSelectedPost(null)}
                        className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        {t.blog.close}
                      </button>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Blog;
