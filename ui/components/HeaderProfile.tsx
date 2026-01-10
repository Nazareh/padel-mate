import { COLORS, FONT_SIZE, globalStyles } from "@/constants/GlobalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { View, Image, Text, Pressable } from "react-native";
import PlayerAvatar from "./PlayerAvatar";
import { useAuthContext } from "@/auth/authContext";
import { usePlayerContext } from "@/auth/playerContext";

type ProfileData = {
    givenName: string;
    avatarImageUrl: string;
}

export default function HeaderProfile({ givenName, avatarImageUrl }: ProfileData) {
    const { userId } = useAuthContext();
    const { fetchData } = usePlayerContext();
    return (<View style={globalStyles.header}>
        <View style={globalStyles.header}>
            <PlayerAvatar
                avatarUrl={avatarImageUrl}
            >
                <View>
                    <Text style={{ ...globalStyles.headerTitle, textTransform: "none" }}>Hello, {givenName}</Text>
                </View>
            </PlayerAvatar>
        </View>

        <View>
            <Pressable style={globalStyles.iconButton}
                onPress={() => alert('hahah')}
            >
                <MaterialIcons name="settings" size={FONT_SIZE.lg} color={COLORS.primary} />
            </Pressable>

            {userId && (
                <Pressable style={globalStyles.iconButton}
                    onPress={() => fetchData(userId!)}
                >
                    <MaterialIcons name="refresh" size={FONT_SIZE.lg} color={COLORS.primary} />
                </Pressable>
            )}
        </View>
    </View>)
}