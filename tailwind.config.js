/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // 游戏特殊主题色
        erosion: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        awareness: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        truth: '#fbbf24',
        resident: '#6b7280',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "reality-break": {
          '0%': { filter: 'brightness(1) hue-rotate(0deg)', transform: 'scale(1)' },
          '25%': { filter: 'brightness(1.5) hue-rotate(90deg)', transform: 'scale(1.02)' },
          '50%': { filter: 'brightness(0.5) hue-rotate(180deg)', transform: 'scale(0.98)' },
          '75%': { filter: 'brightness(1.3) hue-rotate(270deg)', transform: 'scale(1.01)' },
          '100%': { filter: 'brightness(1) hue-rotate(360deg)', transform: 'scale(1)' },
        },
        "typewriter-cursor": {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        "erosion-pulse": {
          '0%, 100%': { boxShadow: '0 0 5px rgba(236, 72, 153, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(236, 72, 153, 0.8)' },
        },
        "perception-flicker": {
          '0%': { opacity: '1', filter: 'none' },
          '10%': { opacity: '0.3', filter: 'hue-rotate(180deg)' },
          '20%': { opacity: '1', filter: 'none' },
          '30%': { opacity: '0.5', filter: 'hue-rotate(90deg)' },
          '40%': { opacity: '1', filter: 'none' },
          '100%': { opacity: '1', filter: 'none' },
        },
        "item-glow": {
          '0%, 100%': { boxShadow: '0 0 3px rgba(251, 191, 36, 0.3)' },
          '50%': { boxShadow: '0 0 15px rgba(251, 191, 36, 0.8)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "reality-break": "reality-break 0.5s ease-in-out",
        "typewriter-cursor": "typewriter-cursor 1s step-end infinite",
        "erosion-pulse": "erosion-pulse 2s ease-in-out infinite",
        "perception-flicker": "perception-flicker 0.8s ease-in-out",
        "item-glow": "item-glow 2s ease-in-out infinite",
      },
      fontFamily: {
        game: ['"Noto Sans SC"', '"Source Han Sans"', 'sans-serif'],
        journal: ['"ZCOOL XiaoWei"', 'serif'],
        title: ['"Ma Shan Zheng"', '"ZCOOL QingKe HuangYou"', 'cursive'],
        mono: ['"Courier New"', 'monospace'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
