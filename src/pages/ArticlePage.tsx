import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { motion, useScroll, useSpring } from 'framer-motion';
import { IconArrowLeft as ArrowLeft, IconCalendar as CalendarBlank, IconEye as Eye } from '@tabler/icons-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { articleState, fetchArticleBySlug, fetchRelatedArticles, loc, readingMinutes } from '@/lib/articles';
import { brand, mediaUrl } from '@/lib/media';
import { formatDate } from '@/lib/format';
import { SITE_URL } from '@/lib/supabase';
import { useAsync } from '@/lib/useAsync';
import { useSeo } from '@/lib/useSeo';
import { ShareBar } from '@/components/ShareButtons';
import Lightbox from '@/components/Lightbox';
import { Spinner } from '@/components/ui';
import { BlogCard } from '@/sections/Blog';

export function sanitizeArticleHtml(html: string) {
  return DOMPurify.sanitize(html, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allowfullscreen', 'frameborder', 'target', 'width', 'height'],
  });
}

const ArticlePage: React.FC = () => {
  const { slug = '' } = useParams();
  const { t, language } = useLanguage();
  const { data: article, error, loading } = useAsync(() => fetchArticleBySlug(slug), [slug]);
  const { data: related } = useAsync(() => (article ? fetchRelatedArticles(article.id, 3) : Promise.resolve([])), [article?.id]);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  const title = article ? loc(article, 'title', language) : '';
  const summary = article ? loc(article, 'summary', language) : '';
  const html = useMemo(() => (article ? sanitizeArticleHtml(loc(article, 'content', language)) : ''), [article, language]);
  const inlineImages = useMemo(() => Array.from(html.matchAll(/<img[^>]+src="([^"]+)"/g)).map((m) => ({ src: m[1] })), [html]);

  useSeo({ title: title || undefined, description: summary || undefined, image: article?.og_image_path || article?.cover_path, path: `/blog/${slug}`, type: 'article' });

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-paza-blue">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-800 min-h-[70vh]">
        <div className="container mx-auto px-4 text-center">
          <p className="font-heading font-bold text-2xl text-paza-dark dark:text-white mb-8">{error ? t.blog.loadError : t.blog.notFound}</p>
          <Link to="/blog" className="px-8 py-3 bg-paza-blue text-white font-bold rounded-lg inline-flex items-center gap-2 hover:bg-blue-700 transition-colors">
            <ArrowLeft size={18} stroke={2.2} /> {t.blog.backToBlog}
          </Link>
        </div>
      </section>
    );
  }

  const state = articleState(article);
  const shareUrl = `${SITE_URL}/blog/${article.slug}`;
  const date = formatDate(article.published_at, language);
  const cover = mediaUrl(article.cover_path);

  const onContentClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      const i = inlineImages.findIndex((img) => img.src === target.getAttribute('src'));
      if (i >= 0) setLightbox(i);
    }
  };

  return (
    <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300 min-h-screen">
      <motion.div style={{ scaleX: progress }} className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-paza-blue via-paza-yellow to-paza-red origin-left z-[60]" aria-hidden />
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-paza-blue mb-6 uppercase tracking-wide">
          <ArrowLeft size={16} stroke={2.2} /> {t.blog.backToBlog}
        </Link>

        {state !== 'published' && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-paza-yellow/30 px-5 py-3 text-sm font-semibold text-paza-dark">
            <Eye size={18} stroke={2.2} />
            Aperçu administrateur — {state === 'draft' ? 'brouillon non publié' : `programmé pour le ${formatDate(article.published_at, 'fr', "d MMMM yyyy 'à' HH:mm")}`}
          </div>
        )}

        <motion.article
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
        >
          {/* En-tête image : couverture entière sur fond flouté */}
          {article.cover_path && (
            <div className="h-64 sm:h-80 md:h-[28rem] relative bg-gray-950 overflow-hidden">
              <img src={cover} alt="" className="absolute inset-0 w-full h-full object-cover filter blur-2xl opacity-40 select-none pointer-events-none" />
              <img src={cover} alt={article.cover_alt ?? title} className="relative z-10 w-full h-full object-contain mx-auto" fetchPriority="high" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-20 pointer-events-none"></div>
              <div className="absolute bottom-6 left-6 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-bold text-paza-blue flex items-center gap-1.5 shadow-md">
                <CalendarBlank size={13} /> {date}
              </div>
            </div>
          )}

          <div className="p-6 sm:p-10">
            <div className="flex items-center gap-4 mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
              <img src={brand.logo} alt="Paza Sauti logo" className="w-12 h-12 rounded-full object-contain bg-gray-50 dark:bg-gray-800 p-1 border border-gray-200 dark:border-gray-700 shadow-sm" />
              <div>
                <span className="block text-sm font-bold text-gray-800 dark:text-gray-200">{article.author || 'Paza Sauti La Haki'}</span>
                <span className="block text-xs text-gray-400 dark:text-gray-500 font-medium">
                  {date} • {readingMinutes(html)} {t.blog.minRead}
                </span>
              </div>
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-paza-dark dark:text-white mb-6 leading-tight">{title}</h1>

            {summary && (
              <div className="mb-8 p-6 bg-paza-blue/5 border-l-4 border-paza-blue rounded-r-2xl dark:bg-paza-blue/10">
                <p className="text-gray-700 dark:text-gray-200 italic font-medium leading-relaxed text-base sm:text-lg">"{summary}"</p>
              </div>
            )}

            <div className="article-content max-w-[68ch]" onClick={onContentClick} dangerouslySetInnerHTML={{ __html: html }} />

            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <ShareBar url={shareUrl} title={title} />
              <Link to="/blog" className="px-8 py-3 bg-paza-blue text-white font-extrabold rounded-xl hover:bg-paza-blue/90 hover:shadow-md transition-all self-start md:self-auto uppercase tracking-wider text-xs">
                {t.blog.backToBlog}
              </Link>
            </div>
          </div>
        </motion.article>
      </div>

      {related && related.length > 0 && (
        <div className="container mx-auto px-4 mt-20">
          <h2 className="font-heading font-bold text-3xl text-paza-dark dark:text-white mb-4">{t.blog.related}</h2>
          <div className="w-20 h-1 bg-paza-red rounded-full mb-10"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {related.map((p, i) => (
              <BlogCard key={p.id} post={p} index={i} />
            ))}
          </div>
        </div>
      )}

      <Lightbox images={inlineImages} index={lightbox} onChange={setLightbox} />
    </section>
  );
};

export default ArticlePage;
