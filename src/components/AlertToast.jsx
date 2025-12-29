import { motion } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { CLASS_COLORS } from '../App'

// =============================================================================
// ALERT TOAST COMPONENT
// =============================================================================
// Slide-in notification that appears when a threat is detected
// Auto-dismisses after 5 seconds (progress bar at bottom shows time remaining)
// Can also be manually dismissed via X button

function AlertToast({ alert, onDismiss }) {
  // Get color for this specific botnet type, fallback to Port Scan's color
  const color = CLASS_COLORS[alert.type] || CLASS_COLORS['Port Scan']
  
  // Format timestamp for display - 24hr format looks more "techy"
  const timestamp = new Date(alert.timestamp).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <motion.div
      // Slide in from right with a slight scale-up effect
      // Spring animation feels more natural than linear
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="relative w-80 overflow-hidden rounded-lg border shadow-2xl"
      style={{
        backgroundColor: 'rgba(10, 15, 28, 0.95)',  // semi-transparent dark bg
        borderColor: `${color}40`,                   // subtle colored border
        boxShadow: `0 0 30px ${color}30`,           // colored glow effect
      }}
    >
      {/* Top accent line - solid color strip at top */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: color }}
      />

      {/* Animated background - subtle pulsing radial gradient */}
      {/* Gives the toast a bit of life without being distracting */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(circle at top right, ${color} 0%, transparent 50%)`,
        }}
        animate={{
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative p-4">
        <div className="flex items-start gap-3">
          {/* Warning icon with colored background */}
          <div
            className="flex-shrink-0 p-2 rounded-lg"
            style={{ backgroundColor: `${color}20` }}
          >
            <AlertTriangle className="w-5 h-5" style={{ color }} />
          </div>

          {/* Main content area */}
          <div className="flex-grow min-w-0">
            {/* Header row - title and dismiss button */}
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-display font-semibold text-sm text-white truncate">
                THREAT DETECTED
              </h4>
              <button
                onClick={onDismiss}
                className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Botnet type - colored to match the class */}
            <p className="text-xs text-gray-400 mt-1">
              Botnet activity classified as{' '}
              <span className="font-semibold" style={{ color }}>
                {alert.type}
              </span>
            </p>

            {/* Footer row - timestamp and confidence */}
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-mono text-gray-500">
                {timestamp}
              </span>
              <span
                className="text-xs font-mono font-semibold"
                style={{ color }}
              >
                {(alert.confidence * 100).toFixed(1)}% confidence
              </span>
            </div>
          </div>
        </div>

        {/* Auto-dismiss progress bar */}
        {/* Shrinks from 100% to 0% over 5 seconds, then triggers onDismiss */}
        {/* Visual indicator so user knows the toast will disappear */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5"
          style={{ backgroundColor: color }}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 5, ease: 'linear' }}
          onAnimationComplete={onDismiss}
        />
      </div>
    </motion.div>
  )
}

export default AlertToast