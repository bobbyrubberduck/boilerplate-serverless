#!/bin/bash -e

# List of services to run on localstack
export SERVICES=s3,sqs,apigateway,lambda,stepfunctions,cloudformation,sts,iam,events,ssm
export AWS_ACCESS_KEY_ID=root
export AWS_SECRET_ACCESS_KEY=root
export AWS_REGION=us-east-1
export TMPDIR=/private$TMPDIR
export LAMBDA_EXECUTOR=docker-reuse
export LAMBDA_REMOTE_DOCKER=false
export IMAGE_NAME=localstack/localstack:latest
export LOCALSTACK_DOCKER_NAME=assignment
if [[  "$1" == "debug"  ]]; then
  export DEBUG=1
else
  export DEBUG=0
fi

docker-compose up
