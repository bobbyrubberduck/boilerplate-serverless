#!/bin/bash -oe

aws --endpoint-url=http://localhost:4566 s3api create-bucket \
  --bucket serverless-artifacts-local \
  --acl public-read-write \
  --region us-east-1

echo "[aws-resources] s3 deployment bucket created $HOSTNAME"

ssmPath="/service/sourcing/assignment"

aws --endpoint-url=http://localhost:4566 ssm put-parameter \
  --name "$ssmPath/SSM_VAR" \
  --value "Sentence: " \
  --type "SecureString"

echo "[aws-resources] ssm vars store on path $ssmPath"
