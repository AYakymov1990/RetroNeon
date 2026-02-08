import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMenuTelemetryAverages, readMenuTelemetry } from '../app/menuTelemetry'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { useFocusScope } from '../focus/useFocusScope'
import { pl } from '../i18n/pl'

const SETTINGS_SCOPE_ID = 'settings'
const SETTINGS_AB_SCOPE_ID = 'settings-ab-modal'

const NODE_IDS = {
  graphics: 'settings-graphics',
  audio: 'settings-audio',
  controls: 'settings-controls',
  accessibility: 'settings-accessibility',
  showAbResults: 'settings-show-ab-results',
  back: 'settings-back',
} as const

const MODAL_NODE_IDS = {
  close: 'settings-ab-close',
} as const

export function SettingsScreen() {
  const navigate = useNavigate()
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isAbModalOpen, setIsAbModalOpen] = useState(false)
  const [telemetryEntries, setTelemetryEntries] = useState(() => readMenuTelemetry())

  const graphicsRef = useRef<HTMLButtonElement>(null)
  const audioRef = useRef<HTMLButtonElement>(null)
  const controlsRef = useRef<HTMLButtonElement>(null)
  const accessibilityRef = useRef<HTMLButtonElement>(null)
  const showAbResultsRef = useRef<HTMLButtonElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)

  const closeModalRef = useRef<HTMLButtonElement>(null)
  const wasModalOpen = useRef(false)

  const {
    activeId: settingsActiveId,
    registerNode: registerSettingsNode,
    setFocus: setSettingsFocus,
  } = useFocusScope(SETTINGS_SCOPE_ID, {
    onBack: () => navigate('/menu'),
    isActive: !isAbModalOpen,
  })

  const {
    activeId: modalActiveId,
    registerNode: registerModalNode,
    setFocus: setModalFocus,
  } = useFocusScope(SETTINGS_AB_SCOPE_ID, {
    onBack: () => setIsAbModalOpen(false),
    isActive: isAbModalOpen,
  })

  const openAbModal = useCallback(() => {
    setTelemetryEntries(readMenuTelemetry())
    setIsAbModalOpen(true)
  }, [])

  const closeAbModal = useCallback(() => {
    setIsAbModalOpen(false)
  }, [])

  useEffect(() => {
    const unregisterNodes = [
      registerSettingsNode({
        id: NODE_IDS.graphics,
        x: 0,
        y: 0,
        ref: graphicsRef,
        onConfirm: () => setStatusMessage(pl.settings.graphicsPlaceholder),
      }),
      registerSettingsNode({
        id: NODE_IDS.audio,
        x: 1,
        y: 0,
        ref: audioRef,
        onConfirm: () => navigate('/ustawienia/audio'),
      }),
      registerSettingsNode({
        id: NODE_IDS.controls,
        x: 0,
        y: 1,
        ref: controlsRef,
        onConfirm: () => setStatusMessage(pl.settings.controlsPlaceholder),
      }),
      registerSettingsNode({
        id: NODE_IDS.accessibility,
        x: 1,
        y: 1,
        ref: accessibilityRef,
        onConfirm: () => navigate('/ustawienia/dostepnosc'),
      }),
      registerSettingsNode({
        id: NODE_IDS.showAbResults,
        x: 0,
        y: 2,
        ref: showAbResultsRef,
        onConfirm: openAbModal,
      }),
      registerSettingsNode({
        id: NODE_IDS.back,
        x: 1,
        y: 2,
        ref: backRef,
        onConfirm: () => navigate('/menu'),
      }),
    ]

    return () => {
      unregisterNodes.forEach((unregister) => unregister())
    }
  }, [navigate, openAbModal, registerSettingsNode])

  useEffect(() => {
    if (settingsActiveId) {
      return
    }

    // Domyślnie ustawiamy fokus na "Audio", bo to kluczowy przepływ MVP (szybki dostęp do regulacji muzyki).
    setSettingsFocus(NODE_IDS.audio)
  }, [settingsActiveId, setSettingsFocus])

  useEffect(() => {
    if (!isAbModalOpen) {
      return
    }

    const unregisterNode = registerModalNode({
      id: MODAL_NODE_IDS.close,
      x: 0,
      y: 0,
      ref: closeModalRef,
      onConfirm: closeAbModal,
    })

    setModalFocus(MODAL_NODE_IDS.close)

    return () => {
      unregisterNode()
    }
  }, [closeAbModal, isAbModalOpen, registerModalNode, setModalFocus])

  useEffect(() => {
    if (wasModalOpen.current && !isAbModalOpen) {
      setSettingsFocus(NODE_IDS.showAbResults)
    }

    wasModalOpen.current = isAbModalOpen
  }, [isAbModalOpen, setSettingsFocus])

  const latestResults = useMemo(() => telemetryEntries.slice(-10).reverse(), [telemetryEntries])
  const averages = useMemo(() => getMenuTelemetryAverages(telemetryEntries), [telemetryEntries])

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center p-6">
      <section className="panel-surface w-full rounded-xl border p-6 sm:p-8">
        <h1 className="font-heading text-[32px] text-retroText">{pl.settings.heading}</h1>
        <p className="controls-hint mt-2 text-sm text-retroAccent">{pl.app.controlsHint}</p>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Button
            ref={graphicsRef}
            isFocused={settingsActiveId === NODE_IDS.graphics}
            onClick={() => setStatusMessage(pl.settings.graphicsPlaceholder)}
            onMouseEnter={() => setSettingsFocus(NODE_IDS.graphics)}
          >
            {pl.settings.graphics}
          </Button>

          <Button
            ref={audioRef}
            isFocused={settingsActiveId === NODE_IDS.audio}
            onClick={() => navigate('/ustawienia/audio')}
            onMouseEnter={() => setSettingsFocus(NODE_IDS.audio)}
          >
            {pl.settings.audio}
          </Button>

          <Button
            ref={controlsRef}
            isFocused={settingsActiveId === NODE_IDS.controls}
            onClick={() => setStatusMessage(pl.settings.controlsPlaceholder)}
            onMouseEnter={() => setSettingsFocus(NODE_IDS.controls)}
          >
            {pl.settings.controls}
          </Button>

          <Button
            ref={accessibilityRef}
            isFocused={settingsActiveId === NODE_IDS.accessibility}
            onClick={() => navigate('/ustawienia/dostepnosc')}
            onMouseEnter={() => setSettingsFocus(NODE_IDS.accessibility)}
          >
            {pl.settings.accessibility}
          </Button>

          <Button
            ref={showAbResultsRef}
            isFocused={settingsActiveId === NODE_IDS.showAbResults}
            onClick={openAbModal}
            onMouseEnter={() => setSettingsFocus(NODE_IDS.showAbResults)}
          >
            {pl.settings.showAbResults}
          </Button>

          <Button
            ref={backRef}
            isFocused={settingsActiveId === NODE_IDS.back}
            onClick={() => navigate('/menu')}
            onMouseEnter={() => setSettingsFocus(NODE_IDS.back)}
          >
            {pl.common.back}
          </Button>
        </div>

        {statusMessage ? (
          <p
            role="status"
            aria-live="polite"
            className="mt-6 rounded-md border border-retroAccent/50 bg-retroAccent/10 px-4 py-3 text-sm text-retroText"
          >
            {statusMessage}
          </p>
        ) : null}
      </section>

      <Modal isOpen={isAbModalOpen} title={pl.settings.abModalTitle}>
        <div className="space-y-4">
          {latestResults.length === 0 ? (
            <p className="text-sm text-retroText/85">{pl.settings.abNoResults}</p>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-[90px_120px_1fr] gap-2 text-xs uppercase tracking-wider text-retroText/75">
                <span>{pl.settings.abVariant}</span>
                <span>{pl.settings.abTime}</span>
                <span>{pl.settings.abDate}</span>
              </div>
              {latestResults.map((entry) => (
                <div
                  key={`${entry.timestamp}-${entry.timeMs}`}
                  className="grid grid-cols-[90px_120px_1fr] gap-2 rounded-md border border-retroAccent/35 bg-retroBg/70 px-3 py-2 text-sm"
                >
                  <span>{entry.variant}</span>
                  <span>{entry.timeMs} ms</span>
                  <span>{new Date(entry.timestamp).toLocaleString('pl-PL')}</span>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-1 rounded-md border border-retroAccent/40 bg-retroAccent/10 px-3 py-3 text-sm">
            <p>
              {pl.settings.abAverageA}:{' '}
              {averages.A !== null ? `${averages.A} ms` : pl.settings.abNoResults}
            </p>
            <p>
              {pl.settings.abAverageB}:{' '}
              {averages.B !== null ? `${averages.B} ms` : pl.settings.abNoResults}
            </p>
          </div>

          <Button
            ref={closeModalRef}
            isFocused={modalActiveId === MODAL_NODE_IDS.close}
            onClick={closeAbModal}
            onMouseEnter={() => setModalFocus(MODAL_NODE_IDS.close)}
          >
            {pl.common.close}
          </Button>
        </div>
      </Modal>
    </main>
  )
}
