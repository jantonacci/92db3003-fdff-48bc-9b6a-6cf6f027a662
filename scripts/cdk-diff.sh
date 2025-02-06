#!/usr/bin/bash -vx

# Check if the arguments contain "bash"
if [[ "${@}" == *"bash"* ]]; then
  # Remove the first two arguments: bash and the script name
  OPTIONAL_ARGS="${@:2}"
else
  # Remove the first argument: the script name
  OPTIONAL_ARGS="${@:1}"
fi

# If the arguments do not contain "--context", exit with an error
if [[ ! "${@}" == *"--context"* ]]; then
  echo "A --context key=value argument is required."
  exit 1
fi

# Deploy the CDK stack
npx aws-cdk diff ${OPTIONAL_ARGS} --ci --verbose --trace 2>&1 | tee cdk-diff.out
