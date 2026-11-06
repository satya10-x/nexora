import { scrollToSelector } from '@/hooks/useLenis'

type FooterProps = {
  onReplay: () => void
}

type FooterLink = { label: string; target?: string; href?: string }
type FooterColumn = { title: string; links: FooterLink[] }

const COLUMNS: FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'Capabilities', target: '#features' },
      { label: 'Pipeline', target: '#process' },
      { label: 'Live runtime', target: '#demo' },
      { label: 'Pricing', target: '#pricing' },
      { label: 'FAQ', target: '#faq' },
      { label: 'Sign in', href: '/login' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About' },
      { label: 'Careers' },
      { label: 'Journal' },
      { label: 'Press kit' },
      { label: 'Contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation' },
      { label: 'QA console', href: '/login' },
      { label: 'API reference' },
      { label: 'System status' },
      { label: 'Security' },
      { label: 'Community' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy' },
      { label: 'Terms' },
      { label: 'DPA' },
      { label: 'Subprocessors' },
    ],
  },
]

export function Footer({ onReplay }: FooterProps) {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07] pt-16 md:pt-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_100%,rgba(139,92,246,0.12),transparent_70%)]" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-8 w-8 items-center justify-center">
                <span className="absolute inset-0 rounded-lg border border-neon-cyan/30 bg-neon-cyan/[0.06]" />
                <svg
                  className="relative h-4 w-4 text-neon-cyan"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M12 2.5 20 6v6.2c0 4.9-3.2 8.2-8 9.8-4.8-1.6-8-4.9-8-9.8V6l8-3.5Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="m8.4 12.1 2.4 2.4 4.8-4.9"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-logo text-sm font-bold tracking-[0.22em] text-white">
                  SENTINELQA
                </span>
                <span className="mt-1 font-mono text-[7px] uppercase tracking-[0.3em] text-white/35">
                  by Nexora
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-white/40">
              The autonomous QA layer for modern teams. Turn acceptance criteria into self-healing
              Playwright suites — with full traceability.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {[
                {
                  label: 'X',
                  path: 'M2 2l6 7.2L2.4 14h1.7l4.5-4.2L12 14h2L7.8 6.5 13.4 2h-1.7L7.3 5.9 3.9 2H2Z',
                },
                {
                  label: 'GitHub',
                  path: 'M8 1.5a6.5 6.5 0 0 0-2.05 12.67c.32.06.44-.14.44-.31v-1.2c-1.8.39-2.18-.77-2.18-.77-.3-.75-.72-.95-.72-.95-.59-.4.04-.4.04-.4.65.05.99.67.99.67.58.99 1.52.7 1.89.54.06-.42.23-.7.41-.87-1.44-.16-2.95-.72-2.95-3.2 0-.71.25-1.29.66-1.74-.07-.16-.29-.83.06-1.72 0 0 .54-.17 1.78.66a6.2 6.2 0 0 1 3.24 0c1.23-.83 1.77-.66 1.77-.66.35.89.13 1.56.06 1.72.41.45.66 1.03.66 1.74 0 2.49-1.52 3.04-2.96 3.2.23.2.44.59.44 1.19v1.77c0 .17.12.37.44.31A6.5 6.5 0 0 0 8 1.5Z',
                },
                {
                  label: 'LinkedIn',
                  path: 'M3 5.5h2.2V14H3V5.5Zm1.1-3.4a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM7 5.5h2.1v1.16h.03c.3-.56 1.03-1.16 2.12-1.16 2.26 0 2.75 1.44 2.75 3.3V14h-2.2V9.2c0-.96-.02-2.2-1.35-2.2-1.35 0-1.55 1.05-1.55 2.13V14H7V5.5Z',
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  aria-label={social.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all duration-300 hover:border-neon-cyan/40 hover:text-white"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-white/25">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.href ? (
                        <a
                          href={link.href}
                          className="text-[13px] text-white/45 transition-colors duration-300 hover:text-white"
                        >
                          {link.label}
                        </a>
                      ) : link.target ? (
                        <button
                          type="button"
                          onClick={() => scrollToSelector(link.target as string)}
                          className="text-left text-[13px] text-white/45 transition-colors duration-300 hover:text-white"
                        >
                          {link.label}
                        </button>
                      ) : (
                        <a
                          href="#"
                          onClick={(event) => event.preventDefault()}
                          className="text-[13px] text-white/45 transition-colors duration-300 hover:text-white"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-14 select-none overflow-hidden md:mt-20">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-neon-cyan/10 via-neon-violet/10 to-transparent blur-2xl" aria-hidden="true" />
          <p className="text-center font-logo text-[clamp(2rem,9.6vw,8.6rem)] font-black leading-[0.72] tracking-[0.01em] text-outline-glow">
            SENTINELQA
          </p>
        </div>

        <div className="relative mt-10 flex flex-col items-center justify-between gap-5 border-t border-white/[0.07] py-7 md:flex-row">
          <div className="flex flex-col items-center gap-2 font-mono text-[8px] uppercase tracking-[0.2em] text-white/25 md:flex-row md:gap-4">
            <span>© 2026 SentinelQA · A Nexora product</span>
            <span className="hidden h-1 w-1 rounded-full bg-white/20 md:block" />
            <span>Built for the autonomous QA era</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-[8px] uppercase tracking-[0.2em] text-white/25">
            <span className="flex items-center gap-2 text-white/35">
              <span className="h-1.5 w-1.5 rounded-full bg-[#28c840] shadow-[0_0_8px_rgba(40,200,64,0.7)]" />
              All systems operational
            </span>
            <button
              type="button"
              onClick={onReplay}
              className="flex items-center gap-1.5 transition-colors hover:text-white"
            >
              Replay intro
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 4.5A4 4 0 1 1 2.4 8M2 1.5v3h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollToSelector('#hero')}
              className="flex items-center gap-1.5 transition-colors hover:text-white"
            >
              Back to top
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 10V2M2.5 5.5 6 2l3.5 3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
