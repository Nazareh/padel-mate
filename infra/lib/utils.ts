import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Table, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { Duration, RemovalPolicy } from "aws-cdk-lib";
import * as path from 'path';
import * as lambda from "aws-cdk-lib/aws-lambda";

export const createLambda = (construct: Construct, functionName: string, stackName: String, otherProps: any) =>
  new NodejsFunction(construct, `${stackName}-${functionName}`, {
    entry: path.join(__dirname, `../lambda/${functionName}.ts`),
    runtime: Runtime.NODEJS_24_X,
    handler: 'handler',
    functionName: `${stackName}-${functionName}`,
    bundling: {
      forceDockerBundling: false,
    },
    ...otherProps,
  });


export const createTable = (construct: Construct, tableName: string, stackName: string) => {
    return new Table(construct, tableName, {
        tableName: tableName,
        partitionKey: { name: "id", type: AttributeType.STRING },
        deletionProtection: stackName === "prod" ? true : false,
        removalPolicy: stackName === "prod" ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
    });
};