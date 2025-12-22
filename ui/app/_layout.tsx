import { Amplify } from "aws-amplify";
import { Stack } from "expo-router";
import awsConfig from "@/src/aws-exports";
import { Authenticator } from "@aws-amplify/ui-react-native";

const isLoggedIn = false;
Amplify.configure(awsConfig);

export default function RootLayout() {

  return (
    <Authenticator.Provider>
      <Stack>
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name='login' options={{ headerShown: false }} />
          <Stack.Screen name='sign-up' options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </Authenticator.Provider>);

}
