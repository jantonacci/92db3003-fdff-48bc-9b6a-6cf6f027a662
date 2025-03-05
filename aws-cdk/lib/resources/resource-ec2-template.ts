#!/usr/bin/env node

import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";

import { IEc2InstanceConfig } from "../common/interfaces";
import { encodeStringToBase64 } from "../common/construct-utils";
import { getEc2UserDataUbuntu } from "./ec2-userdata/ec2-userdata";
import { CfnLaunchTemplate } from "aws-cdk-lib/aws-ec2/lib/ec2.generated";
import {CfnOutput, CfnTag} from "aws-cdk-lib";
import {AWS_CDK_STACK_TAGS} from "../common/constants";

export class ResourceEc2Template extends Construct {
  readonly ec2Template: ec2.CfnLaunchTemplate;

  constructor(scope: Construct, id: string, props: IEc2InstanceConfig) {
    super(scope, id);

    // Confirm an Ec2 Machine Image is provided
    if (!props.ec2MachineImage) {
      throw new Error("Ec2 Machine Image is not provided");
    }

    // Get the IAM role from the configuration
    const role = iam.Role.fromRoleArn(this, "Ec2Role", props.ec2RoleArn, {
      mutable: false,
    });

    // Get the EC2 key pair from the configuration
    const ec2KeyPair = ec2.KeyPair.fromKeyPairName(
      this,
      "Ec2KeyPair",
      props.ec2KeyPairName,
    );

    // Retrieve the subnet IDs from the configuration
    const subnets = props.vpcSubnetMap.map((subnetConfig) => {
      return ec2.Subnet.fromSubnetAttributes(this, subnetConfig.subnetId, {
        subnetId: subnetConfig.subnetId,
        availabilityZone: subnetConfig.availabilityZone,
        routeTableId: subnetConfig.routeTableId,
      });
    });

    // Retrieve the security group from the configuration
    const securityGroupName = props.vpcSecurityGroupName || "";
    const vpc = ec2.Vpc.fromLookup(this, "Vpc", { vpcId: props.vpcId });
    const securityGroup = ec2.SecurityGroup.fromLookupByName(
      this,
      "SecurityGroup",
      securityGroupName,
      vpc,
    );

    const networkInterface: CfnLaunchTemplate.NetworkInterfaceProperty = {
      subnetId: subnets[0].subnetId,
      deleteOnTermination: true,
      deviceIndex: 0,
      groups: [securityGroup.securityGroupId],
    };

    // Convert AWS_CDK_STACK_TAGS to tagSpecifications
    const tags: CfnTag[] = [];
    for (const [key, value] of Object.entries(AWS_CDK_STACK_TAGS)) {
      tags.push({key: key, value: value});
    }

    // Create a launch template from the instance
    this.ec2Template = new ec2.CfnLaunchTemplate(this, "cfnLaunchTemplate", {
      launchTemplateName: id,
      launchTemplateData: {
        iamInstanceProfile: { name: role.roleName },
        imageId: props.ec2MachineImage.getImage(this).imageId,
        instanceType: props.ec2InstanceType.toString(),
        keyName: ec2KeyPair.keyPairName,
        monitoring: { enabled: true },
        networkInterfaces: [networkInterface],
        userData: encodeStringToBase64(getEc2UserDataUbuntu().render()),
        tagSpecifications: [{
          resourceType: "instance",
          tags: tags,
        }],
      },
      versionDescription: id,
      tagSpecifications: [{
        resourceType: "launch-template",
        tags: tags,
      }],
    });

    new CfnOutput(this, "ec2LaunchTemplateAttrLaunchTemplateId", {
      value: this.ec2Template.attrLaunchTemplateId,
      description: "The ID of the EC2 Launch Template",
    });
    new CfnOutput(this, "ec2LaunchTemplateAttrLatestVersionNumber", {
      value: this.ec2Template.attrLatestVersionNumber,
      description: "The latest version number of the EC2 Launch Template",
    });
  }
}
