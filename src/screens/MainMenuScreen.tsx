import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { useNavigate } from 'react-router-dom'
import { appendMenuTelemetry, type MenuVariant } from '../app/menuTelemetry'
import { useSettings } from '../app/SettingsProvider'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { useFocusScope } from '../focus/useFocusScope'
import { pl } from '../i18n/pl'

const MENU_SCOPE_ID = 'menu'
const MODAL_SCOPE_ID = 'menu-exit-modal'

const MENU_NODE_IDS = {
  play: 'menu-play',
  settings: 'menu-settings',
  profile: 'menu-profile',
  accessibility: 'menu-accessibility',
  hub: 'menu-hub',
  exit: 'menu-exit',
} as const

const MODAL_NODE_IDS = {
  confirm: 'modal-confirm',
  cancel: 'modal-cancel',
} as const

const MENU_ORDER = [
  MENU_NODE_IDS.play,
  MENU_NODE_IDS.settings,
  MENU_NODE_IDS.profile,
  MENU_NODE_IDS.accessibility,
  MENU_NODE_IDS.hub,
  MENU_NODE_IDS.exit,
] as const

type MenuNodeId = (typeof MENU_ORDER)[number]

const MENU_VARIANT_A_COORDS: Record<MenuNodeId, { x: number; y: number }> = {
  [MENU_NODE_IDS.play]: { x: 0, y: 0 },
  [MENU_NODE_IDS.settings]: { x: 1, y: 0 },
  [MENU_NODE_IDS.profile]: { x: 0, y: 1 },
  [MENU_NODE_IDS.accessibility]: { x: 1, y: 1 },
  [MENU_NODE_IDS.hub]: { x: 0, y: 2 },
  [MENU_NODE_IDS.exit]: { x: 1, y: 2 },
}

function getMenuCoordinates(nodeId: MenuNodeId, variant: MenuVariant) {
  if (variant === 'B') {
    // W wariancie pionowym wszystkie pozycje mają x=0, więc lewo/prawo pozostaje na tym samym elemencie.
    return {
      x: 0,
      y: MENU_ORDER.indexOf(nodeId),
    }
  }

  return MENU_VARIANT_A_COORDS[nodeId]
}

