import { BORDER_RADIUS, COLORS, FONT_SIZE, SPACING } from "@/constants/GlobalStyles";
import { Player } from "@/model/Player";
import { MaterialIcons } from "@expo/vector-icons";
import { View, Image, Text, StyleSheet, Pressable } from "react-native";
import PlayerAvatar from "./PlayerAvatar";

type PlayerRowProps = {
    player: Player;
    onToggle: () => void;
    selected: boolean;
    teamMateSelected: boolean;
    teamMate?: string;
    setTeamMate: () => void;
    allowAddButton: boolean
};


export default function PlayerRow({ player, onToggle, teamMate, setTeamMate, selected, teamMateSelected, allowAddButton }: PlayerRowProps) {
    return (
        <View style={styles.row}>
            <PlayerAvatar
                playerName={player.name}
                avatarUrl={player.avatar}
                latestRating={player.latestRating.toString()}
            >
                <View style={styles.tagRow}>
                    {(!teamMate || teamMate === player.id) && (
                        <Pressable onPress={() => {
                            if (!selected) { onToggle() }
                            setTeamMate()
                        }}
                            style={[styles.teammateTag, teamMateSelected && styles.teamMateCheckboxSelected]}
                            accessibilityRole="checkbox"
                            accessibilityState={{ checked: teamMateSelected }}>
                            <Text style={[styles.teammateText, teamMateSelected && styles.teamMateCheckboxSelected]}>Teammate</Text>
                        </Pressable>
                    )}
                </View>
            </PlayerAvatar>
            <Pressable onPress={() => {
                onToggle()
                if (teamMateSelected && teamMate === player.id) {
                    setTeamMate()
                }
            }}
                disabled={!selected && !allowAddButton}
                style={[styles.checkbox, selected && styles.checkboxSelected]} accessibilityRole="checkbox" accessibilityState={{ checked: selected }}>
                {selected ? <MaterialIcons name="check" size={FONT_SIZE.xl} color={COLORS.surfaceDark} /> : null}
            </Pressable>
        </View >
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        marginHorizontal: SPACING.sm,
    },
    initials: {
        width: 56,
        height: 56,
        borderRadius: BORDER_RADIUS.full,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: COLORS.primaryShade,
        backgroundColor: COLORS.backgroundDark,
        borderWidth: 2,
        fontWeight: '700',
        fontSize: FONT_SIZE.xl,
    },
    checkbox: {
        width: 44,
        height: 44,
        borderRadius: BORDER_RADIUS.full,
        borderWidth: 1,
        borderColor: COLORS.backgroundLight100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxSelected: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary
    },
    teamMateCheckboxSelected: {
        borderColor: COLORS.lightBlue,
        backgroundColor: COLORS.lightBlue,
        color: COLORS.textDark
    },
    countBadge: {
        position: 'absolute',
        right: -6,
        bottom: -6,
        height: 22,
        minWidth: 22,
        paddingHorizontal: 6,
        borderRadius: 12,
        backgroundColor: '#1a2c22',
        borderColor: '#112218',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countText: {
        color: COLORS.primary,
        fontSize: 10,
        fontWeight: '700'
    },
    nameWrap: {
        flexDirection: 'column',
        width: '70%'
    },
    playerName: {
        fontSize: FONT_SIZE.lg,
        fontWeight: '700',
        color: COLORS.textLight
    },
    tagRow: {
        flexDirection: 'row',
        marginTop: 4
    },
    teammateTag: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.surfaceDark,
        borderWidth: 1,
        borderColor: COLORS.backgroundLight100,
    },
    teammateText: {
        fontSize: 10,
        fontWeight: '700',
        color: COLORS.textLightGreen
    },
    teammateTextSelected: {
        fontSize: 10,
        fontWeight: '700',
        color: COLORS.backgroundDark
    },

})