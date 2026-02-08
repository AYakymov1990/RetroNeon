import { type ReactNode, useId } from 'react'

type ModalProps = {
  isOpen: boolean
  title: string
  children: ReactNode
}

export function Modal({ isOpen, title, children }: ModalProps) {
  const titleId = useId()
  const bodyId = useId()

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-retroBg/80 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        className="panel-surface w-full max-w-md rounded-lg border border-retroAccent/70 p-6 shadow-neon"
      >
        <h2 id={titleId} className="font-heading text-2xl text-retroText">
          {title}
        </h2>
        <div id={bodyId} className="mt-5">
          {children}
        </div>
      </div>
    </div>
  )
}
