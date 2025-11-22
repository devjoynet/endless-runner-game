import { useEffect, useRef, useState } from 'react'

interface Obstacle {
  x: number
  y: number
  width: number
  height: number
}

export interface ActivePowerUps {
  lowGravity: boolean
  slowMotion: boolean
  shield: boolean
  pointMultiplier: boolean
}

interface GameCanvasProps {
  onScoreUpdate: (score: number) => void
  onGameOver: (finalScore: number, jumps: number, secondsSurvived: number) => void
  onLevelComplete: (level: number, jumps: number, secondsSurvived: number) => void
  isPlaying: boolean
  onStart: () => void
  currentLevel: number
  activePowerUps: ActivePowerUps
  onShieldUsed: () => void
  isCountdownActive: boolean
}

const GROUND_HEIGHT = 80
const PLAYER_SIZE = 40
const PLAYER_X = 100
const BASE_GRAVITY = 0.8
const BASE_JUMP_FORCE = -15
const BASE_GAME_SPEED = 6
const OBSTACLE_WIDTH = 30
const MIN_OBSTACLE_HEIGHT = 30
const MAX_OBSTACLE_HEIGHT = 70
const LEVEL_DURATION = 30

export function GameCanvas({ onScoreUpdate, onGameOver, onLevelComplete, isPlaying, onStart, currentLevel, activePowerUps, onShieldUsed, isCountdownActive }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const gameStateRef = useRef({
    playerY: 0,
    playerVelocity: 0,
    isJumping: false,
    obstacles: [] as Obstacle[],
    score: 0,
    frameCount: 0,
    canJump: true,
    levelStartTime: 0,
    jumps: 0,
    isGameEnded: false,
    inputCooldown: 0,
    showLevelCompleteHeading: false,
  })

  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ 
    width: 800, 
    height: 400 
  })

  useEffect(() => {
    const updateDimensions = () => {
      const width = Math.min(window.innerWidth - 32, 800)
      const height = Math.min(width * 0.5, 400)
      setDimensions({ width, height })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const state = gameStateRef.current
    const groundY = dimensions.height - GROUND_HEIGHT
    const playerGroundY = groundY - PLAYER_SIZE

    const handleJump = () => {
      if (!isPlaying) {
        if (!isCountdownActive) {
          onStart()
        }
        return
      }

      if (isCountdownActive || state.inputCooldown > 0) {
        return
      }

      if (!state.isJumping && state.canJump && state.playerY >= playerGroundY - 1) {
        const jumpForce = activePowerUps.lowGravity ? BASE_JUMP_FORCE * 1.3 : BASE_JUMP_FORCE
        state.playerVelocity = jumpForce
        state.isJumping = true
        state.jumps++
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        if (state.canJump) {
          handleJump()
          state.canJump = false
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        state.canJump = true
      }
    }

    const handleClick = () => {
      if ('ontouchstart' in window) {
        handleJump()
      }
    }

    const spawnObstacle = () => {
      const height = MIN_OBSTACLE_HEIGHT + Math.random() * (MAX_OBSTACLE_HEIGHT - MIN_OBSTACLE_HEIGHT)
      state.obstacles.push({
        x: dimensions.width,
        y: groundY - height,
        width: OBSTACLE_WIDTH,
        height: height,
      })
    }

    const checkCollision = (obstacle: Obstacle): boolean => {
      const playerLeft = PLAYER_X
      const playerRight = PLAYER_X + PLAYER_SIZE
      const playerTop = state.playerY
      const playerBottom = state.playerY + PLAYER_SIZE

      const obstacleLeft = obstacle.x
      const obstacleRight = obstacle.x + obstacle.width
      const obstacleTop = obstacle.y
      const obstacleBottom = obstacle.y + obstacle.height

      return (
        playerRight > obstacleLeft &&
        playerLeft < obstacleRight &&
        playerBottom > obstacleTop &&
        playerTop < obstacleBottom
      )
    }

    const gameLoop = () => {
      if (!isPlaying || state.isGameEnded) {
        animationFrameRef.current = requestAnimationFrame(gameLoop)
        return
      }

      state.frameCount++

      if (state.inputCooldown > 0) {
        state.inputCooldown--
      }

      let currentGameSpeed = BASE_GAME_SPEED * Math.pow(1.05, currentLevel - 1)
      if (activePowerUps.slowMotion) {
        currentGameSpeed *= 0.7
      }

      const elapsedSeconds = state.frameCount / 60
      if (elapsedSeconds >= LEVEL_DURATION && currentLevel < 10) {
        state.isGameEnded = true
        state.showLevelCompleteHeading = true
        onLevelComplete(currentLevel, state.jumps, elapsedSeconds)
        return
      }

      const gravity = activePowerUps.lowGravity ? BASE_GRAVITY * 0.6 : BASE_GRAVITY
      state.playerVelocity += gravity
      state.playerY += state.playerVelocity

      if (state.playerY >= playerGroundY) {
        state.playerY = playerGroundY
        state.playerVelocity = 0
        state.isJumping = false
      }

      if (state.frameCount % 90 === 0) {
        spawnObstacle()
      }

      state.obstacles = state.obstacles.filter((obstacle) => {
        obstacle.x -= currentGameSpeed
        return obstacle.x + obstacle.width > 0
      })

      for (const obstacle of state.obstacles) {
        if (checkCollision(obstacle)) {
          if (activePowerUps.shield) {
            onShieldUsed()
            state.obstacles = state.obstacles.filter(o => o !== obstacle)
          } else {
            state.isGameEnded = true
            const secondsSurvived = state.frameCount / 60
            onGameOver(state.score, state.jumps, secondsSurvived)
            return
          }
        }
      }

      const baseScore = Math.floor(state.frameCount / 60)
      state.score = activePowerUps.pointMultiplier ? baseScore * 2 : baseScore
      onScoreUpdate(state.score)

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--background').trim()
      ctx.fillRect(0, 0, dimensions.width, dimensions.height)

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim()
      ctx.fillRect(0, groundY, dimensions.width, GROUND_HEIGHT)

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()
      const radius = 8
      ctx.beginPath()
      ctx.roundRect(PLAYER_X, state.playerY, PLAYER_SIZE, PLAYER_SIZE, radius)
      ctx.fill()

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
      state.obstacles.forEach((obstacle) => {
        ctx.beginPath()
        ctx.roundRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height, radius)
        ctx.fill()
      })

      if (state.showLevelCompleteHeading) {
        ctx.save()
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        ctx.fillRect(0, 0, dimensions.width, dimensions.height)
        
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()
        ctx.font = 'bold 48px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('Level Complete!', dimensions.width / 2, dimensions.height / 2)
        ctx.restore()
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    canvas.addEventListener('click', handleClick)

    if (isPlaying && state.playerY === 0) {
      state.playerY = playerGroundY
    }

    gameLoop()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      canvas.removeEventListener('click', handleClick)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isPlaying, dimensions, onScoreUpdate, onGameOver, onLevelComplete, onStart, currentLevel, activePowerUps, onShieldUsed, isCountdownActive])

  useEffect(() => {
    if (!isPlaying) {
      const state = gameStateRef.current
      const groundY = dimensions.height - GROUND_HEIGHT
      state.playerY = groundY - PLAYER_SIZE
      state.playerVelocity = 0
      state.isJumping = false
      state.obstacles = []
      state.score = 0
      state.frameCount = 0
      state.canJump = true
      state.jumps = 0
      state.isGameEnded = false
      state.inputCooldown = 0
      state.showLevelCompleteHeading = false
    } else {
      gameStateRef.current.inputCooldown = 30
    }
  }, [isPlaying, dimensions])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isPlaying && !gameStateRef.current.isGameEnded) {
        gameStateRef.current.isGameEnded = true
        const secondsSurvived = gameStateRef.current.frameCount / 60
        onGameOver(gameStateRef.current.score, gameStateRef.current.jumps, secondsSurvived)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isPlaying, onGameOver])

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className="rounded-lg shadow-lg border-2 border-border cursor-pointer"
    />
  )
}
