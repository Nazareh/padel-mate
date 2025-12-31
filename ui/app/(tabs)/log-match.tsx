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
import { usePlayerContext } from "@/auth/playerContext";
import { DateTimeSelector } from "@/components/DateTimeSelector";
import RatedMatchToogle from "@/components/RatedMatchToogle";
import IconButton from "@/components/IconButton";
import SearchPlayersModal from "@/components/SearchPlayersModal";
import { Player } from "@/model/Player";
import PlayerAvatar from "@/components/PlayerAvatar";
import Button from "@/components/Button";

export default function LogMatchScreen() {
    const [matchDate, setMatchDate] = useState(new Date());
    const [isRated, setIsRated] = useState(true);
    const [showSearchPlayersModal, setShowSearchPlayersModal] = useState(false);
    const [partner, setPartner] = useState<Player | null>(null)
    const [otherPlayers, setOtherPlayers] = useState<Player[]>()
    const { player } = usePlayerContext();

    const setPlayers = (players: Player[]) => {
        players
            .filter((p) => p.isTeammate)
            .forEach((p) => setPartner(p))

        setOtherPlayers(
            players
                .filter((p) => !p.isTeammate))
    }

    console.log("Partner", partner)
    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.backgroundDark} />

            {/* Header */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Log Match</Text>
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
                        <RatedMatchToogle
                            value={isRated}
                            onValueChange={() => setIsRated(!isRated)} />
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
                            {/* Score Header */}
                            <View style={styles.scoreGrid}>
                                <View style={styles.scoreLabelCol} />
                                <Text style={styles.scoreColHeader}>SET 1</Text>
                                <Text style={styles.scoreColHeader}>SET 2</Text>
                                <Text style={styles.scoreColHeader}>SET 3</Text>
                            </View>

                            {/* Us Row */}
                            <View style={styles.scoreGrid}>
                                <View style={styles.scoreLabelCol}>
                                    <Text style={styles.scoreTeamLabelPrimary}>Us</Text>
                                </View>
                                <TextInput
                                    style={[styles.scoreInput, styles.scoreInputActive]}
                                    keyboardType="numeric"
                                    maxLength={1}
                                    defaultValue="6"
                                />
                                <TextInput
                                    style={styles.scoreInput}
                                    keyboardType="numeric"
                                    maxLength={1}
                                    placeholder="-"
                                    placeholderTextColor={COLORS.textLightGreen}
                                />
                                <TextInput
                                    style={styles.scoreInput}
                                    keyboardType="numeric"
                                    maxLength={1}
                                    placeholder="-"
                                    placeholderTextColor={COLORS.textLightGreen}
                                />
                            </View>

                            <View style={styles.divider} />

                            {/* Them Row */}
                            <View style={styles.scoreGrid}>
                                <View style={styles.scoreLabelCol}>
                                    <Text style={styles.scoreTeamLabelGray}>Them</Text>
                                </View>
                                <TextInput
                                    style={[styles.scoreInput, { color: COLORS.textLight }]}
                                    keyboardType="numeric"
                                    maxLength={1}
                                    defaultValue="4"
                                />
                                <TextInput
                                    style={styles.scoreInput}
                                    keyboardType="numeric"
                                    maxLength={1}
                                    placeholder="-"
                                    placeholderTextColor={COLORS.textLightGreen}
                                />
                                <TextInput
                                    style={styles.scoreInput}
                                    keyboardType="numeric"
                                    maxLength={1}
                                    placeholder="-"
                                    placeholderTextColor={COLORS.textLightGreen}
                                />
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
                        />)
                    }
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Sticky Footer */}
            <View style={globalStyles.footer}>
                <Button
                    label={"Save Match"}
                    onPress={() => { }}
                />
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    // --- Header ---
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        backgroundColor: COLORS.backgroundDark,
        zIndex: 20,
    },
    headerTitle: {
        color: COLORS.textLight,
        fontSize: FONT_SIZE.lg,
        fontWeight: "700",
        textAlign: "center",
        flex: 1,
    },

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