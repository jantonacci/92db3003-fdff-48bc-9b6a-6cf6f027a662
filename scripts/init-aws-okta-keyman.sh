#!/usr/bin/env bash

# Check if the AWS CLI is installed
if [[ ! $(which aws) ]]; then
  echo "AWS CLI is not installed"
  return 1
fi

if [[ ! $(which okta_aws_keyman) == '' ]]; then
  echo "Check if your Python virtual environment is activated"
  echo "okta_aws_keyman is not installed"
  return 1
fi

# Set the AWS Okta Keyman application name as an input parameter
if [[ -z ${AWS_REGION} ]]; then
  export AWS_REGION='us-west-2'
fi

# Set the AWS Okta Keyman application name from env var
if [[ -z ${AWS_ACCT} ]]; then
  echo "AWS_ACCT env var is not set or passed as an input parameter; ex. 'default'"
  return 1
fi

# Set the AWS Okta Keyman application IDs
AWS_ACCT_DEFAULT='j9X3570oawkEwS2qisml/999'

# Set the AWS Okta Keyman application id based on the AWS_ACCT
if [[ ${AWS_ACCT} == 'default' ]]; then
  AWS_OKTA_APP_ID=${AWS_ACCT_DEFAULT}
else
  echo "Invalid AWS_ACCT value; ex. 'default'"
  return 1
fi

# AWS Okta Keyman login
AWS_OKTA_KEYMAN_ARGS='--org default'
AWS_OKTA_KEYMAN_ARGS+=" --username ${USER}"
# AWS_OKTA_KEYMAN_ARGS+=' --password_cache'
AWS_OKTA_KEYMAN_ARGS+=" --region ${AWS_REGION}"
AWS_OKTA_KEYMAN_ARGS+=" --appid ${AWS_OKTA_APP_ID}"

echo "Running: aws_okta_keyman ${AWS_OKTA_KEYMAN_ARGS}"
aws_okta_keyman ${AWS_OKTA_KEYMAN_ARGS}

return 0
