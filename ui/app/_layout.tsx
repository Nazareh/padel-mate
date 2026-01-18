import { Amplify } from "aws-amplify";
import { Stack } from "expo-router";
import awsConfig from "@/src/aws-exports";
import { GlobalStateProvider, useGlobalContext } from "@/auth/globalContext";

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
