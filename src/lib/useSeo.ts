import { useEffect } from 'react';
import { SITE_URL } from './supabase';
import { mediaUrl } from './media';

interface Seo {
  title?: string;
  description?: string;
  image?: string | null;
  path?: string;
  type?: 'website' | 'article';
}

const DEFAULT_TITLE = 'Paza Sauti La Haki — Élève la voix de la justice';

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = value;
}

/**
 * Met à jour titre et balises Open Graph côté client.
 * (Pour les robots qui n'exécutent pas JavaScript, l'Edge Function Netlify
 * netlify/edge-functions/article-og.ts injecte ces balises côté serveur.)
 */
export function useSeo({ title, description, image, path, type = 'website' }: Seo) {
  useEffect(() => {
    const fullTitle = title ? `${title} · Paza Sauti La Haki` : DEFAULT_TITLE;
    document.title = fullTitle;
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:type', type);
    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
    }
    setMeta('property', 'og:image', mediaUrl(image || 'brand/logo-og.jpg'));
    setMeta('property', 'og:url', `${SITE_URL}${path ?? window.location.pathname}`);
  }, [title, description, image, path, type]);
}
