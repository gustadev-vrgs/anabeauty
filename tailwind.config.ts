import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        coffee: {
          latte: '#F5E6D3',
          cappuccino: '#ECC9A8',
          macchiato: '#D2AA7B',
          caramel: '#C58A53',
          mocha: '#A86F47',
          hazelnut: '#8C5A3A',
          espresso: '#6B5E29',
          darkRoast: '#4C2B1C',
          blackCoffee: '#2A1A13',
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        border: 'var(--border)',
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
      },
      boxShadow: {
        card: '0 10px 28px rgba(42, 26, 19, 0.08)',
        elevated: '0 14px 34px rgba(42, 26, 19, 0.14)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
