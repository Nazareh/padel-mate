import { useGlobalContext } from "@/auth/globalContext";
import Button from "@/components/Button";
import { View } from "react-native";

export default function Home() {

    const { logOut } = useGlobalContext();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button label="Logout" onPress={logOut} />
        </View>
    )
}