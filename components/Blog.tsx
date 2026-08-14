
import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { CalendarBlank, ArrowRight, X, ShareNetwork, Copy, Check, FacebookLogo, TwitterLogo, LinkedinLogo, ChatCircle } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../LanguageContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface BlogProps {
  isPage?: boolean;
}

const Blog: React.FC<BlogProps> = ({ isPage = false }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeShareId, setActiveShareId] = useState<string | null>(null);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Load article from URL parameters if present (?post=id)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const postId = params.get('post');
    if (postId) {
      const foundPost = t.blog.posts.find((p: BlogPost) => p.id === postId);
      if (foundPost) {
        setSelectedPost(foundPost);
      }
    }
  }, [location.search, t.blog.posts]);

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

  const handleCloseModal = () => {
    setSelectedPost(null);
    const params = new URLSearchParams(location.search);
    if (params.has('post')) {
      params.delete('post');
      const searchStr = params.toString();
      navigate({
        search: searchStr ? `?${searchStr}` : ''
      }, { replace: true });
    }
  };

  const handleCopyLink = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}${location.pathname}?post=${postId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedPostId(postId);
      setTimeout(() => setCopiedPostId(null), 2000);
    });
  };

  const handleShare = (platform: 'whatsapp' | 'facebook' | 'twitter' | 'linkedin', post: BlogPost, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}${location.pathname}?post=${post.id}`;
    const text = encodeURIComponent(`${post.title} - Paza Sauti La Haki`);
    const encodedUrl = encodeURIComponent(shareUrl);
    
    let url = '';
    switch (platform) {
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${text}%20${encodedUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleWebShare = (post: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${location.pathname}?post=${post.id}`;
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.summary,
        url: shareUrl,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      setActiveShareId(activeShareId === post.id ? null : post.id);
    }
  };

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
              className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full relative"
            >
              <div className="h-64 overflow-hidden relative group cursor-pointer bg-gray-100 dark:bg-gray-950 flex shadow-inner" onClick={() => setSelectedPost(post)}>
                {/* Background blurred cover layer */}
                <img 
                  src={post.image} 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover filter blur-lg opacity-40 select-none pointer-events-none transform group-hover:scale-110 transition-transform duration-500"
                />
                {/* Contained full cover layer */}
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="relative z-10 w-full h-full object-contain mx-auto transform group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-paza-blue flex items-center gap-1 shadow-sm">
                    <CalendarBlank size={12} /> {post.date}
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

                <div className="flex justify-between items-center mt-auto border-t border-gray-100 dark:border-gray-800 pt-6">
                  <button 
                    onClick={() => setSelectedPost(post)}
                    className="self-start text-paza-blue font-bold flex items-center gap-2 hover:gap-3 transition-all text-sm uppercase tracking-wide"
                  >
                      {t.blog.readMore} <ArrowRight weight="bold" size={16} />
                  </button>

                  <div className="relative">
                    <button 
                      onClick={(e) => handleWebShare(post, e)}
                      className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-paza-blue hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all flex items-center justify-center border border-gray-100 dark:border-gray-850"
                      title={t.blog.share}
                    >
                      <ShareNetwork size={16} />
                    </button>

                    {/* Custom share dropdown panel */}
                    <AnimatePresence>
                      {activeShareId === post.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveShareId(null);
                            }}
                          />
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 bottom-12 z-20 w-52 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl shadow-2xl p-2 flex flex-col gap-1 text-sm font-medium"
                          >
                            <button
                              onClick={(e) => handleCopyLink(post.id, e)}
                              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-855 rounded-lg text-gray-700 dark:text-gray-300 transition-colors"
                            >
                              {copiedPostId === post.id ? (
                                <>
                                  <Check weight="bold" size={16} className="text-green-500" />
                                  <span className="text-green-500 text-xs">{t.blog.copied}</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={16} />
                                  <span>{t.blog.copyLink || 'Copier le lien'}</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={(e) => handleShare('whatsapp', post, e)}
                              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-green-500/10 hover:text-green-600 rounded-lg text-gray-700 dark:text-gray-300 transition-colors"
                            >
                              <ChatCircle weight="fill" size={16} className="text-green-500" />
                              <span>WhatsApp</span>
                            </button>
                            <button
                              onClick={(e) => handleShare('facebook', post, e)}
                              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-blue-600/10 hover:text-blue-650 rounded-lg text-gray-700 dark:text-gray-300 transition-colors"
                            >
                              <FacebookLogo weight="fill" size={16} className="text-blue-600" />
                              <span>Facebook</span>
                            </button>
                            <button
                              onClick={(e) => handleShare('twitter', post, e)}
                              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-black/10 dark:hover:bg-white/10 rounded-lg text-gray-700 dark:text-gray-300 transition-colors"
                            >
                              <TwitterLogo weight="fill" size={16} className="text-black dark:text-white" />
                              <span>X / Twitter</span>
                            </button>
                            <button
                              onClick={(e) => handleShare('linkedin', post, e)}
                              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-blue-700/10 hover:text-blue-800 rounded-lg text-gray-700 dark:text-gray-300 transition-colors"
                            >
                              <LinkedinLogo weight="fill" size={16} className="text-blue-700" />
                              <span>LinkedIn</span>
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
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
              {t.blog.viewAll} <ArrowRight weight="bold" size={20} />
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
            onClick={handleCloseModal}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white dark:bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
               {/* Premium Image Header - showing the full cover image with modern blurry background pattern */}
               <div className="h-44 sm:h-52 md:h-60 relative flex-shrink-0 bg-gray-950 overflow-hidden">
                  {/* Blur background */}
                  <img 
                    src={selectedPost.image} 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover filter blur-2xl opacity-40 select-none pointer-events-none"
                  />
                  {/* Contained main image */}
                  <img 
                    src={selectedPost.image} 
                    alt={selectedPost.title} 
                    className="relative z-10 w-full h-full object-contain mx-auto"
                  />
                  
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-20"></div>
                  
                  {/* Close button inside modal (positioned perfectly) */}
                  <button 
                    onClick={handleCloseModal}
                    className="absolute top-4 right-4 z-30 p-2.5 bg-black/55 hover:bg-black/75 hover:scale-105 rounded-full text-white transition-all shadow-lg border border-white/10"
                    aria-label={t.blog.close}
                  >
                    <X weight="bold" size={20} />
                  </button>

                  <div className="absolute bottom-6 left-6 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-bold text-paza-blue flex items-center gap-1.5 shadow-md">
                      <CalendarBlank size={13} /> {selectedPost.date}
                  </div>
               </div>

               {/* Scrollable Content Area */}
               <div className="p-6 sm:p-10 overflow-y-auto custom-scrollbar bg-white dark:bg-gray-900 flex-grow">
                  
                  {/* Editorial Header / Meta info */}
                  <div className="flex items-center gap-4 mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
                    <img 
                      src="https://i.ibb.co/5gCvZcKM/Logo.png" 
                      alt="Paza Sauti logo" 
                      className="w-12 h-12 rounded-full object-contain bg-gray-50 dark:bg-gray-800 p-1 border border-gray-200 dark:border-gray-750 shadow-sm" 
                    />
                    <div>
                      <span className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                        Paza Sauti La Haki
                      </span>
                      <span className="block text-xs text-gray-400 dark:text-gray-500 font-medium">
                        Redaction Goma • {selectedPost.date} • 2 min de lecture
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Post Title */}
                  <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-paza-dark dark:text-white mb-6 leading-tight select-text">
                    {selectedPost.title}
                  </h2>
                  
                  {/* Summary / Lead Paragraph */}
                  <div className="mb-8 p-6 bg-paza-blue/5 border-l-4 border-paza-blue rounded-r-2xl dark:bg-paza-blue/10">
                    <p className="text-gray-750 dark:text-gray-200 italic font-medium leading-relaxed text-base sm:text-lg select-text">
                      "{selectedPost.summary}"
                    </p>
                  </div>

                  {/* Main content body with elegant flow */}
                  <div className="space-y-6">
                     {selectedPost.contentPoints.map((point, idx) => (
                        <div key={idx} className="relative pl-8 border-l border-gray-150 dark:border-gray-800 hover:border-paza-red transition-all duration-300 py-1.5 group">
                            {/* Stylized sequence counter badge */}
                            <span className="absolute left-0 top-2.5 text-[10px] font-extrabold text-paza-red bg-paza-red/15 dark:bg-paza-red/25 px-1.5 py-0.5 rounded -translate-x-1/2 tracking-wider">
                              {(idx + 1).toString().padStart(2, '0')}
                            </span>
                            <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-base sm:text-lg select-text">
                              {point}
                            </p>
                        </div>
                     ))}
                  </div>

                  {/* Bottom Controls / Upgraded share bar */}
                  <div className="mt-12 pt-8 border-t border-gray-150 dark:border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      <div className="flex flex-col gap-3">
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                              {t.blog.share}
                          </span>
                          <div className="flex flex-wrap items-center gap-2">
                              {/* Copy Link Button */}
                              <button 
                                onClick={(e) => handleCopyLink(selectedPost.id, e)}
                                className="p-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 rounded-xl transition-all flex items-center gap-2.5 text-xs font-bold text-gray-750 dark:text-gray-250 hover:scale-[1.03] border border-gray-100 dark:border-gray-800"
                                title={t.blog.copyLink || "Copier le lien"}
                              >
                                {copiedPostId === selectedPost.id ? (
                                  <>
                                    <Check weight="bold" size={16} className="text-green-500" />
                                    <span className="text-green-500 font-bold">{t.blog.copied}</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={16} />
                                    <span>{t.blog.copyLink || "Copier le lien"}</span>
                                  </>
                                )}
                              </button>

                              {/* WhatsApp Share */}
                              <button 
                                onClick={(e) => handleShare('whatsapp', selectedPost, e)}
                                className="p-2.5 bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-950/20 dark:hover:bg-green-950/40 dark:text-green-400 rounded-xl transition-all hover:scale-[1.05]"
                                title="WhatsApp"
                              >
                                <ChatCircle weight="fill" size={18} />
                              </button>

                              {/* Facebook Share */}
                              <button 
                                onClick={(e) => handleShare('facebook', selectedPost, e)}
                                className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-950/40 dark:text-blue-400 rounded-xl transition-all hover:scale-[1.05]"
                                title="Facebook"
                              >
                                <FacebookLogo weight="fill" size={18} />
                              </button>

                              {/* Twitter Share */}
                              <button 
                                onClick={(e) => handleShare('twitter', selectedPost, e)}
                                className="p-2.5 bg-gray-50 text-black hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-755 dark:text-white rounded-xl transition-all hover:scale-[1.05]"
                                title="X / Twitter"
                              >
                                <TwitterLogo weight="fill" size={18} />
                              </button>

                              {/* LinkedIn Share */}
                              <button 
                                onClick={(e) => handleShare('linkedin', selectedPost, e)}
                                className="p-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-950/40 dark:text-blue-400 rounded-xl transition-all hover:scale-[1.05]"
                                title="LinkedIn"
                              >
                                <LinkedinLogo weight="fill" size={18} />
                              </button>
                          </div>
                      </div>

                      <button 
                        onClick={handleCloseModal}
                        className="px-8 py-3 bg-paza-blue text-white font-extrabold rounded-xl hover:bg-paza-blue/90 hover:shadow-md hover:scale-[1.02] transition-all self-start md:self-auto uppercase tracking-wider text-xs"
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
