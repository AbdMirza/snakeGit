'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useSound from 'use-sound'

export default function SnakeGame() {
  const boardSize = 18
  const [snake, setSnake] = useState([[7, 7]])
  const [food, setFood] = useState([5, 5])
  const [direction, setDirection] = useState('RIGHT')
  const [speed, setSpeed] = useState(150)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const savedHigh = localStorage.getItem('highScore')
    return savedHigh ? Number(savedHigh) : 0
  })

  // Sound effects (URLs from Pixabay)
  const [playEat] = useSound('https://cdn.pixabay.com/download/audio/2023/03/16/audio_b71d939ff4.mp3?filename=click-124467.mp3', { volume: 0.3 })
  const [playOver] = useSound('https://cdn.pixabay.com/download/audio/2022/03/15/audio_9b6a444d0b.mp3?filename=error-126508.mp3', { volume: 0.8 })

  const moveSnake = () => {
    const newSnake = [...snake]
    const head = [...newSnake[0]]

    switch (direction) {
      case 'UP': head[1] -= 1; break
      case 'DOWN': head[1] += 1; break
      case 'LEFT': head[0] -= 1; break
      case 'RIGHT': head[0] += 1; break
    }

    // Wall or self collision
    if (
      head[0] < 0 || head[1] < 0 ||
      head[0] >= boardSize || head[1] >= boardSize ||
      newSnake.some(([x, y]) => x === head[0] && y === head[1])
    ) {
      playOver()
      setGameOver(true)
      if (score > highScore) {
        localStorage.setItem('highScore', score.toString())
        setHighScore(score)
      }
      return
    }

    newSnake.unshift(head)

    // Eat food
    if (head[0] === food[0] && head[1] === food[1]) {
      playEat()
      setScore(score + 10)
      setSpeed((s) => Math.max(70, s - 5))
      setFood([
        Math.floor(Math.random() * boardSize),
        Math.floor(Math.random() * boardSize)
      ])
    } else {
      newSnake.pop()
    }

    setSnake(newSnake)
  }

  // Snake movement
  useEffect(() => {
    if (gameOver) return
    const interval = setInterval(moveSnake, speed)
    return () => clearInterval(interval)
  }, [snake, direction])

  // Arrow key handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [direction])

  const restartGame = () => {
    setSnake([[7, 7]])
    setFood([5, 5])
    setDirection('RIGHT')
    setSpeed(150)
    setGameOver(false)
    setScore(0)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-300 to-black text-white">
      <h1 className="text-4xl font-bold mb-3">🐸 Let The Hunt Begin</h1>
      <div className="flex justify-between w-72 mb-4 text-lg">
        <p>Score: <span className="text-green-400">{score}</span></p>
        <p>High: <span className="text-yellow-400">{highScore}</span></p>
      </div>

      {gameOver ? (
        <div className="text-center mt-4">
          <h2 className="text-red-500 text-xl mb-3 font-semibold">Game Over!</h2>
          <button
            onClick={restartGame}
            className="bg-green-500 hover:bg-green-600 transition px-5 py-2 rounded text-white font-medium"
          >
            Restart ▶️
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid border border-gray-700 rounded-md"
          style={{
            gridTemplateColumns: `repeat(${boardSize}, 24px)`,
            gridTemplateRows: `repeat(${boardSize}, 24px)`,
            gap: 1,
          }}
        >
          {Array.from({ length: boardSize * boardSize }).map((_, i) => {
            const x = i % boardSize
            const y = Math.floor(i / boardSize)
            const isSnake = snake.some(([sx, sy]) => sx === x && sy === y)
            const isHead = snake[0][0] === x && snake[0][1] === y
            const isFood = food[0] === x && food[1] === y

            return (
              <motion.div
                key={i}
                initial={{ scale: 0.7 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center w-6 h-6 bg-gray-800 rounded-sm"
              >
                {isHead ? '🐍' : isSnake ? '🟩' : isFood ? '🍎' : ''}
              </motion.div>
            )
          })}
        </motion.div>
      )}

      <p className="mt-6 text-sm text-gray-400">Use Arrow Keys to Move ⬆️⬇️⬅️➡️</p>
    </div>
  )
}
