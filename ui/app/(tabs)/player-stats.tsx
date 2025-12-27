import { usePlayerContext } from "@/auth/playerContext";
import HeaderProfile from "@/components/HeaderProfile";
import RatingCircle from "@/components/RatingCircle";
import { globalStyles } from "@/constants/GlobalStyles";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";




export default function PlayerStats() {

    const { player } = usePlayerContext();

    return (
        <SafeAreaView style={globalStyles.safeArea}  >
            <ScrollView contentContainerStyle={globalStyles.mdContainer}>
                <HeaderProfile
                    givenName={player?.givenName!}
                    avatarImageUrl={player?.avatarUrl!}
                />
                <RatingCircle
                    latestRating={player?.latestRating!}
                    trendValue={player?.trendValue}
                />
            </ScrollView>
        </SafeAreaView>
    )
}
