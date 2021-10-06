import { handler } from "./index";

describe("handler", () => {
  it("should return successful response", () => {
    const expected = { statusCode: 200, body: { text: "SOMETHING" } };
    const event = { body: { text: "something" } };

    return expect(handler(event)).resolves.toEqual(expected);
  });

  it("should return failure response", () => {
    const expected = {
      statusCode: 500,
      body: "Cannot read property 'toUpperCase' of undefined",
    };
    const event = { body: "" };

    return expect(handler(event)).resolves.toEqual(expected);
  });

  it("should return failure response, when event doesn't contain body", () => {
    const expected = {
      statusCode: 500,
      body: "Cannot read property 'toUpperCase' of undefined",
    };
    const event = { };

    return expect(handler(event)).resolves.toEqual(expected);
  });

  it("should return successful response, with value from event", () => {
    const expected = {
      statusCode: 200,
      body: {
        text: "TEST",
      }
    };
    const event = { body: "{\"text\": \"test\"}" };

    return expect(handler(event)).resolves.toEqual(expected);
  });
});
