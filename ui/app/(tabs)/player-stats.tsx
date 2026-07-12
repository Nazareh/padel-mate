import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Pressable, TouchableOpacity, Image, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '@/auth/globalContext';
import HeaderProfile from '@/components/HeaderProfile';
import LoadingOverlay from '@/components/LoadingOverlay';
import Notification from '@/components/Notification';
import RatingCircle from '@/components/RatingCircle';
import RatingChart from '@/components/RatingChart';
import { globalStyles, COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '@/constants/GlobalStyles';
import { MaterialIcons as Icon } from '@expo/vector-icons';

const AVATAR_OPTIONS = [
  'https://api.dicebear.com/9.x/adventurer/png?seed=Felix',
  'https://api.dicebear.com/9.x/adventurer/png?seed=Aneka',
  'https://api.dicebear.com/9.x/adventurer/png?seed=Adrian',
  'https://api.dicebear.com/9.x/adventurer/png?seed=Bella',
  'https://api.dicebear.com/9.x/adventurer/png?seed=Caleb',
  'https://api.dicebear.com/9.x/adventurer/png?seed=Daisy',
  'https://api.dicebear.com/9.x/adventurer/png?seed=Eden',
  'https://api.dicebear.com/9.x/adventurer/png?seed=Harley',
  'https://api.dicebear.com/9.x/adventurer/png?seed=Jude',
];

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

function getInitials(givenName?: string, familyName?: string) {
  return `${givenName?.[0] ?? ''}${familyName?.[0] ?? ''}`.toUpperCase();
}

function formatChartDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function PlayerStats() {
  const { player, error, isLoading, fetchPlayers, userId, setError, localAvatarUrl, updateLocalAvatar, opponents, setSelectedOpponent } = useGlobalContext();
  const stats = player?.stats;
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    if (userId) await fetchPlayers(userId);
    setRefreshing(false);
  };

  const totalGames = stats?.totalGames ?? 0;
  const wins = stats?.wins ?? 0;
  const losses = stats?.losses ?? 0;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
  const setsWon = stats?.setsWon ?? 0;
  const setsLost = stats?.setsLost ?? 0;
  const currentStreak = stats?.currentStreak ?? 0;
  const recentForm = stats?.recentForm ?? [];
  const ratingHistory = (stats?.ratingHistory ?? []).map(p => ({ date: formatChartDate(p.date), rating: p.rating }));

  const streakLabel = currentStreak > 0 ? `${currentStreak}W` : `${Math.abs(currentStreak)}L`;
  const streakColor = currentStreak > 0 ? COLORS.primary : COLORS.red400;
  const streakSub = currentStreak > 0 ? 'win streak' : 'loss streak';

  const openModal = () => {
    setPendingUrl(localAvatarUrl);
    setProfileModalVisible(true);
  };

  const saveAvatar = () => {
    updateLocalAvatar(pendingUrl);
    setProfileModalVisible(false);
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <LoadingOverlay visible={isLoading} />

      {/* Profile photo modal */}
      <Modal
        visible={profileModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <Pressable style={modal.backdrop} onPress={() => setProfileModalVisible(false)}>
          <Pressable style={modal.sheet} onPress={e => e.stopPropagation()}>
            {/* Handle bar */}
            <View style={modal.handle} />

            <Text style={modal.title}>Choose Avatar</Text>

            {/* Large preview */}
            <View style={modal.previewRing}>
              {pendingUrl ? (
                <Image source={{ uri: pendingUrl }} style={modal.previewImage} />
              ) : (
                <View style={modal.previewFallback}>
                  <Icon name="person" size={56} color={COLORS.textGray} />
                  <Text style={modal.previewInitials}>
                    {getInitials(player?.givenName, player?.familyName)}
                  </Text>
                </View>
              )}
            </View>

            {/* Avatar grid */}
            <Text style={modal.sectionLabel}>Pick one</Text>
            <FlatList
              data={AVATAR_OPTIONS}
              keyExtractor={item => item}
              numColumns={3}
              scrollEnabled={false}
              columnWrapperStyle={modal.gridRow}
              contentContainerStyle={modal.grid}
              renderItem={({ item }) => {
                const selected = pendingUrl === item;
                return (
                  <TouchableOpacity
                    style={[modal.avatarCell, selected && modal.avatarCellSelected]}
                    onPress={() => setPendingUrl(item)}
                    activeOpacity={0.75}
                  >
                    <Image source={{ uri: item }} style={modal.avatarImg} />
                    {selected && (
                      <View style={modal.checkOverlay}>
                        <Icon name="check-circle" size={24} color={COLORS.primary} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
            />

            <Text style={modal.hint}>Custom photo upload coming soon</Text>

            {/* Actions */}
            <View style={modal.actions}>
              <TouchableOpacity style={modal.cancelBtn} onPress={() => setProfileModalVisible(false)}>
                <Text style={modal.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={modal.saveBtn} onPress={saveAvatar}>
                <Text style={modal.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >

        <HeaderProfile
          givenName={player?.givenName ?? ''}
          avatarImageUrl={player?.avatarUrl ?? ''}
          fetchData={() => { userId && fetchPlayers(userId); }}
          onAvatarPress={openModal}
        />

        {/* Rating hero */}
        <View style={styles.hero}>
          <RatingCircle
            latestRating={player?.latestRating ?? 1500}
            trendValue={player?.trendValue}
          />
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
        </View>

        {/* Rating progression chart */}
        <View style={styles.section}>
          <Text style={globalStyles.sectionTitle}>Rating Progression</Text>
          <View style={styles.card}>
            {ratingHistory.length >= 2
              ? <RatingChart data={ratingHistory} />
              : <Text style={styles.emptyHint}>Play more matches to see your rating progression</Text>
            }
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
              value={totalGames > 0 ? streakLabel : '—'}
              sub={totalGames > 0 ? streakSub : 'no matches yet'}
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
        <View style={styles.section}>
          <Text style={globalStyles.sectionTitle}>Recent Form</Text>
          <View style={styles.card}>
            {recentForm.length > 0 ? (
              <>
                <View style={styles.formRow}>
                  {recentForm.map((result, i) => (
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
                <Text style={styles.formSub}>Last {recentForm.length} matches · oldest → newest</Text>
              </>
            ) : (
              <Text style={styles.emptyHint}>No matches played yet</Text>
            )}
          </View>
        </View>

        {/* Best partnership */}
        <View style={styles.section}>
          <Text style={globalStyles.sectionTitle}>Best Partnership</Text>
          <View style={styles.card}>
            {stats?.bestPartner ? (
              <TouchableOpacity
                style={styles.insightRow}
                activeOpacity={0.7}
                onPress={() => setSelectedOpponent(opponents.find(o => o.id === stats.bestPartner!.playerId) ?? null)}
              >
                <View style={[styles.insightIcon, { backgroundColor: COLORS.primaryShade }]}>
                  <Icon name="people" size={22} color={COLORS.primary} />
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
              </TouchableOpacity>
            ) : (
              <Text style={styles.emptyHint}>No partnership data yet</Text>
            )}
          </View>
        </View>

        {/* Toughest opponent */}
        <View style={styles.section}>
          <Text style={globalStyles.sectionTitle}>Toughest Opponent</Text>
          <View style={styles.card}>
            {stats?.toughestOpponent ? (
              <TouchableOpacity
                style={styles.insightRow}
                activeOpacity={0.7}
                onPress={() => setSelectedOpponent(opponents.find(o => o.id === stats.toughestOpponent!.playerId) ?? null)}
              >
                <View style={[styles.insightIcon, { backgroundColor: COLORS.redShade }]}>
                  <Icon name="whatshot" size={22} color={COLORS.red400} />
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
              </TouchableOpacity>
            ) : (
              <Text style={styles.emptyHint}>No opponent data yet</Text>
            )}
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

  emptyHint: { color: COLORS.textGray, fontSize: 13, textAlign: 'center', paddingVertical: SPACING.sm },
});

const modal = StyleSheet.create({
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
    paddingHorizontal: SPACING.lg,
    paddingBottom: 40,
    alignItems: 'center',
    gap: SPACING.md,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.borderDark,
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.textWhite,
  },
  previewRing: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 3,
    borderColor: COLORS.primary,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.borderDark,
    marginVertical: SPACING.xs,
  },
  previewImage: {
    width: 108,
    height: 108,
  },
  previewFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewInitials: {
    position: 'absolute',
    bottom: -14,
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textGray,
    letterSpacing: 1,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textGray,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    alignSelf: 'flex-start',
  },
  grid: {
    gap: SPACING.sm,
  },
  gridRow: {
    gap: SPACING.sm,
    justifyContent: 'center',
  },
  avatarCell: {
    width: 88,
    height: 88,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.backgroundDark,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarCellSelected: {
    borderColor: COLORS.primary,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  checkOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(17,33,23,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    fontSize: 11,
    color: COLORS.textGray,
    marginTop: -SPACING.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.borderDark,
  },
  cancelText: {
    color: COLORS.textWhite,
    fontSize: 15,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  saveText: {
    color: COLORS.primaryContent,
    fontSize: 15,
    fontWeight: '700',
  },
});
