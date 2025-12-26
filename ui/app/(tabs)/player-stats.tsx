import { AuthContext } from "@/auth/authContext";
import HeaderProfile from "@/components/HeaderProfile";
import RatingCircle from "@/components/RatingCircle";
import { globalStyles } from "@/constants/GlobalStyles";
import { useContext } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlayerStats() {

    const { logOut, userId } = useContext(AuthContext);
    console.log(userId)

    return (
        <SafeAreaView style={globalStyles.safeArea}  >
            <ScrollView contentContainerStyle={globalStyles.mdContainer}>
                <HeaderProfile />
                <RatingCircle />
            </ScrollView>
        </SafeAreaView>
    )
}