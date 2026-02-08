import { forwardRef, type ButtonHTMLAttributes } from 'react'

type AchievementCardProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: string
  name: string
  description: string
  statusLabel: string
  isUnlocked: boolean
  isFocused?: boolean
}

export const AchievementCard = forwardRef<HTMLButtonElement, AchievementCardProps>(function AchievementCard(
  {
    icon,
    name,
    description,
    statusLabel,
    isUnlocked,
    isFocused = false,
    className = '',
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={`${name}, ${statusLabel}`}
      data-focused={isFocused ? 'true' : 'false'}
      className={[
        'panel-surface min-h-11 w-full rounded-lg border p-4 text-left transition duration-150',
        'focus:outline-none hover:border-retroAccent/70 hover:bg-retroAccent/5',
        isFocused ? 'neon-focus-ring' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-heading text-lg text-retroText">{name}</p>
          <p className="mt-2 text-sm text-retroText/85">{description}</p>
          <p
            className={[
              'mt-3 text-xs font-semibold uppercase tracking-wider',
              isUnlocked ? 'text-retroAccent' : 'text-retroWarn',
            ].join(' ')}
          >
            {statusLabel}
          </p>
        </div>
        <span className="text-2xl text-retroAccent" aria-hidden="true">
          {icon}
        </span>
      </div>
    </button>
  )
})
