#!/usr/bin/env node

import * as cdk from "aws-cdk-lib";

import { StackEc2InstanceUbuntu } from "../lib/stacks/stack-ec2-instance-ubuntu";
import { StackEc2TemplateUbuntu } from "../lib/stacks/stack-ec2-template-ubuntu";
import {
  AWS_CDK_STACK_DESCRIPTION,
  AWS_CDK_STACK_TAGS,
  AWS_REGION,
  AWS_CDK_STACK_NAMES,
} from "../lib/common/constants";

const app = new cdk.App();

new StackEc2InstanceUbuntu(app, AWS_CDK_STACK_NAMES.EC2_INSTANCE_UBUNTU, {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT || "",
    region: process.env.CDK_DEFAULT_REGION || AWS_REGION,
  },
  description: AWS_CDK_STACK_DESCRIPTION,
  stackName: AWS_CDK_STACK_NAMES.EC2_INSTANCE_UBUNTU,
  tags: AWS_CDK_STACK_TAGS,
});

new StackEc2TemplateUbuntu(app, AWS_CDK_STACK_NAMES.EC2_TEMPLATE_UBUNTU, {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT || "",
    region: process.env.CDK_DEFAULT_REGION || AWS_REGION,
  },
  description: AWS_CDK_STACK_DESCRIPTION,
  stackName: AWS_CDK_STACK_NAMES.EC2_TEMPLATE_UBUNTU,
  tags: AWS_CDK_STACK_TAGS,
});
