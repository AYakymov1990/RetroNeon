import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../app/SettingsProvider'
import { Button } from '../components/ui/Button'
import { Toggle } from '../components/ui/Toggle'
import { useFocusScope } from '../focus/useFocusScope'
import { pl } from '../i18n/pl'

const SETTINGS_ACCESSIBILITY_SCOPE_ID = 'settings-accessibility'

const NODE_IDS = {
  highContrast: 'settings-accessibility-high-contrast',
  menuLayout: 'settings-accessibility-menu-layout',
  minimalUi: 'settings-accessibility-minimal-ui',
  reduceMotion: 'settings-accessibility-reduce-motion',
  back: 'settings-accessibility-back',
} as const

export function SettingsAccessibilityScreen() {
  const navigate = useNavigate()
  const { accessibility, setHighContrast, setMenuLayoutVertical, setMinimalInterface, setReduceMotion } =
    useSettings()

  const highContrastRef = useRef<HTMLButtonElement>(null)
  const menuLayoutRef = useRef<HTMLButtonElement>(null)
  const minimalUiRef = useRef<HTMLButtonElement>(null)
  const reduceMotionRef = useRef<HTMLButtonElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)

  const { activeId, registerNode, setFocus } = useFocusScope(SETTINGS_ACCESSIBILITY_SCOPE_ID, {
    onBack: () => navigate('/ustawienia'),
  })

  useEffect(() => {
    const unregisterNodes = [
      registerNode({
        id: NODE_IDS.highContrast,
        x: 0,
        y: 0,
        ref: highContrastRef,
        onConfirm: () => setHighContrast(!accessibility.highContrast),
      }),
      registerNode({
        id: NODE_IDS.menuLayout,
        x: 0,
        y: 1,
        ref: menuLayoutRef,
        onConfirm: () => setMenuLayoutVertical(!accessibility.menuLayoutVertical),
      }),
      registerNode({
        id: NODE_IDS.minimalUi,
        x: 0,
        y: 2,
        ref: minimalUiRef,
        onConfirm: () => setMinimalInterface(!accessibility.minimalInterface),
      }),
      registerNode({
        id: NODE_IDS.reduceMotion,
        x: 0,
        y: 3,
        ref: reduceMotionRef,
        onConfirm: () => setReduceMotion(!accessibility.reduceMotion),
      }),
      registerNode({
        id: NODE_IDS.back,
        x: 0,
        y: 4,
        ref: backRef,
        onConfirm: () => navigate('/ustawienia'),
      }),
    ]

    return () => {
      unregisterNodes.forEach((unregister) => unregister())
    }
  }, [
    accessibility.highContrast,
    accessibility.menuLayoutVertical,
    accessibility.minimalInterface,
    accessibility.reduceMotion,
    navigate,
    registerNode,
    setHighContrast,
    setMenuLayoutVertical,
    setMinimalInterface,
    setReduceMotion,
  ])

  useEffect(() => {
    if (activeId) {
      return
    }

    setFocus(NODE_IDS.highContrast)
  }, [activeId, setFocus])

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center p-6">
      <section className="panel-surface w-full rounded-xl border p-6 sm:p-8">
        <h1 className="font-heading text-[32px] text-retroText">{pl.settingsAccessibility.heading}</h1>
        <p className="controls-hint mt-2 text-sm text-retroAccent">{pl.app.controlsHint}</p>

        <div className="mt-8 space-y-4">
          <Toggle
            ref={highContrastRef}
            label={pl.settingsAccessibility.highContrast}
            checked={accessibility.highContrast}
            isFocused={activeId === NODE_IDS.highContrast}
            onClick={() => setHighContrast(!accessibility.highContrast)}
            onMouseEnter={() => setFocus(NODE_IDS.highContrast)}
          />

          <Toggle
            ref={menuLayoutRef}
            label={pl.settingsAccessibility.menuLayoutVertical}
            checked={accessibility.menuLayoutVertical}
            isFocused={activeId === NODE_IDS.menuLayout}
            onClick={() => setMenuLayoutVertical(!accessibility.menuLayoutVertical)}
            onMouseEnter={() => setFocus(NODE_IDS.menuLayout)}
          />

          <Toggle
            ref={minimalUiRef}
            label={pl.settingsAccessibility.minimalInterface}
            checked={accessibility.minimalInterface}
            isFocused={activeId === NODE_IDS.minimalUi}
            onClick={() => setMinimalInterface(!accessibility.minimalInterface)}
            onMouseEnter={() => setFocus(NODE_IDS.minimalUi)}
          />

          <Toggle
            ref={reduceMotionRef}
            label={pl.settingsAccessibility.reduceMotion}
            checked={accessibility.reduceMotion}
            isFocused={activeId === NODE_IDS.reduceMotion}
            onClick={() => setReduceMotion(!accessibility.reduceMotion)}
            onMouseEnter={() => setFocus(NODE_IDS.reduceMotion)}
          />

          <Button
            ref={backRef}
            isFocused={activeId === NODE_IDS.back}
            onClick={() => navigate('/ustawienia')}
            onMouseEnter={() => setFocus(NODE_IDS.back)}
          >
            {pl.common.back}
          </Button>
        </div>
      </section>
    </main>
  )
}
