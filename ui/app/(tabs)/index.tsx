import { AuthContext } from "@/auth/authContext";
import Button from "@/components/Button";
import { useContext } from "react";
import { View, Text } from "react-native";

export default function Home() {

    const { logOut } = useContext(AuthContext);

    return (
        <View>
            <Button label="Logout" onPress={logOut} />
        </View>
    )
}