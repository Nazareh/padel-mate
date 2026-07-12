export type SetScore = {
    team1: number,
    team2: number,
}

export enum Team { TEAM_1 = "TEAM_1", TEAM_2 = "TEAM_2" }

export type LogMatchRequest = {
    startTime: Date
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

export type RatingPoint = {
    matchId: string
    rating: number
    date: string // ISO string
}

export type PartnerRecord = {
    playerId: string
    name: string
    gamesPlayed: number
    wins: number
}

export type OpponentRecord = {
    playerId: string
    name: string
    gamesAgainst: number
    theirWins: number
}

export type BestPartner = {
    playerId: string
    name: string
    gamesPlayed: number
    winRate: number
}

export type ToughestOpponent = {
    playerId: string
    name: string
    gamesAgainst: number
    theirWinRate: number
}

export type PlayerStats = {
    totalGames: number
    wins: number
    losses: number
    setsWon: number
    setsLost: number
    currentStreak: number // positive = win streak, negative = loss streak
    recentForm: ('W' | 'L')[] // last 5, oldest → newest
    ratingHistory: RatingPoint[] // last 10 matches
    partnerRecords: PartnerRecord[]
    opponentRecords: OpponentRecord[]
    bestPartner: BestPartner | null
    toughestOpponent: ToughestOpponent | null
}

export type Player = {
    id: string
    givenName: string
    familyName: string
    latestRating: number
    trendValue?: number
    stats?: PlayerStats
}