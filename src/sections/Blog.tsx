import React, { useEffect } from 'react';
import { IconCalendar as CalendarBlank, IconArrowRight as ArrowRight, IconNews as Newspaper } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { fetchPublishedArticles, fetchSlugByLegacyId, loc, type ArticleCardFields } from '@/lib/articles';
import { mediaUrl } from '@/lib/media';
import { formatDate } from '@/lib/format';
import { SITE_URL } from '@/lib/supabase';
import { useAsync } from '@/lib/useAsync';
import { ShareDropdown } from '@/components/ShareButtons';
import SectionHeader, { ViewAllClass } from '@/components/SectionHeader';

/** Carte d'article (design d'origine) — ouvre la page de l'article. */
export const BlogCard: React.FC<{ post: ArticleCardFields; index?: number }> = ({ post, index = 0 }) => {
  const { t, language } = useLanguage();
  const title = loc(post, 'title', language);
  const summary = loc(post, 'summary', language);
  const to = `/blog/${post.slug}`;
  const image = mediaUrl(post.cover_path);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 3) * 0.12 }}
      className="group/card bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full relative"
    >
      <Link to={to} tabIndex={-1} aria-hidden className="aspect-[16/10] overflow-hidden relative group bg-gray-100 dark:bg-gray-950 flex shadow-inner">
        <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover filter blur-lg opacity-40 select-none pointer-events-none transform group-hover:scale-110 transition-transform duration-500" />
        <img src={image} alt={post.cover_alt ?? title} loading="lazy" className="relative z-10 w-full h-full object-contain mx-auto transform group-hover:scale-[1.02] transition-transform duration-500" />
        <div className="absolute top-4 left-4 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-paza-blue flex items-center gap-1 shadow-sm">
          <CalendarBlank size={12} /> {formatDate(post.published_at, language)}
        </div>
      </Link>

      <div className="p-6 md:p-7 flex-1 flex flex-col">
        <Link to={to}>
          <h3 className="font-heading font-bold text-xl md:text-[1.35rem] leading-snug text-gray-800 dark:text-white mb-3 group-hover/card:text-paza-blue transition-colors text-balance">{title}</h3>
        </Link>
        <p className="text-gray-600 dark:text-gray-400 mb-6 flex-1 line-clamp-3 leading-relaxed">{summary}</p>
        <div className="flex justify-between items-center mt-auto border-t border-gray-100 dark:border-gray-800 pt-6">
          <Link to={to} className="self-start text-paza-blue font-bold flex items-center gap-2 hover:gap-3 transition-all text-sm uppercase tracking-wide">
            {t.blog.readMore} <ArrowRight stroke={2.2} size={16} />
          </Link>
          <ShareDropdown url={`${SITE_URL}${to}`} title={title} summary={summary} />
        </div>
      </div>
    </motion.article>
  );
};

interface BlogProps {
  isPage?: boolean;
}

const Blog: React.FC<BlogProps> = ({ isPage = false }) => {
  const { t } = useLanguage();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { data, error, loading } = useAsync(() => fetchPublishedArticles(isPage ? undefined : 3), [isPage]);

  // Anciens liens partagés (/blog?post=6) → nouvelle page de l'article
  useEffect(() => {
    const legacy = params.get('post');
    if (legacy) fetchSlugByLegacyId(legacy).then((slug) => slug && navigate(`/blog/${slug}`, { replace: true }));
  }, [params, navigate]);

  return (
    <section id="blog" className={`py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300 ${isPage ? 'min-h-screen' : ''}`}>
      <div className="container mx-auto px-4">
        <SectionHeader
          eyebrow={t.nav.blog}
          title={t.blog.title}
          subtitle={t.blog.subtitle}
          icon={Newspaper}
          accent="red"
          align="left"
          as={isPage ? 'h1' : 'h2'}
          action={
            !isPage && (
              <Link to="/blog" className={ViewAllClass('blue')}>
                {t.blog.viewAll} <ArrowRight stroke={2.2} size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )
          }
        />

        {error && <p className="text-paza-red">{t.blog.loadError}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg h-[26rem] animate-pulse border border-gray-100 dark:border-gray-700" />
            ))}
          {(data ?? []).map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {!loading && !error && data?.length === 0 && <p className="text-gray-500">{t.blog.empty}</p>}

        {!isPage && (
          <div className="mt-10 text-center md:hidden">
            <Link to="/blog" className={ViewAllClass('blue')}>
              {t.blog.viewAll} <ArrowRight stroke={2.2} size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
