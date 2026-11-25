/** Tailwind CSS config for civic-complaint dashboard */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        sidebarStart: "#1e3a8a",
        sidebarEnd: "#1e40af",
        activeSidebar: "#3b82f6",
        activeBorder: "#60a5fa",
        headerBtn: "#8B7355",
        headerBtnHover: "#6d5a44",
        avatarStart: "#3b82f6",
        avatarEnd: "#8b5cf6",
        statBlue: "#3b82f6",
        statRed: "#ef4444",
        statGreen: "#22c55e"
      }
    }
  },
  plugins: []
}
