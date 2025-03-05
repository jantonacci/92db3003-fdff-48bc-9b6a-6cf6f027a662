# source this script to activate the project-specific environment

if [[ -z "${AWS_REGION}" ]]; then
  export AWS_REGION='us-west-2'
fi

if [[ -z "${AWS_ACCT}" ]]; then
  echo "AWS_ACCT env var is not set or passed as an input parameter; ex. 'su-ops', '3dw-stage', '3dw-prod'"
  echo "Choose an option:"
  select choice in "default" "Quit"; do
    case $choice in
      "default")
        echo "You chose 'default'"; break
        ;;
      "Quit")
        break
        ;;
      *)
        echo "Invalid option \"${choice}\""
        ;;
    esac
  done
  export AWS_ACCT=${choice}
fi

# Get the root directory of the repository
if [[ -z "${REPO_ROOT}" ]]; then
  export REPO_ROOT=$(git rev-parse --show-toplevel)
fi

export SCRIPTS_DIR="${REPO_ROOT}/scripts"

TARGETS="init-node-env.sh init-py-venv.sh init-aws-sso-login.sh" # Excluding init-aws-okta-keyman.sh
RETURN_CODE=0
for TARGET in ${TARGETS}; do
  echo "Sourcing target file: ${TARGET}"
  source ${SCRIPTS_DIR}/${TARGET}
  RETURN_CODE_TARGET=$?
  echo "Sourced target file ${TARGET} returned exit code ${RETURN_CODE_TARGET}"
  if [[ ${RETURN_CODE_TARGET} -ne 0 ]]; then
    RETURN_CODE=$((${RETURN_CODE} + ${RETURN_CODE_TARGET}))
  fi
done

echo "All target files have been sourced"
echo "The script has been completed with exit code ${RETURN_CODE}"
return ${RETURN_CODE}
