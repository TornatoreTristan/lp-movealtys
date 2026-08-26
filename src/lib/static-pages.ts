import type { Locale } from '../i18n/config'

interface PageSection {
  heading: string
  body: readonly string[]
}

/** A page whose copy has been written and can be indexed. */
interface PageContent {
  title: string
  intro: string
  sections: readonly PageSection[]
}

/** A page still waiting for its copy: shipped `noindex`, lists the sections to write. */
interface PageStub {
  title: string
  outline: readonly string[]
}

type PageEntry = PageContent | PageStub

/** Narrows a page to the drafted variant, which is also what gates indexing. */
export function isDrafted(page: PageEntry): page is PageContent {
  return 'sections' in page
}

export const STATIC_PAGES = {
  about: {
    fr: { title: 'À propos', outline: ["L'équipe et son histoire", 'La mission de MoveAltys', 'Nos engagements clients'] },
    en: { title: 'About', outline: ['The team and its story', 'The MoveAltys mission', 'Our commitments to customers'] },
  },
  legal: {
    fr: {
      title: "Mentions légales",
      intro:
        "Conformément aux dispositions des articles 6-III et 19 de la loi pour la Confiance dans l’Économie Numérique (LCEN), il est précisé aux utilisateurs du site Movealtys l’identité des différents intervenants dans le cadre de sa réalisation et de son suivi.",
      sections: [
        {
          heading: "Informations sur l’éditeur du site",
          body: [
            "Le site Movealtys est édité par Global Digital Corporation, EURL au siège social situé au 4 Avenue de Cambridge, 14200 Hérouville-Saint-Clair, France.",
            "Email de contact : contact@globaldigitalcorporation.com",
            "SIRET : 982 254 203 00010",
            "TVA intracommunautaire : FR09982254203",
            "Directeur de la publication : Global Digital Corporation",
          ],
        },
        {
          heading: "Conception et développement",
          body: [
            "Ce site internet a été conçu et développé par Viréoverso, responsable de l’étude du projet, du webdesign et du développement.",
          ],
        },
        {
          heading: "Hébergement",
          body: [
            "Le site est hébergé par Scaleway, 8 rue de la Ville l’Évêque, 75008 Paris, France.",
            "L’infogérance et la gestion technique de l’hébergement sont assurées par SPARK PEAR.",
          ],
        },
        {
          heading: "Propriété intellectuelle",
          body: [
            "L’ensemble du contenu présent sur le site Movealtys (textes, graphismes, logos, images, vidéos, icônes, logiciels, etc.) est la propriété exclusive de Global Digital Corporation ou fait l’objet d’une autorisation d’utilisation.",
            "Toute reproduction, représentation, modification, publication, transmission ou adaptation, totale ou partielle, de ces éléments, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable.",
          ],
        },
        {
          heading: "Responsabilité",
          body: [
            "L’éditeur s’efforce de fournir des informations exactes et mises à jour. Toutefois, il ne saurait être tenu responsable d’erreurs ou d’omissions.",
            "L’utilisateur est seul responsable de l’usage qu’il fait du site et des informations qu’il contient.",
            "Le site peut contenir des liens hypertextes vers d’autres sites dont le contenu n’engage en rien la responsabilité de Movealtys.",
          ],
        },
        {
          heading: "Protection des données personnelles",
          body: [
            "Les informations concernant la collecte et le traitement des données personnelles sont précisées dans la Politique de confidentialité accessible sur le site.",
          ],
        },
        {
          heading: "Droit applicable et juridiction compétente",
          body: [
            "Les présentes mentions légales sont régies par le droit français.",
            "Tout litige relatif à l’utilisation du site sera soumis à la compétence exclusive des tribunaux français.",
          ],
        },
      ],
    },
    en: {
      title: "Legal Notice",
      intro:
        "In accordance with Articles 6-III and 19 of the French Law on Confidence in the Digital Economy (LCEN), the users of the Movealtys website are informed of the identity of the various parties involved in its creation and maintenance.",
      sections: [
        {
          heading: "Information about the website publisher",
          body: [
            "The Movealtys website is published by Global Digital Corporation, EURL, with its registered office located at 4 Avenue de Cambridge, 14200 Hérouville-Saint-Clair, France.",
            "Contact email: contact@globaldigitalcorporation.com",
            "SIRET: 982 254 203 00010",
            "VAT number: FR09982254203",
            "Publication director: Fabien Palmer",
          ],
        },
        {
          heading: "Design and development",
          body: [
            "This website was designed and developed by Viréoverso, responsible for project study, web design, and development.",
          ],
        },
        {
          heading: "Hosting",
          body: [
            "The website is hosted by Scaleway, 8 rue de la Ville l’Évêque, 75008 Paris, France.",
            "IT management and technical hosting are provided by SPARK PEAR.",
          ],
        },
        {
          heading: "Intellectual property",
          body: [
            "All content on the Movealtys website (texts, graphics, logos, images, videos, icons, software, etc.) is the exclusive property of Global Digital Corporation or is used with permission.",
            "Any reproduction, representation, modification, publication, transmission, or adaptation, in whole or in part, of these elements, by any means or process, is prohibited without prior written authorization.",
          ],
        },
        {
          heading: "Liability",
          body: [
            "The publisher strives to provide accurate and up-to-date information. However, it cannot be held responsible for errors or omissions.",
            "The user is solely responsible for the use they make of the website and the information it contains.",
            "The site may contain hyperlinks to other websites whose content does not engage the responsibility of Movealtys.",
          ],
        },
        {
          heading: "Personal data protection",
          body: [
            "Information regarding the collection and processing of personal data is specified in the Privacy Policy accessible on the website.",
          ],
        },
        {
          heading: "Applicable law and jurisdiction",
          body: [
            "This legal notice is governed by French law.",
            "Any dispute relating to the use of the website will be subject to the exclusive jurisdiction of French courts.",
          ],
        },
      ],
    },
  },
  privacy: {
    fr: {
      title: "Politique de confidentialité",
      intro:
        "La présente politique de confidentialité a pour objectif d’informer les utilisateurs du site Movealtys sur la manière dont leurs données personnelles sont collectées, traitées et protégées, conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi « Informatique et Libertés ».",
      sections: [
        {
          heading: "Données collectées",
          body: [
            "Lors de l’utilisation du site et des services proposés par Movealtys, certaines données peuvent être collectées, notamment l’adresse email fournie lors de l’inscription ou via le formulaire de contact.",
            "Dans le cadre de l’utilisation de la solution SaaS, d’autres données nécessaires au fonctionnement du service peuvent également être enregistrées.",
          ],
        },
        {
          heading: "Finalités du traitement",
          body: [
            "Les données collectées sont utilisées pour la gestion des comptes utilisateurs, la facturation, l’accès aux fonctionnalités du logiciel, ainsi que pour améliorer la qualité des services proposés.",
            "Elles peuvent également être utilisées pour la communication entre Movealtys et ses utilisateurs dans le cadre du support technique ou d’informations importantes relatives au service.",
          ],
        },
        {
          heading: "Stockage et sécurité",
          body: [
            "Les données sont hébergées et traitées en Europe.",
            "Global Digital Corporation met en œuvre des mesures techniques et organisationnelles appropriées afin de garantir la sécurité et la confidentialité des données.",
          ],
        },
        {
          heading: "Services tiers",
          body: [
            "Certains services tiers peuvent être utilisés dans le cadre du fonctionnement du site ou du suivi des performances, tels que des outils d’analyse ou de paiement.",
            "La liste des prestataires utilisés sera précisée et mise à jour dans la présente politique.",
          ],
        },
        {
          heading: "Durée de conservation",
          body: [
            "Les données sont conservées pendant la durée strictement nécessaire aux finalités décrites ci-dessus et conformément aux obligations légales et réglementaires.",
          ],
        },
        {
          heading: "Droits des utilisateurs",
          body: [
            "Les données sont conservées pendant la durée strictement nécessaire aux finalités décrites ci-dessus et conformément aux obligations légales et réglementaires.",
          ],
        },
        {
          heading: "Cookies",
          body: [
            "Le site Movealtys utilise des cookies techniques indispensables à son bon fonctionnement.",
            "Des cookies analytiques peuvent être utilisés afin d’améliorer les services proposés, mais aucun cookie publicitaire n’est mis en place.",
            "L’utilisateur peut configurer son navigateur pour refuser ou supprimer les cookies. Toutefois, certaines fonctionnalités du site pourraient ne pas fonctionner correctement.",
          ],
        },
        {
          heading: "Modifications de la politique de confidentialité",
          body: [
            "Global Digital Corporation se réserve le droit de modifier la présente politique à tout moment afin de garantir sa conformité avec les évolutions légales, réglementaires ou techniques. Les utilisateurs seront informés de toute mise à jour significative.",
          ],
        },
      ],
    },
    en: {
      title: "Privacy Policy",
      intro:
        "This privacy policy aims to inform users of the Movealtys website about how their personal data is collected, processed, and protected, in accordance with the General Data Protection Regulation (GDPR) and the French Data Protection Act.",
      sections: [
        {
          heading: "Data Collected",
          body: [
            "When using the website and services offered by Movealtys, certain data may be collected, including the email address provided during registration or via the contact form.",
            "In the context of using the SaaS solution, other data necessary for the service’s operation may also be recorded.",
          ],
        },
        {
          heading: "Purpose of Processing",
          body: [
            "The collected data is used for managing user accounts, billing, accessing software features, and improving the quality of the services offered.",
            "Data may also be used for communication between Movealtys and its users in the context of technical support or important service-related information.",
          ],
        },
        {
          heading: "Storage and Security",
          body: [
            "Data is hosted and processed in Europe.",
            "Global Digital Corporation implements appropriate technical and organizational measures to ensure the security and confidentiality of the data.",
          ],
        },
        {
          heading: "Third-Party Services",
          body: [
            "Certain third-party services may be used for the operation of the website or for performance tracking, such as analytics or payment tools.",
            "The list of service providers used will be specified and updated in this policy.",
          ],
        },
        {
          heading: "Data Retention",
          body: [
            "Data is retained only for the period strictly necessary for the purposes described above and in accordance with legal and regulatory obligations.",
          ],
        },
        {
          heading: "User Rights",
          body: [
            "Users have rights regarding their personal data, including access, correction, and deletion, in accordance with applicable laws and regulations.",
          ],
        },
        {
          heading: "Cookies",
          body: [
            "The Movealtys website uses essential technical cookies necessary for its proper functioning.",
            "Analytical cookies may be used to improve the services offered, but no advertising cookies are implemented.",
            "Users can configure their browser to refuse or delete cookies. However, certain website features may not function properly.",
          ],
        },
        {
          heading: "Changes to the Privacy Policy",
          body: [
            "Global Digital Corporation reserves the right to modify this policy at any time to ensure compliance with legal, regulatory, or technical developments. Users will be informed of any significant updates.",
          ],
        },
      ],
    },
  },
  terms: {
    fr: {
      title: "Conditions générales d'utilisation",
      outline: [
        'Objet et champ d’application',
        'Accès au service et comptes',
        'Abonnements et facturation',
        'Responsabilités',
        'Résiliation',
        'Droit applicable',
      ],
    },
    en: {
      title: 'Terms of use',
      outline: [
        'Purpose and scope',
        'Service access and accounts',
        'Subscriptions and billing',
        'Liability',
        'Termination',
        'Governing law',
      ],
    },
  },
} as const satisfies Record<string, Record<Locale, PageEntry>>

export type PageSlug = keyof typeof STATIC_PAGES

export const PAGE_SLUGS = Object.keys(STATIC_PAGES) as PageSlug[]
