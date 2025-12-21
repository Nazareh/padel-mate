#!/opt/homebrew/opt/node/bin/node
import * as cdk from 'aws-cdk-lib/core';
import { MainStack } from '../lib/main-stack';

const app = new cdk.App();
const devEnv = { account: '311353783034', region: 'ap-southeast-2' }
const prodEnv = { account: '311353783034', region: 'ap-southeast-2' }


new MainStack(app, 'dev', { env: devEnv });
new MainStack(app, 'prod', { env: prodEnv });