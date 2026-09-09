/**
 * Client pour l'API officielle des jours fériés en France.
 *
 * Source : https://www.data.gouv.fr/dataservices/jours-feries
 * Doc technique : https://calendrier.api.gouv.fr/jours-feries/openapi.yml
 *
 * Format de réponse pour GET /jours-feries/{zone}/{annee}.json :
 *   { "2026-01-01": "1er janvier", "2026-05-01": "1er mai", ... }
 * (clés en ISO 8601, valeurs = nom du jour férié)
 */

const BASE_URL = "https://calendrier.api.gouv.fr/jours-feries";

/** Zones disponibles pour l'API jours fériés. */
export const HOLIDAY_ZONES = [
  { code: "metropole", label: "France métropolitaine" },
  { code: "alsace-moselle", label: "Alsace-Moselle" },
  { code: "guadeloupe", label: "Guadeloupe" },
  { code: "guyane", label: "Guyane" },
  { code: "martinique", label: "Martinique" },
  { code: "mayotte", label: "Mayotte" },
  { code: "nouvelle-caledonie", label: "Nouvelle-Calédonie" },
  { code: "polynesie-francaise", label: "Polynésie française" },
  { code: "la-reunion", label: "La Réunion" },
  { code: "saint-barthelemy", label: "Saint-Barthélémy" },
  { code: "saint-martin", label: "Saint-Martin" },
  { code: "saint-pierre-et-miquelon", label: "Saint-Pierre-et-Miquelon" },
  { code: "wallis-et-futuna", label: "Wallis-et-Futuna" },
];

export const DEFAULT_HOLIDAY_ZONE = "metropole";

// Cache mémoire simple : évite de re-télécharger la même zone/année
// plusieurs fois pendant la session (changement de zone de vacances,
// navigation avant/arrière dans les années, etc.)
const cache = new Map();

/**
 * Récupère les jours fériés d'une zone pour une année civile donnée.
 *
 * @param {string} zone code de zone, voir HOLIDAY_ZONES (ex: "metropole")
 * @param {number} year année civile (ex: 2026)
 * @returns {Promise<Object<string,string>>} objet { "YYYY-MM-DD": "nom du jour férié" }
 */
export async function fetchJoursFeries(zone, year) {
  const cacheKey = `${zone}-${year}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const url = `${BASE_URL}/${zone}/${year}.json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `API jours-feries: réponse HTTP ${response.status} pour ${url}`,
    );
  }

  const data = await response.json();
  cache.set(cacheKey, data);
  return data;
}

/** Vide le cache mémoire (utile pour les tests). */
export function clearJoursFeriesCache() {
  cache.clear();
}
