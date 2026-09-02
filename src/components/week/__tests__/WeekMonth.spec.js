import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import WeekMonth from "@/components/week/WeekMonth.vue";

// On dérive la valeur attendue avec le même appel que le composant
// (toLocaleDateString(undefined, ...)) pour ne pas dépendre de la
// locale système de la machine qui exécute les tests.
function expectedLabel(date) {
  const shrt = date.toLocaleDateString(undefined, { month: "short" });
  if (shrt.length < 6) {
    return shrt + " ".repeat(5 - shrt.length);
  }
  return shrt;
}

describe("WeekMonth.vue", () => {
  it("displays the padded short month label when changedMonth is true", () => {
    const date = new Date(2024, 0, 1); // Janvier
    const wrapper = mount(WeekMonth, {
      props: { dayOfWeek: date, changedMonth: true },
    });

    // On utilise textContent brut : wrapper.text() trim les espaces,
    // ce qui masquerait le padding qu'on veut justement vérifier.
    expect(wrapper.element.textContent).toBe(expectedLabel(date));
  });

  it("does not truncate month names that are 6 characters or longer", () => {
    // Selon la locale, certains libellés courts font 6+ caractères
    // (ex: "sept." en français). On vérifie juste l'absence de padding
    // ajouté quand ce n'est pas nécessaire.
    const date = new Date(2024, 8, 15); // Septembre
    const wrapper = mount(WeekMonth, {
      props: { dayOfWeek: date, changedMonth: true },
    });

    expect(wrapper.element.textContent).toBe(expectedLabel(date));
  });

  it("applies the 'hidden' class when changedMonth is false", () => {
    const wrapper = mount(WeekMonth, {
      props: { dayOfWeek: new Date(2024, 5, 15), changedMonth: false },
    });

    expect(wrapper.classes()).toContain("hidden");
  });

  it("does not apply the 'hidden' class when changedMonth is true", () => {
    const wrapper = mount(WeekMonth, {
      props: { dayOfWeek: new Date(2024, 5, 1), changedMonth: true },
    });

    expect(wrapper.classes()).not.toContain("hidden");
  });
});
