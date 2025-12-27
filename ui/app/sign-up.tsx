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
import { signUp } from "aws-amplify/auth";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingOverlay from '@/components/LoadingOverlay';
import ErrorNotification from '@/components/ErrorNotification';


export default function SignUpScreen() {
    const [givenName, setGivenName] = useState("");
    const [familyName, setFamilyName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignUp = async () => {
        if (!givenName || !familyName || !email || !password || !confirmPassword) {
            setError("Please fill in both fields");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        await signUp({
            username: email,
            password,
            options: {
                userAttributes: {
                    email,
                    given_name: givenName,
                    family_name: familyName,
                },
            },
        }).then((data) => {
            console.log("✅ Sign-up success:", data);
            setIsLoading(false);
            Alert.alert("Success", "Account created successfully! Please check your email to verify your account.");
            router.replace("/login");
        }).catch((error) => {
            setError(error);
        });

    }

    return (
        <SafeAreaView style={globalStyles.safeArea} >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={globalStyles.safeArea}
            >
                <ScrollView contentContainerStyle={globalStyles.largeContainer}>
                    <LoadingOverlay visible={false} />
                    <View style={globalStyles.header}>
                        <TouchableOpacity
                            accessibilityLabel="Back"
                            onPress={() => { router.back() }}
                            style={globalStyles.socialIconButton}
                        >
                            <MaterialIcons name="arrow-back" size={20} color={COLORS.textLight} />
                        </TouchableOpacity>
                        <Text style={globalStyles.headerTitle}>Sign Up</Text>
                        <View style={{ width: 40 }} />
                    </View>
                    <Logo title='Join Padel Mate'
                        subtitle='Create an account to upload match results and track your rating and stats' />

                    <View style={globalStyles.form}>
                        <MyTextInput icon="person" value={givenName} placeholder="Given Name" onValueChange={setGivenName} />
                        <MyTextInput icon="person" value={familyName} placeholder="Family Name" onValueChange={setFamilyName} />
                        <MyTextInput icon="email" value={email} placeholder="Email" keyboardType="email-address" onValueChange={setEmail} />
                        <MyTextInput isPassword={true} icon="lock" value={password} placeholder="Password" onValueChange={setPassword} />
                        <MyTextInput isPassword={true} icon="lock-reset" value={confirmPassword} placeholder="Confirm Password" onValueChange={setConfirmPassword} />
                        <Button label="Create Account" onPress={handleSignUp} />
                    </View>
                    <Divider text='Or log in with' />

                    <SocialRow />
                    <FooterNote text="Already have an account? " linkText="Log In" onPress={() => { router.back() }} />
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
