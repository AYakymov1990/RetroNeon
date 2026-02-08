import { useEffect } from 'react'
import { focusManager } from './FocusManager'

export function useGlobalFocusNavigation() {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTextInput =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable

      if (isTextInput) {
        return
      }

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault()
          focusManager.move('up')
          break
        case 'ArrowDown':
          event.preventDefault()
          focusManager.move('down')
          break
        case 'ArrowLeft':
          event.preventDefault()
          focusManager.move('left')
          break
        case 'ArrowRight':
          event.preventDefault()
          focusManager.move('right')
          break
        case 'Tab':
          event.preventDefault()
          focusManager.move(event.shiftKey ? 'left' : 'right')
          break
        case 'Enter':
        case 'NumpadEnter':
          event.preventDefault()
          focusManager.confirm()
          break
        case 'Escape':
          event.preventDefault()
          focusManager.back()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])
}
