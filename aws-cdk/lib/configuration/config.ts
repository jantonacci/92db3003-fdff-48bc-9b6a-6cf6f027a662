#!/usr/bin/env node

import * as ec2 from "aws-cdk-lib/aws-ec2";

import { IEc2InstanceConfig, IEc2UbuntuProps } from "../common/interfaces";
import {
  AWS_ACCOUNTS,
  AWS_CDK_STACK_BASENAME,
  AWS_EC2_INSTANCE,
  AWS_REGION,
} from "../common/constants";
import {
  camelCaseString,
  capitalizeFirstLetter,
  getEc2Role,
  getSecurityGroupName,
  getSubnetIds,
  sanitizeStrings,
  validateEnvironment,
  getEc2KeyPairName, generateRandomAlphanumericIdCrypto, getVpcId,
} from "../common/construct-utils";
import {StackProps} from "aws-cdk-lib";

export function getConfigUbuntu(
  environment: string,
  props: StackProps,
): IEc2InstanceConfig {
  const account = props.env?.account || AWS_ACCOUNTS.DEFAULT;

  if (!validateEnvironment(environment, account)) {
    // throw new Error(`AWS account ${account} is not set or the credentials are expired.`);
    console.log(`Warning: AWS account ${account} is unknown or the credentials are expired?`);
  }

  const region = props.env?.region || AWS_REGION;
  const stackName =
    props.stackName || `${AWS_CDK_STACK_BASENAME}-${generateRandomAlphanumericIdCrypto()}`;

  const customProps: IEc2UbuntuProps = {
    ec2InstanceType: ec2.InstanceType.of(
      AWS_EC2_INSTANCE.AMD64.instanceClass,
      AWS_EC2_INSTANCE.AMD64.instanceSize,
    ),
    ec2KeyPairArnPrefix: `arn:aws:ssm:${region}:${account}:parameter/ec2/keypair/`,
    ec2KeyPairName: getEc2KeyPairName(environment),
    ec2RoleArn: getEc2Role(environment),
    environment: environment,
    stackNameCamel:
      camelCaseString(stackName) + capitalizeFirstLetter(environment),
    stackNameClean: sanitizeStrings([stackName, environment]),
    vpcId: getVpcId(environment),
    vpcSecurityGroupName: getSecurityGroupName(environment),
    vpcSubnetMap: getSubnetIds(environment),
  };

  // Merge the objects using the spread syntax
  return { ...customProps, ...props };
}
