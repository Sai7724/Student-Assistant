import { useState } from 'react'
import { Moon, Sun } from './Doodles.jsx'

// the real theme is the class on <html> (index.html sets it before paint), state is just for the icon
export default function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark-mode'))

  // localStorage throws in some private modes, not worth crashing over
  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark-mode', next)

    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {}
  }

  const label = dark ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={label}
      aria-pressed={dark}
      title={label}
    >
      {dark ? <Sun /> : <Moon />}
    </button>
  )
}
