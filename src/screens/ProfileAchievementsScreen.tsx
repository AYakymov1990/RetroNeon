import { createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AchievementCard } from '../components/ui/AchievementCard'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { useFocusScope } from '../focus/useFocusScope'
import { pl } from '../i18n/pl'

const ACHIEVEMENTS_SCOPE_ID = 'achievements'
const ACHIEVEMENTS_MODAL_SCOPE_ID = 'achievement-modal'
const GRID_COLUMNS = 3

const NODE_IDS = {
  back: 'achievements-back',
  modalClose: 'achievement-modal-close',
} as const

const achievementItems = pl.achievements.items

function getAchievementNodeId(achievementId: string) {
  return `achievement-${achievementId}`
}

export function ProfileAchievementsScreen() {
  const navigate = useNavigate()

  const [selectedAchievementIndex, setSelectedAchievementIndex] = useState<number | null>(null)
  const [originNodeId, setOriginNodeId] = useState<string | null>(null)

  const backRef = useRef<HTMLButtonElement>(null)
  const modalCloseRef = useRef<HTMLButtonElement>(null)
  const wasModalOpen = useRef(false)

  const cardRefs = useMemo(
    () => achievementItems.map(() => createRef<HTMLButtonElement>()),
    [],
  )

  const isModalOpen = selectedAchievementIndex !== null
  const selectedAchievement =
    selectedAchievementIndex === null ? null : achievementItems[selectedAchievementIndex]

  const {
    activeId: achievementsActiveId,
    registerNode: registerAchievementsNode,
    setFocus: setAchievementsFocus,
  } = useFocusScope(ACHIEVEMENTS_SCOPE_ID, {
    onBack: () => navigate('/profil'),
    isActive: !isModalOpen,
  })

  const {
    activeId: modalActiveId,
    registerNode: registerModalNode,
    setFocus: setModalFocus,
  } = useFocusScope(ACHIEVEMENTS_MODAL_SCOPE_ID, {
    onBack: () => setSelectedAchievementIndex(null),
    isActive: isModalOpen,
  })

  const openModal = useCallback((index: number, nodeId: string) => {
    setOriginNodeId(nodeId)
    setSelectedAchievementIndex(index)
  }, [])

  useEffect(() => {
    const unregisterNodes = achievementItems.map((achievement, index) =>
      registerAchievementsNode({
        id: getAchievementNodeId(achievement.id),
        x: index % GRID_COLUMNS,
        y: Math.floor(index / GRID_COLUMNS),
        ref: cardRefs[index],
        onConfirm: () => openModal(index, getAchievementNodeId(achievement.id)),
      }),
    )

    unregisterNodes.push(
      registerAchievementsNode({
        id: NODE_IDS.back,
        x: 0,
        y: Math.ceil(achievementItems.length / GRID_COLUMNS),
        ref: backRef,
        onConfirm: () => navigate('/profil'),
      }),
    )

    return () => {
      unregisterNodes.forEach((unregister) => unregister())
    }
  }, [cardRefs, navigate, openModal, registerAchievementsNode])

  useEffect(() => {
    if (achievementsActiveId) {
      return
    }

    setAchievementsFocus(getAchievementNodeId(achievementItems[0].id))
  }, [achievementsActiveId, setAchievementsFocus])

  useEffect(() => {
    if (!isModalOpen) {
      return
    }

    const unregisterNode = registerModalNode({
      id: NODE_IDS.modalClose,
      x: 0,
      y: 0,
      ref: modalCloseRef,
      onConfirm: () => setSelectedAchievementIndex(null),
    })

    setModalFocus(NODE_IDS.modalClose)

    return () => {
      unregisterNode()
    }
  }, [isModalOpen, registerModalNode, setModalFocus])

  useEffect(() => {
    if (wasModalOpen.current && !isModalOpen && originNodeId) {
      setAchievementsFocus(originNodeId)
    }

    wasModalOpen.current = isModalOpen
  }, [isModalOpen, originNodeId, setAchievementsFocus])

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center p-6">
      <section className="panel-surface w-full rounded-xl border p-6 sm:p-8">
        <h1 className="font-heading text-[32px] text-retroText">{pl.achievements.heading}</h1>
        <p className="mt-3 text-sm text-retroText/80">{pl.achievements.openHint}</p>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {achievementItems.map((achievement, index) => {
            const nodeId = getAchievementNodeId(achievement.id)
            const statusLabel = achievement.isUnlocked ? pl.common.unlocked : pl.common.locked

            return (
              <AchievementCard
                key={achievement.id}
                ref={cardRefs[index]}
                icon={achievement.icon}
                name={achievement.name}
                description={achievement.shortDescription}
                statusLabel={statusLabel}
                isUnlocked={achievement.isUnlocked}
                isFocused={!isModalOpen && achievementsActiveId === nodeId}
                onClick={() => openModal(index, nodeId)}
                onMouseEnter={() => setAchievementsFocus(nodeId)}
              />
            )
          })}
        </div>

        <div className="mt-8">
          <Button
            ref={backRef}
            isFocused={!isModalOpen && achievementsActiveId === NODE_IDS.back}
            className="sm:w-auto sm:px-8"
            onClick={() => navigate('/profil')}
            onMouseEnter={() => setAchievementsFocus(NODE_IDS.back)}
          >
            {pl.common.back}
          </Button>
        </div>
      </section>

      <Modal isOpen={isModalOpen && !!selectedAchievement} title={selectedAchievement?.name ?? ''}>
        {selectedAchievement ? (
          <div>
            <p className="text-sm text-retroText/80">{pl.achievements.detailsHeading}</p>
            <p className="mt-3 text-sm leading-relaxed text-retroText">{selectedAchievement.longDescription}</p>

            <div className="mt-4 rounded-md border border-retroAccent/50 bg-retroAccent/10 px-3 py-3 text-sm">
              <p>
                {selectedAchievement.isUnlocked ? pl.common.unlocked : pl.common.locked}
              </p>
              <p className="mt-1">
                {pl.common.progressLabel}: {selectedAchievement.progress}%
              </p>
            </div>

            <div className="mt-5">
              <Button
                ref={modalCloseRef}
                isFocused={modalActiveId === NODE_IDS.modalClose}
                onClick={() => setSelectedAchievementIndex(null)}
                onMouseEnter={() => setModalFocus(NODE_IDS.modalClose)}
              >
                {pl.common.close}
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </main>
  )
}
