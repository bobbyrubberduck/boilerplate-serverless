#!/bin/bash -e

rm -rf .build
mkdir .build

npm run sls -- deploy --stage=local --region=us-east-1
