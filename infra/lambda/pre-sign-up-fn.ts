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

  const email = userAttributes.email;

  // For email/password sign-up: block if a Google account with this email already exists
  if (triggerSource === "PreSignUp_SignUp") {
    if (!email) return event;

    try {
      const { Users } = await client.send(
        new ListUsersCommand({
          UserPoolId: userPoolId,
          Filter: `email = "${email}"`,
          Limit: 10,
        })
      );

      const hasGoogleAccount = Users?.some((u) => u.UserStatus === "EXTERNAL_PROVIDER");
      if (hasGoogleAccount) {
        throw new Error("An account with this email already exists. Please sign in with Google.");
      }
    } catch (err) {
      console.error("Error in pre-sign-up trigger (SignUp):", err);
      throw err;
    }

    return event;
  }

  // For Google sign-up: link to existing email/password account if one exists
  if (triggerSource === "PreSignUp_ExternalProvider") {
    if (!email) {
      event.response.autoConfirmUser = true;
      event.response.autoVerifyEmail = true;
      return event;
    }

    try {
      const { Users } = await client.send(
        new ListUsersCommand({
          UserPoolId: userPoolId,
          Filter: `email = "${email}"`,
          Limit: 10,
        })
      );

      const existingUser = Users?.find((u) => u.UserStatus !== "EXTERNAL_PROVIDER");

      if (existingUser?.Username) {
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
      console.error("Error in pre-sign-up trigger (ExternalProvider):", err);
      throw err;
    }

    event.response.autoConfirmUser = true;
    event.response.autoVerifyEmail = true;
    return event;
  }

  return event;
};
