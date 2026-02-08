import { useEffect, useRef } from 'react'
import { focusManager } from '../focus/FocusManager'

type Direction = 'up' | 'down' | 'left' | 'right'

type DirectionTimestampMap = Record<Direction, number>

const DPAD_BUTTON_MAP: Array<{ index: number; direction: Direction }> = [
  { index: 12, direction: 'up' },
  { index: 13, direction: 'down' },
  { index: 14, direction: 'left' },
  { index: 15, direction: 'right' },
]

const AXIS_THRESHOLD = 0.7
const INPUT_COOLDOWN_MS = 180

function getFirstConnectedGamepad(): Gamepad | null {
  if (typeof navigator === 'undefined' || typeof navigator.getGamepads !== 'function') {
    return null
  }

  const gamepads = navigator.getGamepads()
  if (!gamepads) {
    return null
  }

  for (const gamepad of gamepads) {
    if (gamepad && gamepad.connected) {
      return gamepad
    }
  }

  return null
}

export function useGamepadInput() {
  const rafIdRef = useRef<number | null>(null)
  const isGamepadConnectedRef = useRef(false)

  const directionLastTimeRef = useRef<DirectionTimestampMap>({
    up: 0,
    down: 0,
    left: 0,
    right: 0,
  })

  const buttonWasPressedRef = useRef({
    confirm: false,
    back: false,
  })

  useEffect(() => {
    const onGamepadConnected = () => {
      isGamepadConnectedRef.current = true
    }

    const onGamepadDisconnected = () => {
      const activeGamepad = getFirstConnectedGamepad()
      isGamepadConnectedRef.current = Boolean(activeGamepad)
    }

    const handleDirectionalInput = (direction: Direction, now: number) => {
      const lastTime = directionLastTimeRef.current[direction]
      if (now - lastTime < INPUT_COOLDOWN_MS) {
        return
      }

      directionLastTimeRef.current[direction] = now
      focusManager.move(direction)
    }

    const tick = () => {
      const now = performance.now()
      const gamepad = getFirstConnectedGamepad()

      if (gamepad) {
        isGamepadConnectedRef.current = true

        for (const { index, direction } of DPAD_BUTTON_MAP) {
          if (gamepad.buttons[index]?.pressed) {
            handleDirectionalInput(direction, now)
          }
        }

        const horizontalAxis = gamepad.axes[0] ?? 0
        const verticalAxis = gamepad.axes[1] ?? 0

        if (horizontalAxis > AXIS_THRESHOLD) {
          handleDirectionalInput('right', now)
        } else if (horizontalAxis < -AXIS_THRESHOLD) {
          handleDirectionalInput('left', now)
        }

        if (verticalAxis > AXIS_THRESHOLD) {
          handleDirectionalInput('down', now)
        } else if (verticalAxis < -AXIS_THRESHOLD) {
          handleDirectionalInput('up', now)
        }

        const confirmPressed = gamepad.buttons[0]?.pressed === true
        const backPressed = gamepad.buttons[1]?.pressed === true

        if (confirmPressed && !buttonWasPressedRef.current.confirm) {
          focusManager.confirm()
        }

        if (backPressed && !buttonWasPressedRef.current.back) {
          focusManager.back()
        }

        buttonWasPressedRef.current.confirm = confirmPressed
        buttonWasPressedRef.current.back = backPressed
      } else {
        isGamepadConnectedRef.current = false
        buttonWasPressedRef.current.confirm = false
        buttonWasPressedRef.current.back = false
      }

      rafIdRef.current = window.requestAnimationFrame(tick)
    }

    window.addEventListener('gamepadconnected', onGamepadConnected)
    window.addEventListener('gamepaddisconnected', onGamepadDisconnected)

    rafIdRef.current = window.requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('gamepadconnected', onGamepadConnected)
      window.removeEventListener('gamepaddisconnected', onGamepadDisconnected)

      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])
}
