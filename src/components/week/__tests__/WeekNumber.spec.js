import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import WeekNumber from "@/components/week/WeekNumber.vue";

describe("WeekNumber.vue", () => {
  it("pads week numbers under 10 with a leading zero", () => {
    // 1er janvier 2024 est un lundi -> semaine ISO 01
    const wrapper = mount(WeekNumber, {
      props: { dayOfWeek: new Date(2024, 0, 1) },
    });
    expect(wrapper.text()).toBe("01");
  });

  it("does not pad week numbers >= 10", () => {
    // 4 mars 2024 -> semaine ISO 10
    const wrapper = mount(WeekNumber, {
      props: { dayOfWeek: new Date(2024, 2, 4) },
    });
    expect(wrapper.text()).toBe("10");
  });

  it("marks a week that has already occurred with the 'past' class", () => {
    const wrapper = mount(WeekNumber, {
      props: { dayOfWeek: new Date(2000, 0, 1) },
    });
    expect(wrapper.classes()).toContain("past");
  });

  it("does not mark a future week as past", () => {
    const farFuture = new Date();
    farFuture.setFullYear(farFuture.getFullYear() + 10);

    const wrapper = mount(WeekNumber, {
      props: { dayOfWeek: farFuture },
    });
    expect(wrapper.classes()).not.toContain("past");
  });
});
