import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { nextTick } from "vue";
import { createI18n } from "vue-i18n";
import CompactCalendar from "@/components/CompactCalendar.vue";

// On isole CompactCalendar de son rendu enfant : ce fichier teste sa
// logique propre (fetch, zones, agrégation des vacances), pas le rendu
// du calendrier lui-même (déjà couvert par les autres specs).
vi.mock("@/components/CalendarItem.vue", () => ({
  default: {
    name: "CalendarItem",
    props: ["weeks", "vacations", "holidays", "mondayfirst"],
    template: "<div class='calendar-item-stub' />",
  },
}));

function makeI18n(locale = "fr") {
  return createI18n({
    locale,
    fallbackLocale: "fr",
    messages: { fr: {}, en: {} },
  });
}

function fakeJsonResponse(data) {
  return Promise.resolve({ json: () => Promise.resolve(data) });
}

const sampleHoliday = {
  days: [1.01, 12.25],
  vacation: {
    "*": [{ start: "2024-01-01", end: "2024-01-02" }],
    zoneA: [{ start: "2024-02-10", end: "2024-02-12" }],
    zoneB: [{ start: "2024-04-01", end: "2024-04-01" }],
  },
};

describe("CompactCalendar.vue", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() => fakeJsonResponse(sampleHoliday));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches the holidays file for the current locale and year", async () => {
    const i18n = makeI18n("fr");
    mount(CompactCalendar, {
      props: { year: 2024 },
      global: { plugins: [i18n] },
    });
    await flushPromises();

    expect(global.fetch).toHaveBeenCalledWith(
      "./fr/2024.json",
      expect.objectContaining({ method: "get" }),
    );
  });

  it("extracts the zone list, excluding the '*' wildcard", async () => {
    const i18n = makeI18n("fr");
    const wrapper = mount(CompactCalendar, {
      props: { year: 2024 },
      global: { plugins: [i18n] },
    });
    await flushPromises();

    expect(wrapper.vm.zones).toEqual(["zoneA", "zoneB"]);
  });

  it("defaults the selected zone to the first zone found", async () => {
    const i18n = makeI18n("fr");
    const wrapper = mount(CompactCalendar, {
      props: { year: 2024 },
      global: { plugins: [i18n] },
    });
    await flushPromises();

    expect(wrapper.vm.currZone).toBe("zoneA");
  });

  it("merges the common ('*') vacation days with the selected zone's days", async () => {
    const i18n = makeI18n("fr");
    const wrapper = mount(CompactCalendar, {
      props: { year: 2024 },
      global: { plugins: [i18n] },
    });
    await flushPromises();

    // zoneA (10, 11, 12 fev) + jours communs "*" (1, 2 jan)
    expect(wrapper.vm.vacations[2024]).toEqual(
      expect.arrayContaining([2.1, 2.11, 2.12, 1.01, 1.02]),
    );
  });

  it("recomputes the vacation days when the user picks another zone", async () => {
    const i18n = makeI18n("fr");
    const wrapper = mount(CompactCalendar, {
      props: { year: 2024 },
      global: { plugins: [i18n] },
    });
    await flushPromises();

    const radios = wrapper.findAll("input[type='radio']");
    expect(radios).toHaveLength(2);

    await radios[1].setValue(); // sélectionne zoneB
    await flushPromises();

    expect(wrapper.vm.currZone).toBe("zoneB");
    // zoneB (1 avril) + jours communs "*" (1, 2 jan)
    expect(wrapper.vm.vacations[2024]).toEqual(
      expect.arrayContaining([4.01, 1.01, 1.02]),
    );
  });

  it("refetches when the year prop changes", async () => {
    const i18n = makeI18n("fr");
    const wrapper = mount(CompactCalendar, {
      props: { year: 2024 },
      global: { plugins: [i18n] },
    });
    await flushPromises();
    expect(global.fetch).toHaveBeenCalledTimes(1);

    await wrapper.setProps({ year: 2025 });
    await flushPromises();

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenLastCalledWith(
      "./fr/2025.json",
      expect.anything(),
    );
  });

  it("refetches when the i18n locale changes", async () => {
    const i18n = makeI18n("fr");
    const wrapper = mount(CompactCalendar, {
      props: { year: 2024 },
      global: { plugins: [i18n] },
    });
    await flushPromises();
    expect(global.fetch).toHaveBeenCalledTimes(1);

    wrapper.vm.$i18n.locale = "en";
    await nextTick();
    await flushPromises();

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenLastCalledWith(
      "./en/2024.json",
      expect.anything(),
    );
  });

  it("does not crash and logs the error when the fetch fails", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("network down")));
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const i18n = makeI18n("fr");
    const wrapper = mount(CompactCalendar, {
      props: { year: 2024 },
      global: { plugins: [i18n] },
    });
    await flushPromises();

    expect(wrapper.vm.zones).toEqual([]);
    expect(logSpy).toHaveBeenCalled();
  });
});
