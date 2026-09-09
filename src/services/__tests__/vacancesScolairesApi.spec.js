import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  fetchVacancesScolaires,
  clearVacancesScolairesCache,
} from "../vacancesScolairesApi.js";

function fakeJsonResponse(data, ok = true, status = 200) {
  return Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(data),
  });
}

describe("vacancesScolairesApi", () => {
  beforeEach(() => {
    clearVacancesScolairesCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("queries both overlapping school years for a given calendar year", async () => {
    global.fetch = vi.fn(() => fakeJsonResponse({ results: [] }));

    await fetchVacancesScolaires("Zone A", 2026);

    expect(global.fetch).toHaveBeenCalledTimes(2);
    // On relit chaque URL via URLSearchParams plutôt que de comparer des
    // chaînes encodées à la main : "+" vs "%20" pour l'espace, ordre des
    // paramètres... ce sont des détails d'encodage, pas le comportement
    // à tester.
    const calledParams = global.fetch.mock.calls.map(
      (call) => new URL(call[0]).searchParams,
    );

    expect(calledParams[0].getAll("refine")).toContain(
      'annee_scolaire:"2025-2026"',
    );
    expect(calledParams[1].getAll("refine")).toContain(
      'annee_scolaire:"2026-2027"',
    );
    calledParams.forEach((params) => {
      expect(params.getAll("refine")).toEqual(
        expect.arrayContaining(['zones:"Zone A"', 'population:"-"']),
      );
    });
  });

  it("normalizes records and filters by calendar year", async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes("2025-2026")) {
        return fakeJsonResponse({
          results: [
            {
              start_date: "2026-02-07T00:00:00+01:00",
              end_date: "2026-02-23T00:00:00+01:00",
              description: "Vacances d'hiver",
              zones: "Zone A",
            },
          ],
        });
      }
      return fakeJsonResponse({ results: [] });
    });

    const periodes = await fetchVacancesScolaires("Zone A", 2026);

    expect(periodes).toEqual([
      { start: "2026-02-07", end: "2026-02-23", description: "Vacances d'hiver" },
    ]);
  });

  it("supports the nested v1-style record shape as a fallback", async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes("2025-2026")) {
        return fakeJsonResponse({ results: [] });
      }
      return fakeJsonResponse({
        results: [
          {
            record: {
              fields: {
                start_date: "2026-12-19",
                end_date: "2027-01-04",
                description: "Vacances de Noël",
              },
            },
          },
        ],
      });
    });

    const periodes = await fetchVacancesScolaires("Zone A", 2026);

    expect(periodes).toEqual([
      { start: "2026-12-19", end: "2027-01-04", description: "Vacances de Noël" },
    ]);
  });

  it("caches results for the same zone/year", async () => {
    global.fetch = vi.fn(() => fakeJsonResponse({ results: [] }));

    await fetchVacancesScolaires("Zone A", 2026);
    await fetchVacancesScolaires("Zone A", 2026);

    expect(global.fetch).toHaveBeenCalledTimes(2); // 2 appels pour le 1er load, 0 pour le 2e
  });

  it("throws when the API responds with an error status", async () => {
    global.fetch = vi.fn(() => fakeJsonResponse({}, false, 500));

    await expect(fetchVacancesScolaires("Zone A", 2026)).rejects.toThrow();
  });
});
