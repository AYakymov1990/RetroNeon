import { createRef, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useFocusScope } from '../focus/useFocusScope'
import { pl } from '../i18n/pl'

const RANKING_SCOPE_ID = 'ranking'

const NODE_IDS = {
  back: 'ranking-back',
} as const

function getRankingRowNodeId(place: number) {
  return `ranking-row-${place}`
}

export function HubRankingScreen() {
  const navigate = useNavigate()

  const rowRefs = useMemo(() => pl.ranking.rows.map(() => createRef<HTMLDivElement>()), [])
  const backRef = useRef<HTMLButtonElement>(null)

  const { activeId, registerNode, setFocus } = useFocusScope(RANKING_SCOPE_ID, {
    onBack: () => navigate('/hub'),
  })

  useEffect(() => {
    const unregisterNodes = [
      ...pl.ranking.rows.map((row, index) =>
        registerNode({
          id: getRankingRowNodeId(row.place),
          x: 0,
          y: index,
          ref: rowRefs[index],
        }),
      ),
      registerNode({
        id: NODE_IDS.back,
        x: 0,
        y: pl.ranking.rows.length,
        ref: backRef,
        onConfirm: () => navigate('/hub'),
      }),
    ]

    return () => {
      unregisterNodes.forEach((unregister) => unregister())
    }
  }, [navigate, registerNode, rowRefs])

  useEffect(() => {
    if (activeId) {
      return
    }

    // Domyślnie ustawiamy fokus na "Wróć", aby użytkownik mógł od razu szybko wrócić do Hubu.
    setFocus(NODE_IDS.back)
  }, [activeId, setFocus])

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center p-6">
      <section className="panel-surface w-full rounded-xl border p-6 sm:p-8">
        <p className="text-sm text-retroAccent">{pl.ranking.breadcrumb}</p>
        <h1 className="mt-2 font-heading text-[32px] text-retroText">{pl.ranking.heading}</h1>
        <p className="controls-hint mt-2 text-sm text-retroAccent">{pl.app.controlsHint}</p>

        <div className="mt-6 rounded-md border border-retroAccent/50 bg-retroBg/85 px-4 py-3 text-xs uppercase tracking-wider text-retroText/80">
          <div className="grid grid-cols-[90px_1fr_120px] gap-3">
            <span>{pl.ranking.place}</span>
            <span>{pl.ranking.player}</span>
            <span className="text-right">{pl.ranking.points}</span>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {pl.ranking.rows.map((row, index) => {
            const nodeId = getRankingRowNodeId(row.place)

            return (
              <Card
                key={row.place}
                ref={rowRefs[index]}
                focusable
                isFocused={activeId === nodeId}
                role="row"
                aria-label={`${pl.ranking.place} ${row.place}, ${pl.ranking.player} ${row.player}, ${pl.ranking.points} ${row.points}`}
                className="min-h-11"
                onMouseEnter={() => setFocus(nodeId)}
              >
                <div className="grid grid-cols-[90px_1fr_120px] items-center gap-3">
                  <span className="font-heading text-retroAccent">#{row.place}</span>
                  <span className="text-retroText">{row.player}</span>
                  <span className="text-right font-semibold text-retroWarn">{row.points}</span>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="mt-8">
          <Button
            ref={backRef}
            isFocused={activeId === NODE_IDS.back}
            className="sm:w-auto sm:px-8"
            onClick={() => navigate('/hub')}
            onMouseEnter={() => setFocus(NODE_IDS.back)}
          >
            {pl.common.back}
          </Button>
        </div>
      </section>
    </main>
  )
}
