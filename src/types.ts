export interface PlayerData {
    id: number,
    name: string,
    surname: string,
    birthday: string,
}

export interface Player {
    id: number,
    name: string,
    surname: string,
    birthday: string,
    fio: string
}

export interface Group {
    group_id: number,
    players: Player[]
}

export interface PlayerGroupRecord {
    player_id: number,
    group_id: number
}