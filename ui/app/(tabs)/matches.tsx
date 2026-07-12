import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import LoadingOverlay from '@/components/LoadingOverlay';
import SkeletonBlock from '@/components/SkeletonBlock';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { globalStyles, COLORS } from '@/constants/GlobalStyles';
import { useGlobalContext, MatchData } from '@/auth/globalContext';

type PlayerInfo = { id: string; name: string; initials: string; avatarUrl?: string | null; rating?: number | null };
type DisplayMatch = {
  id: string;
  date: string;
  time: string;
  type: 'approval' | 'past';
  myActionRequired: boolean;
  status: 'Pending' | 'Victory' | 'Defeat' | 'Rejected';
  scores: { myTeam: number; opponents: number }[];
  myTeam: [PlayerInfo, PlayerInfo];
  opponents: [PlayerInfo, PlayerInfo];
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-AU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const PlayerAvatar = ({ player, isMe, reverse, onPress }: { player: PlayerInfo; isMe?: boolean; reverse?: boolean; onPress?: () => void }) => (
  <TouchableOpacity style={[styles.playerRow, reverse && { flexDirection: 'row-reverse' }]} onPress={onPress} activeOpacity={onPress ? 0.7 : 1} disabled={!onPress}>
    <View style={styles.avatarContainer}>
      {player.avatarUrl ? (
        <Image source={{ uri: player.avatarUrl }} style={styles.avatarImage} />
      ) : (
        <View style={styles.iconCircle}>
          <MaterialIcons name="person" size={18} color={COLORS.textLightGreen} />
        </View>
      )}
      {player.rating != null && (
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingBadgeText}>{player.rating}</Text>
        </View>
      )}
    </View>
    <Text
      style={[styles.playerName, { color: isMe ? COLORS.textWhite : COLORS.textGray }, reverse && { textAlign: 'right' }]}
      numberOfLines={1}
    >
      {player.name}
    </Text>
  </TouchableOpacity>
);

type MatchCardProps = {
  match: DisplayMatch;
  onApprove?: () => void;
  onReject?: () => void;
  onPlayerPress?: (playerId: string) => void;
};

