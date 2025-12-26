import { Amplify } from "aws-amplify";
import { Stack } from "expo-router";
import awsConfig from "@/src/aws-exports";
import { AuthContext, AuthProvider } from "@/auth/authContext";
import { useContext } from "react";
import { PlayerProvider } from "@/auth/playerContext";

Amplify.configure(awsConfig);

export default function RootLayout() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <RootContent />
      </PlayerProvider>
    </AuthProvider>
  );
}

function RootContent() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Stack>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name='login' options={{ headerShown: false }} />
        <Stack.Screen name='sign-up' options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
