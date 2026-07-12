import { MatchRequest, ScoreRequest, useGlobalContext } from "@/auth/globalContext";
import Button from "@/components/Button";
import { DateTimeSelector } from "@/components/DateTimeSelector";
import IconButton from "@/components/IconButton";
import LoadingOverlay from "@/components/LoadingOverlay";
import Notification from "@/components/Notification";
import PlayerAvatar from "@/components/PlayerAvatar";
import SearchPlayersModal from "@/components/SearchPlayersModal";
import { BORDER_RADIUS, COLORS, FONT_SIZE, globalStyles, SPACING } from "@/constants/GlobalStyles";
import { Player } from "@/model/Player";
import { SetScore } from "@/model/Set";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LogMatchScreen() {
    const [matchDate, setMatchDate] = useState(new Date());
    const [showSearchPlayersModal, setShowSearchPlayersModal] = useState(false);
    const [partner, setPartner] = useState<Player | null>(null);
    const [otherPlayers, setOtherPlayers] = useState<Player[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { player, opponents, logMatch, isLoading, setIsLoading, error, setError, localAvatarUrl, setSelectedOpponent } = useGlobalContext();
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
    });

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
        try {
            if (!player) return;

            if (!partner) {
                setError("Please select a partner");
                return;
            }
            if (!otherPlayers || otherPlayers.length < 2) {
                setError("Please select two opponents");
                return;
            }
            if (scores.find((set) => !isSetComplete(set))) {
                setError("Not all sets are complete");
                return;
            }

            const scoreRequest: ScoreRequest[] = scores
                .filter(set => set.us !== '' && set.them !== '')
                .map(item => ({
                    team1: Number(item.them),
                    team2: Number(item.us)
                }));

            if (scoreRequest.length === 0) {
                setError("Please enter at least one set score");
                return;
            }

            const matchRequest: MatchRequest = {
                startTime: new Date(matchDate),
                team1Player1: player.id,
                team1Player2: partner.id,
                team2Player1: otherPlayers[0].id,
                team2Player2: otherPlayers[1].id,
                scores: scoreRequest
            };
            await logMatch(matchRequest);
            setPartner(null);
            setOtherPlayers([]);
            setScores([{ us: '', them: '' }, { us: '', them: '' }, { us: '', them: '' }]);
            setSuccessMessage("Match logged! Waiting for other players to approve.");
        }
        catch (error: any) {
            setError(error.message || "Something went wrong. Please try again.");
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <LoadingOverlay visible={isLoading} />
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
                                avatarUrl={localAvatarUrl ?? player?.avatarUrl ?? undefined}
                                latestRating={player?.latestRating?.toString()} />
                            <View style={styles.divider} />
                            <PlayerAvatar
                                playerName={partner?.name}
                                avatarUrl={partner?.avatar}
                                latestRating={partner?.latestRating?.toString()}
                                onPress={partner ? () => setSelectedOpponent(opponents.find(o => o.id === partner.id) ?? null) : undefined}
                            />
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
                                onPress={otherPlayers?.at(0) ? () => setSelectedOpponent(opponents.find(o => o.id === otherPlayers[0].id) ?? null) : undefined}
                            />
                            <View style={styles.divider} />
                            <PlayerAvatar
                                playerName={otherPlayers?.at(1)?.name}
                                avatarUrl={otherPlayers?.at(1)?.avatar}
                                latestRating={otherPlayers?.at(1)?.latestRating.toString()}
                                onPress={otherPlayers?.at(1) ? () => setSelectedOpponent(opponents.find(o => o.id === otherPlayers[1].id) ?? null) : undefined}
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
                    title="Error"
                    message={error}
                    onClose={() => setError(null)}
                    type="error"
                />
            )}
            {successMessage && (
                <Notification
                    title="Match Logged"
                    message={successMessage}
                    onClose={() => setSuccessMessage(null)}
                    type="success"
                    autoDismissMs={3000}
                />
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