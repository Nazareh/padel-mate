import { COLORS, globalStyles } from "@/constants/GlobalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { View, Image, Text, TouchableOpacity } from "react-native";

const AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuAYoKwAo7DWpPFkockZCdu3uocG0MVC5hyTQnzuY3hGZIW9cZAH0PUwXh8R3Td2atRJhwqlfmTlXpO9CPZCCvgS5wAB2Aq1ONsZgJZ6IbHyiXR0pFkaPsU5Tmfl6XciDTfvmXRWLa7CjrkGTw2YWVImSwTIiG1QxPdMDA8w2MzeHyVVjgL1fPzgwUZGYI7tDdeiOcgRpI7bLiVosEk67nDnu8720FkWcqGV9GoS5PiVmlKaLbA7OkTta6LZf7XmkBR0DN7qfZgf4IA"
const givenName = "Nazareh";

export default function HeaderProfile() {
    return (<View style={globalStyles.header}>
        <View style={globalStyles.header}>
            <View style={{ marginRight: 12 }}>
                <Image source={{ uri: AVATAR }} style={globalStyles.avatar} />
            </View>
            <View>
                <Text style={{ ...globalStyles.headerTitle, textTransform: "none" }}>Hello, {givenName}</Text>
            </View>
        </View>

        <TouchableOpacity style={globalStyles.iconButton}>
            <MaterialIcons name="settings" size={18} color={COLORS.primary} />
        </TouchableOpacity>
    </View>)
}