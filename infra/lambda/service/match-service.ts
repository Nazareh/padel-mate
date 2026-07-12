import { findPlayerById } from "../repository/player-repository.js";
import { findAllMatchesForPlayer, findMatchById, saveMatch } from "../repository/match-repository.js";
import { updatePlayerStats } from "./stats-service.js";
import { nanoid } from "nanoid";
import { LogMatchRequest, Match, MatchPlayer, MatchStatus, Player, SetScore, Team } from "../model.js";

export async function processMatch(request: LogMatchRequest, requestedBy: String): Promise<Match> {

    const {
        startTime,
        team1Player1,
        team1Player2,
        team2Player1,
        team2Player2,
        ...otherPostMatchDtoProps
    } = request;

    let match: Match = {
        id: nanoid(),
        players: [
            {
                playerId: team1Player1, team: Team.TEAM_1,
                matchStatus: team1Player1 === requestedBy ? MatchStatus.APPROVED : MatchStatus.PENDING
            },
            {
                playerId: team1Player2, team: Team.TEAM_1,
                matchStatus: team1Player2 === requestedBy ? MatchStatus.APPROVED : MatchStatus.PENDING
            },
            {
                playerId: team2Player1, team: Team.TEAM_2,
                matchStatus: team2Player1 === requestedBy ? MatchStatus.APPROVED : MatchStatus.PENDING
            },
            {
                playerId: team2Player2, team: Team.TEAM_2,
                matchStatus: team2Player1 === requestedBy ? MatchStatus.APPROVED : MatchStatus.PENDING
            },
        ],
        startTime: startTime.toISOString(),
        status: MatchStatus.PENDING,
        reason: "Match approved automatically",
        ...otherPostMatchDtoProps,
    };

    if (match.status == MatchStatus.PENDING && startTime > new Date()) {
        match.status = MatchStatus.INVALID;
        match.reason = "Future matches cannot have a result";
    }

    if (match.status == MatchStatus.PENDING && validateDistinctPlayers(match) == false) {
        match.status = MatchStatus.INVALID;
        match.reason = "Four distinct players are needed";
    }

    if (match.status == MatchStatus.PENDING && match.scores.some(score => !isSetScoreValid(score))) {
        match.status = MatchStatus.INVALID;
        match.reason = "Match contains an invalid score";
    }

    if (match.status == MatchStatus.PENDING && getWinnerTeam(match) == undefined) {
        match;
        match.status = MatchStatus.INVALID;
        match.reason = "Cannot determine a winner team. Draws are not allowed.";
    }

    let players: Player[] = [];

    if (match.status == MatchStatus.PENDING) {
        for (var player of match.players) {
            const savedPlayer = await findPlayerById(player.playerId);
            players.push(savedPlayer);
        }
    }

    console.log("before saving match", match)
    if (match.status != MatchStatus.INVALID) {
        console.log(`Saving match ${JSON.stringify(match)}`);
        try {
            await saveMatch(match)
            console.log('Match saved', { id: match.id });
        } catch (err) {
            console.error('Failed to save match ${match}', err);
            throw err; // let Cognito know the trigger failed
        }
    }

    return match;
}

function validateDistinctPlayers(match: Match): boolean {
    return (
        match.players
            .map((player) => player.playerId)
            .filter((id) => id.trim() !== "")
            .reduce((set, id) => set.add(id), new Set<string>()).size === 4
    );
}

function isSetScoreValid(score: SetScore): boolean {
    return (
        score.team1 >= 0 &&
        score.team2 >= 0 &&
        score.team1 + score.team2 > 0 &&
        score.team1 !== score.team2
    );
}

function getWinnerTeam(match: Match): Team | undefined {
    if (match.scores == undefined || match.scores.length == 0) {
        console.log("SetResult array is empty or undefined:", match.scores);
        return undefined;
    }

    let team1Sets = 0;
    let team2Sets = 0;

    match.scores.forEach((score) => {
        const setWinner = getSetWinner(score);
        if (setWinner === Team.TEAM_1) team1Sets++;
        else if (setWinner === Team.TEAM_2) team2Sets++;
    });

    if (team1Sets > team2Sets) return Team.TEAM_1;
    if (team2Sets > team1Sets) return Team.TEAM_2;
    return undefined; // tie in sets won, can't determine a winner
}

const getSetWinner = (score: SetScore) =>
    Number(score.team1) > Number(score.team2)
        ? Team.TEAM_1
        : Team.TEAM_2;

export async function getMatchesForPlayer(playerId: string): Promise<Match[]> {
    return findAllMatchesForPlayer(playerId);
}

export async function updateMatchStatus(matchId: string, playerId: string, action: 'APPROVE' | 'REJECT'): Promise<Match> {
    const match = await findMatchById(matchId);

    if (match.status !== MatchStatus.PENDING) {
        throw new MatchAlreadySettledError(`Match is already ${match.status}`);
    }

    const playerEntry = match.players.find(p => p.playerId === playerId);
    if (!playerEntry) {
        throw new PlayerNotInMatchError(`Player is not part of this match`);
    }

    if (playerEntry.matchStatus !== MatchStatus.PENDING) {
        throw new MatchAlreadySettledError(`Player has already ${playerEntry.matchStatus.toLowerCase()} this match`);
    }

    playerEntry.matchStatus = action === 'APPROVE' ? MatchStatus.APPROVED : MatchStatus.REJECTED;
    match.status = computeAggregateStatus(match.players);

    await saveMatch(match);

    if (match.status === MatchStatus.APPROVED) {
        await updatePlayerStats(match);
    }

    return match;
}

function computeAggregateStatus(players: MatchPlayer[]): MatchStatus {
    if (players.some(p => p.matchStatus === MatchStatus.REJECTED)) {
        return MatchStatus.REJECTED;
    }

    const team1Approved = players.some(p => p.team === Team.TEAM_1 && p.matchStatus === MatchStatus.APPROVED);
    const team2Approved = players.some(p => p.team === Team.TEAM_2 && p.matchStatus === MatchStatus.APPROVED);

    if (team1Approved && team2Approved) {
        return MatchStatus.APPROVED;
    }

    return MatchStatus.PENDING;
}

export class MatchAlreadySettledError extends Error {}
export class PlayerNotInMatchError extends Error {}

