import { AuthContext } from "@/auth/authContext";
import Button from "@/components/Button";
import SearchPlayersModal from "@/components/SearchPlayersModal";
import { useContext, useState } from "react";
import { View, Text } from "react-native";

export default function Home() {

    const { logOut } = useContext(AuthContext);
    const [show, setShow] = useState(false);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button label="Logout" onPress={logOut} />
            <Button label="Open Search Players" onPress={() => setShow(true)} />
            <SearchPlayersModal
                visible={show}
                onClose={() => setShow(false)}
                onAdd={(selected) => {
                    console.log('selected players', selected);
                    setShow(false);
                }}
            />
        </View>
    )
}