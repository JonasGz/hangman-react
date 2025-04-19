import { IMatchRepository, Match } from '../../data/match';

export class InMemoryMatchRepository implements IMatchRepository {
    private store = new Map<Match['id'], Match>();

    find(id: Match['id']): Match | null {
        return this.store.get(id)?.clone() ?? null;
    }

    findAll(): Match[] {
        return Array.from(this.store.values()).map((match) => match.clone());
    }

    save(match: Match): void {
        this.store.set(match.id, match.clone());
    }

    delete(id: Match['id']): boolean {
        return this.store.delete(id);
    }
}
