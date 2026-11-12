import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconPlus as Plus, IconSearch as MagnifyingGlass, IconPencil as PencilSimple, IconExternalLink as ArrowSquareOut } from '@tabler/icons-react';
import { supabase } from '@/lib/supabase';
import { articleState, type ArticleRow, type ArticleState } from '@/lib/articles';
import { mediaUrl } from '@/lib/media';
import { formatDate } from '@/lib/format';
import { useAsync } from '@/lib/useAsync';
import { ErrorNote, Spinner } from '@/components/ui';

export const stateBadge: Record<ArticleState, { label: string; cls: string }> = {
  draft: { label: 'Brouillon', cls: 'bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300' },
  scheduled: { label: 'Programmé', cls: 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300' },
  published: { label: 'Publié', cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300' },
};

type Row = Pick<ArticleRow, 'id' | 'slug' | 'title_fr' | 'status' | 'published_at' | 'cover_path' | 'updated_at' | 'title_en'>;

const ArticlesPage: React.FC = () => {
  const [filter, setFilter] = useState<ArticleState | 'all'>('all');
  const [q, setQ] = useState('');
  const { data, error, loading } = useAsync(async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('id, slug, title_fr, title_en, status, published_at, cover_path, updated_at')
      .order('published_at', { ascending: false, nullsFirst: true });
    if (error) throw error;
    return data as Row[];
  }, []);

  const counts = useMemo(() => {
    const c = { all: 0, draft: 0, scheduled: 0, published: 0 };
    (data ?? []).forEach((a) => {
      c.all++;
      c[articleState(a)]++;
    });
    return c;
  }, [data]);

  const rows = (data ?? []).filter((a) => (filter === 'all' || articleState(a) === filter) && (!q || a.title_fr.toLowerCase().includes(q.toLowerCase())));

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold">Articles</h1>
          <p className="mt-1 text-slate-500">Rédigez, programmez et publiez les articles du blog.</p>
        </div>
        <Link to="/admin/articles/new" className="btn-blue">
          <Plus size={18} stroke={2.2} /> Nouvel article
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-white p-1 shadow-sm dark:bg-white/5">
          {(['all', 'published', 'scheduled', 'draft'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${filter === f ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'text-slate-500 hover:text-ink dark:hover:text-white'}`}>
              {f === 'all' ? 'Tous' : stateBadge[f].label} <span className="ml-1 opacity-60">{counts[f]}</span>
            </button>
          ))}
        </div>
        <label className="relative md:w-72">
          <MagnifyingGlass size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400" />
          <input className="input !rounded-full !py-2.5 !pl-10" placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>

      {error && <ErrorNote>{error.message}</ErrorNote>}
      {loading && <div className="flex justify-center py-20 text-paza-blue"><Spinner /></div>}

      <div className="card divide-y divide-ink/5 overflow-hidden dark:divide-white/5">
        {rows.map((a) => {
          const st = articleState(a);
          return (
            <div key={a.id} className="flex items-center gap-4 p-4 transition hover:bg-slate-50 dark:hover:bg-white/5">
              <img src={mediaUrl(a.cover_path)} alt="" className="size-16 shrink-0 rounded-xl bg-slate-200 object-cover dark:bg-white/10" />
              <div className="min-w-0 flex-1">
                <Link to={`/admin/articles/${a.id}`} className="line-clamp-1 font-bold hover:text-paza-blue">{a.title_fr}</Link>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className={`rounded-full px-2 py-0.5 font-bold ${stateBadge[st].cls}`}>{stateBadge[st].label}</span>
                  {a.published_at && <span>{formatDate(a.published_at, 'fr', "d MMM yyyy 'à' HH:mm")}</span>}
                  {!a.title_en && <span className="text-amber-600">EN manquant</span>}
                </div>
              </div>
              <a href={`/blog/${a.slug}`} target="_blank" rel="noreferrer" className="hidden size-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 sm:flex dark:hover:bg-white/10" title="Voir">
                <ArrowSquareOut size={18} />
              </a>
              <Link to={`/admin/articles/${a.id}`} className="flex size-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10" title="Modifier">
                <PencilSimple size={18} />
              </Link>
            </div>
          );
        })}
        {!loading && rows.length === 0 && <p className="p-10 text-center text-slate-500">Aucun article.</p>}
      </div>
    </div>
  );
};

export default ArticlesPage;
