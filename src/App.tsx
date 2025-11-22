import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { GameCanvas } from './components/GameCanvas'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Trophy, Play } from '@phosphor-icons/react'

type GameState = 'start' | 'playing' | 'gameOver'

function App() {
  const [gameState, setGameState] = useState<GameState>('start')
  const [currentScore, setCurrentScore] = useState(0)
  const [finalScore, setFinalScore] = useState(0)
  const [highScore, setHighScore] = useKV<number>('high-score', 0)

  const handleStart = () => {
    setGameState('playing')
    setCurrentScore(0)
  }

  const handleGameOver = (score: number) => {
    setFinalScore(score)
    setGameState('gameOver')
    setHighScore((current) => {
      const currentHigh = current ?? 0
      return score > currentHigh ? score : currentHigh
    })
  }

  const handleRestart = () => {
    setGameState('playing')
    setCurrentScore(0)
  }

  const isTouch = 'ontouchstart' in window
  const displayHighScore = highScore ?? 0

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6">
      <div className="flex items-center justify-between w-full max-w-[800px]">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Jump Runner
          </h1>
          <p className="text-lg text-muted-foreground mt-1">Beat your high score</p>
        </div>
        
        {displayHighScore > 0 && (
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 text-base">
            <Trophy weight="fill" className="text-accent" size={20} />
            <span className="font-semibold">{displayHighScore}</span>
          </Badge>
        )}
      </div>

      <div className="relative">
        <GameCanvas
          onScoreUpdate={setCurrentScore}
          onGameOver={handleGameOver}
          isPlaying={gameState === 'playing'}
          onStart={handleStart}
        />

        {gameState === 'start' && (
          <Card className="absolute inset-0 flex items-center justify-center bg-card/95 backdrop-blur-sm border-2">
            <CardHeader className="text-center space-y-4">
              <CardTitle className="text-4xl font-bold">Ready to Jump?</CardTitle>
              <CardDescription className="text-lg">
                {isTouch ? 'Tap the screen' : 'Press SPACEBAR'} to jump over obstacles
              </CardDescription>
              <div className="pt-4">
                <button
                  onClick={handleStart}
                  className="text-primary hover:text-accent transition-colors font-semibold text-xl flex items-center gap-2 mx-auto"
                >
                  <Play weight="fill" size={24} />
                  Start Game
                </button>
              </div>
            </CardHeader>
          </Card>
        )}

        {gameState === 'gameOver' && (
          <Card className="absolute inset-0 flex items-center justify-center bg-card/95 backdrop-blur-sm border-2">
            <CardContent className="text-center space-y-6 pt-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Game Over!</h2>
                <div className="text-5xl font-bold text-primary my-4">{finalScore}</div>
                {finalScore === displayHighScore && finalScore > 0 && (
                  <Badge variant="default" className="bg-accent text-accent-foreground font-semibold">
                    New High Score! 🎉
                  </Badge>
                )}
              </div>
              <button
                onClick={handleRestart}
                className="text-primary hover:text-accent transition-colors font-semibold text-xl flex items-center gap-2 mx-auto"
              >
                <Play weight="fill" size={24} />
                Play Again
              </button>
            </CardContent>
          </Card>
        )}

        {gameState === 'playing' && (
          <div className="absolute top-4 left-4 md:top-6 md:left-6">
            <div className="text-5xl font-bold text-primary drop-shadow-lg">
              {currentScore}
            </div>
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground max-w-[600px] text-center">
        {isTouch
          ? 'Tap anywhere on the screen to make your character jump. Time your jumps to avoid the obstacles!'
          : 'Use the SPACEBAR to jump. Hold and release to control your jumps. Survive as long as you can!'}
      </p>
    </div>
  )
}

export default App