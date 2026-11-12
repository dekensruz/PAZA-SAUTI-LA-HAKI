import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IconArrowLeft as ArrowLeft, IconExternalLink as ArrowSquareOut, IconDeviceFloppy as FloppyDisk, IconPhoto as ImageSquare, IconTrash as Trash, IconUpload as UploadSimple, IconCalendarCheck as CalendarCheck } from '@tabler/icons-react';
import { supabase, SITE_URL } from '@/lib/supabase';
import { articleState, slugify, type ArticleRow } from '@/lib/articles';
import { formatBytes, mediaUrl, removeMedia, uploadCover } from '@/lib/media';
import { ErrorNote, Spinner } from '@/components/ui';
import RichEditor, { type RichEditorHandle } from './RichEditor';
import { stateBadge } from './ArticlesPage';
import { fromLocalInput, toLocalInput } from './dates';

type Form = Omit<ArticleRow, 'created_at' | 'updated_at' | 'legacy_id'>;

const blank = (): Form => ({
  id: crypto.randomUUID(),
  slug: '',
  status: 'draft',
  published_at: null,
  title_fr: '',
  title_en: '',
  summary_fr: '',
  summary_en: '',
  content_fr: '',
  content_en: '',
  cover_path: null,
  og_image_path: null,
  cover_alt: '',
  author: 'Paza Sauti La Haki',
  tags: [],
});