export function MainMenuScreen() {
  const navigate = useNavigate()
  const { accessibility } = useSettings()

  const [isExitModalOpen, setIsExitModalOpen] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const playRef = useRef<HTMLButtonElement>(null)
  const settingsRef = useRef<HTMLButtonElement>(null)
  const profileRef = useRef<HTMLButtonElement>(null)
  const accessibilityRef = useRef<HTMLButtonElement>(null)
  const hubRef = useRef<HTMLButtonElement>(null)
  const exitRef = useRef<HTMLButtonElement>(null)

  const confirmExitRef = useRef<HTMLButtonElement>(null)
  const cancelExitRef = useRef<HTMLButtonElement>(null)

  const wasExitModalOpen = useRef(false)
  const menuEntryStartRef = useRef<number | null>(null)
  const telemetryCapturedRef = useRef(false)

  const menuVariant: MenuVariant = accessibility.menuLayoutVertical ? 'B' : 'A'

  useEffect(() => {
    menuEntryStartRef.current = performance.now()
    telemetryCapturedRef.current = false
  }, [menuVariant])

  const measurePlaySelection = useCallback(() => {
    if (telemetryCapturedRef.current || menuEntryStartRef.current === null) {
      return
    }

    telemetryCapturedRef.current = true

    appendMenuTelemetry({
      variant: menuVariant,
      timeMs: Math.max(0, Math.round(performance.now() - menuEntryStartRef.current)),
      timestamp: new Date().toISOString(),
    })
  }, [menuVariant])

  const openPlay = useCallback(() => {
    measurePlaySelection()
    setStatusMessage(pl.menu.playPlaceholder)
  }, [measurePlaySelection])

  const closeExitModal = useCallback(() => {
    setIsExitModalOpen(false)
  }, [])

  const finishSession = useCallback(() => {
    setIsExitModalOpen(false)
    navigate('/start', {
      state: {
        sessionMessage: pl.start.sessionEnded,
      },
    })
  }, [navigate])

  const {
    activeId: menuActiveId,
    registerNode: registerMenuNode,
    setFocus: setMenuFocus,
  } = useFocusScope(MENU_SCOPE_ID, {
    onBack: () => navigate('/start'),
    isActive: !isExitModalOpen,
  })

  const {
    activeId: modalActiveId,
    registerNode: registerModalNode,
    setFocus: setModalFocus,
  } = useFocusScope(MODAL_SCOPE_ID, {
    onBack: closeExitModal,
    isActive: isExitModalOpen,
  })

  useEffect(() => {
    const refById: Record<MenuNodeId, RefObject<HTMLButtonElement | null>> = {
      [MENU_NODE_IDS.play]: playRef,
      [MENU_NODE_IDS.settings]: settingsRef,
      [MENU_NODE_IDS.profile]: profileRef,
      [MENU_NODE_IDS.accessibility]: accessibilityRef,
      [MENU_NODE_IDS.hub]: hubRef,
      [MENU_NODE_IDS.exit]: exitRef,
    }

    const actionById: Record<MenuNodeId, () => void> = {
      [MENU_NODE_IDS.play]: openPlay,
      [MENU_NODE_IDS.settings]: () => navigate('/ustawienia'),
      [MENU_NODE_IDS.profile]: () => navigate('/profil'),
      [MENU_NODE_IDS.accessibility]: () => navigate('/ustawienia/dostepnosc'),
      [MENU_NODE_IDS.hub]: () => navigate('/hub'),
      [MENU_NODE_IDS.exit]: () => setIsExitModalOpen(true),
    }

    const unregisterNodes = MENU_ORDER.map((nodeId) => {
      const coordinates = getMenuCoordinates(nodeId, menuVariant)

      return registerMenuNode({
        id: nodeId,
        ...coordinates,
        ref: refById[nodeId],
        onConfirm: actionById[nodeId],
      })
    })

    return () => {
      unregisterNodes.forEach((unregister) => unregister())
    }
  }, [menuVariant, navigate, openPlay, registerMenuNode])

  useEffect(() => {
    if (isExitModalOpen) {
      return
    }

    if (!menuActiveId) {
      setMenuFocus(MENU_NODE_IDS.play)
    }
  }, [isExitModalOpen, menuActiveId, setMenuFocus])

  useEffect(() => {
    if (!isExitModalOpen) {
      return
    }

    const unregisterNodes = [
      registerModalNode({
        id: MODAL_NODE_IDS.confirm,
        x: 0,
        y: 0,
        ref: confirmExitRef,
        onConfirm: finishSession,
      }),
      registerModalNode({
        id: MODAL_NODE_IDS.cancel,
        x: 1,
        y: 0,
        ref: cancelExitRef,
        onConfirm: closeExitModal,
      }),
    ]

    setModalFocus(MODAL_NODE_IDS.cancel)

    return () => {
      unregisterNodes.forEach((unregister) => unregister())
    }
  }, [closeExitModal, finishSession, isExitModalOpen, registerModalNode, setModalFocus])

  useEffect(() => {
    if (wasExitModalOpen.current && !isExitModalOpen) {
      setMenuFocus(MENU_NODE_IDS.exit)
    }

    wasExitModalOpen.current = isExitModalOpen
  }, [isExitModalOpen, setMenuFocus])

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center p-6">
      <section className="panel-surface w-full rounded-xl border p-6 sm:p-8">
        <h1 className="font-heading text-[32px] text-retroText">{pl.menu.heading}</h1>
        <p className="controls-hint mt-2 text-sm text-retroAccent">{pl.app.controlsHint}</p>

        <div
          data-testid="main-menu-grid"
          data-menu-variant={menuVariant}
          className={[
            'mt-8 grid gap-4',
            menuVariant === 'A' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-xl',
          ].join(' ')}
        >
          <Button
            ref={playRef}
            isFocused={!isExitModalOpen && menuActiveId === MENU_NODE_IDS.play}
            onClick={openPlay}
            onMouseEnter={() => setMenuFocus(MENU_NODE_IDS.play)}
          >
            {pl.menu.play}
          </Button>
          <Button
            ref={settingsRef}
            isFocused={!isExitModalOpen && menuActiveId === MENU_NODE_IDS.settings}
            onClick={() => navigate('/ustawienia')}
            onMouseEnter={() => setMenuFocus(MENU_NODE_IDS.settings)}
          >
            {pl.menu.settings}
          </Button>
          <Button
            ref={profileRef}
            isFocused={!isExitModalOpen && menuActiveId === MENU_NODE_IDS.profile}
            onClick={() => navigate('/profil')}
            onMouseEnter={() => setMenuFocus(MENU_NODE_IDS.profile)}
          >
            {pl.menu.profile}
          </Button>
          <Button
            ref={accessibilityRef}
            isFocused={!isExitModalOpen && menuActiveId === MENU_NODE_IDS.accessibility}
            onClick={() => navigate('/ustawienia/dostepnosc')}
            onMouseEnter={() => setMenuFocus(MENU_NODE_IDS.accessibility)}
          >
            {pl.menu.accessibility}
          </Button>
          <Button
            ref={hubRef}
            isFocused={!isExitModalOpen && menuActiveId === MENU_NODE_IDS.hub}
            onClick={() => navigate('/hub')}
            onMouseEnter={() => setMenuFocus(MENU_NODE_IDS.hub)}
          >
            {pl.menu.hub}
          </Button>
          <Button
            ref={exitRef}
            isFocused={!isExitModalOpen && menuActiveId === MENU_NODE_IDS.exit}
            onClick={() => setIsExitModalOpen(true)}
            onMouseEnter={() => setMenuFocus(MENU_NODE_IDS.exit)}
          >
            {pl.menu.exit}
          </Button>
        </div>

        {statusMessage ? (
          <p
            role="status"
            aria-live="polite"
            className="mt-6 rounded-md border border-retroAccent/40 bg-retroAccent/10 px-4 py-3 text-sm text-retroText"
          >
            {statusMessage}
          </p>
        ) : null}
      </section>

      <Modal isOpen={isExitModalOpen} title={pl.exitModal.title}>
        <div className="grid grid-cols-2 gap-3">
          <Button
            ref={confirmExitRef}
            isFocused={isExitModalOpen && modalActiveId === MODAL_NODE_IDS.confirm}
            onClick={finishSession}
            onMouseEnter={() => setModalFocus(MODAL_NODE_IDS.confirm)}
          >
            {pl.exitModal.confirm}
          </Button>
          <Button
            ref={cancelExitRef}
            isFocused={isExitModalOpen && modalActiveId === MODAL_NODE_IDS.cancel}
            onClick={closeExitModal}
            onMouseEnter={() => setModalFocus(MODAL_NODE_IDS.cancel)}
          >
            {pl.exitModal.cancel}
          </Button>
        </div>
      </Modal>
    </main>
  )
}
