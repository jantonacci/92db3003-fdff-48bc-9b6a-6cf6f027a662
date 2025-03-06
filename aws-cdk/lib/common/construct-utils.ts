#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import * as util from "node:util";
import {
  AWS_ACCOUNTS,
  AWS_EC2_KEYPAIRS,
  AWS_EC2_SECURITY_GROUP_NAMES,
  AWS_EC2_SUBNET_IDS, AWS_EC2_VPC_IDS,
  AWS_EC2_VPC_NAMES,
  AWS_ENVS,
  AWS_IAM_ROLE_ARNS,
  SHEBANG,
} from "./constants";
import { IEc2SubnetRecord } from "./interfaces";
import * as crypto from "crypto";

export function prettyJson(obj: object): string {
  return util.inspect(obj, { depth: null, colors: true });
}

export function prettyPrintJson(obj: object): void {
  console.log(prettyJson(obj));
}

export function cmdsStringCond(commands: string[]): string {
  // Returns the commands as a shell script string that fails on error condition (single line)
  return commands.join(" && ");
}

export function cmdsStringSeq(commands: string[]): string {
  // Returns the commands as a shell script string that runs sequentially (single line)
  return commands.join("; ");
}

export function cmdsStringNewLine(commands: string[]): string {
  // Returns the commands as a shell script string that runs sequentially (newline separated)
  return "\n" + commands.join("\n") + "\n";
}

export function cmdsStringScript(commands: string[]): string {
  // Returns the commands as a shell script string
  return SHEBANG + "\n" + cmdsStringNewLine(commands) + "\n";
}

export function readTextFile(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8").trim();
}

export function catTextFiles(filePath: string): string {
  return fs
    .readdirSync(filePath)
    .map((file: string) => readTextFile(`${filePath}/${file}`))
    .join("\n");
}

export function encodeFileToBase64(filePath: string): string {
  return Buffer.from(readTextFile(filePath)).toString("base64");
}

export function encodeStringToBase64(text: string): string {
  return Buffer.from(text).toString("base64");
}

export function writeTextFile(filePath: string, text: string): void {
  // Creates the filepath base directory, regardless if either exist.
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  // Writes the commands to the file
  fs.writeFileSync(filePath, text, { encoding: "utf-8" });
}

export function scriptTextImport(filePath: string): string[] {
  return readTextFile(filePath).split("\n");
}

export function sanitizeStrings(strs: string[]): string {
  return strs
    .join("-")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .toLowerCase();
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function camelCaseString(str: string, delimiter = "-"): string {
  const stringSplit = str.split(delimiter);
  Array.from(stringSplit).forEach((value, index) => {
    stringSplit[index] = capitalizeFirstLetter(value);
  });
  return stringSplit.join("");
}

export function getCurrentTimestamp(): string {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  return `[${hours}:${minutes}:${seconds}]`;
}

export function getCurrentTimestampMs(): string {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const milliseconds = now.getMilliseconds().toString().padStart(3, "0");
  return `[${hours}:${minutes}:${seconds}:${milliseconds}]`;
}

export function generateHashSha1(str: string): string {
  return crypto.createHash("SHA1").update(str).digest("hex");
}

export function generateHashSha1Short(str: string): string {
  return generateHashSha1(str).substring(0, 8);
}

export function generateSha1HashId(str: string): string {
  return generateHashSha1Short(str).toUpperCase();
}

function generateRandomStringCrypto(
  length: number,
  characters: string,
): string {
  let result = "";
  const charactersLength = characters.length;
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    result += characters.charAt(randomValues[i] % charactersLength);
  }

  return result;
}

export function generateAlphanumericStringCrypto(length: number): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return generateRandomStringCrypto(length, characters);
}

export function generateRandomAlphanumericIdCrypto(): string {
  return generateAlphanumericStringCrypto(8);
}

export function intToDoubleHex(num: number): string {
  return num.toString(16).padStart(2, "0").toUpperCase();
}

export function validateEnvironment(
  environment: string,
  account: string,
): boolean {
  switch (environment) {
    case AWS_ENVS.DEFAULT:
      return AWS_ACCOUNTS.DEFAULT === account;
    default:
      throw new Error(`Unsupported environment: ${environment}`);
  }
}

export function getVpcName(environment: string): string {
  switch (environment) {
    case AWS_ENVS.DEFAULT:
      return AWS_EC2_VPC_NAMES.DEFAULT;
    default:
      throw new Error(`Unsupported environment: ${environment}`);
  }
}

export function getVpcId(environment: string): string {
  switch (environment) {
    case AWS_ENVS.DEFAULT:
      return AWS_EC2_VPC_IDS.DEFAULT;
    default:
      throw new Error(`Unsupported environment: ${environment}`);
  }
}

export function getSecurityGroupName(environment: string): string {
  switch (environment) {
    case AWS_ENVS.DEFAULT:
      return AWS_EC2_SECURITY_GROUP_NAMES.DEFAULT;
    default:
      throw new Error(`Unsupported environment: ${environment}`);
  }
}

export function getSubnetIds(environment: string): IEc2SubnetRecord[] {
  switch (environment) {
    case AWS_ENVS.DEFAULT:
      return AWS_EC2_SUBNET_IDS.DEFAULT;
    default:
      throw new Error(`Unsupported environment: ${environment}`);
  }
}

export function getEc2Role(environment: string): string {
  switch (environment) {
    case AWS_ENVS.DEFAULT:
      return AWS_IAM_ROLE_ARNS.DEFAULT;
    default:
      throw new Error(`Unsupported environment: ${environment}`);
  }
}

export function getEc2KeyPairName(environment: string): string {
  switch (environment) {
    case AWS_ENVS.DEFAULT:
      return AWS_EC2_KEYPAIRS.DEFAULT;
    default:
      throw new Error(`Unsupported environment: ${environment}`);
  }
}
