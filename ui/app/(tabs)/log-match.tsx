import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Pressable,
    Image,
    StyleSheet,
    Platform,
    StatusBar,
    KeyboardAvoidingView,
    Switch
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, globalStyles } from "@/constants/GlobalStyles";
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePlayerContext } from "@/auth/playerContext";
import { DateTimeSelector } from "@/components/DateTimeSelector";

export default function LogMatchScreen() {
    const [matchDate, setMatchDate] = useState(new Date());
    const [isRated, setIsRated] = useState(true);
    const { player } = usePlayerContext();

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

                    {/* Date & Time Card */}
                    <View style={globalStyles.section} >
                        <DateTimeSelector
                            date={matchDate}
                            onDateChange={setMatchDate}
                        />

                        <Pressable
                            style={globalStyles.card}
                            onPress={() => setIsRated(!isRated)}
                        >
                            <View style={styles.row}>
                                {/* Icon Container */}
                                <View style={styles.iconCircleBlue}>
                                    <MaterialIcons name="emoji-events" size={24} color={COLORS.textLight} />
                                </View>

                                {/* Text Info */}
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.labelTitle}>Rated Match</Text>
                                    <Text style={styles.labelSubtitle}>Affects player statistics</Text>
                                </View>

                                {/* Toggle Switch */}
                                <Switch
                                    value={isRated}
                                    onValueChange={setIsRated}
                                    trackColor={{ false: "#52525b", true: COLORS.primary }}
                                    thumbColor={COLORS.textLight}
                                    style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                                />
                            </View>
                        </Pressable>
                    </View>
                    {/* Players Section */}
                    <View style={globalStyles.section}>
                        <View style={styles.row}>

                            <Text style={globalStyles.sectionTitle}>Players</Text>
                            <View style={styles.row}>
                                <View style={styles.iconCirclePrimarySmall}>
                                    <MaterialIcons name="add" size={16} color={COLORS.primary} />
                                </View>
                                <TextInput
                                    placeholder="Add other players"
                                    placeholderTextColor={COLORS.textLightGreen}
                                    style={styles.playerInput}
                                />
                            </View>
                        </View>

                        {/* My Team */}
                        <View style={globalStyles.card}>
                            <View style={styles.cardHeader}>
                                <MaterialIcons name="group" size={20} color={COLORS.primary} />
                                <Text style={styles.cardHeaderTitle}>MY TEAM</Text>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.avatarSmall}>
                                    <Image
                                        source={{ uri: player?.avatarUrl! }}
                                        style={styles.avatarImage}
                                    />
                                </View>
                                <Text style={styles.playerText}>You</Text>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.row}>
                                <View style={styles.iconCirclePrimarySmall}>
                                    <MaterialIcons name="person" size={16} color={COLORS.textLightGreen} />
                                </View>
                                <TextInput
                                    placeholder="Partner"
                                    placeholderTextColor={COLORS.textLightGreen}
                                    style={styles.playerInput}
                                />
                            </View>
                        </View>

                        {/* Opponents */}
                        <View style={globalStyles.card}>
                            <View style={styles.cardHeader}>
                                <MaterialIcons name="sports-mma" size={20} color={COLORS.red400} />
                                <Text style={styles.cardHeaderTitle}>OPPONENTS</Text>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.iconCircleGray}>
                                    <MaterialIcons name="person" size={16} color={COLORS.textLightGreen} />
                                </View>
                                <TextInput
                                    placeholder="Player 3"
                                    placeholderTextColor={COLORS.textLightGreen}
                                    style={styles.playerInput}
                                />
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.row}>
                                <View style={styles.iconCircleGray}>
                                    <MaterialIcons name="person" size={16} color={COLORS.textLightGreen} />
                                </View>
                                <TextInput
                                    placeholder="Player 4"
                                    placeholderTextColor={COLORS.textLightGreen}
                                    style={styles.playerInput}
                                />
                            </View>
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
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Sticky Footer */}
            <View style={styles.footerContainer}>
                <Pressable
                    style={({ pressed }) => [
                        styles.saveButton,
                        pressed && styles.saveButtonPressed
                    ]}
                >
                    <MaterialIcons name="save" size={24} color={COLORS.backgroundDark} />
                    <Text style={styles.saveButtonText}>Save Match</Text>
                </Pressable>
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
    closeButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: BORDER_RADIUS.full,
    },
    postButton: {
        height: 40,
        paddingHorizontal: SPACING.md,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: "rgba(25, 230, 107, 0.1)", // Primary/10
    },
    postButtonText: {
        color: COLORS.primary,
        fontWeight: "700",
        fontSize: FONT_SIZE.md,
    },

    // --- Date & Time ---
    iconCirclePrimary: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: "rgba(25, 230, 107, 0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
    label: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.textLightGreen, // Using the green-ish textDark from your palette
        fontWeight: "500",
    },
    valueText: {
        fontSize: FONT_SIZE.md,
        color: COLORS.textLight,
        fontWeight: "600",
        marginTop: 2,
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
    row: {
        flexDirection: "row",
        alignItems: "center",
        width: '100%',
        gap: SPACING.sm,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        marginVertical: SPACING.xs,
    },
    avatarSmall: {
        width: 32,
        height: 32,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: "rgba(255,255,255,0.1)",
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        opacity: 0.8,
    },
    playerText: {
        flex: 1,
        fontSize: FONT_SIZE.md,
        fontWeight: "500",
        color: COLORS.textLight,
    },
    iconCirclePrimarySmall: {
        width: 32,
        height: 32,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: "rgba(25, 230, 107, 0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
    iconCircleGray: {
        width: 32,
        height: 32,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        alignItems: "center",
        justifyContent: "center",
    },
    iconCircleBlue: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: "rgba(30, 58, 138, 0.3)", // Matches dark:bg-blue-900/30
        alignItems: "center",
        justifyContent: "center",
    },
    playerInput: {
        flex: 1,
        fontSize: FONT_SIZE.md,
        fontWeight: "500",
        color: COLORS.textLight,
        padding: 0, // Reset default Android padding
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
        fontSize: 10,
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
        borderRadius: 12,
        backgroundColor: COLORS.backgroundDark,
        borderWidth: 2,
        borderColor: 'transparent',
        textAlign: 'center',
        fontSize: FONT_SIZE.xl,
        fontWeight: 'bold',
        color: COLORS.textLight,
    },
    scoreInputActive: {
        borderColor: "rgba(25, 230, 107, 0.2)",
        color: COLORS.textLight, // Assuming text-gray-900 maps to light in dark mode context
    },

    // --- Notes ---
    notesInput: {
        width: '100%',
        minHeight: 100,
        backgroundColor: "#1e3328", // Specifically matches 'input-bg' from HTML config
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.surfaceBorder,
        padding: SPACING.md,
        fontSize: FONT_SIZE.md,
        color: COLORS.textLight,
        textAlignVertical: 'top',
    },

    // --- Footer ---
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: SPACING.md,
        paddingBottom: Platform.OS === 'ios' ? 0 : SPACING.md, // Extra padding if needed
        height: 100, // Height for the gradient area
        justifyContent: 'flex-end',
    },
    saveButton: {
        width: '100%',
        height: 56,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        // Shadow for Android
        elevation: 8,
        // Shadow for iOS
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    saveButtonPressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.9,
    },
    saveButtonText: {
        color: COLORS.backgroundDark,
        fontSize: FONT_SIZE.lg,
        fontWeight: "700",
    },

    labelTitle: {
        fontSize: FONT_SIZE.md,
        fontWeight: "700",
        color: COLORS.textLight,
    },
    labelSubtitle: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "500",
        color: "#9ca3af", // Matches text-gray-400
        marginTop: 2,
    },
    // Update existing row style if not already flex:1

});