import { Tabs } from "expo-router";

import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "@/constants/GlobalStyles";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        headerStyle: {
          backgroundColor: COLORS.backgroundDark,
        },
        headerShadowVisible: false,
        headerTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.backgroundDark,
        },
      }}
    >

      <Tabs.Screen
        name="player-stats"
        options={{
          headerShown: false,
          title: "My Stats",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person-sharp" : "person-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Logout",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "log-out-sharp" : "log-out-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
