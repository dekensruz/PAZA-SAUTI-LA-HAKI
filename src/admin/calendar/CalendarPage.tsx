import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  addDays, addMonths, addWeeks, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, startOfDay, startOfMonth, startOfWeek, subMonths, subWeeks, differenceInMinutes, setHours, setMinutes,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { CaretLeft, CaretRight, Plus, Article, Images } from '@phosphor-icons/react';
import { supabase } from '@/lib/supabase';
import { articleState } from '@/lib/articles';
import { mediaUrl } from '@/lib/media';
import { ErrorNote, Spinner } from '@/components/ui';
import EventDialog from './EventDialog';
import { CHANNELS, COLORS, STATUSES, type CalendarEvent, type CalendarItem } from './types';

type View = 'month' | 'week' | 'agenda';
const HOUR_START = 6;
const HOUR_END = 23;
const HOUR_PX = 52;
const opts = { weekStartsOn: 1 as const, locale: fr };

function rangeFor(view: View, cursor: Date): [Date, Date] {
  if (view === 'month') return [startOfWeek(startOfMonth(cursor), opts), endOfWeek(endOfMonth(cursor), opts)];
  if (view === 'week') return [startOfWeek(cursor, opts), endOfWeek(cursor, opts)];
  return [startOfDay(cursor), addDays(startOfDay(cursor), 60)];
}

