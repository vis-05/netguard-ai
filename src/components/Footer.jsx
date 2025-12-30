import { motion } from 'framer-motion'
import { Shield, Github, ExternalLink } from 'lucide-react'

// =============================================================================
// FOOTER COMPONENT
// =============================================================================
// Bottom bar showing connection status, session stats, branding, and links
// Uses mt-auto to stick to bottom when content is short

function Footer({ connectionStatus, stats }) {
  // Map connection states to text colors
  const statusColors = {
    connected: 'text-benign',
    connecting: 'text-warning',
    error: 'text-threat',
  }
  // Human-readable status messages
  const statusText = {
    connected: 'Connected to backend • Live data',
    connecting: 'Connecting to backend...',
    error: 'Backend sleeping • Demo mode',
  }

  return (
    <footer className="mt-auto border-t border-navy-500/50 bg-navy-800/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left section - Connection status and session info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <motion.div
                // Color changes based on connection state
                className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected'
                    ? 'bg-benign'
                    : connectionStatus === 'connecting'
                    ? 'bg-warning'
                    : 'bg-threat'
                }`}
                // Pulse animation only when connecting
                animate={{
                  opacity: connectionStatus === 'connecting' ? [1, 0.3, 1] : 1,
                }}
                transition={{
                  duration: 1,
                  repeat: connectionStatus === 'connecting' ? Infinity : 0,
                }}
              />
              <span className={`text-xs font-mono ${statusColors[connectionStatus]}`}>
                {statusText[connectionStatus]}
              </span>
            </div>
            {/* Vertical divider - hidden on mobile to save space */}
            <div className="h-4 w-px bg-navy-500 hidden md:block" />
            {/* Session stats - running total of analyzed flows */}
            <span className="text-xs font-mono text-gray-500">
              Session: {stats.total.toLocaleString()} flows analyzed
            </span>
          </div>

          {/* Center - Branding */}
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-benign" />
            <span className="text-xs font-mono text-gray-400">
              NetGuard AI • ML-Powered Network Security
            </span>
          </div>

          {/* Right section - External links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/vis-05/netguard-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-mono text-gray-500 hover:text-benign transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">Source</span>
            </a>
            <a
              href="https://vish-05-netguard-backend.hf.space/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-mono text-gray-500 hover:text-benign transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">API Docs</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
