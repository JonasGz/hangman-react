import { IPlayerRepository, Player } from '../data/player';
import { EventBus } from '../../types';

export type PlayerServiceEvents = {
    'player:register': (player: Player) => void;
};

export class PlayerService {
    private eventEmitter: EventBus<PlayerServiceEvents>;
    private playerRepository: IPlayerRepository;

    constructor(eventEmitter: EventBus<PlayerServiceEvents>, playerRepository: IPlayerRepository) {
        this.eventEmitter = eventEmitter;
        this.playerRepository = playerRepository;
    }

    register(name: string) {
        const player = new Player(crypto.randomUUID(), name);

        this.playerRepository.save(player);

        this.eventEmitter.emit('player:register', player);

        return player;
    }
}
