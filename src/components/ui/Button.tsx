import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { playUiClick } from '../../input/uiSound'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isFocused?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { isFocused = false, className = '', disabled, onClick, ...props },
  ref,
) {
  const focusClass = isFocused ? 'neon-focus-ring' : ''

  return (
    <button
      ref={ref}
      className={[
        'control-surface w-full min-h-11 rounded-md border border-retroAccent/40 px-4 py-3',
        'font-heading text-sm uppercase tracking-[0.18em] text-retroText transition duration-150',
        'hover:border-retroAccent hover:bg-retroAccent/10 active:scale-[0.98]',
        'focus:outline-none',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        focusClass,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled}
      data-focused={isFocused ? 'true' : 'false'}
      onClick={(event) => {
        if (!disabled) {
          playUiClick()
        }

        onClick?.(event)
      }}
      {...props}
    />
  )
})
