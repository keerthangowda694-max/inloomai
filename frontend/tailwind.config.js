/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: '#080B12',
        navy: {
          DEFAULT: '#101525',
          dark: '#0B0F1D',
          light: '#171E34',
          lighter: '#212A47'
        },
        indigo: {
          DEFAULT: '#635BFF',
          hover: '#5349EE',
          dark: '#4538D4',
          subtle: 'rgba(99, 91, 255, 0.15)'
        },
        lavender: {
          DEFAULT: '#A99BFF',
          subtle: 'rgba(169, 155, 255, 0.12)'
        },
        coolwhite: '#F5F6FF',
        muted: '#929BB2',
        mint: {
          DEFAULT: '#10B981',
          subtle: 'rgba(16, 185, 129, 0.15)'
        },
        amber: {
          DEFAULT: '#F59E0B',
          subtle: 'rgba(245, 158, 11, 0.15)'
        },
        coral: {
          DEFAULT: '#EF4444',
          subtle: 'rgba(239, 68, 68, 0.15)'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-indigo': '0 0 35px -5px rgba(99, 91, 255, 0.45)',
        'glow-lavender': '0 0 30px -5px rgba(169, 155, 255, 0.35)',
        'glow-coral': '0 0 30px -5px rgba(239, 68, 68, 0.35)',
        'glow-mint': '0 0 30px -5px rgba(16, 185, 129, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      }
    },
  },
  plugins: [],
}
