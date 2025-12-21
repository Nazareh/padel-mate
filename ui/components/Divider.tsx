import { COLORS } from "@/constants/GlobalStyles";
import { StyleSheet, Text, View } from "react-native";


type Props = {
    text?: string;
};
export default function Divider({ text }: Props) {
    return (
        <View style={styles.dividerRow}>
            <View style={styles.hLine} />
            {text && <Text style={styles.orText}> {text}</Text>}
            <View style={styles.hLine} />
        </View>
    );
}

const styles = StyleSheet.create({
    dividerRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
    },
    hLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.surfaceBorder,
    },
    orText: {
        marginHorizontal: 12,
        color: "#93c8a8",
        fontSize: 13,
    },
})