import { Marquee } from '@/components/Marquee'

const LOGOS = [
  { name: 'HYPERLOOM', shape: 'rotate-45' },
  { name: 'ORBITAL', shape: 'rounded-full' },
  { name: 'NOVAFORGE', shape: 'rotate-12' },
  { name: 'QUANTA', shape: 'rounded-full' },
  { name: 'SPECTRE', shape: 'rotate-45' },
  { name: 'LUMEN', shape: 'rotate-12' },
  { name: 'AXIOM', shape: 'rounded-full' },
  { name: 'DRIFT', shape: 'rotate-45' },
]

export function LogoMarquee() {
  return (
    <section className="relative border-y border-white/[0.06] bg-ink-950/60 py-8">
      <div className="mx-auto mb-7 flex max-w-[1400px] items-center justify-between px-5 md:px-8">
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30">
          Trusted by QA teams at
        </p>
        <p className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.24em] text-white/25 sm:flex">
          <span className="h-1 w-1 rounded-full bg-neon-cyan/70" />
          08 QA orgs onboard
        </p>
      </div>

      <Marquee>
        {LOGOS.map((logo) => (
          <div
            key={logo.name}
            className="group flex items-center gap-3 font-logo text-[15px] font-medium tracking-[0.24em] text-white/30 transition-colors duration-300 hover:text-white/75"
          >
            <span
              className={`inline-block h-3 w-3 border border-current ${logo.shape}`}
              aria-hidden="true"
            />
            {logo.name}
          </div>
        ))}
      </Marquee>
    </section>
  )
}
