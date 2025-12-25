import { BORDER_RADIUS, COLORS, FONT_SIZE, SPACING } from "@/constants/GlobalStyles";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
    label: string;
    onPress?: () => void;
    badgeText?: string;
};
export default function Button({ label, onPress, badgeText }: Props) {
    return (
        <TouchableOpacity style={styles.primaryButton} onPress={onPress}>
            <Text style={styles.primaryButtonText}>{label}</Text>
            {badgeText && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{badgeText}</Text>
                </View>
            )}
        </TouchableOpacity>);
}

const styles = StyleSheet.create({
    primaryButton: {
        marginTop: SPACING.sm,
        height: 56,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'row',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    primaryButtonText: {
        color: COLORS.backgroundDark,
        fontWeight: "700",
        fontSize: FONT_SIZE.md,
    },
    badge: { marginLeft: 12, backgroundColor: 'rgba(0,0,0,0.08)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    badgeText: { color: '#111', fontWeight: '700' },
})
    ;