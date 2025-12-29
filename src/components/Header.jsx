import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Wifi, WifiOff, Activity } from 'lucide-react'

// =============================================================================
// HEADER COMPONENT
// =============================================================================
// Top navigation bar with logo, monitoring status, connection indicator, and clock
// Sticky positioned so it's always visible when scrolling

function Header({ connectionStatus }) {
  // Live clock state - updates every second
  const [currentTime, setCurrentTime] = useState(new Date())

  // Tick the clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Format time as HH:MM:SS (24hr format looks more techy)
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  // Format date like "Sun, Dec 28, 2024"
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Status text based on connection state
  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'LIVE'
      case 'connecting':
        return 'CONNECTING...'
      default:
        return 'DEMO MODE'
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-navy-800/80 backdrop-blur-md border-b border-navy-500/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Left section - Logo and brand */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Shield icon with pulse effect */}
            <div className="relative">
              <Shield className="w-8 h-8 text-benign" />
              {/* Expanding ring animation around the shield */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(16, 185, 129, 0.4)',
                    '0 0 0 10px rgba(16, 185, 129, 0)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            </div>
            {/* Brand text */}
            <div>
              <h1 className="font-display font-bold text-xl tracking-wider text-white">
                NETGUARD<span className="text-benign">AI</span>
              </h1>
              <p className="text-xs text-gray-400 font-mono tracking-wide">
                REAL-TIME BOTNET DETECTION
              </p>
            </div>
          </motion.div>

          {/* Center section - Status indicators (hidden on mobile) */}
          <motion.div 
            className="hidden md:flex items-center gap-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Monitoring active indicator */}
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-benign animate-pulse" />
              <span className="text-sm text-gray-300 font-mono">MONITORING ACTIVE</span>
            </div>
            
            {/* Divider */}
            <div className="h-4 w-px bg-navy-500" />
            
            {/* Connection status indicator */}
            <div className="flex items-center gap-2">
              {connectionStatus === 'connected' ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-benign status-dot" />
                  <Wifi className="w-4 h-4 text-benign" />
                  <span className="font-mono text-xs text-benign">{getStatusText()}</span>
                </>
              ) : connectionStatus === 'connecting' ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-warning status-dot" />
                  <Wifi className="w-4 h-4 text-warning animate-pulse" />
                  <span className="font-mono text-xs text-warning">{getStatusText()}</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-threat" />
                  <WifiOff className="w-4 h-4 text-threat" />
                  <span className="font-mono text-xs text-threat">{getStatusText()}</span>
                </>
              )}
            </div>
          </motion.div>

          {/* Right section - Connection status (mobile) and clock */}
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Connection status - visible on mobile only (icons only) */}
            <div className="flex md:hidden items-center gap-2">
              {connectionStatus === 'connected' ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-benign status-dot" />
                  <Wifi className="w-4 h-4 text-benign" />
                </>
              ) : connectionStatus === 'connecting' ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-warning status-dot" />
                  <Wifi className="w-4 h-4 text-warning animate-pulse" />
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-threat" />
                  <WifiOff className="w-4 h-4 text-threat" />
                </>
              )}
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-navy-500" />

            {/* Real-time clock display */}
            <div className="text-right">
              <div className="font-mono text-lg font-semibold text-white tracking-wider">
                {formatTime(currentTime)}
              </div>
              <div className="text-xs text-gray-500 font-mono">
                {formatDate(currentTime)}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scanning line effect - that cool moving gradient line */}
      {/* Gives that "active monitoring" vibe */}
      <div className="relative h-px bg-navy-500 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-benign to-transparent"
          animate={{ x: ['-100%', '500%'] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    </header>
  )
}

export default Header