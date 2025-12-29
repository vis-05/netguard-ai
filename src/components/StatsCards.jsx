import { motion } from 'framer-motion'
import { Activity, AlertTriangle, Percent, Zap } from 'lucide-react'

// =============================================================================
// STAT CARD COMPONENT
// =============================================================================
// Individual metric card with icon, label, value, and accent color
// Animates in on load and has hover effects

function StatCard({ icon: Icon, label, value, suffix, color, delay }) {
  return (
    <motion.div
      // Staggered entrance animation
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      // Lift up on hover
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card p-5 relative overflow-hidden group"
    >
      {/* Background glow - only visible on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${color}15 0%, transparent 70%)`,
        }}
      />

      <div className="relative flex items-start justify-between">
        {/* Left side - label and value */}
        <div>
          <p className="text-xs font-mono text-gray-500 tracking-wider mb-2">
            {label}
          </p>
          <div className="flex items-baseline gap-1">
            {/* Value with subtle animation when it changes */}
            <motion.span
              key={value}  // Re-triggers animation on value change
              initial={{ opacity: 0.5, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-3xl font-display font-bold text-white counter"
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </motion.span>
            {/* Optional suffix like "%" or "/s" */}
            {suffix && (
              <span className="text-lg text-gray-400 font-mono">{suffix}</span>
            )}
          </div>
        </div>

        {/* Right side - icon with colored background */}
        <div
          className="p-2.5 rounded-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>

      {/* Bottom accent line - colored bar that animates in */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-navy-500">
        <motion.div
          className="h-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: '30%' }}
          transition={{ duration: 0.8, delay: delay + 0.2 }}
        />
      </div>
    </motion.div>
  )
}

// =============================================================================
// STATS CARDS COMPONENT
// =============================================================================
// Row of 4 metric cards showing key dashboard stats
// 2 columns on mobile, 4 columns on desktop

function StatsCards({ stats }) {
  // Card configuration - each card gets its own icon and color
  const cards = [
    {
      icon: Activity,
      label: 'TOTAL ANALYZED',
      value: stats.total,
      suffix: '',
      color: '#0ea5e9',  // info blue
    },
    {
      icon: AlertTriangle,
      label: 'THREATS DETECTED',
      value: stats.threats,
      suffix: '',
      color: '#f43f5e',  // threat red
    },
    {
      icon: Percent,
      label: 'THREAT RATIO',
      value: stats.threatPercentage,
      suffix: '%',
      color: '#f59e0b',  // warning amber
    },
    {
      icon: Zap,
      label: 'ANALYSIS RATE',
      value: stats.rate,
      suffix: '/s',
      color: '#10b981',  // benign green
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <StatCard
          key={card.label}
          {...card}
          delay={index * 0.1}  // Stagger each card by 100ms
        />
      ))}
    </div>
  )
}

export default StatsCards