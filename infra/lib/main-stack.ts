import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as cognito from "aws-cdk-lib/aws-cognito";

export class MainStack extends cdk.Stack {

  private userPool: cognito.UserPool;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.createUserPool();
    this.createUserPoolClient();

  }

  private createUserPool() {
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
        emailBody: 'Thanks for signing up to Padel Mate! Please click the link below to verify your email.` <br/> <br/> {##Verify Email##}',
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

    this.userPool.addClient

  }

  private createUserPoolClient() {

    const appClient = this.userPool.addClient(`${this.stackName}-user-pool-client`, {
      userPoolClientName: `${this.stackName}-user-pool-client`,
      idTokenValidity: cdk.Duration.days(1),
      accessTokenValidity: cdk.Duration.days(1),
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
  }
}
