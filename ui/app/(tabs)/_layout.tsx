import { useGlobalContext } from "@/auth/globalContext";
import { COLORS } from "@/constants/GlobalStyles";
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  const { logOut } = useGlobalContext();

  return (
    <NativeTabs
      labelStyle={{
        color: COLORS.textLight,
      }}
      tintColor={COLORS.primary}
    // barTintColor={COLORS.backgroundDark}
    >
      <NativeTabs.Trigger name="logmatch">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'tennisball', selected: 'tennisball.fill' }}
          md="sports_tennis"
        />
        <NativeTabs.Trigger.Label>Log Match</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="player-stats">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'chart.line.uptrend.xyaxis', selected: 'chart.line.uptrend.xyaxis.circle.fill' }}
          md="trending_up"
        />
        <NativeTabs.Trigger.Label>My Stats</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="matches">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }}
          md="bar_chart"
        />
        <NativeTabs.Trigger.Label>Matches</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'rectangle.portrait.and.arrow.right', selected: 'rectangle.portrait.and.arrow.right.fill' }}
          md="logout"
        />
        <NativeTabs.Trigger.Label>Logout</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

    </NativeTabs>
  );
}