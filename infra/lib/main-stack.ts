import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as apigateway from "aws-cdk-lib/aws-apigateway"
import { createLambda, createTable } from './utils';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { HttpMethod } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class MainStack extends cdk.Stack {

  private userPool: cognito.UserPool;
  private playerTable: Table;
  private matchTable: Table;
  private getPlayersFn: NodejsFunction;
  private logMatchFn: NodejsFunction;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    cdk.Tags.of(this).add('StackName', this.stackName);

    this.createUserPool();
    this.createUserPoolClient();
    this.createDynamoDBTables();
    this.createLambdaFunctions();
    this.createApiGateway();

    new cdk.CfnOutput(this, 'Region', {
      value: this.region,
      exportName: `${this.stackName}:Region`,
    });

  }
  createDynamoDBTables() {
    this.playerTable = createTable(this, `${this.stackName}-player`, this.stackName);
    this.matchTable = createTable(this, `${this.stackName}-match`, this.stackName);
  }

  createLambdaFunctions() {
    const onboardPlayerFn = createLambda(this, "onboard-player-fn", this.stackName, {
      environment: {
        PLAYER_TABLE_NAME: this.playerTable.tableName,
      },
    });
    this.playerTable.grantReadWriteData(onboardPlayerFn);
    this.userPool.addTrigger(cognito.UserPoolOperation.POST_CONFIRMATION, onboardPlayerFn);

    this.getPlayersFn = createLambda(this, "get-players-fn", this.stackName, {
      environment: {
        PLAYER_TABLE_NAME: this.playerTable.tableName,
      },
    });
    this.playerTable.grantReadData(this.getPlayersFn);

    this.logMatchFn = createLambda(this, "log-match-fn", this.stackName, {
      environment: {
        PLAYER_TABLE_NAME: this.playerTable.tableName,
        MATCH_TABLE_NAME: this.matchTable.tableName
      },
    });

    this.matchTable.grantWriteData(this.logMatchFn)
    this.playerTable.grantReadData(this.logMatchFn)

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

  private createApiGateway() {

    const auth = new apigateway.CognitoUserPoolsAuthorizer(this, "authorizer", {
      cognitoUserPools: [this.userPool],
    });

    const cognitoAuthConfig = {
      authorizer: auth,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    };

    const api = new apigateway.RestApi(this, `${this.stackName}-my-padel-mate-api`, {
      restApiName: `${this.stackName}-My Padel Mate API`,
      description: "This API receives Padel match results",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const key = api.addApiKey(`${this.stackName}-ApiKey`, {
      apiKeyName: `${this.stackName}-ApiKey`,
    });

    const usagePlan = api.addUsagePlan(`${this.stackName}-UsagePlan`, {
      name: `${this.stackName}-Usage Plan`,
      throttle: {
        rateLimit: 100,
        burstLimit: 200,
      },
      quota: {
        limit: this.stackName === "prod" ? 3000 : 500,
        period: apigateway.Period.DAY,
      },
    });

    usagePlan.addApiKey(key);
    usagePlan.addApiStage({
      stage: api.deploymentStage,
    });

    const apiRoot = api.root.addResource("v1");

    const playerResource = apiRoot.addResource("players");
    playerResource.addMethod(
      HttpMethod.GET,
      new apigateway.LambdaIntegration(this.getPlayersFn, {}),
      cognitoAuthConfig
    )

    const playerIdResource = playerResource.addResource("{playerId}");
    playerIdResource.addMethod(
      HttpMethod.GET,
      new apigateway.LambdaIntegration(this.getPlayersFn, {}),
      cognitoAuthConfig
    );

    const matchResource = apiRoot.addResource("match")
    matchResource.addMethod(
      HttpMethod.POST,
      new apigateway.LambdaIntegration(this.logMatchFn, {}),
      cognitoAuthConfig
    )
  }
}
