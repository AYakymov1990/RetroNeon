import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../app/SettingsProvider'
import { Button } from '../components/ui/Button'
import { Slider } from '../components/ui/Slider'
import { Toggle } from '../components/ui/Toggle'
import { useFocusScope } from '../focus/useFocusScope'
import { pl } from '../i18n/pl'

const SETTINGS_AUDIO_SCOPE_ID = 'settings-audio'

const NODE_IDS = {
  master: 'settings-audio-master',
  music: 'settings-audio-music',
  sfx: 'settings-audio-sfx',
  uiSounds: 'settings-audio-ui-sounds',
  apply: 'settings-audio-apply',
  back: 'settings-audio-back',
} as const

type AudioField = 'master' | 'music' | 'sfx'

type SaveNoticeTimeout = ReturnType<typeof setTimeout>

function clampVolume(value: number): number {
  return Math.max(0, Math.min(100, value))
}

export function SettingsAudioScreen() {
  const navigate = useNavigate()
  const { audio, setAudio } = useSettings()

  const [draftAudio, setDraftAudio] = useState(audio)
  const [isSaveNoticeVisible, setIsSaveNoticeVisible] = useState(false)

  const masterRef = useRef<HTMLDivElement>(null)
  const musicRef = useRef<HTMLDivElement>(null)
  const sfxRef = useRef<HTMLDivElement>(null)
  const uiSoundsRef = useRef<HTMLButtonElement>(null)
  const applyRef = useRef<HTMLButtonElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)

  const hideNoticeTimeoutRef = useRef<SaveNoticeTimeout | null>(null)

  const { activeId, registerNode, setFocus } = useFocusScope(SETTINGS_AUDIO_SCOPE_ID, {
    onBack: () => navigate('/ustawienia'),
  })

  useEffect(() => {
    setDraftAudio(audio)
  }, [audio])

  const adjustVolume = useCallback((field: AudioField, delta: number) => {
    setDraftAudio((previousAudio) => ({
      ...previousAudio,
      [field]: clampVolume(previousAudio[field] + delta),
    }))
  }, [])

  const saveAudio = useCallback(() => {
    setAudio(draftAudio)
    setIsSaveNoticeVisible(true)

    if (hideNoticeTimeoutRef.current) {
      clearTimeout(hideNoticeTimeoutRef.current)
    }

    hideNoticeTimeoutRef.current = setTimeout(() => {
      setIsSaveNoticeVisible(false)
      hideNoticeTimeoutRef.current = null
    }, 2000)
  }, [draftAudio, setAudio])

  useEffect(() => {
    return () => {
      if (hideNoticeTimeoutRef.current) {
        clearTimeout(hideNoticeTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const unregisterNodes = [
      registerNode({
        id: NODE_IDS.master,
        x: 0,
        y: 0,
        ref: masterRef,
        onDirection: (direction) => {
          if (direction === 'left') {
            adjustVolume('master', -5)
            return true
          }

          if (direction === 'right') {
            adjustVolume('master', 5)
            return true
          }

          return false
        },
      }),
      registerNode({
        id: NODE_IDS.music,
        x: 0,
        y: 1,
        ref: musicRef,
        onDirection: (direction) => {
          if (direction === 'left') {
            adjustVolume('music', -5)
            return true
          }

          if (direction === 'right') {
            adjustVolume('music', 5)
            return true
          }

          return false
        },
      }),
      registerNode({
        id: NODE_IDS.sfx,
        x: 0,
        y: 2,
        ref: sfxRef,
        onDirection: (direction) => {
          if (direction === 'left') {
            adjustVolume('sfx', -5)
            return true
          }

          if (direction === 'right') {
            adjustVolume('sfx', 5)
            return true
          }

          return false
        },
      }),
      registerNode({
        id: NODE_IDS.uiSounds,
        x: 0,
        y: 3,
        ref: uiSoundsRef,
        onConfirm: () => {
          setDraftAudio((previousAudio) => ({
            ...previousAudio,
            uiSounds: !previousAudio.uiSounds,
          }))
        },
      }),
      registerNode({
        id: NODE_IDS.apply,
        x: 0,
        y: 4,
        ref: applyRef,
        onConfirm: saveAudio,
      }),
      registerNode({
        id: NODE_IDS.back,
        x: 0,
        y: 5,
        ref: backRef,
        onConfirm: () => navigate('/ustawienia'),
      }),
    ]

    return () => {
      unregisterNodes.forEach((unregister) => unregister())
    }
  }, [adjustVolume, navigate, registerNode, saveAudio])

  useEffect(() => {
    if (activeId) {
      return
    }

    setFocus(NODE_IDS.master)
  }, [activeId, setFocus])

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center p-6">
      <section className="panel-surface w-full rounded-xl border p-6 sm:p-8">
        <h1 className="font-heading text-[32px] text-retroText">{pl.settingsAudio.heading}</h1>
        <p className="controls-hint mt-2 text-sm text-retroAccent">{pl.app.controlsHint}</p>

        <div className="mt-8 space-y-4">
          <Slider
            ref={masterRef}
            label={pl.settingsAudio.master}
            value={draftAudio.master}
            isFocused={activeId === NODE_IDS.master}
            onMouseEnter={() => setFocus(NODE_IDS.master)}
          />

          <Slider
            ref={musicRef}
            label={pl.settingsAudio.music}
            value={draftAudio.music}
            isFocused={activeId === NODE_IDS.music}
            onMouseEnter={() => setFocus(NODE_IDS.music)}
          />

          <Slider
            ref={sfxRef}
            label={pl.settingsAudio.sfx}
            value={draftAudio.sfx}
            isFocused={activeId === NODE_IDS.sfx}
            onMouseEnter={() => setFocus(NODE_IDS.sfx)}
          />

          <Toggle
            ref={uiSoundsRef}
            label={pl.settingsAudio.uiSounds}
            checked={draftAudio.uiSounds}
            isFocused={activeId === NODE_IDS.uiSounds}
            onClick={() =>
              setDraftAudio((previousAudio) => ({
                ...previousAudio,
                uiSounds: !previousAudio.uiSounds,
              }))
            }
            onMouseEnter={() => setFocus(NODE_IDS.uiSounds)}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Button
            ref={applyRef}
            isFocused={activeId === NODE_IDS.apply}
            onClick={saveAudio}
            onMouseEnter={() => setFocus(NODE_IDS.apply)}
          >
            {pl.common.apply}
          </Button>

          <Button
            ref={backRef}
            isFocused={activeId === NODE_IDS.back}
            onClick={() => navigate('/ustawienia')}
            onMouseEnter={() => setFocus(NODE_IDS.back)}
          >
            {pl.common.back}
          </Button>
        </div>

        {isSaveNoticeVisible ? (
          <p
            role="status"
            aria-live="polite"
            className="mt-6 rounded-md border border-retroAccent/50 bg-retroAccent/10 px-4 py-3 text-sm text-retroText"
          >
            {pl.settingsAudio.saved}
          </p>
        ) : null}
      </section>
    </main>
  )
}
