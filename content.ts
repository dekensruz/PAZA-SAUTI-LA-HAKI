
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
      badge: 'Initiative de la Jeunesse de Goma',
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
      title: 'Qui sommes-nous ?',
      subtitle: 'Notre histoire et nos partenaires',
      description: "Nous sommes Paza Sauti la haki, une initiative de jeunes venus de différentes universités de la ville de Goma. Notre initiative est née à l’issue d’une formation reçue à l’Université Alternative de Pole Institute, dans le cadre du projet Accès à la Justice, appuyé par I-Peace et International Alert.",
      partnersTitle: 'Nos Partenaires',
      partners: [
        {
          name: 'International Alert',
          logo: 'https://i.ibb.co/4R0Vy8f3/ia.jpg',
          url: 'https://www.international-alert.org'
        },
        {
          name: 'I-Peace',
          logo: 'https://i.ibb.co/7qd6snw/ipeace.jpg',
          url: 'https://mis.iphr-ipdh.org/'
        },
        {
          name: 'Pole Institute',
          logo: 'https://i.ibb.co/PvncrQf8/pole.jpg',
          url: 'https://pole-institute.org'
        }
      ]
    },
    mission: {
      title: 'Notre Vision',
      subtitle: 'Nous croyons en une justice équitable et une paix durable. Voici les piliers de notre engagement.',
      cards: [
        {
          title: 'Droit pour tous',
          text: "La justice est un droit fondamental, pas un privilège réservé à une élite. Nous combattons pour l'égalité."
        },
        {
          title: 'Voix entendue',
          text: "Chacun mérite d'être écouté et défendu. L'accès à la justice permet à chaque voix de résonner."
        },
        {
          title: 'Paix véritable',
          text: "Sans justice, il n'y a pas de vraie paix. Nous travaillons pour bâtir des fondations solides."
        },
        {
          title: "Investir l'avenir",
          text: "Investir dans la paix et la gestion des conflits, c'est investir pour un avenir meilleur pour tous."
        },
        {
          title: "Justice Climatique",
          text: "Protéger l'environnement est une question de justice. Nous défendons le droit à un environnement sain pour les générations futures."
        }
      ]
    },
    gallery: {
        title: 'Notre Galerie',
        subtitle: 'Retour en images sur nos activités, nos descentes sur terrain et nos moments forts.',
        viewAll: 'Voir toutes les images',
        close: 'Fermer la galerie',
        images: [
            "https://i.ibb.co/21WwKYxw/IMG-106.jpg",
            "https://i.ibb.co/LDjJBZdK/IMG-146.jpg",
            "https://i.ibb.co/HpLdwmjB/IMG-99.jpg",
            "https://i.ibb.co/mFgStt02/IMG-139.jpg",
            "https://i.ibb.co/FL9hHLzJ/IMG-126.jpg",
            "https://i.ibb.co/Q7FNK3vJ/IMG-33.jpg",
            "https://i.ibb.co/F4FXgDfy/IMG-112.jpg",
            "https://i.ibb.co/wXdQTqt/IMG-12.jpg",
            "https://i.ibb.co/Zz7Fwbtb/IMG-25.jpg",
            "https://i.ibb.co/FLLFfYHH/IMG-8.jpg",
            "https://i.ibb.co/WWVHTzc4/IMG-170.jpg"
        ]
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
      posts: [
        {
          id: '5',
          title: "JOURNÉE INTERNATIONALE DES DROITS DE L'HOMME",
          summary: "Conférence en ligne sur Google Meet : Liberté d'expression vs discours de haine. Où se situe la limite ?",
          date: '10 Décembre 2025',
          image: 'https://i.ibb.co/Q3bgRjkZ/Publication-instagram-journ-e-internationale-des-droits-des-femmes-photographie-simple-violet-1.jpg',
          contentPoints: [
            "Nous avons organisé une conférence en ligne sur Google Meet pour célébrer cette journée importante.",
            "Le thème du débat était : 'Liberté d'expression vs discours de haine. Où se situe la limite ?'.",
            "Il est crucial de comprendre que la liberté d'expression ne justifie pas l'incitation à la haine ou à la violence.",
            "Les échanges ont permis de définir des lignes directrices pour un discours constructif et respectueux.",
            "Ensemble, nous nous engageons à promouvoir des droits humains universels dans nos communautés et en ligne."
          ]
        },
        {
          id: '4',
          title: "JOURNÉE MONDIALE DU CLIMAT",
          summary: "Aujourd'hui, le 08 Décembre 2025, nous célébrons la journée mondiale du climat. Protégeons notre planète pour un avenir durable.",
          date: '08 Décembre 2025',
          image: 'https://i.ibb.co/fw8zJ4R/Vert-Publication-Instagram-Engagement-cologique-Moderne.jpg',
          contentPoints: [
            "Le changement climatique n'est pas seulement un défi environnemental, c'est une question de justice.",
            "Nous avons le devoir de protéger notre planète pour les générations actuelles et futures.",
            "La dégradation de l'environnement affecte souvent les plus vulnérables en premier.",
            "Agir pour le climat, c'est agir pour la paix et la stabilité.",
            "Ensemble, adoptons des comportements responsables pour réduire notre impact écologique."
          ]
        },
        {
          id: '3',
          title: "SENSIBILISATION À L'INSTITUT UWEZO",
          summary: "Une journée d'échange enrichissante avec les élèves sur la paix, les conflits et la justice.",
          date: '02 Décembre 2025',
          image: 'https://i.ibb.co/21WwKYxw/IMG-106.jpg',
          contentPoints: [
            "Le 02 Décembre, l'équipe Paza Sauti La Haki s'est rendue à l'Institut Uwezo.",
            "Nous avons sensibilisé les jeunes sur l'importance cruciale de la paix dans notre société.",
            "Des échanges interactifs ont eu lieu sur la sensibilité aux conflits : comment les identifier et les prévenir.",
            "L'accès à la justice a été au cœur des discussions, rappelant que chaque jeune a des droits.",
            "Les élèves ont montré un grand intérêt et se sont engagés à être des acteurs de paix dans leur école."
          ]
        },
        {
          id: '1',
          title: "L'ACCÈS À LA JUSTICE",
          summary: "La justice n'est pas un privilège, c'est le fondement de notre société.",
          date: '29 Novembre 2025',
          image: 'https://images.pexels.com/photos/6077091/pexels-photo-6077091.jpeg',
          contentPoints: [
            "La justice, c’est un droit pour tous, pas un privilège pour quelques-uns.",
            "Chacun mérite d’être écouté et défendu, peu importe qui il est.",
            "L’accès à la justice, c’est permettre à chaque voix d’être entendue.",
            "Sans justice, il n’y a pas de vraie paix.",
            "Être jeune ne veut pas dire être sans droits.",
            "La justice, c’est le chemin vers l’égalité."
          ]
        },
        {
          id: '2',
          title: "PAIX ET SENSIBILITÉ AUX CONFLITS",
          summary: "Comprendre les conflits pour mieux bâtir une paix durable.",
          date: '29 Novembre 2025',
          image: 'https://images.pexels.com/photos/1835016/pexels-photo-1835016.jpeg',
          contentPoints: [
            "Sans la paix, pas de progrès durable.",
            "Investir dans la paix c'est investir pour un avenir meilleur.",
            "La paix est entre nos mains, bâtissons-la.",
            "Être sensible aux conflits, c’est savoir quand il faut agir pour éviter le pire.",
            "Être sensible aux conflits, c’est déjà protéger son école, sa famille, sa communauté.",
            "Plus tu es sensible aux conflits, plus tu es capable de bâtir la paix.",
            "Ignorer les petits conflits, c’est risquer de voir naître de grands problèmes.",
            "Savoir écouter, observer, prévenir : c’est ça être sensible aux conflits."
          ]
        }
      ]
    },
    faq: {
      title: 'Questions Fréquentes',
      subtitle: "Des réponses à vos questions sur l'accès à la justice et la résolution des conflits.",
      items: [
        {
          question: "Comment puis-je accéder à une assistance juridique gratuite ?",
          answer: "Notre initiative collabore avec des cliniques juridiques et des avocats professionnels. Contactez-nous via notre formulaire ou participez à nos séances de sensibilisation pour être orienté vers des structures partenaires offrant des consultations initiales gratuites."
        },
        {
          question: "Que faire si je suis témoin d'une injustice ou d'une violation des droits ?",
          answer: "Il est crucial de documenter les faits (photos, vidéos, témoignages) sans vous mettre en danger. Ensuite, signalez le cas aux autorités compétentes ou contactez Paza Sauti La Haki pour être orienté vers les structures d'aide et de protection adaptées."
        },
        {
          question: "Comment résoudre un conflit sans aller au tribunal ?",
          answer: "La médiation est un outil puissant. Nous encourageons le dialogue communautaire et l'intervention de médiateurs neutres (chefs de quartier, leaders religieux, ou nos médiateurs formés) pour trouver un terrain d'entente pacifique avant d'envisager des poursuites judiciaires."
        },
        {
          question: "L'initiative est-elle politiquement affiliée ?",
          answer: "Non, Paza Sauti La Haki est une initiative citoyenne, neutre et apolitique, portée par des étudiants de différentes universités de Goma. Notre seul parti est celui de la justice, de l'égalité et de la paix en RDC."
        },
        {
          question: "Comment puis-je rejoindre l'équipe ou devenir bénévole ?",
          answer: "Nous accueillons tous les jeunes motivés qui partagent nos valeurs ! Envoyez-nous un message via la section contact, suivez-nous sur les réseaux sociaux ou participez à nos événements publics pour rencontrer l'équipe et découvrir comment contribuer."
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
        submit: 'Envoyer le message'
      }
    },
    footer: {
      description: 'Une initiative des jeunes de Goma pour rendre la justice accessible à tous et promouvoir la paix en RDC.',
      quickLinks: 'Liens Rapides',
      contactUs: 'Contactez-nous',
      rights: 'Tous droits réservés.',
      developedBy: 'Développé par'
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
      badge: "Goma Youth Initiative",
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
      title: 'Who are we?',
      subtitle: 'Our story and partners',
      description: "We are Paza Sauti la Haki, an initiative of young people from different universities in the city of Goma. Our initiative was born following training received at the Alternative University of Pole Institute, as part of the Access to Justice project, supported by I-Peace and International Alert.",
      partnersTitle: 'Our Partners',
      partners: [
        {
          name: 'International Alert',
          logo: 'https://i.ibb.co/4R0Vy8f3/ia.jpg',
          url: 'https://www.international-alert.org'
        },
        {
          name: 'I-Peace',
          logo: 'https://i.ibb.co/7qd6snw/ipeace.jpg',
          url: 'https://mis.iphr-ipdh.org/'
        },
        {
          name: 'Pole Institute',
          logo: 'https://placehold.co/300x150/ffffff/333333?text=Pole+Institute',
          url: 'https://pole-institute.org'
        }
      ]
    },
    mission: {
      title: 'Our Vision',
      subtitle: 'We believe in fair justice and lasting peace. Here are the pillars of our commitment.',
      cards: [
        {
          title: 'Rights for All',
          text: "Justice is a fundamental right, not a privilege reserved for an elite. We fight for equality."
        },
        {
          title: 'Heard Voice',
          text: "Everyone deserves to be heard and defended. Access to justice allows every voice to resonate."
        },
        {
          title: 'True Peace',
          text: "Without justice, there is no true peace. We work to build solid foundations."
        },
        {
          title: "Investing in Future",
          text: "Investing in peace and conflict management is investing in a better future for all."
        },
        {
          title: "Climate Justice",
          text: "Protecting the environment is a matter of justice. We defend the right to a healthy environment for current and future generations."
        }
      ]
    },
    gallery: {
        title: 'Our Gallery',
        subtitle: 'A look back in images at our activities, field visits, and highlights.',
        viewAll: 'View all images',
        close: 'Close gallery',
        images: [
            "https://i.ibb.co/21WwKYxw/IMG-106.jpg",
            "https://i.ibb.co/LDjJBZdK/IMG-146.jpg",
            "https://i.ibb.co/HpLdwmjB/IMG-99.jpg",
            "https://i.ibb.co/mFgStt02/IMG-139.jpg",
            "https://i.ibb.co/FL9hHLzJ/IMG-126.jpg",
            "https://i.ibb.co/Q7FNK3vJ/IMG-33.jpg",
            "https://i.ibb.co/F4FXgDfy/IMG-112.jpg",
            "https://i.ibb.co/wXdQTqt/IMG-12.jpg",
            "https://i.ibb.co/Zz7Fwbtb/IMG-25.jpg",
            "https://i.ibb.co/FLLFfYHH/IMG-8.jpg",
            "https://i.ibb.co/WWVHTzc4/IMG-170.jpg"
        ]
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
      posts: [
        {
          id: '5',
          title: "INTERNATIONAL HUMAN RIGHTS DAY",
          summary: "Online conference on Google Meet: Freedom of expression vs hate speech. Where is the limit?",
          date: 'December 10, 2025',
          image: 'https://i.ibb.co/Q3bgRjkZ/Publication-instagram-journ-e-internationale-des-droits-des-femmes-photographie-simple-violet-1.jpg',
          contentPoints: [
            "We organized an online conference on Google Meet to celebrate this important day.",
            "The theme of the debate was: 'Freedom of expression vs hate speech. Where is the limit?'.",
            "It is crucial to understand that freedom of expression does not justify incitement to hate or violence.",
            "The exchanges helped define guidelines for constructive and respectful discourse.",
            "Together, we commit to promoting universal human rights in our communities and online."
          ]
        },
        {
          id: '4',
          title: "WORLD CLIMATE DAY",
          summary: "Today, December 8, 2025, let's celebrate World Climate Day. Let's protect our planet for a sustainable future.",
          date: 'December 08, 2025',
          image: 'https://i.ibb.co/fw8zJ4R/Vert-Publication-Instagram-Engagement-cologique-Moderne.jpg',
          contentPoints: [
            "Climate change is not just an environmental challenge, it is a matter of justice.",
            "We have a duty to protect our planet for current and future generations.",
            "Environmental degradation often affects the most vulnerable first.",
            "Acting for the climate means acting for peace and stability.",
            "Together, let's adopt responsible behaviors to reduce our ecological impact."
          ]
        },
        {
          id: '3',
          title: "SENSITIZATION AT UWEZO INSTITUTE",
          summary: "An enriching day of exchange with students on peace, conflicts, and justice.",
          date: 'December 02, 2024',
          image: 'https://i.ibb.co/21WwKYxw/IMG-106.jpg',
          contentPoints: [
            "On December 2nd, the Paza Sauti La Haki team visited the Uwezo Institute.",
            "We raised awareness among youth about the crucial importance of peace in our society.",
            "Interactive exchanges took place on conflict sensitivity: how to identify and prevent them.",
            "Access to justice was at the heart of the discussions, reminding everyone that every young person has rights.",
            "The students showed great interest and committed to being actors of peace in their school."
          ]
        },
        {
          id: '1',
          title: "ACCESS TO JUSTICE",
          summary: "Justice is not a privilege, it is the foundation of our society.",
          date: 'November 29, 2025',
          image: 'https://images.pexels.com/photos/6077091/pexels-photo-6077091.jpeg',
          contentPoints: [
            "Justice is a right for all, not a privilege for a few.",
            "Everyone deserves to be heard and defended, no matter who they are.",
            "Access to justice means allowing every voice to be heard.",
            "Without justice, there is no true peace.",
            "Being young does not mean being without rights.",
            "Justice is the path to equality."
          ]
        },
        {
          id: '2',
          title: "PEACE AND CONFLICT SENSITIVITY",
          summary: "Understanding conflicts to better build lasting peace.",
          date: 'November 29, 2025',
          image: 'https://images.pexels.com/photos/1835016/pexels-photo-1835016.jpeg',
          contentPoints: [
            "Without peace, there is no sustainable progress.",
            "Investing in peace is investing in a better future.",
            "Peace is in our hands, let's build it.",
            "Being conflict-sensitive means knowing when to act to avoid the worst.",
            "Being conflict-sensitive is already protecting one's school, family, community.",
            "The more sensitive you are to conflicts, the more capable you are of building peace.",
            "Ignoring small conflicts is risking the birth of big problems.",
            "Knowing how to listen, observe, prevent: that is being conflict-sensitive."
          ]
        }
      ]
    },
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: "Answers to your questions about access to justice and conflict resolution.",
      items: [
        {
          question: "How can I access free legal assistance?",
          answer: "Our initiative collaborates with legal clinics and professional lawyers. Contact us via our form or participate in our awareness sessions to be directed to partner structures offering free initial consultations."
        },
        {
          question: "What should I do if I witness injustice or a rights violation?",
          answer: "It is crucial to document the facts (photos, videos, testimonies) without putting yourself in danger. Then, report the case to the competent authorities or contact Paza Sauti La Haki to be directed to appropriate aid and protection structures."
        },
        {
          question: "How to resolve a conflict without going to court?",
          answer: "Mediation is a powerful tool. We encourage community dialogue and the intervention de neutral mediators (neighborhood chiefs, religious leaders, or our trained mediators) to find a peaceful common ground before considering legal action."
        },
        {
          question: "Is the initiative politically affiliated?",
          answer: "No, Paza Sauti La Haki is a citizen initiative, neutral and apolitical, led by students from different universities in Goma. Our only party is that of justice, equality, and peace in the DRC."
        },
        {
          question: "How can I join the team or become a volunteer?",
          answer: "We welcome all motivated young people who share our values! Send us a message via the contact section, follow us on social media, or attend our public events to meet the team and find out how to contribute."
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
        submit: 'Send Message'
      }
    },
    footer: {
      description: 'An initiative by Goma youth to make justice accessible to all and promote peace in the DRC.',
      quickLinks: 'Quick Links',
      contactUs: 'Contact Us',
      rights: 'All rights reserved.',
      developedBy: 'Developed by'
    }
  }
};
