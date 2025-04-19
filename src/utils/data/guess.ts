import { Player } from './player';
import { Round } from './round';

export class Guess {
    readonly id: string;

    date: Date;

    letter: string;

    player: Player['id'];
    round: Round['id'];

    constructor(id: string, date: Date, letter: string, player: Player['id'], round: Round['id']) {
        this.id = id;
        this.date = date;
        this.letter = letter;
        this.player = player;
        this.round = round;
    }

    clone() {
        return new Guess(this.id, this.date, this.letter, this.player, this.round);
    }
}

export type IGuessRepository = {
    find(id: Guess['id']): Guess | null;
    findAll(): Guess[];
    findPlayerRoundGuesses(player_id: Player['id'], round_id: Round['id']): Guess[];
    save(guess: Guess): void;
    delete(id: Guess['id']): boolean;
};
