import { useAuthContext } from "@/auth/authContext";
import Button from "@/components/Button";
import ErrorNotification from "@/components/ErrorNotification";
import SearchPlayersModal from "@/components/SearchPlayersModal";
import { useState } from "react";
import { View } from "react-native";

export default function Home() {

    const { logOut } = useAuthContext();
    const [show, setShow] = useState(false);
    const [error, setError] = useState('hkjhjh');

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