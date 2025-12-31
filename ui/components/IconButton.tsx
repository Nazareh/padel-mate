import { globalStyles, FONT_SIZE, COLORS, SPACING } from "@/constants/GlobalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { View, Pressable, StyleSheet } from "react-native";

type IconButtonProps = {
    onPress: () => void;
    icon: 'add' | 'settings' | 'calendar-today';
    children?: ReactNode;
}

export default function IconButton({ onPress, icon, children }: IconButtonProps) {
    return (
        <View style={globalStyles.row}>
            <Pressable style={globalStyles.iconButton}
                onPress={onPress}>
                <MaterialIcons name={icon} size={FONT_SIZE.lg} color={COLORS.primary} />
            </Pressable>
            {children}
        </View>
    )

}
