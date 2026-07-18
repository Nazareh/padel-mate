import { BORDER_RADIUS, COLORS, FONT_SIZE, SPACING } from "@/constants/GlobalStyles";
import { FEATURE_FLAGS } from "@/constants/featureFlags";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import Constants from "expo-constants";

const isExpoGo = Constants.executionEnvironment === 'storeClient';

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
                <TouchableOpacity
                    style={[styles.socialButton, isExpoGo && styles.disabledButton]}
                    onPress={isExpoGo
                        ? () => Alert.alert('Not available in Expo Go', 'Use the development build to sign in with Google.')
                        : onGooglePress
                    }
                >
                    <AntDesign name="google" size={20} color={isExpoGo ? COLORS.textGray : "#EA4335"} />
                    <Text style={[styles.socialButtonText, isExpoGo && styles.disabledText]}>Continue with Google</Text>
                </TouchableOpacity>
            )}
            {FEATURE_FLAGS.SOCIAL_LOGIN_APPLE && (
                <TouchableOpacity style={[styles.socialButton, styles.appleButton]} onPress={onApplePress}>
                    <AntDesign name="apple" size={20} color="#000" />
                    <Text style={[styles.socialButtonText, { color: "#000" }]}>Continue with Apple</Text>
                </TouchableOpacity>
            )}
            {FEATURE_FLAGS.SOCIAL_LOGIN_FACEBOOK && (
                <TouchableOpacity style={[styles.socialButton, styles.facebookButton]} onPress={onFacebookPress}>
                    <FontAwesome name="facebook-f" size={18} color="#fff" />
                    <Text style={styles.socialButtonText}>Continue with Facebook</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    socialRow: {
        flexDirection: "column",
        gap: SPACING.sm,
        paddingBottom: 18,
    },
    socialButton: {
        height: 56,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.surfaceDark,
        borderWidth: 1,
        borderColor: COLORS.surfaceBorder,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: SPACING.sm,
    },
    socialButtonText: {
        color: COLORS.textLight,
        fontSize: FONT_SIZE.md,
        fontWeight: "600",
    },
    disabledButton: {
        opacity: 0.4,
    },
    disabledText: {
        color: COLORS.textGray,
    },
    appleButton: {
        backgroundColor: "#fff",
        borderColor: "#fff",
    },
    facebookButton: {
        backgroundColor: "#1877F2",
        borderColor: "#166fe5",
    },
})
