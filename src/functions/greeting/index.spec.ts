import { handler } from "./index";

describe("handler", () => {
  it("should return successful response", () => {
    const expected = { statusCode: 200, body: { text: "Hello Pippo!" } };
    const event = { body: { name: "Pippo" } };

    return expect(handler(event)).resolves.toEqual(expected);
  });

  it("should return failure response", () => {
    const expected = {
      statusCode: 500,
      body: "Unexpected token R in JSON at position 0",
    };
    const event = { body: "Random" };

    return expect(handler(event)).resolves.toEqual(expected);
  });

  it("should return event, when event doesn't contain body", () => {
    const expected = {
      statusCode: 200,
      body: {
        text: "Did you forget to tell me the name!"
      },
    };
    const event = { };

    return expect(handler(event)).resolves.toEqual(expected);
  });
});
