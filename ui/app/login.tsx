import Button from '@/components/Button';
import Divider from '@/components/Divider';
import FooterNote from '@/components/FooterNote';
import Logo from '@/components/Logo';
import SocialRow from '@/components/SocialRow';
import MyTextInput from '@/components/TextInput';
import { COLORS, globalStyles } from '@/constants/GlobalStyles';
import { MaterialIcons } from "@expo/vector-icons";
import { router } from 'expo-router';
import { useState } from 'react';
import { signOut, signIn, signInWithRedirect } from "aws-amplify/auth";
import LoadingOverlay from '@/components/LoadingOverlay';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Please fill in both fields");
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            signOut({
                global: true
            });
            const { isSignedIn, nextStep, ...otherProps } = await signIn({
                username: email,
                password,
                options: {
                    authFlowType: "USER_PASSWORD_AUTH",
                },
            });
                console.log("✅ Sign-in success:", { isSignedIn, nextStep, otherProps });
        } catch (error: any) {
            console.error("❌ Error signing in:", error);
            console.error("Full error keys:", Object.keys(error));
            if (error?.underlyingError) {
                console.error(
                    "Underlying error:",
                    JSON.stringify(error.underlyingError, null, 2)
                );
            }
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
                <ScrollView contentContainerStyle={globalStyles.container}>
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
            </KeyboardAvoidingView>
        </SafeAreaView>
    )

}
