import { GlobalStateProvider, useGlobalContext } from "@/auth/globalContext";
import awsConfig from "@/src/aws-exports";
import { Amplify } from "aws-amplify";
import { Stack } from "expo-router";

Amplify.configure(awsConfig);

export default function RootLayout() {
  return (
    <GlobalStateProvider>
      <RootContent />
    </GlobalStateProvider>
  );
}

function RootContent() {
  const authContext = useGlobalContext();

  // if (authContext.isLoading) return null;

  return (
    <Stack>
      <Stack.Protected guard={authContext.isAuthenticated}>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!authContext.isAuthenticated}>
        <Stack.Screen name='login' options={{ headerShown: false }} />
        <Stack.Screen name='sign-up' options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
