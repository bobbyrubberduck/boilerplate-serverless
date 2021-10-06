import { greeting } from "./greeting";

interface HttpEvent {
  body?: string | Record<string, unknown>;
}

interface Response {
  statusCode: number;
  body: { text: string };
}

export const handler = async (event: HttpEvent): Promise<Response> => {
  try {
    const { name } =
      event.body && typeof event.body === "string"
        ? JSON.parse(event.body)
        : event.body || event;

    return {
      statusCode: 200,
      body: { text: greeting(name) },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error.message,
    };
  }
};
