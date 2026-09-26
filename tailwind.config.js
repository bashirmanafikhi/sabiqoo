/** @type {import('tailwindcss').Config} */
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
        bg: { light: '#FFFFFF', dark: '#0B1220' },
        surface: { light: '#F7F7F7', dark: '#121A2B' },
        elevated: { light: '#FFFFFF', dark: '#1A2438' },
        border: { light: '#E5E5E5', dark: '#22304D' },
        'text-primary': { light: '#1F1F1F', dark: '#F4F4F5' },
        'text-muted': { light: '#777777', dark: '#A1A1AA' },
        'brand-green': { light: '#58CC02', dark: '#58CC02' },
        'brand-green-dark': { light: '#58A700', dark: '#4A8E00' },
        'brand-blue': { light: '#1CB0F6', dark: '#1CB0F6' },
        'brand-blue-dark': { light: '#0E8FCE', dark: '#0E8FCE' },
        'accent-gold': { light: '#FFC800', dark: '#FFC800' },
        'accent-gold-dark': { light: '#E5A800', dark: '#E5A800' },
        'accent-fire': { light: '#FF4D4D', dark: '#FF7A7A' },
        'accent-fire-soft': { light: '#FF7A7A', dark: '#FF9999' },
        'slate-blue': { light: '#94A3B8', dark: '#94A3B8' },
        'slate-blue-dark': { light: '#64748B', dark: '#64748B' },
        'state-locked': { light: '#E5E5E5', dark: '#2A3344' },
        'state-locked-dark': { light: '#BFBFBF', dark: '#3A4459' },
        ink: { light: '#1F1F1F', dark: '#0B1220' },
        paper: { light: '#FFFFFF', dark: '#0B1220' },
        success: { light: '#58CC02', dark: '#58CC02' },
        warning: { light: '#FFC800', dark: '#FFC800' },
        danger: { light: '#FF4D4D', dark: '#FF7A7A' },
      },
      fontFamily: {
        sans: ['System'],
      },
      borderRadius: {
        '4xl': '24px',
      },
    },
  },
  plugins: [],
};
