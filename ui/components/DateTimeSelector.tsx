import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { BORDER_RADIUS, COLORS, FONT_SIZE, globalStyles, SPACING } from '@/constants/GlobalStyles';

interface DateTimeSelectorProps {
    date: Date;
    onDateChange: (date: Date) => void;

}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({ date, onDateChange }) => {
    const [mode, setMode] = useState<'date' | 'time'>('date');
    const [show, setShow] = useState<boolean>(false);

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (event.type === 'dismissed') {
            setMode('date')
            setShow(false)
        }

        if (mode === 'date' && selectedDate) {
            setTimeout(() => {
                onDateChange(selectedDate)
                setMode('time');
            }, 100)
        }
        if (mode === 'time' && selectedDate) {
            onDateChange(selectedDate)
            setShow(false);
            setMode('date');
        }
    };

    const formatDate = (date: Date) => {
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();

        const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
        const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };

        const dateStr = isToday ? 'Today' : date.toLocaleDateString(undefined, dateOptions);
        const timeStr = date.toLocaleTimeString(undefined, timeOptions);

        return `${dateStr}, ${timeStr}`;
    };

    return (
        <View>
            <Pressable
                onPress={() => setShow(true)}
                style={({ pressed }) => [globalStyles.card, pressed && styles.pressed]}
            >
                <View style={styles.iconCircle}>
                    <MaterialIcons name="calendar-today" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.label}>Date & Time</Text>
                    <Text style={styles.valueText}>{formatDate(date)}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={COLORS.textLightGreen} />
            </Pressable>

            {show && (
                <DateTimePicker
                    value={date}
                    mode={mode}
                    // minuteInterval={15}
                    is24Hour={true}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onChange}
                    textColor={COLORS.textLight}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: SPACING.sm,
    },
    selectorCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.surfaceDark,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.surfaceBorder,
        padding: SPACING.md,
        gap: SPACING.md,
    },
    pressed: {
        opacity: 0.7,
        backgroundColor: COLORS.secondary,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: "rgba(25, 230, 107, 0.15)",
        alignItems: "center",
        justifyContent: "center",
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.textLightGreen,
        fontWeight: "500",
        marginBottom: 2,
    },
    valueText: {
        fontSize: FONT_SIZE.md,
        color: COLORS.textLight,
        fontWeight: "700",
    },
});