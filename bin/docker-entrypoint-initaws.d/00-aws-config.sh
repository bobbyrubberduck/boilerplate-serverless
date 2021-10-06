#!/bin/bash -oe

rm -rf ~/.aws
mkdir ~/.aws

touch ~/.aws/config
echo "[default]" >> ~/.aws/config
echo "region = us-east-1" >> ~/.aws/config
echo "output = json" >> ~/.aws/config

echo "[aws-config] config created"

touch ~/.aws/credentials
echo "[default]" >> ~/.aws/credentials
echo "aws_access_key_id = root" >> ~/.aws/credentials
echo "aws_secret_access_key = root" >> ~/.aws/credentials

echo "[aws-config] credentials created"
