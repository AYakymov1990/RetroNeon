import { createRef, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { StatPanel } from '../components/ui/StatPanel'
import { useFocusScope } from '../focus/useFocusScope'
import { pl } from '../i18n/pl'

const STATS_SCOPE_ID = 'stats'
const STATS_COLUMNS = 2

const NODE_IDS = {
  back: 'stats-back',
} as const

function getPanelNodeId(panelId: string) {
  return `stats-panel-${panelId}`
}

export function ProfileStatsScreen() {
  const navigate = useNavigate()

  const panelRefs = useMemo(() => pl.stats.panels.map(() => createRef<HTMLDivElement>()), [])
  const backRef = useRef<HTMLButtonElement>(null)

  const { activeId, registerNode, setFocus } = useFocusScope(STATS_SCOPE_ID, {
    onBack: () => navigate('/profil'),
  })

  useEffect(() => {
    const unregisterNodes = pl.stats.panels.map((panel, index) =>
      registerNode({
        id: getPanelNodeId(panel.id),
        x: index % STATS_COLUMNS,
        y: Math.floor(index / STATS_COLUMNS),
        ref: panelRefs[index],
      }),
    )

    unregisterNodes.push(
      registerNode({
        id: NODE_IDS.back,
        x: 0,
        y: Math.ceil(pl.stats.panels.length / STATS_COLUMNS),
        ref: backRef,
        onConfirm: () => navigate('/profil'),
      }),
    )

    return () => {
      unregisterNodes.forEach((unregister) => unregister())
    }
  }, [navigate, panelRefs, registerNode])

  useEffect(() => {
    if (activeId) {
      return
    }

    // Domyślny fokus ustawiamy na pierwszym panelu, aby od razu pokazać kluczowe statystyki gracza.
    setFocus(getPanelNodeId(pl.stats.panels[0].id))
  }, [activeId, setFocus])

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center p-6">
      <section className="panel-surface w-full rounded-xl border p-6 sm:p-8">
        <h1 className="font-heading text-[32px] text-retroText">{pl.stats.heading}</h1>
        <p className="mt-3 text-sm text-retroText/80">{pl.stats.description}</p>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {pl.stats.panels.map((panel, index) => {
            const nodeId = getPanelNodeId(panel.id)

            return (
              <StatPanel
                key={panel.id}
                ref={panelRefs[index]}
                label={panel.label}
                value={panel.value}
                isFocused={activeId === nodeId}
                onMouseEnter={() => setFocus(nodeId)}
              />
            )
          })}
        </div>

        <div className="mt-8 rounded-lg border border-retroAccent/45 bg-retroBg/65 p-4">
          <h2 className="font-heading text-xl text-retroText">{pl.stats.chartTitle}</h2>
          <div className="mt-4 space-y-3">
            {pl.stats.chartBars.map((bar) => (
              <div key={bar.id}>
                <div className="flex items-center justify-between text-sm text-retroText/85">
                  <span>{bar.label}</span>
                  <span>{bar.value}%</span>
                </div>
                <div className="mt-1 h-3 rounded-full border border-retroAccent/40 bg-retroBg/85">
                  <div
                    className="h-full rounded-full bg-retroAccent/80"
                    style={{ width: `${bar.value}%` }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Button
            ref={backRef}
            isFocused={activeId === NODE_IDS.back}
            className="sm:w-auto sm:px-8"
            onClick={() => navigate('/profil')}
            onMouseEnter={() => setFocus(NODE_IDS.back)}
          >
            {pl.common.back}
          </Button>
        </div>
      </section>
    </main>
  )
}
