import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold: {
          DEFAULT: "#D4AF37", // Backward compatibility
          light: "#FFD700",   // Backward compatibility
          dark: "#B8941F",    // Backward compatibility
          50: "oklch(95% 0.06 85)",
          100: "oklch(90% 0.08 85)",
          200: "oklch(85% 0.11 90)",
          300: "oklch(80% 0.12 87)",
          400: "oklch(75% 0.12 85)",
          500: "#D4AF37",     // Same as DEFAULT
          600: "oklch(65% 0.13 80)",
          700: "oklch(55% 0.12 75)",
          800: "oklch(45% 0.10 70)",
          900: "oklch(35% 0.08 65)",
        },
        dark: {
          DEFAULT: "#FAFAF8",
          light: "#F5F3EF",
          lighter: "#EDE9E3",
        },
        gray: {
          50: "var(--gray-50)",
          100: "var(--gray-100)",
          200: "var(--gray-200)",
          300: "var(--gray-300)",
          400: "var(--gray-400)",
          500: "var(--gray-500)",
        },
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      animation: {
        "shimmer": "shimmer 3s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
        "gradient": "gradient 8s ease infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(212, 175, 55, 0.6)" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)",
        "dark-gradient": "linear-gradient(135deg, #FAFAF8 0%, #F5F3EF 50%, #FAFAF8 100%)",
        "light-gradient": "linear-gradient(135deg, #FAFAF8 0%, #F5F3EF 50%, #FAFAF8 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
