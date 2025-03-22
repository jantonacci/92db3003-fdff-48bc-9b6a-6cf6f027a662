#!/usr/bin/env node

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

import { AWS_REGION } from '../common/constants'

export class StackVpcCfn extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC with default CIDR and subnets across all available AZs in us-west-2
    const vpc = new ec2.Vpc(this, 'DefaultVpc', {
      maxAzs: 4, // Default is all AZs in the region
      natGateways: 1, // Update as per your requirement
    });

    // Output the VPC ID
    new cdk.CfnOutput(this, 'VpcId', { value: vpc.vpcId });
  }
}
