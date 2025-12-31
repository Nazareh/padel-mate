import React, { useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { COLORS, globalStyles } from '@/constants/GlobalStyles';

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
                style={globalStyles.card}
            >
                <View style={
                    globalStyles.iconButton
                }>
                    <MaterialIcons name="calendar-today" size={20} color={COLORS.primary} />
                </View>
                <View >
                    <Text style={globalStyles.label}>Date & Time</Text>
                    <Text style={globalStyles.labelTitle}>{formatDate(date)}</Text>
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