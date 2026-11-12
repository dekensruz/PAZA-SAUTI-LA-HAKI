-- =====================================================================
-- Paza Sauti La Haki — données initiales
-- Tous les articles déjà publiés + la galerie.
-- Les images correspondantes sont dans supabase/media/ et sont envoyées
-- dans le bucket « media » par : npm run media:upload
-- =====================================================================

-- Compte(s) administrateur(s) : remplacez par l'e-mail du compte créé dans
-- Supabase > Authentication > Users, puis décommentez.
-- insert into public.admin_users (email) values ('admin@pazasautilahaki.org') on conflict do nothing;

insert into public.articles
  (legacy_id, slug, status, published_at, title_fr, title_en, summary_fr, summary_en, content_fr, content_en, cover_path, og_image_path, cover_alt, author, tags)
values
(
  '6', 'stop-ebola', 'published', '2026-05-29 09:00:00+02',
  'STOP EBOLA', 'STOP EBOLA',
  'La lutte contre le virus Ebola n’est pas seulement un enjeu sanitaire, c''est une question de solidarité et de prévention collective.',
  'The fight against the Ebola virus is not just a health issue, it is a matter of solidarity and collective prevention.',
  $html$<p>La lutte contre le virus Ebola n’est pas seulement un enjeu sanitaire, c’est une question de solidarité.</p><ul><li>Nous avons le devoir de protéger nos communautés et nos proches.</li><li>Le virus touche souvent les populations les plus vulnérables en premier.</li><li>Agir pour prévenir Ebola, c’est agir pour la sécurité et la santé de tous.</li></ul><p><strong>Ensemble, adoptons les gestes simples de prévention pour sauver des vies.</strong></p>$html$,
  $html$<p>The fight against the Ebola virus is not just a health issue, it is a matter of solidarity.</p><ul><li>We have a duty to protect our communities and loved ones.</li><li>The virus often affects the most vulnerable populations first.</li><li>Acting to prevent Ebola means acting for the safety and health of everyone.</li></ul><p><strong>Together, let's adopt simple prevention steps to save lives.</strong></p>$html$,
  'articles/stop-ebola/cover.webp', 'articles/stop-ebola/og.jpg', 'Affiche de sensibilisation « Stop Ebola »', 'Paza Sauti La Haki', array['santé', 'prévention']
),
(
  '5', 'journee-internationale-des-droits-de-l-homme-2025', 'published', '2025-12-10 09:00:00+02',
  'JOURNÉE INTERNATIONALE DES DROITS DE L''HOMME', 'INTERNATIONAL HUMAN RIGHTS DAY',
  'Conférence en ligne sur Google Meet : Liberté d''expression vs discours de haine. Où se situe la limite ?',
  'Online conference on Google Meet: Freedom of expression vs hate speech. Where is the limit?',
  $html$<p>Nous avons organisé une conférence en ligne sur Google Meet pour célébrer cette journée importante.</p><blockquote>Le thème du débat était : « Liberté d'expression vs discours de haine. Où se situe la limite ? »</blockquote><ul><li>Il est crucial de comprendre que la liberté d'expression ne justifie pas l'incitation à la haine ou à la violence.</li><li>Les échanges ont permis de définir des lignes directrices pour un discours constructif et respectueux.</li></ul><p><strong>Ensemble, nous nous engageons à promouvoir des droits humains universels dans nos communautés et en ligne.</strong></p>$html$,
  $html$<p>We organized an online conference on Google Meet to celebrate this important day.</p><blockquote>The theme of the debate was: "Freedom of expression vs hate speech. Where is the limit?"</blockquote><ul><li>It is crucial to understand that freedom of expression does not justify incitement to hate or violence.</li><li>The exchanges helped define guidelines for constructive and respectful discourse.</li></ul><p><strong>Together, we commit to promoting universal human rights in our communities and online.</strong></p>$html$,
  'articles/journee-internationale-des-droits-de-l-homme-2025/cover.webp', 'articles/journee-internationale-des-droits-de-l-homme-2025/og.jpg', 'Affiche de la conférence sur les droits de l''homme', 'Paza Sauti La Haki', array['droits humains', 'conférence']
),
(
  '4', 'journee-mondiale-du-climat-2025', 'published', '2025-12-08 09:00:00+02',
  'JOURNÉE MONDIALE DU CLIMAT', 'WORLD CLIMATE DAY',
  'Aujourd''hui, le 08 Décembre 2025, nous célébrons la journée mondiale du climat. Protégeons notre planète pour un avenir durable.',
  'Today, December 8, 2025, let''s celebrate World Climate Day. Let''s protect our planet for a sustainable future.',
  $html$<p>Le changement climatique n'est pas seulement un défi environnemental, c'est une question de justice.</p><ul><li>Nous avons le devoir de protéger notre planète pour les générations actuelles et futures.</li><li>La dégradation de l'environnement affecte souvent les plus vulnérables en premier.</li><li>Agir pour le climat, c'est agir pour la paix et la stabilité.</li></ul><p><strong>Ensemble, adoptons des comportements responsables pour réduire notre impact écologique.</strong></p>$html$,
  $html$<p>Climate change is not just an environmental challenge, it is a matter of justice.</p><ul><li>We have a duty to protect our planet for current and future generations.</li><li>Environmental degradation often affects the most vulnerable first.</li><li>Acting for the climate means acting for peace and stability.</li></ul><p><strong>Together, let's adopt responsible behaviors to reduce our ecological impact.</strong></p>$html$,
  'articles/journee-mondiale-du-climat-2025/cover.webp', 'articles/journee-mondiale-du-climat-2025/og.jpg', 'Affiche de la journée mondiale du climat', 'Paza Sauti La Haki', array['climat', 'environnement']
),
(
  '3', 'sensibilisation-institut-uwezo', 'published', '2025-12-02 15:00:00+02',
  'SENSIBILISATION À L''INSTITUT UWEZO', 'SENSITIZATION AT UWEZO INSTITUTE',
  'Une journée d''échange enrichissante avec les élèves sur la paix, les conflits et la justice.',
  'An enriching day of exchange with students on peace, conflicts, and justice.',
  $html$<p>Le 02 Décembre, l'équipe Paza Sauti La Haki s'est rendue à l'Institut Uwezo.</p><ul><li>Nous avons sensibilisé les jeunes sur l'importance cruciale de la paix dans notre société.</li><li>Des échanges interactifs ont eu lieu sur la sensibilité aux conflits : comment les identifier et les prévenir.</li><li>L'accès à la justice a été au cœur des discussions, rappelant que chaque jeune a des droits.</li></ul><p>Les élèves ont montré un grand intérêt et se sont engagés à être des acteurs de paix dans leur école.</p>$html$,
  $html$<p>On December 2nd, the Paza Sauti La Haki team visited the Uwezo Institute.</p><ul><li>We raised awareness among youth about the crucial importance of peace in our society.</li><li>Interactive exchanges took place on conflict sensitivity: how to identify and prevent them.</li><li>Access to justice was at the heart of the discussions, reminding everyone that every young person has rights.</li></ul><p>The students showed great interest and committed to being actors of peace in their school.</p>$html$,
  'articles/sensibilisation-institut-uwezo/cover.webp', 'articles/sensibilisation-institut-uwezo/og.jpg', 'L''équipe Paza Sauti La Haki avec les élèves de l''Institut Uwezo', 'Paza Sauti La Haki', array['sensibilisation', 'paix', 'école']
),
(
  '1', 'l-acces-a-la-justice', 'published', '2025-11-29 10:00:00+02',
  'L''ACCÈS À LA JUSTICE', 'ACCESS TO JUSTICE',
  'La justice n''est pas un privilège, c''est le fondement de notre société.',
  'Justice is not a privilege, it is the foundation of our society.',
  $html$<p>La justice, c’est un droit pour tous, pas un privilège pour quelques-uns.</p><ul><li>Chacun mérite d’être écouté et défendu, peu importe qui il est.</li><li>L’accès à la justice, c’est permettre à chaque voix d’être entendue.</li><li>Sans justice, il n’y a pas de vraie paix.</li><li>Être jeune ne veut pas dire être sans droits.</li></ul><p><strong>La justice, c’est le chemin vers l’égalité.</strong></p>$html$,
  $html$<p>Justice is a right for all, not a privilege for a few.</p><ul><li>Everyone deserves to be heard and defended, no matter who they are.</li><li>Access to justice means allowing every voice to be heard.</li><li>Without justice, there is no true peace.</li><li>Being young does not mean being without rights.</li></ul><p><strong>Justice is the path to equality.</strong></p>$html$,
  'articles/l-acces-a-la-justice/cover.webp', 'articles/l-acces-a-la-justice/og.jpg', 'Balance de la justice', 'Paza Sauti La Haki', array['justice', 'droits']
),
(
  '2', 'paix-et-sensibilite-aux-conflits', 'published', '2025-11-29 09:00:00+02',
  'PAIX ET SENSIBILITÉ AUX CONFLITS', 'PEACE AND CONFLICT SENSITIVITY',
  'Comprendre les conflits pour mieux bâtir une paix durable.',
  'Understanding conflicts to better build lasting peace.',
  $html$<p>Sans la paix, pas de progrès durable. Investir dans la paix c'est investir pour un avenir meilleur.</p><blockquote>La paix est entre nos mains, bâtissons-la.</blockquote><ul><li>Être sensible aux conflits, c’est savoir quand il faut agir pour éviter le pire.</li><li>Être sensible aux conflits, c’est déjà protéger son école, sa famille, sa communauté.</li><li>Plus tu es sensible aux conflits, plus tu es capable de bâtir la paix.</li><li>Ignorer les petits conflits, c’est risquer de voir naître de grands problèmes.</li></ul><p><strong>Savoir écouter, observer, prévenir : c’est ça être sensible aux conflits.</strong></p>$html$,
  $html$<p>Without peace, there is no sustainable progress. Investing in peace is investing in a better future.</p><blockquote>Peace is in our hands, let's build it.</blockquote><ul><li>Being conflict-sensitive means knowing when to act to avoid the worst.</li><li>Being conflict-sensitive is already protecting one's school, family, community.</li><li>The more sensitive you are to conflicts, the more capable you are of building peace.</li><li>Ignoring small conflicts is risking the birth of big problems.</li></ul><p><strong>Knowing how to listen, observe, prevent: that is being conflict-sensitive.</strong></p>$html$,
  'articles/paix-et-sensibilite-aux-conflits/cover.webp', 'articles/paix-et-sensibilite-aux-conflits/og.jpg', 'Mains réunies symbolisant la paix', 'Paza Sauti La Haki', array['paix', 'conflits']
)
on conflict (slug) do update set
  legacy_id = excluded.legacy_id,
  status = excluded.status,
  published_at = excluded.published_at,
  title_fr = excluded.title_fr,
  title_en = excluded.title_en,
  summary_fr = excluded.summary_fr,
  summary_en = excluded.summary_en,
  content_fr = excluded.content_fr,
  content_en = excluded.content_en,
  cover_path = excluded.cover_path,
  og_image_path = excluded.og_image_path,
  cover_alt = excluded.cover_alt,
  author = excluded.author,
  tags = excluded.tags;

insert into public.gallery_images (path, position) values
  ('gallery/img-106.webp', 1),
  ('gallery/img-146.webp', 2),
  ('gallery/img-99.webp', 3),
  ('gallery/img-139.webp', 4),
  ('gallery/img-126.webp', 5),
  ('gallery/img-33.webp', 6),
  ('gallery/img-112.webp', 7),
  ('gallery/img-12.webp', 8),
  ('gallery/img-25.webp', 9),
  ('gallery/img-8.webp', 10),
  ('gallery/img-170.webp', 11)
on conflict (path) do update set position = excluded.position;
