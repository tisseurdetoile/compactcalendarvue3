/**
 * Fournisseurs de données "jours fériés + vacances scolaires" pour
 * CompactCalendar. Les deux fournisseurs exposent la même interface
 * `load(year, locale) -> Promise<{ vacation: Object, days: Array<number> }>`
 * ce qui permet au composant de rester agnostique de la source :
 *
 *   - vacation : { [zone]: [{ start: "YYYY-MM-DD", end: "YYYY-MM-DD" }] }
 *     ("*" est une clé spéciale = jours communs à toutes les zones,
 *     uniquement gérée par le fournisseur local)
 *   - days : liste de jours fériés au format flottant "mois.jour"
 *     (ex: 1.01 pour le 1er janvier), indépendant de l'année
 */

import { fetchJoursFeries, DEFAULT_HOLIDAY_ZONE } from "./joursFeriesApi.js";
import {
  fetchVacancesScolaires,
  VACATION_ZONES,
} from "./vacancesScolairesApi.js";

export { HOLIDAY_ZONES, DEFAULT_HOLIDAY_ZONE } from "./joursFeriesApi.js";
export { VACATION_ZONES } from "./vacancesScolairesApi.js";

function isoDateToFloatDay(isoDate) {
  // "YYYY-MM-DD" => nombre flottant "mois.jour" (ex: "2026-05-01" => 5.01)
  const [, month, day] = isoDate.split("-");
  return parseFloat(`${parseInt(month, 10)}.${day}`);
}

/**
 * Fournisseur historique de l'application : fichiers JSON statiques
 * `./{locale}/{year}.json`, au format déjà utilisé par CompactCalendar.
 */
export const localJsonProvider = {
  id: "local",
  load(year, locale) {
    const url = `./${locale}/${year}.json`;
    return fetch(url, {
      method: "get",
      headers: { "content-type": "application/json" },
    }).then((response) => response.json());
  },
};

/**
 * Fournisseur basé sur les API officielles :
 *  - jours fériés : https://www.data.gouv.fr/dataservices/jours-feries
 *  - calendrier scolaire : https://www.data.gouv.fr/dataservices/api-calendrier-scolaire
 *
 * @param {string} holidayZone zone pour les jours fériés (voir HOLIDAY_ZONES)
 * @param {string[]} vacationZones zones de vacances scolaires à charger
 */
export function createApiProvider(
  holidayZone = DEFAULT_HOLIDAY_ZONE,
  vacationZones = VACATION_ZONES,
) {
  return {
    id: "api",
    holidayZone,
    async load(year) {
      const joursFeries = await fetchJoursFeries(holidayZone, year);
      const days = Object.keys(joursFeries).map(isoDateToFloatDay);

      const vacation = {};
      await Promise.all(
        vacationZones.map(async (zone) => {
          const periodes = await fetchVacancesScolaires(zone, year);
          vacation[zone] = periodes.map((periode) => ({
            start: periode.start,
            end: periode.end,
          }));
        }),
      );

      return { vacation, days };
    },
  };
}
