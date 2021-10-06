import { greeting } from "./greeting";

describe("shout", () => {
  it("should return greeting", () => {
    expect(greeting("Pippo")).toBe("Hello Pippo!");
  });

  it("should return forgot something", () => {
    expect(greeting("")).toBe("Did you forget to tell me the name!");
  });
});
