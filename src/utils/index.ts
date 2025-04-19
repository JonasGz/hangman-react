
import EventEmitter from 'eventemitter3';

import { GuessService, GuessServiceEvents } from './application/guess';
import { MatchService, MatchServiceEvents } from './application/match';
import { PlayerService, PlayerServiceEvents } from './application/player';
import { RoundService, RoundServiceEvents } from './application/round';
import { InMemoryGuessRepository } from './repository/in-memory/guess';
import { InMemoryMatchRepository } from './repository/in-memory/match';
import { InMemoryPlayerRepository } from './repository/in-memory/player';
import { InMemoryRoundRepository } from './repository/in-memory/round';
import { EventBus } from '../types';

const eventEmitter: EventBus<MatchServiceEvents & PlayerServiceEvents & RoundServiceEvents & GuessServiceEvents> = new EventEmitter();
const playerRepository = new InMemoryPlayerRepository();
const matchRepository = new InMemoryMatchRepository();
const roundRepository = new InMemoryRoundRepository();
const guessRepository = new InMemoryGuessRepository();

const matchService = new MatchService(eventEmitter, playerRepository, matchRepository);
const playerService = new PlayerService(eventEmitter, playerRepository);
const roundService = new RoundService(eventEmitter, playerRepository, matchRepository, roundRepository);
const guessService = new GuessService(eventEmitter, playerRepository, matchRepository, roundRepository, guessRepository);

eventEmitter.on('player:register', console.log);

eventEmitter.on('match:register', console.log);
eventEmitter.on('match:challenge', console.log);
eventEmitter.on('match:finish', console.log);

eventEmitter.on('round:register', console.log);
eventEmitter.on('round:choose', console.log);
eventEmitter.on('round:start', console.log);
eventEmitter.on('round:end', console.log);

eventEmitter.on('guess:register', console.log);
eventEmitter.on('guess:match', console.log);

const diogo = playerService.register('Diogo');
const panasonic = playerService.register('Panasonic');

const match = matchService.register(diogo.id);
matchService.challenge(match.id, panasonic.id);

let round_1 = roundService.register(diogo.id, match.id);
round_1 = roundService.choose(diogo.id, round_1.id, 'hello');
round_1 = roundService.choose(panasonic.id, round_1.id, 'world');

guessService.register(diogo.id, round_1.id, 'r');
guessService.register(diogo.id, round_1.id, 'o');
guessService.register(diogo.id, round_1.id, 'w');
guessService.register(diogo.id, round_1.id, 'l');
guessService.register(diogo.id, round_1.id, 'd');

guessService.register(panasonic.id, round_1.id, 'e');
guessService.register(panasonic.id, round_1.id, 'h');
guessService.register(panasonic.id, round_1.id, 'l');
guessService.register(panasonic.id, round_1.id, 'o');

matchService.finish(diogo.id, match.id);
