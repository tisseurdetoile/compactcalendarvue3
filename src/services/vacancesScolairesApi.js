/**
 * Client pour l'API officielle du calendrier scolaire (vacances par zone).
 *
 * Source : https://www.data.gouv.fr/dataservices/api-calendrier-scolaire
 * Jeu de données : "fr-en-calendrier-scolaire" (data.education.gouv.fr,
 * plateforme OpenDataSoft), consommé via l'API "Explore v2.1".
 *
 * Chaque enregistrement du jeu de données correspond à une période
 * (ex: "Vacances de la Toussaint") pour une zone, une académie
 * (`location`) et une population (`Élèves`, `Enseignants`, ou `-` pour
 * la période "socle" commune à toute la zone, indépendante de
 * l'académie). On utilise `population = "-"` pour récupérer une seule
 * période par zone plutôt qu'une par académie.
 */

const BASE_URL =
  "https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records";

/** Zones de vacances scolaires disponibles (métropole). */
export const VACATION_ZONES = ["Zone A", "Zone B", "Zone C", "Corse"];

// Cache mémoire simple, clé = "zone-année civile"
const cache = new Map();

/**
 * Une année civile chevauche deux années scolaires.
 * Ex: l'année civile 2026 a besoin de "2025-2026" (janvier à août)
 * et "2026-2027" (septembre à décembre).
 */
function anneesScolairesPourAnneeCivile(year) {
  return [`${year - 1}-${year}`, `${year}-${year + 1}`];
}

function buildUrl(zone, anneeScolaire) {
  const params = new URLSearchParams({
    limit: "50",
    lang: "fr",
    timezone: "Europe/Paris",
  });
  // L'API attend un paramètre "refine" répété pour chaque filtre
  params.append("refine", `zones:"${zone}"`);
  params.append("refine", `population:"-"`);
  params.append("refine", `annee_scolaire:"${anneeScolaire}"`);
  return `${BASE_URL}?${params.toString()}`;
}

// L'API Explore v2.1 renvoie { total_count, results: [ { <champs...> } ] }
// (les champs sont directement sur chaque résultat). On reste tolérant
// au format v1 ({ record: { fields: {...} } }) au cas où.
function extractFields(record) {
  if (record.record && record.record.fields) {
    return record.record.fields;
  }
  if (record.fields) {
    return record.fields;
  }
  return record;
}

async function fetchRecordsForAnneeScolaire(zone, anneeScolaire) {
  const url = buildUrl(zone, anneeScolaire);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `API calendrier-scolaire: réponse HTTP ${response.status} pour ${url}`,
    );
  }

  const json = await response.json();
  return json.results || [];
}

/**
 * Récupère les périodes de vacances scolaires d'une zone qui touchent
 * une année civile donnée.
 *
 * @param {string} zone "Zone A" | "Zone B" | "Zone C" | "Corse"
 * @param {number} year année civile
 * @returns {Promise<Array<{start:string, end:string, description:string}>>}
 *   dates au format "YYYY-MM-DD"
 */
export async function fetchVacancesScolaires(zone, year) {
  const cacheKey = `${zone}-${year}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const anneesScolaires = anneesScolairesPourAnneeCivile(year);
  const resultsByAnnee = await Promise.all(
    anneesScolaires.map((annee) => fetchRecordsForAnneeScolaire(zone, annee)),
  );

  const periodes = resultsByAnnee
    .flat()
    .map(extractFields)
    .map((fields) => ({
      start: (fields.start_date || "").slice(0, 10),
      end: (fields.end_date || "").slice(0, 10),
      description: fields.description,
    }))
    .filter((periode) => periode.start && periode.end)
    // on ne garde que ce qui touche réellement l'année civile demandée
    .filter((periode) => {
      const startYear = parseInt(periode.start.slice(0, 4), 10);
      const endYear = parseInt(periode.end.slice(0, 4), 10);
      return startYear === year || endYear === year;
    });

  cache.set(cacheKey, periodes);
  return periodes;
}

/** Vide le cache mémoire (utile pour les tests). */
export function clearVacancesScolairesCache() {
  cache.clear();
}
