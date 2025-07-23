import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Plus, Minus, X, Divide, RotateCcw } from 'lucide-react';

type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';

interface Problem {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
}

const MathGame = () => {
  const [currentOperation, setCurrentOperation] = useState<Operation>('addition');
  const [problem, setProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [problemsCompleted, setProblemsCompleted] = useState(0);

  const operationIcons = {
    addition: Plus,
    subtraction: Minus,
    multiplication: X,
    division: Divide,
  };

  const operationSymbols = {
    addition: '+',
    subtraction: '-',
    multiplication: '×',
    division: '÷',
  };

  const generateProblem = (operation: Operation): Problem => {
    let num1: number, num2: number, answer: number;

    switch (operation) {
      case 'addition':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        answer = num1 + num2;
        break;
      case 'subtraction':
        num1 = Math.floor(Math.random() * 50) + 25;
        num2 = Math.floor(Math.random() * 25) + 1;
        answer = num1 - num2;
        break;
      case 'multiplication':
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        break;
      case 'division':
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = Math.floor(Math.random() * 12) + 1;
        num1 = num2 * answer;
        break;
      default:
        num1 = 1;
        num2 = 1;
        answer = 2;
    }

    return { num1, num2, operation, answer };
  };

  const startNewProblem = () => {
    const newProblem = generateProblem(currentOperation);
    setProblem(newProblem);
    setUserAnswer('');
    setShowFeedback(null);
  };

  const checkAnswer = () => {
    if (!problem || userAnswer === '') return;

    const isCorrect = parseInt(userAnswer) === problem.answer;
    
    if (isCorrect) {
      setScore(score + 10);
      setStreak(streak + 1);
      setShowFeedback('correct');
    } else {
      setStreak(0);
      setShowFeedback('incorrect');
    }
    
    setProblemsCompleted(problemsCompleted + 1);
    
    setTimeout(() => {
      startNewProblem();
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  const resetGame = () => {
    setScore(0);
    setStreak(0);
    setProblemsCompleted(0);
    setShowFeedback(null);
    startNewProblem();
  };

  useEffect(() => {
    startNewProblem();
  }, [currentOperation]);

  const OperationIcon = operationIcons[currentOperation];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-game-purple bg-clip-text text-transparent mb-2">
            Math Magician Quest
          </h1>
          <p className="text-muted-foreground text-lg">Master your math skills with fun!</p>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-4 mb-8">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Star className="w-5 h-5 mr-2 text-warning" fill="currentColor" />
            Score: {score}
          </Badge>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            🔥 Streak: {streak}
          </Badge>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            📝 Problems: {problemsCompleted}
          </Badge>
        </div>

        {/* Operation Selector */}
        <Card className="p-6 mb-8 shadow-xl border-2">
          <h2 className="text-2xl font-bold text-center mb-4">Choose Your Challenge</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(Object.keys(operationIcons) as Operation[]).map((op) => {
              const Icon = operationIcons[op];
              return (
                <Button
                  key={op}
                  variant={currentOperation === op ? "default" : "outline"}
                  size="lg"
                  onClick={() => setCurrentOperation(op)}
                  className={`h-16 text-lg font-bold transition-all duration-300 ${
                    currentOperation === op 
                      ? 'animate-bounce-in shadow-lg transform scale-105' 
                      : 'hover:scale-105'
                  }`}
                >
                  <Icon className="w-6 h-6 mr-2" />
                  {op.charAt(0).toUpperCase() + op.slice(1)}
                </Button>
              );
            })}
          </div>
        </Card>

        {/* Game Area */}
        {problem && (
          <Card className="p-8 mb-8 shadow-2xl border-2 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5">
              <div className="absolute top-4 left-4 animate-star-sparkle">⭐</div>
              <div className="absolute top-8 right-8 animate-star-sparkle delay-300">🌟</div>
              <div className="absolute bottom-8 left-8 animate-star-sparkle delay-500">✨</div>
            </div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-6 text-6xl font-bold mb-6">
                  <span className={`${showFeedback === 'correct' ? 'animate-celebration text-success' : ''} ${showFeedback === 'incorrect' ? 'animate-wiggle text-destructive' : ''}`}>
                    {problem.num1}
                  </span>
                  <OperationIcon className="w-12 h-12 text-primary" />
                  <span className={`${showFeedback === 'correct' ? 'animate-celebration text-success' : ''} ${showFeedback === 'incorrect' ? 'animate-wiggle text-destructive' : ''}`}>
                    {problem.num2}
                  </span>
                  <span className="text-primary">=</span>
                  <span className="text-muted-foreground">?</span>
                </div>

                <div className="flex justify-center items-center gap-4 mb-6">
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-32 h-16 text-center text-3xl font-bold border-4 border-primary/30 rounded-xl focus:outline-none focus:border-primary bg-card shadow-inner"
                    placeholder="?"
                    disabled={showFeedback !== null}
                  />
                  <Button
                    onClick={checkAnswer}
                    size="lg"
                    disabled={userAnswer === '' || showFeedback !== null}
                    className="h-16 px-8 text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Check
                  </Button>
                </div>

                {/* Feedback */}
                {showFeedback && (
                  <div className={`text-3xl font-bold animate-bounce-in ${
                    showFeedback === 'correct' 
                      ? 'text-success' 
                      : 'text-destructive'
                  }`}>
                    {showFeedback === 'correct' ? (
                      <div className="flex items-center justify-center gap-2">
                        ✅ Correct! +10 points
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        ❌ Not quite! The answer is {problem.answer}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Reset Button */}
        <div className="text-center">
          <Button
            onClick={resetGame}
            variant="outline"
            size="lg"
            className="hover:scale-105 transition-transform duration-300"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            New Game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MathGame;