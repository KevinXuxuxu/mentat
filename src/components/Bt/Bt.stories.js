import { Bt } from ".";

export default {
  title: "Components/Bt",
  component: Bt,
  argTypes: {
    state: {
      options: ["hover-pressed", "default"],
      control: { type: "select" },
    },
  },
};

export const Default = {
  args: {
    state: "hover-pressed",
    className: {},
    text: "Help",
  },
};
