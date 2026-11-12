import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from '@phosphor-icons/react';
import { useLanguage } from '@/i18n/LanguageContext';
import { loc, type ArticleCardFields } from '@/lib/articles';
import { mediaUrl } from '@/lib/media';
import { formatDate } from '@/lib/format';
import { Img } from './ui';

interface Props {
  article: ArticleCardFields;
  variant?: 'default' | 'featured' | 'compact';
}

const ArticleCard: React.FC<Props> = ({ article, variant = 'default' }) => {
  const { language } = useLanguage();
  const title = loc(article, 'title', language);
  const summary = loc(article, 'summary', language);
  const date = formatDate(article.published_at, language);
  const to = `/blog/${article.slug}`;

  if (variant === 'featured') {
    return (
      <Link to={to} className="group card grid overflow-hidden md:grid-cols-2">
        <div className="relative aspect-[4/3] md:aspect-auto">
          <Img src={mediaUrl(article.cover_path)} alt={article.cover_alt ?? title} wrapperClassName="absolute inset-0" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </div>
        <div className="flex flex-col justify-center gap-5 p-8 md:p-12">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            <time dateTime={article.published_at ?? undefined}>{date}</time>
            {article.tags?.[0] && (
              <>
                <span className="size-1 rounded-full bg-paza-red" />
                <span className="text-paza-red">{article.tags[0]}</span>
              </>
            )}
          </div>
          <h3 className="font-display text-3xl leading-tight font-semibold tracking-tight text-ink md:text-4xl dark:text-white">{title}</h3>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">{summary}</p>
          <span className="mt-2 inline-flex size-12 items-center justify-center rounded-full bg-ink text-white transition group-hover:rotate-45 group-hover:bg-paza-blue dark:bg-white dark:text-ink">
            <ArrowUpRight size={20} weight="bold" />
          </span>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link to={to} className="group flex gap-4">
        <Img src={mediaUrl(article.cover_path)} alt="" wrapperClassName="size-20 shrink-0 rounded-2xl" className="size-full object-cover" />
        <div className="min-w-0">
          <time className="text-xs font-semibold text-slate-500">{date}</time>
          <h4 className="mt-1 line-clamp-2 font-display text-lg leading-snug font-semibold text-ink group-hover:text-paza-blue dark:text-white">{title}</h4>
        </div>
      </Link>
    );
  }

  return (
    <Link to={to} className="group flex h-full flex-col">
      <div className="relative overflow-hidden rounded-3xl">
        <Img src={mediaUrl(article.cover_path)} alt={article.cover_alt ?? title} wrapperClassName="aspect-[4/3]" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute top-4 right-4 flex size-10 translate-y-2 items-center justify-center rounded-full bg-white text-ink opacity-0 shadow-lg transition group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={18} weight="bold" />
        </span>
      </div>
      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          <time dateTime={article.published_at ?? undefined}>{date}</time>
          {article.tags?.[0] && (
            <>
              <span className="size-1 rounded-full bg-paza-red" />
              <span className="text-paza-red">{article.tags[0]}</span>
            </>
          )}
        </div>
        <h3 className="mt-3 font-display text-2xl leading-snug font-semibold tracking-tight text-ink transition group-hover:text-paza-blue dark:text-white">{title}</h3>
        <p className="mt-3 line-clamp-3 leading-relaxed text-slate-600 dark:text-slate-400">{summary}</p>
      </div>
    </Link>
  );
};

export const ArticleCardSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="aspect-[4/3] rounded-3xl bg-slate-200 dark:bg-white/5" />
    <div className="mt-5 h-3 w-32 rounded bg-slate-200 dark:bg-white/5" />
    <div className="mt-4 h-6 w-4/5 rounded bg-slate-200 dark:bg-white/5" />
    <div className="mt-3 h-4 w-full rounded bg-slate-200 dark:bg-white/5" />
  </div>
);

export default ArticleCard;
