import { GlobalStateProvider, useGlobalContext } from "@/auth/globalContext";
import PlayerStatsModal from "@/components/PlayerStatsModal";
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
