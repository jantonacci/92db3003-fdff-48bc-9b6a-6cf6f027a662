#!/usr/bin/env bash

# Check if the AWS CLI is installed
if [[ ! $(which aws) ]]; then
  echo "AWS CLI is not installed"
  return 1
fi

# Set the AWS Okta Keyman application name as an input parameter
if [[ -z ${AWS_REGION} ]]; then
  export AWS_REGION='us-west-2'
fi

# Set the AWS Okta Keyman application name from env var
if [[ -z ${AWS_PROFILE} ]]; then
  export AWS_PROFILE='default'
fi

export AWS_SSO_LOGIN_SCRIPT="/usr/local/bin/aws sso login --profile ${AWS_PROFILE} --region ${AWS_REGION}"

echo "Running: ${AWS_SSO_LOGIN_SCRIPT}"
${AWS_SSO_LOGIN_SCRIPT}

return 0
