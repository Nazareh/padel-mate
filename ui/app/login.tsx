import Button from '@/components/Button';
import Divider from '@/components/Divider';
import FooterNote from '@/components/FooterNote';
import Logo from '@/components/Logo';
import SocialRow from '@/components/SocialRow';
import MyTextInput from '@/components/TextInput';
import { COLORS, globalStyles } from '@/constants/GlobalStyles';
import { MaterialIcons } from "@expo/vector-icons";
import { router } from 'expo-router';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function SignUpScreen() {
    return (
        <SafeAreaView style={globalStyles.safeArea} >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={globalStyles.safeArea}
            >
                <ScrollView contentContainerStyle={globalStyles.container}>
                    <View style={globalStyles.header}>
                        <TouchableOpacity
                            accessibilityLabel="Back"
                            onPress={() => { router.back() }}
                            style={globalStyles.iconButton}
                        >
                            <MaterialIcons name="arrow-back" size={20} color={COLORS.textLight} />
                        </TouchableOpacity>
                        <Text style={globalStyles.headerTitle}>Sign Up</Text>
                        <View style={{ width: 40 }} />
                    </View>
                    <Logo title='Welcome Back'
                        subtitle='Enter your details to sign in to your account.' />

                    <View style={globalStyles.form}>
                        <MyTextInput icon="email" value="" placeholder="Email" keyboardType="email-address" onValueChange={() => { }} />
                        <MyTextInput isPassword={true} icon="lock" value="" placeholder="Password" onValueChange={() => { }} />

                        <Button label="Log In" onPress={() => { }} />
                    </View>
                    <Divider text='Or log in with' />

                    <SocialRow />
                    <FooterNote text="Don't have an account? " highlightedText="Sign Up" href="/sign-up" />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )

}
