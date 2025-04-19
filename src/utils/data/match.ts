import { Player } from './player';

export enum MatchState {
    WAITING = 'WAITING',
    PLAYING = 'PLAYING',
    FINISHED = 'FINISHED',
}

export class Match {
    readonly id: string;

    date: Date;
    state: MatchState;

    host: Player['id'];
    challenger: Player['id'] | null;

    constructor(id: string, date: Date, state: MatchState, host: Player['id'], challenger: Player['id'] | null) {
        this.id = id;
        this.date = date;
        this.state = state;
        this.host = host;
        this.challenger = challenger;
    }

    clone() {
        return new Match(this.id, new Date(this.date), this.state, this.host, this.challenger);
    }
}

export type IMatchRepository = {
    find(id: Match['id']): Match | null;
    findAll(): Match[];
    save(match: Match): void;
    delete(id: Match['id']): boolean;
};
