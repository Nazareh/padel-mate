import { BORDER_RADIUS, COLORS, SPACING } from "@/constants/GlobalStyles";
import { View, StyleSheet } from "react-native";

export default function HandleContainer() {
    return (
        <View style={styles.handleContainer}>
            <View style={styles.handle} />
        </View>
    );
}

const styles = StyleSheet.create({
    handleContainer: {
        alignItems: "center",
        paddingVertical: SPACING.sm,
    },
    handle: {
        width: 48,
        height: 6,
        borderRadius: 10,
        backgroundColor: COLORS.backgroundLight200,
    },
});