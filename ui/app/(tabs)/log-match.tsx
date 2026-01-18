import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    Platform,
    StatusBar,
    KeyboardAvoidingView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, globalStyles } from "@/constants/GlobalStyles";
import { SafeAreaView } from 'react-native-safe-area-context';
import { DateTimeSelector } from "@/components/DateTimeSelector";
import IconButton from "@/components/IconButton";
import SearchPlayersModal from "@/components/SearchPlayersModal";
import { Player } from "@/model/Player";
import PlayerAvatar from "@/components/PlayerAvatar";
import Button from "@/components/Button";
import { SetScore } from "@/model/Set";
import Notification from "@/components/Notification";
import { MatchRequest, ScoreRequest, useGlobalContext } from "@/auth/globalContext";

export default function LogMatchScreen() {
    const [matchDate, setMatchDate] = useState(new Date());
    const [showSearchPlayersModal, setShowSearchPlayersModal] = useState(false);
    const [partner, setPartner] = useState<Player | null>(null)
    const [otherPlayers, setOtherPlayers] = useState<Player[]>()
    const { player, opponents, logMatch, setErrorMsg, error } = useGlobalContext();
    const [scores, setScores] = useState<SetScore[]>([
        { us: '', them: '' }, // Set 1
        { us: '', them: '' }, // Set 2
        { us: '', them: '' }, // Set 3
    ]);

    const mappedOpponents: Player[] = opponents.map(playerData => {
        const firstName = playerData.givenName ?? "";
        const lastName = playerData.familyName ?? "";
        const fullName = `${firstName} ${lastName}`.trim() || "Unknown Player";

        return {
            id: playerData.id,
            name: fullName,
            avatar: playerData.avatarUrl,
            latestRating: playerData.latestRating,
        };
    });;

    const setPlayers = (players: Player[]) => {
        players
            .filter((p) => p.isTeammate)
            .forEach((p) => setPartner(p))

        setOtherPlayers(
            players
                .filter((p) => !p.isTeammate))
    }

    const isSetComplete = (set: SetScore) => {
        return (set.us === '' && set.them === '') || (set.us !== '' && set.them !== '');
    };

    const handleScoreChange = (index: number, team: 'us' | 'them', value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newScores = [...scores];
        newScores[index][team] = value;
        setScores(newScores);
    };

    const submit = async () => {

        if (!player) return;

        if (scores.find((set) => !isSetComplete(set))) {
            setErrorMsg("Not all sets are complete")
        }
        const scoreRequest: ScoreRequest[] = scores.map(item => ({
            team1: Number(item.them),
            team2: Number(item.us)
        }));

        const matchRequest: MatchRequest = {
            startTime: new Date(matchDate),
            isRated: true,
            team1Player1: player!.id,
            team1Player2: partner!.id,
            team2Player1: otherPlayers![0]!.id,
            team2Player2: otherPlayers![1]!.id,
            scores: scoreRequest
        };
        console.log(`Sending: ${JSON.stringify(matchRequest)}`)
        await logMatch(matchRequest)
    }

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.backgroundDark} />

            {/* Header */}
            <View style={globalStyles.headerContainer}>
                <Text style={globalStyles.headerTitle}>Log Match</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >

                <ScrollView
                    contentContainerStyle={globalStyles.mdContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={globalStyles.section} >
                        <DateTimeSelector
                            date={matchDate}
                            onDateChange={setMatchDate}
                        />
                    </View>
                    {/* Players Section */}
                    <View style={globalStyles.section}>
                        <View style={{ ...globalStyles.row, justifyContent: "space-between" }}>
                            <Text style={globalStyles.sectionTitle}>Players</Text>
                            <IconButton
                                onPress={() => setShowSearchPlayersModal(true)}
                                icon={"add"}>

                            </IconButton>
                        </View>

                        {/* My Team */}
                        <View style={globalStyles.card}>
                            <View style={styles.cardHeader}>
                                <MaterialIcons name="group" size={20} color={COLORS.primary} />
                                <Text style={styles.cardHeaderTitle}>MY TEAM</Text>
                            </View>
                            <PlayerAvatar
                                playerName={player?.givenName!}
                                avatarUrl={player?.avatarUrl!}
                                latestRating={player?.latestRating!.toString()} />
                            <View style={styles.divider} />
                            <PlayerAvatar
                                playerName={partner?.name}
                                avatarUrl={partner?.avatar}
                                latestRating={partner?.latestRating.toString()} />
                        </View>

                        {/* Opponents */}
                        <View style={globalStyles.card}>
                            <View style={styles.cardHeader}>
                                <MaterialIcons name="sports-mma" size={20} color={COLORS.red400} />
                                <Text style={styles.cardHeaderTitle}>OPPONENTS</Text>
                            </View>
                            <PlayerAvatar
                                playerName={otherPlayers?.at(0)?.name}
                                avatarUrl={otherPlayers?.at(0)?.avatar}
                                latestRating={otherPlayers?.at(0)?.latestRating.toString()}
                            />
                            <View style={styles.divider} />
                            <PlayerAvatar
                                playerName={otherPlayers?.at(1)?.name}
                                avatarUrl={otherPlayers?.at(1)?.avatar}
                                latestRating={otherPlayers?.at(1)?.latestRating.toString()}
                            />
                        </View>
                    </View>

                    {/* Match Score Section */}
                    <View style={globalStyles.section}>
                        <Text style={globalStyles.sectionTitle}>Match Score</Text>

                        <View style={globalStyles.card}>
                            {/* Header Row */}
                            <View style={styles.scoreGrid}>
                                <View style={styles.scoreLabelCol} />
                                {scores.map((_, index) => (
                                    <Text key={`header-${index}`} style={styles.scoreColHeader}>
                                        SET {index + 1}
                                    </Text>
                                ))}
                            </View>

                            {/* "Us" Row */}
                            <View style={styles.scoreGrid}>
                                <View style={styles.scoreLabelCol}>
                                    <Text style={styles.scoreTeamLabelPrimary}>Us</Text>
                                </View>
                                {scores.map((set, index) => (
                                    <TextInput
                                        key={`us-${index}`}
                                        style={[
                                            styles.scoreInput,
                                            set.us ? styles.scoreInputActive : null // Highlight if filled
                                        ]}
                                        keyboardType="numeric"
                                        maxLength={1}
                                        placeholder="-"
                                        placeholderTextColor={COLORS.textLightGreen}
                                        value={set.us}
                                        onChangeText={(text) => handleScoreChange(index, 'us', text)}
                                    />
                                ))}
                            </View>

                            <View style={styles.divider} />

                            {/* "Them" Row */}
                            <View style={styles.scoreGrid}>
                                <View style={styles.scoreLabelCol}>
                                    <Text style={styles.scoreTeamLabelGray}>Them</Text>
                                </View>
                                {scores.map((set, index) => (
                                    <TextInput
                                        key={`them-${index}`}
                                        style={[
                                            styles.scoreInput,
                                            set.them ? { color: COLORS.textLight } : null
                                        ]}
                                        keyboardType="numeric"
                                        maxLength={1}
                                        placeholder="-"
                                        placeholderTextColor={COLORS.textLightGreen}
                                        value={set.them}
                                        onChangeText={(text) => handleScoreChange(index, 'them', text)}
                                    />
                                ))}
                            </View>
                        </View>
                    </View>
                    {showSearchPlayersModal && (
                        <SearchPlayersModal
                            visible={showSearchPlayersModal}
                            onClose={() => setShowSearchPlayersModal(false)}
                            onAdd={(selected) => {
                                setShowSearchPlayersModal(false);
                                setPlayers(selected)
                            }}
                            players={mappedOpponents}
                        />)
                    }
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Sticky Footer */}
            <View style={globalStyles.footer}>
                <Button
                    label={"Save Match"}
                    onPress={submit}
                />
            </View>
            {error && (
                <Notification
                    title={'Error'}
                    message={error}
                    onClose={() => setErrorMsg(null)}
                    type="error" />
            )}
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    // --- Players Section ---
    cardHeader: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.xs,
    },
    cardHeaderTitle: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "700",
        color: COLORS.textLightGreen,
        letterSpacing: 1,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: COLORS.primaryShade,
        marginVertical: SPACING.xs,
    },
    // --- Score Grid ---
    scoreGrid: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        gap: SPACING.sm,
    },
    scoreLabelCol: {
        width: 48, // approx 3rem
        justifyContent: 'center',
    },
    scoreColHeader: {
        flex: 1,
        textAlign: 'center',
        fontSize: FONT_SIZE.sm,
        fontWeight: 'bold',
        color: COLORS.textLightGreen,
        letterSpacing: 1,
    },
    scoreTeamLabelPrimary: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "bold",
        color: COLORS.primary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    scoreTeamLabelGray: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "bold",
        color: COLORS.textLightGreen,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    scoreInput: {
        flex: 1,
        height: 48,
        borderRadius: BORDER_RADIUS.sm,
        backgroundColor: COLORS.backgroundDark,
        borderWidth: 2,
        borderColor: 'transparent',
        textAlign: 'center',
        fontSize: FONT_SIZE.xl,
        fontWeight: 'bold',
        color: COLORS.textLight,
    },
    scoreInputActive: {
        borderColor: COLORS.primaryShade,
        color: COLORS.textLight, // Assuming text-gray-900 maps to light in dark mode context
    },
});