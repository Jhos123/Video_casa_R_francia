export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#006c49',
        'primary-hover': '#005236',
        secondary: '#1b6b51',
        tertiary: '#00b982',
        'neutral-cloud': '#f8faf8',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        badge: '9999px',
        card: '24px',
        'card-large': '32px',
        btn: '16px',
      },
      boxShadow: {
        'custom-sm': '0 4px 20px -2px rgba(27, 107, 81, 0.04)',
        custom: '0 8px 30px -4px rgba(27, 107, 81, 0.08)',
        'custom-lg': '0 20px 50px -8px rgba(16, 185, 129, 0.15)',
      },
    },
  },
};
