import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#05060a',
          950: '#030409',
          900: '#05060a',
          800: '#080a12',
          700: '#0b0e18',
          600: '#11141f',
        },
        neon: {
          cyan: '#00f0ff',
          violet: '#8b5cf6',
          magenta: '#ff2bd6',
        },
        muted: '#8b90a6',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        logo: ['"Orbitron"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'glow-cyan': '0 0 50px -12px rgba(0, 240, 255, 0.65)',
        'glow-violet': '0 0 50px -12px rgba(139, 92, 246, 0.65)',
        'glow-magenta': '0 0 50px -12px rgba(255, 43, 214, 0.55)',
        glass: '0 20px 60px -20px rgba(0, 0, 0, 0.8)',
      },
      backgroundImage: {
        'radial-fade':
          'radial-gradient(circle at 50% 0%, rgba(0,240,255,0.12), transparent 55%)',
        'grid-fade':
          'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translate3d(0,0,0)' },
          to: { transform: 'translate3d(-50%,0,0)' },
        },
        'marquee-reverse': {
          from: { transform: 'translate3d(-50%,0,0)' },
          to: { transform: 'translate3d(0,0,0)' },
        },
        'border-spin': {
          to: { '--angle': '360deg' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(-1deg)' },
          '50%': { transform: 'translateY(-22px) rotate(1deg)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%) skewX(-18deg)' },
          '100%': { transform: 'translateX(220%) skewX(-18deg)' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.85)', opacity: '0.7' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        'glitch-x': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 1px)' },
          '40%': { transform: 'translate(2px, -1px)' },
          '60%': { transform: 'translate(-1px, -1px)' },
          '80%': { transform: 'translate(1px, 1px)' },
        },
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'bar-fill': {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
        'ticker-dot': {
          '0%, 100%': { opacity: '0.25', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        'grid-pan': {
          from: { backgroundPosition: '0 0, 0 0' },
          to: { backgroundPosition: '0 64px, 64px 0' },
        },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        'marquee-reverse': 'marquee-reverse 44s linear infinite',
        float: 'float 7s ease-in-out infinite',
        'float-slow': 'float-slow 11s ease-in-out infinite',
        scan: 'scan 9s linear infinite',
        shimmer: 'shimmer 2.8s ease-in-out infinite',
        blink: 'blink 1s steps(1) infinite',
        'pulse-ring': 'pulse-ring 2.6s ease-out infinite',
        'spin-slow': 'spin-slow 24s linear infinite',
        'glitch-x': 'glitch-x 2.4s steps(2, end) infinite',
        'rise-in': 'rise-in 0.8s ease-out both',
        'ticker-dot': 'ticker-dot 1.8s ease-in-out infinite',
        'grid-pan': 'grid-pan 18s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
