import { supabase } from './supabase';
import type { Language } from '@/i18n/content';

export interface ArticleRow {
  id: string;
  legacy_id: string | null;
  slug: string;
  status: 'draft' | 'published';
  published_at: string | null;
  title_fr: string;
  title_en: string | null;
  summary_fr: string | null;
  summary_en: string | null;
  content_fr: string;
  content_en: string | null;
  cover_path: string | null;
  og_image_path: string | null;
  cover_alt: string | null;
  author: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export type ArticleCardFields = Pick<
  ArticleRow,
  'id' | 'slug' | 'published_at' | 'title_fr' | 'title_en' | 'summary_fr' | 'summary_en' | 'cover_path' | 'cover_alt' | 'tags'
>;

const CARD_COLUMNS = 'id, slug, published_at, title_fr, title_en, summary_fr, summary_en, cover_path, cover_alt, tags';

/** Champ localisé avec repli sur le français. */
export function loc<T extends Partial<ArticleRow>>(row: T, field: 'title' | 'summary' | 'content', lang: Language): string {
  const en = (row as Record<string, unknown>)[`${field}_en`] as string | null | undefined;
  const fr = (row as Record<string, unknown>)[`${field}_fr`] as string | null | undefined;
  if (lang === 'en' && en && en.replace(/<[^>]*>/g, '').trim()) return en;
  return fr ?? '';
}

export async function fetchPublishedArticles(limit?: number): Promise<ArticleCardFields[]> {
  let q = supabase
    .from('articles')
    .select(CARD_COLUMNS)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as ArticleCardFields[];
}

export async function fetchArticleBySlug(slug: string): Promise<ArticleRow | null> {
  const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data as ArticleRow | null;
}

export async function fetchSlugByLegacyId(legacyId: string): Promise<string | null> {
  const { data } = await supabase.from('articles').select('slug').eq('legacy_id', legacyId).maybeSingle();
  return (data?.slug as string | undefined) ?? null;
}

export async function fetchRelatedArticles(excludeId: string, limit = 3): Promise<ArticleCardFields[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(CARD_COLUMNS)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .neq('id', excludeId)
    .order('published_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as ArticleCardFields[];
}

export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 90);
}

export function readingMinutes(html: string): number {
  const words = html.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export type ArticleState = 'draft' | 'scheduled' | 'published';
export function articleState(a: Pick<ArticleRow, 'status' | 'published_at'>): ArticleState {
  if (a.status !== 'published') return 'draft';
  if (a.published_at && new Date(a.published_at) > new Date()) return 'scheduled';
  return 'published';
}
