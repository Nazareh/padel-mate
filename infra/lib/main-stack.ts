import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as apigateway from "aws-cdk-lib/aws-apigateway"
import * as iam from "aws-cdk-lib/aws-iam";
import * as ssm from "aws-cdk-lib/aws-ssm";
import { createLambda, createTable } from './utils';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { HttpMethod } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

const MONGO_DB_NAME = 'my-rating-app';

// Registered redirect URI for the Expo / React Native app
const APP_CALLBACK_URL = 'padelmate://';

export class MainStack extends cdk.Stack {

  private userPool: cognito.UserPool;
  private playerTable: Table;
  private matchTable: Table;
  private getPlayersFn: NodejsFunction;
  private logMatchFn: NodejsFunction;
  private getMatchesFn: NodejsFunction;
  private patchMatchFn: NodejsFunction;
  private onboardPlayerFn: NodejsFunction;
  private preSignUpFn: NodejsFunction;
  private mongoUriParameter: ssm.StringParameter;


  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    cdk.Tags.of(this).add('StackName', this.stackName);

    this.createUserPool();
    const googleProvider = this.createGoogleIdentityProvider();
    this.createUserPoolClient(googleProvider);
    this.createDynamoDBTables();
    this.createSSMParameters();
    this.createLambdaFunctions();
    this.createApiGateway();

