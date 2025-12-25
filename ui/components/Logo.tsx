import { COLORS, FONT_SIZE, globalStyles, SPACING } from "@/constants/GlobalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    title?: string;
    subtitle?: string;
};

export default function Logo({ title, subtitle }: Props) {
    return (
        <View style={styles.hero}>
            <View style={styles.logoWrap}>
                <MaterialIcons name="sports-tennis" size={40} color={COLORS.primary} />
            </View>
            {title && <Text style={globalStyles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>
                {subtitle}
            </Text>}
        </View>);
}

const styles = StyleSheet.create({
    hero: {
        alignItems: "center",
        paddingVertical: 18,

    },
    logoWrap: {
        width: 80,
        height: 80,
        borderRadius: 999,
        backgroundColor: COLORS.surfaceDark,
        borderWidth: 1,
        borderColor: COLORS.surfaceBorder,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: SPACING.md,
        shadowColor: COLORS.primary,
    },
    subtitle: {
        color: COLORS.textDark,
        textAlign: "center",
        marginTop: SPACING.sm,
        maxWidth: 280,
    },
}); 