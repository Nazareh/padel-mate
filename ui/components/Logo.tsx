import { COLORS, globalStyles, SPACING } from "@/constants/GlobalStyles";
import { Image, StyleSheet, Text, View } from "react-native";

type Props = {
    title?: string;
    subtitle?: string;
};

export default function Logo({ title, subtitle }: Props) {
    return (
        <View style={styles.hero}>
            <View style={styles.logoWrap}>
                <Image
                    source={require("../assets/images/padel-mate-icon.png")}
                    style={styles.logoImage}
                    resizeMode="contain"
                />
            </View>
            {title && <Text style={globalStyles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    hero: {
        alignItems: "center",
        paddingVertical: 18,
    },
    logoWrap: {
        width: 88,
        height: 88,
        borderRadius: 999,
        backgroundColor: COLORS.surfaceDark,
        borderWidth: 1,
        borderColor: COLORS.surfaceBorder,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: SPACING.md,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
        overflow: "hidden",
    },
    logoImage: {
        width: 88,
        height: 88,
    },
    subtitle: {
        color: COLORS.textLightGreen,
        textAlign: "center",
        marginTop: SPACING.sm,
        maxWidth: 280,
    },
}); 