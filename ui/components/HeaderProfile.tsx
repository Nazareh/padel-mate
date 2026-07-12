import { COLORS, globalStyles } from "@/constants/GlobalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import PlayerAvatar from "./PlayerAvatar";
import { useGlobalContext } from "@/auth/globalContext";

type ProfileData = {
    givenName: string;
    avatarImageUrl: string;
    fetchData: () => void;
    onAvatarPress?: () => void;
}

export default function HeaderProfile({ givenName, avatarImageUrl, fetchData, onAvatarPress }: ProfileData) {
    const { localAvatarUrl, logOut } = useGlobalContext();

    return (
        <View style={[globalStyles.header, { justifyContent: 'space-between' }]}>
            <Pressable style={globalStyles.header} onPress={onAvatarPress}>
                <PlayerAvatar avatarUrl={localAvatarUrl ?? avatarImageUrl}>
                    <Text style={{ ...globalStyles.headerTitle, textTransform: "none" }}>Hello, {givenName}</Text>
                </PlayerAvatar>
            </Pressable>
            <TouchableOpacity onPress={logOut} hitSlop={12}>
                <MaterialIcons name="logout" size={22} color={COLORS.textGray} />
            </TouchableOpacity>
        </View>
    );
}
