import { useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from './ui/button'
import { Moon, Sun } from '@phosphor-icons/react'

export function ThemeToggle() {
  const [theme, setTheme] = useKV<'light' | 'dark'>('theme', 'light')

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((current) => current === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="fixed bottom-6 left-6"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  )
}
