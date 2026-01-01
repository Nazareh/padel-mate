import Button from '@/components/Button';
import Divider from '@/components/Divider';
import FooterNote from '@/components/FooterNote';
import Logo from '@/components/Logo';
import SocialRow from '@/components/SocialRow';
import MyTextInput from '@/components/TextInput';
import { globalStyles } from '@/constants/GlobalStyles';
import { router } from 'expo-router';
import { useState } from 'react';

const HERO_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB02fs3ChJVGuH8rZq3lcajhzWKZp2fdUvTJ7ndvu_yEbX93K501jkjtTV-vJ0LCCQMxIklO-14g0lpiJu8wmtzX30jwqnfOboswtRIEid7pGA36fJyJ_g8O4GHrs7rA_kqz_UJzeJEYITcHhAp6Vwz1MQahgWQGrRPCSF5D-D1plTuSFidW2YXAZAwVylEsO99dforuMcb657NFT_tZs9TPp8YNI-oZjxWCCxEAAAns2luffTXgKf8uTGvW1Pjf9VnQLmZU4JU_uw';

import LoadingOverlay from '@/components/LoadingOverlay';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthContext } from '@/auth/authContext';
import ErrorNotification from '@/components/ErrorNotification';

export default function SignUpScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { logInWithEmail } = useAuthContext();

    const handleLogin = async () => {

        try {
            setIsLoading(true);
            setError(null);

            if (!email || !password) {
                setError("Please fill in both fields");
                return;
            }
            await logInWithEmail(email, password);
        } catch (error: any) {
            console.log("Login error:", error);
            setError(error.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        };
    }

    return (
        <SafeAreaView style={globalStyles.safeArea} >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={globalStyles.safeArea}
            >
                <ScrollView contentContainerStyle={globalStyles.largeContainer}>
                    <LoadingOverlay visible={isLoading} />
                    <View style={{ ...globalStyles.header, justifyContent: "center" }}>
                        <Text style={{ ...globalStyles.headerTitle, alignContent: "center" }}>Log In</Text>
                    </View>
                    <Logo title='Welcome Back'
                        subtitle='Enter your details to sign in to your account.' />

                    <View style={globalStyles.form}>
                        <MyTextInput icon="email" value={email} placeholder="Email" keyboardType="email-address" onValueChange={setEmail} />
                        <MyTextInput isPassword={true} icon="lock" value={password} placeholder="Password" onValueChange={setPassword} />
                        <Button label="Log In" onPress={handleLogin} />
                    </View>
                    <Divider text='Or log in with' />

                    <SocialRow />
                    <FooterNote text="Don't have an account? " linkText="Sign Up" onPress={() => { router.push("/sign-up") }} />
                </ScrollView>
                {error && (
                    <ErrorNotification
                        title={'Error'}
                        message={error}
                        onClose={() => setError(null)} />)}
            </KeyboardAvoidingView>
        </SafeAreaView>
    )

}
