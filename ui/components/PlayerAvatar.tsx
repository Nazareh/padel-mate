import { BORDER_RADIUS, COLORS, FONT_SIZE, globalStyles, SPACING } from "@/constants/GlobalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { View, Image, StyleSheet, Text } from "react-native";

type PlayerAvatarProps = {
    playerName?: string | null
    avatarUrl?: string | null,
    latestRating?: string | null,
    children?: ReactNode
}

export default function PlayerAvatar({ avatarUrl, latestRating, playerName, children }: PlayerAvatarProps) {
    return (
        <View style={globalStyles.row}>
            <View>
                {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }}
                        style={globalStyles.avatar}
                    />
                ) : (
                    <View style={styles.iconCircleGray}>
                        <MaterialIcons name="person" size={FONT_SIZE.xl} color={COLORS.textLightGreen} />
                    </View>)}
                {latestRating && (
                    <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>{latestRating}</Text>
                    </View>
                )}
            </View>
            <View style={styles.nameWrap}>
                <Text style={styles.playerName}>{playerName}</Text>
                {children}
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    ratingBadge: {
        position: 'absolute',
        right: -6,
        bottom: -6,
        height: 22,
        minWidth: 22,
        paddingHorizontal: SPACING.sm,
        borderRadius: 12,
        backgroundColor: '#1a2c22',
        borderColor: '#112218',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ratingText: {
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
    iconCircleGray: {
        width: FONT_SIZE.xxxl,
        height: FONT_SIZE.xxxl,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.primaryShade,
        alignItems: "center",
        justifyContent: "center",
    },
})
