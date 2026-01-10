import { createContext, PropsWithChildren, useState, useMemo, useContext, useEffect } from "react";
import { AuthContext, useAuthContext } from "./authContext";

type PlayerData = {
    id: string;
    givenName: string;
    familyName: string;
    latestRating: number;
    trendValue: number | null;
    avatarUrl: string | null;
}

type PlayerContextType = {
    player: PlayerData | undefined;
    opponents: PlayerData[];
    isLoading: boolean;
    error: string | null;
    fetchData: (id: string) => Promise<void>;
    logMatch: (matchRequest: MatchRequest) => Promise<void>;
}

export type ScoreRequest = {
    team1: number,
    team2: number
}

export type MatchRequest = {
    startTime: Date,
    isRated: boolean,
    team1Player1: string,
    team1Player2: string,
    team2Player1: string,
    team2Player2: string,
    scores: ScoreRequest[]
}

// 3. Initialize with the correct type
export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: PropsWithChildren) {

    const { userId, isAuthenticated, token } = useAuthContext();

    const baseUrl = "https://kwn86hlgb0.execute-api.ap-southeast-2.amazonaws.com/prod/v1";

    const [player, setPlayer] = useState<PlayerData>();
    const [opponents, setOpponents] = useState<PlayerData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log("Fetching player info...")
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

    useEffect(() => {
        if (isAuthenticated && userId) {
            fetchData(userId);
        } else if (!isAuthenticated) {
            setOpponents([])
            setPlayer(undefined);
        }
    }, [userId, isAuthenticated]);

    const value = useMemo(() => ({
        player,
        isLoading,
        error,
        opponents,
        fetchData,
        logMatch,
    }), [player, isLoading, error, opponents]);

    return (
        <PlayerContext.Provider value={value}>
            {children}
        </PlayerContext.Provider>
    );
}

export const usePlayerContext = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error("usePlayer must be used within a PlayerProvider");
    }
    return context;
};