import { IMatchRepository, Match, MatchState } from '../data/match';
import { IPlayerRepository, Player } from '../data/player';
import { EventBus } from '../../types';

export type MatchServiceEvents = {
    'match:register': ({ match }: { match: Match }) => void;
    'match:challenge': ({ match, challenger }: { match: Match; challenger: Player }) => void;
    'match:finish': ({ match }: { match: Match }) => void;
};

export class MatchService {
    private eventEmitter: EventBus<MatchServiceEvents>;
    private playerRepository: IPlayerRepository;
    private matchRepository: IMatchRepository;

    constructor(eventEmitter: EventBus<MatchServiceEvents>, playerRepository: IPlayerRepository, matchRepository: IMatchRepository) {
        this.eventEmitter = eventEmitter;
        this.playerRepository = playerRepository;
        this.matchRepository = matchRepository;
    }

    register(host_id: Player['id']) {
        const host = this.playerRepository.find(host_id);
        if (host == null) throw new Error('Player not found');

        const match = new Match(crypto.randomUUID(), new Date(), MatchState.WAITING, host.id, null);
        this.matchRepository.save(match);

        this.eventEmitter.emit('match:register', { match });

        return match;
    }

    challenge(match_id: Match['id'], challenger_id: Player['id']) {
        const challenger = this.playerRepository.find(challenger_id);
        if (challenger == null) throw new Error('Player not found');

        const match = this.matchRepository.find(match_id);
        if (match == null) throw new Error('Match not found');
        if (match.state !== MatchState.WAITING) throw new Error('Match is not in waiting state');
        if (match.challenger != null) throw new Error('Match already has a challenger');
        if (match.host === challenger.id) throw new Error('You cannot challenge yourself');

        match.challenger = challenger.id;
        match.state = MatchState.PLAYING;

        this.matchRepository.save(match);

        this.eventEmitter.emit('match:challenge', { match, challenger });

        return match;
    }

    finish(host_id: Player['id'], match_id: Match['id']) {
        const host = this.playerRepository.find(host_id);
        if (host == null) throw new Error('Player not found');

        const match = this.matchRepository.find(match_id);
        if (match == null) throw new Error('Match not found');
        if (match.state !== MatchState.PLAYING) throw new Error('Match is not in playing state');
        if (match.host !== host.id) throw new Error('You are not the host of this match');

        match.state = MatchState.FINISHED;

        this.matchRepository.save(match);

        this.eventEmitter.emit('match:finish', { match });

        return match;
    }
}
