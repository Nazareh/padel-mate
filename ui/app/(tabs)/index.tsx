import { Link } from "expo-router";
import { View } from "react-native";

export default function Home() {
    return (
        <View>
            <Link href="/(tabs)/signup">Go to Sign Up</Link>
        </View>
    )
}