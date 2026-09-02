import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import WeekItem from "@/components/week/WeekItem.vue";

function buildWeek(startDate) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

describe("WeekItem.vue", () => {
  it("renders exactly 7 days for a week", () => {
    const week = buildWeek(new Date(2024, 5, 3));
    const wrapper = mount(WeekItem, { props: { week } });

    expect(wrapper.findAll("li.day")).toHaveLength(7);
  });

  it("shows the month label when the week contains the 1st of a month", () => {
    const week = buildWeek(new Date(2024, 6, 1)); // contient le 1er juillet
    const wrapper = mount(WeekItem, { props: { week } });

    expect(wrapper.find("li.month").classes()).not.toContain("hidden");
  });

  it("hides the month label when the week has no month change", () => {
    const week = buildWeek(new Date(2024, 5, 10)); // ne contient pas de 1er
    const wrapper = mount(WeekItem, { props: { week } });

    expect(wrapper.find("li.month").classes()).toContain("hidden");
  });

  it("passes the last day of the week to WeekNumber/WeekMonth", () => {
    const week = buildWeek(new Date(2024, 0, 1));
    const wrapper = mount(WeekItem, { props: { week } });

    // week[6] est le dimanche 7 janvier 2024 -> toujours semaine ISO 01
    expect(wrapper.find("li.week").text()).toBe("01");
  });
});
