import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useFocusScope } from '../focus/useFocusScope'
import { pl } from '../i18n/pl'

const PROFILE_SCOPE_ID = 'profile'

const NODE_IDS = {
  achievements: 'profile-achievements',
  stats: 'profile-stats',
  back: 'profile-back',
} as const

export function ProfileScreen() {
  const navigate = useNavigate()

  const achievementsRef = useRef<HTMLButtonElement>(null)
  const statsRef = useRef<HTMLButtonElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)

  const { activeId, registerNode, setFocus } = useFocusScope(PROFILE_SCOPE_ID, {
    onBack: () => navigate('/menu'),
  })

  useEffect(() => {
    const unregisterNodes = [
      registerNode({
        id: NODE_IDS.achievements,
        x: 0,
        y: 0,
        ref: achievementsRef,
        onConfirm: () => navigate('/profil/osiagniecia'),
      }),
      registerNode({
        id: NODE_IDS.stats,
        x: 1,
        y: 0,
        ref: statsRef,
        onConfirm: () => navigate('/profil/statystyki'),
      }),
      registerNode({
        id: NODE_IDS.back,
        x: 0,
        y: 1,
        ref: backRef,
        onConfirm: () => navigate('/menu'),
      }),
    ]

    return () => {
      unregisterNodes.forEach((unregister) => unregister())
    }
  }, [navigate, registerNode])

  useEffect(() => {
    if (activeId) {
      return
    }

    setFocus(NODE_IDS.achievements)
  }, [activeId, setFocus])

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center p-6">
      <section className="panel-surface w-full rounded-xl border p-6 sm:p-8">
        <h1 className="font-heading text-[32px] text-retroText">{pl.profile.heading}</h1>

        <Card className="mt-6">
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-retroText/75">{pl.profile.nameLabel}</dt>
              <dd className="font-semibold text-retroText">{pl.profile.nameValue}</dd>
            </div>
            <div>
              <dt className="text-sm text-retroText/75">{pl.profile.levelLabel}</dt>
              <dd className="font-semibold text-retroText">{pl.profile.levelValue}</dd>
            </div>
            <div>
              <dt className="text-sm text-retroText/75">{pl.profile.playTimeLabel}</dt>
              <dd className="font-semibold text-retroText">{pl.profile.playTimeValue}</dd>
            </div>
            <div>
              <dt className="text-sm text-retroText/75">{pl.profile.modeLabel}</dt>
              <dd className="font-semibold text-retroText">{pl.profile.modeValue}</dd>
            </div>
          </dl>
        </Card>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Button
            ref={achievementsRef}
            isFocused={activeId === NODE_IDS.achievements}
            onClick={() => navigate('/profil/osiagniecia')}
            onMouseEnter={() => setFocus(NODE_IDS.achievements)}
          >
            {pl.profile.achievements}
          </Button>
          <Button
            ref={statsRef}
            isFocused={activeId === NODE_IDS.stats}
            onClick={() => navigate('/profil/statystyki')}
            onMouseEnter={() => setFocus(NODE_IDS.stats)}
          >
            {pl.profile.stats}
          </Button>
        </div>

        <div className="mt-4">
          <Button className="w-auto px-6" disabled aria-label={pl.profile.editProfileDisabledHint}>
            {pl.profile.editProfile}
          </Button>
        </div>

        <div className="mt-6">
          <Button
            ref={backRef}
            isFocused={activeId === NODE_IDS.back}
            className="sm:w-auto sm:px-8"
            onClick={() => navigate('/menu')}
            onMouseEnter={() => setFocus(NODE_IDS.back)}
          >
            {pl.common.back}
          </Button>
        </div>
      </section>
    </main>
  )
}
