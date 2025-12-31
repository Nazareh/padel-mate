import { COLORS, FONT_SIZE, globalStyles } from "@/constants/GlobalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { View, Image, Text, Pressable } from "react-native";

type ProfileData = {
    givenName: string;
    avatarImageUrl: string;
}

export default function HeaderProfile({ givenName, avatarImageUrl }: ProfileData) {
    return (<View style={globalStyles.header}>
        <View style={globalStyles.header}>
            <View style={{ marginRight: 12 }}>
                <Image source={{ uri: avatarImageUrl }} style={globalStyles.avatar} />
            </View>
            <View>
                <Text style={{ ...globalStyles.headerTitle, textTransform: "none" }}>Hello, {givenName}</Text>
            </View>
        </View>

        <Pressable style={globalStyles.iconButton}
            onPress={() => alert('hahah')}
        >
            <MaterialIcons name="settings" size={FONT_SIZE.lg} color={COLORS.primary} />
        </Pressable>
    </View>)
}