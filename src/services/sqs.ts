import { SQS } from "aws-sdk";

const { AWS_REGION, SQS_URL, LOCALSTACK_HOSTNAME } = process.env;

const sqs = new SQS({
  region: AWS_REGION || "eu-central-1",
});

export const getSQSUrl = (queueName: string): string =>
  LOCALSTACK_HOSTNAME
    ? `http://${LOCALSTACK_HOSTNAME}:4576/000000000000/${queueName}`
    : `${SQS_URL}/${queueName}`;

export const getSQSClient = (): SQS => sqs;
