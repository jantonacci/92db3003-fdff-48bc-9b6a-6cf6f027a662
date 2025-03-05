#!/usr/bin/env node

import * as ec2 from "aws-cdk-lib/aws-ec2";
import { SHEBANG } from "../../common/constants";
import {
  Ec2UserdataCfnSymlinks,
  Ec2UserdataDocker,
  Ec2UserdataPkgUbuntu,
  Ec2UserdataSsh,
} from "./ec2-userdata-scripts";

export function getEc2UserDataUbuntu(userName: string = "ubuntu"): ec2.UserData {
  // Define the UserData configuration; see https://github.com/aws/aws-cdk/issues/9841
  const userData = ec2.UserData.forLinux({ shebang: SHEBANG });
  // Add commands to the UserData script
  userData.addCommands(
    new Ec2UserdataCfnSymlinks().commandsString,
    new Ec2UserdataSsh(userName).commandsString,
    new Ec2UserdataDocker(userName).commandsString,
    new Ec2UserdataPkgUbuntu().commandsString,
  );
  // userData.addOnExitCommands("sudo shutdown -h now");

  return userData;
}
