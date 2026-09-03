import { describe, it, expect, afterEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import App from "@/App.vue";

// On isole App de CompactCalendar (fetch réseau + dépendance à $i18n.locale) :
// ce fichier ne teste que la logique propre à App (résolution de l'année,
// navigation +/-, document.title).
vi.mock("@/components/CompactCalendar.vue", () => ({
  default: {
    name: "CompactCalendar",
    props: ["year"],
    template: "<div class='compact-calendar-stub' />",
  },
}));

function setUrl(search) {
  window.history.pushState({}, "", `/${search}`);
}

function mountApp() {
  return mount(App, {
    global: {
      // App utilise $t() dans son propre template (footer) ; on le
      // neutralise ici, ce n'est pas l'objet de ces tests.
      mocks: { $t: (key) => key },
    },
  });
}

describe("App.vue", () => {
  afterEach(() => {
    setUrl("");
  });

  it("defaults to the current year when no query param is present", () => {
    setUrl("");
    const wrapper = mountApp();

    expect(wrapper.text()).toContain(String(new Date().getFullYear()));
  });

  it("reads the year from the ?year= query param", () => {
    setUrl("?year=2030");
    const wrapper = mountApp();

    expect(wrapper.text()).toContain("2030");
  });

  it("reads the year from the ?annee= query param", () => {
    setUrl("?annee=1999");
    const wrapper = mountApp();

    expect(wrapper.text()).toContain("1999");
  });

  it("increments the year and updates document.title on plus()", async () => {
    setUrl("?year=2024");
    const wrapper = mountApp();
    const [, plusButton] = wrapper.findAll("button.no-print");

    await plusButton.trigger("click");

    expect(wrapper.text()).toContain("2025");
    expect(document.title).toBe("CompactCalendar 2025");
  });

  // NOTE : ce test échoue avec le code actuel de minus() (bug connu, cf.
  // revue de code : le titre n'est mis à jour qu'au tout premier clic, et
  // avec la valeur d'AVANT décrémentation). Il documente le comportement
  // attendu ; corriger minus() pour qu'il passe.
  it("decrements the year and updates document.title on minus()", async () => {
    setUrl("?year=2024");
    const wrapper = mountApp();
    const [minusButton] = wrapper.findAll("button.no-print");

    await minusButton.trigger("click");

    expect(wrapper.text()).toContain("2023");
    expect(document.title).toBe("CompactCalendar 2023");
  });

  it("keeps decrementing the year on repeated clicks", async () => {
    setUrl("?year=2024");
    const wrapper = mountApp();
    const [minusButton] = wrapper.findAll("button.no-print");

    await minusButton.trigger("click");
    await minusButton.trigger("click");

    expect(wrapper.text()).toContain("2022");
  });
});
