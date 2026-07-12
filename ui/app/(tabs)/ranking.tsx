import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useGlobalContext, PlayerData } from '@/auth/globalContext';
import { globalStyles, COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '@/constants/GlobalStyles';
import SkeletonBlock from '@/components/SkeletonBlock';

const MEDAL_COLOR: Record<number, string> = {
  1: '#FFD700',
  2: '#C0C0C0',
  3: '#CD7F32',
};

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    return (
      <View style={[styles.medalBadge, { backgroundColor: `${MEDAL_COLOR[rank]}22` }]}>
        <MaterialIcons name="emoji-events" size={20} color={MEDAL_COLOR[rank]} />
        <Text style={[styles.medalRank, { color: MEDAL_COLOR[rank] }]}>{rank}</Text>
      </View>
    );
  }
  return (
    <View style={styles.rankBadge}>
      <Text style={styles.rankNumber}>{rank}</Text>
    </View>
  );
}

export default function RankingScreen() {
  const {
    player,
    opponents,
    matches,
    userId,
    fetchPlayers,
    isLoading,
    localAvatarUrl,
    setSelectedOpponent,
  } = useGlobalContext();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    if (userId) await fetchPlayers(userId);
    setRefreshing(false);
  };

  // Collect IDs of every player who shared a match with the current user
  const friendIds = new Set<string>();
  matches.forEach(match => {
    const isInMatch = match.players.some(p => p.playerId === userId);
    if (isInMatch) match.players.forEach(p => friendIds.add(p.playerId));
  });

  const rankedPlayers: PlayerData[] = [
    ...(player ? [{ ...player, avatarUrl: localAvatarUrl ?? player.avatarUrl }] : []),
    ...opponents.filter(o => friendIds.has(o.id)),
  ].sort((a, b) => b.latestRating - a.latestRating);

  const showSkeleton = isLoading && rankedPlayers.length === 0;

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.backgroundDark} />
      <View style={globalStyles.headerContainer}>
        <Text style={globalStyles.headerTitle}>Padel Mates Ranking</Text>
      </View>

      {showSkeleton ? (
        <View style={styles.skeletonContainer}>
          {[1, 2, 3, 4, 5].map(i => (
            <SkeletonBlock key={i} height={76} borderRadius={BORDER_RADIUS.lg} style={{ marginBottom: SPACING.sm }} />
          ))}
        </View>
      ) : rankedPlayers.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="emoji-events" size={56} color={COLORS.borderDark} />
          <Text style={styles.emptyTitle}>No ranking yet</Text>
          <Text style={styles.emptySubtitle}>
            Play and approve matches to see how you rank against your friends
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
        >
          {rankedPlayers.map((p, index) => {
            const rank = index + 1;
            const isMe = p.id === userId;
            const winRate = p.stats && p.stats.totalGames > 0
              ? Math.round((p.stats.wins / p.stats.totalGames) * 100)
              : null;

            return (
              <TouchableOpacity
                key={p.id}
                style={[styles.row, isMe && styles.rowMe]}
                activeOpacity={isMe ? 1 : 0.7}
                onPress={isMe ? undefined : () => setSelectedOpponent(p)}
                disabled={isMe}
              >
                <RankBadge rank={rank} />

                <View style={styles.avatarWrapper}>
                  {p.avatarUrl ? (
                    <Image source={{ uri: p.avatarUrl }} style={styles.avatar} />
                  ) : (
                    <View style={styles.avatarFallback}>
                      <MaterialIcons name="person" size={22} color={COLORS.textLightGreen} />
                    </View>
                  )}
                </View>

                <View style={styles.info}>
                  <Text style={[styles.name, isMe && styles.nameMe]} numberOfLines={1}>
                    {isMe ? `${p.givenName} (You)` : `${p.givenName} ${p.familyName}`}
                  </Text>
                  <Text style={styles.record}>
                    {p.stats
                      ? `${p.stats.totalGames}M · ${p.stats.wins}W · ${p.stats.losses}L${winRate !== null ? ` · ${winRate}%` : ''}`
                      : 'No matches yet'}
                  </Text>
                </View>

                <View style={styles.ratingBlock}>
                  <Text style={[styles.rating, isMe && styles.ratingMe]}>
                    {p.latestRating}
                  </Text>
                  {p.trendValue !== null && p.trendValue !== undefined && p.trendValue !== 0 && (
                    <View style={styles.trend}>
                      <MaterialIcons
                        name={p.trendValue > 0 ? 'arrow-upward' : 'arrow-downward'}
                        size={11}
                        color={p.trendValue > 0 ? COLORS.primary : COLORS.red400}
                      />
                      <Text style={[styles.trendText, { color: p.trendValue > 0 ? COLORS.primary : COLORS.red400 }]}>
                        {Math.abs(p.trendValue)}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}

          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  skeletonContainer: {
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.textGray,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.borderDark,
    textAlign: 'center',
  },

  scrollContent: {
    padding: SPACING.md,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceDark,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  rowMe: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primaryShade}`,
  },

  medalBadge: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  medalRank: {
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 12,
  },
  rankBadge: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumber: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.textGray,
  },

  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryShade,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.textWhite,
  },
  nameMe: {
    color: COLORS.primary,
  },
  record: {
    fontSize: 11,
    color: COLORS.textGray,
    fontWeight: '500',
  },

  ratingBlock: {
    alignItems: 'flex-end',
    gap: 3,
  },
  rating: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: COLORS.textWhite,
    fontVariant: ['tabular-nums'],
  },
  ratingMe: {
    color: COLORS.primary,
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
