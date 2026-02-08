/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { setUiSoundEnabled } from '../input/uiSound'

export type AudioSettings = {
  master: number
  music: number
  sfx: number
  uiSounds: boolean
}

export type AccessibilitySettings = {
  highContrast: boolean
  menuLayoutVertical: boolean
  minimalInterface: boolean
  reduceMotion: boolean
}

type SettingsContextValue = {
  audio: AudioSettings
  accessibility: AccessibilitySettings
  setAudio: (nextAudio: AudioSettings) => void
  setHighContrast: (isEnabled: boolean) => void
  setMenuLayoutVertical: (isEnabled: boolean) => void
  setMinimalInterface: (isEnabled: boolean) => void
  setReduceMotion: (isEnabled: boolean) => void
  setUiSounds: (isEnabled: boolean) => void
}

const AUDIO_DEFAULTS: AudioSettings = {
  master: 70,
  music: 60,
  sfx: 80,
  uiSounds: true,
}

const ACCESSIBILITY_DEFAULTS: AccessibilitySettings = {
  highContrast: false,
  menuLayoutVertical: false,
  minimalInterface: false,
  reduceMotion: false,
}

const AUDIO_STORAGE_KEY = 'retro-neon-audio'
const ACCESSIBILITY_STORAGE_KEY = 'retro-neon-accessibility'

const SettingsContext = createContext<SettingsContextValue | null>(null)

function getSystemReducedMotionPreference(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function readAudioFromStorage(): AudioSettings {
  if (typeof window === 'undefined') {
    return AUDIO_DEFAULTS
  }

  try {
    const rawValue = window.localStorage.getItem(AUDIO_STORAGE_KEY)
    if (!rawValue) {
      return AUDIO_DEFAULTS
    }

    const parsedValue = JSON.parse(rawValue) as Partial<AudioSettings>

    return {
      master: typeof parsedValue.master === 'number' ? parsedValue.master : AUDIO_DEFAULTS.master,
      music: typeof parsedValue.music === 'number' ? parsedValue.music : AUDIO_DEFAULTS.music,
      sfx: typeof parsedValue.sfx === 'number' ? parsedValue.sfx : AUDIO_DEFAULTS.sfx,
      uiSounds: parsedValue.uiSounds !== false,
    }
  } catch {
    return AUDIO_DEFAULTS
  }
}

function readAccessibilityFromStorage(): AccessibilitySettings {
  const systemReducedMotion = getSystemReducedMotionPreference()

  if (typeof window === 'undefined') {
    return {
      ...ACCESSIBILITY_DEFAULTS,
      reduceMotion: systemReducedMotion,
    }
  }

  try {
    const rawValue = window.localStorage.getItem(ACCESSIBILITY_STORAGE_KEY)
    if (!rawValue) {
      return {
        ...ACCESSIBILITY_DEFAULTS,
        reduceMotion: systemReducedMotion,
      }
    }

    const parsedValue = JSON.parse(rawValue) as Partial<AccessibilitySettings>

    return {
      highContrast: parsedValue.highContrast === true,
      menuLayoutVertical: parsedValue.menuLayoutVertical === true,
      minimalInterface: parsedValue.minimalInterface === true,
      reduceMotion:
        typeof parsedValue.reduceMotion === 'boolean'
          ? parsedValue.reduceMotion
          : systemReducedMotion,
    }
  } catch {
    return {
      ...ACCESSIBILITY_DEFAULTS,
      reduceMotion: systemReducedMotion,
    }
  }
}

type SettingsProviderProps = {
  children: ReactNode
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [audio, setAudio] = useState<AudioSettings>(() => readAudioFromStorage())
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() =>
    readAccessibilityFromStorage(),
  )

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify(audio))
  }, [audio])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(accessibility))
  }, [accessibility])

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    const root = document.documentElement
    root.classList.toggle('high-contrast', accessibility.highContrast)
    root.classList.toggle('minimal-ui', accessibility.minimalInterface)
    root.classList.toggle('reduce-motion', accessibility.reduceMotion)
  }, [accessibility.highContrast, accessibility.minimalInterface, accessibility.reduceMotion])

  useEffect(() => {
    setUiSoundEnabled(audio.uiSounds)
  }, [audio.uiSounds])

  const contextValue = useMemo<SettingsContextValue>(
    () => ({
      audio,
      accessibility,
      setAudio,
      setHighContrast: (isEnabled: boolean) => {
        setAccessibility((previousState) => ({
          ...previousState,
          highContrast: isEnabled,
        }))
      },
      setMenuLayoutVertical: (isEnabled: boolean) => {
        setAccessibility((previousState) => ({
          ...previousState,
          menuLayoutVertical: isEnabled,
        }))
      },
      setMinimalInterface: (isEnabled: boolean) => {
        setAccessibility((previousState) => ({
          ...previousState,
          minimalInterface: isEnabled,
        }))
      },
      setReduceMotion: (isEnabled: boolean) => {
        setAccessibility((previousState) => ({
          ...previousState,
          reduceMotion: isEnabled,
        }))
      },
      setUiSounds: (isEnabled: boolean) => {
        setAudio((previousState) => ({
          ...previousState,
          uiSounds: isEnabled,
        }))
      },
    }),
    [audio, accessibility],
  )

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const context = useContext(SettingsContext)

  if (!context) {
    throw new Error('useSettings musi być używany wewnątrz SettingsProvider.')
  }

  return context
}
