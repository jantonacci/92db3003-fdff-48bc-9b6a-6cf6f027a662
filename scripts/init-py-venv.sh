# source this script to activate the virtual environment

# Get the root directory of the repository
if [[ -z "${REPO_ROOT}" ]]; then
  export REPO_ROOT=$(git rev-parse --show-toplevel)
fi

# Set the virtual environment directory
VENV_DIR="${REPO_ROOT}/.venv"

# Check if the virtual environment directory exists
if [[ ! -d ".venv" ]]; then
  echo "Virtual environment directory does not exist"
  python3 -m venv ${VENV_DIR}
fi

# Check if the virtual environment is already activated
if [[ -n "$VIRTUAL_ENV" ]]; then
  echo "Virtual environment is already activated"
else
  echo "Activating virtual environment"
  source ${VENV_DIR}/bin/activate
fi

# Install the required Python packages
pip install --upgrade pip setuptools wheel aws_okta_keyman

echo "Virtual environment is activated and ready to use"

return 0
