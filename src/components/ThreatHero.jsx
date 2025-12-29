import { motion, AnimatePresence } from 'framer-motion'
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, Activity } from 'lucide-react'
import { CLASS_COLORS } from '../App'

// =============================================================================
// THREAT HERO COMPONENT
// =============================================================================
// The big status display at the top of the dashboard
// Shows current network status (SECURE vs THREAT DETECTED)
// Changes color, icon, and animations based on the latest classification

function ThreatHero({ currentThreat }) {
  // Determine if current state is safe or not
  const isBENIGN = !currentThreat || currentThreat.prediction === 'BENIGN'
  const threatClass = currentThreat?.prediction || 'BENIGN'
  const confidence = currentThreat?.confidence || 0

  return (
    <div className="relative overflow-hidden">
      
      {/* Background glow effect - green for safe, red for threat */}
      {/* Sits behind the main card, creates that nice ambient glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{
          background: isBENIGN
            ? 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at center, rgba(244, 63, 94, 0.15) 0%, transparent 70%)',
        }}
        transition={{ duration: 2 }}
      />

      {/* Main card container */}
      <motion.div
        className={`relative rounded-2xl p-6 md:p-8 border-2 transition-all duration-1800 ${
          isBENIGN
            ? 'border-benign/30 glow-benign'
            : 'border-threat/30 glow-threat'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(26, 35, 50, 0.9) 0%, rgba(10, 15, 28, 0.9) 100%)',
        }}
        layout
      >
        {/* Animated diagonal stripes background */}
        {/* Subtle movement adds life without being distracting */}
        <div className="absolute inset-0 opacity-10 overflow-hidden rounded-2xl">
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                ${isBENIGN ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)'} 10px,
                ${isBENIGN ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)'} 20px
              )`,
            }}
            animate={{ x: [0, 20] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left side - Icon and status text */}
          <div className="flex items-center gap-6">
            
            {/* Animated status icon with pulse rings */}
            <div className="relative">
              {/* Icon container - breathes in and out */}
              <motion.div
                className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center ${
                  isBENIGN ? 'bg-benign/20' : 'bg-threat/20'
                }`}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {/* Icon swaps with rotation animation */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isBENIGN ? 'benign' : 'threat'}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isBENIGN ? (
                      <ShieldCheck className="w-10 h-10 md:w-12 md:h-12 text-benign" />
                    ) : (
                      <ShieldAlert className="w-10 h-10 md:w-12 md:h-12 text-threat" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Expanding pulse ring #1 */}
              <motion.div
                className={`absolute inset-0 rounded-full border-2 ${
                  isBENIGN ? 'border-benign' : 'border-threat'
                }`}
                animate={{
                  scale: [1, 1.5],
                  opacity: [0.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
              {/* Pulse ring #2 - staggered for layered effect */}
              <motion.div
                className={`absolute inset-0 rounded-full border-2 ${
                  isBENIGN ? 'border-benign' : 'border-threat'
                }`}
                animate={{
                  scale: [1, 1.5],
                  opacity: [0.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: 0.5,
                }}
              />
            </div>

            {/* Status text block */}
            <div>
              <motion.p
                className="text-sm font-mono text-gray-400 mb-1 tracking-wider"
                layout
              >
                NETWORK STATUS
              </motion.p>
              {/* Main status headline - animates when status changes */}
              <AnimatePresence mode="wait">
                <motion.h2
                  key={threatClass}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`text-3xl md:text-4xl font-display font-bold tracking-wide ${
                    isBENIGN ? 'text-benign text-glow-benign' : 'text-threat text-glow-threat'
                  }`}
                >
                  {isBENIGN ? 'SECURE' : 'THREAT DETECTED'}
                </motion.h2>
              </AnimatePresence>
              {/* Subtext - shows botnet class name when threat */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={threatClass + '-sub'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-lg text-gray-300 mt-1 font-body"
                >
                  {isBENIGN ? (
                    'All traffic appears normal'
                  ) : (
                    <>
                      Classification:{' '}
                      <span
                        className="font-semibold"
                        style={{ color: CLASS_COLORS[threatClass] }}
                      >
                        {threatClass}
                      </span>
                    </>
                  )}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Right side - Confidence meter */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-sm font-mono text-gray-400 tracking-wider">
              CONFIDENCE
            </p>
            {/* Big confidence number */}
            <div className="flex items-baseline gap-1">
              <motion.span
                key={confidence}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`text-5xl md:text-6xl font-display font-bold counter ${
                  isBENIGN ? 'text-benign' : 'text-threat'
                }`}
              >
                {(confidence * 100).toFixed(1)}
              </motion.span>
              <span className="text-2xl text-gray-400 font-display">%</span>
            </div>

            {/* Confidence progress bar */}
            <div className="w-48 h-2 bg-navy-700 rounded-full overflow-hidden mt-2">
              <motion.div
                className={`h-full rounded-full ${
                  isBENIGN ? 'bg-benign' : 'bg-threat'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${confidence * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>

            {/* Live analysis indicator */}
            <div className="flex items-center gap-2 mt-2">
              <Activity className={`w-4 h-4 ${isBENIGN ? 'text-benign' : 'text-threat'} animate-pulse`} />
              <span className="text-xs font-mono text-gray-500">LIVE ANALYSIS</span>
            </div>
          </div>
        </div>

        {/* Warning banner - only shows when threat detected */}
        {/* Slides in/out with height animation */}
        <AnimatePresence>
          {!isBENIGN && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-4 border-t border-threat/20"
            >
              <div className="flex items-center gap-3 text-threat">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-mono text-sm">
                  Potential botnet activity detected. Review traffic immediately.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default ThreatHero