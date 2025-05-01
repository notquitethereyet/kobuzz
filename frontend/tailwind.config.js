/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Define custom colors
      colors: {
        // Sky blue color palette for primary
        "primary-50": "#f0f9ff",
        "primary-100": "#e0f2fe",
        "primary-200": "#bae6fd",
        "primary-300": "#7dd3fc",
        "primary-400": "#38bdf8",
        "primary-500": "#0ea5e9",
        "primary-600": "#0284c7",
        "primary-700": "#0369a1",
        "primary-800": "#075985",
        "primary-900": "#0c4a6e",
        "primary-950": "#082f49",

        // Purple color palette for secondary
        "secondary-50": "#f5f3ff",
        "secondary-100": "#ede9fe",
        "secondary-200": "#ddd6fe",
        "secondary-300": "#c4b5fd",
        "secondary-400": "#a78bfa",
        "secondary-500": "#8b5cf6",
        "secondary-600": "#7c3aed",
        "secondary-700": "#6d28d9",
        "secondary-800": "#5b21b6",
        "secondary-900": "#4c1d95",
        "secondary-950": "#2e1065",

        // Orange color palette for accent
        "accent-50": "#fff7ed",
        "accent-100": "#ffedd5",
        "accent-200": "#fed7aa",
        "accent-300": "#fdba74",
        "accent-400": "#fb923c",
        "accent-500": "#f97316",
        "accent-600": "#ea580c",
        "accent-700": "#c2410c",
        "accent-800": "#9a3412",
        "accent-900": "#7c2d12",
        "accent-950": "#431407",

        // Slate color palette for dark mode
        "dark-50": "#f8fafc",
        "dark-100": "#f1f5f9",
        "dark-200": "#e2e8f0",
        "dark-300": "#cbd5e1",
        "dark-400": "#94a3b8",
        "dark-500": "#64748b",
        "dark-600": "#475569",
        "dark-700": "#334155",
        "dark-800": "#1e293b",
        "dark-900": "#0f172a",
        "dark-950": "#020617",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