    new cdk.CfnOutput(this, 'Region', {
      value: this.region,
      exportName: `${this.stackName}:Region`,
    });

  }

  createSSMParameters() {
    const mongoUriParam = new ssm.StringParameter(this, `${this.stackName}-mongo-uri`, {
      parameterName: `/${this.stackName}/mongo-uri`,
      stringValue: 'mongoURI',
    });
    this.mongoUriParameter = mongoUriParam;

  }

  createDynamoDBTables() {
    this.playerTable = createTable(this, `${this.stackName}-player`, this.stackName);
    this.matchTable = createTable(this, `${this.stackName}-match`, this.stackName);

  }

  createLambdaFunctions() {
    // Pre Sign-Up trigger: links a Google sign-in to an existing email/password account
    this.preSignUpFn = createLambda(this, "pre-sign-up-fn", this.stackName, {});
    this.preSignUpFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["cognito-idp:ListUsers", "cognito-idp:AdminLinkProviderForUser"],
        // Avoid userPool.userPoolArn (Ref) here — it creates a circular dependency:
        // UserPool → Lambda (trigger) → IAM policy → UserPool (ARN ref).
        resources: [`arn:aws:cognito-idp:${this.region}:${this.account}:userpool/*`],
      })
    );
    this.userPool.addTrigger(cognito.UserPoolOperation.PRE_SIGN_UP, this.preSignUpFn);

    this.onboardPlayerFn = createLambda(this, "onboard-player-fn", this.stackName, {
      environment: {
        PLAYER_TABLE_NAME: this.playerTable.tableName,
        MONGO_DB_NAME: MONGO_DB_NAME,
        MONGO_URI_PARAM_NAME: this.mongoUriParameter.parameterName,
      },
    });

    this.mongoUriParameter.grantRead(this.onboardPlayerFn);
    this.playerTable.grantReadWriteData(this.onboardPlayerFn);
    this.userPool.addTrigger(cognito.UserPoolOperation.POST_CONFIRMATION, this.onboardPlayerFn);

    this.getPlayersFn = createLambda(this, "get-players-fn", this.stackName, {
      environment: {
        PLAYER_TABLE_NAME: this.playerTable.tableName,
        MONGO_DB_NAME: MONGO_DB_NAME,
        MONGO_URI_PARAM_NAME: this.mongoUriParameter.parameterName,
      },
    });

    this.mongoUriParameter.grantRead(this.getPlayersFn);
    this.playerTable.grantReadData(this.getPlayersFn);

    this.logMatchFn = createLambda(this, "log-match-fn", this.stackName, {
      environment: {
        PLAYER_TABLE_NAME: this.playerTable.tableName,
        MATCH_TABLE_NAME: this.matchTable.tableName,
        MONGO_DB_NAME: MONGO_DB_NAME,
        MONGO_URI_PARAM_NAME: this.mongoUriParameter.parameterName,
      },
    });
    this.mongoUriParameter.grantRead(this.logMatchFn);
    this.matchTable.grantWriteData(this.logMatchFn)
    this.playerTable.grantReadData(this.logMatchFn)

    this.getMatchesFn = createLambda(this, "get-matches-fn", this.stackName, {
      environment: {
        MATCH_TABLE_NAME: this.matchTable.tableName,
        MONGO_DB_NAME: MONGO_DB_NAME,
        MONGO_URI_PARAM_NAME: this.mongoUriParameter.parameterName,
      },
    });
    this.mongoUriParameter.grantRead(this.getMatchesFn);
    this.matchTable.grantReadData(this.getMatchesFn);

    this.patchMatchFn = createLambda(this, "patch-match-fn", this.stackName, {
      environment: {
        MATCH_TABLE_NAME: this.matchTable.tableName,
        PLAYER_TABLE_NAME: this.playerTable.tableName,
        MONGO_DB_NAME: MONGO_DB_NAME,
        MONGO_URI_PARAM_NAME: this.mongoUriParameter.parameterName,
      },
    });
    this.mongoUriParameter.grantRead(this.patchMatchFn);
    this.matchTable.grantReadWriteData(this.patchMatchFn);
    this.playerTable.grantReadWriteData(this.patchMatchFn);

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

  // Update the value in AWS Console before deploying Google Sign-In.
  // Prerequisites (create manually before deploying):
  // - SSM String: /{stackName}/google-client-id
  // - Secrets Manager: /{stackName}/google-client-secret (SSM SecureString not supported by Cognito)
  private createGoogleIdentityProvider(): cognito.UserPoolIdentityProviderGoogle {
    return new cognito.UserPoolIdentityProviderGoogle(
      this,
      `${this.stackName}-google-idp`,
      {
        userPool: this.userPool,
        clientId: ssm.StringParameter.valueForStringParameter(this, `/${this.stackName}/google-client-id`),
        clientSecretValue: cdk.SecretValue.secretsManager(`/${this.stackName}/google-client-secret`),
        scopes: ["email", "openid", "profile"],
        attributeMapping: {
          email: cognito.ProviderAttribute.GOOGLE_EMAIL,
          givenName: cognito.ProviderAttribute.GOOGLE_GIVEN_NAME,
          familyName: cognito.ProviderAttribute.GOOGLE_FAMILY_NAME,
        },
      }
    );
  }

  private createUserPoolClient(googleProvider: cognito.UserPoolIdentityProviderGoogle) {

    const appClient = this.userPool.addClient(`${this.stackName}-user-pool-client`, {
      userPoolClientName: `${this.stackName}-user-pool-client`,
      idTokenValidity: cdk.Duration.hours(1),
      accessTokenValidity: cdk.Duration.hours(1),
      refreshTokenValidity: cdk.Duration.days(60),
      generateSecret: false,
      authFlows: {
        userSrp: true,
        userPassword: true,
      },
      oAuth: {
        flows: { authorizationCodeGrant: true },
        scopes: [
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.PROFILE,
        ],
        callbackUrls: [APP_CALLBACK_URL],
        logoutUrls: [APP_CALLBACK_URL],
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO,
        cognito.UserPoolClientIdentityProvider.GOOGLE,
      ],
    });

    // Ensure Cognito creates the IDP before the client references it
    appClient.node.addDependency(googleProvider);

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

    matchResource.addMethod(
      HttpMethod.GET,
      new apigateway.LambdaIntegration(this.getMatchesFn, {}),
      cognitoAuthConfig
    )

    const matchByIdResource = matchResource.addResource("{matchId}");
    matchByIdResource.addMethod(
      HttpMethod.PATCH,
      new apigateway.LambdaIntegration(this.patchMatchFn, {}),
      cognitoAuthConfig
    );
  }
}