const newEvent = (start: Date, allDay = false): CalendarEvent => ({
  id: crypto.randomUUID(),
  title: '',
  description: '',
  start_at: start.toISOString(),
  end_at: null,
  all_day: allDay,
  status: 'planned',
  channels: ['facebook', 'instagram'],
  color: 'blue',
  poster_paths: [],
  article_id: null,
});

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<View>(() => (window.innerWidth < 768 ? 'agenda' : 'month'));
  const [cursor, setCursor] = useState(new Date());
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [articles, setArticles] = useState<{ id: string; title_fr: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ event: CalendarEvent; isNew: boolean } | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const [from, to] = useMemo(() => rangeFor(view, cursor), [view, cursor]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [evRes, artRes, allArt] = await Promise.all([
      supabase.from('calendar_events').select('*').gte('start_at', from.toISOString()).lte('start_at', to.toISOString()).order('start_at'),
      supabase.from('articles').select('id, slug, title_fr, status, published_at, cover_path').gte('published_at', from.toISOString()).lte('published_at', to.toISOString()),
      supabase.from('articles').select('id, title_fr').order('published_at', { ascending: false }),
    ]);
    if (evRes.error || artRes.error) setError((evRes.error ?? artRes.error)!.message);
    const evItems: CalendarItem[] = ((evRes.data ?? []) as CalendarEvent[]).map((e) => ({
      kind: 'event', id: e.id, title: e.title, start: new Date(e.start_at), end: e.end_at ? new Date(e.end_at) : null, allDay: e.all_day, color: e.color, status: e.status, event: e,
    }));
    const artItems: CalendarItem[] = (artRes.data ?? []).map((a) => {
      const st = articleState(a as { status: 'draft' | 'published'; published_at: string });
      return {
        kind: 'article', id: a.id as string, title: a.title_fr as string, start: new Date(a.published_at as string), end: null, allDay: false,
        color: 'slate', status: st === 'published' ? 'published' : st === 'scheduled' ? 'ready' : 'idea', slug: a.slug as string, cover: a.cover_path as string | null,
      };
    });
    setItems([...evItems, ...artItems].sort((a, b) => a.start.getTime() - b.start.getTime()));
    setArticles((allArt.data ?? []) as { id: string; title_fr: string }[]);
    setLoading(false);
  }, [from, to]);

  useEffect(() => {
    load();
  }, [load]);

  const open = (item: CalendarItem) => {
    if (item.kind === 'article') navigate(`/admin/articles/${item.id}`);
    else setEditing({ event: item.event, isNew: false });
  };

  const create = (day: Date, hour?: number) => {
    const start = hour !== undefined ? setMinutes(setHours(day, hour), 0) : setHours(startOfDay(day), 9);
    setEditing({ event: newEvent(start), isNew: true });
  };

  /** Glisser-déposer : déplace l'élément au jour (et éventuellement à l'heure) cible. */
  const move = async (key: string, day: Date, hour?: number) => {
    const item = items.find((i) => `${i.kind}:${i.id}` === key);
    if (!item) return;
    const start = new Date(day);
    start.setHours(hour ?? item.start.getHours(), hour !== undefined ? 0 : item.start.getMinutes(), 0, 0);
    if (start.getTime() === item.start.getTime()) return;
    const delta = start.getTime() - item.start.getTime();
    setItems((list) => list.map((i) => (i === item ? ({ ...i, start, end: i.end ? new Date(i.end.getTime() + delta) : null } as CalendarItem) : i)));
    const { error } =
      item.kind === 'event'
        ? await supabase.from('calendar_events').update({ start_at: start.toISOString(), end_at: item.end ? new Date(item.end.getTime() + delta).toISOString() : null }).eq('id', item.id)
        : await supabase.from('articles').update({ published_at: start.toISOString() }).eq('id', item.id);
    if (error) setError(error.message);
    load();
  };

  const go = (dir: -1 | 1) =>
    setCursor((c) => (view === 'month' ? (dir > 0 ? addMonths(c, 1) : subMonths(c, 1)) : view === 'week' ? (dir > 0 ? addWeeks(c, 1) : subWeeks(c, 1)) : addDays(c, dir * 30)));

  const title =
    view === 'month'
      ? format(cursor, 'MMMM yyyy', { locale: fr })
      : view === 'week'
        ? `${format(from, 'd MMM', { locale: fr })} – ${format(to, 'd MMM yyyy', { locale: fr })}`
        : `À partir du ${format(cursor, 'd MMMM yyyy', { locale: fr })}`;

  const itemsOn = (day: Date) => items.filter((i) => isSameDay(i.start, day));

  const Chip: React.FC<{ item: CalendarItem; compact?: boolean }> = ({ item, compact }) => (
    <button
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', `${item.kind}:${item.id}`)}
      onClick={(e) => {
        e.stopPropagation();
        open(item);
      }}
      className={`flex w-full items-center gap-1.5 truncate rounded-md border-l-[3px] px-1.5 py-1 text-left text-[11px] leading-tight font-semibold transition hover:brightness-95 ${COLORS[item.color].chip} ${COLORS[item.color].bar}`}
      title={item.title}
    >
      {item.kind === 'article' ? <Article size={12} weight="bold" className="shrink-0" /> : item.event.poster_paths.length > 0 ? <Images size={12} weight="bold" className="shrink-0" /> : null}
      {!item.allDay && !compact && <span className="shrink-0 opacity-70">{format(item.start, 'HH:mm')}</span>}
      <span className="truncate">{item.title || 'Sans titre'}</span>
    </button>
  );

  const dropProps = (key: string, day: Date, hour?: number) => ({
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(key);
    },
    onDragLeave: () => setDragOver((k) => (k === key ? null : k)),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(null);
      move(e.dataTransfer.getData('text/plain'), day, hour);
    },
  });

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(cursor, opts), i));

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold">Calendrier éditorial</h1>
          <p className="mt-1 text-slate-500">Planifiez affiches, publications réseaux sociaux et articles. Glissez un élément pour le déplacer.</p>
        </div>
        <button onClick={() => create(new Date())} className="btn-blue self-start lg:self-auto">
          <Plus size={18} weight="bold" /> Planifier
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button onClick={() => setCursor(new Date())} className="btn-ghost !px-4 !py-2">Aujourd'hui</button>
          <button onClick={() => go(-1)} className="flex size-9 items-center justify-center rounded-full hover:bg-white dark:hover:bg-white/10" aria-label="Précédent"><CaretLeft size={18} weight="bold" /></button>
          <button onClick={() => go(1)} className="flex size-9 items-center justify-center rounded-full hover:bg-white dark:hover:bg-white/10" aria-label="Suivant"><CaretRight size={18} weight="bold" /></button>
          <h2 className="ml-1 font-display text-2xl font-semibold capitalize">{title}</h2>
          {loading && <Spinner className="ml-2 size-4 text-paza-blue" />}
        </div>
        <div className="flex gap-1 rounded-full bg-white p-1 shadow-sm dark:bg-white/5">
          {(['month', 'week', 'agenda'] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${view === v ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'text-slate-500'}`}>
              {v === 'month' ? 'Mois' : v === 'week' ? 'Semaine' : 'Agenda'}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="mb-4"><ErrorNote>{error}</ErrorNote></div>}

      {view === 'month' && (
        <div className="card overflow-hidden">
          <div className="grid grid-cols-7 border-b border-ink/5 dark:border-white/10">
            {weekDays.map((d) => (
              <div key={d.toISOString()} className="py-2 text-center text-xs font-bold tracking-wider text-slate-500 uppercase">{format(d, 'EEE', { locale: fr })}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {Array.from({ length: Math.round((to.getTime() - from.getTime()) / 86400000) }, (_, i) => addDays(from, i)).map((day) => {
              const list = itemsOn(day);
              const key = day.toISOString();
              return (
                <div
                  key={key}
                  onClick={() => create(day)}
                  {...dropProps(key, day)}
                  className={`group min-h-28 cursor-pointer border-r border-b border-ink/5 p-1.5 transition md:min-h-32 dark:border-white/5 ${isSameMonth(day, cursor) ? '' : 'bg-slate-50/70 dark:bg-black/10'} ${dragOver === key ? 'bg-paza-blue/10' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className={`flex size-7 items-center justify-center rounded-full text-xs font-bold ${isToday(day) ? 'bg-paza-red text-white' : isSameMonth(day, cursor) ? '' : 'text-slate-400'}`}>{format(day, 'd')}</span>
                    <Plus size={14} className="text-slate-400 opacity-0 group-hover:opacity-100" />
                  </div>
                  <div className="space-y-1">
                    {list.slice(0, 3).map((it) => <Chip key={it.kind + it.id} item={it} />)}
                    {list.length > 3 && (
                      <button onClick={(e) => { e.stopPropagation(); setCursor(day); setView('week'); }} className="px-1.5 text-[11px] font-bold text-slate-500 hover:text-ink">
                        + {list.length - 3} autre(s)
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === 'week' && (
        <div className="card overflow-x-auto">
          <div className="min-w-[48rem]">
            <div className="grid grid-cols-[3.5rem_repeat(7,1fr)] border-b border-ink/5 dark:border-white/10">
              <div />
              {weekDays.map((d) => (
                <div key={d.toISOString()} className="border-l border-ink/5 p-2 text-center dark:border-white/5">
                  <div className="text-xs font-bold text-slate-500 uppercase">{format(d, 'EEE', { locale: fr })}</div>
                  <div className={`mx-auto mt-1 flex size-8 items-center justify-center rounded-full font-display text-lg font-semibold ${isToday(d) ? 'bg-paza-red text-white' : ''}`}>{format(d, 'd')}</div>
                </div>
              ))}
            </div>
            {/* Journée entière */}
            <div className="grid grid-cols-[3.5rem_repeat(7,1fr)] border-b border-ink/5 dark:border-white/10">
              <div className="p-1 text-right text-[10px] text-slate-400">jour</div>
              {weekDays.map((d) => (
                <div key={d.toISOString()} className="min-h-9 space-y-1 border-l border-ink/5 p-1 dark:border-white/5" {...dropProps(`ad-${d.toISOString()}`, d)}>
                  {itemsOn(d).filter((i) => i.allDay).map((it) => <Chip key={it.id} item={it} />)}
                </div>
              ))}
            </div>
            <div className="relative grid grid-cols-[3.5rem_repeat(7,1fr)]">
              <div>
                {Array.from({ length: HOUR_END - HOUR_START }, (_, h) => (
                  <div key={h} style={{ height: HOUR_PX }} className="-mt-2 pr-2 text-right text-[10px] text-slate-400">{String(h + HOUR_START).padStart(2, '0')}:00</div>
                ))}
              </div>
              {weekDays.map((d) => {
                const timed = itemsOn(d).filter((i) => !i.allDay);
                // Répartition en colonnes des éléments qui se chevauchent
                const lanes: CalendarItem[][] = [];
                timed.forEach((it) => {
                  const lane = lanes.find((l) => {
                    const last = l[l.length - 1];
                    return (last.end ?? new Date(last.start.getTime() + 3600000)) <= it.start;
                  });
                  if (lane) lane.push(it);
                  else lanes.push([it]);
                });
                return (
                  <div key={d.toISOString()} className="relative border-l border-ink/5 dark:border-white/5">
                    {Array.from({ length: HOUR_END - HOUR_START }, (_, h) => {
                      const k = `${d.toISOString()}-${h}`;
                      return <div key={h} style={{ height: HOUR_PX }} onClick={() => create(d, h + HOUR_START)} {...dropProps(k, d, h + HOUR_START)} className={`cursor-pointer border-b border-ink/5 dark:border-white/5 ${dragOver === k ? 'bg-paza-blue/10' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`} />;
                    })}
                    {lanes.map((lane, li) =>
                      lane.map((it) => {
                        const minutes = (it.start.getHours() - HOUR_START) * 60 + it.start.getMinutes();
                        const duration = Math.max(30, it.end ? differenceInMinutes(it.end, it.start) : 60);
                        return (
                          <div key={it.kind + it.id} className="absolute px-0.5" style={{ top: Math.max(0, (minutes / 60) * HOUR_PX), height: (duration / 60) * HOUR_PX - 2, left: `${(li / lanes.length) * 100}%`, width: `${100 / lanes.length}%` }}>
                            <div className={`h-full overflow-hidden rounded-md ${COLORS[it.color].chip}`}>
                              <Chip item={it} />
                            </div>
                          </div>
                        );
                      }),
                    )}
                    {isToday(d) && (
                      <div className="pointer-events-none absolute inset-x-0 z-[1] h-0.5 bg-paza-red" style={{ top: ((new Date().getHours() - HOUR_START) * 60 + new Date().getMinutes()) / 60 * HOUR_PX }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {view === 'agenda' && (
        <div className="space-y-6">
          {items.length === 0 && !loading && <p className="card p-10 text-center text-slate-500">Rien de planifié sur cette période.</p>}
          {Array.from(new Set(items.map((i) => format(i.start, 'yyyy-MM-dd')))).map((dayKey) => {
            const day = new Date(`${dayKey}T00:00`);
            return (
              <section key={dayKey} className="grid gap-3 md:grid-cols-[9rem_1fr]">
                <div className="flex items-baseline gap-2 md:block">
                  <p className={`font-display text-3xl font-semibold ${isToday(day) ? 'text-paza-red' : ''}`}>{format(day, 'd')}</p>
                  <p className="text-sm font-semibold text-slate-500 capitalize">{format(day, 'EEEE · MMM', { locale: fr })}</p>
                </div>
                <div className="space-y-2">
                  {itemsOn(day).map((it) => (
                    <button key={it.kind + it.id} onClick={() => open(it)} className={`card flex w-full items-center gap-4 border-l-4 p-3 text-left transition hover:-translate-y-0.5 ${COLORS[it.color].bar}`}>
                      {(it.kind === 'article' ? it.cover : it.event.poster_paths[0]) ? (
                        <img src={mediaUrl(it.kind === 'article' ? it.cover : it.event.poster_paths[0])} alt="" className="size-14 shrink-0 rounded-lg object-cover" />
                      ) : (
                        <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-white/5">{it.kind === 'article' ? <Article size={22} /> : <Images size={22} />}</span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold">{it.title || 'Sans titre'}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                          <span>{it.allDay ? 'Journée entière' : format(it.start, 'HH:mm')}{it.end ? ` – ${format(it.end, 'HH:mm')}` : ''}</span>
                          <span className="flex items-center gap-1"><span className={`size-2 rounded-full ${STATUSES[it.status].dot}`} /> {it.kind === 'article' ? 'Article du blog' : STATUSES[it.status].label}</span>
                          {it.kind === 'event' && (
                            <span className="flex gap-1">
                              {it.event.channels.map((c) => {
                                const ch = CHANNELS.find((x) => x.id === c);
                                return ch ? <ch.icon key={c} size={14} /> : null;
                              })}
                            </span>
                          )}
                        </div>
                        {it.kind === 'event' && it.event.description && <p className="mt-1 line-clamp-1 text-sm text-slate-500">{it.event.description}</p>}
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-500">
        {Object.entries(STATUSES).map(([k, s]) => (
          <span key={k} className="flex items-center gap-1.5"><span className={`size-2 rounded-full ${s.dot}`} /> {s.label}</span>
        ))}
        <span className="flex items-center gap-1.5"><Article size={13} /> Article du blog (date de publication)</span>
        <span className="flex items-center gap-1.5"><Images size={13} /> Avec affiche(s)</span>
      </div>

      {editing && (
        <EventDialog
          event={editing.event}
          isNew={editing.isNew}
          articles={articles}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
};

export default CalendarPage;
