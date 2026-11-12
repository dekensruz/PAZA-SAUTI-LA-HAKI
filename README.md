# Paza Sauti La Haki — Élève la Voix de la Justice

Site de l'initiative **Paza Sauti La Haki**, portée par de jeunes étudiants de différentes universités de Goma pour rendre la justice accessible à tous en RDC et promouvoir la paix.

## Fonctionnalités

- **Site public** bilingue (FR/EN), thème clair/sombre, responsive.
- **Blog** : chaque article a sa propre page (`/blog/:slug`). Les anciens liens `/blog?post=6` redirigent vers la nouvelle page.
- **Aperçus de partage** : l'image de couverture, le titre et le résumé s'affichent quand on partage un lien sur WhatsApp, Facebook, X ou LinkedIn (Edge Function Netlify `netlify/edge-functions/article-og.ts`).
- **Espace d'administration** (`/admin`) :
  - éditeur riche **Quill** : insertion d'images (bouton, glisser-déposer, coller), redimensionnement (poignées ou 25/50/75/100 %), alignement ;
  - **publication programmée** : un article publié avec une date future apparaît automatiquement à cette date ;
  - **calendrier éditorial** (mois / semaine / agenda) : affiches, descriptions, dates, canaux (Facebook, Instagram, WhatsApp…), statut, glisser-déposer pour déplacer ;
  - gestion de la **galerie** et des **messages** du formulaire de contact.
- **Compression d'images** : toute image envoyée est redimensionnée et convertie en WebP dans le navigateur avant l'envoi ; les couvertures génèrent aussi une image de partage 1200×630 JPEG.
- **Supabase** : base de données Postgres (articles, calendrier, galerie, messages) et stockage des fichiers dans le bucket `media`.

## Mise en place

### 1. Supabase

1. Créez un projet sur [supabase.com](https://supabase.com).
2. Dans **SQL Editor**, exécutez dans l'ordre :
   - `supabase/migrations/20261112000000_init.sql` (tables, sécurité RLS, bucket `media`) ;
   - `supabase/seed.sql` (tous les articles déjà publiés + la galerie).
3. **Authentication > Users** : créez le compte administrateur (e-mail + mot de passe), puis autorisez-le :
   ```sql
   insert into public.admin_users (email) values ('votre@email.org');
   ```
   Pensez à désactiver les inscriptions publiques (**Authentication > Sign In / Providers > Allow new users to sign up**).

### 2. Variables d'environnement

Copiez `.env.example` en `.env.local` et remplissez avec **Project Settings > API**.

### 3. Images

Toutes les images (anciennement sur imgbb / pexels) ont été téléchargées et compressées dans `supabase/media/`. Envoyez-les dans le bucket :

```bash
npm run media:upload
```

(`npm run media:migrate` re-télécharge et recompresse depuis les sources d'origine si besoin.)

### 4. Développement

```bash
npm install
npm run dev
```

### 5. Déploiement (Netlify)

`netlify.toml` configure le build, la redirection SPA, le sitemap dynamique et l'Edge Function de partage. Dans Netlify, ajoutez les variables `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` et `VITE_SITE_URL`.

## Structure

- `src/sections`, `src/pages`, `src/components` : site public
- `src/admin` : espace d'administration (chargé à la demande)
- `src/lib` : client Supabase, stockage, compresseur d'images, accès aux articles
- `supabase/` : migration SQL, seed, images compressées
- `netlify/edge-functions` : balises Open Graph des articles, sitemap
- `scripts/` : migration et envoi des images

## L'Équipe

* MWANGILWA KITUNGANO Gédéon
* Balola Mugisho Daniel
* Dekens Ruzuba
* Byeka Kipanga Chanceline
* Safari Muzero Xavier
* Nabintu Bisimwa Clémence
* Irazika Bamporiki Vertueuse
* Miderho Magadju Dieumerci
* Furaha Zirimwagabo Nessia
* Habamungu Magendo Augustin
* Karisi Kaboyo Bénédicte

## Crédits

**Développé par :** Dekens Ruzuba — [portfoliodek.netlify.app](https://portfoliodek.netlify.app/)
