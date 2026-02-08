import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { pl } from '../../i18n/pl'
import { playUiClick } from '../../input/uiSound'

type ToggleProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  checked: boolean
  isFocused?: boolean
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { label, checked, isFocused = false, className = '', onClick, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={checked}
      className={[
        'control-surface min-h-11 w-full rounded-md border border-retroAccent/40 px-4 py-3 focus:outline-none',
        'flex items-center justify-between gap-4 text-left transition duration-150 hover:border-retroAccent active:scale-[0.98]',
        isFocused ? 'neon-focus-ring' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={(event) => {
        if (!props.disabled) {
          playUiClick()
        }

        onClick?.(event)
      }}
      {...props}
    >
      <span className="font-medium text-retroText">{label}</span>
      <span
        className={[
          'rounded-md border px-3 py-1 text-xs font-bold tracking-widest',
          checked
            ? 'border-retroAccent bg-retroAccent/20 text-retroAccent'
            : 'border-retroText/40 bg-retroBg/80 text-retroText/80',
        ].join(' ')}
      >
        {checked ? pl.common.toggleOnShort : pl.common.toggleOffShort}
      </span>
    </button>
  )
})
