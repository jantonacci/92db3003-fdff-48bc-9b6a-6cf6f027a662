#!/usr/bin/env node

import * as cdk from "aws-cdk-lib";

import { getEc2UserDataUbuntu } from "../resources/ec2-userdata/ec2-userdata";
import { ResourceEc2Instance } from "../resources/resource-ec2-instance";
import { getConfigUbuntu } from "../configuration/config";
import {
  generateSha1HashId,
  getCurrentTimestamp,
  prettyPrintJson,
  writeTextFile,
} from "../common/construct-utils";
import { AWS_EC2_INSTANCE, AWS_ENVS } from "../common/constants";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as path from "node:path";

export class StackEc2InstanceUbuntu extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const environment = scope.node.tryGetContext("env") || AWS_ENVS.DEFAULT;
    // Get the configuration
    const config = getConfigUbuntu(environment, props);

    // Set the EC2 Machine Image
    config.ec2MachineImage = ec2.MachineImage.genericLinux({
      [this.region]: cdk.aws_ssm.StringParameter.valueForStringParameter(
        this,
        AWS_EC2_INSTANCE.AMD64.imageString,
      ),
    });

    // Define the UserData configuration; see https://github.com/aws/aws-cdk/issues/9841
    config.ec2UserData = getEc2UserDataUbuntu();

    // Hash the UserData script and write it to a file for debugging
    const userDataRenderSha1Short = generateSha1HashId(
      config.ec2UserData.render(),
    );
    writeTextFile(
      path.join(
        __dirname,
        "..",
        "..",
        "cdk.out",
        `userdata-render-${userDataRenderSha1Short}.out`,
      ),
      config.ec2UserData.render(),
    );

    // Create an EC2 instance for image creation
    const ec2InstanceId = config.stackNameCamel + userDataRenderSha1Short;
    const ec2Instance = new ResourceEc2Instance(this, ec2InstanceId, config)
      .ec2Instance;
    new cdk.CfnOutput(this, "ec2InstanceImageId", {
      value: ec2Instance.instance.imageId || "",
    });
    new cdk.CfnOutput(this, "ec2InstanceId", { value: ec2Instance.instanceId });
    new cdk.CfnOutput(this, "ec2PrivateIp", {
      value: ec2Instance.instancePrivateIp,
    });
    new cdk.CfnOutput(this, "ec2PrivateDns", {
      value: ec2Instance.instancePrivateDnsName,
    });

    // Pretty print the stack config
    console.log(getCurrentTimestamp(), "Stack configuration:");
    prettyPrintJson(config);
  }
}
