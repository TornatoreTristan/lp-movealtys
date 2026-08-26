import type { Locale } from './config'

/** External destinations — the marketing site never owns these routes. */
export const APP_URLS = {
  login: 'https://app.movealtys.com/login',
  register: 'https://app.movealtys.com/register',
} as const

export const CONTACT = {
  email: 'contact@movealtys.com',
} as const

const fr = {
  meta: {
    title: 'Coût de revient, marge et optimisation des tournées · MoveAltys',
    description:
      "MoveAltys calcule le coût de revient réel et la marge de chaque tournée (carburant, péages, conducteur) et optimise l'itinéraire. Vous savez si une tournée est rentable avant le départ du véhicule.",
    ogAlt: "Aperçu de l'application MoveAltys",
  },
  nav: {
    features: 'Fonctionnalités',
    how: 'Comment ça marche',
    audience: 'Pour qui',
    independents: 'Pour les indépendants',
    tpe: 'Pour les TPE',
    localDelivery: 'Pour la livraison locale',
    internalFleet: 'Pour les flottes internes',
    pricing: 'Tarifs',
    testimonials: 'Témoignages',
    faq: 'FAQ',
    login: 'Connexion',
    signup: 'Essai gratuit',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    switchLanguage: 'Changer de langue',
    skipToContent: 'Aller au contenu principal',
  },
  banner: {
    label: 'Nouvelle fonctionnalité :',
    text: 'Cartographie des stations essence pour économiser sur votre carburant 🎉',
  },
  consent: {
    ariaLabel: 'Consentement aux cookies',
    title: "Cookies de mesure d'audience",
    text: "Nous utilisons Google Analytics pour comprendre comment le site est utilisé et améliorer MoveAltys. Rien n'est déposé sur votre appareil sans votre accord, et vous pouvez revenir sur ce choix à tout moment.",
    accept: 'Tout accepter',
    decline: 'Refuser',
    more: 'Politique de confidentialité',
  },
  hero: {
    eyebrow: 'Rentabilité des tournées transport',
    titleLine1: 'La marge de chaque tournée,',
    titleLine2: 'avant le départ.',
    lead: "MoveAltys calcule en quelques secondes le coût de revient réel de chaque tournée (carburant, péages, conducteur, véhicule, frais fixes), le confronte à votre prix de vente et optimise l'itinéraire. Vous décidez de partir, de regrouper, de re-tarifer ou de refuser.",
    note: "Une tournée optimisée n'est pas forcément une tournée rentable. MoveAltys vous montre les deux.",
    ctaPrimary: 'Optimiser ma 1ère tournée',
    ctaSecondary: 'Découvrir la plateforme',
    emailLabel: 'Adresse e-mail professionnelle',
    emailPlaceholder: 'vous@entreprise.fr',
    reassurance: 'Sans carte bancaire · Paramétrage accompagné',
  },
  stats: [
    { value: '-18 %', label: 'de kilomètres dès le premier mois' },
    { value: '< 10 s', label: 'pour chiffrer une tournée complète' },
    { value: '100 %', label: 'des coûts intégrés : carburant, RH, péages' },
    { value: '4,9/5', label: 'note moyenne des exploitants' },
  ],
  problem: {
    eyebrow: 'Le constat',
    title: 'Vous optimisez vos tournées. Mais savez-vous lesquelles vous rapportent ?',
    lead: "Carburant, péages, heures de conduite, temps d'attente, retours à vide : la plupart des exploitations découvrent la rentabilité d'une tournée en fin de mois, quand plus rien n'est négociable.",
    items: [
      {
        title: "Des tarifs fixés à l'expérience",
        body: "Le devis se construit au ressenti, à partir d'un prix au kilomètre hérité. Personne ne sait précisément ce que coûte réellement l'aller-retour que l'on vient d'accepter.",
      },
      {
        title: "Des coûts qui n'apparaissent nulle part",
        body: "Péages, temps d'attente, retour à vide, coût horaire du conducteur, amortissement du véhicule : ces postes pèsent lourd, mais aucun tableur ne les rassemble tournée par tournée.",
      },
      {
        title: "Des clients rentables… et d'autres non",
        body: "Sans marge calculée par tournée et par client, impossible de savoir qui tire votre résultat vers le haut, qui le fait descendre, et lequel il faudrait re-tarifer.",
      },
    ],
  },
  difference: {
    eyebrow: 'La différence',
    title: "Optimiser une tournée, ce n'est pas la rendre rentable",
    lead: "La plupart des logiciels de tournées s'arrêtent au kilomètre : ils réduisent la distance et vous laissent deviner la marge. MoveAltys va jusqu'au résultat financier, avant le départ.",
    columns: [
      {
        label: "Un optimiseur de tournées classique",
        items: [
          'Réduit les kilomètres et le temps de trajet',
          'Affiche une distance, pas un coût de revient',
          'Laisse le prix de vente en dehors du calcul',
          'Demande souvent un vrai projet d’intégration',
        ],
      },
      {
        label: 'MoveAltys',
        items: [
          "Optimise l'itinéraire, puis le chiffre",
          'Intègre carburant, péages, RH, véhicule et frais fixes',
          'Confronte le coût au prix de vente et sort la marge',
          'Se paramètre en quelques heures, sans DSI',
        ],
      },
    ],
    pillars: [
      { title: 'Coût réel', body: 'Carburant, péages, conducteur, véhicule et frais fixes de structure.' },
      { title: 'Marge réelle', body: 'Par trajet, par tournée, par client et par véhicule.' },
      { title: 'Décision avant départ', body: 'Modifier, regrouper, re-tarifer ou refuser, pendant que c’est encore possible.' },
      { title: 'Simple pour une PME', body: 'Pas un TMS lourd, pas un projet de six mois, pas d’équipe dédiée.' },
      { title: 'Pensé pour le transport français', body: 'Péages réels, contraintes locales, support francophone.' },
    ],
  },
  features: {
    eyebrow: 'La plateforme',
    title: 'Du kilomètre au résultat, dans le même écran',
    lead: 'Quatre briques complémentaires qui transforment une tournée en décision chiffrée.',
    items: [
      {
        tag: 'Coût de revient',
        title: 'Le coût réel de chaque transport',
        body: "Un moteur de calcul analyse chaque tournée en intégrant l'ensemble des variables économiques du transport : carburant, péages, conducteur, véhicule, frais fixes et variables.",
        bullets: [
          'Péages évalués sur l’itinéraire réellement emprunté',
          'Distances, durées et temps d’attente réels',
          'Paramétrage par véhicule et par conducteur',
        ],
      },
      {
        tag: 'Optimisation',
        title: 'Des tournées réordonnées automatiquement',
        body: "Le moteur réordonne enlèvements et livraisons pour réduire les kilomètres, le temps de trajet et les coûts, sans casser vos contraintes d'exploitation.",
        bullets: ['Ordre des arrêts recalculé', 'Contraintes horaires respectées', 'Comparaison avant / après'],
      },
      {
        tag: 'Marge',
        title: 'La marge, avant le départ',
        body: "Le coût de revient est confronté au prix de vente pour faire apparaître la marge réelle. Vous voyez immédiatement si la prestation est rentable, et de combien.",
        bullets: [
          'Marge par tournée, par client et par véhicule',
          'Alerte sur les prestations à perte',
          'Simulation d’un nouveau prix de vente',
        ],
      },
      {
        tag: 'Pilotage',
        title: 'Vos clients rentables, noir sur blanc',
        body: "Historique, comparaisons et indicateurs consolidés : vous mesurez les gains obtenus et identifiez les clients, les axes et les véhicules qui tirent vraiment votre rentabilité.",
        bullets: ['Historique par client et par axe', 'Indicateurs consolidés', 'Export comptable et CSV'],
      },
    ],
    learnMore: 'En savoir plus',
  },
  how: {
    eyebrow: 'Comment ça marche',
    title: 'Trois étapes, moins de cinq minutes',
    lead: 'Aucune installation, aucun projet informatique. Vous importez vos points, la plateforme optimise et chiffre.',
    steps: [
      {
        title: 'Importez vos points de passage',
        body: "Saisissez ou importez vos adresses d'enlèvement et de livraison. MoveAltys les normalise et les géolocalise automatiquement.",
      },
      {
        title: 'Laissez le moteur optimiser et chiffrer',
        body: "L'ordre des arrêts est recalculé ; distances, péages, carburant et heures de conduite sont évalués sur l'itinéraire réellement emprunté.",
      },
      {
        title: 'Décidez avant de partir',
        body: "Coût de revient, prix de vente et marge s'affichent côte à côte. Vous ajustez le plan, vous regroupez, vous re-tarifez. Ou vous refusez la course.",
      },
    ],
  },
  audience: {
    eyebrow: 'Pour qui',
    title: 'Conçu pour ceux qui roulent avec des marges serrées',
    cta: 'En savoir plus',
    lead: "Du livreur indépendant à l'exploitation de trente véhicules, la question est la même : est-ce que cette tournée me rapporte vraiment ?",
    items: [
      {
        profile: 'Transporteur régional · 3 à 30 véhicules',
        href: 'tpe',
        title: 'Calculez le vrai coût de chaque tournée et arrêtez de rouler à perte',
        body: "Messagerie, distribution régionale, transport léger : la planification se fait encore sous Excel et Google Maps, les devis partent « à l'expérience » et la marge par client reste une impression.",
      },
      {
        profile: 'Livraison locale & dernier kilomètre',
        href: 'livraison-locale',
        title: 'Planifiez en quelques minutes, voyez le coût et la marge immédiatement',
        body: "Mobilier, électroménager, produits frais, pièces détachées : 5 à 50 tournées par semaine, des changements de dernière minute, et un arbitrage permanent entre regrouper, décaler, re-tarifer ou refuser.",
      },
      {
        profile: 'Livreur indépendant · 1 à 3 véhicules',
        href: 'independants',
        title: "Avant d'accepter une course, vérifiez ce qu'elle vous rapporte",
        body: "Sous-traitance, messagerie, express local : carburant, péage et temps réel se sous-estiment vite. En deux minutes, vous savez si la course vaut le déplacement, ou s'il faut la renégocier.",
      },
      {
        profile: 'Flotte interne · distribution, collecte, maintenance',
        href: 'flotte-interne',
        title: 'Réduisez vos coûts terrain sans complexifier vos opérations',
        body: "Votre logistique est un centre de coût : 5 à 40 véhicules ou agents, des déplacements planifiés à la main, des coûts terrain peu visibles et un arbitrage constant entre service et dépense.",
      },
    ],
  },
  testimonials: {
    eyebrow: 'Ils nous font confiance',
    title: 'Testé et approuvé par les professionnels du transport',
    ratingLabel: 'Note moyenne',
    items: [
      {
        quote:
          "On a réduit nos kilomètres de 18 % dès le premier mois. Mais le vrai déclic, c'est la marge par client : deux comptes qu'on croyait rentables tournaient à perte une fois les péages et les temps d'attente comptés.",
        author: 'Marc L.',
        role: 'Gérant · 14 véhicules',
        company: 'Transports Delval',
      },
      {
        quote:
          "La planification prend quelques minutes et le coût s'affiche en même temps. Quand une livraison ne passe pas, on la regroupe ou on la re-tarife : avant le départ, plus après coup.",
        author: 'Claire B.',
        role: "Responsable d'exploitation",
        company: 'Groupe Frétois',
      },
      {
        quote:
          "Avant d'accepter une course, je la chiffre. Carburant, péage, temps réel : je sais en deux minutes si ça vaut le déplacement. J'ai fini par arrêter deux clients qui me coûtaient de l'argent.",
        author: 'Saïd M.',
        role: 'Livreur indépendant',
        company: 'À son compte',
      },
    ],
  },
  pricing: {
    eyebrow: 'Tarifs',
    title: 'Un tarif qui suit votre volume de tournées',
    lead: "Que vous rouliez avec un véhicule ou une flotte de trente, vous ne payez que ce que vous utilisez. **Essai gratuit de 14 jours** sur toutes les formules.",
    popular: 'Le plus choisi',
    cta: 'Démarrer mon essai gratuit',
    ctaEnterprise: 'Nous contacter',
    footnote: 'Tarifs hors taxes, facturés mensuellement. Sans engagement.',
    plans: [
      {
        name: 'Indépendant',
        price: '39,99 €',
        period: '/ 30 jours',
        description: 'Offre limitée à 39,99 €/mois garanti à vie. Accès privilégié aux futures évolutions.',
        features: [
          '1 utilisateur',
          '1 véhicule',
          '5 tournées / jour',
          '1 configuration RH',
          '1 charge additionnelle',
        ],
      },
      {
        name: 'Pro',
        price: '69 €',
        period: '/ mois',
        description: 'Pour 3 utilisateurs avec des trajets quotidiens.',
        features: [
          '3 utilisateurs',
          '5 véhicules',
          '20 tournées / jour',
          '5 configurations RH',
          '10 charges additionnelles',
        ],
      },
      {
        name: 'Entreprise',
        price: 'Sur mesure',
        period: '',
        description: 'Pour les volumes élevés et les groupes multi-sites avec besoins d’intégration.',
        features: ['Toutes les fonctionnalités du Pro', '25 utilisateurs', '30 véhicules'],
      },
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Les questions que l’on nous pose',
    items: [
      {
        q: 'Le logiciel est-il adapté à mon activité et à mon secteur ?',
        a: "Oui. Notre solution est conçue pour tous les professionnels du transport et de la logistique, quelle que soit la taille de votre flotte ou la nature de vos trajets (livraison, messagerie, collecte, distribution…). Les paramètres sont configurables pour s'adapter à vos contraintes.",
      },
      {
        q: 'Faut-il installer quelque chose sur mon ordinateur ou mon téléphone ?',
        a: "Non. MoveAltys est une application web : un navigateur suffit, sur ordinateur comme sur mobile. Aucun logiciel à installer, aucun boîtier à monter dans les véhicules.",
      },
      {
        q: 'Le calcul du coût de revient prend-il en compte les péages ?',
        a: "Oui. Le coût des péages est évalué sur l'itinéraire réellement calculé, et non estimé au forfait. Il entre directement dans le coût de revient de la tournée, au même titre que le carburant, le coût horaire du conducteur et les frais de véhicule.",
      },
      {
        q: "Puis-je tester gratuitement avant de m'abonner ?",
        a: "Oui. Vous démarrez sans carte bancaire, et un membre de l'équipe vous accompagne pour paramétrer vos coûts et vos véhicules, afin que les premiers calculs reflètent votre activité réelle.",
      },
      {
        q: 'Mes données sont-elles sécurisées ?',
        a: "Vos tournées, vos clients et vos coûts vous appartiennent et ne sont jamais revendus. Les échanges avec la plateforme sont chiffrés, l'accès est limité aux utilisateurs de votre compte, et vous pouvez exporter ou demander la suppression de vos données à tout moment.",
      },
    ],
  },
  finalCta: {
    title: 'Arrêtez de rouler à perte sans le savoir.',
    lead: "Chiffrez votre première tournée aujourd'hui : coût réel, marge réelle, et la décision qui va avec, avant que le véhicule ne parte.",
    cta: 'Démarrer mon essai gratuit',
    secondary: 'Parler à un expert transport',
  },
  localDelivery: {
    meta: {
      title: 'Logiciel de tournées pour la livraison locale · MoveAltys',
      description:
        'Mobilier, électroménager, frais, pièces détachées : planifiez vos tournées en quelques minutes et voyez le coût et la marge de chaque livraison avant le départ.',
    },
    hero: {
      eyebrow: 'Livraison locale & dernier kilomètre',
      titleLine1: 'Planifiez en quelques minutes.',
      titleLine2: 'Voyez la marge immédiatement.',
      lead: "Mobilier, électroménager, produits frais, pièces détachées : entre 5 et 50 tournées par semaine, des créneaux à tenir et des changements de dernière minute. MoveAltys réordonne les arrêts et chiffre la tournée dans la foulée, pour que vous sachiez ce que chaque livraison coûte et rapporte.",
      cta: 'Démarrer mon essai gratuit',
      reassurance: 'Sans carte bancaire · Opérationnel en une journée',
    },
    pains: {
      eyebrow: 'Le quotidien',
      title: 'Le planning du jour se refait trois fois avant midi',
      lead: "Une commande urgente, un créneau déplacé, un client absent : le plan de la veille ne survit pas à la matinée. Et personne ne recalcule ce que ça coûte.",
      items: [
        {
          title: 'La planification mange la matinée',
          body: "Ordonner les arrêts à la main, tenir les créneaux, équilibrer les véhicules : le planning quotidien prend des heures qui ne sont facturées à personne.",
        },
        {
          title: 'Le coût par livraison reste inconnu',
          body: "Vous connaissez le prix facturé au client. Ce que la livraison a réellement coûté en carburant, en péage et en temps de conduite, personne ne le calcule.",
        },
        {
          title: 'Les arbitrages se font à l’aveugle',
          body: "Regrouper, décaler d'un jour, re-tarifer ou refuser : ces décisions se prennent au ressenti, sans savoir laquelle protège vraiment la marge.",
        },
      ],
    },
    steps: {
      eyebrow: 'En pratique',
      title: 'Du fichier de commandes au plan chiffré',
      lead: 'Trois étapes, quelques minutes, aucun déploiement.',
      items: [
        {
          title: 'Importez les livraisons du jour',
          body: "Vos adresses d'enlèvement et de livraison sont normalisées et géolocalisées automatiquement.",
        },
        {
          title: 'Le moteur ordonne et chiffre',
          body: "Les arrêts sont réordonnés dans le respect de vos créneaux, et la tournée est évaluée sur l'itinéraire réellement emprunté.",
        },
        {
          title: 'Vous arbitrez avant le départ',
          body: "Coût, prix et marge s'affichent par tournée et par livraison. Vous regroupez, vous décalez, vous re-tarifez, ou vous refusez.",
        },
      ],
    },
    benefits: {
      eyebrow: 'Ce que vous gagnez',
      title: 'Un plan tenu, et une marge connue',
      items: [
        { title: 'Un planning en quelques minutes', body: 'Les arrêts sont réordonnés automatiquement, vos créneaux respectés.' },
        { title: 'Le coût de chaque livraison', body: 'Carburant, péages, temps de conduite et d’attente, véhicule.' },
        { title: 'La marge par client', body: 'Vous voyez quel donneur d’ordre tire le résultat vers le haut, et lequel le fait descendre.' },
        { title: 'Des replanifications maîtrisées', body: 'Un changement de dernière minute se rechiffre en quelques secondes.' },
      ],
    },
    quote: {
      text: "La planification prend quelques minutes et le coût s'affiche en même temps. Quand une livraison ne passe pas, on la regroupe ou on la re-tarife : avant le départ, plus après coup.",
      author: 'Claire B.',
      role: "Responsable d'exploitation, Groupe Frétois",
    },
    offer: {
      eyebrow: 'L’offre',
      title: 'L’offre Pro, calibrée pour la livraison locale',
      lead: 'Trois utilisateurs, cinq véhicules, vingt tournées par jour : de quoi couvrir une activité de livraison locale au quotidien.',
    },
    faq: {
      eyebrow: 'Questions fréquentes',
      title: 'Ce que les équipes de livraison nous demandent',
      items: [
        {
          q: 'Peut-on tenir des créneaux de livraison ?',
          a: "Oui. Les contraintes horaires entrent dans le calcul : le moteur réordonne les arrêts sans casser les créneaux que vous avez promis à vos clients.",
        },
        {
          q: 'Que se passe-t-il en cas de changement de dernière minute ?',
          a: "Vous modifiez la tournée et le calcul se refait immédiatement. Vous voyez tout de suite l'effet du changement sur le coût et sur la marge.",
        },
        {
          q: 'Faut-il installer quelque chose ?',
          a: "Non. Un navigateur suffit, sur ordinateur comme sur tablette. Aucun boîtier à monter dans les véhicules.",
        },
        {
          q: 'Nous dépassons vingt tournées par jour, que se passe-t-il ?',
          a: "L'offre Entreprise étend le périmètre à 25 utilisateurs et 30 véhicules. Nous calons le format avec vous avant que vous ne changiez de formule.",
        },
      ],
    },
    finalCta: {
      title: 'Le plan de demain, chiffré ce soir.',
      lead: 'Importez vos livraisons et voyez la marge avant de lancer les véhicules.',
      cta: 'Démarrer mon essai gratuit',
      secondary: 'Parler à un expert transport',
    },
    backToHome: 'Voir toutes les offres',
  },
  internalFleet: {
    meta: {
      title: 'Optimisation des tournées pour flotte interne · MoveAltys',
      description:
        'Distribution B2B, collecte, maintenance : vos véhicules sont un centre de coût. MoveAltys optimise les déplacements et chiffre ce que chaque tournée vous coûte réellement.',
    },
    hero: {
      eyebrow: 'Flottes internes : distribution, collecte, maintenance',
      titleLine1: 'Réduisez vos coûts terrain',
      titleLine2: 'sans complexifier vos opérations.',
      lead: "Votre métier n'est pas le transport, mais vos véhicules roulent tous les jours : livraisons B2B, collectes, interventions de maintenance. Ces déplacements pèsent sur vos charges sans que personne ne les chiffre. MoveAltys les optimise et les met en euros.",
      cta: 'Démarrer mon essai gratuit',
      reassurance: 'Sans carte bancaire · Opérationnel en une journée',
    },
    pains: {
      eyebrow: 'Le constat',
      title: 'La logistique est un centre de coût que personne ne mesure',
      lead: "Quand le transport n'est pas le cœur de métier, les kilomètres se font sans qu'on les compte. Ils apparaissent en fin d'année, en bloc, dans les frais généraux.",
      items: [
        {
          title: 'Les tournées se montent à la main',
          body: "Un tableur, une carte, l'habitude des équipes. L'ordre des passages dépend des tournées d'hier plus que d'un calcul.",
        },
        {
          title: 'Le coût d’un déplacement est invisible',
          body: "Le carburant se lit sur la facture globale, jamais par tournée. Le temps passé sur la route, lui, n'apparaît nulle part.",
        },
        {
          title: 'Changer le planning fait peur',
          body: "Toucher à l'organisation, c'est risquer de dégrader le service rendu. Alors on préfère ne rien changer, et payer les kilomètres.",
        },
      ],
    },
    steps: {
      eyebrow: 'La mise en route',
      title: 'Opérationnel en une journée',
      lead: 'Aucun logiciel à déployer, aucun équipement à monter dans les véhicules.',
      items: [
        {
          title: 'On paramètre vos coûts ensemble',
          body: "Consommation, prix du carburant, coût horaire des agents, amortissement des véhicules et frais fixes. Une session suffit.",
        },
        {
          title: 'Vous importez vos points de passage',
          body: "Clients, sites, points de collecte ou d'intervention : les adresses sont normalisées et géolocalisées automatiquement.",
        },
        {
          title: 'Vous comparez avant de changer',
          body: "L'itinéraire optimisé s'affiche à côté de l'actuel, avec l'écart en kilomètres et en euros. Vous décidez sur des chiffres.",
        },
      ],
    },
    benefits: {
      eyebrow: 'Ce que vous gagnez',
      title: 'Des kilomètres en moins, sans rien casser',
      items: [
        { title: 'Des déplacements optimisés', body: 'Les passages sont réordonnés en respectant vos contraintes horaires.' },
        { title: 'Un coût par tournée et par site', body: 'Vous savez enfin ce que coûte de desservir chaque point.' },
        { title: 'Une comparaison avant / après', body: 'L’écart avec votre organisation actuelle est chiffré, en kilomètres et en euros.' },
        { title: 'Un pilotage dans le temps', body: 'Historique et indicateurs consolidés pour mesurer ce que l’optimisation a rapporté.' },
      ],
    },
    quote: { text: '', author: '', role: '' },
    offer: {
      eyebrow: 'L’offre',
      title: 'L’offre Pro, pour démarrer sur un périmètre',
      lead: 'Trois utilisateurs, cinq véhicules, vingt tournées par jour : de quoi équiper une première équipe avant d’élargir.',
    },
    faq: {
      eyebrow: 'Questions fréquentes',
      title: 'Ce que les responsables de flotte nous demandent',
      items: [
        {
          q: 'Nous ne sommes pas transporteurs. Est-ce fait pour nous ?',
          a: "Oui. Le calcul est le même dès lors que des véhicules se déplacent : distribution B2B, collecte, maintenance ou interventions. Les paramètres de coût s'adaptent à votre activité.",
        },
        {
          q: 'Faut-il équiper les véhicules ?',
          a: "Non. MoveAltys est une application web : aucun boîtier, aucune installation, aucun matériel à embarquer.",
        },
        {
          q: 'Nos équipes vont-elles devoir changer leurs habitudes ?',
          a: "L'itinéraire optimisé est proposé à côté de l'existant, avec l'écart chiffré. Vous choisissez ce que vous appliquez, progressivement, plutôt que d'imposer un nouveau mode de fonctionnement.",
        },
        {
          q: 'Nous avons plus de cinq véhicules, que se passe-t-il ?',
          a: "L'offre Entreprise étend le périmètre à 25 utilisateurs et 30 véhicules. Nous calons le format avec vous.",
        },
      ],
    },
    finalCta: {
      title: 'Vos kilomètres ont un prix. Mesurez-le.',
      lead: 'Chiffrez une première tournée et voyez l’écart avec votre organisation actuelle.',
      cta: 'Démarrer mon essai gratuit',
      secondary: 'Parler à un expert transport',
    },
    backToHome: 'Voir toutes les offres',
  },
  tpe: {
    meta: {
      title: 'Logiciel de tournées et de marge pour TPE du transport · MoveAltys',
      description:
        'Deux à dix véhicules ? MoveAltys optimise vos tournées et calcule le coût de revient et la marge réelle de chacune. 69 €/mois, opérationnel en une journée.',
    },
    hero: {
      eyebrow: 'TPE du transport & de la livraison',
      titleLine1: 'Calculez le vrai coût de chaque tournée',
      titleLine2: 'avant le départ.',
      lead: "Dans une TPE, c'est le dirigeant qui monte les tournées, répond aux devis et découvre la marge au bilan. MoveAltys chiffre chaque tournée avant le départ : carburant, péages, heures de conduite, véhicule. Vous arbitrez le matin même, pas douze mois plus tard.",
      cta: 'Démarrer mon essai gratuit',
      reassurance: 'Sans carte bancaire · Opérationnel en une journée',
    },
    pains: {
      eyebrow: 'Le quotidien d’une TPE',
      title: 'Cinq véhicules, quinze clients, et aucune visibilité sur la marge',
      lead: "Dans une petite structure, personne ne planifie à plein temps. La rentabilité se lit une fois par an, sur le compte de résultat.",
      items: [
        {
          title: 'La tournée se monte entre deux appels',
          body: "Le planning du lendemain se prépare le soir, sur Excel et Google Maps, entre un chargement à relancer et un conducteur à rappeler.",
        },
        {
          title: 'Les devis partent sans coût de référence',
          body: "Il faut répondre vite pour ne pas perdre l'affaire. Le prix se cale sur le concurrent ou sur l'an dernier, pas sur ce que la tournée coûte réellement.",
        },
        {
          title: 'La marge se découvre au bilan',
          body: "Le résultat annuel dit si l'année s'est bien passée. Il ne dit jamais quel client, quel axe ou quel véhicule en est responsable.",
        },
      ],
    },
    steps: {
      eyebrow: 'La mise en route',
      title: 'Opérationnel en une journée',
      lead: 'Pas de TMS à déployer, pas de projet à six mois, pas d’informaticien à mobiliser.',
      items: [
        {
          title: 'On paramètre vos coûts ensemble',
          body: "Consommation, prix du carburant, coût horaire des conducteurs, amortissement et frais fixes de structure. Une session suffit, et elle est faite avec vous.",
        },
        {
          title: 'Vous importez vos tournées',
          body: "Vos points d'enlèvement et de livraison sont normalisés et géolocalisés automatiquement. Aucun boîtier, aucune installation.",
        },
        {
          title: 'Vous arbitrez avant le départ',
          body: "Coût de revient, prix de vente et marge s'affichent côte à côte. Vous regroupez, vous re-tarifez, ou vous refusez.",
        },
      ],
    },
    benefits: {
      eyebrow: 'Ce que vous gagnez',
      title: 'Le pilotage d’un grand compte, à l’échelle d’une TPE',
      items: [
        { title: 'La marge par client', body: 'Vous identifiez les comptes à renégocier et ceux qu’il faut développer.' },
        { title: 'Un planning en quelques minutes', body: 'Les arrêts sont réordonnés automatiquement, vos contraintes horaires respectées.' },
        { title: 'Des devis défendables', body: 'Vous annoncez un prix appuyé sur un coût de revient calculé, pas sur une estimation.' },
        { title: 'L’effet d’une hausse de carburant', body: 'Changez le prix du litre et voyez immédiatement quelles tournées basculent.' },
      ],
    },
    quote: {
      text: "On a réduit nos kilomètres de 18 % dès le premier mois. Mais le vrai déclic, c'est la marge par client : deux comptes qu'on croyait rentables tournaient à perte une fois les péages et les temps d'attente comptés.",
      author: 'Marc L.',
      role: 'Gérant, Transports Delval',
    },
    offer: {
      eyebrow: 'L’offre',
      title: 'L’offre Pro, calibrée pour une TPE',
      lead: 'Trois utilisateurs, cinq véhicules, vingt tournées par jour : le format d’une petite structure de transport.',
    },
    faq: {
      eyebrow: 'Questions fréquentes',
      title: 'Ce que les dirigeants de TPE nous demandent',
      items: [
        {
          q: 'Nous sommes une petite équipe, sans informaticien. C’est jouable ?',
          a: "Oui, c'est précisément le cas d'usage. Le seul travail de mise en route est le paramétrage de vos coûts, fait avec vous en une session. Ensuite, un navigateur suffit.",
        },
        {
          q: 'Est-ce que cela remplace notre TMS ?',
          a: "Non. MoveAltys se concentre sur la décision avant départ : itinéraire, coût de revient, marge. Il s'utilise à côté de vos outils existants, sans projet d'intégration.",
        },
        {
          q: 'Nous avons plus de cinq véhicules, que se passe-t-il ?',
          a: "L'offre Entreprise étend le périmètre à 25 utilisateurs et 30 véhicules. Nous calons le format avec vous avant que vous ne changiez de formule.",
        },
        {
          q: 'Combien de temps avant de voir un résultat ?',
          a: "Dès la première tournée chiffrée. Les gains kilométriques apparaissent immédiatement ; la marge par client se dessine après quelques semaines d'historique.",
        },
      ],
    },
    finalCta: {
      title: 'Arrêtez de découvrir vos marges au bilan.',
      lead: 'Chiffrez votre première tournée aujourd’hui.',
      cta: 'Démarrer mon essai gratuit',
      secondary: 'Parler à un expert transport',
    },
    backToHome: 'Voir toutes les offres',
  },
  independents: {
    meta: {
      title: 'Logiciel de rentabilité pour livreur indépendant · MoveAltys',
      description:
        "Vous roulez seul ou avec deux véhicules ? MoveAltys chiffre chaque course avant que vous ne l'acceptiez : carburant, péages, temps réel, marge. 39,99 €/mois garanti à vie.",
    },
    hero: {
      eyebrow: 'Livreurs indépendants & micro-transporteurs',
      titleLine1: "Avant d'accepter une course,",
      titleLine2: 'vérifiez ce qu’elle rapporte.',
      lead: "Vous connaissez votre prix au kilomètre. Mais entre le carburant, le péage, le retour à vide et l'attente au chargement, une course qui paraît correcte peut vous coûter de l'argent. MoveAltys la chiffre en deux minutes, avant que vous ne répondiez au client.",
      cta: 'Démarrer mon essai gratuit',
      reassurance: 'Sans carte bancaire · 39,99 €/mois garanti à vie',
    },
    pains: {
      eyebrow: 'Le quotidien',
      title: 'Trois choses que votre prix au kilomètre ne dit pas',
      lead: "Quand on roule seul, la rentabilité se joue course par course. Et elle se découvre trop souvent en fin de mois.",
      items: [
        {
          title: 'Le devis se fait de tête',
          body: "Un prix au kilomètre hérité, une estimation rapide, et l'espoir que ça passe. Le coût réel du trajet, personne ne l'a posé sur le papier.",
        },
        {
          title: 'Les postes qui grignotent la marge',
          body: "Péage, retour à vide, attente au chargement, usure du véhicule : ces postes n'apparaissent pas sur la facture du client, mais ils sortent de votre poche.",
        },
        {
          title: 'Des clients qui vous coûtent de l’argent',
          body: "Sans historique par client, impossible de repérer celui qu'il faudrait renégocier, et celui qu'il vaudrait mieux arrêter.",
        },
      ],
    },
    steps: {
      eyebrow: 'En pratique',
      title: 'Opérationnel dans la journée',
      lead: "Pas de projet informatique, pas de boîtier à installer. Un navigateur et vos chiffres suffisent.",
      items: [
        {
          title: 'Entrez le départ et l’arrivée',
          body: "Deux adresses suffisent. Ajoutez les étapes intermédiaires si la course en compte plusieurs.",
        },
        {
          title: 'Renseignez vos coûts une seule fois',
          body: "Consommation, prix du carburant, coût de votre heure, amortissement du véhicule. C'est le seul paramétrage, et un membre de l'équipe le fait avec vous.",
        },
        {
          title: 'Lisez la marge, puis décidez',
          body: "Coût de revient et marge s'affichent face au prix proposé. Vous acceptez, vous renégociez, ou vous passez votre tour.",
        },
      ],
    },
    benefits: {
      eyebrow: 'Ce que vous obtenez',
      title: 'Un chiffre, pas une impression',
      items: [
        { title: 'Le coût réel de la course', body: 'Carburant, péages, votre heure de conduite, le véhicule. Tout est compté.' },
        { title: 'La marge avant de répondre', body: "Vous savez si la course vaut le déplacement avant de dire oui." },
        { title: 'Un historique par client', body: 'Vous voyez qui vous fait gagner de l’argent, et qui vous en coûte.' },
        { title: 'Un chiffrage présentable', body: 'Exportez le calcul en PDF pour appuyer votre tarif face au donneur d’ordre.' },
      ],
    },
    quote: {
      text: "Avant d'accepter une course, je la chiffre. Carburant, péage, temps réel : je sais en deux minutes si ça vaut le déplacement. J'ai fini par arrêter deux clients qui me coûtaient de l'argent.",
      author: 'Saïd M.',
      role: 'Livreur indépendant',
    },
    offer: {
      eyebrow: 'L’offre',
      title: 'Une seule formule, sans surprise',
      lead: "Le tarif de lancement est garanti à vie : il n'augmentera pas tant que vous restez abonné.",
    },
    faq: {
      eyebrow: 'Questions fréquentes',
      title: 'Ce que les indépendants nous demandent',
      items: [
        {
          q: 'Je n’ai qu’un véhicule, est-ce que ça vaut le coup ?',
          a: "C'est exactement le cas d'usage de l'offre Indépendant. Une seule course mal tarifée par semaine représente, sur l'année, bien plus que le prix de l'abonnement.",
        },
        {
          q: 'Combien de temps avant mon premier chiffrage ?',
          a: "Le paramétrage de vos coûts se fait dans la journée, avec un membre de l'équipe. Ensuite, chaque course se chiffre en deux minutes.",
        },
        {
          q: 'Le tarif peut-il augmenter ?',
          a: "Non. L'offre de lancement à 39,99 €/mois est garantie à vie, et vous accédez en priorité aux évolutions à venir.",
        },
        {
          q: 'Faut-il installer quelque chose ?',
          a: "Non. Un navigateur suffit, sur ordinateur comme sur téléphone. Aucun boîtier à monter dans le véhicule.",
        },
      ],
    },
    finalCta: {
      title: 'La prochaine course, vous saurez.',
      lead: 'Chiffrez-la avant de répondre au client.',
      cta: 'Démarrer mon essai gratuit',
      secondary: 'Poser une question',
    },
    backToHome: 'Voir toutes les offres',
  },
  footer: {
    tagline: 'Le coût réel et la marge réelle de chaque tournée, avant le départ.',
    productTitle: 'Produit',
    companyTitle: 'Entreprise',
    legalTitle: 'Légal',
    about: 'À propos',
    blog: 'Blog',
    contact: 'Contact',
    legalNotice: 'Mentions légales',
    privacy: 'Politique de confidentialité',
    terms: "Conditions générales d'utilisation",
    rights: 'Tous droits réservés.',
    manageCookies: 'Gérer les cookies',
  },
}

/** English copy — kept structurally identical to the French source of truth. */
const en: typeof fr = {
  meta: {
    title: 'Route cost, margin and optimisation software · MoveAltys',
    description:
      'MoveAltys calculates the true cost price and margin of every route (fuel, tolls, driver) and optimises the itinerary. You know whether a route is profitable before the vehicle leaves.',
    ogAlt: 'Preview of the MoveAltys application',
  },
  nav: {
    features: 'Features',
    how: 'How it works',
    audience: 'Who it is for',
    independents: 'For independent couriers',
    tpe: 'For small businesses',
    localDelivery: 'For local delivery',
    internalFleet: 'For in-house fleets',
    pricing: 'Pricing',
    testimonials: 'Testimonials',
    faq: 'FAQ',
    login: 'Log in',
    signup: 'Free trial',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    switchLanguage: 'Change language',
    skipToContent: 'Skip to main content',
  },
  banner: {
    label: 'New feature:',
    text: 'Petrol station mapping to cut what you spend on fuel 🎉',
  },
  consent: {
    ariaLabel: 'Cookie consent',
    title: 'Analytics cookies',
    text: 'We use Google Analytics to understand how the site is used and improve MoveAltys. Nothing is stored on your device without your agreement, and you can change this choice at any time.',
    accept: 'Accept all',
    decline: 'Decline',
    more: 'Privacy policy',
  },
  hero: {
    eyebrow: 'Route profitability for transport operators',
    titleLine1: 'The margin of every route,',
    titleLine2: 'before departure.',
    lead: 'MoveAltys calculates the true cost price of every route in seconds (fuel, tolls, driver, vehicle, fixed overheads), compares it against your selling price and optimises the itinerary. You decide whether to go, consolidate, re-price or decline.',
    note: 'An optimised route is not necessarily a profitable one. MoveAltys shows you both.',
    ctaPrimary: 'Optimise my 1st route',
    ctaSecondary: 'Explore the platform',
    emailLabel: 'Work email address',
    emailPlaceholder: 'you@company.com',
    reassurance: 'No credit card · Guided cost setup',
  },
  stats: [
    { value: '-18%', label: 'kilometres saved in the first month' },
    { value: '< 10s', label: 'to price a complete route' },
    { value: '100%', label: 'of costs included: fuel, wages, tolls' },
    { value: '4.9/5', label: 'average rating from operators' },
  ],
  problem: {
    eyebrow: 'The problem',
    title: 'You optimise your routes. But do you know which ones actually pay?',
    lead: 'Fuel, tolls, driving hours, waiting time, empty return legs: most operations only discover whether a route was profitable at month end, when nothing can be renegotiated any more.',
    items: [
      {
        title: 'Rates set from experience',
        body: 'Quotes are built on gut feel, from an inherited price per kilometre. Nobody knows precisely what the round trip you just accepted really costs.',
      },
      {
        title: 'Costs that show up nowhere',
        body: 'Tolls, waiting time, empty return legs, driver hourly cost, vehicle depreciation: these items weigh heavily, yet no spreadsheet brings them together route by route.',
      },
      {
        title: 'Profitable customers… and others',
        body: 'Without a margin calculated per route and per customer, there is no way to know who lifts your bottom line, who drags it down, and which contract should be re-priced.',
      },
    ],
  },
  difference: {
    eyebrow: 'The difference',
    title: 'Optimising a route is not the same as making it profitable',
    lead: 'Most routing software stops at the kilometre: it shortens the distance and leaves you guessing the margin. MoveAltys goes all the way to the financial result, before departure.',
    columns: [
      {
        label: 'A classic route optimiser',
        items: [
          'Cuts kilometres and driving time',
          'Shows a distance, not a cost price',
          'Leaves your selling price out of the calculation',
          'Usually requires a genuine integration project',
        ],
      },
      {
        label: 'MoveAltys',
        items: [
          'Optimises the itinerary, then prices it',
          'Includes fuel, tolls, wages, vehicle and fixed overheads',
          'Compares cost against selling price and reveals the margin',
          'Is configured in a few hours, with no IT department',
        ],
      },
    ],
    pillars: [
      { title: 'True cost', body: 'Fuel, tolls, driver, vehicle and fixed structural overheads.' },
      { title: 'True margin', body: 'Per trip, per route, per customer and per vehicle.' },
      { title: 'Decide before departure', body: 'Adjust, consolidate, re-price or decline, while you still can.' },
      { title: 'Simple enough for an SME', body: 'Not a heavy TMS, not a six-month project, no dedicated team.' },
      { title: 'Built for European road transport', body: 'Real tolls, local constraints, French-speaking support.' },
    ],
  },
  features: {
    eyebrow: 'The platform',
    title: 'From the kilometre to the bottom line, on one screen',
    lead: 'Four complementary building blocks that turn a route into a decision backed by numbers.',
    items: [
      {
        tag: 'Cost price',
        title: 'The true cost of every trip',
        body: 'A calculation engine analyses each route across every economic variable of transport: fuel, tolls, driver, vehicle, fixed and variable overheads.',
        bullets: [
          'Tolls evaluated on the route actually driven',
          'Real distances, durations and waiting time',
          'Configurable per vehicle and per driver',
        ],
      },
      {
        tag: 'Optimisation',
        title: 'Routes reordered automatically',
        body: 'The engine reorders pickups and deliveries to cut kilometres, driving time and cost, without breaking your operational constraints.',
        bullets: ['Stop order recalculated', 'Time windows respected', 'Before / after comparison'],
      },
      {
        tag: 'Margin',
        title: 'The margin, before departure',
        body: 'The cost price is compared against your selling price to reveal the real margin. You immediately see whether the job is profitable, and by how much.',
        bullets: [
          'Margin per route, per customer and per vehicle',
          'Alerts on loss-making jobs',
          'Simulate a new selling price',
        ],
      },
      {
        tag: 'Steering',
        title: 'Your profitable customers, in black and white',
        body: 'History, comparisons and consolidated indicators: measure the gains you have made and identify the customers, lanes and vehicles that really drive profitability.',
        bullets: ['History per customer and per lane', 'Consolidated indicators', 'Accounting and CSV export'],
      },
    ],
    learnMore: 'Learn more',
  },
  how: {
    eyebrow: 'How it works',
    title: 'Three steps, under five minutes',
    lead: 'No installation, no IT project. You import your stops, the platform optimises and prices the route.',
    steps: [
      {
        title: 'Import your stops',
        body: 'Enter or import your pickup and delivery addresses. MoveAltys normalises and geolocates them automatically.',
      },
      {
        title: 'Let the engine optimise and price',
        body: 'Stop order is recalculated; distances, tolls, fuel and driving hours are evaluated on the route actually driven.',
      },
      {
        title: 'Decide before you leave',
        body: 'Cost price, selling price and margin appear side by side. You adjust the plan, consolidate, re-price. Or you decline the job.',
      },
    ],
  },
  audience: {
    eyebrow: 'Who it is for',
    title: 'Built for operators running on thin margins',
    cta: 'Learn more',
    lead: 'From the independent courier to a thirty-vehicle operation, the question is the same: does this route actually pay?',
    items: [
      {
        profile: 'Regional carrier · 3 to 30 vehicles',
        href: 'tpe',
        title: 'Calculate the true cost of every route and stop driving at a loss',
        body: 'Parcel work, regional distribution, light haulage: planning still happens in Excel and Google Maps, quotes go out “from experience”, and margin per customer remains an impression.',
      },
      {
        profile: 'Local delivery & last mile',
        href: 'livraison-locale',
        title: 'Plan in minutes and see cost and margin straight away',
        body: 'Furniture, appliances, fresh produce, spare parts: 5 to 50 routes a week, last-minute changes, and a constant trade-off between consolidating, postponing, re-pricing or declining.',
      },
      {
        profile: 'Independent courier · 1 to 3 vehicles',
        href: 'independants',
        title: 'Before accepting a job, check what it actually earns you',
        body: 'Subcontracting, parcels, local express: fuel, tolls and real time on the road are easy to underestimate. In two minutes you know whether the job is worth the trip, or needs renegotiating.',
      },
      {
        profile: 'In-house fleet · distribution, collection, maintenance',
        href: 'flotte-interne',
        title: 'Cut your field costs without complicating your operations',
        body: 'Logistics is a cost centre for you: 5 to 40 vehicles or field agents, journeys planned by hand, field costs with little visibility and a constant trade-off between service and spend.',
      },
    ],
  },
  testimonials: {
    eyebrow: 'Trusted by operators',
    title: 'Tested and approved by transport professionals',
    ratingLabel: 'Average rating',
    items: [
      {
        quote:
          'We cut our kilometres by 18% in the first month. But the real eye-opener was margin per customer: two accounts we believed were profitable were running at a loss once tolls and waiting time were counted.',
        author: 'Marc L.',
        role: 'Managing director · 14 vehicles',
        company: 'Transports Delval',
      },
      {
        quote:
          'Planning takes a few minutes and the cost appears at the same time. When a delivery does not add up, we consolidate it or re-price it: before departure, not after the fact.',
        author: 'Claire B.',
        role: 'Operations manager',
        company: 'Groupe Frétois',
      },
      {
        quote:
          'Before accepting a job, I price it. Fuel, tolls, real time on the road: in two minutes I know whether it is worth the trip. I ended up dropping two customers who were costing me money.',
        author: 'Saïd M.',
        role: 'Independent courier',
        company: 'Self-employed',
      },
    ],
  },
  pricing: {
    eyebrow: 'Pricing',
    title: 'Pricing that follows your route volume',
    lead: 'Whether you run one vehicle or a fleet of thirty, you only pay for what you use. **14-day free trial** on every plan.',
    popular: 'Most chosen',
    cta: 'Start my free trial',
    ctaEnterprise: 'Contact us',
    footnote: 'Prices excluding tax, billed monthly. No commitment.',
    plans: [
      {
        name: 'Independent',
        price: '€39.99',
        period: '/ 30 days',
        description: 'Limited offer at €39.99/month, locked in for life. Priority access to what comes next.',
        features: ['1 user', '1 vehicle', '5 routes / day', '1 HR cost setup', '1 additional cost item'],
      },
      {
        name: 'Pro',
        price: '€69',
        period: '/ month',
        description: 'For 3 users running daily routes.',
        features: ['3 users', '5 vehicles', '20 routes / day', '5 HR cost setups', '10 additional cost items'],
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'For high volumes and multi-site groups with integration requirements.',
        features: ['Everything in Pro', '25 users', '30 vehicles'],
      },
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Questions we get asked',
    items: [
      {
        q: 'Is the software a fit for my business and my sector?',
        a: 'Yes. Our solution is built for every transport and logistics professional, whatever the size of your fleet or the nature of your trips (delivery, parcels, collection, distribution…). The parameters are configurable to match your own constraints.',
      },
      {
        q: 'Do I need to install anything on my computer or my phone?',
        a: 'No. MoveAltys is a web application: a browser is all you need, on desktop as well as mobile. Nothing to install, no hardware to fit in your vehicles.',
      },
      {
        q: 'Does the cost price calculation take tolls into account?',
        a: 'Yes. Toll costs are evaluated on the route actually calculated rather than estimated as a flat fee. They feed straight into the cost price of the route, alongside fuel, the driver hourly cost and vehicle overheads.',
      },
      {
        q: 'Can I try it for free before subscribing?',
        a: 'Yes. You start without a credit card, and a member of the team helps you configure your costs and vehicles so the first calculations reflect your real operation.',
      },
      {
        q: 'Is my data secure?',
        a: 'Your routes, your customers and your costs belong to you and are never resold. Traffic to the platform is encrypted, access is limited to the users on your account, and you can export or request deletion of your data at any time.',
      },
    ],
  },
  finalCta: {
    title: 'Stop driving at a loss without knowing it.',
    lead: 'Price your first route today: true cost, true margin, and the decision that follows, before the vehicle leaves.',
    cta: 'Start my free trial',
    secondary: 'Talk to a transport expert',
  },
  localDelivery: {
    meta: {
      title: 'Route planning software for local delivery · MoveAltys',
      description:
        'Furniture, appliances, fresh produce, spare parts: plan your routes in minutes and see the cost and margin of every delivery before departure.',
    },
    hero: {
      eyebrow: 'Local delivery & last mile',
      titleLine1: 'Plan in a few minutes.',
      titleLine2: 'See the margin straight away.',
      lead: 'Furniture, appliances, fresh produce, spare parts: between 5 and 50 routes a week, time windows to hold and last-minute changes. MoveAltys reorders the stops and prices the route in the same pass, so you know what each delivery costs and earns.',
      cta: 'Start my free trial',
      reassurance: 'No credit card · Up and running in a day',
    },
    pains: {
      eyebrow: 'Day to day',
      title: 'The day’s plan is rebuilt three times before noon',
      lead: 'An urgent order, a moved slot, a customer who is out: yesterday’s plan does not survive the morning. And nobody recalculates what it costs.',
      items: [
        {
          title: 'Planning eats the morning',
          body: 'Ordering stops by hand, holding the time windows, balancing the vehicles: the daily plan takes hours that are billed to nobody.',
        },
        {
          title: 'The cost per delivery stays unknown',
          body: 'You know the price billed to the customer. What the delivery actually cost in fuel, tolls and driving time, nobody works out.',
        },
        {
          title: 'Trade-offs are made blind',
          body: 'Consolidate, push to tomorrow, re-price or decline: those calls are made on instinct, without knowing which one actually protects the margin.',
        },
      ],
    },
    steps: {
      eyebrow: 'In practice',
      title: 'From the order file to a priced plan',
      lead: 'Three steps, a few minutes, nothing to roll out.',
      items: [
        {
          title: 'Import the day’s deliveries',
          body: 'Your pickup and delivery addresses are normalised and geolocated automatically.',
        },
        {
          title: 'The engine orders and prices',
          body: 'Stops are reordered within your time windows, and the route is evaluated on the itinerary actually driven.',
        },
        {
          title: 'You decide before departure',
          body: 'Cost, price and margin appear per route and per delivery. You consolidate, postpone, re-price, or decline.',
        },
      ],
    },
    benefits: {
      eyebrow: 'What you gain',
      title: 'A plan that holds, and a margin you know',
      items: [
        { title: 'A plan in minutes', body: 'Stops are reordered automatically, your time windows respected.' },
        { title: 'The cost of every delivery', body: 'Fuel, tolls, driving and waiting time, vehicle.' },
        { title: 'Margin per customer', body: 'You see which client lifts the bottom line, and which one drags it down.' },
        { title: 'Replanning under control', body: 'A last-minute change is re-priced in seconds.' },
      ],
    },
    quote: {
      text: 'Planning takes a few minutes and the cost appears at the same time. When a delivery does not add up, we consolidate it or re-price it: before departure, not after the fact.',
      author: 'Claire B.',
      role: 'Operations manager, Groupe Frétois',
    },
    offer: {
      eyebrow: 'The plan',
      title: 'The Pro plan, sized for local delivery',
      lead: 'Three users, five vehicles, twenty routes a day: enough to cover a local delivery operation day to day.',
    },
    faq: {
      eyebrow: 'Frequently asked',
      title: 'What delivery teams ask us',
      items: [
        {
          q: 'Can we hold delivery time windows?',
          a: 'Yes. Time constraints feed into the calculation: the engine reorders stops without breaking the slots you promised your customers.',
        },
        {
          q: 'What happens with a last-minute change?',
          a: 'You edit the route and the calculation runs again immediately. You see the effect of the change on cost and margin straight away.',
        },
        {
          q: 'Do we need to install anything?',
          a: 'No. A browser is all you need, on desktop or tablet. No hardware to fit in the vehicles.',
        },
        {
          q: 'We run more than twenty routes a day, what happens?',
          a: 'The Enterprise plan extends the scope to 25 users and 30 vehicles. We size the right fit with you before you change plan.',
        },
      ],
    },
    finalCta: {
      title: 'Tomorrow’s plan, priced tonight.',
      lead: 'Import your deliveries and see the margin before the vehicles roll.',
      cta: 'Start my free trial',
      secondary: 'Talk to a transport expert',
    },
    backToHome: 'See all plans',
  },
  internalFleet: {
    meta: {
      title: 'Route optimisation for in-house fleets · MoveAltys',
      description:
        'B2B distribution, collection, maintenance: your vehicles are a cost centre. MoveAltys optimises the journeys and prices what each round actually costs you.',
    },
    hero: {
      eyebrow: 'In-house fleets: distribution, collection, maintenance',
      titleLine1: 'Cut your field costs',
      titleLine2: 'without complicating operations.',
      lead: 'Transport is not your business, but your vehicles are out every day: B2B deliveries, collections, maintenance visits. Those journeys weigh on your overheads without anyone pricing them. MoveAltys optimises them and puts them in euros.',
      cta: 'Start my free trial',
      reassurance: 'No credit card · Up and running in a day',
    },
    pains: {
      eyebrow: 'The problem',
      title: 'Logistics is a cost centre nobody measures',
      lead: 'When transport is not the core business, the kilometres get driven without being counted. They show up at year end, in one block, under general expenses.',
      items: [
        {
          title: 'Rounds are built by hand',
          body: 'A spreadsheet, a map, and team habit. The order of visits owes more to yesterday’s round than to any calculation.',
        },
        {
          title: 'The cost of a journey is invisible',
          body: 'Fuel shows up on the overall invoice, never per round. Time spent on the road appears nowhere at all.',
        },
        {
          title: 'Changing the plan feels risky',
          body: 'Touching the organisation means risking the service you deliver. So nothing changes, and the kilometres get paid for.',
        },
      ],
    },
    steps: {
      eyebrow: 'Getting started',
      title: 'Up and running in a day',
      lead: 'No software to roll out, no equipment to fit in the vehicles.',
      items: [
        {
          title: 'We configure your costs together',
          body: 'Consumption, fuel price, field agent hourly cost, vehicle depreciation and fixed overheads. One session is enough.',
        },
        {
          title: 'You import your stops',
          body: 'Customers, sites, collection or service points: addresses are normalised and geolocated automatically.',
        },
        {
          title: 'You compare before you change',
          body: 'The optimised itinerary appears next to the current one, with the gap in kilometres and in euros. You decide on figures.',
        },
      ],
    },
    benefits: {
      eyebrow: 'What you gain',
      title: 'Fewer kilometres, nothing broken',
      items: [
        { title: 'Optimised journeys', body: 'Visits are reordered while respecting your time constraints.' },
        { title: 'A cost per round and per site', body: 'You finally know what serving each point costs you.' },
        { title: 'A before / after comparison', body: 'The gap with your current organisation is priced, in kilometres and in euros.' },
        { title: 'Steering over time', body: 'History and consolidated indicators to measure what the optimisation actually returned.' },
      ],
    },
    quote: { text: '', author: '', role: '' },
    offer: {
      eyebrow: 'The plan',
      title: 'The Pro plan, to start on one perimeter',
      lead: 'Three users, five vehicles, twenty routes a day: enough to equip a first team before widening the scope.',
    },
    faq: {
      eyebrow: 'Frequently asked',
      title: 'What fleet managers ask us',
      items: [
        {
          q: 'We are not a transport company. Is this for us?',
          a: 'Yes. The calculation is the same as soon as vehicles are on the road: B2B distribution, collection, maintenance or service visits. The cost parameters adapt to your activity.',
        },
        {
          q: 'Do we need to fit anything in the vehicles?',
          a: 'No. MoveAltys is a web application: no hardware, no installation, nothing to carry on board.',
        },
        {
          q: 'Will our teams have to change their habits?',
          a: 'The optimised itinerary is offered next to the existing one, with the gap priced. You choose what you apply, gradually, rather than imposing a new way of working.',
        },
        {
          q: 'We have more than five vehicles, what happens?',
          a: 'The Enterprise plan extends the scope to 25 users and 30 vehicles. We size the right fit with you.',
        },
      ],
    },
    finalCta: {
      title: 'Your kilometres have a price. Measure it.',
      lead: 'Price a first round and see the gap with your current organisation.',
      cta: 'Start my free trial',
      secondary: 'Talk to a transport expert',
    },
    backToHome: 'See all plans',
  },
  tpe: {
    meta: {
      title: 'Route and margin software for small transport businesses · MoveAltys',
      description:
        'Two to ten vehicles? MoveAltys optimises your routes and calculates the cost price and real margin of each one. €69/month, up and running in a day.',
    },
    hero: {
      eyebrow: 'Small transport & delivery businesses',
      titleLine1: 'Calculate the true cost of every route',
      titleLine2: 'before departure.',
      lead: 'In a small business, the owner builds the routes, answers the quotes and discovers the margin in the year-end accounts. MoveAltys prices every route before departure: fuel, tolls, driving hours, vehicle. You make the call that same morning, not twelve months later.',
      cta: 'Start my free trial',
      reassurance: 'No credit card · Up and running in a day',
    },
    pains: {
      eyebrow: 'Day to day',
      title: 'Five vehicles, fifteen customers, and no view on the margin',
      lead: 'In a small business, nobody plans full time. Profitability is read once a year, off the income statement.',
      items: [
        {
          title: 'Routes are built between two phone calls',
          body: 'Tomorrow’s plan is put together in the evening, in Excel and Google Maps, between a load to chase and a driver to call back.',
        },
        {
          title: 'Quotes go out with no reference cost',
          body: 'You have to answer fast not to lose the job. The price is set against a competitor or against last year, not against what the route actually costs.',
        },
        {
          title: 'The margin shows up in the accounts',
          body: 'The annual result tells you whether the year went well. It never tells you which customer, which lane or which vehicle is responsible.',
        },
      ],
    },
    steps: {
      eyebrow: 'Getting started',
      title: 'Up and running in a day',
      lead: 'No TMS to roll out, no six-month project, no IT resource to pull in.',
      items: [
        {
          title: 'We configure your costs together',
          body: 'Consumption, fuel price, driver hourly cost, depreciation and fixed overheads. One session is enough, and it is done with you.',
        },
        {
          title: 'You import your routes',
          body: 'Your pickup and delivery points are normalised and geolocated automatically. No hardware, no installation.',
        },
        {
          title: 'You decide before departure',
          body: 'Cost price, selling price and margin appear side by side. You consolidate, you re-price, or you decline.',
        },
      ],
    },
    benefits: {
      eyebrow: 'What you gain',
      title: 'Large-account steering, at the scale of a small business',
      items: [
        { title: 'Margin per customer', body: 'You identify the accounts to renegotiate and the ones worth growing.' },
        { title: 'A plan in minutes', body: 'Stops are reordered automatically, your time windows respected.' },
        { title: 'Quotes you can defend', body: 'You quote a price backed by a calculated cost price, not by an estimate.' },
        { title: 'The impact of a fuel rise', body: 'Change the price per litre and see immediately which routes tip over.' },
      ],
    },
    quote: {
      text: 'We cut our kilometres by 18% in the first month. But the real eye-opener was margin per customer: two accounts we believed were profitable were running at a loss once tolls and waiting time were counted.',
      author: 'Marc L.',
      role: 'Managing director, Transports Delval',
    },
    offer: {
      eyebrow: 'The plan',
      title: 'The Pro plan, sized for a small business',
      lead: 'Three users, five vehicles, twenty routes a day: the shape of a small transport business.',
    },
    faq: {
      eyebrow: 'Frequently asked',
      title: 'What small-business owners ask us',
      items: [
        {
          q: 'We are a small team with no IT person. Is this realistic?',
          a: 'Yes, that is exactly the use case. The only setup work is configuring your costs, done with you in one session. After that, a browser is all you need.',
        },
        {
          q: 'Does this replace our TMS?',
          a: 'No. MoveAltys focuses on the decision before departure: itinerary, cost price, margin. It sits alongside your existing tools, with no integration project.',
        },
        {
          q: 'We have more than five vehicles, what happens?',
          a: 'The Enterprise plan extends the scope to 25 users and 30 vehicles. We size the right fit with you before you change plan.',
        },
        {
          q: 'How long before we see a result?',
          a: 'From the very first route priced. Kilometre savings show up immediately; margin per customer takes shape after a few weeks of history.',
        },
      ],
    },
    finalCta: {
      title: 'Stop discovering your margins in the accounts.',
      lead: 'Price your first route today.',
      cta: 'Start my free trial',
      secondary: 'Talk to a transport expert',
    },
    backToHome: 'See all plans',
  },
  independents: {
    meta: {
      title: 'Route profitability software for independent couriers · MoveAltys',
      description:
        'Driving on your own or with two vehicles? MoveAltys prices every job before you accept it: fuel, tolls, real time on the road, margin. €39.99/month locked in for life.',
    },
    hero: {
      eyebrow: 'Independent couriers & micro-carriers',
      titleLine1: 'Before you accept a job,',
      titleLine2: 'check what it actually earns.',
      lead: 'You know your price per kilometre. But between fuel, tolls, the empty return leg and waiting at the dock, a job that looks fine can cost you money. MoveAltys prices it in two minutes, before you reply to the customer.',
      cta: 'Start my free trial',
      reassurance: 'No credit card · €39.99/month locked in for life',
    },
    pains: {
      eyebrow: 'Day to day',
      title: 'Three things your price per kilometre does not tell you',
      lead: 'When you drive on your own, profitability is decided job by job. And it is usually discovered at month end.',
      items: [
        {
          title: 'Quotes are done from memory',
          body: 'An inherited price per kilometre, a quick estimate, and the hope that it works out. Nobody has actually put the real cost of the trip on paper.',
        },
        {
          title: 'The items that eat the margin',
          body: 'Tolls, empty return legs, waiting at the dock, vehicle wear: none of it shows up on the customer invoice, but all of it comes out of your pocket.',
        },
        {
          title: 'Customers who cost you money',
          body: 'Without a history per customer, there is no way to spot the one you should renegotiate, or the one you would be better off dropping.',
        },
      ],
    },
    steps: {
      eyebrow: 'In practice',
      title: 'Up and running the same day',
      lead: 'No IT project, no hardware to fit. A browser and your own figures are enough.',
      items: [
        {
          title: 'Enter the pickup and the drop-off',
          body: 'Two addresses are enough. Add the intermediate stops if the job has several.',
        },
        {
          title: 'Set your costs once',
          body: 'Consumption, fuel price, your hourly cost, vehicle depreciation. That is the only setup, and a member of the team does it with you.',
        },
        {
          title: 'Read the margin, then decide',
          body: 'Cost price and margin appear against the offered rate. You accept, you renegotiate, or you pass.',
        },
      ],
    },
    benefits: {
      eyebrow: 'What you get',
      title: 'A figure, not a feeling',
      items: [
        { title: 'The true cost of the job', body: 'Fuel, tolls, your driving hour, the vehicle. Everything is counted.' },
        { title: 'The margin before you reply', body: 'You know whether the job is worth the trip before saying yes.' },
        { title: 'A history per customer', body: 'You see who makes you money, and who costs you money.' },
        { title: 'A quote you can show', body: 'Export the calculation as a PDF to back up your rate with the client.' },
      ],
    },
    quote: {
      text: 'Before accepting a job, I price it. Fuel, tolls, real time on the road: in two minutes I know whether it is worth the trip. I ended up dropping two customers who were costing me money.',
      author: 'Saïd M.',
      role: 'Independent courier',
    },
    offer: {
      eyebrow: 'The plan',
      title: 'One plan, no surprises',
      lead: 'The launch price is locked in for life: it will not go up for as long as you stay subscribed.',
    },
    faq: {
      eyebrow: 'Frequently asked',
      title: 'What independent couriers ask us',
      items: [
        {
          q: 'I only have one vehicle, is it worth it?',
          a: 'That is exactly what the Independent plan is for. A single underpriced job a week adds up, over a year, to far more than the subscription costs.',
        },
        {
          q: 'How long before my first calculation?',
          a: 'Your costs are configured within the day, with a member of the team. After that, each job is priced in two minutes.',
        },
        {
          q: 'Can the price go up?',
          a: 'No. The €39.99/month launch offer is locked in for life, and you get priority access to what comes next.',
        },
        {
          q: 'Do I need to install anything?',
          a: 'No. A browser is all you need, on desktop or on your phone. No hardware to fit in the vehicle.',
        },
      ],
    },
    finalCta: {
      title: 'Next job, you will know.',
      lead: 'Price it before you reply to the customer.',
      cta: 'Start my free trial',
      secondary: 'Ask a question',
    },
    backToHome: 'See all plans',
  },
  footer: {
    tagline: 'The true cost and the true margin of every route, before departure.',
    productTitle: 'Product',
    companyTitle: 'Company',
    legalTitle: 'Legal',
    about: 'About',
    blog: 'Blog',
    contact: 'Contact',
    legalNotice: 'Legal notice',
    privacy: 'Privacy policy',
    terms: 'Terms of use',
    rights: 'All rights reserved.',
    manageCookies: 'Cookie settings',
  },
}

export const CONTENT: Record<Locale, typeof fr> = { fr, en }

export type Content = typeof fr

/** Copy block driving a per-audience landing page (see SegmentLanding.astro). */
export type SegmentContent = typeof fr.independents

export function useContent(locale: Locale): Content {
  return CONTENT[locale]
}
