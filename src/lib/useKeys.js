import { useEffect } from 'react'

// window-level shortcuts. skipped while typing, when the component is hidden (inactive tab),
// and for enter/space on buttons since those already click
export function useKeys(ref, onKey) {
  useEffect(() => {
    function handle(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.target.closest('input, textarea, select')) return
      if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('button')) return
      if (!ref.current || ref.current.offsetParent === null) return
      if (onKey(e.key)) e.preventDefault()
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  })
}
