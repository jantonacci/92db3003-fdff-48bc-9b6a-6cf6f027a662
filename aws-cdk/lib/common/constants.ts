#!/usr/bin/env node

import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as path from "path";
import { IEc2InstanceRecord, IEc2SubnetRecord } from "./interfaces";

export const AWS_CDK_STACK_BASENAME = "devops";
export const AWS_CDK_STACK_DESCRIPTION = "EC2 Instance for Ubuntu";
export const AWS_EC2_USERDATA_DIR = path.join(
  __dirname,
  "..",
  "resources",
  "ec2-userdata",
);
export const AWS_EC2_USERDATA_WORKING_DIR = "/tmp/cloud-init";
export const AWS_REGION = "us-west-2";
export const SHEBANG = "#!/usr/bin/bash -vx";

export enum AWS_CDK_STACK_NAMES {
  EC2_INSTANCE_UBUNTU = `${AWS_CDK_STACK_BASENAME}-ec2-instance-ubuntu`,
  EC2_TEMPLATE_UBUNTU = `${AWS_CDK_STACK_BASENAME}-ec2-template-ubuntu`,
}

export enum AWS_AZS {
  A = AWS_REGION + "a",
  B = AWS_REGION + "b",
  C = AWS_REGION + "c",
  D = AWS_REGION + "d",
}

export enum AWS_ENVS {
  DEFAULT = "default",
}

export const AWS_ACCOUNTS = {
  DEFAULT: "063297884722",
};

export enum AWS_EC2_VPC_NAMES {
  DEFAULT = "default",
}

export enum AWS_EC2_VPC_IDS {
  DEFAULT = "vpc-07fbc27241fb58412",
}

export enum AWS_EC2_SECURITY_GROUP_NAMES {
  DEFAULT = "default",
}

export const AWS_IAM_ROLE_ARNS = {
  DEFAULT: `arn:aws:iam::${AWS_ACCOUNTS.DEFAULT}:role/project-role`,
};

export enum AWS_SSM_PARAMETERS_AMI_ID {
  AMD64_NOBLE = "/aws/service/canonical/ubuntu/server/noble/stable/current/amd64/hvm/ebs-gp3/ami-id",
  ARM64_NOBLE = "/aws/service/canonical/ubuntu/server/noble/stable/current/arm64/hvm/ebs-gp3/ami-id",
  AMD64_JAMMY = "/aws/service/canonical/ubuntu/server/jammy/stable/current/amd64/hvm/ebs-gp2/ami-id",
  ARM64_JAMMY = "/aws/service/canonical/ubuntu/server/jammy/stable/current/arm64/hvm/ebs-gp2/ami-id",
}

export const AWS_EC2_KEYPAIRS: Record<string, string> = {
  DEFAULT: "project-keypair",
};

export const AWS_EC2_SUBNET_IDS: Record<string, IEc2SubnetRecord[]> = {
  DEFAULT: [{
    availabilityZone: AWS_AZS.A,
    subnetId: "subnet-006d9a40d6a1d955c", // project-subnet-private1-us-west-2a
    routeTableId: "rtb-044161e763ac59257",
  }],
};

export const AWS_CDK_STACK_TAGS: Record<string, string> = {
  product: "infrastructure",
  team: "devops",
  application: "project",
  backup: "yes",
};

export const AWS_EC2_INSTANCE: Record<string, IEc2InstanceRecord> = {
  AMD64: {
    instanceClass: ec2.InstanceClass.T3A,
    instanceSize: ec2.InstanceSize.NANO,
    imageString: AWS_SSM_PARAMETERS_AMI_ID.AMD64_NOBLE,
  },
  ARM64: {
    instanceClass: ec2.InstanceClass.T4G,
    instanceSize: ec2.InstanceSize.NANO,
    imageString: AWS_SSM_PARAMETERS_AMI_ID.ARM64_NOBLE,
  },
};

export const AWS_EC2_USERDATA = {
  SSH_PUBLIC_KEYS: path.join(AWS_EC2_USERDATA_DIR, "ssh-keys"),
  SHELL_SCRIPTS: path.join(AWS_EC2_USERDATA_DIR, "shell-scripts"),
};
