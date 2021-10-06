import { S3 } from "aws-sdk";
import Stream from "stream";

type S3Acl =
  | "private"
  | "public-read"
  | "public-read-write"
  | "authenticated-read"
  | "aws-exec-read"
  | "bucket-owner-read"
  | "bucket-owner-full-control";

export interface S3UploadResponse {
  Location: string;
  Bucket: string;
  Key: string;
}

interface UploadResponse {
  url: string;
  bucket: string;
  key: string;
}

type UploadRequest = UploadParams & UploadOptions;

interface UploadParams {
  body: Stream | Buffer;
  bucket: string;
  key: string;
}

interface UploadOptions {
  acl?: S3Acl;
  storageClass?: string;
}

const {
  AWS_REGION,
  S3_CONF_FORCE_PATH_STYLE,
  LOCALSTACK_HOSTNAME,
  S3_ENDPOINT,
} = process.env;

const s3 = new S3({
  region: AWS_REGION || "eu-central-1",
  s3ForcePathStyle: S3_CONF_FORCE_PATH_STYLE === "true",
  endpoint: LOCALSTACK_HOSTNAME
    ? /* istanbul ignore next */ `http://${LOCALSTACK_HOSTNAME}:4572`
    : S3_ENDPOINT,
});

const mapResponse = ({
  Location,
  Bucket,
  Key,
}: S3UploadResponse): UploadResponse => {
  console.log("Finish upload");
  return {
    bucket: Bucket,
    key: Key,
    url: Location,
  };
};

const mapRequestObject = ({
  acl,
  body,
  bucket,
  key,
  storageClass,
}: UploadRequest): S3.PutObjectRequest => ({
  ACL: acl || "public-read",
  Body: body,
  Bucket: bucket,
  Key: key,
  StorageClass: storageClass || "INTELLIGENT_TIERING",
});

export const s3StreamUploader = (
  s3Client: S3,
  bucket: string,
  options: UploadOptions = {}
) => (
  key: string,
  stream: Stream | Buffer
): Promise<UploadResponse> => {
  console.log("Start Uploading", key);
  return s3Client
    .upload(mapRequestObject({ ...options, bucket, key, body: stream }))
    .promise()
    .then(mapResponse);
};

export const s3ObjectUploader = <T>(
  s3Client: S3,
  bucket: string,
  options: UploadOptions = {}
) => (
  key: string,
  data: T
): Promise<UploadResponse> => {
  console.log("Start Uploading", key);
  const body = Buffer.from(JSON.stringify(data));

  return s3Client
    .upload(mapRequestObject({ ...options, bucket, key, body }))
    .promise()
    .then(mapResponse);
};

/* istanbul ignore next */
export const getS3Client = (): S3 => s3;
