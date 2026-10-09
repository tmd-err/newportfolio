import type { Dictionary } from "../types";

const fr: Dictionary = {
  meta: {
    title: "Yahya Tamda — Développeur Web Full Stack",
    description:
      "Développeur web full stack junior basé à Rabat, Maroc. Je conçois des plateformes web robustes, élégantes et orientées produit — de la modélisation des données à des interfaces rapides et accessibles.",
  },
  nav: {
    about: "Profil",
    projects: "Projets",
    skills: "Technologies",
    journey: "Parcours",
    cv: "CV",
    contact: "Contact",
    downloadCv: "Télécharger le CV",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    languageSwitcher: "Changer de langue",
    progressLabel: "Progression du voyage",
  },
  hero: {
    availability: "Maroc · Disponible pour des opportunités web et produit",
    role: "Développeur Web Full Stack Junior",
    intro:
      "Je conçois des plateformes web robustes, élégantes et orientées produit, avec une attention précise portée à l'architecture, à l'expérience utilisateur et à la qualité du code.",
    ctaExplore: "Explorer mon univers",
    ctaProjects: "Voir mes projets",
    ctaCv: "Télécharger mon CV",
    scrollHint: "Défiler pour voyager",
  },
  about: {
    label: "Acte 01 — Le développeur",
    heading: "Le développeur derrière l'écran.",
    lead: "D'un besoin métier à une interface livrée — je construis tout le chemin.",
    paragraphs: [
      "Développeur web full stack junior, diplômé d'une Licence en Génie Informatique, avec une expérience pratique acquise lors d'un stage chez ŠKODA et à travers plus de quinze projets personnels.",
      "Je travaille sur l'ensemble de la pile : API REST avec Node.js, Express ou Laravel, frontends avec React et Next.js, et bases de données relationnelles ou documentaires comme MySQL, PostgreSQL et MongoDB.",
      "Mon approche est orientée qualité : architecture claire (MVC, POO), code maintenable et interfaces qui aident les utilisateurs à comprendre et à agir rapidement.",
    ],
    facts: [
      { label: "Basé à", value: "Rabat, Maroc" },
      { label: "Diplôme", value: "Licence en Génie Informatique" },
      { label: "Langues", value: "Français · Arabe · Anglais" },
      { label: "Focus", value: "Produits web full stack" },
    ],
  },
  projects: {
    label: "Acte 02 — Les mondes",
    heading: "Chaque projet est un monde à part entière.",
    intro:
      "Une sélection parmi plus de quinze réalisations web, mobiles et IA — de l'EdTech aux marketplaces, à l'e-commerce, à l'inventaire et à la vision par ordinateur.",
    supportingHeading: "Le reste du laboratoire",
    supportingIntro:
      "D'autres projets sont disponibles sur demande ou sur mon profil GitHub.",
    viewProject: "Entrer dans ce monde",
    github: "Voir sur GitHub",
    demo: "Démo en ligne",
    privateLabel: "Projet privé — disponible sur demande",
    nextLabel: "Monde suivant",
    items: {
      edtech: {
        name: "EdTech",
        kicker: "AI Exams · Plateforme d'examens",
        summary:
          "Plateforme complète de gestion des examens scolaires avec génération assistée par IA, banque de questions, tableaux de bord et environnement d'examen intégré.",
        description:
          "Une plateforme complète de gestion des examens pour les établissements scolaires : authentification multi-rôles (administrateurs, enseignants, étudiants), tableaux de bord dédiés par profil, gestion des notes, des groupes et des examens, et notifications en temps réel sur une architecture modulaire orientée API REST.",
        features: [
          "Examens générés par IA",
          "Création manuelle d'examens",
          "Banque de questions",
          "Gestion des étudiants",
        ],
        role: "Développeur full stack",
      },
      crafthub: {
        name: "CraftHUB",
        kicker: "Marketplace · Artisans",
        summary:
          "Marketplace mettant en relation artisans et clients avec réservation de services, profils publics, messagerie, avis et gestion complète des demandes.",
        description:
          "Une plateforme qui connecte artisans, entreprises et clients : profils artisans, réservation de services par créneau horaire ou journée complète, messagerie client-artisan et API REST pour la mise en relation — avec une interface responsive côté client comme côté prestataire. L'environnement de développement est entièrement conteneurisé avec Docker.",
        features: [
          "Réservation d'artisans et de services",
          "Créneaux horaires ou journées complètes",
          "Messagerie client-artisan",
          "Profils publics",
        ],
        role: "Développeur full stack",
      },
      velora: {
        name: "VELORA",
        kicker: "E-commerce premium · Parfums",
        summary:
          "Plateforme e-commerce de parfums de luxe avec parcours d'achat complet, comptes clients, catalogue, commandes et génération de factures.",
        description:
          "Une expérience e-commerce dédiée aux parfums de luxe : catalogue produits avec filtres, panier, checkout, comptes clients, gestion des commandes et génération de factures — le tout dans une interface moderne, responsive et orientée conversion.",
        features: [
          "Panier et checkout",
          "Génération de factures",
          "Authentification",
          "Catalogue produits",
        ],
        role: "Développeur full stack",
      },
      autotrack: {
        name: "AutoTrack",
        kicker: "Škoda · Inventaire multi-site",
        summary:
          "Plateforme de gestion d'inventaire développée pour Škoda, centrée sur la traçabilité du matériel de bureau, les transferts et les rapports.",
        description:
          "Développée lors de mon stage chez Škoda : une plateforme d'inventaire multi-sites couvrant la gestion des articles et des mouvements de stock (entrées, sorties, quantités disponibles), les signatures de transfert, l'historique des mouvements et un espace d'administration — sur une architecture MVC structurée, avec des tests automatisés PHPUnit validant les fonctionnalités clés.",
        features: [
          "Gestion du stock de matériel",
          "Transferts multi-sites",
          "Historique des mouvements",
          "Signatures de transfert",
        ],
        role: "Développeur web — stage, Škoda",
      },
      facedetector: {
        name: "Face Detector",
        kicker: "Vision par ordinateur · Détection IA",
        summary:
          "Application GUI Python pour détecter visages humains et animaux sur image ou webcam, avec estimation d'âge, genre et classification animale.",
        description:
          "Une application bureautique expérimentale de vision par ordinateur : détection de visages humains et animaux depuis des images importées ou un flux webcam en direct, estimation de l'âge et du genre, et classification animale avec score de confiance.",
        features: [
          "Détection humaine et animale",
          "Estimation âge et genre",
          "Classification animale avec score de confiance",
          "Import d'image ou flux webcam",
        ],
        role: "Développeur",
      },
      scholvia: {
        name: "Scholvia",
        kicker: "Site vitrine · École",
        summary:
          "Site WordPress de présentation pour une école privée, structuré pour informer les familles et faciliter les demandes d'inscription.",
        description:
          "Un site vitrine WordPress pour une école privée : présentation de l'établissement, services et classes, demandes d'inscription et informations de paiement.",
        features: [
          "Présentation de l'école",
          "Services et classes",
          "Inscription",
          "Informations de paiement",
        ],
      },
      autonova: {
        name: "Auto Nova",
        kicker: "Gestion automobile · Concession",
        summary:
          "Plateforme premium de gestion de concession automobile avec recherche de véhicules, fiches détaillées, rendez-vous et demandes de réservation.",
        description:
          "Une plateforme premium de gestion de concession : catalogue de véhicules disponibles, recherche avancée, pages véhicule détaillées, rendez-vous et demandes de réservation.",
        features: [
          "Catalogue de véhicules disponibles",
          "Recherche avancée",
          "Pages véhicule détaillées",
          "Contact concession",
        ],
      },
    },
  },
  skills: {
    label: "Acte 03 — La constellation",
    heading: "Un paysage technique, cartographié par usage.",
    intro:
      "Chaque technologie que j'utilise, regroupée comme je travaille réellement — des langages aux outils de déploiement.",
    groups: {
      languages: {
        title: "Langages",
        blurb: "La grammaire de tout ce que je construis.",
      },
      frontend: {
        title: "Frontend",
        blurb: "Des interfaces rapides, lisibles et responsives.",
      },
      backend: {
        title: "Backend",
        blurb: "Des API et des services pensés pour rester maintenables.",
      },
      data: {
        title: "Bases de données",
        blurb: "Relationnelles ou documentaires, modélisées pour le produit.",
      },
      architecture: {
        title: "API & Architecture",
        blurb: "Les patterns qui gardent les systèmes propres en grandissant.",
      },
      tools: {
        title: "DevOps & Outils",
        blurb: "La chaîne d'outils du quotidien derrière chaque livraison.",
      },
    },
  },
  journey: {
    label: "Acte 04 — Le chemin",
    heading: "Le parcours jusqu'ici.",
    intro:
      "Formations et expériences — une progression construite autour de la qualité logicielle.",
    education: "Formation",
    experience: "Expérience",
    items: {
      licence: {
        title: "Licence en Génie Informatique",
        org: "HIGH TECH, Rabat",
        period: "2025 — 2026",
        summary:
          "Licence axée sur le génie logiciel, l'architecture et les pratiques de développement modernes.",
      },
      skoda: {
        title: "Développeur Web — Projet de Gestion de Stock",
        org: "ŠKODA, Rabat — stage",
        period: "Mars 2025 — Avril 2025",
        summary:
          "Conception et développement d'une solution de gestion et de suivi des stocks avec Laravel et MySQL : gestion des articles, mouvements de stock, espace d'administration et base de données MVC optimisée — au sein d'une équipe Agile avec sprints et réunions de suivi.",
      },
      dts: {
        title: "DTS en Développement Digital, option Full Stack",
        org: "ISTAG Yaacoub El Mansour, Rabat",
        period: "2023 — 2025",
        summary:
          "Diplôme de technicien spécialisé couvrant l'ensemble du cycle de développement web, des bases de données aux applications déployées.",
      },
      bac: {
        title: "Baccalauréat, Sciences Physiques",
        org: "Lycée Abi Dar Elghifari, Rabat",
        period: "2023",
        summary:
          "Baccalauréat scientifique — le point de départ du voyage vers l'ingénierie.",
      },
    },
  },
  cv: {
    label: "Acte 05 — Le portail",
    heading: "Emportez toute l'histoire avec vous.",
    text: "Le CV complet — formation, expérience, projets et compétences — dans un seul document, prêt à ouvrir ou à télécharger.",
    download: "Télécharger le CV",
    open: "Ouvrir dans un nouvel onglet",
  },
  contact: {
    label: "Acte 06 — La destination",
    heading: "Construisons quelque chose qui vaut le voyage.",
    intro:
      "Disponible pour construire des produits web sérieux, élégants et prêts à évoluer. Tous les canaux importants sont à un clic.",
    availability:
      "Ouvert aux opportunités, collaborations et projets ambitieux.",
    emailLabel: "E-mail",
    phoneLabel: "Téléphone / WhatsApp",
    locationLabel: "Localisation",
    formTitle: "Envoyer un message",
    formName: "Votre nom",
    formEmail: "Votre e-mail",
    formMessage: "Votre message",
    formSend: "Ouvrir dans votre application e-mail",
    formHint:
      "Ce formulaire ouvre votre client e-mail avec le message pré-rempli — rien n'est stocké sur ce site.",
    closing: "Merci d'être allé(e) jusqu'au bout du voyage.",
  },
  footer: {
    tagline: "Conçu et développé comme un voyage — pas comme une page.",
    rights: "Tous droits réservés.",
  },
  projectPage: {
    overview: "Aperçu",
    stack: "Stack technique",
    features: "Points clés",
    links: "Liens",
    github: "Dépôt sur GitHub",
    privateNote:
      "Le code source de ce projet est privé. Détails et démonstration disponibles sur demande.",
    back: "Retour au voyage",
    otherProjects: "Autres mondes",
  },
  a11y: {
    skipToContent: "Aller au contenu",
    sceneAlt: "Scène 3D décorative du voyage",
  },
  notFound: {
    title: "Perdu dans le vide",
    text: "Cette coordonnée n'existe pas dans cet univers.",
    cta: "Retour au point de départ",
  },
};

export default fr;
