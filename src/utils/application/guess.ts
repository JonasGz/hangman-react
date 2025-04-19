import { EventBus } from '../../types';
import { Guess, IGuessRepository } from '../data/guess';
import { IMatchRepository, Match, MatchState } from '../data/match';
import { IPlayerRepository, Player } from '../data/player';
import { IRoundRepository, Round, RoundState } from '../data/round';
import { RoundServiceEvents } from './round';

export type GuessServiceEvents = {
    'guess:register': ({
        player,
        round,
        match,
        guess,
        letter,
    }: {
        player: Player;
        round: Round;
        match: Match;
        guess: Guess;
        letter: string;
    }) => void;
    'guess:match': ({
        player,
        round,
        match,
        guess,
        letter,
    }: {
        player: Player;
        round: Round;
        match: Match;
        guess: Guess;
        letter: string;
    }) => void;
};

export class GuessService {
    private eventEmitter: EventBus<GuessServiceEvents & RoundServiceEvents>;
    private playerRepository: IPlayerRepository;
    private matchRepository: IMatchRepository;
    private roundRepository: IRoundRepository;
    private guessRepository: IGuessRepository;

    constructor(
        eventEmitter: EventBus<GuessServiceEvents>,
        playerRepository: IPlayerRepository,
        matchRepository: IMatchRepository,
        roundRepository: IRoundRepository,
        guessRepository: IGuessRepository,
    ) {
        this.eventEmitter = eventEmitter;
        this.playerRepository = playerRepository;
        this.matchRepository = matchRepository;
        this.roundRepository = roundRepository;
        this.guessRepository = guessRepository;
    }

    register(player_id: Player['id'], round_id: Round['id'], letter: string) {
        if (letter.length !== 1) throw new Error('Letter must be a single character');

        const player = this.playerRepository.find(player_id);
        if (player == null) throw new Error('Player not found');

        const round = this.roundRepository.find(round_id);
        if (round == null) throw new Error('Round not found');
        if (round.state !== RoundState.GUESS) throw new Error('Round is not in guess state');

        const match = this.matchRepository.find(round.match);
        if (match == null) throw new Error('Match not found');
        if (match.state !== MatchState.PLAYING) throw new Error('Match is not in playing state');

        const isHost = match.host === player.id;
        const player_guess = (isHost ? round.host_guess! : round.challenger_guess!) ?? '';
        const adversary_word = isHost ? round.challenger_word! : round.host_word!;

        if (player_guess === adversary_word) throw new Error('Player already guessed the word');

        const guesses = this.guessRepository.findPlayerRoundGuesses(player.id, round.id);
        const letterAlreadyGuessed = guesses.some((guess) => guess.letter === letter);
        if (letterAlreadyGuessed) throw new Error('Player already guessed this letter');

        const guess = new Guess(crypto.randomUUID(), new Date(), letter, player.id, round.id);
        const player_guesses = guesses.concat(guess);

        const new_player_guess = adversary_word
            .split('')
            .map((word_letter) => (player_guesses.find((guess) => guess.letter === word_letter) ? word_letter : null))
            .join('');

        if (isHost) round.host_guess = new_player_guess;
        else round.challenger_guess = new_player_guess;

        const bothGuessed = round.host_guess === round.challenger_word && round.challenger_guess === round.host_word;
        if (bothGuessed) round.state = RoundState.FINISHED;

        this.guessRepository.save(guess);
        this.roundRepository.save(round);

        this.eventEmitter.emit('guess:register', { player, round, match, guess, letter });
        if (new_player_guess === adversary_word) this.eventEmitter.emit('guess:match', { player, round, match, guess, letter });
        if (bothGuessed) this.eventEmitter.emit('round:end', { round, match });

        return guess;
    }
}
