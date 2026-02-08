import { forwardRef, type HTMLAttributes } from 'react'
import { Card } from './Card'

type StatPanelProps = HTMLAttributes<HTMLDivElement> & {
  label: string
  value: string
  isFocused?: boolean
  ariaLabel?: string
}

export const StatPanel = forwardRef<HTMLDivElement, StatPanelProps>(function StatPanel(
  { label, value, isFocused = false, ariaLabel, className = '', ...props },
  ref,
) {
  return (
    <Card
      ref={ref}
      isFocused={isFocused}
      focusable
      role="group"
      aria-label={ariaLabel ?? `${label}: ${value}`}
      className={['min-h-11', className].filter(Boolean).join(' ')}
      {...props}
    >
      <p className="text-sm text-retroText/80">{label}</p>
      <p className="mt-2 font-heading text-2xl text-retroAccent">{value}</p>
    </Card>
  )
})
