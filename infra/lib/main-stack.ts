import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as cognito from "aws-cdk-lib/aws-cognito";
import { createLambda, createTable } from './utils';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

export class MainStack extends cdk.Stack {

  private userPool: cognito.UserPool;
  private playerTable: Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.createUserPool();
    this.createUserPoolClient();
    this.createDynamoDBTables();
    this.createLambdaFunctions();

    new cdk.CfnOutput(this, 'Region', {
      value: this.region,
      exportName: `${this.stackName}:Region`,
    });

  }
  createDynamoDBTables() {
    const playerTableName = `${this.stackName}-player`;
    this.playerTable = createTable(this, playerTableName, this.stackName);
  }

  createLambdaFunctions() {
    const onboardPlayerFn = createLambda(this, "onboard-player-fn", this.stackName, {
      environment: {
        PLAYER_TABLE_NAME: this.playerTable.tableName,
      },
    });
    this.playerTable.grantReadWriteData(onboardPlayerFn);
    this.userPool.addTrigger(cognito.UserPoolOperation.POST_CONFIRMATION, onboardPlayerFn);

  }

  createUserPool() {
    this.userPool = new cognito.UserPool(this, `${this.stackName}-user-pool`, {
      userPoolName: `${this.stackName}-user-pool`,
      email: cognito.UserPoolEmail.withCognito(),
      deletionProtection: this.stackName === 'prod',
      signInAliases: { email: true },
      mfa: cognito.Mfa.OFF,
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      selfSignUpEnabled: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      userVerification: {
        emailSubject: 'Padel Mate - Verify your email for our super awesome app!',
        emailBody: 'Thanks for signing up to Padel Mate! Please click the link below to verify your email. <br/> <br/> {##Verify Email##}',
        emailStyle: cognito.VerificationEmailStyle.LINK,
      },
      standardAttributes: {
        givenName: {
          mutable: true,
          required: true,
        },
        familyName: {
          mutable: true,
          required: true,
        },
      },
      passwordPolicy: {
        minLength: 6,
        requireLowercase: false,
        requireUppercase: false,
        requireDigits: false,
        requireSymbols: false,
      },
    });

    new cdk.CfnOutput(this, 'CognitoUserPoolId', {
      value: this.userPool.userPoolId,
      exportName: `${this.stackName}:CognitoUserPoolId`,
    });


  }

  private createUserPoolClient() {

    const appClient = this.userPool.addClient(`${this.stackName}-user-pool-client`, {
      userPoolClientName: `${this.stackName}-user-pool-client`,
      idTokenValidity: cdk.Duration.days(1),
      accessTokenValidity: cdk.Duration.days(1),
      generateSecret: false,
      authFlows: {
        userSrp: true,
        userPassword: true,
      },
    });

    this.userPool.addDomain(`${this.stackName}-user-pool-domain`, {
      cognitoDomain: {
        domainPrefix: `${this.stackName}-padel-mate`,
      },

    });
    new cdk.CfnOutput(this, 'CognitoAppClientId', {
      value: appClient.userPoolClientId,
      exportName: `${this.stackName}:CognitoAppClientId`,
    });

    const cognitoDomain = `https://${this.stackName}-padel-mate.auth.${this.region}.amazoncognito.com`;
    new cdk.CfnOutput(this, 'CognitoDomain', {
      value: cognitoDomain,
      exportName: `${this.stackName}:CognitoDomain`,
    });
  }
}
