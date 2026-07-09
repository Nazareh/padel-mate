import { fetchAuthSession, getCurrentUser, signIn, signOut } from "aws-amplify/auth";
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState, Dispatch, SetStateAction } from "react";

export type MatchRequest = {
    startTime: Date,
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

export type MatchPlayerData = {
    playerId: string;
    team: 'TEAM_1' | 'TEAM_2';
    matchStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'INVALID';
}

export type MatchData = {
    id: string;
    startTime: string;
    players: MatchPlayerData[];
    scores: ScoreRequest[];
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'INVALID';
    reason?: string;
}


type GlobalState = {
    isAuthenticated: boolean;
    userId: string | null;
    token: string | null;
    player: PlayerData | undefined;
    opponents: PlayerData[];
    matches: MatchData[];
    isLoading: boolean;
    error: string | null;
    localAvatarUrl: string | null;
    logInWithEmail: (email: string, password: string) => Promise<void>;
    fetchPlayers: (id: string) => Promise<void>;
    fetchMatches: () => Promise<void>;
    logMatch: (matchRequest: MatchRequest) => Promise<void>;
    approveOrRejectMatch: (matchId: string, action: 'APPROVE' | 'REJECT') => Promise<void>;
    updateLocalAvatar: (url: string | null) => void;
    logOut: () => void;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    setError: Dispatch<SetStateAction<string | null>>;
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
    const [matches, setMatches] = useState<MatchData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);

    const updateLocalAvatar = (url: string | null) => setLocalAvatarUrl(url);

    // Helper to get session data and update state
    const refreshUserSession = async () => {
        try {
            const user = await getCurrentUser();
            const session = await fetchAuthSession();

            const newToken = session.tokens?.idToken?.toString() ?? null;

            setUserId(user.userId);
            setToken(newToken);
            setIsAuthenticated(true);
            setError(null)
            fetchPlayers(user.userId, newToken ?? undefined);
            fetchMatches(newToken ?? undefined);

        } catch (error) {
            setIsAuthenticated(false);
            setUserId(null);
            setToken(null);
            setError("Failed to refresh application data.")
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshUserSession();
    }, []);


    useMemo(() => ({
        player,
        isLoading,
        error,
        opponents,
        fetchPlayers,
        logMatch,
        setIsLoading
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

    const fetchPlayers = async (id: string, authToken?: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${baseUrl}/players`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken ?? token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error(`Failed to fetch players data. Status Code: ${response.status} Error: ${response.body}`);
            const result: PlayerData[] = await response.json();

            const loggedInPlayer = result.find(p => p.id === id)!
            // loggedInPlayer.avatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuAYoKwAo7DWpPFkockZCdu3uocG0MVC5hyTQnzuY3hGZIW9cZAH0PUwXh8R3Td2atRJhwqlfmTlXpO9CPZCCvgS5wAB2Aq1ONsZgJZ6IbHyiXR0pFkaPsU5Tmfl6XciDTfvmXRWLa7CjrkGTw2YWVImSwTIiG1QxPdMDA8w2MzeHyVVjgL1fPzgwUZGYI7tDdeiOcgRpI7bLiVosEk67nDnu8720FkWcqGV9GoS5PiVmlKaLbA7OkTta6LZf7XmkBR0DN7qfZgf4IA"
            setPlayer({ ...loggedInPlayer });

            const opponents = result.filter(p => p.id !== id)
            setOpponents(opponents ?? [])
        } catch (err) {
            (err)
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };


    const fetchMatches = async (authToken?: string) => {
        try {
            const response = await fetch(`${baseUrl}/match`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken ?? token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error(`Failed to fetch matches. Status: ${response.status}`);
            const result: MatchData[] = await response.json();
            setMatches(result);
        } catch (err) {
            console.log(err);
        }
    };

    const approveOrRejectMatch = async (matchId: string, action: 'APPROVE' | 'REJECT') => {
        const response = await fetch(`${baseUrl}/match/${matchId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action })
        });
        if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            throw new Error(body.message ?? `Failed to ${action.toLowerCase()} match`);
        }
        await fetchMatches();
    };

    const logMatch = async (request: MatchRequest) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${baseUrl}/match`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)

            });
            if (!response.ok) throw new Error(`Failed to upload the match. Reason:${response.body}`);
            const result = await response.json();

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <GlobalContext.Provider value={{
            isAuthenticated, userId, token, logInWithEmail, logOut,
            error, fetchPlayers, fetchMatches, isLoading, setIsLoading, logMatch, approveOrRejectMatch,
            opponents, player, matches, setError, localAvatarUrl, updateLocalAvatar,
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

