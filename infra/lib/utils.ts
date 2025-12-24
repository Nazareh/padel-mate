import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Table, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { RemovalPolicy } from "aws-cdk-lib";
import * as path from 'path';
import * as cdk from 'aws-cdk-lib/core';
import * as logs from 'aws-cdk-lib/aws-logs';

export const createLambda = (construct: Construct, functionName: string, stackName: string, otherProps: any) => {

  const logGroup = new logs.LogGroup(construct, `${stackName}-${functionName}-log-group`, {
    logGroupName: `/aws/lambda/${stackName}-${functionName}`,
    retention: stackName === "prod" ? RetentionDays.ONE_YEAR : RetentionDays.ONE_DAY,
    removalPolicy: RemovalPolicy.DESTROY,
  });

  const fn = new NodejsFunction(construct, `${stackName}-${functionName}`, {
    entry: path.join(__dirname, `../lambda/${functionName}.ts`),
    runtime: Runtime.NODEJS_24_X,
    handler: 'handler',
    functionName: `${stackName}-${functionName}`,
    logGroup: logGroup,
    bundling: {
      forceDockerBundling: false,
    },
    ...otherProps,
  })

  cdk.Tags.of(fn).add('service_type', "lambda-function");
  cdk.Tags.of(fn).add('function', `${stackName}-${functionName}`);

  return fn;
};


export const createTable = (construct: Construct, tableName: string, stackName: string) => {
  return new Table(construct, tableName, {
    tableName: tableName,
    partitionKey: { name: "id", type: AttributeType.STRING },
    deletionProtection: stackName === "prod" ? true : false,
    removalPolicy: stackName === "prod" ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
  });
};