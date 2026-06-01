/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand blues
        primary: {
          DEFAULT: '#347DC1',
          50:  '#EBF3FB',
          100: '#D1E5F6',
          200: '#A3CBF0',
          300: '#75B1E9',
          400: '#4797E2',
          500: '#347DC1',
          600: '#2A6499',
          700: '#1F4A72',
          800: '#15314B',
          900: '#0A1924',
        },
        // Accent purple
        accent: {
          DEFAULT: '#8C287B',
          light: '#c4b0f3',
          50:  '#F8EDF7',
          100: '#F1DBF0',
          200: '#D8A5D2',
          300: '#BC6EB1',
          400: '#A2498F',
          500: '#8C287B',
          600: '#6E1F61',
          700: '#511748',
          800: '#340F2F',
          900: '#180716',
        },
        // Neutrals
        surface: {
          DEFAULT: '#f4f6f9',
          50:  '#FFFFFF',
          100: '#F4F6F9',
          200: '#E9ECF2',
          300: '#D1D7E2',
          400: '#A8B3C7',
          500: '#6B7A99',
          600: '#4A5568',
          700: '#2D3748',
          800: '#1A202C',
          900: '#0D1117',
        },
      },
      fontFamily: {
        sans:  ['Gilroy', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        bold:  ['Gilroy-Bold', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:  ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      spacing: {
        sidebar:       '240px',
        'sidebar-sm':  '64px',
        topbar:        '56px',
      },
      boxShadow: {
        card:    '0 1px 4px 0 rgba(0,0,0,0.10)',
        topbar:  '0 1px 0 0 rgba(0,0,0,0.08)',
        sidebar: '2px 0 8px 0 rgba(0,0,0,0.08)',
        modal:   '0 8px 32px rgba(0,0,0,0.18)',
      },
      borderRadius: {
        card:  '8px',
        modal: '12px',
        btn:   '6px',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      zIndex: {
        topbar:  '1030',
        sidebar: '1020',
        modal:   '1050',
        overlay: '1040',
      },
    },
  },
  plugins: [],
};
