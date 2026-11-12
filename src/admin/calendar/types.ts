import { FacebookLogo, Globe, InstagramLogo, LinkedinLogo, TiktokLogo, WhatsappLogo, XLogo, type Icon } from '@phosphor-icons/react';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string | null;
  all_day: boolean;
  status: EventStatus;
  channels: string[];
  color: EventColor;
  poster_paths: string[];
  article_id: string | null;
  created_by?: string | null;
}

export type EventStatus = 'idea' | 'planned' | 'ready' | 'published';
export type EventColor = 'blue' | 'red' | 'yellow' | 'green' | 'purple' | 'slate';

export const STATUSES: Record<EventStatus, { label: string; dot: string }> = {
  idea: { label: 'Idée', dot: 'bg-slate-400' },
  planned: { label: 'Planifié', dot: 'bg-paza-blue' },
  ready: { label: 'Prêt', dot: 'bg-amber-500' },
  published: { label: 'Publié', dot: 'bg-emerald-500' },
};

export const COLORS: Record<EventColor, { chip: string; swatch: string; bar: string }> = {
  blue: { chip: 'bg-blue-100 text-blue-900 dark:bg-blue-500/20 dark:text-blue-100', swatch: 'bg-paza-blue', bar: 'border-l-paza-blue' },
  red: { chip: 'bg-red-100 text-red-900 dark:bg-red-500/20 dark:text-red-100', swatch: 'bg-paza-red', bar: 'border-l-paza-red' },
  yellow: { chip: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-400/20 dark:text-yellow-100', swatch: 'bg-paza-yellow', bar: 'border-l-paza-yellow' },
  green: { chip: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-100', swatch: 'bg-emerald-500', bar: 'border-l-emerald-500' },
  purple: { chip: 'bg-violet-100 text-violet-900 dark:bg-violet-500/20 dark:text-violet-100', swatch: 'bg-violet-500', bar: 'border-l-violet-500' },
  slate: { chip: 'bg-slate-200 text-slate-800 dark:bg-white/10 dark:text-slate-100', swatch: 'bg-slate-500', bar: 'border-l-slate-500' },
};

export const CHANNELS: { id: string; label: string; icon: Icon }[] = [
  { id: 'site', label: 'Site web', icon: Globe },
  { id: 'facebook', label: 'Facebook', icon: FacebookLogo },
  { id: 'instagram', label: 'Instagram', icon: InstagramLogo },
  { id: 'whatsapp', label: 'WhatsApp', icon: WhatsappLogo },
  { id: 'x', label: 'X', icon: XLogo },
  { id: 'linkedin', label: 'LinkedIn', icon: LinkedinLogo },
  { id: 'tiktok', label: 'TikTok', icon: TiktokLogo },
];

/** Élément affiché dans le calendrier : événement planifié ou article daté. */
export type CalendarItem =
  | { kind: 'event'; id: string; title: string; start: Date; end: Date | null; allDay: boolean; color: EventColor; status: EventStatus; event: CalendarEvent }
  | { kind: 'article'; id: string; title: string; start: Date; end: null; allDay: false; color: EventColor; status: EventStatus; slug: string; cover: string | null };
