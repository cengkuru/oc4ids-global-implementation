/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#f7f7f7',
        secondary: '#d60000',
        accent: '#333333',
        accent1: '#ffce32',
        accent2: '#d8d8cd',
        accent3: '#2c4143',
        accent4: '#58707b',
        accent5: '#9bcbd9',
        accent6: '#61a8bd',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#333333',
            a: {
              color: '#373738',
              '&:hover': {
                color: '#373738',
              },
            },
            h1: {
              color: '#333333',
              fontSize: '2.5rem',
              fontWeight: '700',
              letterSpacing: '-0.025em',
            },
            h2: {
              color: '#333333',
              fontSize: '2rem',
              fontWeight: '600',
              letterSpacing: '-0.025em',
            },
            h3: {
              color: '#333333',
              fontSize: '1.5rem',
              fontWeight: '600',
            },
            p: {
              marginBottom: '1.5em',
              lineHeight: '1.6',
            },
          },
        },
        dark: {
          css: {
            color: '#f7f7f7',
            a: {
              color: '#00A8E0',
              '&:hover': {
                color: '#61a8bd',
              },
            },
            h1: {
              color: '#f7f7f7',
            },
            h2: {
              color: '#f7f7f7',
            },
            h3: {
              color: '#f7f7f7',
            },
          },
        },

      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.5715' }],
        base: ['1rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        lg: ['1.125rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        xl: ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '1.33', letterSpacing: '-0.01em' }],
        '3xl': ['1.88rem', { lineHeight: '1.33', letterSpacing: '-0.01em' }],
        '4xl': ['2.25rem', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        '6xl': ['3.75rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'apple-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'apple-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'apple-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'apple-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'apple-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'apple-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'apple-sm': '0.5rem',
        'apple-md': '0.75rem',
        'apple-lg': '1rem',
        'apple-xl': '1.5rem',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'width': 'width',
        'transform': 'transform',
      },
      transitionTimingFunction: {
        'apple-ease': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'apple-ease-in': 'cubic-bezier(0.42, 0, 1, 1)',
        'apple-ease-out': 'cubic-bezier(0, 0, 0.58, 1)',
        'apple-ease-in-out': 'cubic-bezier(0.42, 0, 0.58, 1)',
      },
      transitionDuration: {
        '250': '250ms',
        '400': '400ms',
        '600': '600ms',
      },
      keyframes: {
        'apple-bounce': {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
        'apple-fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'apple-scale': {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'apple-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'apple-bounce': 'apple-bounce 1s ease-in-out infinite',
        'apple-fade-in': 'apple-fade-in 0.5s ease-out',
        'apple-scale': 'apple-scale 0.3s ease-in-out',
        'spin-slow': 'spin 3s linear infinite',
        'apple-pulse': 'apple-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      height: {
        '128': '32rem',
        '160': '40rem',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled', 'hover', 'focus', 'dark'],
      cursor: ['disabled', 'hover', 'dark'],
      backgroundColor: ['active', 'hover', 'focus', 'dark'],
      textColor: ['active', 'hover', 'focus', 'dark'],
      borderColor: ['focus', 'hover', 'dark'],
      ringColor: ['focus', 'dark'],
      ringOpacity: ['focus', 'dark'],
      scale: ['hover', 'focus', 'active', 'dark'],
    },
  },
  plugins: [
    plugin(({ addUtilities, theme, variants }) => {
      const newUtilities = {
        '.apple-focus-ring': {
          boxShadow: `0 0 0 4px ${theme('colors.accent6')}`,
        },
        '.apple-press-effect': {
          transform: 'scale(0.98)',
          transition: 'transform 0.1s ease-in-out',
        },
        '.apple-hover-lift': {
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
          },
        },
        '.apple-glass': {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
        },
        '.dark .apple-glass': {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
        '.apple-text-balance': {
          textWrap: 'balance',
        },
        '.apple-gradient-text': {
          background: `linear-gradient(to right, ${theme('colors.accent5')}, ${theme('colors.accent6')})`,
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
      };

      addUtilities(newUtilities, variants('appleEffects'));
    }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],



}
