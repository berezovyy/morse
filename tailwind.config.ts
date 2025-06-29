import type { Config } from "tailwindcss"
import tailwindAnimate from "tailwindcss-animate"

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./registry/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        'pixel-pulse': 'pixelPulse 0.5s ease-in-out',
        'label-morph': 'labelMorph 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'container-expand': 'containerExpand 0.4s ease-out',
        'pixel-fade-in': 'pixelFadeIn 0.3s ease-out',
        'pixel-fade-out': 'pixelFadeOut 0.3s ease-in',
        'grid-wave': 'gridWave 1.5s ease-in-out infinite',
        'morse-dot': 'morseDot 0.2s ease-out',
        'morse-dash': 'morseDash 0.6s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'slide-in': 'slideIn 0.4s ease-out forwards',
        'scale-fade-in': 'scaleFadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        pixelPulse: {
          '0%': { transform: 'scale(0.8)', opacity: '0.5' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '0.8' },
        },
        labelMorph: {
          '0%': { transform: 'scale(0.8) rotateX(15deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotateX(0deg)', opacity: '1' },
        },
        containerExpand: {
          '0%': { width: 'var(--from-width)' },
          '100%': { width: 'var(--to-width)' },
        },
        pixelFadeIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pixelFadeOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0)', opacity: '0' },
        },
        gridWave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        morseDot: {
          '0%': { transform: 'scale(0)', backgroundColor: 'hsl(var(--primary))' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        morseDash: {
          '0%': { transform: 'scaleX(0)', backgroundColor: 'hsl(var(--primary))' },
          '50%': { transform: 'scaleX(1.1)' },
          '100%': { transform: 'scaleX(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleFadeIn: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [tailwindAnimate],
} satisfies Config