const ArticleEditorPage: React.FC = () => {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const [form, setForm] = useState<Form | null>(isNew ? blank() : null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);
  const [coverBusy, setCoverBusy] = useState<string | null>(null);
  const frRef = useRef<RichEditorHandle>(null);
  const enRef = useRef<RichEditorHandle>(null);

  useEffect(() => {
    if (isNew) return;
    supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) setLoadError(error?.message ?? 'Article introuvable.');
        else setForm(data as Form);
      });
  }, [id, isNew]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => (f ? { ...f, [key]: value } : f));
    setDirty(true);
  };

  const onTitleFr = (v: string) => {
    set('title_fr', v);
    if (!slugTouched) setForm((f) => (f ? { ...f, title_fr: v, slug: slugify(v) } : f));
  };

  const onCover = async (file?: File) => {
    if (!file || !form) return;
    setCoverBusy('Compression…');
    try {
      const old = [form.cover_path, form.og_image_path];
      const res = await uploadCover(file, `articles/${form.id}`);
      setForm((f) => (f ? { ...f, cover_path: res.coverPath, og_image_path: res.ogPath } : f));
      setDirty(true);
      setCoverBusy(`${formatBytes(res.originalBytes)} → ${formatBytes(res.bytes)} (couverture + image de partage)`);
      // Les anciennes images ne sont supprimées que si elles appartenaient à ce dossier d'article
      removeMedia(old.filter((p) => p?.startsWith(`articles/${form.id}/`)));
    } catch (e) {
      setCoverBusy(null);
      setMessage({ type: 'error', text: `Envoi de la couverture impossible : ${(e as Error).message}` });
    }
  };

  const save = async (override?: Partial<Form>) => {
    if (!form) return;
    const payload: Form = {
      ...form,
      ...override,
      content_fr: frRef.current?.getHTML() ?? form.content_fr,
      content_en: enRef.current?.getHTML() ?? form.content_en,
      title_en: form.title_en?.trim() || null,
      summary_en: form.summary_en?.trim() || null,
      cover_alt: form.cover_alt?.trim() || null,
    };
    if (!payload.title_fr.trim()) return setMessage({ type: 'error', text: 'Le titre (FR) est obligatoire.' });
    if (!payload.slug) payload.slug = slugify(payload.title_fr);
    if (payload.status === 'published' && !payload.published_at) payload.published_at = new Date().toISOString();

    setSaving(true);
    setMessage(null);
    const { error } = await supabase.from('articles').upsert(payload);
    setSaving(false);
    if (error) {
      setMessage({ type: 'error', text: error.code === '23505' ? 'Ce lien (slug) est déjà utilisé par un autre article.' : error.message });
      return;
    }
    setForm(payload);
    setDirty(false);
    const st = articleState(payload);
    setMessage({ type: 'ok', text: st === 'published' ? 'Article publié ✓' : st === 'scheduled' ? 'Publication programmée ✓' : 'Brouillon enregistré ✓' });
    if (isNew) navigate(`/admin/articles/${payload.id}`, { replace: true });
  };

  const destroy = async () => {
    if (!form || !confirm('Supprimer définitivement cet article ? Cette action est irréversible.')) return;
    const { error } = await supabase.from('articles').delete().eq('id', form.id);
    if (error) return setMessage({ type: 'error', text: error.message });
    removeMedia([form.cover_path, form.og_image_path].filter((p) => p?.startsWith(`articles/${form.id}/`)));
    setDirty(false);
    navigate('/admin');
  };

  const state = form ? articleState(form) : 'draft';
  const scheduledLabel = useMemo(() => {
    if (!form?.published_at) return null;
    return new Date(form.published_at) > new Date() ? 'Sera publié automatiquement à cette date.' : null;
  }, [form?.published_at]);

  if (loadError) return <ErrorNote>{loadError}</ErrorNote>;
  if (!form) return <div className="flex justify-center py-24 text-paza-blue"><Spinner /></div>;

  const shareUrl = `${SITE_URL}/blog/${form.slug || 'mon-article'}`;

  return (
    <div className="pb-24">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-ink dark:hover:text-white">
          <ArrowLeft size={16} stroke={2.2} /> Articles
        </Link>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${stateBadge[state].cls}`}>{stateBadge[state].label}</span>
          {!isNew && (
            <a href={`/blog/${form.slug}`} target="_blank" rel="noreferrer" className="btn-ghost !px-4 !py-2">
              <ArrowSquareOut size={16} /> Aperçu
            </a>
          )}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Colonne principale */}
        <div className="min-w-0 space-y-6">
          <div className="flex gap-1 rounded-full bg-white p-1 shadow-sm sm:w-fit dark:bg-white/5">
            {(['fr', 'en'] as const).map((l) => (
              <button key={l} type="button" onClick={() => setLang(l)} className={`flex-1 rounded-full px-5 py-2 text-sm font-bold transition sm:flex-none ${lang === l ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'text-slate-500'}`}>
                {l === 'fr' ? 'Français' : 'English (optionnel)'}
              </button>
            ))}
          </div>

          <div className={lang === 'fr' ? 'space-y-4' : 'hidden'}>
            <input className="w-full bg-transparent font-display text-4xl font-semibold tracking-tight outline-none placeholder:text-slate-300 md:text-5xl dark:placeholder:text-slate-600" placeholder="Titre de l'article" value={form.title_fr} onChange={(e) => onTitleFr(e.target.value)} />
            <textarea className="input resize-none text-base" rows={2} placeholder="Résumé (affiché sur les cartes et dans les aperçus de partage)" value={form.summary_fr ?? ''} onChange={(e) => set('summary_fr', e.target.value)} maxLength={300} />
            <RichEditor ref={frRef} initialHTML={form.content_fr} folder={`articles/${form.id}`} placeholder="Rédigez votre article… (glissez-déposez ou collez des images)" onChange={() => setDirty(true)} />
          </div>
          <div className={lang === 'en' ? 'space-y-4' : 'hidden'}>
            <input className="w-full bg-transparent font-display text-4xl font-semibold tracking-tight outline-none placeholder:text-slate-300 md:text-5xl dark:placeholder:text-slate-600" placeholder="Article title" value={form.title_en ?? ''} onChange={(e) => set('title_en', e.target.value)} />
            <textarea className="input resize-none text-base" rows={2} placeholder="Summary" value={form.summary_en ?? ''} onChange={(e) => set('summary_en', e.target.value)} maxLength={300} />
            <RichEditor ref={enRef} initialHTML={form.content_en ?? ''} folder={`articles/${form.id}`} placeholder="Write the English version… (falls back to French if empty)" onChange={() => setDirty(true)} />
          </div>
        </div>

        {/* Panneau latéral */}
        <aside className="space-y-5">
          <section className="card space-y-4 p-5">
            <h2 className="font-bold">Publication</h2>
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-white/5">
              {(['draft', 'published'] as const).map((s) => (
                <button key={s} type="button" onClick={() => set('status', s)} className={`rounded-lg py-2 text-sm font-bold transition ${form.status === s ? 'bg-white shadow-sm dark:bg-white/15' : 'text-slate-500'}`}>
                  {s === 'draft' ? 'Brouillon' : 'Publier'}
                </button>
              ))}
            </div>
            <label className="block">
              <span className="label">Date de publication</span>
              <input type="datetime-local" className="input" value={toLocalInput(form.published_at)} onChange={(e) => set('published_at', fromLocalInput(e.target.value))} />
              {scheduledLabel && form.status === 'published' && (
                <span className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-amber-600"><CalendarCheck size={14} /> {scheduledLabel}</span>
              )}
            </label>
            {message && (message.type === 'error' ? <ErrorNote>{message.text}</ErrorNote> : <p className="text-sm font-semibold text-emerald-600">{message.text}</p>)}
            <button type="button" onClick={() => save()} disabled={saving} className="btn-blue w-full">
              {saving ? <Spinner className="size-4" /> : <FloppyDisk size={18} stroke={2.2} />} Enregistrer
            </button>
            {!isNew && (
              <button type="button" onClick={destroy} className="flex w-full items-center justify-center gap-2 text-sm font-semibold text-slate-400 hover:text-paza-red">
                <Trash size={16} /> Supprimer l'article
              </button>
            )}
          </section>

          <section className="card space-y-3 p-5">
            <h2 className="font-bold">Image de couverture</h2>
            <label className="group relative flex aspect-[1200/630] cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-ink/10 bg-slate-50 dark:border-white/10 dark:bg-white/5"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); onCover(e.dataTransfer.files[0]); }}
            >
              {form.cover_path ? (
                <img src={mediaUrl(form.cover_path)} alt="" className="absolute inset-0 size-full object-cover" />
              ) : (
                <span className="flex flex-col items-center gap-2 text-sm font-semibold text-slate-400"><ImageSquare size={32} /> Choisir ou déposer une image</span>
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-ink/50 text-sm font-bold text-white opacity-0 transition group-hover:opacity-100">
                <UploadSimple size={20} className="mr-2" /> Remplacer
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onCover(e.target.files?.[0])} />
            </label>
            {coverBusy && <p className="text-xs font-semibold text-slate-500">{coverBusy}</p>}
            <input className="input" placeholder="Texte alternatif (accessibilité)" value={form.cover_alt ?? ''} onChange={(e) => set('cover_alt', e.target.value)} />
          </section>

          <section className="card space-y-3 p-5">
            <h2 className="font-bold">Aperçu du partage</h2>
            <div className="overflow-hidden rounded-xl border border-ink/10 dark:border-white/10">
              {form.og_image_path || form.cover_path ? (
                <img src={mediaUrl(form.og_image_path || form.cover_path)} alt="" className="aspect-[1200/630] w-full object-cover" />
              ) : (
                <div className="flex aspect-[1200/630] items-center justify-center bg-slate-100 text-xs text-slate-400 dark:bg-white/5">Pas d'image</div>
              )}
              <div className="bg-slate-50 p-3 dark:bg-white/5">
                <p className="text-[11px] tracking-wide text-slate-500 uppercase">{new URL(SITE_URL).host}</p>
                <p className="line-clamp-2 text-sm font-bold">{form.title_fr || 'Titre de l’article'}</p>
                <p className="line-clamp-2 text-xs text-slate-500">{form.summary_fr || 'Résumé de l’article'}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">C'est ainsi que le lien apparaîtra sur WhatsApp, Facebook, X ou LinkedIn.</p>
          </section>

          <section className="card space-y-3 p-5">
            <h2 className="font-bold">Détails</h2>
            <label className="block">
              <span className="label">Lien de l'article</span>
              <div className="flex items-center rounded-xl border border-ink/10 bg-white text-sm dark:border-white/10 dark:bg-ink">
                <span className="pl-3 text-slate-400">/blog/</span>
                <input className="w-full bg-transparent px-1 py-3 outline-none" value={form.slug} onChange={(e) => { setSlugTouched(true); set('slug', slugify(e.target.value)); }} />
              </div>
              <span className="mt-1 block truncate text-xs text-slate-400">{shareUrl}</span>
            </label>
            <label className="block">
              <span className="label">Étiquettes (séparées par des virgules)</span>
              <input className="input" value={form.tags.join(', ')} onChange={(e) => set('tags', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} placeholder="justice, paix" />
            </label>
            <label className="block">
              <span className="label">Auteur</span>
              <input className="input" value={form.author ?? ''} onChange={(e) => set('author', e.target.value)} />
            </label>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default ArticleEditorPage;
