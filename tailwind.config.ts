import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import typography from '@tailwindcss/typography'

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1440px'
      }
    },
    extend: {
      colors: {
        magnum: {
          '50': '#fff9ed',
          '100': '#fef2d6',
          '200': '#fce0ac',
          '300': '#f9c978',
          '400': '#f7b155',
          '500': '#f38d1c',
          '600': '#e47312',
          '700': '#bd5711',
          '800': '#964516',
          '900': '#793a15',
          '950': '#411c09'
        },
        text: '#ede3ec',
        background: '#0b070b',
        primary: '#c4a5c1',
        secondary: '#695645',
        accent: '#aeaa83',

        // bg_h: 'var(--bg_h)',
        // bg: 'var(--bg)',
        // bg_s: 'var(--bg_s)',
        // bg1: 'var(--bg1)',
        // bg2: 'var(--bg2)',
        // bg3: 'var(--bg3)',
        // bg4: 'var(--bg4)',

        // fg: 'var(--fg)',
        // fg1: 'var(--fg1)',
        // fg2: 'var(--fg2)',
        // fg3: 'var(--fg3)',
        // fg4: 'var(--fg4)',

        // red: 'var(--red)',
        // green: 'var(--green)',
        // yellow: 'var(--yellow)',
        // blue: 'var(--blue)',
        // purple: 'var(--purple)',
        // aqua: 'var(--aqua)',
        // orange: 'var(--orange)',
        // gray: 'var(--gray)',

        // redDim: 'var(--red-dim)',
        // greenDim: 'var(--green-dim)',
        // yellowDim: 'var(--yellow-dim)',
        // blueDim: 'var(--blue-dim)',
        // purpleDim: 'var(--purple-dim)',
        // aquaDim: 'var(--aqua-dim)',
        // orangeDim: 'var(--orange-dim)',
        // grayDim: 'var(--gray-dim)',

        bg_h: '#1d2021',
        bg: '#282828',
        bg_s: '#32302f',
        bg1: '#3c3836',
        bg2: '#504945',
        bg3: '#665c54',
        bg4: '#7c6f64',

        fg: '#fbf1c7',
        fg1: '#ebdbb2',
        fg2: '#d5c4a1',
        fg3: '#bdae93',
        fg4: '#a89984',

        red: '#fb4934',
        green: '#b8bb26',
        yellow: '#fabd2f',
        blue: '#83a598',
        purple: '#d3869b',
        aqua: '#8ec07c',
        gray: '#928374',
        orange: '#fe8019',

        'red-dim': '#cc2412',
        'green-dim': '#98971a',
        'yellow-dim': '#d79921',
        'blue-dim': '#458588',
        'purple-dim': '#b16286',
        'aqua-dim': '#689d6a',
        'gray-dim': '#a89984',
        'orange-dim': '#d65d0e'
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol'
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'SF Mono',
          'Menlo',
          'Consolas',
          'Liberation Mono',
          'monospace'
        ]
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            code: {
              position: 'relative',
              borderRadius: theme('borderRadius.md')
            }
          }
        }
      })
    }
  },

  plugins: [
    typography,
    plugin(function ({ addVariant, matchUtilities, theme }) {
      addVariant('hocus', ['&:hover', '&:focus'])
      // Square utility
      matchUtilities(
        {
          square: (value) => ({
            width: value,
            height: value
          })
        },
        { values: theme('spacing') }
      )
    })
  ]
} satisfies Config
