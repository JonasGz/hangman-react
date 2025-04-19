export class Player {
    readonly id: string;

    name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    clone() {
        return new Player(this.id, this.name);
    }
}

export type IPlayerRepository = {
    find(id: Player['id']): Player | null;
    findAll(): Player[];
    save(player: Player): void;
    delete(id: Player['id']): boolean;
};
