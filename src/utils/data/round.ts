import { Match } from './match';

export enum RoundState {
    CHOOSE = 'CHOOSE',
    GUESS = 'GUESS',
    FINISHED = 'FINISHED',
}

export class Round {
    readonly id: string;

    date: Date;
    state: RoundState;

    host_word: string | null;
    host_guess: string | null;

    challenger_word: string | null;
    challenger_guess: string | null;

    match: Match['id'];

    constructor(
        id: string,
        date: Date,
        state: RoundState,
        host_word: string | null,
        host_guess: string | null,
        challenger_word: string | null,
        challenger_guess: string | null,
        match: Match['id'],
    ) {
        this.id = id;
        this.date = date;
        this.state = state;
        this.host_word = host_word;
        this.host_guess = host_guess;
        this.challenger_word = challenger_word;
        this.challenger_guess = challenger_guess;
        this.match = match;
    }

    clone() {
        return new Round(
            this.id,
            this.date,
            this.state,
            this.host_word,
            this.host_guess,
            this.challenger_word,
            this.challenger_guess,
            this.match,
        );
    }
}

export type IRoundRepository = {
    find(id: Round['id']): Round | null;
    findAll(): Round[];
    save(round: Round): void;
    delete(id: Round['id']): boolean;
};
