import { createContext, PropsWithChildren, useState, useEffect, useContext, useMemo } from "react";
import { signOut, signIn, getCurrentUser, fetchAuthSession } from "aws-amplify/auth";

export type MatchRequest = {
    startTime: Date,
    isRated: boolean,
    team1Player1: string,
    team1Player2: string,
    team2Player1: string,
    team2Player2: string,
    scores: ScoreRequest[]
}

export type ScoreRequest = {
    team1: number,
    team2: number
}


type GlobalState = {
    isAuthenticated: boolean;
    userId: string | null;
    token: string | null;
    player: PlayerData | undefined;
    opponents: PlayerData[];
    isLoading: boolean;
    error: string | null;
    logInWithEmail: (email: string, password: string) => Promise<void>;
    fetchPlayers: (id: string) => Promise<void>;
    logMatch: (matchRequest: MatchRequest) => Promise<void>;
    logOut: () => void;
};

type PlayerData = {
    id: string;
    givenName: string;
    familyName: string;
    latestRating: number;
    trendValue: number | null;
    avatarUrl: string | null;
}

export const GlobalContext = createContext<GlobalState | undefined>(undefined);

export function GlobalStateProvider({ children }: PropsWithChildren) {

    const baseUrl = "https://kwn86hlgb0.execute-api.ap-southeast-2.amazonaws.com/prod/v1";

    // Start with false so the app doesn't flash the wrong screens
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [player, setPlayer] = useState<PlayerData>();
    const [opponents, setOpponents] = useState<PlayerData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Helper to get session data and update state
    const refreshUserSession = async () => {
        try {
            const user = await getCurrentUser();
            const session = await fetchAuthSession();

            setUserId(user.userId);
            // Get the JWT token from the ID Token (common for user info)
            setToken(session.tokens?.idToken?.toString() ?? null);
            if (token) fetchPlayers(user.userId);
            setIsAuthenticated(true);
            setError(null)
        } catch (error) {
            setIsAuthenticated(false);
            setUserId(null);
            setToken(null);
            console.log(error)
            setError("Failed to refresh application data.")
        }
    };

    // 2. IMPORTANT: Check session on app mount
    useEffect(() => {
        refreshUserSession();
    }, [userId, token]);


    const value = useMemo(() => ({
        player,
        isLoading,
        error,
        opponents,
        fetchPlayers,
        logMatch,
    }), [player, isLoading, error, opponents]);

    const logInWithEmail = async (email: string, password: string) => {
        try {
            const { isSignedIn } = await signIn({
                username: email,
                password,
                options: { authFlowType: "USER_PASSWORD_AUTH" },
            });

            if (isSignedIn) {
                // Fetch the actual user data after successful sign-in
                await refreshUserSession();
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

    const fetchPlayers = async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log(`Fetching player info...with token ${token}`)
            const response = await fetch(`${baseUrl}/players`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Pass the Amplify JWT
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error(`Failed to fetch players data. Status Code: ${response.status} Error: ${response.body}`);
            const result: PlayerData[] = await response.json();

            console.log("result", result)

            const loggedInPlayer = result.find(p => p.id === id)!
            // loggedInPlayer.avatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuAYoKwAo7DWpPFkockZCdu3uocG0MVC5hyTQnzuY3hGZIW9cZAH0PUwXh8R3Td2atRJhwqlfmTlXpO9CPZCCvgS5wAB2Aq1ONsZgJZ6IbHyiXR0pFkaPsU5Tmfl6XciDTfvmXRWLa7CjrkGTw2YWVImSwTIiG1QxPdMDA8w2MzeHyVVjgL1fPzgwUZGYI7tDdeiOcgRpI7bLiVosEk67nDnu8720FkWcqGV9GoS5PiVmlKaLbA7OkTta6LZf7XmkBR0DN7qfZgf4IA"
            setPlayer({ ...loggedInPlayer });

            const opponents = result.filter(p => p.id !== id)
            console.log("loggedInPlayer", loggedInPlayer)
            console.log("opponents", opponents)
            setOpponents(opponents ?? [])


        } catch (err) {
            console.log(err)
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };


    const logMatch = async (request: MatchRequest) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log("Uploading match...")
            const response = await fetch(`${baseUrl}/match`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)

            });
            if (!response.ok) throw new Error(`Failed to upload the match. Status Code:${response.status} Reason:${response.body}`);
            const result = await response.json();
            console.log("result", result)

        } catch (err) {
            console.log("err", err)
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }

    }


    return (
        <GlobalContext.Provider value={{
            isAuthenticated, userId, token, logInWithEmail, logOut,
            error, fetchPlayers, isLoading, logMatch, opponents, player
        }}>
            {children}
        </GlobalContext.Provider>
    );
}

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("globalContext must be used within a GlobalStateProvider");
    }
    return context;
};