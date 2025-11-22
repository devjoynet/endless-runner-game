import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { GameCanvas } from './components/GameCanvas'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Trophy, Play } from '@phosphor-icons/react'

type GameState = 'start' | 'playing' | 'gameOver' | 'levelComplete'

function App() {
  const [gameState, setGameState] = useState<GameState>('start')
  const [currentScore, setCurrentScore] = useState(0)
  const [finalScore, setFinalScore] = useState(0)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [highScore, setHighScore] = useKV<number>('high-score', 0)

  const handleStart = () => {
    setGameState('playing')
    setCurrentScore(0)
    setCurrentLevel(1)
  }

  const handleGameOver = (score: number) => {
    setFinalScore(score)
    setGameState('gameOver')
    setHighScore((current) => {
      const currentHigh = current ?? 0
      return score > currentHigh ? score : currentHigh
    })
  }

  const handleLevelComplete = (completedLevel: number) => {
    if (completedLevel >= 10) {
      setFinalScore(currentScore)
      setGameState('gameOver')
      setHighScore((current) => {
        const currentHigh = current ?? 0
        return currentScore > currentHigh ? currentScore : currentHigh
      })
    } else {
      setGameState('levelComplete')
    }
  }

  const handleNextLevel = () => {
    setCurrentLevel((prev) => prev + 1)
    setGameState('playing')
  }

  const handleRestart = () => {
    setGameState('playing')
    setCurrentScore(0)
    setCurrentLevel(1)
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
        
        <div className="flex items-center gap-4">
          {gameState === 'playing' && (
            <Badge variant="outline" className="px-4 py-2 text-base font-semibold">
              Level {currentLevel}
            </Badge>
          )}
          {displayHighScore > 0 && (
            <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 text-base">
              <Trophy weight="fill" className="text-accent" size={20} />
              <span className="font-semibold">{displayHighScore}</span>
            </Badge>
          )}
        </div>
      </div>

      <div className="relative">
        <GameCanvas
          onScoreUpdate={setCurrentScore}
          onGameOver={handleGameOver}
          onLevelComplete={handleLevelComplete}
          isPlaying={gameState === 'playing'}
          onStart={handleStart}
          currentLevel={currentLevel}
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
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {currentLevel === 10 ? 'Victory!' : 'Game Over!'}
                </h2>
                <div className="text-5xl font-bold text-primary my-4">{finalScore}</div>
                {currentLevel === 10 && (
                  <Badge variant="default" className="bg-accent text-accent-foreground font-semibold mb-2">
                    All Levels Complete! 🎉
                  </Badge>
                )}
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

        {gameState === 'levelComplete' && (
          <Card className="absolute inset-0 flex items-center justify-center bg-card/95 backdrop-blur-sm border-2">
            <CardContent className="text-center space-y-6 pt-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Level {currentLevel} Complete!</h2>
                <p className="text-muted-foreground text-lg mb-4">
                  Get ready for Level {currentLevel + 1}
                </p>
                <div className="text-4xl font-bold text-primary my-4">{currentScore}</div>
                <p className="text-sm text-muted-foreground">
                  Speed increased by 5%
                </p>
              </div>
              <button
                onClick={handleNextLevel}
                className="text-primary hover:text-accent transition-colors font-semibold text-xl flex items-center gap-2 mx-auto"
              >
                <Play weight="fill" size={24} />
                Next Level
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