import { it, describe, expect } from "vitest";

import { mount } from "@vue/test-utils";
import DayItem from "@/components/week/DayItem.vue";

describe("DayItem.vue", () => {
  it("renders correctly", () => {
    // mount the component
    const wrapper = mount(DayItem, {
      props: {
        day: new Date("December 17, 1995 03:24:00"),
        changedMonth: false,
      },
    });

    // generate a new snapshot of
    // the component's template
    expect(wrapper.element).toMatchSnapshot();
  });
});
