#!/usr/bin/env node

import { CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";

import { IEc2InstanceConfig } from "../common/interfaces";
import { AWS_EC2_SECURITY_GROUP_NAMES } from "../common/constants";

export class ResourceEc2Instance extends Construct {
  readonly ec2Instance: ec2.Instance;

  constructor(scope: Construct, id: string, props: IEc2InstanceConfig) {
    super(scope, id);

    // Confirm an Ec2 Machine Image is provided
    if (!props.ec2MachineImage) {
      throw new Error("Ec2 Machine Image is not provided");
    }

    // Get the EC2 key pair from the configuration
    const ec2KeyPair = ec2.KeyPair.fromKeyPairName(
      this,
      "Ec2KeyPair",
      props.ec2KeyPairName,
    );

    // Get the IAM role from the configuration
    const role = iam.Role.fromRoleArn(this, "Ec2Role", props.ec2RoleArn, {
      mutable: false,
    });

    // Retrieve the VPC ID from the configuration
    const vpc = ec2.Vpc.fromLookup(this, "Vpc", { vpcId: props.vpcId });

    // Retrieve the subnet IDs from the configuration
    const subnets = props.vpcSubnetMap.map((subnetConfig) => {
      return ec2.Subnet.fromSubnetAttributes(this, subnetConfig.subnetId, {
        subnetId: subnetConfig.subnetId,
        availabilityZone: subnetConfig.availabilityZone,
        routeTableId: subnetConfig.routeTableId,
      });
    });

    // Retrieve the security group from the configuration
    const securityGroupName =
      props.vpcSecurityGroupName || AWS_EC2_SECURITY_GROUP_NAMES.DEFAULT;
    const securityGroup = ec2.SecurityGroup.fromLookupByName(
      this,
      "SecurityGroup",
      securityGroupName,
      vpc,
    );

    // Create the EC2 instance
    this.ec2Instance = new ec2.Instance(this, id, {
      allowAllIpv6Outbound: true,
      allowAllOutbound: true,
      detailedMonitoring: true,
      instanceName: id,
      instanceType: props.ec2InstanceType,
      keyPair: ec2KeyPair,
      machineImage: props.ec2MachineImage,
      requireImdsv2: true,
      role: role,
      securityGroup: securityGroup,
      userData: props.ec2UserData,
      vpc: vpc,
      vpcSubnets: { subnets: subnets },
    });

    new CfnOutput(this, "Ec2InstanceId", {
      value: this.ec2Instance.instanceId,
      description: "The ID of the EC2 instance",
    });
    new CfnOutput(this, "Ec2InstancePrivateIp", {
      value: this.ec2Instance.instancePrivateIp,
      description: "The private IP of the EC2 instance",
    });
    new CfnOutput(this, "Ec2InstancePublicDnsName", {
      value: this.ec2Instance.instancePublicDnsName,
      description: "The public DNS Name of the EC2 instance",
    });
  }
}
