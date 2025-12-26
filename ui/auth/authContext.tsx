import { createContext, PropsWithChildren, useState, useEffect } from "react";
import { signOut, signIn, getCurrentUser, fetchAuthSession } from "aws-amplify/auth";

type AuthState = {
    isAuthenticated: boolean;
    userId: string | null;
    token: string | null;
    logInWithEmail: (email: string, password: string) => Promise<void>;
    logOut: () => void;
};

export const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
    // Start with false so the app doesn't flash the wrong screens
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // Helper to get session data and update state
    const checkUserSession = async () => {
        try {
            const user = await getCurrentUser();
            const session = await fetchAuthSession();

            setUserId(user.userId);
            // Get the JWT token from the ID Token (common for user info)
            setToken(session.tokens?.idToken?.toString() ?? null);
            setIsAuthenticated(true);
        } catch (error) {
            // No user is signed in
            setIsAuthenticated(false);
            setUserId(null);
            setToken(null);
        }
    };

    // 2. IMPORTANT: Check session on app mount
    useEffect(() => {
        checkUserSession();
    }, []);

    const logInWithEmail = async (email: string, password: string) => {
        try {
            const { isSignedIn } = await signIn({
                username: email,
                password,
                options: { authFlowType: "USER_PASSWORD_AUTH" },
            });

            if (isSignedIn) {
                // Fetch the actual user data after successful sign-in
                await checkUserSession();
            }
        } catch (error) {
            console.error("Error signing in", error);
            throw error;
        }
    };

    const logOut = async () => {
        try {
            await signOut({ global: true });
            setIsAuthenticated(false);
            setUserId(null);
            setToken(null);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, token, logInWithEmail, logOut }}>
            {children}
        </AuthContext.Provider>
    );
}