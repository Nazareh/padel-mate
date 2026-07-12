import { BORDER_RADIUS, COLORS } from "@/constants/GlobalStyles";
import { FEATURE_FLAGS } from "@/constants/featureFlags";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
    onGooglePress?: () => void;
    onApplePress?: () => void;
    onFacebookPress?: () => void;
};

export default function SocialRow({ onGooglePress, onApplePress, onFacebookPress }: Props) {
    const anyEnabled =
        FEATURE_FLAGS.SOCIAL_LOGIN_GOOGLE ||
        FEATURE_FLAGS.SOCIAL_LOGIN_APPLE ||
        FEATURE_FLAGS.SOCIAL_LOGIN_FACEBOOK;

    if (!anyEnabled) return null;

    return (
        <View style={styles.socialRow}>
            {FEATURE_FLAGS.SOCIAL_LOGIN_GOOGLE && (
                <TouchableOpacity style={styles.socialButton} onPress={onGooglePress}>
                    <AntDesign name="google" size={22} color="#EA4335" />
                </TouchableOpacity>
            )}
            {FEATURE_FLAGS.SOCIAL_LOGIN_APPLE && (
                <TouchableOpacity style={[styles.socialButton, styles.appleButton]} onPress={onApplePress}>
                    <AntDesign name="apple" size={22} color="#000" />
                </TouchableOpacity>
            )}
            {FEATURE_FLAGS.SOCIAL_LOGIN_FACEBOOK && (
                <TouchableOpacity style={[styles.socialButton, styles.facebookButton]} onPress={onFacebookPress}>
                    <FontAwesome name="facebook-f" size={18} color="#fff" />
                </TouchableOpacity>
            )}
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
