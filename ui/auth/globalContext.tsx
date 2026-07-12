import { fetchAuthSession, getCurrentUser, signIn, signOut } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { CONFIG } from "@/constants/config";
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
    selectedOpponent: PlayerData | null;
    setSelectedOpponent: (player: PlayerData | null) => void;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    setError: Dispatch<SetStateAction<string | null>>;
};

export type PlayerStats = {
    totalGames: number;
    wins: number;
    losses: number;
    setsWon: number;
    setsLost: number;
    currentStreak: number;
    recentForm: ('W' | 'L')[];
    ratingHistory: { matchId: string; rating: number; date: string }[];
    bestPartner: { playerId: string; name: string; gamesPlayed: number; winRate: number } | null;
    toughestOpponent: { playerId: string; name: string; gamesAgainst: number; theirWinRate: number } | null;
};

export type PlayerData = {
    id: string;
    givenName: string;
    familyName: string;
    latestRating: number;
    trendValue: number | null;
    avatarUrl: string | null;
    stats: PlayerStats | null;
}

export const GlobalContext = createContext<GlobalState | undefined>(undefined);

export function GlobalStateProvider({ children }: PropsWithChildren) {

    const baseUrl = CONFIG.apiBaseUrl;

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
    const [selectedOpponent, setSelectedOpponent] = useState<PlayerData | null>(null);

    const updateLocalAvatar = (url: string | null) => setLocalAvatarUrl(url);

    const forceSignOut = async () => {
        try { await signOut({ global: true }); } catch (_) {}
        setIsAuthenticated(false);
        setUserId(null);
        setToken(null);
    };

    // Helper to get session data and update state
    const refreshUserSession = async () => {
        try {
            const user = await getCurrentUser();
            const session = await fetchAuthSession();

            const newToken = session.tokens?.idToken?.toString() ?? null;

            // username matches event.userName used by the onboard Lambda as the player _id.
            // For Google users userId is the Cognito sub (UUID), which differs from the stored id.
            setUserId(user.username);
            setToken(newToken);
            setIsAuthenticated(true);
            setError(null);
            fetchPlayers(user.username, newToken ?? undefined);
            fetchMatches(newToken ?? undefined);

        } catch (_) {
            // Session missing or refresh token expired — redirect to login silently
            await forceSignOut();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshUserSession();

        const unsubscribe = Hub.listen('auth', ({ payload }) => {
            if (payload.event === 'signedIn') refreshUserSession();
        });

        return unsubscribe;
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
            if (response.status === 401) { await forceSignOut(); return; }
            if (!response.ok) throw new Error(`Failed to fetch players data. Status Code: ${response.status}`);
            const result: PlayerData[] = await response.json();

            const loggedInPlayer = result.find(p => p.id === id)!;
            setPlayer({ ...loggedInPlayer });
            setOpponents(result.filter(p => p.id !== id));
        } catch (err) {
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
            if (response.status === 401) { await forceSignOut(); return; }
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
        if (response.status === 401) { await forceSignOut(); return; }
        if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            throw new Error(body.message ?? `Failed to ${action.toLowerCase()} match`);
        }
        await fetchMatches();
        if (action === 'APPROVE' && userId) {
            await fetchPlayers(userId);
        }
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
            if (response.status === 401) { await forceSignOut(); return; }
            if (!response.ok) throw new Error(`Failed to upload the match. Reason:${response.body}`);
            await response.json();
            await fetchMatches();

        } catch (err) {
            throw err instanceof Error ? err : new Error('An error occurred');
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <GlobalContext.Provider value={{
            isAuthenticated, userId, token, logInWithEmail, logOut,
            error, fetchPlayers, fetchMatches, isLoading, setIsLoading, logMatch, approveOrRejectMatch,
            opponents, player, matches, setError, localAvatarUrl, updateLocalAvatar,
            selectedOpponent, setSelectedOpponent,
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

