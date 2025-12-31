import { COLORS, FONT_SIZE, globalStyles } from "@/constants/GlobalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { View, Image, StyleSheet, Text } from "react-native";

type PlayerAvatarProps = {
    playerName: string
    avatarUrl?: string,
    latestRating: string,
    children?: ReactNode
}

export default function PlayerAvatar({ avatarUrl, latestRating, playerName, children }: PlayerAvatarProps) {
    return (
        <View style={globalStyles.row}>
            <View style={globalStyles.avatar}>
                {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }} style={globalStyles.avatar} />
                ) : (
                    <MaterialIcons name="person" size={16} color={COLORS.textLightGreen} />
                )}
                <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>{latestRating}</Text>
                </View>
            </View>
            <View style={styles.nameWrap}>
                <Text style={styles.playerName}>{playerName}</Text>
                {children}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    ratingBadge: {
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
})
