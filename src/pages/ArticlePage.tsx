import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { motion } from 'framer-motion';
import { ArrowLeft, CalendarBlank, Clock, Eye } from '@phosphor-icons/react';
import { useLanguage } from '@/i18n/LanguageContext';
import { articleState, fetchArticleBySlug, fetchRelatedArticles, loc, readingMinutes } from '@/lib/articles';
import { mediaUrl } from '@/lib/media';
import { formatDate } from '@/lib/format';
import { SITE_URL } from '@/lib/supabase';
import { useAsync } from '@/lib/useAsync';
import { useSeo } from '@/lib/useSeo';
import ShareMenu from '@/components/ShareMenu';
import ArticleCard from '@/components/ArticleCard';
import Lightbox from '@/components/Lightbox';
import { ErrorNote, Reveal, Spinner } from '@/components/ui';

export function sanitizeArticleHtml(html: string) {
  return DOMPurify.sanitize(html, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allowfullscreen', 'frameborder', 'target', 'width', 'height', 'style'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
  });
}

const ArticlePage: React.FC = () => {
  const { slug = '' } = useParams();
  const { t, language } = useLanguage();
  const { data: article, error, loading } = useAsync(() => fetchArticleBySlug(slug), [slug]);
  const { data: related } = useAsync(() => (article ? fetchRelatedArticles(article.id) : Promise.resolve([])), [article?.id]);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const title = article ? loc(article, 'title', language) : '';
  const summary = article ? loc(article, 'summary', language) : '';
  const html = useMemo(() => (article ? sanitizeArticleHtml(loc(article, 'content', language)) : ''), [article, language]);
  const inlineImages = useMemo(() => Array.from(html.matchAll(/<img[^>]+src="([^"]+)"/g)).map((m) => ({ src: m[1] })), [html]);

  useSeo({ title: title || undefined, description: summary || undefined, image: article?.og_image_path || article?.cover_path, path: `/blog/${slug}`, type: 'article' });

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center pt-24 text-paza-blue">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container-page flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
        {error ? <ErrorNote>{t.blog.loadError}</ErrorNote> : <p className="font-display text-3xl text-ink dark:text-white">{t.blog.notFound}</p>}
        <Link to="/blog" className="btn-primary mt-8">
          <ArrowLeft size={16} weight="bold" /> {t.blog.backToBlog}
        </Link>
      </div>
    );
  }

  const state = articleState(article);
  const shareUrl = `${SITE_URL}/blog/${article.slug}`;

  const onContentClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      const i = inlineImages.findIndex((img) => img.src === (target as HTMLImageElement).getAttribute('src'));
      if (i >= 0) setLightbox(i);
    }
  };

  return (
    <article className="pt-32 pb-24 md:pt-40">
      {state !== 'published' && (
        <div className="container-page mb-6">
          <div className="flex items-center gap-2 rounded-2xl bg-paza-yellow/30 px-5 py-3 text-sm font-semibold text-ink">
            <Eye size={18} weight="bold" />
            Aperçu administrateur — {state === 'draft' ? 'brouillon non publié' : `programmé pour le ${formatDate(article.published_at, 'fr', "d MMMM yyyy 'à' HH:mm")}`}
          </div>
        </div>
      )}

      <header className="container-page max-w-4xl text-center">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-ink dark:hover:text-white">
          <ArrowLeft size={16} weight="bold" /> {t.blog.backToBlog}
        </Link>
        {article.tags?.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {article.tags.map((tg) => (
              <span key={tg} className="rounded-full bg-paza-red/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-paza-red">{tg}</span>
            ))}
          </div>
        )}
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 font-display text-4xl leading-[1.02] font-semibold tracking-tight text-balance text-ink md:text-6xl lg:text-7xl dark:text-white">
          {title}
        </motion.h1>
        {summary && <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-pretty text-slate-600 dark:text-slate-400">{summary}</p>}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-slate-500">
          <span className="flex items-center gap-2"><CalendarBlank size={16} /> {formatDate(article.published_at, language)}</span>
          <span className="flex items-center gap-2"><Clock size={16} /> {readingMinutes(html)} {t.blog.minRead}</span>
          {article.author && <span>{article.author}</span>}
        </div>
      </header>

      {article.cover_path && (
        <motion.figure initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="container-page mt-14 max-w-6xl">
          <div className="relative overflow-hidden rounded-[2rem] bg-ink">
            <img src={mediaUrl(article.cover_path)} alt="" aria-hidden className="absolute inset-0 size-full scale-110 object-cover opacity-50 blur-2xl" />
            <img src={mediaUrl(article.cover_path)} alt={article.cover_alt ?? title} className="relative mx-auto max-h-[78vh] w-auto object-contain" fetchPriority="high" />
          </div>
        </motion.figure>
      )}

      <div className="container-page mt-16 grid max-w-6xl gap-12 lg:grid-cols-[1fr_minmax(0,46rem)_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-32 flex flex-col gap-3">
            <ShareMenu url={shareUrl} title={title} summary={summary} variant="compact" />
          </div>
        </aside>
        <div>
          <div className="article-content" onClick={onContentClick} dangerouslySetInnerHTML={{ __html: html }} />
          <div className="mt-14 border-t border-ink/10 pt-8 dark:border-white/10">
            <ShareMenu url={shareUrl} title={title} summary={summary} />
          </div>
        </div>
      </div>

      {related && related.length > 0 && (
        <section className="container-page mt-28">
          <h2 className="mb-10 font-display text-3xl font-semibold text-ink md:text-4xl dark:text-white">{t.blog.related}</h2>
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-3">
            {related.map((a, i) => (
              <Reveal key={a.id} delay={i * 0.06}>
                <ArticleCard article={a} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <Lightbox images={inlineImages} index={lightbox} onChange={setLightbox} />
    </article>
  );
};

export default ArticlePage;
