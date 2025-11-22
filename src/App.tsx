import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { GameCanvas } from './components/GameCanvas'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog'
import { Trophy, Play, ChartBar } from '@phosphor-icons/react'

type GameState = 'start' | 'playing' | 'gameOver' | 'levelComplete'

function App() {
  const [gameState, setGameState] = useState<GameState>('start')
  const [currentScore, setCurrentScore] = useState(0)
  const [finalScore, setFinalScore] = useState(0)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [highScore, setHighScore] = useKV<number>('high-score', 0)
  const [totalGames, setTotalGames] = useKV<number>('total-games', 0)
  const [totalScore, setTotalScore] = useKV<number>('total-score', 0)
  const [levelsCompleted, setLevelsCompleted] = useKV<number>('levels-completed', 0)
  const [totalJumps, setTotalJumps] = useKV<number>('total-jumps', 0)
  const [gamesWon, setGamesWon] = useKV<number>('games-won', 0)

  const handleStart = () => {
    setGameState('playing')
    setCurrentScore(0)
    setCurrentLevel(1)
  }

  const handleGameOver = (score: number, jumps: number) => {
    setFinalScore(score)
    setGameState('gameOver')
    setHighScore((current) => {
      const currentHigh = current ?? 0
      return score > currentHigh ? score : currentHigh
    })
    setTotalGames((current) => (current ?? 0) + 1)
    setTotalScore((current) => (current ?? 0) + score)
    setTotalJumps((current) => (current ?? 0) + jumps)
  }

  const handleLevelComplete = (completedLevel: number, jumps: number) => {
    setLevelsCompleted((current) => (current ?? 0) + 1)
    
    if (completedLevel >= 10) {
      setFinalScore(currentScore)
      setGameState('gameOver')
      setHighScore((current) => {
        const currentHigh = current ?? 0
        return currentScore > currentHigh ? currentScore : currentHigh
      })
      setTotalGames((current) => (current ?? 0) + 1)
      setTotalScore((current) => (current ?? 0) + currentScore)
      setTotalJumps((current) => (current ?? 0) + jumps)
      setGamesWon((current) => (current ?? 0) + 1)
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
  const displayTotalGames = totalGames ?? 0
  const displayTotalScore = totalScore ?? 0
  const displayLevelsCompleted = levelsCompleted ?? 0
  const displayTotalJumps = totalJumps ?? 0
  const displayGamesWon = gamesWon ?? 0
  const avgScore = displayTotalGames > 0 ? Math.floor(displayTotalScore / displayTotalGames) : 0
  const winRate = displayTotalGames > 0 ? Math.floor((displayGamesWon / displayTotalGames) * 100) : 0

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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <ChartBar size={20} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Game Statistics</DialogTitle>
                <DialogDescription>Your overall performance across all games</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">High Score</p>
                  <p className="text-2xl font-bold text-primary">{displayHighScore}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Games</p>
                  <p className="text-2xl font-bold text-foreground">{displayTotalGames}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold text-foreground">{avgScore}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Score</p>
                  <p className="text-2xl font-bold text-foreground">{displayTotalScore}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Levels Completed</p>
                  <p className="text-2xl font-bold text-accent">{displayLevelsCompleted}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Jumps</p>
                  <p className="text-2xl font-bold text-foreground">{displayTotalJumps}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Games Won</p>
                  <p className="text-2xl font-bold text-accent">{displayGamesWon}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-2xl font-bold text-primary">{winRate}%</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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