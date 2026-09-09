import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  fetchJoursFeries,
  clearJoursFeriesCache,
} from "../joursFeriesApi.js";

function fakeJsonResponse(data, ok = true, status = 200) {
  return Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(data),
  });
}

describe("joursFeriesApi", () => {
  beforeEach(() => {
    clearJoursFeriesCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls the correct URL for a zone and year", async () => {
    global.fetch = vi.fn(() =>
      fakeJsonResponse({ "2026-01-01": "1er janvier" }),
    );

    await fetchJoursFeries("metropole", 2026);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://calendrier.api.gouv.fr/jours-feries/metropole/2026.json",
    );
  });

  it("returns the parsed JSON payload", async () => {
    const payload = { "2026-05-01": "1er mai", "2026-12-25": "Noël" };
    global.fetch = vi.fn(() => fakeJsonResponse(payload));

    const result = await fetchJoursFeries("metropole", 2026);

    expect(result).toEqual(payload);
  });

  it("caches results for the same zone/year", async () => {
    global.fetch = vi.fn(() => fakeJsonResponse({ "2026-01-01": "x" }));

    await fetchJoursFeries("metropole", 2026);
    await fetchJoursFeries("metropole", 2026);

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("throws when the API responds with an error status", async () => {
    global.fetch = vi.fn(() => fakeJsonResponse({}, false, 500));

    await expect(fetchJoursFeries("metropole", 2026)).rejects.toThrow();
  });
});
