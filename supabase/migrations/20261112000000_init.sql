-- =====================================================================
-- Paza Sauti La Haki — schéma initial
-- Tables : articles, calendar_events, gallery_images, contact_messages,
--          admin_users ; bucket de stockage « media ».
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Administrateurs : seuls les e-mails listés ici peuvent écrire.
-- Ajoutez un compte : insert into public.admin_users (email) values ('vous@exemple.org');
-- ---------------------------------------------------------------------
create table if not exists public.admin_users (
  email       text primary key,
  created_at  timestamptz not null default now()
);
alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "admins can read admin list" on public.admin_users;
create policy "admins can read admin list" on public.admin_users
  for select to authenticated using (public.is_admin());

-- Déclencheur générique updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Articles du blog
-- status = 'published' + published_at dans le futur => publication programmée
-- ---------------------------------------------------------------------
create table if not exists public.articles (
  id             uuid primary key default gen_random_uuid(),
  legacy_id      text unique,                      -- ancien identifiant (?post=6)
  slug           text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status         text not null default 'draft' check (status in ('draft', 'published')),
  published_at   timestamptz,
  title_fr       text not null,
  title_en       text,
  summary_fr     text,
  summary_en     text,
  content_fr     text not null default '',         -- HTML produit par Quill
  content_en     text,
  cover_path     text,                             -- chemin dans le bucket media (WebP)
  og_image_path  text,                             -- 1200x630 JPEG pour les aperçus de partage
  cover_alt      text,
  author         text,
  tags           text[] not null default '{}',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists articles_published_idx on public.articles (status, published_at desc);

drop trigger if exists articles_touch on public.articles;
create trigger articles_touch before update on public.articles
  for each row execute function public.touch_updated_at();

alter table public.articles enable row level security;

drop policy if exists "public reads published articles" on public.articles;
create policy "public reads published articles" on public.articles
  for select to anon, authenticated
  using ((status = 'published' and published_at <= now()) or public.is_admin());

drop policy if exists "admins manage articles" on public.articles;
create policy "admins manage articles" on public.articles
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- Calendrier éditorial (affiches, descriptions, dates, canaux…)
-- ---------------------------------------------------------------------
create table if not exists public.calendar_events (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  start_at      timestamptz not null,
  end_at        timestamptz,
  all_day       boolean not null default false,
  status        text not null default 'planned' check (status in ('idea', 'planned', 'ready', 'published')),
  channels      text[] not null default '{}',     -- site, facebook, instagram, whatsapp, x, linkedin, tiktok
  color         text not null default 'blue',
  poster_paths  text[] not null default '{}',     -- affiches dans le bucket media
  article_id    uuid references public.articles (id) on delete set null,
  created_by    text default (auth.jwt() ->> 'email'),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  check (end_at is null or end_at >= start_at)
);

create index if not exists calendar_events_start_idx on public.calendar_events (start_at);

drop trigger if exists calendar_events_touch on public.calendar_events;
create trigger calendar_events_touch before update on public.calendar_events
  for each row execute function public.touch_updated_at();

alter table public.calendar_events enable row level security;

drop policy if exists "admins manage calendar" on public.calendar_events;
create policy "admins manage calendar" on public.calendar_events
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- Galerie photo
-- ---------------------------------------------------------------------
create table if not exists public.gallery_images (
  id          uuid primary key default gen_random_uuid(),
  path        text not null unique,
  caption_fr  text,
  caption_en  text,
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists gallery_images_position_idx on public.gallery_images (position, created_at);

alter table public.gallery_images enable row level security;

drop policy if exists "public reads gallery" on public.gallery_images;
create policy "public reads gallery" on public.gallery_images
  for select to anon, authenticated using (true);

drop policy if exists "admins manage gallery" on public.gallery_images;
create policy "admins manage gallery" on public.gallery_images
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- Messages du formulaire de contact
-- ---------------------------------------------------------------------
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 120),
  email       text not null check (char_length(email) between 3 and 200 and email like '%@%'),
  subject     text check (char_length(subject) <= 120),
  message     text not null check (char_length(message) between 1 and 5000),
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "anyone can send a message" on public.contact_messages;
create policy "anyone can send a message" on public.contact_messages
  for insert to anon, authenticated with check (is_read = false);

drop policy if exists "admins read messages" on public.contact_messages;
create policy "admins read messages" on public.contact_messages
  for select to authenticated using (public.is_admin());

drop policy if exists "admins update messages" on public.contact_messages;
create policy "admins update messages" on public.contact_messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins delete messages" on public.contact_messages;
create policy "admins delete messages" on public.contact_messages
  for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------
-- Stockage : bucket public « media » (images compressées)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760, array['image/webp', 'image/jpeg', 'image/png', 'image/gif', 'image/avif', 'image/svg+xml'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public reads media" on storage.objects;
create policy "public reads media" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');

drop policy if exists "admins upload media" on storage.objects;
create policy "admins upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "admins update media" on storage.objects;
create policy "admins update media" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());

drop policy if exists "admins delete media" on storage.objects;
create policy "admins delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());
