import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BORDER_RADIUS, COLORS, FONT_SIZE, SPACING } from '@/constants/GlobalStyles';

interface NotificationProps {
    onClose: () => void;
    title: string;
    message: string;
    type: 'error' | 'success';
}

export default function Notification({
    onClose,
    title,
    message,
    type
}: NotificationProps) {

    const isError = type === 'error';
    const theme = {
        bg: isError ? COLORS.red900 : COLORS.backgroundDark,
        border: isError ? COLORS.red600 : COLORS.surfaceBorder,
        textMain: isError ? COLORS.red200 : COLORS.textLight,      // Light Pink vs Light Mint
        textSub: isError ? COLORS.red300 : COLORS.textLightGreen,       // Muted Coral vs Muted Sage
        icon: isError ? 'error-outline' : 'check-circle-outline'
    };
    console.log(`message: ${message}`)

    return (
        <View style={styles.overlay}>
            {/* Background pressable to dismiss */}
            <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

            <View style={[styles.notificationCard, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                <MaterialIcons
                    name={theme.icon as any}
                    size={FONT_SIZE.md}
                    color={theme.textSub}
                    style={styles.icon}
                />

                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: theme.textMain }]}>
                        {title}
                    </Text>
                    <Text style={[styles.message, { color: theme.textSub }]}>
                        {typeof message === 'object' ? (message as any).message : message}
                    </Text>
                </View>

                <Pressable
                    onPress={onClose}
                    hitSlop={12}
                    style={[styles.closeBtn, { backgroundColor: `${theme.border}` }]}
                >
                    <MaterialIcons
                        name="close"
                        size={18}
                        color={theme.textSub}
                    />
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
        zIndex: 1000,
    },
    notificationCard: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1.5,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10,
    },
    icon: {
        marginTop: 2,
        marginRight: SPACING.md,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: FONT_SIZE.md,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    message: {
        fontSize: FONT_SIZE.sm,
        fontWeight: '500',
        marginTop: SPACING.sm,
        lineHeight: 18,
    },
    closeBtn: {
        padding: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
        marginLeft: SPACING.sm,
    },
});