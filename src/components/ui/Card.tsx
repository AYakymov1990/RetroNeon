import { forwardRef, type HTMLAttributes } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  isFocused?: boolean
  focusable?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { isFocused = false, focusable = false, className = '', ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      tabIndex={focusable ? -1 : undefined}
      className={[
        'panel-surface w-full rounded-lg border p-4 text-retroText transition duration-150',
        'focus:outline-none',
        isFocused ? 'neon-focus-ring' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  )
})
