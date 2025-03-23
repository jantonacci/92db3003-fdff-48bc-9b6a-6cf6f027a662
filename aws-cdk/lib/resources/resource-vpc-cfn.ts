#!/usr/bin/env node

import { CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";

import { IEc2InstanceConfig } from "../common/interfaces";
import { AWS_EC2_SECURITY_GROUP_NAMES } from "../common/constants";

export class ResourceVpcCfn extends Construct {
  readonly vpc: ec2.Vpc;
  readonly subnets: ec2.Subnet[];
  readonly securityGroup: ec2.securityGroup;

  constructor(scope: Construct, id: string, props: IEc2InstanceConfig) {
    super(scope, id);

    // Retrieve the VPC ID from the configuration
    this.vpc = new ec2.Vpc(this, "Vpc", { vpcName: props.vpcName });

    // Retrieve the subnet IDs from the configuration
    this.subnets = props.vpcSubnetMap.map((subnetConfig) => {
      return ec2.Subnet.fromSubnetAttributes(this, subnetConfig.subnetId, {
        subnetId: subnetConfig.subnetId,
        availabilityZone: subnetConfig.availabilityZone,
        routeTableId: subnetConfig.routeTableId,
      });
    });

    // Retrieve the security group from the configuration
    const securityGroupName =
      props.vpcSecurityGroupName || AWS_EC2_SECURITY_GROUP_NAMES.DEFAULT;
    this.securityGroup = ec2.SecurityGroup.fromLookupByName(
      this,
      "SecurityGroup",
      securityGroupName,
      vpc,
    );

    new CfnOutput(this, "vpcId", {
      value: this.vpc.vpcId,
      description: "The ID of the Vpc",
    });
    new CfnOutput(this, "vpcSubnets", {
      value: JSON.stringify(subnets, null, 2),
      description: "The VPC subnets",
    });
    new CfnOutput(this, "vpcSecurityGroupName", {
      value: this.securityGroup.securityGroupId,
      description: "The default securityGroup ID",
    });
  }
}
