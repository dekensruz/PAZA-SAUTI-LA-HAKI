import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { IconX as X, IconTrash as Trash, IconUpload as UploadSimple, IconDownload as DownloadSimple, IconPhoto as ImageSquare } from '@tabler/icons-react';
import { supabase } from '@/lib/supabase';
import { formatBytes, mediaUrl, removeMedia, uploadImage } from '@/lib/media';
import { ErrorNote, Spinner } from '@/components/ui';
import { CHANNELS, COLORS, STATUSES, type CalendarEvent, type EventColor, type EventStatus } from './types';
import { format } from 'date-fns';

interface Props {
  event: CalendarEvent;
  isNew: boolean;
  articles: { id: string; title_fr: string }[];
  onClose: () => void;
  onSaved: () => void;
}

const dateOf = (iso: string) => format(new Date(iso), 'yyyy-MM-dd');
const timeOf = (iso: string) => format(new Date(iso), 'HH:mm');
const combine = (date: string, time: string) => new Date(`${date}T${time || '00:00'}`).toISOString();

const EventDialog: React.FC<Props> = ({ event, isNew, articles, onClose, onSaved }) => {
  const [ev, setEv] = useState<CalendarEvent>(event);
  const [date, setDate] = useState(dateOf(event.start_at));
  const [time, setTime] = useState(timeOf(event.start_at));
  const [endTime, setEndTime] = useState(event.end_at ? timeOf(event.end_at) : '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedThisSession, setUploaded] = useState<string[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const set = <K extends keyof CalendarEvent>(k: K, v: CalendarEvent[K]) => setEv((e) => ({ ...e, [k]: v }));

  const close = () => {
    // Affiches envoyées puis abandonnées sans enregistrer : on nettoie le bucket
    if (uploadedThisSession.length) removeMedia(uploadedThisSession);
    onClose();
  };

  const addPosters = async (files: FileList | File[] | null) => {
    if (!files) return;
    for (const file of Array.from(files).filter((f) => f.type.startsWith('image/'))) {
      setUploading(`Compression de « ${file.name} »…`);
      try {
        const res = await uploadImage(file, `calendar/${ev.id}`, { maxWidth: 2000, maxHeight: 2000, quality: 0.82 });
        setEv((e) => ({ ...e, poster_paths: [...e.poster_paths, res.path] }));
        setUploaded((u) => [...u, res.path]);
        setUploading(`${formatBytes(res.originalBytes)} → ${formatBytes(res.bytes)}`);
      } catch (e) {
        setError((e as Error).message);
        setUploading(null);
      }
    }
  };

  const removePoster = (path: string) => setEv((e) => ({ ...e, poster_paths: e.poster_paths.filter((p) => p !== path) }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ev.title.trim()) return setError('Le titre est obligatoire.');
    const start_at = ev.all_day ? combine(date, '00:00') : combine(date, time);
    const end_at = !ev.all_day && endTime ? combine(date, endTime) : null;
    if (end_at && end_at < start_at) return setError("L'heure de fin doit être après l'heure de début.");
    setSaving(true);
    const removed = [...event.poster_paths, ...uploadedThisSession].filter((p) => !ev.poster_paths.includes(p));
    const { created_by: _ignored, ...rest } = ev;
    const { error } = await supabase.from('calendar_events').upsert({ ...rest, title: ev.title.trim(), start_at, end_at });
    setSaving(false);
    if (error) return setError(error.message);
    if (removed.length) removeMedia(removed);
    onSaved();
  };

  const destroy = async () => {
    if (!confirm('Supprimer cette publication planifiée et ses affiches ? Action irréversible.')) return;
    const { error } = await supabase.from('calendar_events').delete().eq('id', ev.id);
    if (error) return setError(error.message);
    removeMedia([...event.poster_paths, ...uploadedThisSession]);
    onSaved();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={close}>
      <motion.form
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onSubmit={save}
        onMouseDown={(e) => e.stopPropagation()}
        className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl dark:bg-ink"
      >
        <div className="flex items-center justify-between border-b border-ink/5 px-6 py-4 dark:border-white/10">
          <h2 className="font-display text-2xl font-semibold">{isNew ? 'Planifier une publication' : 'Modifier la publication'}</h2>
          <button type="button" onClick={close} className="flex size-9 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10"><X size={18} /></button>
        </div>

        <div className="space-y-5 overflow-y-auto px-6 py-5">
          <input autoFocus className="w-full bg-transparent font-display text-2xl font-semibold outline-none placeholder:text-slate-300" placeholder="Titre (ex. Affiche Journée de la paix)" value={ev.title} onChange={(e) => set('title', e.target.value)} />

          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <input type="date" required className="input" value={date} onChange={(e) => setDate(e.target.value)} />
            {!ev.all_day && (
              <div className="flex items-center gap-2">
                <input type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} />
                <span className="text-slate-400">→</span>
                <input type="time" className="input" value={endTime} onChange={(e) => setEndTime(e.target.value)} placeholder="fin" />
              </div>
            )}
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={ev.all_day} onChange={(e) => set('all_day', e.target.checked)} className="size-4 accent-paza-blue" /> Journée entière
            </label>
          </div>

          <div>
            <span className="label">Canaux de diffusion</span>
            <div className="flex flex-wrap gap-2">
              {CHANNELS.map(({ id, label, icon: Icon }) => {
                const on = ev.channels.includes(id);
                return (
                  <button key={id} type="button" onClick={() => set('channels', on ? ev.channels.filter((c) => c !== id) : [...ev.channels, id])} className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${on ? 'border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink' : 'border-ink/10 text-slate-500 hover:border-ink/30 dark:border-white/15'}`}>
                    <Icon size={15} /> {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <span className="label">Statut</span>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(STATUSES) as EventStatus[]).map((s) => (
                  <button key={s} type="button" onClick={() => set('status', s)} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold ${ev.status === s ? 'border-ink/30 bg-slate-100 dark:border-white/30 dark:bg-white/10' : 'border-ink/10 text-slate-500 dark:border-white/10'}`}>
                    <span className={`size-2 rounded-full ${STATUSES[s].dot}`} /> {STATUSES[s].label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="label">Couleur</span>
              <div className="flex gap-2">
                {(Object.keys(COLORS) as EventColor[]).map((c) => (
                  <button key={c} type="button" onClick={() => set('color', c)} aria-label={c} className={`size-8 rounded-full ${COLORS[c].swatch} ring-offset-2 transition dark:ring-offset-ink ${ev.color === c ? 'ring-2 ring-ink dark:ring-white' : ''}`} />
                ))}
              </div>
            </div>
          </div>

          <label className="block">
            <span className="label">Description / texte de la publication</span>
            <textarea rows={5} className="input resize-y" value={ev.description ?? ''} onChange={(e) => set('description', e.target.value)} placeholder="Légende, hashtags, consignes pour l'équipe…" />
          </label>

          <div>
            <span className="label">Affiches</span>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {ev.poster_paths.map((p) => (
                <div key={p} className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-slate-100 dark:bg-white/5">
                  <img src={mediaUrl(p)} alt="" className="size-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/60 opacity-0 transition group-hover:opacity-100">
                    <a href={mediaUrl(p)} target="_blank" rel="noreferrer" download className="flex size-9 items-center justify-center rounded-full bg-white text-ink"><DownloadSimple size={16} /></a>
                    <button type="button" onClick={() => removePoster(p)} className="flex size-9 items-center justify-center rounded-full bg-white text-paza-red"><Trash size={16} /></button>
                  </div>
                </div>
              ))}
              <label
                className="flex aspect-[4/5] cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-ink/10 text-center text-xs font-semibold text-slate-400 hover:border-paza-blue hover:text-paza-blue dark:border-white/15"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); addPosters(e.dataTransfer.files); }}
              >
                {uploading?.startsWith('Compression') ? <Spinner className="size-5" /> : ev.poster_paths.length ? <UploadSimple size={22} /> : <ImageSquare size={22} />}
                Ajouter
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => addPosters(e.target.files)} />
              </label>
            </div>
            {uploading && !uploading.startsWith('Compression') && <p className="mt-2 text-xs text-slate-500">Dernière affiche compressée : {uploading}</p>}
          </div>

          <label className="block">
            <span className="label">Article lié (facultatif)</span>
            <select className="input" value={ev.article_id ?? ''} onChange={(e) => set('article_id', e.target.value || null)}>
              <option value="">— Aucun —</option>
              {articles.map((a) => (
                <option key={a.id} value={a.id}>{a.title_fr}</option>
              ))}
            </select>
          </label>

          {error && <ErrorNote>{error}</ErrorNote>}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-ink/5 px-6 py-4 dark:border-white/10">
          {!isNew ? (
            <button type="button" onClick={destroy} className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-paza-red"><Trash size={16} /> Supprimer</button>
          ) : <span />}
          <div className="flex gap-2">
            <button type="button" onClick={close} className="btn-ghost !py-2.5">Annuler</button>
            <button disabled={saving} className="btn-blue !py-2.5">{saving ? <Spinner className="size-4" /> : 'Enregistrer'}</button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default EventDialog;
