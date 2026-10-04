/** @type {import('tailwindcss').Config} */

const SANS = [
  'PlusJakartaSans_500Medium',
  'PlusJakartaSans_600SemiBold',
  'PlusJakartaSans_700Bold',
  'PlusJakartaSans_800ExtraBold',
];

const HEADLINE = [
  'Epilogue_500Medium',
  'Epilogue_600SemiBold',
  'Epilogue_700Bold',
  'Epilogue_800ExtraBold',
  'Epilogue_900Black',
];

const ARABIC = ['Cairo_700Bold', 'Cairo_800ExtraBold', 'Cairo_900Black'];

module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './nativewind-env.d.ts',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        coral:           { light: '#EA5455', dark: '#FF8A8B' },
        'coral-dark':    { light: '#C83E40', dark: '#A53031' },
        navy:            { light: '#2D4059', dark: '#EAF1FF' },
        'navy-dark':     { light: '#1D2B3D', dark: '#0E1A2C' },
        tangerine:       { light: '#F07B3F', dark: '#FF9C66' },
        'tangerine-dark':{ light: '#CF6027', dark: '#B8521D' },
        'amber-gold':    { light: '#FFD460', dark: '#FFD460' },
        'amber-gold-dark': { light: '#D4A838', dark: '#B8912A' },
        bg:              { light: '#F8F9FF', dark: '#0E1A2C' },
        'surface-lowest':{ light: '#FFFFFF', dark: '#16243A' },
        'surface-low':   { light: '#EFF4FF', dark: '#1B2C44' },
        surface:         { light: '#E6EEFF', dark: '#1E2F49' },
        'surface-high':  { light: '#DCE9FF', dark: '#243651' },
        'surface-highest': { light: '#D3E4FE', dark: '#2A3E5E' },
        'text-primary':  { light: '#2D4059', dark: '#EAF1FF' },
        'text-muted':    { light: '#5B6E85', dark: '#A6B6CC' },
        border:          { light: '#E1BFBC', dark: '#3A4A66' },
        outline:         { light: '#8D706E', dark: '#5B6E85' },
      },
      fontFamily: {
        sans: SANS,
        body: SANS,
        'body-sm': SANS,
        'body-lg': SANS,
        label: SANS,
        'label-sm': SANS,
        'label-md': SANS,
        'label-lg': SANS,
        headline: HEADLINE,
        arabic: ARABIC,
      },
      borderRadius: {
        sm: 4, DEFAULT: 8, md: 12,
        lg: 16, xl: 24, full: 9999, '4xl': 24,
      },
      spacing: {
        gutter: '1rem', 'gutter-mobile': '0.75rem',
        margin: '1.25rem', 'margin-mobile': '1rem',
        'space-xs': '0.25rem', 'space-sm': '0.5rem',
        'space-md': '1rem', 'space-lg': '1.5rem', 'space-xl': '2.5rem',
      },
      fontSize: {
        'display-hero':        ['36px', { lineHeight: '44px', fontWeight: '800' }],
        'display-hero-mobile': ['28px', { lineHeight: '34px', fontWeight: '800' }],
        'headline-lg':         ['24px', { lineHeight: '32px', fontWeight: '800' }],
        'headline-md':         ['20px', { lineHeight: '28px', fontWeight: '700' }],
        'headline-sm':         ['18px', { lineHeight: '24px', fontWeight: '700' }],
        'body-lg':             ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'body-md':             ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'body-sm':             ['12px', { lineHeight: '16px', fontWeight: '500' }],
        'label-lg':            ['15px', { lineHeight: '20px', fontWeight: '800' }],
        'label-md':            ['12px', { lineHeight: '16px', fontWeight: '800' }],
        'label-sm':            ['10px', { lineHeight: '14px', fontWeight: '800' }],
      },
    },
  },
  plugins: [],
};
