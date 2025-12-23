import { AuthContext } from "@/auth/authContext";
import HeaderProfile from "@/components/HeaderProfile";
import RatingCircle from "@/components/RatingCircle";
import { globalStyles } from "@/constants/GlobalStyles";
import { useContext } from "react";
import { ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuAYoKwAo7DWpPFkockZCdu3uocG0MVC5hyTQnzuY3hGZIW9cZAH0PUwXh8R3Td2atRJhwqlfmTlXpO9CPZCCvgS5wAB2Aq1ONsZgJZ6IbHyiXR0pFkaPsU5Tmfl6XciDTfvmXRWLa7CjrkGTw2YWVImSwTIiG1QxPdMDA8w2MzeHyVVjgL1fPzgwUZGYI7tDdeiOcgRpI7bLiVosEk67nDnu8720FkWcqGV9GoS5PiVmlKaLbA7OkTta6LZf7XmkBR0DN7qfZgf4IA"
const givenName = "Nazareh";

export default function PlayerStats() {

    const { logOut } = useContext(AuthContext);

    return (
        <SafeAreaView style={globalStyles.safeArea}  >
            <ScrollView contentContainerStyle={globalStyles.mdContainer}>
                <HeaderProfile />
                <RatingCircle />

            </ScrollView>
        </SafeAreaView>
    )
}