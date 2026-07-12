import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

export const CONFIG = {
  cognitoRegion: extra.cognitoRegion as string,
  cognitoUserPoolId: extra.cognitoUserPoolId as string,
  cognitoClientId: extra.cognitoClientId as string,
  cognitoDomain: extra.cognitoDomain as string,
  apiBaseUrl: extra.apiBaseUrl as string,
};
