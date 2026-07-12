import { GlobalStateProvider, useGlobalContext } from "@/auth/globalContext";
import PlayerStatsModal from "@/components/PlayerStatsModal";
import { CONFIG } from "@/constants/config";
import { Amplify } from "aws-amplify";
import { Stack } from "expo-router";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: CONFIG.cognitoUserPoolId,
      userPoolClientId: CONFIG.cognitoClientId,
      loginWith: {
        oauth: {
          domain: CONFIG.cognitoDomain.replace("https://", ""),
          scopes: ["email", "openid", "profile"],
          redirectSignIn: ["padelmate://"],
          redirectSignOut: ["padelmate://"],
          responseType: "code",
        },
      },
    },
  },
});

export default function RootLayout() {
  return (
    <GlobalStateProvider>
      <RootContent />
    </GlobalStateProvider>
  );
}

function RootContent() {
  const { isAuthenticated, selectedOpponent, setSelectedOpponent } = useGlobalContext();

  return (
    <>
      <Stack>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name='login' options={{ headerShown: false }} />
          <Stack.Screen name='sign-up' options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
      <PlayerStatsModal
        player={selectedOpponent}
        onClose={() => setSelectedOpponent(null)}
      />
    </>
  );
}
