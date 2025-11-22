import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { GameCanvas, ActivePowerUps } from './components/GameCanvas'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog'
import { ShopModal, PowerUp, AVAILABLE_POWERUPS } from './components/ShopModal'
import { Trophy, Play, ChartBar, Sparkle, Heart, Parachute, Lightning, Shield } from '@phosphor-icons/react'
import { toast } from 'sonner'

type GameState = 'start' | 'playing' | 'gameOver' | 'levelComplete' | 'gameOverCountdown' | 'levelCompleteCountdown'

function App() {
  const [gameState, setGameState] = useState<GameState>('start')
  const [currentScore, setCurrentScore] = useState(0)
  const [finalScore, setFinalScore] = useState(0)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [countdown, setCountdown] = useState(3)
  const [highScore, setHighScore] = useKV<number>('high-score', 0)
  const [totalGames, setTotalGames] = useKV<number>('total-games', 0)
  const [totalScore, setTotalScore] = useKV<number>('total-score', 0)
  const [levelsCompleted, setLevelsCompleted] = useKV<number>('levels-completed', 0)
  const [totalJumps, setTotalJumps] = useKV<number>('total-jumps', 0)
  const [gamesWon, setGamesWon] = useKV<number>('games-won', 0)
  
  const [points, setPoints] = useKV<number>('points', 0)
  const [ownedPowerUps, setOwnedPowerUps] = useKV<Record<string, number>>('owned-powerups', {})
  const [activePowerUps, setActivePowerUps] = useState<ActivePowerUps>({
    lowGravity: false,
    slowMotion: false,
    shield: false,
    pointMultiplier: false,
  })
  const [hasExtraLife, setHasExtraLife] = useState(false)

  const handleStart = () => {
    setGameState('playing')
    setCurrentScore(0)
    setCurrentLevel(1)
  }

  const handleGameOver = (score: number, jumps: number) => {
    if (hasExtraLife) {
      toast.success('Extra Life Used!', {
        description: 'You can continue from where you died',
      })
      setHasExtraLife(false)
      setOwnedPowerUps((current) => ({
        ...current,
        'extra-life': Math.max(0, (current?.['extra-life'] ?? 0) - 1),
      }))
      return
    }

    const earnedPoints = Math.floor(score / 2)
    setPoints((current) => (current ?? 0) + earnedPoints)
    
    if (earnedPoints > 0) {
      toast.success(`Earned ${earnedPoints} points!`, {
        description: 'Spend them in the shop',
      })
    }

    setFinalScore(score)
    setHighScore((current) => {
      const currentHigh = current ?? 0
      return score > currentHigh ? score : currentHigh
    })
    setTotalGames((current) => (current ?? 0) + 1)
    setTotalScore((current) => (current ?? 0) + score)
    setTotalJumps((current) => (current ?? 0) + jumps)
    
    setActivePowerUps({
      lowGravity: false,
      slowMotion: false,
      shield: false,
      pointMultiplier: false,
    })

    setGameState('gameOverCountdown')
    setCountdown(3)
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          setGameState('gameOver')
          return 3
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleLevelComplete = (completedLevel: number, jumps: number) => {
    setLevelsCompleted((current) => (current ?? 0) + 1)
    
    if (completedLevel >= 10) {
      const earnedPoints = Math.floor(currentScore / 2)
      setPoints((current) => (current ?? 0) + earnedPoints)
      
      if (earnedPoints > 0) {
        toast.success(`Earned ${earnedPoints} points!`, {
          description: 'You completed all levels!',
        })
      }

      setFinalScore(currentScore)
      setHighScore((current) => {
        const currentHigh = current ?? 0
        return currentScore > currentHigh ? currentScore : currentHigh
      })
      setTotalGames((current) => (current ?? 0) + 1)
      setTotalScore((current) => (current ?? 0) + currentScore)
      setTotalJumps((current) => (current ?? 0) + jumps)
      setGamesWon((current) => (current ?? 0) + 1)
      
      setActivePowerUps({
        lowGravity: false,
        slowMotion: false,
        shield: false,
        pointMultiplier: false,
      })

      setGameState('gameOverCountdown')
      setCountdown(3)
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval)
            setGameState('gameOver')
            return 3
          }
          return prev - 1
        })
      }, 1000)
    } else {
      setGameState('levelCompleteCountdown')
      setCountdown(3)
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval)
            setGameState('levelComplete')
            return 3
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  const handleNextLevel = () => {
    setCurrentLevel((prev) => prev + 1)
    setGameState('playing')
    setCountdown(3)
  }

  const handleRestart = () => {
    setGameState('playing')
    setCurrentScore(0)
    setCurrentLevel(1)
    setActivePowerUps({
      lowGravity: false,
      slowMotion: false,
      shield: false,
      pointMultiplier: false,
    })
    setHasExtraLife(false)
  }

  const handlePurchase = (powerUpId: string) => {
    const powerUp = AVAILABLE_POWERUPS.find(p => p.id === powerUpId)
    if (!powerUp) return

    const currentPoints = points ?? 0
    if (currentPoints >= powerUp.cost) {
      setPoints(currentPoints - powerUp.cost)
      setOwnedPowerUps((current) => ({
        ...current,
        [powerUpId]: (current?.[powerUpId] ?? 0) + 1,
      }))
    }
  }

  const handleActivatePowerUp = (powerUpId: string) => {
    const owned = ownedPowerUps?.[powerUpId] ?? 0
    if (owned <= 0) return

    if (powerUpId === 'extra-life') {
      if (hasExtraLife) {
        toast.error('Extra Life already active', {
          description: 'You can only have one active at a time',
        })
        return
      }
      setHasExtraLife(true)
      toast.success('Extra Life activated!', {
        description: 'You will get one free continue',
      })
    } else {
      const powerUpMap: Record<string, keyof ActivePowerUps> = {
        'low-gravity': 'lowGravity',
        'slow-motion': 'slowMotion',
        'shield': 'shield',
        'point-multiplier': 'pointMultiplier',
      }
      
      const key = powerUpMap[powerUpId]
      if (key && activePowerUps[key]) {
        toast.error('Power-up already active', {
          description: 'Finish this game first',
        })
        return
      }

      if (key) {
        setActivePowerUps((prev) => ({ ...prev, [key]: true }))
        const powerUp = AVAILABLE_POWERUPS.find(p => p.id === powerUpId)
        toast.success(`${powerUp?.name} activated!`, {
          description: 'Active for this game only',
        })
      }
    }

    setOwnedPowerUps((current) => ({
      ...current,
      [powerUpId]: Math.max(0, (current?.[powerUpId] ?? 0) - 1),
    }))
  }

  const handleShieldUsed = () => {
    toast.info('Shield absorbed the hit!', {
      description: 'Shield power-up consumed',
    })
    setActivePowerUps((prev) => ({ ...prev, shield: false }))
  }

  const isTouch = 'ontouchstart' in window
  const displayHighScore = highScore ?? 0
  const displayTotalGames = totalGames ?? 0
  const displayTotalScore = totalScore ?? 0
  const displayLevelsCompleted = levelsCompleted ?? 0
  const displayTotalJumps = totalJumps ?? 0
  const displayGamesWon = gamesWon ?? 0
  const displayPoints = points ?? 0
  const avgScore = displayTotalGames > 0 ? Math.floor(displayTotalScore / displayTotalGames) : 0
  const winRate = displayTotalGames > 0 ? Math.floor((displayGamesWon / displayTotalGames) * 100) : 0

  const powerUpsForShop: PowerUp[] = AVAILABLE_POWERUPS.map(powerUp => ({
    ...powerUp,
    owned: ownedPowerUps?.[powerUp.id] ?? 0,
  }))

  const getActivePowerUpIcon = (id: string) => {
    const iconMap: Record<string, typeof Heart> = {
      'low-gravity': Parachute,
      'slow-motion': Lightning,
      'shield': Shield,
      'point-multiplier': Sparkle,
    }
    return iconMap[id]
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6">
      <div className="flex items-center justify-between w-full max-w-[800px] flex-wrap gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Jump Runner
          </h1>
          <p className="text-lg text-muted-foreground mt-1">Beat your high score</p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="default" className="flex items-center gap-2 px-4 py-2 text-base bg-accent text-accent-foreground">
            <Sparkle weight="fill" size={20} />
            <span className="font-semibold">{displayPoints}</span>
          </Badge>
          
          <ShopModal
            points={displayPoints}
            powerUps={powerUpsForShop}
            onPurchase={handlePurchase}
          />
          
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
          activePowerUps={activePowerUps}
          onShieldUsed={handleShieldUsed}
        />

        {gameState === 'start' && (
          <Card className="absolute inset-0 flex items-center justify-center bg-card/95 backdrop-blur-sm border-2">
            <CardHeader className="text-center space-y-4">
              <CardTitle className="text-4xl font-bold">Ready to Jump?</CardTitle>
              <CardDescription className="text-lg">
                {isTouch ? 'Tap the screen' : 'Press SPACEBAR'} to jump over obstacles
              </CardDescription>
              
              {(Object.keys(ownedPowerUps ?? {}).some(key => (ownedPowerUps?.[key] ?? 0) > 0) || hasExtraLife) && (
                <div className="space-y-3 pt-2">
                  <p className="text-sm font-semibold text-muted-foreground">Activate Power-Ups</p>
                  <div className="flex flex-wrap gap-2 justify-center max-w-md">
                    {hasExtraLife && (
                      <Badge variant="default" className="bg-primary text-primary-foreground px-3 py-1.5">
                        <Heart weight="fill" size={16} className="mr-1" />
                        Extra Life Active
                      </Badge>
                    )}
                    {Object.entries(ownedPowerUps ?? {}).map(([id, count]) => {
                      if (count <= 0) return null
                      const powerUp = AVAILABLE_POWERUPS.find(p => p.id === id)
                      if (!powerUp) return null
                      const Icon = getActivePowerUpIcon(id)
                      const isActive = id === 'extra-life' ? false : activePowerUps[id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()) as keyof ActivePowerUps]
                      
                      return (
                        <button
                          key={id}
                          onClick={() => handleActivatePowerUp(id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-sm transition-colors ${
                            isActive
                              ? 'bg-accent text-accent-foreground'
                              : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
                          }`}
                        >
                          {Icon && <Icon weight="fill" size={16} />}
                          <span>{powerUp.name}</span>
                          <Badge variant="outline" className="ml-1 text-xs">
                            x{count}
                          </Badge>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
              
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

        {gameState === 'gameOverCountdown' && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-8xl font-bold text-primary animate-pulse">
                {countdown}
              </div>
            </div>
          </div>
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

        {gameState === 'levelCompleteCountdown' && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-8xl font-bold text-primary animate-pulse">
                {countdown}
              </div>
            </div>
          </div>
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
          <>
            <div className="absolute top-4 left-4 md:top-6 md:left-6">
              <div className="text-5xl font-bold text-primary drop-shadow-lg">
                {currentScore}
              </div>
            </div>
            
            {(hasExtraLife || Object.values(activePowerUps).some(v => v)) && (
              <div className="absolute top-4 right-4 md:top-6 md:right-6 flex flex-col gap-2">
                {hasExtraLife && (
                  <Badge variant="default" className="bg-primary text-primary-foreground flex items-center gap-1.5">
                    <Heart weight="fill" size={16} />
                    Extra Life
                  </Badge>
                )}
                {activePowerUps.lowGravity && (
                  <Badge variant="default" className="bg-accent text-accent-foreground flex items-center gap-1.5">
                    <Parachute weight="fill" size={16} />
                    Low Gravity
                  </Badge>
                )}
                {activePowerUps.slowMotion && (
                  <Badge variant="default" className="bg-accent text-accent-foreground flex items-center gap-1.5">
                    <Lightning weight="fill" size={16} />
                    Slow Motion
                  </Badge>
                )}
                {activePowerUps.shield && (
                  <Badge variant="default" className="bg-accent text-accent-foreground flex items-center gap-1.5">
                    <Shield weight="fill" size={16} />
                    Shield
                  </Badge>
                )}
                {activePowerUps.pointMultiplier && (
                  <Badge variant="default" className="bg-accent text-accent-foreground flex items-center gap-1.5">
                    <Sparkle weight="fill" size={16} />
                    2x Points
                  </Badge>
                )}
              </div>
            )}
          </>
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