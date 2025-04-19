import { IMatchRepository, Match, MatchState } from '../data/match';
import { IPlayerRepository, Player } from '../data/player';
import { IRoundRepository, Round, RoundState } from '../data/round';
import { EventBus } from '../../types';

export type RoundServiceEvents = {
    'round:register': ({ host, match, round }: { host: Player; match: Match; round: Round }) => void;
    'round:choose': ({
        player,
        round,
        match,
        word,
        isHost,
    }: {
        player: Player;
        round: Round;
        match: Match;
        word: string;
        isHost: boolean;
    }) => void;
    'round:start': ({ round, match }: { round: Round; match: Match }) => void;
    'round:end': ({ round, match }: { round: Round; match: Match }) => void;
};

export class RoundService {
    private eventEmitter: EventBus<RoundServiceEvents>;
    private playerRepository: IPlayerRepository;
    private matchRepository: IMatchRepository;
    private roundRepository: IRoundRepository;

    constructor(
        eventEmitter: EventBus<RoundServiceEvents>,
        playerRepository: IPlayerRepository,
        matchRepository: IMatchRepository,
        roundRepository: IRoundRepository,
    ) {
        this.eventEmitter = eventEmitter;
        this.playerRepository = playerRepository;
        this.matchRepository = matchRepository;
        this.roundRepository = roundRepository;
    }

    register(host_id: Player['id'], match_id: Match['id']) {
        const host = this.playerRepository.find(host_id);
        if (host == null) throw new Error('Player not found');

        const match = this.matchRepository.find(match_id);
        if (match == null) throw new Error('Match not found');
        if (match.state !== MatchState.PLAYING) throw new Error('Match is not in playing state');
        if (match.host !== host.id) throw new Error('You are not the host of this match');

        const round = new Round(crypto.randomUUID(), new Date(), RoundState.CHOOSE, null, null, null, null, match.id);
        this.roundRepository.save(round);

        this.eventEmitter.emit('round:register', { host, match, round });

        return round;
    }

    choose(player_id: Player['id'], round_id: Round['id'], word: string) {
        const player = this.playerRepository.find(player_id);
        if (player == null) throw new Error('Player not found');

        const round = this.roundRepository.find(round_id);
        if (round == null) throw new Error('Round not found');
        if (round.state !== RoundState.CHOOSE) throw new Error('Round is not in choose state');

        const match = this.matchRepository.find(round.match);
        if (match == null) throw new Error('Match not found');
        if (match.state !== MatchState.PLAYING) throw new Error('Match is not in playing state');

        const isHost = match.host === player.id;

        if (isHost && round.host_word !== null) throw new Error('Host already choosed a word');
        if (!isHost && round.challenger_word !== null) throw new Error('Challenger already choosed a word');

        if (isHost) round.host_word = word;
        else round.challenger_word = word;

        const bothChoosed = round.host_word !== null && round.challenger_word !== null;
        if (bothChoosed) round.state = RoundState.GUESS;

        this.roundRepository.save(round);

        this.eventEmitter.emit('round:choose', { player, round, match, word, isHost });
        if (bothChoosed) this.eventEmitter.emit('round:start', { round, match });

        return round;
    }
}
