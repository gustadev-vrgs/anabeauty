import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
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
      },
      boxShadow: {
        card: '0 10px 30px rgba(76, 43, 28, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
