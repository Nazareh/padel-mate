import { BORDER_RADIUS, COLORS, globalStyles, SPACING } from "@/constants/GlobalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
    icon: 'email' | 'lock' | 'lock-reset' | 'person' | 'search';
    value: string;
    placeholder: string;
    keyboardType?: 'default' | 'email-address' | 'numeric';
    onValueChange: (value: string) => void;
    isPassword?: boolean;
};

export default function MyTextInput({ icon, value, isPassword, placeholder, keyboardType, onValueChange }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <View style={globalStyles.inputRow}>
            <MaterialIcons name={icon} size={20} color={COLORS.textDark} style={{ marginRight: 10 }} />
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={COLORS.textDark}
                style={styles.input}
                value={value}
                onChangeText={onValueChange}
                keyboardType={keyboardType ?? 'default'}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={isPassword && !showPassword}

            />
            {isPassword &&
                <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
                    <MaterialIcons
                        name={showPassword ? "visibility" : "visibility-off"}
                        size={20}
                        color={COLORS.textDark}
                    />
                </TouchableOpacity>}
        </View>
    )
}

const styles = StyleSheet.create({

    input: {
        flex: 1,
        color: COLORS.textLight,
        fontSize: SPACING.md,
    },
});