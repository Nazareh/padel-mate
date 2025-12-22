import { COLORS, FONT_SIZE, SPACING } from "@/constants/GlobalStyles";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    text: string;
    highlightedText?: string;
    href: '/sign-up' | '/login';
};

export default function FooterNote({ text, highlightedText, href }: Props) {
    return (
        <View style={styles.loginRow}>
            <Text style={styles.loginText}>
                {text}{" "}
                <Link style={styles.loginLink} href={href}>
                    {highlightedText}
                </Link>
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