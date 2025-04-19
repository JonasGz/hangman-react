import { IPlayerRepository, Player } from '../../data/player';

export class InMemoryPlayerRepository implements IPlayerRepository {
    private store = new Map<Player['id'], Player>();

    find(id: Player['id']): Player | null {
        return this.store.get(id)?.clone() ?? null;
    }

    findAll(): Player[] {
        return Array.from(this.store.values()).map((player) => player.clone());
    }

    save(player: Player): void {
        this.store.set(player.id, player.clone());
    }

    delete(id: Player['id']): boolean {
        return this.store.delete(id);
    }
}
