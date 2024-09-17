import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./styles/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        onest: ["var(--font-onest)"],
      },
      boxShadow: {
        sidebarLight: "0px 0px 6px 1px rgba(0, 0, 0, 0.30)",
        sidebarDark: "0px 0px 12px 1px rgba(0, 0, 0, 0.40)",
      },
      colors: {
        forestGray: "#363836",
        lightGray: "#e0e0e0",
        darkGray: "#353836",
        darkGreen: "#282B29",
        yellowGreen: "#DDF23D",
        midnightGreen: "#212322",
        mediumGray: "#707572",
        smokeGray: "#505150",
        offWhite: "#F6F6F6",
        blackGreen: "#181a19",
        softGray: "#D6D5D5",
        translucentGray: "#70757230",
        frostWhite: "#F6F6F1",
        limeYellow: "#AABE13",
        sageGray: "#A3A9A5",
        lightSilver: "#E4E4E4",
        shadowGray: "#35383617",
        vividTangerine: "#DE7B30",
        midnightGray: "#333333",
        lightFrost: "#F0EEEE75",
        softLemon: "#edff6259",
        deepSlate: "#282a29",
        faintGray: "#F8F8F8",
      },
    },
  },
  plugins: [],
};
export default config;
