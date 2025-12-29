import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { PieChart as PieIcon } from 'lucide-react'
import { CLASS_COLORS } from '../App'

// =============================================================================
// CUSTOM TOOLTIP
// =============================================================================
// Appears on hover over pie segments
// Shows class name, count, and percentage
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-navy-700 border border-navy-500 rounded-lg px-3 py-2 shadow-xl">
        <p className="font-mono text-sm font-semibold" style={{ color: data.color }}>
          {data.name}
        </p>
        <p className="text-gray-300 text-sm">
          Count: <span className="font-mono font-semibold">{data.value}</span>
        </p>
        <p className="text-gray-400 text-xs">
          {data.percentage}% of total
        </p>
      </div>
    )
  }
  return null
}

// =============================================================================
// DISTRIBUTION CHART COMPONENT
// =============================================================================
// Donut chart showing traffic breakdown by class
// Also includes a benign vs threat summary bar and legend

function DistributionChart({ distribution }) {
  // Sum up all classifications so far
  const total = Object.values(distribution).reduce((a, b) => a + b, 0)
  
  // Transform distribution object into array format that Recharts expects
  // Filter out classes with 0 count to keep chart clean
  const data = Object.entries(CLASS_COLORS).map(([name, color]) => ({
    name,
    value: distribution[name] || 0,
    color,
    percentage: total > 0 ? ((distribution[name] || 0) / total * 100).toFixed(1) : 0,
  })).filter(item => item.value > 0)

  // If no data yet, show placeholder with all classes at 0
  // Prevents empty state from looking broken
  const displayData = data.length > 0 ? data : Object.entries(CLASS_COLORS).map(([name, color]) => ({
    name,
    value: 0,
    color,
    percentage: 0,
  }))

  // Quick stats for the summary bar
  const benignCount = distribution['BENIGN'] || 0
  const threatCount = total - benignCount

  return (
    <div className="card p-5 h-[500px] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <PieIcon className="w-5 h-5 text-info" />
        <h3 className="font-display font-semibold text-lg tracking-wide">
          TRAFFIC DISTRIBUTION
        </h3>
      </div>

      {/* Chart container */}
      <div className="flex-grow relative">
        {total > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={displayData}
                cx="50%"
                cy="50%"
                innerRadius={70}   // Creates the donut hole
                outerRadius={100}
                paddingAngle={2}   // Gap between segments
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {/* Each segment gets its class color + glow effect */}
                {displayData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="transparent"
                    style={{
                      filter: `drop-shadow(0 0 8px ${entry.color}40)`,
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          // Empty state - shown before any data arrives
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <PieIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="font-mono text-sm">Collecting data...</p>
            </div>
          </div>
        )}

        {/* Center stats - sits in the donut hole */}
        {/* pointer-events-none so it doesn't block chart hover */}
        {total > 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <motion.p
                key={total}  // Re-animates when total changes
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl font-display font-bold text-white"
              >
                {total.toLocaleString()}
              </motion.p>
              <p className="text-xs font-mono text-gray-500">TOTAL FLOWS</p>
            </div>
          </div>
        )}
      </div>

      {/* Summary bar - quick visual of benign vs threats */}
      <div className="mt-4 mb-4">
        <div className="flex justify-between text-xs font-mono text-gray-500 mb-1">
          <span>BENIGN: {benignCount}</span>
          <span>Threats: {threatCount}</span>
        </div>
        {/* Stacked bar - green portion is benign, red is threats */}
        <div className="h-2 bg-navy-700 rounded-full overflow-hidden flex">
          <motion.div
            className="h-full bg-benign"
            initial={{ width: 0 }}
            animate={{ width: total > 0 ? `${(benignCount / total) * 100}%` : '0%' }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className="h-full bg-threat"
            initial={{ width: 0 }}
            animate={{ width: total > 0 ? `${(threatCount / total) * 100}%` : '0%' }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Legend - shows first 6 classes with counts */}
      {/* 2-column grid to save vertical space */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-navy-500/50">
        {displayData.slice(0, 6).map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-2 rounded-lg bg-navy-700/30 hover:bg-navy-700/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-mono text-gray-400">{item.name}</span>
            </div>
            <span
              className="text-xs font-mono font-semibold"
              style={{ color: item.color }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DistributionChart