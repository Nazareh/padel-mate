import { createContext, PropsWithChildren, useState } from "react";
import { signOut, signIn, signInWithRedirect, getCurrentUser } from "aws-amplify/auth";

type AuthState = {
    isAuthenticated: boolean;
    userId: string | null;
    token: string | null;
    logInWithEmail: (email: string, password: string) => Promise<void>;
    logOut: () => void;
    signUp: () => void;
};
export const AuthContext = createContext<AuthState>({
    isAuthenticated: false,
    userId: null,
    token: null,
    logInWithEmail: async () => { },
    logOut: () => { },
    signUp: () => { },
});

export function AuthProvider({ children }: PropsWithChildren) {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const logInWithEmail = async (email: string, password: string) => {

        await logOut();

        const { isSignedIn, nextStep, ...otherProps } = await signIn({
            username: email,
            password,
            options: {
                authFlowType: "USER_PASSWORD_AUTH",
            },
        });
        console.log("✅ Sign-in success:", { isSignedIn, nextStep, otherProps });

        setIsAuthenticated(true);
        setUserId("exampleUserId");
        setToken("exampleToken");
    };

    const logOut = async () => {
        // Implement logout logic here
        await signOut({
            global: true
        });
        setIsAuthenticated(false);
        setUserId(null);
        setToken(null);
    };

    const signUp = () => {
        // Implement sign-up logic here
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, token, logInWithEmail, logOut, signUp }}>
            {children}
        </AuthContext.Provider>
    );
}