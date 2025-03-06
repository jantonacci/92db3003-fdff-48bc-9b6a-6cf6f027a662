#!/usr/bin/env node

import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export interface IEc2UbuntuProps {
  ec2InstanceType: ec2.InstanceType;
  ec2KeyPairArnPrefix: string;
  ec2KeyPairName: string;
  ec2MachineImage?: ec2.IMachineImage;
  ec2RoleArn: string;
  ec2UserData?: ec2.UserData;
  environment: string;
  stackNameCamel: string;
  stackNameClean: string;
  vpcId: string;
  vpcSecurityGroupName: string;
  vpcSubnetMap: IEc2SubnetRecord[];
}

export type IEc2InstanceConfig = cdk.StackProps & IEc2UbuntuProps;

export interface IEc2SubnetRecord {
  availabilityZone: string;
  subnetId: string;
  routeTableId?: string;
}

export interface IEc2InstanceRecord {
  instanceClass: ec2.InstanceClass;
  instanceSize: ec2.InstanceSize;
  imageString: string;
}
