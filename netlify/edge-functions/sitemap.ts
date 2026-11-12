// Sitemap dynamique : pages statiques + tous les articles publiés.
declare const Netlify: { env: { get(name: string): string | undefined } };

const staticPages: [string, string, number][] = [
  ['/', 'weekly', 1.0],
  ['/blog', 'weekly', 0.9],
  ['/about', 'monthly', 0.8],
  ['/mission', 'monthly', 0.8],
  ['/gallery', 'weekly', 0.7],
  ['/team', 'monthly', 0.7],
  ['/contact', 'monthly', 0.6],
  ['/faq', 'monthly', 0.5],
];

export default async (request: Request) => {
  const origin = new URL(request.url).origin;
  const supabaseUrl = Netlify.env.get('VITE_SUPABASE_URL');
  const anonKey = Netlify.env.get('VITE_SUPABASE_ANON_KEY');
  let articles: { slug: string; updated_at: string }[] = [];
  if (supabaseUrl && anonKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/articles?select=slug,updated_at&status=eq.published&published_at=lte.${new Date().toISOString()}&order=published_at.desc`,
        { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } },
      );
      if (res.ok) articles = await res.json();
    } catch {
      /* sitemap minimal */
    }
  }
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    ...staticPages.map(([p, f, pr]) => `<url><loc>${origin}${p}</loc><lastmod>${today}</lastmod><changefreq>${f}</changefreq><priority>${pr.toFixed(1)}</priority></url>`),
    ...articles.map((a) => `<url><loc>${origin}/blog/${a.slug}</loc><lastmod>${a.updated_at.slice(0, 10)}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
};

export const config = { path: '/sitemap.xml' };
