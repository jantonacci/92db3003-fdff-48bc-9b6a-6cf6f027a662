# source this script to activate the virtual environment

# Get the root directory of the repository
if [[ -z "${REPO_ROOT}" ]]; then
  export REPO_ROOT=$(git rev-parse --show-toplevel)
fi

# Set the virtual environment directory
VENV_DIR="${REPO_ROOT}/.venv"

PYTHON_VERSION='3'

# Check if the virtual environment directory exists
if [[ ! -d "${VENV_DIR}" ]]; then
  echo "Virtual environment directory does not exist"
  sudo apt install python${PYTHON_VERSION} python${PYTHON_VERSION}-venv
  python${PYTHON_VERSION} -m venv ${VENV_DIR}
fi

# Check if the virtual environment is already activated
if [[ -n "$VIRTUAL_ENV" ]]; then
  echo "Virtual environment is already activated"
elif [[ -f ${VENV_DIR}/bin/activate ]]; then
  echo "Activating virtual environment"
  source ${VENV_DIR}/bin/activate
else
  echo "Virtual environment is incomplete, cannot activate."
  rm -Rf ${VENV_DIR}
  return 1
fi

# Install the required Python packages
pip${PYTON_VERSION} install --require-virtualenv --upgrade pip setuptools wheel aws_okta_keyman

echo "Virtual environment is activated and ready to use"

return 0