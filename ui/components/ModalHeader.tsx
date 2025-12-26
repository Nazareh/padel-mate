import { COLORS, globalStyles, SPACING } from "@/constants/GlobalStyles";
import { Pressable, Text, StyleSheet, View } from "react-native";

type Props = {
    title: string;
    onClose: () => void;
};

export default function ModalHeader({ title, onClose }: Props) {
    return (
        <View style={styles.headerRow}>
            <Text style={globalStyles.title}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={8} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.xl
    },
    cancelBtn: { padding: SPACING.xs },
    cancelText: { color: COLORS.textDark, fontSize: 14 },

});