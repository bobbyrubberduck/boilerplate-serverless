import { getS3Client } from "../../services/s3";
import { getSQSClient, getSQSUrl } from "../../services/sqs";

const { TASK_BUCKET, SSM_VAR, TASK_QUEUE } = process.env;

interface HttpEvent {
  body?: string | Record<string, unknown>;
}

const storeSQSMessage = (data: string): Promise<string> =>
  getSQSClient()
    .sendMessage({
      MessageBody: data,
      QueueUrl: getSQSUrl(TASK_QUEUE || ""),
    })
    .promise()
    .then(() => data);

export const handler = async (event: HttpEvent): Promise<string> => {
  const { text } =
    event.body && typeof event.body === "string"
      ? JSON.parse(event.body)
      : event.body || event;

  return getS3Client()
    .upload({
      Body: Buffer.from(SSM_VAR + text, "utf-8"),
      Bucket: TASK_BUCKET || "",
      Key: "task.txt",
    })
    .promise()
    .then((data) => data.Location)
    .then(storeSQSMessage);
};
