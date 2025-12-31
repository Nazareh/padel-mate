import { globalStyles, COLORS, SPACING, BORDER_RADIUS, FONT_SIZE } from "@/constants/GlobalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, View, Switch, Text, StyleSheet } from "react-native";

type RatedMatchToogleProps = {
    value: boolean;
    onValueChange: () => void;
}

export default function RatedMatchToogle({ value, onValueChange }: RatedMatchToogleProps) {
    return (
        <Pressable
            style={globalStyles.card}
            onPress={onValueChange}
        >
            <View style={styles.row}>
                <View style={styles.iconCircleBlue}>
                    <MaterialIcons name="emoji-events" size={24} color={COLORS.textLight} />
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={globalStyles.labelTitle}>Rated Match</Text>
                    <Text style={styles.labelSubtitle}>Affects player statistics</Text>
                </View>

                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: "#52525b", true: COLORS.primary }}
                    thumbColor={COLORS.textLight}
                    style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                />
            </View>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        width: '100%',
        gap: SPACING.sm,
    },

    iconCircleBlue: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: "rgba(30, 58, 138, 0.3)", // Matches dark:bg-blue-900/30
        alignItems: "center",
        justifyContent: "center",
    },
    labelSubtitle: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "500",
        color: "#9ca3af", // Matches text-gray-400
        marginTop: 2,
    },
})