import { useState } from 'react'
import { cn } from '@/lib/utils'
import { audioEngine } from '@/lib/audioEngine'

type AudioToggleProps = {
  className?: string
  compact?: boolean
}

export function AudioToggle({ className, compact = false }: AudioToggleProps) {
  const [enabled, setEnabled] = useState(audioEngine.enabled)
  const [busy, setBusy] = useState(false)

  const onToggle = async () => {
    if (busy) return
    setBusy(true)
    try {
      const next = await audioEngine.toggle()
      setEnabled(next)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label={enabled ? 'Mute cinematic audio' : 'Enable cinematic audio'}
      data-cursor="hover"
      className={cn(
        'group flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 backdrop-blur-md transition-colors duration-300 hover:border-neon-cyan/40 hover:text-white',
        className,
      )}
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        {enabled ? (
          <span className="flex items-end gap-[2px]" aria-hidden="true">
            {[6, 10, 4, 8].map((height, i) => (
              <span
                key={i}
                className="w-[2px] rounded-full bg-neon-cyan"
                style={{
                  height,
                  animation: `ticker-dot 1s ease-in-out ${i * 0.12}s infinite`,
                }}
              />
            ))}
          </span>
        ) : (
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="text-white/70"
          >
            <path
              d="M2.5 6h2L8 3v10L4.5 10h-2V6Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path d="M10.5 6.5 13.5 9.5M13.5 6.5l-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        )}
      </span>
      {!compact && <span className="hidden sm:inline">Sound {enabled ? 'on' : 'off'}</span>}
    </button>
  )
}
