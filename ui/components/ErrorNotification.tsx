import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BORDER_RADIUS, COLORS, FONT_SIZE, globalStyles, SPACING } from '@/constants/GlobalStyles';

interface NotificationProps {
    onClose: () => void;
    title: string;
    message: string;
}

export default function ErrorNotification({
    onClose,
    title,
    message
}: NotificationProps) {
    return (
        <View style={globalStyles.footer}>
            <View style={[
                styles.notificationCard,
            ]}>
                <MaterialIcons
                    name="error"
                    size={20}
                    color={COLORS.red300}
                    style={styles.icon}
                />

                <View style={styles.textContainer}>
                    <Text style={styles.title}>
                        {title}
                    </Text>
                    <Text style={styles.message}>
                        {message}
                    </Text>
                </View>

                <Pressable onPress={onClose}>
                    <MaterialIcons
                        name="close"
                        size={FONT_SIZE.xl}
                        color={COLORS.red300}
                    />
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    absoluteContainer: {
        position: 'absolute',
    },
    notificationCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.red900,
        borderColor: COLORS.red200,
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        // Shadow for Android
        elevation: 8,
    },
    icon: {
        marginTop: 2,
        marginRight: SPACING.md,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: FONT_SIZE.lg,
        color: COLORS.red200,
        fontWeight: '700',
    },
    message: {
        fontSize: FONT_SIZE.md,
        fontWeight: '500',
        marginTop: SPACING.md,
        lineHeight: 16,
        color: COLORS.red600
    },
    closeButton: {
        height: 24,
        width: 24,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: SPACING.sm,
    },
});
