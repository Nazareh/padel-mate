import { BORDER_RADIUS, COLORS } from "@/constants/GlobalStyles";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function SocialRow() {
    return (
        <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialButton}>
                <AntDesign name="google" size={22} color="#EA4335" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, styles.appleButton]}>
                <AntDesign name="apple" size={22} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
                <FontAwesome name="facebook-f" size={18} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    socialRow: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 16,
        paddingBottom: 18,
    },
    socialButton: {
        width: 56,
        height: 56,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.surfaceDark,
        borderWidth: 1,
        borderColor: COLORS.surfaceBorder,
        alignItems: "center",
        justifyContent: "center",
    },
    appleButton: {
        backgroundColor: "#fff",
    },
    facebookButton: {
        backgroundColor: "#1877F2",
        borderColor: "#166fe5",
    },
})