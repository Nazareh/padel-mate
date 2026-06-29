import { findPlayerById } from "../repository/player-repository.js";
import { saveMatch } from "../repository/match-repository.js";
import { nanoid } from "nanoid";
import { LogMatchRequest, Match, MatchStatus, Player, SetScore, Team } from "../model.js";

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

    if (match.status != MatchStatus.INVALID) {
        console.log(`Saving match ${JSON.stringify(match)}`);
        saveMatch(match)
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

    let winnerTeam: Team | undefined = undefined;

    match.scores.forEach((score) => {
        const setWinner = getSetWinner(score);

        if (!winnerTeam) winnerTeam = getSetWinner(score);
        else if (winnerTeam && winnerTeam != setWinner) winnerTeam = undefined;
    });

    return winnerTeam;
}

const getSetWinner = (score: SetScore) =>
    Number(score.team1) > Number(score.team2)
        ? Team.TEAM_1
        : Team.TEAM_2;

