#!/usr/bin/env node

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

import { AWS_REGION } from '../common/constants'

export class StackVpcCfn extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const environment = scope.node.tryGetContext("env") || AWS_ENVS.DEFAULT;
    // Get the configuration
    const config = getConfigVpc(environment, props);

    const vpc = new ResourceVpcCfn(scope, 'Vpc', props: config)

    // Output the VPC ID
    new cdk.CfnOutput(this, 'VpcId', { value: vpc.vpcId });
  }
}
