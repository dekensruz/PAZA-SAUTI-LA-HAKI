import { format } from 'date-fns';
import { enGB, fr } from 'date-fns/locale';
import type { Language } from '@/i18n/content';

export const dateLocale = (lang: Language) => (lang === 'en' ? enGB : fr);

export function formatDate(iso: string | null | undefined, lang: Language, pattern = 'd MMMM yyyy') {
  if (!iso) return '';
  return format(new Date(iso), pattern, { locale: dateLocale(lang) });
}
