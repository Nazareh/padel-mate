import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// --- Constants & Theme ---
const COLORS = {
  primary: "#19e66b",
  primaryContent: "#112117",
  backgroundLight: "#f6f8f7",
  backgroundDark: "#112117",
  surfaceDark: "#1c2e24",
  surfaceLight: "#FFFFFF",
  borderDark: "#2f4538",
  textGray: "#9ca3af",
  textWhite: "#FFFFFF",
  danger: "#ef4444",
};

// Toggle this to see Light Mode (though the design shines in Dark Mode)
const IS_DARK = true; 

const THEME = {
  bg: IS_DARK ? COLORS.backgroundDark : COLORS.backgroundLight,
  surface: IS_DARK ? COLORS.surfaceDark : COLORS.surfaceLight,
  text: IS_DARK ? COLORS.textWhite : "#111827",
  textSec: IS_DARK ? "#9ca3af" : "#4b5563",
  border: IS_DARK ? COLORS.borderDark : "#e5e7eb",
};

// --- Types ---
type Player = { name: string; avatar?: string; initials?: string };
type MatchData = {
  id: string;
  date: string;
  time: string;
  type: 'approval' | 'past';
  status: 'Proposed' | 'Victory' | 'Defeat';
  score: string;
  venue: string;
  myTeam: [Player, Player];
  opponents: [Player, Player];
};

