import { Counter } from '@/components/Counter'

const STATS = [
  {
    value: 2.4,
    decimals: 1,
    suffix: 'M+',
    label: 'Tests generated',
    sub: 'Across 1,200 QA workspaces',
  },
  {
    value: 94,
    suffix: '%',
    label: 'Selectors auto-healed',
    sub: 'Trailing 30-day median',
  },
  {
    value: 19,
    suffix: '×',
    label: 'Faster QA cycles',
    sub: 'Median story → green suite',
  },
  {
    value: 99.99,
    decimals: 2,
    suffix: '%',
    label: 'Run uptime',
    sub: 'Trailing 12 months',
  },
]

export function Stats() {
  return (
    <section className="relative border-y border-white/[0.06] py-20 md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(139,92,246,0.07),transparent_70%)]" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div data-reveal className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.28em] text-white/35">
            <span className="h-1 w-1 animate-ticker-dot rounded-full bg-neon-cyan" />
            System telemetry
          </div>
          <div data-reveal className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/25">
            Q3 / 2026 · verified
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.055] lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              data-reveal
              data-reveal-delay={index * 0.06}
              className="group relative bg-[#06070c] px-5 py-8 transition-colors duration-500 hover:bg-[#080a11] md:px-7 md:py-10"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <p className="font-logo text-[clamp(2.1rem,4.6vw,3.9rem)] font-bold leading-none tracking-[-0.03em]">
                <span className="text-gradient">
                  <Counter
                    value={stat.value}
                    decimals={stat.decimals ?? 0}
                    suffix={stat.suffix}
                  />
                </span>
              </p>

              <p className="mt-4 text-[13px] font-medium text-white/70">{stat.label}</p>
              <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.18em] text-white/25">
                {stat.sub}
              </p>

              <div className="pointer-events-none absolute bottom-0 right-0 flex items-end gap-[3px] p-4 opacity-25" aria-hidden="true">
                {[8, 14, 6, 18, 11, 22, 9].map((height, i) => (
                  <span
                    key={i}
                    className="w-[2px] rounded-full bg-neon-cyan/60 transition-all duration-500 group-hover:bg-neon-cyan"
                    style={{ height }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <p data-reveal className="mt-6 max-w-2xl font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] text-white/20">
          Aggregated from production QA workspaces. Individual results vary by app surface, test
          depth and CI setup.
        </p>
      </div>
    </section>
  )
}
