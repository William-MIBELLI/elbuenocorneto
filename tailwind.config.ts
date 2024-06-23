import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
        "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "bg_login": "url('/images/bg_login.png')"
      },
      colors: {
        // 'gray': '#8492a6'
        'main': '#F97316'
      },
      boxShadow: {
        'dashboard_card': '0 8px 16px #0003'
      }
    }
  },
  plugins: [nextui()],
  darkMode: "class"
};
export default config;
