#!/bin/bash -e

export AWS_SDK_LOAD_CONFIG=1

env=$1

if [ $env == "dev" ]; then
  account="141797902071"
else
  account="409499752129"
fi

role="arn:aws:iam::$account:role/TerraformCrossAccTrustedRole"

echo "ENV: $env"
echo "ACCOUNT: $account"
echo "ROLE: $role"

aws sts assume-role --role-arn $role --external-id $account --role-session-name jenkinsci-$env > temp_creds.json

echo "Set default profile"
aws configure set aws_access_key_id $(cat temp_creds.json | jq -r '.Credentials.AccessKeyId') --profile sls-$env
aws configure set aws_secret_access_key $(cat temp_creds.json | jq -r '.Credentials.SecretAccessKey') --profile sls-$env
aws configure set aws_session_token $(cat temp_creds.json | jq -r '.Credentials.SessionToken') --profile sls-$env
aws configure set region eu-central-1 --profile sls-$env

echo "Get AWS caller identity"
aws sts get-caller-identity --profile sls-$env

echo "Deploy to $env"
serverless deploy --stage $env --verbose --aws-profile sls-$env
