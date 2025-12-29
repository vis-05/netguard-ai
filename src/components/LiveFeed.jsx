import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Radio, ChevronRight, Pause, Play } from 'lucide-react'
import { CLASS_COLORS } from '../App'

// =============================================================================
// FEED ITEM COMPONENT
// =============================================================================
// Single row in the live feed showing one classification result
// Different styling for benign vs threat entries

function FeedItem({ classification, index }) {
  const isBENIGN = classification.prediction === 'BENIGN'
  
  // Format timestamp for display
  const timestamp = new Date(classification.timestamp).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <motion.div
      // Slide in from left, collapse height on exit
      initial={{ opacity: 0, x: -20, height: 0 }}
      animate={{ opacity: 1, x: 0, height: 'auto' }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.2 }}
      // BENIGN = subtle, threat = highlighted with red tint
      className={`flex items-center gap-4 p-3 rounded-lg border transition-all duration-300 ${
        isBENIGN
          ? 'bg-navy-700/30 border-navy-500/30 hover:border-benign/30'
          : 'bg-threat/5 border-threat/20 hover:border-threat/40'
      }`}
      style={{
        animationDelay: `${index * 30}ms`,  // Stagger effect
      }}
    >
      {/* Timestamp column */}
      <div className="flex-shrink-0">
        <span className="font-mono text-xs text-gray-500">{timestamp}</span>
      </div>

      {/* Class badge - colored pill showing the prediction */}
      <div
        className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-mono font-semibold"
        style={{
          backgroundColor: `${CLASS_COLORS[classification.prediction]}20`,
          color: CLASS_COLORS[classification.prediction],
          border: `1px solid ${CLASS_COLORS[classification.prediction]}40`,
        }}
      >
        {classification.prediction}
      </div>

      {/* Confidence bar - visual indicator of how sure the model was */}
      <div className="flex-grow">
        <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${classification.confidence * 100}%` }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="h-full rounded-full"
            style={{ backgroundColor: CLASS_COLORS[classification.prediction] }}
          />
        </div>
      </div>

      {/* Confidence percentage */}
      <div className="flex-shrink-0">
        <span
          className="font-mono text-sm font-semibold"
          style={{ color: CLASS_COLORS[classification.prediction] }}
        >
          {(classification.confidence * 100).toFixed(1)}%
        </span>
      </div>

      {/* Arrow indicator */}
      <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
    </motion.div>
  )
}

// =============================================================================
// LIVE FEED COMPONENT
// =============================================================================
// Scrolling list of recent classifications
// Can be paused to examine specific entries

function LiveFeed({ classifications }) {
  // Pause state - when paused, shows full history instead of just recent
  const [isPaused, setIsPaused] = useState(false)
  
  // Show 15 most recent when running, all when paused
  const displayedItems = isPaused ? classifications : classifications.slice(0, 15)

  return (
    <div className="card p-5 h-[500px] flex flex-col">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Animated radio icon with pulse ring */}
          <div className="relative">
            <Radio className="w-5 h-5 text-benign" />
            <motion.div
              className="absolute inset-0 rounded-full border border-benign"
              animate={{
                scale: [1, 1.5],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          </div>
          <h3 className="font-display font-semibold text-lg tracking-wide">
            LIVE FEED
          </h3>
          {/* Event counter badge */}
          <span className="text-xs font-mono text-gray-500 bg-navy-700 px-2 py-0.5 rounded">
            {classifications.length} events
          </span>
        </div>

        {/* Pause/Play toggle button */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-2 rounded-lg bg-navy-700 hover:bg-navy-600 transition-colors"
          title={isPaused ? 'Resume feed' : 'Pause feed'}
        >
          {isPaused ? (
            <Play className="w-4 h-4 text-benign" />
          ) : (
            <Pause className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>

      {/* Scrollable feed list */}
      <div className="flex-grow overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {displayedItems.map((classification, index) => (
            <FeedItem
              key={classification.id}
              classification={classification}
              index={index}
            />
          ))}
        </AnimatePresence>

        {/* Empty state - shown before any data arrives */}
        {classifications.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Radio className="w-8 h-8 mb-2 animate-pulse" />
            <p className="font-mono text-sm">Waiting for traffic data...</p>
          </div>
        )}
      </div>

      {/* Bottom legend - quick reference for class colors */}
      <div className="mt-4 pt-3 border-t border-navy-500/50">
        <div className="flex flex-wrap gap-3">
          {/* Show first 4 classes */}
          {Object.entries(CLASS_COLORS).slice(0, 4).map(([name, color]) => (
            <div key={name} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs font-mono text-gray-500">{name}</span>
            </div>
          ))}
          <span className="text-xs font-mono text-gray-600">+3 more</span>
        </div>
      </div>
    </div>
  )
}

export default LiveFeed