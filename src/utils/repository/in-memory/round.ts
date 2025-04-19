import { IRoundRepository, Round } from '../../data/round';

export class InMemoryRoundRepository implements IRoundRepository {
    private store = new Map<Round['id'], Round>();

    find(id: Round['id']): Round | null {
        return this.store.get(id)?.clone() ?? null;
    }

    findAll(): Round[] {
        return Array.from(this.store.values()).map((round) => round.clone());
    }

    save(round: Round): void {
        this.store.set(round.id, round.clone());
    }

    delete(id: Round['id']): boolean {
        return this.store.delete(id);
    }
}
