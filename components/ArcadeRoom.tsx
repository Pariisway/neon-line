import { useState } from 'react';
import { Gamepad2, Trophy, RotateCcw } from 'lucide-react';
import { AdSense } from './AdSense';

export function ArcadeRoom() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white">
      <AdSense slot="arcade-top" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 
            className="text-4xl mb-4"
            style={{
              fontFamily: 'monospace',
              textShadow: '0 0 20px rgba(255, 0, 255, 0.8), 0 0 40px rgba(255, 0, 255, 0.5)'
            }}
          >
            ARCADE ROOM
          </h2>
          <p className="text-magenta-400/70">No login required - Just pick a game and play!</p>
        </div>

        {!selectedGame ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <GameCard
              title="Neon Clicker"
              description="Click as fast as you can!"
              color="from-cyan-500 to-blue-500"
              onClick={() => setSelectedGame('clicker')}
            />
            <GameCard
              title="Memory Grid"
              description="Test your memory skills"
              color="from-magenta-500 to-pink-500"
              onClick={() => setSelectedGame('memory')}
            />
            <GameCard
              title="Number Guesser"
              description="Guess the secret number"
              color="from-yellow-500 to-orange-500"
              onClick={() => setSelectedGame('guess')}
            />
            <GameCard
              title="Reaction Time"
              description="How fast are your reflexes?"
              color="from-green-500 to-cyan-500"
              onClick={() => setSelectedGame('reaction')}
            />
            <GameCard
              title="Color Match"
              description="Match the colors quickly"
              color="from-purple-500 to-blue-500"
              onClick={() => setSelectedGame('color')}
            />
            <GameCard
              title="Word Scramble"
              description="Unscramble the word"
              color="from-red-500 to-pink-500"
              onClick={() => setSelectedGame('word')}
            />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => {
                setSelectedGame(null);
                setScore(0);
              }}
              className="mb-4 px-4 py-2 bg-cyan-500/20 border border-cyan-500 text-cyan-400 rounded hover:bg-cyan-500/30 transition-all"
            >
              ← Back to Games
            </button>
            
            {selectedGame === 'clicker' && <ClickerGame score={score} setScore={setScore} />}
            {selectedGame === 'memory' && <MemoryGame score={score} setScore={setScore} />}
            {selectedGame === 'guess' && <GuessGame score={score} setScore={setScore} />}
            {selectedGame === 'reaction' && <ReactionGame score={score} setScore={setScore} />}
            {selectedGame === 'color' && <ColorMatchGame score={score} setScore={setScore} />}
            {selectedGame === 'word' && <WordScrambleGame score={score} setScore={setScore} />}
          </div>
        )}
      </div>

      <div className="mt-8">
        <AdSense slot="arcade-bottom" />
      </div>
    </div>
  );
}

function GameCard({ title, description, color, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="p-6 rounded-lg border-2 border-magenta-500/30 hover:border-magenta-500 bg-black/30 transition-all hover:scale-105 text-left"
    >
      <Gamepad2 className="w-8 h-8 text-magenta-400 mb-3" />
      <h3 className="text-xl mb-2">{title}</h3>
      <p className="text-sm text-magenta-400/70">{description}</p>
    </button>
  );
}

function ClickerGame({ score, setScore }: any) {
  const [timeLeft, setTimeLeft] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);

  const startGame = () => {
    setScore(0);
    setTimeLeft(10);
    setIsPlaying(true);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="bg-black/50 border-2 border-cyan-500/50 rounded-lg p-8 text-center">
      <h3 className="text-3xl mb-4 text-cyan-400">Neon Clicker</h3>
      <p className="text-cyan-400/70 mb-6">Click the button as many times as you can in 10 seconds!</p>
      
      <div className="mb-6">
        <div className="text-5xl mb-2">{score}</div>
        <div className="text-cyan-400/70">Clicks</div>
      </div>

      {isPlaying && (
        <div className="text-2xl text-yellow-400 mb-6">
          Time Left: {timeLeft}s
        </div>
      )}

      {!isPlaying ? (
        <button
          onClick={startGame}
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 text-black rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
        >
          {score > 0 ? 'Play Again' : 'Start Game'}
        </button>
      ) : (
        <button
          onClick={() => setScore(score + 1)}
          className="w-64 h-64 mx-auto bg-gradient-to-br from-cyan-500 to-magenta-500 rounded-full text-4xl hover:scale-110 transition-all shadow-2xl shadow-cyan-500/50 animate-pulse"
        >
          CLICK!
        </button>
      )}
    </div>
  );
}

