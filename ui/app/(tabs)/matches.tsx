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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { globalStyles, COLORS } from '@/constants/GlobalStyles';
import { useGlobalContext, MatchData } from '@/auth/globalContext';

type PlayerInfo = { name: string; initials: string };
type DisplayMatch = {
  id: string;
  date: string;
  time: string;
  type: 'approval' | 'past';
  myActionRequired: boolean;
  status: 'Pending' | 'Victory' | 'Defeat';
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

const PlayerAvatar = ({ player, isMe }: { player: PlayerInfo; isMe?: boolean }) => (
  <View style={styles.playerRow}>
    <View style={[styles.avatar, styles.initialsAvatar, isMe ? styles.meAvatar : styles.otherAvatar]}>
      <Text style={[styles.initialsText, isMe ? { color: COLORS.primaryContent } : { color: COLORS.textWhite }]}>
        {player.initials}
      </Text>
    </View>
    <Text style={[styles.playerName, { color: isMe ? COLORS.textWhite : COLORS.textGray }]} numberOfLines={1}>
      {player.name}
    </Text>
  </View>
);

type MatchCardProps = {
  match: DisplayMatch;
  onApprove?: () => void;
  onReject?: () => void;
  isActioning?: boolean;
};

const MatchCard = ({ match, onApprove, onReject, isActioning }: MatchCardProps) => {
  const badgeLabel = match.myActionRequired ? 'Action Required' : match.status;

  const badgeContainerStyle = match.myActionRequired
    ? [globalStyles.badge, globalStyles.badgeActionRequired]
    : match.status === 'Victory'
      ? [globalStyles.badge, globalStyles.badgeVictory]
      : match.status === 'Defeat'
        ? [globalStyles.badge, globalStyles.badgeDefeat]
        : [globalStyles.badge, globalStyles.badgePending];

  const badgeTextStyle = match.myActionRequired
    ? [globalStyles.badgeText, globalStyles.badgeActionRequiredText]
    : match.status === 'Victory'
      ? [globalStyles.badgeText, globalStyles.badgeVictoryText]
      : match.status === 'Defeat'
        ? [globalStyles.badgeText, globalStyles.badgeDefeatText]
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
          <PlayerAvatar player={match.myTeam[1]} />
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
            <View key={i} style={[styles.playerRow, { flexDirection: 'row-reverse' }]}>
              <View style={[styles.avatar, styles.initialsAvatar, styles.otherAvatar]}>
                <Text style={[styles.initialsText, { color: COLORS.textWhite }]}>{p.initials}</Text>
              </View>
              <Text style={[styles.playerName, { color: COLORS.textGray, textAlign: 'right' }]} numberOfLines={1}>
                {p.name}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {match.myActionRequired && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: COLORS.borderDark }, isActioning && styles.actionBtnDisabled]}
            onPress={onReject}
            disabled={isActioning}
          >
            {isActioning ? (
              <ActivityIndicator size="small" color={COLORS.textWhite} />
            ) : (
              <Text style={[styles.actionBtnText, { color: COLORS.textWhite }]}>Reject</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.approveBtn, isActioning && styles.actionBtnDisabled]}
            onPress={onApprove}
            disabled={isActioning}
          >
            {isActioning ? (
              <ActivityIndicator size="small" color={COLORS.primaryContent} />
            ) : (
              <Text style={[styles.actionBtnText, { color: COLORS.primaryContent }]}>Approve</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default function PadelMatchesScreen() {
  const { matches, fetchMatches, approveOrRejectMatch, userId, player, opponents, isLoading } = useGlobalContext();
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
      await onRefresh();
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setActioningMatchId(null);
    }
  };

  const allPlayers = [...(player ? [player] : []), ...opponents];

  function playerInfo(playerId: string): PlayerInfo {
    const found = allPlayers.find(p => p.id === playerId);
    if (!found) return { name: 'Unknown', initials: '?' };
    const fullName = `${found.givenName} ${found.familyName}`;
    return { name: fullName, initials: getInitials(fullName) };
  }

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
    const myActionRequired = isPendingMatch && myPlayer.matchStatus === 'PENDING';
    const status = isPendingMatch
      ? 'Pending'
      : mySets > oppSets
        ? 'Victory'
        : 'Defeat';

    return {
      id: match.id,
      date: formatDate(match.startTime),
      time: formatTime(match.startTime),
      type: isPendingMatch ? 'approval' : 'past',
      myActionRequired,
      status,
      scores,
      myTeam: [playerInfo(meFirst[0]?.playerId), playerInfo(meFirst[1]?.playerId)] as [PlayerInfo, PlayerInfo],
      opponents: [playerInfo(oppPlayers[0]?.playerId), playerInfo(oppPlayers[1]?.playerId)] as [PlayerInfo, PlayerInfo],
    };
  }

  const displayMatches = matches.map(toDisplayMatch).filter((m): m is DisplayMatch => m !== null);
  const pendingMatches = displayMatches.filter(m => m.type === 'approval');
  const pastMatches = displayMatches.filter(m => m.type === 'past');

  return (
    <View style={[styles.container, { backgroundColor: COLORS.backgroundDark }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.backgroundDark} />
      <SafeAreaView style={globalStyles.safeArea}>
        <View style={globalStyles.headerContainer}>
          <Text style={globalStyles.headerTitle}>Matches</Text>
        </View>
      </SafeAreaView>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
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
                    isActioning={actioningMatchId === m.id}
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
              <Text style={[styles.emptyText, { color: COLORS.textGray }]}>No past games yet.</Text>
            ) : (
              pastMatches.map(m => <MatchCard key={m.id} match={m} />)
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
  teamColumn: { width: '35%', gap: 8 },
  scoreColumn: { width: '30%', alignItems: 'center', justifyContent: 'center' },
  scoreText: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
    lineHeight: 24,
  },
  playerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  initialsAvatar: { alignItems: 'center', justifyContent: 'center' },
  meAvatar: { backgroundColor: COLORS.primary },
  otherAvatar: { backgroundColor: '#a855f7' },
  initialsText: { fontSize: 10, fontWeight: '900' },
  playerName: { fontSize: 12, fontWeight: '600', flex: 1 },
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
  actionBtnDisabled: { opacity: 0.5 },
});
