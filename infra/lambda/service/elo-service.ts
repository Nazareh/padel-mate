import { Match, Player, SetScore, Team } from "../model.js";

// TODO: adjust K factor based on player's number of games (more games = lower K)
const K_FACTOR = 32;

export type EloUpdate = {
    playerId: string;
    previousRating: number;
    newRating: number;
    delta: number;
};

export function calculateEloUpdates(match: Match, players: Player[]): EloUpdate[] {
    const playerMap = new Map(players.map((p) => [p.id, p]));

    const team1Players = match.players.filter((mp) => mp.team === Team.TEAM_1);
    const team2Players = match.players.filter((mp) => mp.team === Team.TEAM_2);

    const avgRating = (teamPlayerIds: string[]): number => {
        const ratings = teamPlayerIds.map((id) => playerMap.get(id)?.latestRating ?? 1000);
        return ratings.reduce((a, b) => a + b, 0) / ratings.length;
    };

    const team1Avg = avgRating(team1Players.map((p) => p.playerId));
    const team2Avg = avgRating(team2Players.map((p) => p.playerId));

    const sets = setsWon(match.scores);
    const result = matchResult(sets);

    const team1Expected = expectedScore(team1Avg, team2Avg);
    const team2Expected = expectedScore(team2Avg, team1Avg);

    const team1Delta = K_FACTOR * (result.team1 - team1Expected);
    const team2Delta = K_FACTOR * (result.team2 - team2Expected);

    const updates: EloUpdate[] = [];

    for (const mp of team1Players) {
        const player = playerMap.get(mp.playerId);
        if (!player) continue;
        const previousRating = player.latestRating;
        const newRating = Math.round(previousRating + team1Delta);
        updates.push({ playerId: mp.playerId, previousRating, newRating, delta: newRating - previousRating });
    }

    for (const mp of team2Players) {
        const player = playerMap.get(mp.playerId);
        if (!player) continue;
        const previousRating = player.latestRating;
        const newRating = Math.round(previousRating + team2Delta);
        updates.push({ playerId: mp.playerId, previousRating, newRating, delta: newRating - previousRating });
    }

    return updates;
}


function expectedScore(ratingA: number, ratingB: number): number {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

function setsWon(scores: SetScore[]): { team1: number; team2: number } {
    return scores.reduce(
        (acc, set) => ({
            team1: acc.team1 + (set.team1 > set.team2 ? 1 : 0),
            team2: acc.team2 + (set.team2 > set.team1 ? 1 : 0),
        }),
        { team1: 0, team2: 0 }
    );
}

function matchResult(sets: { team1: number; team2: number }): { team1: number; team2: number } {
    if (sets.team1 > sets.team2) return { team1: 1, team2: 0 };
    if (sets.team2 > sets.team1) return { team1: 0, team2: 1 };
    return { team1: 0.5, team2: 0.5 };
}