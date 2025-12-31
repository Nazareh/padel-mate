import { useAuthContext } from "@/auth/authContext";
import Button from "@/components/Button";
import { View } from "react-native";

export default function Home() {

    const { logOut } = useAuthContext();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button label="Logout" onPress={logOut} />
        </View>
    )
}