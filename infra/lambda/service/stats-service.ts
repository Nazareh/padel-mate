import { BestPartner, Match, Player, PlayerStats, RatingPoint, Team, ToughestOpponent } from "../model.js";
import { calculateEloUpdates, EloUpdate } from "./elo-service.js";
import { findPlayerById, savePlayer } from "../repository/player-repository.js";

const RECENT_FORM_SIZE = 5;
const RATING_HISTORY_SIZE = 10;

export async function updatePlayerStats(match: Match): Promise<void> {
    const players = await Promise.all(
        match.players.map(mp => findPlayerById(mp.playerId))
    );

    const eloUpdates = calculateEloUpdates(match, players);

    const playerMap = new Map(players.map(p => [p.id, p]));
    const eloMap = new Map(eloUpdates.map(u => [u.playerId, u]));

    const team1Ids = new Set(match.players.filter(mp => mp.team === Team.TEAM_1).map(mp => mp.playerId));
    const team2Ids = new Set(match.players.filter(mp => mp.team === Team.TEAM_2).map(mp => mp.playerId));

    const sets = countSets(match);
    const team1Won = sets.team1 > sets.team2;

    const updatedPlayers = players.map(player => {
        const onTeam1 = team1Ids.has(player.id);
        const won = onTeam1 ? team1Won : !team1Won;
        const setsWonThisMatch = onTeam1 ? sets.team1 : sets.team2;
        const setsLostThisMatch = onTeam1 ? sets.team2 : sets.team1;

        const partnerIds = (onTeam1 ? [...team1Ids] : [...team2Ids]).filter(id => id !== player.id);
        const opponentIds = onTeam1 ? [...team2Ids] : [...team1Ids];

        const elo = eloMap.get(player.id)!;
        const stats = buildUpdatedStats(
            player, won, setsWonThisMatch, setsLostThisMatch,
            partnerIds, opponentIds, playerMap, match.id, elo
        );

        return { ...player, latestRating: elo.newRating, trendValue: elo.delta, stats } as Player;
    });

    await Promise.all(updatedPlayers.map(p => savePlayer(p)));
}

function countSets(match: Match): { team1: number; team2: number } {
    return match.scores.reduce(
        (acc, set) => ({
            team1: acc.team1 + (set.team1 > set.team2 ? 1 : 0),
            team2: acc.team2 + (set.team2 > set.team1 ? 1 : 0),
        }),
        { team1: 0, team2: 0 }
    );
}

function buildUpdatedStats(
    player: Player,
    won: boolean,
    setsWonThisMatch: number,
    setsLostThisMatch: number,
    partnerIds: string[],
    opponentIds: string[],
    playerMap: Map<string, Player>,
    matchId: string,
    elo: EloUpdate
): PlayerStats {
    const prev = player.stats ?? emptyStats();

    const totalGames = prev.totalGames + 1;
    const wins = prev.wins + (won ? 1 : 0);
    const losses = prev.losses + (won ? 0 : 1);
    const setsWon = prev.setsWon + setsWonThisMatch;
    const setsLost = prev.setsLost + setsLostThisMatch;

    let currentStreak: number;
    if (won) {
        currentStreak = prev.currentStreak >= 0 ? prev.currentStreak + 1 : 1;
    } else {
        currentStreak = prev.currentStreak <= 0 ? prev.currentStreak - 1 : -1;
    }

    const recentForm = ([...prev.recentForm, won ? 'W' : 'L'] as ('W' | 'L')[]).slice(-RECENT_FORM_SIZE);

    const ratingPoint: RatingPoint = { matchId, rating: elo.newRating, date: new Date().toISOString() };
    const ratingHistory = [...prev.ratingHistory, ratingPoint].slice(-RATING_HISTORY_SIZE);

    const partnerRecords = updatePartnerRecords(prev.partnerRecords, partnerIds, playerMap, won);
    const opponentRecords = updateOpponentRecords(prev.opponentRecords, opponentIds, playerMap, won);
    const bestPartner = deriveBestPartner(partnerRecords);
    const toughestOpponent = deriveToughestOpponent(opponentRecords);

    return { totalGames, wins, losses, setsWon, setsLost, currentStreak, recentForm, ratingHistory, partnerRecords, opponentRecords, bestPartner, toughestOpponent };
}

function updatePartnerRecords(
    records: PlayerStats['partnerRecords'],
    partnerIds: string[],
    playerMap: Map<string, Player>,
    won: boolean
): PlayerStats['partnerRecords'] {
    const updated = records.map(r => ({ ...r }));
    for (const partnerId of partnerIds) {
        const partner = playerMap.get(partnerId);
        if (!partner) continue;
        const existing = updated.find(r => r.playerId === partnerId);
        if (existing) {
            existing.gamesPlayed += 1;
            if (won) existing.wins += 1;
        } else {
            updated.push({ playerId: partnerId, name: `${partner.givenName} ${partner.familyName}`, gamesPlayed: 1, wins: won ? 1 : 0 });
        }
    }
    return updated;
}

function updateOpponentRecords(
    records: PlayerStats['opponentRecords'],
    opponentIds: string[],
    playerMap: Map<string, Player>,
    won: boolean
): PlayerStats['opponentRecords'] {
    const updated = records.map(r => ({ ...r }));
    for (const opponentId of opponentIds) {
        const opponent = playerMap.get(opponentId);
        if (!opponent) continue;
        const existing = updated.find(r => r.playerId === opponentId);
        if (existing) {
            existing.gamesAgainst += 1;
            if (!won) existing.theirWins += 1;
        } else {
            updated.push({ playerId: opponentId, name: `${opponent.givenName} ${opponent.familyName}`, gamesAgainst: 1, theirWins: won ? 0 : 1 });
        }
    }
    return updated;
}

function deriveBestPartner(records: PlayerStats['partnerRecords']): BestPartner | null {
    if (records.length === 0) return null;
    const best = records.reduce((a, b) => (a.wins / a.gamesPlayed) >= (b.wins / b.gamesPlayed) ? a : b);
    return { playerId: best.playerId, name: best.name, gamesPlayed: best.gamesPlayed, winRate: Math.round((best.wins / best.gamesPlayed) * 100) };
}

function deriveToughestOpponent(records: PlayerStats['opponentRecords']): ToughestOpponent | null {
    if (records.length === 0) return null;
    const toughest = records.reduce((a, b) => (a.theirWins / a.gamesAgainst) >= (b.theirWins / b.gamesAgainst) ? a : b);
    return { playerId: toughest.playerId, name: toughest.name, gamesAgainst: toughest.gamesAgainst, theirWinRate: Math.round((toughest.theirWins / toughest.gamesAgainst) * 100) };
}

function emptyStats(): PlayerStats {
    return {
        totalGames: 0,
        wins: 0,
        losses: 0,
        setsWon: 0,
        setsLost: 0,
        currentStreak: 0,
        recentForm: [],
        ratingHistory: [],
        partnerRecords: [],
        opponentRecords: [],
        bestPartner: null,
        toughestOpponent: null,
    };
}
