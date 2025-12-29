import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { TrendingUp, Clock } from 'lucide-react'
import { CLASS_COLORS } from '../App'

// =============================================================================
// CUSTOM TOOLTIP
// =============================================================================
// Shows which class was detected at a given time point
// Only displays classes with value > 0 to avoid clutter

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Filter out classes with 0 detections at this point
    const activePayload = payload.filter(p => p.value > 0)
    if (activePayload.length === 0) return null

    return (
      <div className="bg-navy-700 border border-navy-500 rounded-lg px-3 py-2 shadow-xl">
        <p className="font-mono text-xs text-gray-400 mb-1">{label}</p>
        {activePayload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-mono text-sm" style={{ color: entry.color }}>
              {entry.dataKey}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// =============================================================================
// TIME SERIES CHART COMPONENT
// =============================================================================
// Stacked area chart showing traffic classification over time
// Each botnet class gets its own colored area

function TimeSeriesChart({ data }) {
  // Aggregate raw data into buckets for smoother visualization
  // Groups every 3 data points together - prevents chart from being too spiky
  const aggregatedData = data.reduce((acc, point, index) => {
    const bucketIndex = Math.floor(index / 3)
    if (!acc[bucketIndex]) {
      acc[bucketIndex] = {
        time: point.time,
        timestamp: point.timestamp,
      }
      // Initialize all class counts to 0
      Object.keys(CLASS_COLORS).forEach(cls => {
        acc[bucketIndex][cls] = 0
      })
    }
    // Sum up values within each bucket
    Object.keys(CLASS_COLORS).forEach(cls => {
      acc[bucketIndex][cls] += point[cls] || 0
    })
    return acc
  }, [])

  const chartData = aggregatedData.length > 0 ? aggregatedData : []

  return (
    <div className="card p-5">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-info" />
          <h3 className="font-display font-semibold text-lg tracking-wide">
            TRAFFIC TIMELINE
          </h3>
        </div>
        {/* Data point counter */}
        <div className="flex items-center gap-2 text-gray-500">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-mono">Last {data.length} classifications</span>
        </div>
      </div>

      {/* Chart container */}
      <div className="h-64">
        {/* Need at least 3 points to render meaningful chart */}
        {chartData.length > 2 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              {/* Define gradient fills for each class */}
              {/* Fade from solid at top to transparent at bottom */}
              <defs>
                {Object.entries(CLASS_COLORS).map(([name, color]) => (
                  <linearGradient
                    key={name}
                    id={`gradient-${name}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>

              {/* Subtle grid lines - horizontal only */}
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#243044"
                vertical={false}
              />

              {/* X axis - timestamps */}
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                interval="preserveStartEnd"
              />

              {/* Y axis - count */}
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                allowDecimals={false}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Render an Area for each traffic class */}
              {/* stackId="1" makes them stack on top of each other */}
              {Object.entries(CLASS_COLORS).map(([name, color]) => (
                <Area
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stackId="1"
                  stroke={color}
                  strokeWidth={2}
                  fill={`url(#gradient-${name})`}
                  animationDuration={300}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          // Loading state - shown while collecting initial data
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-30" />
              </motion.div>
              <p className="font-mono text-sm">Gathering timeline data...</p>
              <p className="font-mono text-xs text-gray-600 mt-1">
                {data.length}/3 data points
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Legend - shows all class colors */}
      <div className="flex flex-wrap justify-center gap-4 mt-4 pt-4 border-t border-navy-500/50">
        {Object.entries(CLASS_COLORS).map(([name, color]) => (
          <div key={name} className="flex items-center gap-2">
            <div
              className="w-3 h-1 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs font-mono text-gray-500">{name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TimeSeriesChart