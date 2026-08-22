import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0A1526',
        panel: '#101E33',
        'panel-2': '#152640',
        steel: '#2B4468',
        'signal-blue': '#3B82F6',
        mint: '#22C08A',
        amber: '#F2A93B',
        coral: '#EF5350',
        paper: '#E8ECF3',
        mist: '#8FA0BE',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

export default config
