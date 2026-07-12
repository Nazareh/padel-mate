import { COLORS, FONT_SIZE, globalStyles } from "@/constants/GlobalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { View, Text, Pressable } from "react-native";
import PlayerAvatar from "./PlayerAvatar";
import { useGlobalContext } from "@/auth/globalContext";

type ProfileData = {
    givenName: string;
    avatarImageUrl: string;
    fetchData: () => void;
    onAvatarPress?: () => void;
}

export default function HeaderProfile({ givenName, avatarImageUrl, fetchData, onAvatarPress }: ProfileData) {
    const { localAvatarUrl } = useGlobalContext();

    return (
        <View style={globalStyles.header}>
            <Pressable style={globalStyles.header} onPress={onAvatarPress}>
                <PlayerAvatar avatarUrl={localAvatarUrl ?? avatarImageUrl}>
                    <Text style={{ ...globalStyles.headerTitle, textTransform: "none" }}>Hello, {givenName}</Text>
                </PlayerAvatar>
            </Pressable>
        </View>
    );
}
