import React from 'react';
import { Modal, View, Text, ScrollView, StyleSheet, Pressable, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, globalStyles } from '@/constants/GlobalStyles';
import { PlayerData } from '@/auth/globalContext';
import RatingChart from './RatingChart';

type Props = {
  player: PlayerData | null;
  onClose: () => void;
};

function formatChartDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getInitials(givenName: string, familyName: string): string {
  return `${givenName[0] ?? ''}${familyName[0] ?? ''}`.toUpperCase();
}

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
    backgroundColor: COLORS.backgroundDark,
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

export default function PlayerStatsModal({ player, onClose }: Props) {
  if (!player) return null;

  const stats = player.stats;
  const totalGames = stats?.totalGames ?? 0;
  const wins = stats?.wins ?? 0;
  const losses = stats?.losses ?? 0;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
  const setsWon = stats?.setsWon ?? 0;
  const setsLost = stats?.setsLost ?? 0;
  const currentStreak = stats?.currentStreak ?? 0;
  const recentForm = stats?.recentForm ?? [];
  const ratingHistory = (stats?.ratingHistory ?? []).map(p => ({ date: formatChartDate(p.date), rating: p.rating }));

  const streakLabel = totalGames > 0 ? (currentStreak > 0 ? `${currentStreak}W` : `${Math.abs(currentStreak)}L`) : '—';
  const streakColor = currentStreak > 0 ? COLORS.primary : COLORS.red400;
  const streakSub = currentStreak > 0 ? 'win streak' : currentStreak < 0 ? 'loss streak' : 'no matches';

  const fullName = `${player.givenName} ${player.familyName}`;

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.avatarRing}>
              {player.avatarUrl ? (
                <Image source={{ uri: player.avatarUrl }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitials}>{getInitials(player.givenName, player.familyName)}</Text>
                </View>
              )}
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.playerName}>{fullName}</Text>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingValue}>{player.latestRating}</Text>
                {player.trendValue != null && player.trendValue !== 0 && (
                  <Text style={[styles.trendValue, { color: player.trendValue > 0 ? COLORS.primary : COLORS.red400 }]}>
                    {player.trendValue > 0 ? `+${player.trendValue}` : player.trendValue}
                  </Text>
                )}
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Icon name="close" size={20} color={COLORS.textGray} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll} contentContainerStyle={styles.scrollContent}>

            {/* Matches / Wins / Losses */}
            <View style={styles.heroMeta}>
              <View style={styles.metaItem}>
                <Text style={styles.metaValue}>{totalGames}</Text>
                <Text style={styles.metaLabel}>Matches</Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <Text style={[styles.metaValue, { color: COLORS.primary }]}>{wins}</Text>
                <Text style={styles.metaLabel}>Wins</Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <Text style={[styles.metaValue, { color: COLORS.red400 }]}>{losses}</Text>
                <Text style={styles.metaLabel}>Losses</Text>
              </View>
            </View>

            {/* Performance tiles */}
            <View style={styles.section}>
              <Text style={globalStyles.sectionTitle}>Performance</Text>
              <View style={styles.tileRow}>
                <StatTile
                  label="Win Rate"
                  value={`${winRate}%`}
                  sub={`${wins}W · ${losses}L`}
                  valueColor={winRate >= 50 ? COLORS.primary : COLORS.red400}
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
                  value={setsWon.toString()}
                  sub={`${setsLost} lost`}
                />
                <StatTile
                  label="Set Ratio"
                  value={setsLost > 0 ? (setsWon / setsLost).toFixed(2) : '—'}
                  sub="won per lost"
                  valueColor={setsWon > setsLost ? COLORS.primary : COLORS.red400}
                />
              </View>
            </View>

            {/* Recent form */}
            {recentForm.length > 0 && (
              <View style={styles.section}>
                <Text style={globalStyles.sectionTitle}>Recent Form</Text>
                <View style={styles.card}>
                  <View style={styles.formRow}>
                    {recentForm.map((result, i) => (
                      <View key={i} style={[styles.formBadge, result === 'W' ? styles.formWin : styles.formLoss]}>
                        <Text style={[styles.formBadgeText, result === 'W' ? styles.formWinText : styles.formLossText]}>
                          {result}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.formSub}>Last {recentForm.length} matches · oldest → newest</Text>
                </View>
              </View>
            )}

            {/* Rating chart */}
            {ratingHistory.length >= 2 && (
              <View style={styles.section}>
                <Text style={globalStyles.sectionTitle}>Rating Progression</Text>
                <View style={styles.card}>
                  <RatingChart data={ratingHistory} />
                </View>
              </View>
            )}

            {/* Best partner */}
            {stats?.bestPartner && (
              <View style={styles.section}>
                <Text style={globalStyles.sectionTitle}>Best Partnership</Text>
                <View style={styles.card}>
                  <View style={styles.insightRow}>
                    <View style={[styles.insightIcon, { backgroundColor: COLORS.primaryShade }]}>
                      <Icon name="people" size={20} color={COLORS.primary} />
                    </View>
                    <View style={styles.insightInfo}>
                      <Text style={styles.insightName}>{stats.bestPartner.name}</Text>
                      <Text style={styles.insightSub}>{stats.bestPartner.gamesPlayed} games together</Text>
                    </View>
                    <Text style={[styles.insightStat, { color: COLORS.primary }]}>{stats.bestPartner.winRate}%</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Toughest opponent */}
            {stats?.toughestOpponent && (
              <View style={styles.section}>
                <Text style={globalStyles.sectionTitle}>Toughest Opponent</Text>
                <View style={styles.card}>
                  <View style={styles.insightRow}>
                    <View style={[styles.insightIcon, { backgroundColor: COLORS.redShade }]}>
                      <Icon name="whatshot" size={20} color={COLORS.red400} />
                    </View>
                    <View style={styles.insightInfo}>
                      <Text style={styles.insightName}>{stats.toughestOpponent.name}</Text>
                      <Text style={styles.insightSub}>{stats.toughestOpponent.gamesAgainst} games faced</Text>
                    </View>
                    <Text style={[styles.insightStat, { color: COLORS.red400 }]}>{stats.toughestOpponent.theirWinRate}%</Text>
                  </View>
                </View>
              </View>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.surfaceDark,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: SPACING.md,
    maxHeight: '90%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.borderDark,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
    gap: SPACING.md,
  },
  avatarRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: COLORS.primary,
    overflow: 'hidden',
    backgroundColor: COLORS.borderDark,
  },
  avatarImage: { width: 56, height: 56 },
  avatarFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    color: COLORS.textGray,
  },
  headerInfo: { flex: 1 },
  playerName: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.textWhite },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginTop: 2 },
  ratingValue: { fontSize: FONT_SIZE.md, fontWeight: '800', color: COLORS.primary },
  trendValue: { fontSize: FONT_SIZE.sm, fontWeight: '600' },
  closeBtn: { padding: SPACING.xs },

  scroll: { flexGrow: 0 },
  scrollContent: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },

  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xl,
    backgroundColor: COLORS.backgroundDark,
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

  section: { marginTop: SPACING.lg, gap: SPACING.sm },
  tileRow: { flexDirection: 'row', gap: SPACING.sm },

  card: {
    backgroundColor: COLORS.backgroundDark,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    padding: SPACING.md,
  },

  formRow: { flexDirection: 'row', gap: SPACING.sm, justifyContent: 'center', marginBottom: SPACING.sm },
  formBadge: { width: 40, height: 40, borderRadius: BORDER_RADIUS.sm, alignItems: 'center', justifyContent: 'center' },
  formWin: { backgroundColor: COLORS.primaryShade },
  formLoss: { backgroundColor: COLORS.redShade },
  formBadgeText: { fontSize: 14, fontWeight: '800' },
  formWinText: { color: COLORS.primary },
  formLossText: { color: COLORS.red400 },
  formSub: { color: COLORS.textGray, fontSize: 11, textAlign: 'center' },

  insightRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  insightIcon: { width: 40, height: 40, borderRadius: BORDER_RADIUS.full, alignItems: 'center', justifyContent: 'center' },
  insightInfo: { flex: 1 },
  insightName: { color: COLORS.textWhite, fontSize: FONT_SIZE.sm, fontWeight: '700' },
  insightSub: { color: COLORS.textGray, fontSize: 11, marginTop: 2 },
  insightStat: { fontSize: FONT_SIZE.lg, fontWeight: '800' },
});
