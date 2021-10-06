import { shout } from "./shout";

interface HttpEvent {
  body?: string | Record<string, unknown>;
}

interface Response {
  statusCode: number;
  body: { text: string };
}

export const handler = async (event: HttpEvent): Promise<Response> => {
  try {
    const { text } =
      event.body && typeof event.body === "string"
        ? JSON.parse(event.body)
        : event.body || event;

    return {
      statusCode: 200,
      body: { text: shout(text) },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error.message,
    };
  }
};
