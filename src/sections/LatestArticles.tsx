import React from 'react';
import { ArrowRight } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { fetchPublishedArticles } from '@/lib/articles';
import { useAsync } from '@/lib/useAsync';
import ArticleCard, { ArticleCardSkeleton } from '@/components/ArticleCard';
import { ErrorNote, Reveal, SectionHeading } from '@/components/ui';

const LatestArticles: React.FC = () => {
  const { t } = useLanguage();
  const { data, error, loading } = useAsync(() => fetchPublishedArticles(4), []);
  const [featured, ...others] = data ?? [];

  return (
    <section id="blog" className="scroll-mt-24 bg-white py-24 md:py-32 dark:bg-ink/40">
      <div className="container-page">
        <SectionHeading
          eyebrow={t.nav.blog}
          title={t.blog.title}
          subtitle={t.blog.subtitle}
          action={
            <Link to="/blog" className="btn-ghost group shrink-0">
              {t.blog.viewAll} <ArrowRight size={16} weight="bold" className="transition group-hover:translate-x-1" />
            </Link>
          }
        />
        {error && <ErrorNote>{t.blog.loadError}</ErrorNote>}
        {loading && (
          <div className="grid gap-10 md:grid-cols-3">
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
          </div>
        )}
        {featured && (
          <Reveal>
            <ArticleCard article={featured} variant="featured" />
          </Reveal>
        )}
        {others.length > 0 && (
          <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-3">
            {others.map((a, i) => (
              <Reveal key={a.id} delay={i * 0.08}>
                <ArticleCard article={a} />
              </Reveal>
            ))}
          </div>
        )}
        {!loading && !error && !featured && <p className="text-slate-500">{t.blog.empty}</p>}
      </div>
    </section>
  );
};

export default LatestArticles;
