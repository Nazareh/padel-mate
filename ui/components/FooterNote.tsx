import { COLORS, FONT_SIZE, SPACING } from "@/constants/GlobalStyles";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    text: string;
    linkText?: string;
    onPress: () => void;
};

export default function FooterNote({ text, linkText, onPress }: Props) {
    return (
        <View style={styles.loginRow}>
            <Text style={styles.loginText}>
                {text}{" "}
                <Text style={styles.loginLink} onPress={onPress}>
                    {linkText}
                </Text>
            </Text>
        </View >
    );
}


const styles = StyleSheet.create({
    loginRow: {
        alignItems: "center",
        paddingVertical: SPACING.md,
    },
    loginText: {
        color: COLORS.textLight,
        fontSize: FONT_SIZE.md,
    },
    loginLink: {
        color: COLORS.primary,
        fontWeight: "600",
    },
})