import { shout } from "./shout";

describe("shout", () => {
  it("should return uppercase", () => {
    expect(shout("something")).toBe("SOMETHING");
    expect(shout("Something")).toBe("SOMETHING");
    expect(shout("SOMETHING")).toBe("SOMETHING");
    expect(shout("")).toBe("");
  });
});
