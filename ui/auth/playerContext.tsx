import { createContext, PropsWithChildren, useState, useMemo, useContext, useEffect } from "react";
import { AuthContext, useAuthContext } from "./authContext";

type PlayerData = {
    playerId: string | null;
    givenName: string | null;
    familyName: string | null;
    latestRating: number | null;
    trendValue: number | null;
    avatarUrl: string | null;
}

type PlayerContextType = {
    player: PlayerData | undefined;
    loading: boolean;
    error: string | null;
    fetchData: (id: string) => Promise<void>;
}

// 3. Initialize with the correct type
export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: PropsWithChildren) {

    const { userId, isAuthenticated } = useAuthContext();

    const baseUrl = "https://kwn86hlgb0.execute-api.ap-southeast-2.amazonaws.com/prod/v1/players";

    const [player, setPlayer] = useState<PlayerData>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${baseUrl}/${id}`, {
                method: 'GET',
                headers: {
                    //     'Authorization': `Bearer ${token}`, // Pass the Amplify JWT
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Failed to fetch player data');

            const result: PlayerData = await response.json();
            result.avatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuAYoKwAo7DWpPFkockZCdu3uocG0MVC5hyTQnzuY3hGZIW9cZAH0PUwXh8R3Td2atRJhwqlfmTlXpO9CPZCCvgS5wAB2Aq1ONsZgJZ6IbHyiXR0pFkaPsU5Tmfl6XciDTfvmXRWLa7CjrkGTw2YWVImSwTIiG1QxPdMDA8w2MzeHyVVjgL1fPzgwUZGYI7tDdeiOcgRpI7bLiVosEk67nDnu8720FkWcqGV9GoS5PiVmlKaLbA7OkTta6LZf7XmkBR0DN7qfZgf4IA"

            setPlayer({ ...result });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && userId) {
            fetchData(userId);
        } else if (!isAuthenticated) {
            setPlayer(undefined);
        }
    }, [userId, isAuthenticated]);

    const value = useMemo(() => ({
        player,
        loading,
        error,
        fetchData
    }), [player, loading, error]);

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