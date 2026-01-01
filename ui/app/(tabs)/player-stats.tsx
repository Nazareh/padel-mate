import { useAuthContext } from "@/auth/authContext";
import { usePlayerContext } from "@/auth/playerContext";
import ErrorNotification from "@/components/ErrorNotification";
import HeaderProfile from "@/components/HeaderProfile";
import LoadingOverlay from "@/components/LoadingOverlay";
import RatingCircle from "@/components/RatingCircle";
import { globalStyles } from "@/constants/GlobalStyles";
import { useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlayerStats() {

    const { player, error, isLoading } = usePlayerContext();
    const { logOut } = useAuthContext();

    return (
        <SafeAreaView style={globalStyles.safeArea}  >
            <LoadingOverlay visible={isLoading} />
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
            {error && (
                <ErrorNotification
                    title={'Error'}
                    message={error}
                    onClose={logOut} />)}
        </SafeAreaView>
    )
}
