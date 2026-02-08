import { useCallback, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { useFocusScope } from '../focus/useFocusScope'
import { pl } from '../i18n/pl'

const START_NODE_ID = 'start-enter'

type StartLocationState = {
  sessionMessage?: string
}

export function StartScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const openMenu = useCallback(() => {
    navigate('/menu')
  }, [navigate])

  const { activeId, registerNode, setFocus } = useFocusScope('start')

  useEffect(() => {
    return registerNode({
      id: START_NODE_ID,
      x: 0,
      y: 0,
      ref: buttonRef,
      onConfirm: openMenu,
    })
  }, [openMenu, registerNode])

  useEffect(() => {
    setFocus(START_NODE_ID)
  }, [setFocus])

  const state = (location.state as StartLocationState | null) ?? null

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="panel-surface w-full max-w-xl rounded-xl border border-retroAccent/50 p-8 text-center shadow-neon">
        <h1 className="font-heading text-[32px] text-retroText">{pl.start.heading}</h1>
        <p className="mt-4 text-lg text-retroText/90">{pl.start.hint}</p>

        {state?.sessionMessage ? (
          <p
            role="status"
            aria-live="polite"
            className="mt-4 rounded-md border border-retroWarn/70 bg-retroWarn/10 px-4 py-2 text-retroWarn"
          >
            {state.sessionMessage}
          </p>
        ) : null}

        <div className="mx-auto mt-8 max-w-xs">
          <Button
            ref={buttonRef}
            isFocused={activeId === START_NODE_ID}
            onClick={openMenu}
            onMouseEnter={() => setFocus(START_NODE_ID)}
          >
            {pl.start.action}
          </Button>
        </div>
      </section>
    </main>
  )
}
