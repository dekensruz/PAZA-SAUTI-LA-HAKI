// Edge Function Netlify : injecte les balises Open Graph / Twitter d'un article
// dans le HTML de /blog/:slug, pour que Facebook, WhatsApp, X, LinkedIn…
// affichent l'image de couverture, le titre et le résumé quand on partage le lien.
// (Ces robots n'exécutent pas JavaScript, l'application React seule ne suffit pas.)

declare const Netlify: { env: { get(name: string): string | undefined } };

interface Row {
  slug: string;
  title_fr: string;
  title_en: string | null;
  summary_fr: string | null;
  summary_en: string | null;
  og_image_path: string | null;
  cover_path: string | null;
  published_at: string | null;
  updated_at: string;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export default async (request: Request, context: { next: () => Promise<Response> }) => {
  const response = await context.next();
  const url = new URL(request.url);
  const slug = decodeURIComponent(url.pathname.split('/')[2] ?? '');
  const supabaseUrl = Netlify.env.get('VITE_SUPABASE_URL');
  const anonKey = Netlify.env.get('VITE_SUPABASE_ANON_KEY');
  if (!slug || !supabaseUrl || !anonKey || !(response.headers.get('content-type') ?? '').includes('text/html')) return response;

  try {
    const api = `${supabaseUrl}/rest/v1/articles?slug=eq.${encodeURIComponent(slug)}&select=slug,title_fr,title_en,summary_fr,summary_en,og_image_path,cover_path,published_at,updated_at&limit=1`;
    const res = await fetch(api, { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } });
    if (!res.ok) return response;
    const [article] = (await res.json()) as Row[];
    if (!article) return response;

    const lang = url.searchParams.get('lang') === 'en' ? 'en' : 'fr';
    const title = (lang === 'en' && article.title_en) || article.title_fr;
    const description = ((lang === 'en' && article.summary_en) || article.summary_fr || '').slice(0, 300);
    const imagePath = article.og_image_path || article.cover_path || 'brand/logo-og.jpg';
    const image = /^https?:/.test(imagePath) ? imagePath : `${supabaseUrl}/storage/v1/object/public/media/${imagePath}`;
    const pageUrl = `${url.origin}/blog/${article.slug}`;
    const fullTitle = `${title} · Paza Sauti La Haki`;

    const tags = [
      `<title>${esc(fullTitle)}</title>`,
      `<meta name="description" content="${esc(description)}" />`,
      `<link rel="canonical" href="${esc(pageUrl)}" />`,
      `<meta property="og:type" content="article" />`,
      `<meta property="og:site_name" content="Paza Sauti La Haki" />`,
      `<meta property="og:locale" content="${lang === 'en' ? 'en_GB' : 'fr_FR'}" />`,
      `<meta property="og:title" content="${esc(title)}" />`,
      `<meta property="og:description" content="${esc(description)}" />`,
      `<meta property="og:url" content="${esc(pageUrl)}" />`,
      `<meta property="og:image" content="${esc(image)}" />`,
      `<meta property="og:image:secure_url" content="${esc(image)}" />`,
      `<meta property="og:image:alt" content="${esc(title)}" />`,
      ...(article.og_image_path ? ['<meta property="og:image:width" content="1200" />', '<meta property="og:image:height" content="630" />', '<meta property="og:image:type" content="image/jpeg" />'] : []),
      article.published_at ? `<meta property="article:published_time" content="${esc(article.published_at)}" />` : '',
      `<meta property="article:modified_time" content="${esc(article.updated_at)}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${esc(title)}" />`,
      `<meta name="twitter:description" content="${esc(description)}" />`,
      `<meta name="twitter:image" content="${esc(image)}" />`,
    ].filter(Boolean);

    const html = (await response.text()).replace(/<!--SEO:START-->[\s\S]*?<!--SEO:END-->/, tags.join('\n    '));
    const headers = new Headers(response.headers);
    headers.delete('content-length');
    headers.set('cache-control', 'public, max-age=0, must-revalidate');
    return new Response(html, { status: response.status, headers });
  } catch {
    return response;
  }
};

export const config = { path: '/blog/*' };
