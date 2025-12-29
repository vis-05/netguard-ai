/** @type {import('tailwindcss').Config} */
export default {
  // ---------------------------------------------------------------------------
  // CONTENT PATHS
  // ---------------------------------------------------------------------------
  // Tell Tailwind where to look for class names
  // It'll tree-shake any unused classes in production
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      // -----------------------------------------------------------------------
      // CUSTOM COLOR PALETTE
      // -----------------------------------------------------------------------
      colors: {
        // Primary dark palette - used for backgrounds and cards
        // Goes from nearly black (900) to medium dark (500)
        // Picked these to give that "security ops center" vibe
        navy: {
          900: '#050810',  // main bg - almost black with slight blue
          800: '#0a0f1c',  // header/footer bg
          700: '#0f172a',  // elevated surfaces
          600: '#1a2332',  // cards
          500: '#243044',  // borders, subtle elements
        },
        
        // Semantic colors - these mean something specific in the UI
        // BENIGN = good/safe, threat = bad/danger
        benign: {
          DEFAULT: '#10b981',  // emerald green - main "safe" color
          dark: '#059669',     // hover states, emphasis
          light: '#34d399',    // highlights
          glow: 'rgba(16, 185, 129, 0.3)',  // for box-shadow effects
        },
        threat: {
          DEFAULT: '#f43f5e',  // rose red - main "danger" color
          dark: '#e11d48',
          light: '#fb7185',
          glow: 'rgba(244, 63, 94, 0.3)',
        },
        warning: {
          DEFAULT: '#f59e0b',  // amber - for "connecting" states etc
          dark: '#d97706',
          light: '#fbbf24',
        },
        info: {
          DEFAULT: '#0ea5e9',  // sky blue - neutral informational
          dark: '#0284c7',
          light: '#38bdf8',
        },
        
        // Botnet class colors - each botnet family gets its own color
        // Makes it easy to spot patterns in the charts
        // These match CLASS_COLORS in App.jsx - keep them in sync!
        portscan: '#f43f5e',    // red - most infamous IoT botnet
        ddos: '#f97316',   // orange
        dos: '#a855f7',  // purple
        bot: '#06b6d4',    // cyan
        bruteforce: '#ec4899',   // pink
        webattack: '#eab308',  // yellow
      },
      
      // -----------------------------------------------------------------------
      // TYPOGRAPHY
      // -----------------------------------------------------------------------
      // Custom font stack - loaded via Google Fonts in index.html
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],      // futuristic, techy - for headings
        mono: ['JetBrains Mono', 'monospace'],    // great for data, timestamps
        body: ['Exo 2', 'sans-serif'],            // readable body text
      },
      
      // -----------------------------------------------------------------------
      // CUSTOM ANIMATIONS
      // -----------------------------------------------------------------------
      // These get used throughout the dashboard for polish
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',  // slower than default
        'scan': 'scan 2s linear infinite',        // scanning line effect in header
        'glow': 'glow 2s ease-in-out infinite alternate',  // pulsing glow
        'float': 'float 6s ease-in-out infinite', // subtle floating motion
        'slide-up': 'slideUp 0.5s ease-out',      // entrance animation
        'fade-in': 'fadeIn 0.5s ease-out',
        'count': 'count 0.3s ease-out',           // number counting effect
      },
      
      // Keyframe definitions for the animations above
      keyframes: {
        // Scanning line that moves across the header
        scan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        // Pulsing glow effect for the threat hero
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(16, 185, 129, 0.6)' },
        },
        // Subtle up/down floating - used sparingly
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        // Slide up from below with fade
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        // Simple fade in
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      
      // -----------------------------------------------------------------------
      // BACKGROUND PATTERNS
      // -----------------------------------------------------------------------
      // Custom background gradients and patterns
      backgroundImage: {
        // Subtle grid overlay - gives that techy/hacker aesthetic
        'grid-pattern': 'linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px)',
        // Radial gradient utility
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  
  plugins: [],
}
