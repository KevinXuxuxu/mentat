import { expect, test } from "vitest";
import { History } from "../src/components/backend/memory";

const sum = (a, b) => a + b;

test("adds 1 + 2 to equal 3", () => {
  const h = new History(null);
  expect(sum(1, 2)).toBe(3);
});
