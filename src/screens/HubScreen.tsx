import { createRef, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { useFocusScope } from '../focus/useFocusScope'
import { pl } from '../i18n/pl'

const HUB_SCOPE_ID = 'hub'
const HUB_MODAL_SCOPE_ID = 'hub-modal'

const NODE_IDS = {
  discord: 'hub-discord',
  ranking: 'hub-ranking',
  back: 'hub-back',
  modalClose: 'hub-modal-close',
} as const

type HubDetail = {
  title: string
  description: string
  meta: string
}

function getNewsNodeId(newsId: string) {
  return `hub-news-${newsId}`
}

function getTournamentNodeId(tournamentId: string) {
  return `hub-tournament-${tournamentId}`
}

export function HubScreen() {
  const navigate = useNavigate()

  const newsItems = pl.hub.news
  const tournamentItems = pl.hub.tournaments

  const newsButtonRefs = useMemo(() => newsItems.map(() => createRef<HTMLButtonElement>()), [newsItems])
  const tournamentButtonRefs = useMemo(
    () => tournamentItems.map(() => createRef<HTMLButtonElement>()),
    [tournamentItems],
  )

  const discordRef = useRef<HTMLButtonElement>(null)
  const rankingRef = useRef<HTMLButtonElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)
  const modalCloseRef = useRef<HTMLButtonElement>(null)

  const wasModalOpen = useRef(false)

  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [modalDetail, setModalDetail] = useState<HubDetail | null>(null)
  const [modalOriginNodeId, setModalOriginNodeId] = useState<string | null>(null)

  const isModalOpen = modalDetail !== null

  const {
    activeId: hubActiveId,
    registerNode: registerHubNode,
    setFocus: setHubFocus,
  } = useFocusScope(HUB_SCOPE_ID, {
    onBack: () => navigate('/menu'),
    isActive: !isModalOpen,
  })

  const {
    activeId: modalActiveId,
    registerNode: registerModalNode,
    setFocus: setModalFocus,
  } = useFocusScope(HUB_MODAL_SCOPE_ID, {
    onBack: () => setModalDetail(null),
    isActive: isModalOpen,
  })

  const openHubModal = useCallback((detail: HubDetail, originNodeId: string) => {
    setModalOriginNodeId(originNodeId)
    setModalDetail(detail)
  }, [])

  useLayoutEffect(() => {
    const unregisterNodes = [
      ...newsItems.map((item, index) =>
        registerHubNode({
          id: getNewsNodeId(item.id),
          x: index,
          y: 0,
          ref: newsButtonRefs[index],
          onConfirm: () =>
            openHubModal(
              {
                title: item.title,
                description: item.fullDescription,
                meta: `${item.date} · ${pl.hub.newsTitle}`,
              },
              getNewsNodeId(item.id),
            ),
        }),
      ),
      ...tournamentItems.map((item, index) =>
        registerHubNode({
          id: getTournamentNodeId(item.id),
          x: index,
          y: 1,
          ref: tournamentButtonRefs[index],
          onConfirm: () =>
            openHubModal(
              {
                title: item.title,
                description: item.fullDescription,
                meta: `${item.date} · ${item.status}`,
              },
              getTournamentNodeId(item.id),
            ),
        }),
      ),
      registerHubNode({
        id: NODE_IDS.discord,
        x: 0,
        y: 2,
        ref: discordRef,
        onConfirm: () => setStatusMessage(pl.hub.discordPlaceholder),
      }),
      registerHubNode({
        id: NODE_IDS.ranking,
        x: 1,
        y: 2,
        ref: rankingRef,
        onConfirm: () => navigate('/hub/ranking'),
      }),
      registerHubNode({
        id: NODE_IDS.back,
        x: 0,
        y: 3,
        ref: backRef,
        onConfirm: () => navigate('/menu'),
      }),
    ]

    return () => {
      unregisterNodes.forEach((unregister) => unregister())
    }
  }, [
    navigate,
    newsButtonRefs,
    newsItems,
    openHubModal,
    registerHubNode,
    tournamentButtonRefs,
    tournamentItems,
  ])

  useEffect(() => {
    if (hubActiveId) {
      return
    }

    setHubFocus(getNewsNodeId(newsItems[0].id))
  }, [hubActiveId, newsItems, setHubFocus])

  useEffect(() => {
    if (!isModalOpen) {
      return
    }

    const unregisterNode = registerModalNode({
      id: NODE_IDS.modalClose,
      x: 0,
      y: 0,
      ref: modalCloseRef,
      onConfirm: () => setModalDetail(null),
    })

    setModalFocus(NODE_IDS.modalClose)

    return () => {
      unregisterNode()
    }
  }, [isModalOpen, registerModalNode, setModalFocus])

  useEffect(() => {
    if (wasModalOpen.current && !isModalOpen && modalOriginNodeId) {
      setHubFocus(modalOriginNodeId)
    }

    wasModalOpen.current = isModalOpen
  }, [isModalOpen, modalOriginNodeId, setHubFocus])

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center p-6">
      <section className="panel-surface w-full rounded-xl border p-6 sm:p-8">
        <h1 className="font-heading text-[32px] text-retroText">{pl.hub.heading}</h1>
        <p className="mt-2 text-sm text-retroText/90">{pl.hub.subheading}</p>
        <p className="controls-hint mt-2 text-sm text-retroAccent">{pl.app.controlsHint}</p>

        <section className="mt-8">
          <h2 className="font-heading text-2xl text-retroText">{pl.hub.newsTitle}</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {newsItems.map((item, index) => {
              const nodeId = getNewsNodeId(item.id)

              return (
                <Card key={item.id} className="border-retroAccent/60 bg-retroBg/95">
                  <p className="font-heading text-lg text-retroText">{item.title}</p>
                  <p className="mt-1 text-xs text-retroAccent">{item.date}</p>
                  <p className="mt-3 text-sm text-retroText">{item.shortDescription}</p>
                  <Button
                    ref={newsButtonRefs[index]}
                    isFocused={!isModalOpen && hubActiveId === nodeId}
                    className="mt-4 min-h-11"
                    onClick={() =>
                      openHubModal(
                        {
                          title: item.title,
                          description: item.fullDescription,
                          meta: `${item.date} · ${pl.hub.newsTitle}`,
                        },
                        nodeId,
                      )
                    }
                    onMouseEnter={() => setHubFocus(nodeId)}
                  >
                    {pl.hub.readMore}
                  </Button>
                </Card>
              )
            })}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-heading text-2xl text-retroText">{pl.hub.tournamentsTitle}</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {tournamentItems.map((item, index) => {
              const nodeId = getTournamentNodeId(item.id)

              return (
                <Card key={item.id} className="border-retroAccent/55">
                  <p className="font-heading text-lg text-retroText">{item.title}</p>
                  <p className="mt-1 text-xs text-retroAccent">{item.date}</p>
                  <p className="mt-3 text-sm text-retroWarn">{item.status}</p>
                  <Button
                    ref={tournamentButtonRefs[index]}
                    isFocused={!isModalOpen && hubActiveId === nodeId}
                    className="mt-4 min-h-11"
                    onClick={() =>
                      openHubModal(
                        {
                          title: item.title,
                          description: item.fullDescription,
                          meta: `${item.date} · ${item.status}`,
                        },
                        nodeId,
                      )
                    }
                    onMouseEnter={() => setHubFocus(nodeId)}
                  >
                    {pl.hub.details}
                  </Button>
                </Card>
              )
            })}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-heading text-2xl text-retroText">{pl.hub.communityTitle}</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Button
              ref={discordRef}
              isFocused={!isModalOpen && hubActiveId === NODE_IDS.discord}
              className="min-h-11"
              onClick={() => setStatusMessage(pl.hub.discordPlaceholder)}
              onMouseEnter={() => setHubFocus(NODE_IDS.discord)}
            >
              {pl.hub.joinDiscord}
            </Button>
            <Button
              ref={rankingRef}
              isFocused={!isModalOpen && hubActiveId === NODE_IDS.ranking}
              className="min-h-11"
              onClick={() => navigate('/hub/ranking')}
              onMouseEnter={() => setHubFocus(NODE_IDS.ranking)}
            >
              {pl.hub.ranking}
            </Button>
          </div>
        </section>

        {statusMessage ? (
          <p
            role="status"
            aria-live="polite"
            className="mt-6 rounded-md border border-retroAccent/55 bg-retroAccent/10 px-4 py-3 text-sm text-retroText"
          >
            {statusMessage}
          </p>
        ) : null}

        <div className="mt-8">
          <Button
            ref={backRef}
            isFocused={!isModalOpen && hubActiveId === NODE_IDS.back}
            className="sm:w-auto sm:px-8"
            onClick={() => navigate('/menu')}
            onMouseEnter={() => setHubFocus(NODE_IDS.back)}
          >
            {pl.common.back}
          </Button>
        </div>
      </section>

      <Modal isOpen={isModalOpen && !!modalDetail} title={modalDetail?.title ?? ''}>
        {modalDetail ? (
          <div>
            <p className="text-sm text-retroAccent">{modalDetail.meta}</p>
            <p className="mt-3 text-sm leading-relaxed text-retroText">{modalDetail.description}</p>
            <div className="mt-5">
              <Button
                ref={modalCloseRef}
                isFocused={modalActiveId === NODE_IDS.modalClose}
                onClick={() => setModalDetail(null)}
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
