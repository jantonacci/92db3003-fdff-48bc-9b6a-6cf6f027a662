# source this script to activate the AWS CDK Toolkit

# Check if the AWS CLI is installed
if [[ $(which aws) == '' ]]; then
  echo "AWS CLI is not installed"
  snap version
  sudo snap install aws-cli --classic
  . "${HOME}/.profile"
fi
aws --version

# Check if Node Version Manager (NVM) is installed
export NVM_DIR="${HOME}/.nvm"
if [[ ! -f "$NVM_DIR/nvm.sh" ]]; then
  echo "Node Version Manager is not installed"
  echo "curl version: $(curl --version)"
  echo "jq version: $(jq --version)"
  NVM_LATEST_VERSION=$(curl --silent "https://api.github.com/repos/nvm-sh/nvm/releases/latest" | jq -r ".tag_name")
  curl -o- "https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_LATEST_VERSION}/install.sh" | bash
fi
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
echo "nvm version: $(nvm --version)"

# Install the latest Node.js LTS version
nvm install --lts
nvm use --lts

ARGS_NPM_INSTALL='--no-audit --no-fund --no-save'

# Check if the AWS CDK Toolkit is installed
if [[ $(which cdk) == '' ]]; then
  echo "AWS CDK Toolkit is not installed"
  npm install ${ARGS_NPM_INSTALL} --global aws-cdk@latest aws-cdk-lib@latest
fi
cdk --version
