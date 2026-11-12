
export type Language = 'fr' | 'en';

export const content = {
  fr: {
    nav: {
      home: 'Accueil',
      about: 'À Propos',
      mission: 'Mission',
      gallery: 'Galerie',
      team: 'Équipe',
      faq: 'FAQ',
      blog: 'Blog',
      contact: 'Contact'
    },
    hero: {
      titleStart: 'Élève la',
      titleHighlight1: 'Voix',
      titleMiddle: 'de la',
      titleHighlight2: 'Justice',
      description: 'Une initiative audacieuse des jeunes étudiants de Goma visant à rendre la justice accessible à tous en République Démocratique du Congo.',
      ctaMission: 'Notre Mission',
      ctaJoin: 'Rejoignez-nous',
      logoTitle: 'Paza Sauti La Haki',
      logoSubtitle: "L'avenir de la justice est entre nos mains."
    },
    about: {
      title: 'Notre histoire',
      subtitle: 'Origine de l\'initiative',
      description: "Nous sommes Paza Sauti La Haki, une initiative portée par de jeunes étudiants issus de différentes universités de Goma. Notre collectif est né à l'issue d'une formation reçue à l'Université Alternative de Pole Institute, dans le cadre du projet « Accès à la Justice » soutenu par un consortium de trois organisations (Pole Institute, International Alert et I-Peace).",
    },
    mission: {
      visionTitle: 'Notre Vision',
      visionText: "Bâtir une société congolaise juste, pacifique et équitable, où l'accès à la justice n'est plus un privilège mais un droit garanti et accessible à chaque citoyen.",
      missionTitle: 'Notre Mission',
      missionText: "Rapprocher le droit du citoyen, favoriser la résolution pacifique des conflits et protéger les populations vulnérables.",
      missionSubtitle: "Pour accomplir cette mission, nous nous appuyons sur trois piliers :",
      missionPillars: [
        { title: "Éduquer & Vulgariser", text: "Rendre les textes de loi et les droits fondamentaux compréhensibles par tous." },
        { title: "Orienter & Accompagner", text: "Offrir une orientation et une assistance juridique gratuite en partenariat avec des professionnels du droit." },
        { title: "Mobiliser & Agir", text: "Mener des actions humanitaires et communautaires concrètes pour garantir l'égalité des chances et la justice sociale." }
      ],
      valuesTitle: 'Nos Valeurs',
      values: [
        { title: "Équité & Inclusivité", text: "L'égalité des droits pour tous, sans distinction de statut socio-économique." },
        { title: "Intégrité & Neutralité", text: "Une démarche citoyenne, apolitique et rigoureuse au service de l'intérêt général." },
        { title: "Engagement de la jeunesse", text: "La conviction que les jeunes sont les acteurs principaux du changement social et de la consolidation de la paix." },
        { title: "Solidarité & Humanité", text: "Une approche bienveillante axée sur la protection des membres les plus fragiles de notre communauté." }
      ],
      domainsTitle: "Nos Domaines d'Intervention",
      domains: [
        "Accès à la Justice & Assistance Juridique",
        "Médiation & Prévention des Conflits",
        "Solidarité & action humanitaire",
        "Justice Climatique & Environnementale"
      ]
    },
    gallery: {
        title: 'Notre Galerie',
        subtitle: 'Retour en images sur nos activités, nos descentes sur terrain et nos moments forts.',
        viewAll: 'Voir toutes les images',
        close: 'Fermer la galerie'
    },
    team: {
      title: 'Notre Équipe',
      subtitle: 'Des jeunes engagés de différentes universités de Goma, unis pour la cause de la justice.',
      viewAll: 'Voir tous les membres',
      fullPageTitle: 'Équipe Complète',
      fullPageSubtitle: "L'équipe complète Paza Sauti La Haki",
      back: 'Retour',
      role: 'Membre Actif',
      memberRoleDesc: "Membre de l'équipe Paza Sauti La Haki",
      studentDesc: 'Étudiant(e) à Goma, RDC',
      quote: '"Engagé(e) pour une justice équitable et accessible à tous."'
    },
    blog: {
      title: 'Articles Récents',
      subtitle: 'Sensibilisation et éducation pour le changement.',
      readMore: 'Lire plus',
      viewAll: 'Voir tous les articles',
      close: 'Fermer',
      share: 'Partager',
      copied: 'Lien copié !',
      copyLink: 'Copier le lien',
      shareWhatsApp: 'Partager sur WhatsApp',
      shareFacebook: 'Partager sur Facebook',
      shareX: 'Partager sur X',
      shareLinkedIn: 'Partager sur LinkedIn',
      allArticles: 'Tous nos articles',
      blogIntro: "Actualités, campagnes de sensibilisation et réflexions de l'équipe sur la justice, la paix et les droits humains.",
      backToBlog: 'Retour aux articles',
      related: 'À lire aussi',
      minRead: 'min de lecture',
      empty: 'Aucun article publié pour le moment.',
      notFound: "Cet article est introuvable ou n'est plus disponible.",
      loadError: "Impossible de charger le contenu. Vérifiez votre connexion et réessayez.",
      featured: 'À la une',
      search: 'Rechercher un article…',
      noResults: 'Aucun article ne correspond à votre recherche.'
    },
    faq: {
      title: 'Questions Fréquentes',
      subtitle: "Des réponses à vos questions sur l'accès à la justice et la résolution des conflits.",
      items: [
        {
          question: "Comment puis-je accéder à une assistance juridique gratuite ?",
          answer: "Notre initiative collabore avec des cliniques juridiques et des avocats partenaires. Contactez-nous via notre formulaire de contact ou participez à nos séances de sensibilisation pour être orienté(e) vers des structures partenaires offrant des consultations initiales gratuites."
        },
        {
          question: "Que faire si je suis témoin d'une injustice ou d'une violation des droits ?",
          answer: "Il est essentiel de documenter les faits (photos, vidéos, témoignages) sans jamais vous mettre en danger. Signalez ensuite la situation aux autorités compétentes ou contactez Paza Sauti La Haki afin d'être orienté(e) vers des structures d'accompagnement et de protection adaptées."
        },
        {
          question: "Comment résoudre un conflit sans aller au tribunal ?",
          answer: "La médiation est une solution efficace. Nous encourageons le dialogue communautaire et l'intervention de médiateurs neutres (cadres de base, chefs de quartier, leaders religieux ou nos propres médiateurs formés) pour trouver un terrain d'entente pacifique avant d'envisager toute démarche judiciaire."
        },
        {
          question: "L'initiative est-elle politiquement affiliée ?",
          answer: "Non. Paza Sauti La Haki est une initiative citoyenne, neutre et apolitique, portée par des étudiants issus de différentes universités de Goma. Notre unique engagement est en faveur de la justice, de l'égalité, de la protection de l'environnement et de la paix en RDC."
        },
        {
          question: "Comment puis-je rejoindre l'équipe ou devenir bénévole ?",
          answer: "Nous accueillons chaleureusement tous les jeunes motivés qui partagent nos valeurs. Envoyez-nous un message via notre page Contact, suivez-nous sur les réseaux sociaux ou participez à nos événements publics pour rencontrer l'équipe et découvrir comment vous engager à nos côtés."
        }
      ]
    },
    contact: {
      title: 'Contactez-nous',
      subtitle: "Vous voulez rejoindre l'initiative, devenir partenaire ou simplement poser une question ? Écrivez-nous.",
      infoTitle: 'Info Contact',
      infoDesc: 'Remplissez le formulaire et notre équipe vous répondra dans les 24 heures.',
      servicePartnership: 'Service Partenariat',
      successTitle: 'Message Envoyé !',
      successDesc: 'Merci de nous avoir contactés. Nous reviendrons vers vous très bientôt.',
      form: {
        name: 'Nom complet',
        namePlaceholder: 'Votre nom',
        email: 'Email',
        emailPlaceholder: 'votre@email.com',
        subject: 'Sujet',
        subjectPlaceholder: 'Sélectionnez un sujet',
        subjects: {
          join: "Je veux rejoindre l'équipe",
          partner: "Proposition de partenariat",
          help: "Besoin d'aide juridique",
          other: "Autre demande"
        },
        message: 'Message',
        messagePlaceholder: 'Comment pouvons-nous vous aider ?',
        submit: 'Envoyer le message',
        sending: 'Envoi…',
        error: "L'envoi a échoué. Réessayez ou écrivez-nous directement par e-mail."
      }
    },
    footer: {
      description: 'Une initiative des jeunes de Goma pour rendre la justice accessible à tous et promouvoir la paix en RDC.',
      quickLinks: 'Liens Rapides',
      contactUs: 'Contactez-nous',
      rights: 'Tous droits réservés.',
      developedBy: 'Développé par',
      notFoundTitle: 'Page introuvable',
      notFoundText: "La page que vous cherchez n'existe pas ou a été déplacée.",
      backHome: "Retour à l'accueil"
    }
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      mission: 'Mission',
      gallery: 'Gallery',
      team: 'Team',
      faq: 'FAQ',
      blog: 'Blog',
      contact: 'Contact'
    },
    hero: {
      titleStart: 'Raise the',
      titleHighlight1: 'Voice',
      titleMiddle: 'of',
      titleHighlight2: 'Justice',
      description: 'A bold initiative by Goma students aiming to make justice accessible to all in the Democratic Republic of Congo.',
      ctaMission: 'Our Mission',
      ctaJoin: 'Join Us',
      logoTitle: 'Paza Sauti La Haki',
      logoSubtitle: "The future of justice is in our hands."
    },
    about: {
      title: 'Our History',
      subtitle: 'Origin of the Initiative',
      description: "We are Paza Sauti La Haki, an initiative led by young students from various universities in Goma. Our collective was born after a training received at the Alternative University of Pole Institute, as part of the \"Access to Justice\" project supported by a consortium of three organizations (Pole Institute, International Alert, and I-Peace).",
    },
    mission: {
      visionTitle: 'Our Vision',
      visionText: "To build a just, peaceful, and equitable Congolese society where access to justice is no longer a privilege but a guaranteed right accessible to every citizen.",
      missionTitle: 'Our Mission',
      missionText: "To bring the law closer to the citizen, promote peaceful conflict resolution, and protect vulnerable populations.",
      missionSubtitle: "To accomplish this mission, we rely on three pillars:",
      missionPillars: [
        { title: "Educate & Popularize", text: "Make laws and fundamental rights understandable to all." },
        { title: "Guide & Accompany", text: "Provide free legal guidance and assistance in partnership with legal professionals." },
        { title: "Mobilize & Act", text: "Conduct concrete humanitarian and community actions to ensure equal opportunities and social justice." }
      ],
      valuesTitle: 'Our Values',
      values: [
        { title: "Equity & Inclusivity", text: "Equal rights for all, regardless of socio-economic status." },
        { title: "Integrity & Neutrality", text: "A civic, apolitical, and rigorous approach in the service of the general interest." },
        { title: "Youth Engagement", text: "The conviction that young people are the main actors of social change and peacebuilding." },
        { title: "Solidarity & Humanity", text: "A caring approach focused on protecting the most fragile members of our community." }
      ],
      domainsTitle: "Our Areas of Intervention",
      domains: [
        "Access to Justice & Legal Assistance",
        "Mediation & Conflict Prevention",
        "Solidarity & Humanitarian Action",
        "Climate & Environmental Justice"
      ]
    },
    gallery: {
        title: 'Our Gallery',
        subtitle: 'A look back in images at our activities, field visits, and highlights.',
        viewAll: 'View all images',
        close: 'Close gallery'
    },
    team: {
      title: 'Our Team',
      subtitle: 'Committed youth from different universities in Goma, united for the cause of justice.',
      viewAll: 'See all members',
      fullPageTitle: 'Full Team',
      fullPageSubtitle: "The complete Paza Sauti La Haki team",
      back: 'Back',
      role: 'Active Member',
      memberRoleDesc: "Paza Sauti La Haki Team Member",
      studentDesc: 'Student in Goma, DRC',
      quote: '"Committed to fair and accessible justice for all."'
    },
    blog: {
      title: 'Recent Articles',
      subtitle: 'Awareness and education for change.',
      readMore: 'Read more',
      viewAll: 'View all articles',
      close: 'Close',
      share: 'Share',
      copied: 'Link copied!',
      copyLink: 'Copy Link',
      shareWhatsApp: 'Share on WhatsApp',
      shareFacebook: 'Share on Facebook',
      shareX: 'Share on X',
      shareLinkedIn: 'Share on LinkedIn',
      allArticles: 'All our articles',
      blogIntro: 'News, awareness campaigns and reflections from the team on justice, peace and human rights.',
      backToBlog: 'Back to articles',
      related: 'Read next',
      minRead: 'min read',
      empty: 'No articles published yet.',
      notFound: 'This article could not be found or is no longer available.',
      loadError: 'Unable to load content. Check your connection and try again.',
      featured: 'Featured',
      search: 'Search articles…',
      noResults: 'No article matches your search.'
    },
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: "Answers to your questions about access to justice and conflict resolution.",
      items: [
        {
          question: "How can I access free legal assistance?",
          answer: "Our initiative collaborates with legal clinics and partner lawyers. Contact us via our contact form or participate in our awareness sessions to be directed to partner structures offering free initial consultations."
        },
        {
          question: "What should I do if I witness injustice or a rights violation?",
          answer: "It is essential to document the facts (photos, videos, testimonies) without ever putting yourself in danger. Then, report the situation to the competent authorities or contact Paza Sauti La Haki to be directed to appropriate support and protection structures."
        },
        {
          question: "How to resolve a conflict without going to court?",
          answer: "Mediation is an effective solution. We encourage community dialogue and the intervention of neutral mediators (grassroots leaders, neighborhood chiefs, religious leaders, or our own trained mediators) to find a peaceful common ground before considering any legal action."
        },
        {
          question: "Is the initiative politically affiliated?",
          answer: "No. Paza Sauti La Haki is a citizen initiative, neutral and apolitical, led by students from different universities in Goma. Our only commitment is in favor of justice, equality, environmental protection, and peace in the DRC."
        },
        {
          question: "How can I join the team or become a volunteer?",
          answer: "We warmly welcome all motivated young people who share our values. Send us a message via our Contact page, follow us on social media, or attend our public events to meet the team and discover how to get involved with us."
        }
      ]
    },
    contact: {
      title: 'Contact Us',
      subtitle: "Want to join the initiative, become a partner, or just ask a question? Write to us.",
      infoTitle: 'Contact Info',
      infoDesc: 'Fill out the form and our team will reply within 24 hours.',
      servicePartnership: 'Partnership Service',
      successTitle: 'Message Sent!',
      successDesc: 'Thank you for contacting us. We will get back to you very soon.',
      form: {
        name: 'Full Name',
        namePlaceholder: 'Your name',
        email: 'Email',
        emailPlaceholder: 'your@email.com',
        subject: 'Subject',
        subjectPlaceholder: 'Select a subject',
        subjects: {
          join: "I want to join the team",
          partner: "Partnership proposal",
          help: "Need legal help",
          other: "Other request"
        },
        message: 'Message',
        messagePlaceholder: 'How can we help you?',
        submit: 'Send Message',
        sending: 'Sending…',
        error: 'Sending failed. Please try again or email us directly.'
      }
    },
    footer: {
      description: 'An initiative by Goma youth to make justice accessible to all and promote peace in the DRC.',
      quickLinks: 'Quick Links',
      contactUs: 'Contact Us',
      rights: 'All rights reserved.',
      developedBy: 'Developed by',
      notFoundTitle: 'Page not found',
      notFoundText: "The page you are looking for doesn't exist or has moved.",
      backHome: 'Back to home'
    }
  }
};
