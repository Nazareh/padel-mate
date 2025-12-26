import { createContext, PropsWithChildren, useState, useMemo, useContext } from "react";

type PlayerData = {
    playerId: string | null;
    givenName: string | null;
    familyName: string | null;
    latestRating: number | null;
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
    const baseUrl = "https://kwn86hlgb0.execute-api.ap-southeast-2.amazonaws.com/prod/v1/players";

    const [player, setPlayer] = useState<PlayerData>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${baseUrl}/${id}`);
            if (!response.ok) throw new Error('Failed to fetch player data');

            const result: PlayerData = await response.json();
            setPlayer(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

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

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error("usePlayer must be used within a PlayerProvider");
    }
    return context;
};