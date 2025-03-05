#!/usr/bin/env node

import {
  catTextFiles,
  cmdsStringNewLine,
  encodeFileToBase64,
  encodeStringToBase64,
  getCurrentTimestamp,
} from "../../common/construct-utils";
import {
  AWS_EC2_USERDATA,
  AWS_EC2_USERDATA_WORKING_DIR,
} from "../../common/constants";
import * as path from "node:path";

export class Ec2UserdataCfnSymlinks {
  readonly commands: string[];
  readonly commandsString: string;
  constructor() {
    this.commands = [
      "# Ec2UserdataCfnSymlinks",
      `export _WORK=${AWS_EC2_USERDATA_WORKING_DIR}`,
      "sudo mkdir --mode=700 --parents --verbose ${_WORK}",
      "sudo ln --symbolic /var/log/cloud-init-output.log ${_WORK}/cloud-init-output.log",
      "sudo ln --symbolic /var/log/cloud-init.log ${_WORK}/cloud-init.log",
    ];

    this.commandsString = cmdsStringNewLine(this.commands);
  }
}

export class Ec2UserdataPkgUbuntu {
  readonly commands: string[];
  readonly commandsString: string;
  constructor() {
    // Create the command to install development dependencies
    this.commands = [
      "# Ec2UserdataPkgUbuntu",
      "sudo apt-get update",
      "sudo apt-get -y install build-essential",
      "sudo apt-get -y upgrade",
      "sudo apt-get -y install python3-pip python3-venv",
      'sudo pip3 --break-system-packages install "conan>2"',
    ];

    this.commandsString = cmdsStringNewLine(this.commands);
  }
}

export class Ec2UserdataSsh {
  readonly commands: string[];
  readonly commandsString: string;
  constructor(user: string) {
    const authorizedKeys = catTextFiles(AWS_EC2_USERDATA.SSH_PUBLIC_KEYS);
    console.log(
      getCurrentTimestamp(),
      "authorized_keys string length:",
      authorizedKeys.length,
    );
    const authorizedKeysB64 = encodeStringToBase64(authorizedKeys);
    console.log(
      getCurrentTimestamp(),
      "authorized_keys base64 length:",
      authorizedKeysB64.length,
    );

    this.commands = [
      "# Ec2UserdataSsh",
      `sudo mkdir --parents --verbose ~${user}/.ssh/`,
      `sudo touch ~${user}/.ssh/authorized_keys`,
      `echo '${authorizedKeysB64}' | base64 --decode | sudo tee -a ~${user}/.ssh/authorized_keys`,
      `sudo chmod 700 ~${user}/.ssh`,
      `sudo chmod 600 ~${user}/.ssh/*`,
      `sudo chown -R ${user} ~${user}/.ssh`,
    ];

    this.commandsString = cmdsStringNewLine(this.commands);
  }
}

export class Ec2UserdataDocker {
  readonly commands: string[];
  readonly commandsString: string;
  constructor(user: string) {
    const dockerDaemonJson = {
      "log-driver": "local",
      "log-opts": {
        "max-size": "10m",
      },
    };
    const dockerDaemonJsonB64 = encodeStringToBase64(
      JSON.stringify(dockerDaemonJson),
    );

    // Create the command to install Docker CE
    this.commands = [
      "# Ec2UserdataDocker",
      `export _WORK=${AWS_EC2_USERDATA_WORKING_DIR}`,
      "sudo mkdir --mode=700 --parents --verbose ${_WORK}",
      "export DOCKER_SCRIPT=${_WORK}/get-docker.sh && touch ${DOCKER_SCRIPT}",
      "export DOCKER_LOG=${_WORK}/get-docker.log && touch ${DOCKER_LOG}",
      "sudo mkdir --mode=700 --parents --verbose ${_WORK}",
      "sudo curl -fsSL https://get.docker.com -o ${DOCKER_SCRIPT}",
      "sudo sh ${DOCKER_SCRIPT} | tee ${DOCKER_LOG}",
      "sudo groupadd docker",
      `sudo usermod -aG docker ${user}`,
      `echo '${dockerDaemonJsonB64}' | base64 --decode | sudo tee -a /etc/docker/daemon.json`,
      "sudo systemctl stop docker.service docker.socket containerd.service",
      "sudo systemctl enable docker.service",
      "sudo systemctl enable containerd.service",
      "sudo systemctl start docker.service containerd.service",
    ];

    this.commandsString = cmdsStringNewLine(this.commands);
  }
}

