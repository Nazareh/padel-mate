export type SetScore = {
    team1: number,
    team2: number,
}

export enum Team { TEAM_1 = "TEAM_1", TEAM_2 = "TEAM_2" }

export type LogMatchRequest = {
    startTime: Date
    isRated: boolean
    team1Player1: string
    team1Player2: string
    team2Player1: string
    team2Player2: string
    scores: SetScore[]
}

export enum MatchStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    INVALID = "INVALID"
}


export type Match = {
    id: string
    isRated: boolean
    startTime: string
    players: MatchPlayer[]
    scores: SetScore[]
    status: MatchStatus
    reason?: string
}

export type MatchPlayer = {
    playerId: string
    team: Team
    matchStatus: MatchStatus
}

export type Player = {
    id: string
    givenName: string
    familyName: string
    latestRating: number
}