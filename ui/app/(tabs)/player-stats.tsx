import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useGlobalContext } from '@/auth/globalContext';
import HeaderProfile from '@/components/HeaderProfile';
import LoadingOverlay from '@/components/LoadingOverlay';
import Notification from '@/components/Notification';
import RatingCircle from '@/components/RatingCircle';
import RatingChart from '@/components/RatingChart';
import { globalStyles, COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '@/constants/GlobalStyles';
import { mockRatingHistory, mockPlayerStats } from '@/data/playerStatsMockData';

type StatTileProps = { label: string; value: string; sub?: string; valueColor?: string };

const StatTile = ({ label, value, sub, valueColor }: StatTileProps) => (
  <View style={tileStyles.tile}>
    <Text style={tileStyles.label}>{label}</Text>
    <Text style={[tileStyles.value, valueColor ? { color: valueColor } : null]}>{value}</Text>
    {sub ? <Text style={tileStyles.sub}>{sub}</Text> : null}
  </View>
);

const tileStyles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: COLORS.surfaceDark,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
    gap: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textGray,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  value: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.textWhite },
  sub: { fontSize: 11, color: COLORS.textGray, textAlign: 'center' },
});

export default function PlayerStats() {
  const { player, error, isLoading, fetchPlayers, userId, setError } = useGlobalContext();
  const stats = mockPlayerStats;

  const streakLabel = stats.currentStreak > 0
    ? `${stats.currentStreak}W`
    : `${Math.abs(stats.currentStreak)}L`;
  const streakColor = stats.currentStreak > 0 ? COLORS.primary : COLORS.red400;
  const streakSub = stats.currentStreak > 0 ? 'win streak' : 'loss streak';

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <LoadingOverlay visible={isLoading} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <HeaderProfile
          givenName={player?.givenName ?? ''}
          avatarImageUrl={player?.avatarUrl ?? ''}
          fetchData={() => { userId && fetchPlayers(userId); }}
        />

        {/* Rating hero */}
        <View style={styles.hero}>
          <RatingCircle
            latestRating={player?.latestRating ?? 1500}
            trendValue={player?.trendValue}
          />
          <View style={styles.heroMeta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>{stats.totalGames}</Text>
              <Text style={styles.metaLabel}>Matches</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={[styles.metaValue, { color: COLORS.primary }]}>{stats.wins}</Text>
              <Text style={styles.metaLabel}>Wins</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={[styles.metaValue, { color: COLORS.red400 }]}>{stats.losses}</Text>
              <Text style={styles.metaLabel}>Losses</Text>
            </View>
          </View>
        </View>

        {/* Rating progression chart */}
        <View style={styles.section}>
          <Text style={globalStyles.sectionTitle}>Rating Progression</Text>
          <View style={styles.card}>
            <RatingChart data={mockRatingHistory} />
          </View>
        </View>

        {/* Performance tiles */}
        <View style={styles.section}>
          <Text style={globalStyles.sectionTitle}>Performance</Text>
          <View style={styles.tileRow}>
            <StatTile
              label="Win Rate"
              value={`${stats.winRate}%`}
              sub={`${stats.wins}W · ${stats.losses}L`}
              valueColor={stats.winRate >= 50 ? COLORS.primary : COLORS.red400}
            />
            <StatTile
              label="Streak"
              value={streakLabel}
              sub={streakSub}
              valueColor={streakColor}
            />
          </View>
          <View style={[styles.tileRow, { marginTop: SPACING.sm }]}>
            <StatTile
              label="Sets Won"
              value={stats.setsWon.toString()}
              sub={`${stats.setsLost} lost`}
            />
            <StatTile
              label="Set Ratio"
              value={(stats.setsWon / stats.setsLost).toFixed(2)}
              sub="won per lost"
              valueColor={stats.setsWon > stats.setsLost ? COLORS.primary : COLORS.red400}
            />
          </View>
        </View>

        {/* Recent form */}
        <View style={styles.section}>
          <Text style={globalStyles.sectionTitle}>Recent Form</Text>
          <View style={styles.card}>
            <View style={styles.formRow}>
              {stats.recentForm.map((result, i) => (
                <View
                  key={i}
                  style={[styles.formBadge, result === 'W' ? styles.formWin : styles.formLoss]}
                >
                  <Text style={[styles.formBadgeText, result === 'W' ? styles.formWinText : styles.formLossText]}>
                    {result}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={styles.formSub}>Last {stats.recentForm.length} matches · oldest → newest</Text>
          </View>
        </View>

        {/* Best partnership */}
        <View style={styles.section}>
          <Text style={globalStyles.sectionTitle}>Best Partnership</Text>
          <View style={styles.card}>
            <View style={styles.insightRow}>
              <View style={[styles.insightIcon, { backgroundColor: COLORS.primaryShade }]}>
                <MaterialIcons name="people" size={22} color={COLORS.primary} />
              </View>
              <View style={styles.insightInfo}>
                <Text style={styles.insightName}>{stats.bestPartner.name}</Text>
                <Text style={styles.insightSub}>{stats.bestPartner.gamesPlayed} games together</Text>
              </View>
              <View style={styles.insightStat}>
                <Text style={[styles.insightStatValue, { color: COLORS.primary }]}>
                  {stats.bestPartner.winRate}%
                </Text>
                <Text style={styles.insightStatLabel}>win rate</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Toughest opponent */}
        <View style={styles.section}>
          <Text style={globalStyles.sectionTitle}>Toughest Opponent</Text>
          <View style={styles.card}>
            <View style={styles.insightRow}>
              <View style={[styles.insightIcon, { backgroundColor: COLORS.redShade }]}>
                <MaterialIcons name="whatshot" size={22} color={COLORS.red400} />
              </View>
              <View style={styles.insightInfo}>
                <Text style={styles.insightName}>{stats.toughestOpponent.name}</Text>
                <Text style={styles.insightSub}>{stats.toughestOpponent.gamesAgainst} games faced</Text>
              </View>
              <View style={styles.insightStat}>
                <Text style={[styles.insightStatValue, { color: COLORS.red400 }]}>
                  {stats.toughestOpponent.theirWinRate}%
                </Text>
                <Text style={styles.insightStatLabel}>their win rate</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {error && (
        <Notification
          title="Error"
          message={error}
          onClose={() => setError(null)}
          type="error"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: SPACING.md, paddingBottom: 40 },

  hero: { alignItems: 'center', marginTop: SPACING.sm, gap: SPACING.md },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
    backgroundColor: COLORS.surfaceDark,
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  metaItem: { alignItems: 'center', gap: 2 },
  metaValue: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: COLORS.textWhite },
  metaLabel: { fontSize: 10, color: COLORS.textGray, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5 },
  metaDivider: { width: 1, height: 28, backgroundColor: COLORS.borderDark },

  section: { marginTop: SPACING.xl, gap: SPACING.sm },

  card: {
    backgroundColor: COLORS.surfaceDark,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    padding: SPACING.md,
  },

  tileRow: { flexDirection: 'row', gap: SPACING.sm },

  formRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  formBadge: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formWin: { backgroundColor: COLORS.primaryShade },
  formLoss: { backgroundColor: COLORS.redShade },
  formBadgeText: { fontSize: 15, fontWeight: '800' },
  formWinText: { color: COLORS.primary },
  formLossText: { color: COLORS.red400 },
  formSub: { color: COLORS.textGray, fontSize: 11, textAlign: 'center' },

  insightRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightInfo: { flex: 1 },
  insightName: { color: COLORS.textWhite, fontSize: FONT_SIZE.md, fontWeight: '700' },
  insightSub: { color: COLORS.textGray, fontSize: 12, marginTop: 2 },
  insightStat: { alignItems: 'flex-end' },
  insightStatValue: { fontSize: FONT_SIZE.xl, fontWeight: '800' },
  insightStatLabel: { color: COLORS.textGray, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
});
