import { COLORS } from "@/constants/GlobalStyles";
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs
      labelStyle={{
        color: COLORS.textLight,
      }}
      tintColor={COLORS.primary}
    >
      <NativeTabs.Trigger name="player-stats">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'chart.line.uptrend.xyaxis', selected: 'chart.line.uptrend.xyaxis.circle.fill' }}
          md="trending_up"
        />
        <NativeTabs.Trigger.Label>My Stats</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="logmatch">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'tennisball', selected: 'tennisball.fill' }}
          md="sports_tennis"
        />
        <NativeTabs.Trigger.Label>Log Match</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="matches">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }}
          md="bar_chart"
        />
        <NativeTabs.Trigger.Label>Matches</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="ranking">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'trophy', selected: 'trophy.fill' }}
          md="emoji_events"
        />
        <NativeTabs.Trigger.Label>Ranking</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

    </NativeTabs>
  );
}