const MatchCard = ({ match, onApprove, onReject, onPlayerPress }: MatchCardProps) => {
  const badgeLabel = match.myActionRequired ? 'Action Required' : match.status;

  const badgeContainerStyle = match.myActionRequired
    ? [globalStyles.badge, globalStyles.badgeActionRequired]
    : match.status === 'Victory'
      ? [globalStyles.badge, globalStyles.badgeVictory]
      : match.status === 'Defeat'
        ? [globalStyles.badge, globalStyles.badgeDefeat]
        : match.status === 'Rejected'
          ? [globalStyles.badge, styles.badgeRejected]
          : [globalStyles.badge, globalStyles.badgePending];

  const badgeTextStyle = match.myActionRequired
    ? [globalStyles.badgeText, globalStyles.badgeActionRequiredText]
    : match.status === 'Victory'
      ? [globalStyles.badgeText, globalStyles.badgeVictoryText]
      : match.status === 'Defeat'
        ? [globalStyles.badgeText, globalStyles.badgeDefeatText]
        : match.status === 'Rejected'
          ? [globalStyles.badgeText, styles.badgeRejectedText]
          : [globalStyles.badgeText, globalStyles.badgePendingText];

  return (
    <View style={[styles.card, { backgroundColor: COLORS.surfaceDark, borderColor: COLORS.borderDark }]}>
      <View style={[styles.cardHeader, { borderBottomColor: 'rgba(255,255,255,0.05)' }]}>
        <View style={styles.dateRow}>
          <MaterialIcons name="calendar-today" size={14} color={COLORS.textGray} />
          <Text style={[styles.dateText, { color: COLORS.textGray }]}>{match.date}, {match.time}</Text>
        </View>
        <View style={badgeContainerStyle}>
          <Text style={badgeTextStyle}>
            {badgeLabel}
          </Text>
        </View>
      </View>

      <View style={styles.matchGrid}>
        <View style={styles.teamColumn}>
          <PlayerAvatar player={match.myTeam[0]} isMe />
          <PlayerAvatar player={match.myTeam[1]} onPress={onPlayerPress ? () => onPlayerPress(match.myTeam[1].id) : undefined} />
        </View>

        <View style={styles.scoreColumn}>
          {match.scores.map((s, i) => (
            <Text key={i} style={[styles.scoreText, { color: COLORS.textWhite }]}>
              {`${s.myTeam} - ${s.opponents}`}
            </Text>
          ))}
        </View>

        <View style={[styles.teamColumn, { alignItems: 'flex-end' }]}>
          {match.opponents.map((p, i) => (
            <PlayerAvatar key={i} player={p} reverse onPress={onPlayerPress ? () => onPlayerPress(p.id) : undefined} />
          ))}
        </View>
      </View>

      {match.myActionRequired && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: COLORS.borderDark }]}
            onPress={onReject}
          >
            <Text style={[styles.actionBtnText, { color: COLORS.textWhite }]}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.approveBtn]}
            onPress={onApprove}
          >
            <Text style={[styles.actionBtnText, { color: COLORS.primaryContent }]}>Approve</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default function PadelMatchesScreen() {
  const { matches, fetchMatches, approveOrRejectMatch, userId, player, opponents, isLoading, localAvatarUrl, setSelectedOpponent } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const [actioningMatchId, setActioningMatchId] = useState<string | null>(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  };

  const handleMatchAction = async (matchId: string, action: 'APPROVE' | 'REJECT') => {
    setActioningMatchId(matchId);
    try {
      await approveOrRejectMatch(matchId, action);
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setActioningMatchId(null);
    }
  };

  const allPlayers = [...(player ? [player] : []), ...opponents];

  function playerInfo(playerId: string): PlayerInfo {
    const found = allPlayers.find(p => p.id === playerId);
    if (!found) return { id: playerId, name: 'Unknown', initials: '?' };
    const fullName = `${found.givenName} ${found.familyName}`;
    const avatarUrl = playerId === userId ? (localAvatarUrl ?? found.avatarUrl) : found.avatarUrl;
    return { id: playerId, name: fullName, initials: getInitials(fullName), avatarUrl, rating: found.latestRating };
  }

  const handlePlayerPress = (playerId: string) => {
    if (playerId === userId) return;
    const found = opponents.find(o => o.id === playerId);
    if (found) setSelectedOpponent(found);
  };

  function toDisplayMatch(match: MatchData): DisplayMatch | null {
    const myPlayer = match.players.find(p => p.playerId === userId);
    if (!myPlayer) return null;

    const myTeamId = myPlayer.team;
    const oppTeamId = myTeamId === 'TEAM_1' ? 'TEAM_2' : 'TEAM_1';

    const myTeamPlayers = match.players.filter(p => p.team === myTeamId);
    const oppPlayers = match.players.filter(p => p.team === oppTeamId);

    const meFirst = [
      ...myTeamPlayers.filter(p => p.playerId === userId),
      ...myTeamPlayers.filter(p => p.playerId !== userId),
    ];

    const scores = match.scores.map(s => ({
      myTeam: myTeamId === 'TEAM_1' ? s.team1 : s.team2,
      opponents: myTeamId === 'TEAM_1' ? s.team2 : s.team1,
    }));

    const mySets = scores.filter(s => s.myTeam > s.opponents).length;
    const oppSets = scores.filter(s => s.opponents > s.myTeam).length;

    const isPendingMatch = match.status === 'PENDING';
    const isRejected = match.status === 'REJECTED';
    const myActionRequired = isPendingMatch && myPlayer.matchStatus === 'PENDING';
    const status = isPendingMatch
      ? 'Pending'
      : isRejected
        ? 'Rejected'
        : mySets > oppSets
          ? 'Victory'
          : 'Defeat';

    return {
      id: match.id,
      date: formatDate(match.startTime),
      time: formatTime(match.startTime),
      type: isPendingMatch ? 'approval' : 'past' as 'approval' | 'past',
      myActionRequired,
      status,
      scores,
      myTeam: [playerInfo(meFirst[0]?.playerId), playerInfo(meFirst[1]?.playerId)] as [PlayerInfo, PlayerInfo],
      opponents: [playerInfo(oppPlayers[0]?.playerId), playerInfo(oppPlayers[1]?.playerId)] as [PlayerInfo, PlayerInfo],
    };
  }

  const sortedMatches = [...matches].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  const displayMatches = sortedMatches.map(toDisplayMatch).filter((m): m is DisplayMatch => m !== null);
  const pendingMatches = displayMatches.filter(m => m.type === 'approval');
  const pastMatches = displayMatches.filter(m => m.type === 'past');

  return (
    <View style={[styles.container, { backgroundColor: COLORS.backgroundDark }]}>
      <LoadingOverlay visible={actioningMatchId !== null} />
      <StatusBar barStyle="light-content" backgroundColor={COLORS.backgroundDark} />
      <SafeAreaView style={globalStyles.safeArea}>
        <View style={globalStyles.headerContainer}>
          <Text style={globalStyles.headerTitle}>Matches</Text>
        </View>
      </SafeAreaView>

      {isLoading ? (
        <View style={styles.skeletonContainer}>
          {[1, 2, 3].map(i => (
            <View key={i} style={styles.skeletonCard}>
              <SkeletonBlock height={14} width="40%" style={{ marginBottom: 12 }} />
              <SkeletonBlock height={48} />
            </View>
          ))}
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
        >
          {pendingMatches.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={globalStyles.sectionTitle}>Pending Approvals</Text>
              </View>
              <View style={styles.cardContainer}>
                {pendingMatches.map(m => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    onApprove={() => handleMatchAction(m.id, 'APPROVE')}
                    onReject={() => handleMatchAction(m.id, 'REJECT')}
                    onPlayerPress={handlePlayerPress}
                  />
                ))}
              </View>
              <View style={[styles.divider, { backgroundColor: COLORS.borderDark }]} />
            </>
          )}

          <View style={styles.sectionHeader}>
            <Text style={globalStyles.sectionTitle}>Past Games</Text>
          </View>
          <View style={styles.cardContainer}>
            {pastMatches.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="sports-tennis" size={48} color={COLORS.borderDark} />
                <Text style={styles.emptyTitle}>No games yet</Text>
                <Text style={styles.emptySubtitle}>Log your first match and get your opponents to approve it</Text>
              </View>
            ) : (
              pastMatches.map(m => <MatchCard key={m.id} match={m} onPlayerPress={handlePlayerPress} />)
            )}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: { fontSize: 14, paddingHorizontal: 4 },
  cardContainer: { paddingHorizontal: 16, gap: 16 },
  divider: { height: 1, marginHorizontal: 16, marginVertical: 24 },
  card: {
    borderRadius: 32,
    padding: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateText: { fontSize: 12, fontWeight: '600' },
  matchGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamColumn: { width: '35%', gap: 12 },
  scoreColumn: { width: '30%', alignItems: 'center', justifyContent: 'center' },
  scoreText: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
    lineHeight: 24,
  },
  playerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatarContainer: { width: 32, height: 32 },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryShade,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  playerName: { fontSize: 12, fontWeight: '600', flex: 1 },
  ratingBadge: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 3,
    borderRadius: 10,
    backgroundColor: '#1a2c22',
    borderColor: '#112218',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingBadgeText: { color: COLORS.primary, fontSize: 8, fontWeight: '700' },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  actionBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveBtn: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  actionBtnText: { fontSize: 14, fontWeight: '700' },

  badgeRejected: { backgroundColor: 'rgba(120,60,60,0.3)', borderColor: COLORS.red400 },
  badgeRejectedText: { color: COLORS.red400 },

  skeletonContainer: { padding: 16, gap: 16, marginTop: 16 },
  skeletonCard: {
    backgroundColor: COLORS.surfaceDark,
    borderRadius: 32,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    gap: 8,
  },

  emptyState: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textGray },
  emptySubtitle: { fontSize: 13, color: COLORS.borderDark, textAlign: 'center', paddingHorizontal: 24 },
});
