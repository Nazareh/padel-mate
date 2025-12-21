import { BORDER_RADIUS, COLORS, FONT_SIZE, SPACING } from "@/constants/GlobalStyles";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
    label: string;
    onPress?: () => void;
};
export default function Button({ label, onPress }: Props) {
    return (
        <TouchableOpacity style={styles.primaryButton} onPress={onPress}>
            <Text style={styles.primaryButtonText}>{label}</Text>
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
})
    ;