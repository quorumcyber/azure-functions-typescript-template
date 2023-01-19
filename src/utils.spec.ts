import { delay } from "./utils";

describe("Testing utilities file", () => {
  test("delay function should return an instance of a Promise", () => {
    expect(delay(100)).toBeInstanceOf(Promise);
  });
});
