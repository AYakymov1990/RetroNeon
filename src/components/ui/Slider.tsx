import { forwardRef, type HTMLAttributes } from 'react'

type SliderProps = HTMLAttributes<HTMLDivElement> & {
  label: string
  value: number
  min?: number
  max?: number
  isFocused?: boolean
}

export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  { label, value, min = 0, max = 100, isFocused = false, className = '', ...props },
  ref,
) {
  const clampedValue = Math.min(max, Math.max(min, value))
  const fillPercentage = ((clampedValue - min) / (max - min)) * 100

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="slider"
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={clampedValue}
      aria-valuetext={`${clampedValue}%`}
      className={[
        'control-surface min-h-11 w-full rounded-md border border-retroAccent/40 px-3 py-3 focus:outline-none',
        'grid grid-cols-[minmax(120px,1fr)_minmax(140px,2fr)_70px] items-center gap-3',
        isFocused ? 'neon-focus-ring' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <span className="text-sm font-medium text-retroText">{label}</span>
      <div className="relative h-3 rounded-full border border-retroAccent/40 bg-retroBg/90">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-retroAccent/85"
          style={{ width: `${fillPercentage}%` }}
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-retroText bg-retroAccent shadow-[0_0_12px_rgba(41,182,246,0.75)]"
          style={{ left: `calc(${fillPercentage}% - 8px)` }}
          aria-hidden="true"
        />
      </div>
      <span className="text-right text-sm font-semibold text-retroText">{clampedValue}%</span>
    </div>
  )
})
