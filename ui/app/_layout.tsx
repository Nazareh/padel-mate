import { Stack } from "expo-router";

const isLoggedIn = false;

export default function RootLayout() {

  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name='login' options={{ headerShown: false }} />
        <Stack.Screen name='sign-up' options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>);
}