// --- Mock Data ---
const MATCHES: MatchData[] = [
  {
    id: '1',
    date: 'Yesterday',
    time: '18:00',
    type: 'approval',
    status: 'Proposed',
    score: '6-4, 2-6, 6-3',
    venue: 'Central Padel Club',
    myTeam: [{ name: 'You', initials: 'ME' }, { name: 'Mike', avatar: 'https://i.pravatar.cc/150?u=1' }],
    opponents: [{ name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=2' }, { name: 'Juan', initials: 'JL' }],
  },
  {
    id: '2',
    date: 'Oct 20',
    time: '18:30',
    type: 'past',
    status: 'Victory',
    score: '6-4\n7-5',
    venue: 'City Courts',
    myTeam: [{ name: 'You', initials: 'ME' }, { name: 'Mike', avatar: 'https://i.pravatar.cc/150?u=1' }],
    opponents: [{ name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=2' }, { name: 'David', avatar: 'https://i.pravatar.cc/150?u=3' }],
  },
  {
    id: '3',
    date: 'Oct 18',
    time: '10:00',
    type: 'past',
    status: 'Defeat',
    score: '2-6\n6-4\n2-6',
    venue: 'Padel Zenter',
    myTeam: [{ name: 'You', initials: 'ME' }, { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=2' }],
    opponents: [{ name: 'Coach', avatar: 'https://i.pravatar.cc/150?u=4' }, { name: 'Alex', avatar: 'https://i.pravatar.cc/150?u=5' }],
  }
];

// --- Components ---

const PlayerAvatar = ({ player }: { player: Player }) => {
  return (
    <View style={styles.playerRow}>
      {player.avatar ? (
        <Image source={{ uri: player.avatar }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.initialsAvatar, player.initials === 'ME' ? styles.meAvatar : styles.otherAvatar]}>
          <Text style={[styles.initialsText, player.initials === 'ME' ? { color: COLORS.primaryContent } : { color: '#FFF' }]}>
            {player.initials}
          </Text>
        </View>
      )}
      <Text style={[styles.playerName, { color: player.name === 'You' ? THEME.text : THEME.textSec }]} numberOfLines={1}>
        {player.name}
      </Text>
    </View>
  );
};

const MatchCard = ({ match }: { match: MatchData }) => {
  const isApproval = match.type === 'approval';
  const isVictory = match.status === 'Victory';
  const isProposed = match.status === 'Proposed';

  // Badge Color Logic
  let badgeBg = isProposed ? 'rgba(25, 230, 107, 0.2)' : (isVictory ? 'rgba(25, 230, 107, 0.2)' : 'rgba(255,255,255,0.05)');
  let badgeText = isProposed || isVictory ? COLORS.primary : THEME.textSec;
  if (!IS_DARK && !isProposed && !isVictory) {
    badgeBg = '#e5e7eb';
    badgeText = '#6b7280';
  }

  return (
    <View style={[styles.card, { backgroundColor: THEME.surface, borderColor: THEME.border }]}>
      {/* Card Header */}
      <View style={[styles.cardHeader, { borderBottomColor: IS_DARK ? 'rgba(255,255,255,0.05)' : '#f3f4f6' }]}>
        <View style={styles.dateRow}>
          <MaterialIcons name="calendar-today" size={14} color={THEME.textSec} />
          <Text style={[styles.dateText, { color: THEME.textSec }]}>{match.date}, {match.time}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: badgeBg }]}>
          <Text style={[styles.statusText, { color: badgeText }]}>{match.status}</Text>
        </View>
      </View>

      {/* Players Grid */}
      <View style={styles.matchGrid}>
        {/* Left Team */}
        <View style={styles.teamColumn}>
          {match.myTeam.map((p, i) => <PlayerAvatar key={i} player={p} />)}
        </View>

        {/* Scores */}
        <View style={styles.scoreColumn}>
          <Text style={[styles.scoreText, { color: match.status === 'Defeat' ? THEME.textSec : THEME.text }]}>
            {match.score}
          </Text>
        </View>

        {/* Right Team (Opponents) */}
        <View style={[styles.teamColumn, { alignItems: 'flex-end' }]}>
          {match.opponents.map((p, i) => (
             <View key={i} style={[styles.playerRow, { flexDirection: 'row-reverse' }]}>
             {p.avatar ? (
               <Image source={{ uri: p.avatar }} style={styles.avatar} />
             ) : (
               <View style={[styles.avatar, styles.initialsAvatar, styles.otherAvatar]}>
                 <Text style={[styles.initialsText, { color: '#FFF' }]}>{p.initials}</Text>
               </View>
             )}
             <Text style={[styles.playerName, { color: THEME.textSec, textAlign: 'right' }]} numberOfLines={1}>
               {p.name}
             </Text>
           </View>
          ))}
        </View>
      </View>

      {/* Venue */}
      <View style={[styles.venueContainer, { borderTopColor: IS_DARK ? 'rgba(255,255,255,0.05)' : '#f3f4f6' }]}>
        <Text style={styles.venueText}>{match.venue}</Text>
      </View>

      {/* Approval Buttons */}
      {isApproval && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: IS_DARK ? COLORS.borderDark : '#f3f4f6' }]}>
            <Text style={[styles.actionBtnText, { color: THEME.text }]}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.approveBtn]}>
            <Text style={[styles.actionBtnText, { color: COLORS.primaryContent }]}>Approve</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default function PadelMatchesScreen() {
  const [activeTab, setActiveTab] = useState('All Games');

  return (
    <View style={[styles.container, { backgroundColor: THEME.bg }]}>
      <StatusBar barStyle={IS_DARK ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <SafeAreaView edges={['top']} style={[styles.header, { backgroundColor: IS_DARK ? 'rgba(17,33,23,0.95)' : 'rgba(246,248,247,0.95)' }]}>
        <Text style={[styles.headerTitle, { color: THEME.text }]}>Your Matches</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="tune" size={24} color={THEME.text} />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Toggle */}
        <View style={styles.toggleContainer}>
          <View style={[styles.toggleTrack, { backgroundColor: IS_DARK ? COLORS.surfaceDark : '#e5e7eb' }]}>
            {['All Games', 'Approvals (1)'].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity 
                  key={tab} 
                  onPress={() => setActiveTab(tab)}
                  style={[styles.toggleItem, isActive && { backgroundColor: IS_DARK ? '#2f4538' : '#FFF', shadowOpacity: 0.1 }]}
                >
                  <Text style={[styles.toggleText, { color: isActive ? THEME.text : THEME.textSec, fontWeight: isActive ? '700' : '500' }]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Pending Approvals Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: THEME.text }]}>Pending Approvals</Text>
          <View style={styles.dangerBadge}>
            <Text style={styles.dangerBadgeText}>Action Required</Text>
          </View>
        </View>

        <View style={styles.cardContainer}>
          <MatchCard match={MATCHES[0]} />
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: THEME.border }]} />

        {/* Past Games Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: THEME.text }]}>Past Games</Text>
        </View>

        <View style={styles.cardContainer}>
          {MATCHES.slice(1).map(m => <MatchCard key={m.id} match={m} />)}
        </View>

        {/* Bottom Spacer for Tab Bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab}>
          <MaterialIcons name="add" size={32} color={COLORS.primaryContent} />
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { backgroundColor: IS_DARK ? 'rgba(17,33,23,0.9)' : 'rgba(255,255,255,0.9)', borderTopColor: IS_DARK ? 'rgba(255,255,255,0.05)' : '#e5e7eb' }]}>
        <TouchableOpacity style={styles.navItem}>
            <MaterialIcons name="home" size={28} color={THEME.textSec} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
            <MaterialIcons name="sports-tennis" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
            <MaterialIcons name="bar-chart" size={28} color={THEME.textSec} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
            <MaterialIcons name="person" size={28} color={THEME.textSec} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  toggleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  toggleTrack: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 24,
    padding: 4,
  },
  toggleItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  toggleText: {
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  dangerBadge: {
    backgroundColor: COLORS.danger,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  dangerBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cardContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    marginVertical: 24,
  },
  
  // --- Card Styles ---
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
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  matchGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamColumn: {
    width: '35%',
    gap: 8,
  },
  scoreColumn: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    fontVariant: ['tabular-nums'], // Helps with number alignment
    lineHeight: 24,
  },
  venueContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  venueText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textGray,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  // --- Player Row ---
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  initialsAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  meAvatar: {
    backgroundColor: COLORS.primary,
  },
  otherAvatar: {
    backgroundColor: '#a855f7', // Purple mock
  },
  initialsText: {
    fontSize: 10,
    fontWeight: '900',
  },
  playerName: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },

  // --- Buttons ---
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
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
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },

  fabContainer: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 50,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});