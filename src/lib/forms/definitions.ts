// Les formulaires du site. Chaque formulaire n'est qu'une liste de champs :
// la mise en page, la validation, l'anti-spam et l'envoi par e-mail (Resend)
// sont communs (src/components/forms/LeadForm.tsx et src/app/actions/forms.ts).
// Les libellés sont dans messages/*.json, rubrique "forms".
//
// Tous les formulaires ont en plus, automatiquement : la case « Je certifie avoir
// 18 ans ou plus » (obligatoire), la mention RGPD et la protection anti-spam.

export type FieldType = "text" | "email" | "tel" | "textarea" | "number" | "date" | "select";

export type FieldDef = {
  name: string;
  type: FieldType;
  required?: boolean;
  /** Valeurs possibles (pour "select") : libellés dans forms.options.<name>.<valeur>. */
  options?: readonly string[];
  /** Occupe une demi-largeur sur ordinateur. */
  half?: boolean;
  autoComplete?: string;
  min?: number;
  max?: number;
};

export type FormDef = {
  fields: readonly FieldDef[];
  /** "emailOuTelephone" : au moins l'un des deux est demandé (formulaires particuliers). */
  contact: "email" | "emailOuTelephone";
};

const nom: FieldDef = { name: "nom", type: "text", required: true, half: true, autoComplete: "name" };
const email = (required = true): FieldDef => ({ name: "email", type: "email", required, half: true, autoComplete: "email" });
const telephone = (required = false): FieldDef => ({ name: "telephone", type: "tel", required, half: true, autoComplete: "tel" });
const message = (required = false): FieldDef => ({ name: "message", type: "textarea", required });
const typeEtablissement: FieldDef = {
  name: "typeEtablissement",
  type: "select",
  required: true,
  half: true,
  options: ["restaurant", "caviste", "hotel", "bar", "epicerie", "traiteur", "autre"],
};

export const forms = {
  /** Espace Pro : « Demander la grille tarifaire Pro ». */
  grillePro: {
    contact: "email",
    fields: [
      { name: "etablissement", type: "text", required: true, half: true, autoComplete: "organization" },
      typeEtablissement,
      nom,
      email(),
      telephone(),
      { name: "ville", type: "text", required: true, half: true, autoComplete: "address-level2" },
      message(),
    ],
  },
  /** Espace Pro : « Organiser une dégustation dans mon établissement ». */
  degustationPro: {
    contact: "email",
    fields: [
      { name: "etablissement", type: "text", required: true, half: true, autoComplete: "organization" },
      typeEtablissement,
      nom,
      email(),
      telephone(true),
      { name: "ville", type: "text", required: true, half: true, autoComplete: "address-level2" },
      { name: "dateSouhaitee", type: "date", half: true },
      message(),
    ],
  },
  /** Vignerons : devenez partenaire. */
  partenaireVigneron: {
    contact: "email",
    fields: [
      { name: "domaine", type: "text", required: true, half: true, autoComplete: "organization" },
      { name: "village", type: "text", required: true, half: true },
      nom,
      email(),
      telephone(),
      message(true),
    ],
  },
  /** Entreprises & CSE : « Demander un devis sur-mesure ». */
  devisEntreprise: {
    contact: "email",
    fields: [
      { name: "entreprise", type: "text", required: true, half: true, autoComplete: "organization" },
      { name: "typeDemande", type: "select", required: true, half: true, options: ["coffrets", "animation", "les-deux"] },
      nom,
      email(),
      telephone(),
      { name: "quantite", type: "number", half: true, min: 1, max: 10000 },
      { name: "dateSouhaitee", type: "date", half: true },
      message(),
    ],
  },
  /** Entreprises & CSE : « Obtenir la brochure CSE ». */
  brochureCse: {
    contact: "email",
    fields: [
      { name: "entreprise", type: "text", required: true, half: true, autoComplete: "organization" },
      { name: "effectif", type: "number", half: true, min: 1, max: 100000 },
      nom,
      email(),
    ],
  },
  /** Particuliers : « Réserver cette expérience » (sans paiement en ligne). */
  reservationExperience: {
    contact: "emailOuTelephone",
    fields: [
      nom,
      { name: "participants", type: "number", required: true, half: true, min: 1, max: 200 },
      email(false),
      telephone(),
      { name: "dateSouhaitee", type: "date", half: true },
      message(),
    ],
  },
  /** Particuliers : « Demander conseil pour mon événement » (mariage, baptême…). */
  conseilEvenement: {
    contact: "emailOuTelephone",
    fields: [
      { name: "typeEvenement", type: "select", required: true, half: true, options: ["mariage", "bapteme", "anniversaire", "finAnnee", "autre"] },
      { name: "dateEvenement", type: "date", half: true },
      { name: "invites", type: "number", half: true, min: 1, max: 2000 },
      nom,
      email(false),
      telephone(),
      message(),
    ],
  },
  /** Événement ponctuel : inscription. */
  inscriptionEvenement: {
    contact: "email",
    fields: [nom, email(), telephone(), { name: "places", type: "number", required: true, half: true, min: 1, max: 50 }, message()],
  },
  /** Page Contact. */
  contact: {
    contact: "email",
    fields: [
      nom,
      email(),
      telephone(),
      { name: "sujet", type: "select", required: true, half: true, options: ["pro", "entreprise", "particulier", "vigneron", "autre"] },
      message(true),
    ],
  },
} as const satisfies Record<string, FormDef>;

export type FormId = keyof typeof forms;
export const formIds = Object.keys(forms) as FormId[];
export const isFormId = (v: unknown): v is FormId => typeof v === "string" && v in forms;

/** Noms techniques des champs cachés communs. */
export const HONEYPOT = "site_web";
export const STARTED_AT = "_t";
export const MIN_FILL_MS = 2500;
