import { describe, it, expect, vi, afterEach } from "vitest";
import { createApiProvider, localJsonProvider } from "../holidayProviders.js";
import { clearJoursFeriesCache } from "../joursFeriesApi.js";
import { clearVacancesScolairesCache } from "../vacancesScolairesApi.js";

function fakeJsonResponse(data) {
  return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(data) });
}

describe("createApiProvider", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    clearJoursFeriesCache();
    clearVacancesScolairesCache();
  });

  it("combines jours fériés and vacances scolaires into the app's holiday shape", async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes("calendrier.api.gouv.fr")) {
        return fakeJsonResponse({
          "2026-01-01": "1er janvier",
          "2026-05-01": "1er mai",
        });
      }
      // API calendrier scolaire : la période d'hiver appartient à l'année
      // scolaire 2025-2026 ; l'appel pour 2026-2027 ne renvoie rien.
      if (url.includes("2025-2026")) {
        return fakeJsonResponse({
          results: [
            {
              start_date: "2026-02-07",
              end_date: "2026-02-23",
              description: "Vacances d'hiver",
            },
          ],
        });
      }
      return fakeJsonResponse({ results: [] });
    });

    const provider = createApiProvider("metropole", ["Zone A"]);
    const holiday = await provider.load(2026);

    expect(holiday.days).toEqual(expect.arrayContaining([1.01, 5.01]));
    expect(holiday.vacation["Zone A"]).toEqual([
      { start: "2026-02-07", end: "2026-02-23" },
    ]);
  });
});

describe("localJsonProvider", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches the local JSON file for the given locale and year", async () => {
    const payload = { days: [], vacation: {} };
    global.fetch = vi.fn(() => fakeJsonResponse(payload));

    const result = await localJsonProvider.load(2026, "fr");

    expect(global.fetch).toHaveBeenCalledWith(
      "./fr/2026.json",
      expect.objectContaining({ method: "get" }),
    );
    expect(result).toEqual(payload);
  });
});