function MemoryGame({ score, setScore }: any) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isShowing, setIsShowing] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const colors = ['bg-cyan-500', 'bg-magenta-500', 'bg-yellow-500', 'bg-green-500'];

  const startGame = () => {
    setScore(0);
    setSequence([]);
    setUserSequence([]);
    setGameStarted(true);
    addToSequence([]);
  };

  const addToSequence = (currentSeq: number[]) => {
    const newNumber = Math.floor(Math.random() * 4);
    const newSeq = [...currentSeq, newNumber];
    setSequence(newSeq);
    showSequence(newSeq);
  };

  const showSequence = (seq: number[]) => {
    setIsShowing(true);
    seq.forEach((num, index) => {
      setTimeout(() => {
        const btn = document.getElementById(`memory-btn-${num}`);
        btn?.classList.add('opacity-100', 'scale-110');
        setTimeout(() => {
          btn?.classList.remove('opacity-100', 'scale-110');
          if (index === seq.length - 1) {
            setIsShowing(false);
          }
        }, 500);
      }, index * 800);
    });
  };

  const handleClick = (num: number) => {
    if (isShowing) return;
    
    const newUserSeq = [...userSequence, num];
    setUserSequence(newUserSeq);

    if (newUserSeq[newUserSeq.length - 1] !== sequence[newUserSeq.length - 1]) {
      alert(`Game Over! Your score: ${score}`);
      setGameStarted(false);
      return;
    }

    if (newUserSeq.length === sequence.length) {
      setScore(score + 1);
      setUserSequence([]);
      setTimeout(() => addToSequence(sequence), 1000);
    }
  };

  return (
    <div className="bg-black/50 border-2 border-magenta-500/50 rounded-lg p-8 text-center">
      <h3 className="text-3xl mb-4 text-magenta-400">Memory Grid</h3>
      <p className="text-magenta-400/70 mb-6">Watch the pattern and repeat it!</p>
      
      <div className="mb-6">
        <div className="text-4xl mb-2">Level {score + 1}</div>
      </div>

      {!gameStarted ? (
        <button
          onClick={startGame}
          className="px-8 py-4 bg-gradient-to-r from-magenta-500 to-pink-500 text-black rounded-lg hover:shadow-lg hover:shadow-magenta-500/50 transition-all"
        >
          Start Game
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {colors.map((color, index) => (
            <button
              key={index}
              id={`memory-btn-${index}`}
              onClick={() => handleClick(index)}
              disabled={isShowing}
              className={`h-32 ${color} opacity-50 rounded-lg transition-all disabled:cursor-not-allowed hover:opacity-100`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function GuessGame({ score, setScore }: any) {
  const [target, setTarget] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleGuess = () => {
    const num = parseInt(guess);
    setAttempts(attempts + 1);

    if (num === target) {
      setMessage(`🎉 Correct! You got it in ${attempts + 1} attempts!`);
      setScore(score + Math.max(10 - attempts, 1));
      setTimeout(() => {
        setTarget(Math.floor(Math.random() * 100) + 1);
        setGuess('');
        setMessage('');
        setAttempts(0);
      }, 2000);
    } else if (num < target) {
      setMessage('📈 Higher!');
    } else {
      setMessage('📉 Lower!');
    }
    setGuess('');
  };

  return (
    <div className="bg-black/50 border-2 border-yellow-500/50 rounded-lg p-8 text-center">
      <h3 className="text-3xl mb-4 text-yellow-400">Number Guesser</h3>
      <p className="text-yellow-400/70 mb-6">Guess a number between 1 and 100!</p>
      
      <div className="mb-6">
        <div className="text-4xl mb-2">{score} pts</div>
        <div className="text-yellow-400/70">Attempts: {attempts}</div>
      </div>

      {message && (
        <div className="text-2xl mb-6 text-cyan-400">{message}</div>
      )}

      <div className="flex gap-2 max-w-md mx-auto">
        <input
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
          placeholder="Enter your guess"
          className="flex-1 px-4 py-3 bg-black/50 border-2 border-yellow-500/50 rounded text-white"
          min="1"
          max="100"
        />
        <button
          onClick={handleGuess}
          className="px-6 py-3 bg-yellow-500 text-black rounded hover:bg-yellow-400 transition-all"
        >
          Guess
        </button>
      </div>
    </div>
  );
}

function ReactionGame({ score, setScore }: any) {
  const [isWaiting, setIsWaiting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);

  const startGame = () => {
    setReactionTime(null);
    setIsWaiting(true);
    setIsReady(false);
    
    const delay = Math.random() * 3000 + 1000;
    setTimeout(() => {
      setIsWaiting(false);
      setIsReady(true);
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (isWaiting) {
      alert('Too early! Wait for green.');
      setIsWaiting(false);
      return;
    }
    
    if (isReady) {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setIsReady(false);
      setScore(score + Math.max(1000 - time, 100));
    }
  };

  return (
    <div className="bg-black/50 border-2 border-green-500/50 rounded-lg p-8 text-center">
      <h3 className="text-3xl mb-4 text-green-400">Reaction Time</h3>
      <p className="text-green-400/70 mb-6">Click as soon as the box turns green!</p>
      
      <div className="mb-6">
        <div className="text-4xl mb-2">{score} pts</div>
      </div>

      {reactionTime !== null && (
        <div className="text-3xl mb-6 text-cyan-400">
          {reactionTime}ms
        </div>
      )}

      {!isWaiting && !isReady ? (
        <button
          onClick={startGame}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-black rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all"
        >
          {reactionTime !== null ? 'Play Again' : 'Start'}
        </button>
      ) : (
        <div
          onClick={handleClick}
          className={`w-full h-64 rounded-lg flex items-center justify-center text-2xl cursor-pointer transition-all ${
            isWaiting ? 'bg-red-500' : 'bg-green-500 animate-pulse'
          }`}
        >
          {isWaiting ? 'Wait...' : 'CLICK NOW!'}
        </div>
      )}
    </div>
  );
}

function ColorMatchGame({ score, setScore }: any) {
  const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'];
  const colorClasses: Record<string, string> = {
    'Red': 'text-red-500',
    'Blue': 'text-blue-500',
    'Green': 'text-green-500',
    'Yellow': 'text-yellow-500',
    'Purple': 'text-purple-500',
    'Orange': 'text-orange-500'
  };

  const [wordColor, setWordColor] = useState('');
  const [textColor, setTextColor] = useState('');
  const [options, setOptions] = useState<string[]>([]);

  const generateRound = () => {
    const word = colors[Math.floor(Math.random() * colors.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    setWordColor(word);
    setTextColor(color);
    
    const opts = [color];
    while (opts.length < 3) {
      const opt = colors[Math.floor(Math.random() * colors.length)];
      if (!opts.includes(opt)) opts.push(opt);
    }
    setOptions(opts.sort(() => Math.random() - 0.5));
  };

  const handleAnswer = (answer: string) => {
    if (answer === textColor) {
      setScore(score + 10);
      generateRound();
    } else {
      alert(`Wrong! Score: ${score}`);
      setScore(0);
      generateRound();
    }
  };

  if (!wordColor) {
    generateRound();
  }

  return (
    <div className="bg-black/50 border-2 border-purple-500/50 rounded-lg p-8 text-center">
      <h3 className="text-3xl mb-4 text-purple-400">Color Match</h3>
      <p className="text-purple-400/70 mb-6">Select the COLOR of the text, not the word!</p>
      
      <div className="mb-6">
        <div className="text-4xl mb-2">{score} pts</div>
      </div>

      <div className={`text-6xl mb-8 ${colorClasses[textColor]}`}>
        {wordColor}
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
        {options.map((color) => (
          <button
            key={color}
            onClick={() => handleAnswer(color)}
            className="px-6 py-4 bg-purple-500/20 border-2 border-purple-500 text-white rounded-lg hover:bg-purple-500/30 transition-all"
          >
            {color}
          </button>
        ))}
      </div>
    </div>
  );
}

function WordScrambleGame({ score, setScore }: any) {
  const words = [
    'ROBLOX', 'FORTNITE', 'MINECRAFT', 'WARZONE', 'GAMING',
    'ARCADE', 'PLAYER', 'VICTORY', 'CHAMPION', 'BATTLE'
  ];

  const [currentWord, setCurrentWord] = useState('');
  const [scrambled, setScrambled] = useState('');
  const [guess, setGuess] = useState('');

  const scrambleWord = (word: string) => {
    return word.split('').sort(() => Math.random() - 0.5).join('');
  };

  const newRound = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(word);
    setScrambled(scrambleWord(word));
    setGuess('');
  };

  const handleGuess = () => {
    if (guess.toUpperCase() === currentWord) {
      setScore(score + 10);
      alert('Correct! +10 points');
      newRound();
    } else {
      alert('Wrong! Try again');
      setGuess('');
    }
  };

  if (!currentWord) {
    newRound();
  }

  return (
    <div className="bg-black/50 border-2 border-pink-500/50 rounded-lg p-8 text-center">
      <h3 className="text-3xl mb-4 text-pink-400">Word Scramble</h3>
      <p className="text-pink-400/70 mb-6">Unscramble the gaming word!</p>
      
      <div className="mb-6">
        <div className="text-4xl mb-2">{score} pts</div>
      </div>

      <div className="text-5xl mb-8 text-cyan-400 tracking-widest">
        {scrambled}
      </div>

      <div className="flex gap-2 max-w-md mx-auto mb-4">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
          placeholder="Type your answer"
          className="flex-1 px-4 py-3 bg-black/50 border-2 border-pink-500/50 rounded text-white uppercase"
        />
        <button
          onClick={handleGuess}
          className="px-6 py-3 bg-pink-500 text-black rounded hover:bg-pink-400 transition-all"
        >
          Submit
        </button>
      </div>

      <button
        onClick={newRound}
        className="px-4 py-2 bg-pink-500/20 border border-pink-500 text-pink-400 rounded hover:bg-pink-500/30 transition-all"
      >
        <RotateCcw className="w-4 h-4 inline mr-2" />
        New Word
      </button>
    </div>
  );
}
