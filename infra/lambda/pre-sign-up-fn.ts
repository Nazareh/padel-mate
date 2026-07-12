import { PreSignUpTriggerEvent } from "aws-lambda";
import {
  AdminLinkProviderForUserCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({});

exports.handler = async (event: PreSignUpTriggerEvent): Promise<PreSignUpTriggerEvent> => {
  const {
    triggerSource,
    userPoolId,
    userName,
    request: { userAttributes },
  } = event;

  // Only intervene for federated (Google/social) sign-ups
  if (triggerSource !== "PreSignUp_ExternalProvider") {
    return event;
  }

  const email = userAttributes.email;
  if (!email) {
    event.response.autoConfirmUser = true;
    event.response.autoVerifyEmail = true;
    return event;
  }

  try {
    // Find a native (email/password) Cognito user with the same email
    const { Users } = await client.send(
      new ListUsersCommand({
        UserPoolId: userPoolId,
        Filter: `email = "${email}"`,
        Limit: 1,
      })
    );

    const existingUser = Users?.find((u) => u.UserStatus !== "EXTERNAL_PROVIDER");

    if (existingUser?.Username) {
      // userName format for external providers: "<ProviderName>_<ProviderUserId>"
      // e.g. "Google_115497447654935804671"
      const separatorIdx = userName.indexOf("_");
      const providerName = userName.substring(0, separatorIdx);
      const providerUserId = userName.substring(separatorIdx + 1);

      await client.send(
        new AdminLinkProviderForUserCommand({
          UserPoolId: userPoolId,
          DestinationUser: {
            ProviderName: "Cognito",
            ProviderAttributeName: "Username",
            ProviderAttributeValue: existingUser.Username,
          },
          SourceUser: {
            ProviderName: providerName,
            ProviderAttributeName: "Cognito_Subject",
            ProviderAttributeValue: providerUserId,
          },
        })
      );

      console.log(`Linked ${providerName} identity to existing user ${existingUser.Username}`);
    }
  } catch (err) {
    console.error("Error in pre-sign-up trigger:", err);
    throw err;
  }

  event.response.autoConfirmUser = true;
  event.response.autoVerifyEmail = true;
  return event;
};
