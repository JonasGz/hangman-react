import { Guess, IGuessRepository } from '../../data/guess';
import { Player } from '../../data/player';
import { Round } from '../../data/round';

export class InMemoryGuessRepository implements IGuessRepository {
    private store = new Map<Guess['id'], Guess>();

    find(id: Guess['id']): Guess | null {
        return this.store.get(id)?.clone() ?? null;
    }

    findAll(): Guess[] {
        return Array.from(this.store.values()).map((guess) => guess.clone());
    }

    findPlayerRoundGuesses(player_id: Player['id'], round_id: Round['id']): Guess[] {
        const guesses = this.findAll();
        // TODO: add cache?
        return guesses.filter((guess) => guess.player === player_id && guess.round === round_id);
    }

    save(guess: Guess): void {
        this.store.set(guess.id, guess.clone());
    }

    delete(id: Guess['id']): boolean {
        return this.store.delete(id);
    }
}
