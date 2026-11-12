import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { useLanguage } from '@/i18n/LanguageContext';
import { fetchPublishedArticles, fetchSlugByLegacyId, loc } from '@/lib/articles';
import { useAsync } from '@/lib/useAsync';
import { useSeo } from '@/lib/useSeo';
import ArticleCard, { ArticleCardSkeleton } from '@/components/ArticleCard';
import { ErrorNote, Reveal } from '@/components/ui';

const BlogPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState<string | null>(null);
  const { data, error, loading } = useAsync(() => fetchPublishedArticles(), []);
  useSeo({ title: t.nav.blog, description: t.blog.blogIntro, path: '/blog' });

  // Compatibilité avec les anciens liens partagés : /blog?post=6
  useEffect(() => {
    const legacy = params.get('post');
    if (legacy) fetchSlugByLegacyId(legacy).then((slug) => slug && navigate(`/blog/${slug}`, { replace: true }));
  }, [params, navigate]);

  const tags = useMemo(() => Array.from(new Set((data ?? []).flatMap((a) => a.tags ?? []))).slice(0, 12), [data]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? []).filter(
      (a) => (!tag || a.tags?.includes(tag)) && (!q || `${loc(a, 'title', language)} ${loc(a, 'summary', language)}`.toLowerCase().includes(q)),
    );
  }, [data, query, tag, language]);
  const [featured, ...rest] = filtered;
  const showFeatured = !query && !tag;

  return (
    <section className="pt-36 pb-24 md:pt-44 md:pb-32">
      <div className="container-page">
        <header className="mb-14 grid gap-8 md:mb-20 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <span className="eyebrow mb-5">{t.nav.blog}</span>
            <h1 className="font-display text-5xl leading-[0.98] font-semibold tracking-tight text-ink md:text-7xl dark:text-white">{t.blog.allArticles}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">{t.blog.blogIntro}</p>
          </div>
          <div className="lg:col-span-5">
            <label className="relative block">
              <MagnifyingGlass size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.blog.search} className="input !rounded-full !py-3.5 !pl-11" type="search" />
            </label>
            {tags.length > 0 && (
              <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
                {tags.map((tg) => (
                  <button key={tg} onClick={() => setTag(tag === tg ? null : tg)} className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition ${tag === tg ? 'border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink' : 'border-ink/10 text-slate-600 hover:border-ink/30 dark:border-white/15 dark:text-slate-300'}`}>
                    #{tg}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {error && <ErrorNote>{t.blog.loadError}</ErrorNote>}
        {loading && (
          <div className="grid gap-10 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <ArticleCardSkeleton key={i} />)}
          </div>
        )}

        {showFeatured && featured && (
          <Reveal className="mb-16">
            <ArticleCard article={featured} variant="featured" />
          </Reveal>
        )}

        <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {(showFeatured ? rest : filtered).map((a, i) => (
            <Reveal key={a.id} delay={(i % 3) * 0.06}>
              <ArticleCard article={a} />
            </Reveal>
          ))}
        </div>

        {!loading && !error && filtered.length === 0 && <p className="py-16 text-center text-slate-500">{data?.length ? t.blog.noResults : t.blog.empty}</p>}
      </div>
    </section>
  );
};

export default BlogPage;
