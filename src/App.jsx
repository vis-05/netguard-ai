import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import ThreatHero from './components/ThreatHero'
import StatsCards from './components/StatsCards'
import LiveFeed from './components/LiveFeed'
import DistributionChart from './components/DistributionChart'
import TimeSeriesChart from './components/TimeSeriesChart'
import AlertToast from './components/AlertToast'
import Footer from './components/Footer'

// =============================================================================
// API CONFIGURATION
// =============================================================================
// Backend URL - pulls from env var if deployed, otherwise defaults to localhost
// When deploying to Vercel, set VITE_API_URL in environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// =============================================================================
// CLASS COLORS MAPPING
// =============================================================================
// Color codes for each traffic classification type
// These need to match exactly with whatever classes your ML model outputs
// BENIGN = safe traffic, rest are different botnet families
export const CLASS_COLORS = {
  'BENIGN': '#10b981',   // green - safe
  'Port Scan': '#f43f5e',    // red - most common IoT botnet
  'DDoS': '#f97316',   // orange - aka Bashlite
  'DoS': '#a855f7',  // purple - DDoS botnet
  'Bot': '#06b6d4',    // cyan - stealthy IoT botnet
  'Brute Force': '#ec4899',   // pink - vigilante botnet (ironic)
  'Web Attack': '#eab308',  // yellow
}

// =============================================================================
// MOCK DATA GENERATOR
// =============================================================================
// Used for demo mode when backend isn't connected
// Simulates realistic traffic distribution - mostly benign with occasional threats
const generateMockPrediction = () => {
  const classes = Object.keys(CLASS_COLORS)
  
  // Weight distribution - 80% benign, rest split among botnets
  // Tried to match real-world ratios from the training data
  const weights = [0.804, 0.057, 0.057, 0.057, 0.017, 0.004, 0.004]
  
  // Weighted random selection
  let random = Math.random()
  let selectedClass = classes[0]
  let cumulative = 0
  
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i]
    if (random <= cumulative) {
      selectedClass = classes[i]
      break
    }
  }
  
  // Confidence between 75-99% - model is usually pretty sure
  const confidence = 0.75 + Math.random() * 0.24
  
  // Build fake probability distribution across all classes
  // Selected class gets the confidence score, rest share what's left
  const probabilities = {}
  let remaining = 1 - confidence
  classes.forEach((cls, i) => {
    if (cls === selectedClass) {
      probabilities[cls] = confidence
    } else {
      // Add some randomness so it doesn't look too uniform
      const prob = (remaining / (classes.length - 1)) * (0.5 + Math.random())
      probabilities[cls] = Math.max(0.01, prob)
    }
  })
  
  // Normalize so they all add up to 1.0
  const total = Object.values(probabilities).reduce((a, b) => a + b, 0)
  Object.keys(probabilities).forEach(key => {
    probabilities[key] = probabilities[key] / total
  })
  
  return {
    id: Date.now() + Math.random(),  // unique id for React keys
    timestamp: new Date().toISOString(),
    prediction: selectedClass,
    confidence: probabilities[selectedClass],
    probabilities,
    features: Array(35).fill(0).map(() => (Math.random() - 0.5) * 4),  // fake PCA values
  }
}

// =============================================================================
// MAIN APP COMPONENT
// =============================================================================
function App() {
  // ---------------------------------------------------------------------------
  // STATE DECLARATIONS
  // ---------------------------------------------------------------------------
  
  // Rolling window of last 100 classifications for the feed
  const [classifications, setClassifications] = useState([])
  
  // Aggregate stats shown in the cards
  const [stats, setStats] = useState({
    total: 0,
    threats: 0,
    threatPercentage: 0,
    rate: 0,  // packets per second
  })
  
  // Count per class for the pie chart
  const [distribution, setDistribution] = useState({})
  
  // Data points for the timeline chart
  const [timeSeriesData, setTimeSeriesData] = useState([])
  
  // Most recent prediction - drives the hero section
  const [currentThreat, setCurrentThreat] = useState(null)
  
  // Backend connection state: 'connecting' | 'connected' | 'error'
  const [connectionStatus, setConnectionStatus] = useState('connecting')
  
  // Queue of threat alerts (auto-dismiss after 5s)
  const [alerts, setAlerts] = useState([])
  
  // Toggle between live API and demo mode
  // Starts in demo mode so it works without backend
  const [useMockData, setUseMockData] = useState(false)

  // ---------------------------------------------------------------------------
  // API FETCH FUNCTION
  // ---------------------------------------------------------------------------
  // Wrapped in useCallback to prevent unnecessary re-renders
  const fetchPrediction = useCallback(async () => {
  try {
    // Always try API first
    const response = await fetch(`${API_BASE_URL}/predict`)
    if (!response.ok) throw new Error('API error')
    
    const data = await response.json()
    setConnectionStatus('connected')
    return data
  } catch (error) {
    console.error('Failed to fetch prediction:', error)
    // Backend down? Fall back to mock data so UI doesn't break
    setConnectionStatus('error')
    return generateMockPrediction()
  }
}, [])

  // ---------------------------------------------------------------------------
  // PROCESS INCOMING PREDICTIONS
  // ---------------------------------------------------------------------------
  // Takes a prediction object and updates all the relevant state
  // This is where all the dashboard data flows from
  const processPrediction = useCallback((prediction) => {
    
    // Add to the feed, cap at 100 items to prevent memory bloat
    setClassifications(prev => {
      const updated = [prediction, ...prev].slice(0, 100)
      return updated
    })

    // Update the big hero display
    setCurrentThreat(prediction)

    // Fire an alert toast if it's a threat
    // Only show last 5 to avoid spamming the screen
    if (prediction.prediction !== 'BENIGN') {
      const newAlert = {
        id: prediction.id,
        type: prediction.prediction,
        confidence: prediction.confidence,
        timestamp: prediction.timestamp,
      }
      setAlerts(prev => [newAlert, ...prev].slice(0, 5))
    }

    // Increment the count for this class in the pie chart
    setDistribution(prev => {
      const updated = { ...prev }
      updated[prediction.prediction] = (updated[prediction.prediction] || 0) + 1
      return updated
    })

    // Add a data point for the timeline
    setTimeSeriesData(prev => {
      const now = new Date()
      const timeLabel = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      })
      
      // Each point tracks counts for all classes
      const newPoint = {
        time: timeLabel,
        timestamp: now.getTime(),
      }
      
      // Init all to 0
      Object.keys(CLASS_COLORS).forEach(cls => {
        newPoint[cls] = 0
      })
      
      // Mark this prediction
      newPoint[prediction.prediction] = 1
      
      // Rolling window of 50 points
      const updated = [...prev, newPoint].slice(-50)
      return updated
    })

    // Recalculate aggregate stats
    setStats(prev => {
      const newTotal = prev.total + 1
      const newThreats = prev.threats + (prediction.prediction !== 'BENIGN' ? 1 : 0)
      
      // Rate = total divided by seconds since page load
      const elapsedSeconds = (Date.now() - window.startTime) / 1000
      
      return {
        total: newTotal,
        threats: newThreats,
        threatPercentage: ((newThreats / newTotal) * 100).toFixed(1),
        rate: (newTotal / elapsedSeconds).toFixed(1),
      }
    })
  }, [])

  // ---------------------------------------------------------------------------
  // POLLING LOOP
  // ---------------------------------------------------------------------------
  // Kicks off when component mounts, cleans up on unmount
  useEffect(() => {
    // Track when we started for rate calculation
    window.startTime = Date.now()
    setConnectionStatus('connected')

    // Fetch new prediction every 5 seconds
    // Could make this configurable but 5s feels right for demo
    const pollInterval = setInterval(async () => {
      const prediction = await fetchPrediction()
      if (prediction) {
        processPrediction(prediction)
      }
    }, 5000)

    // Cleanup - stop polling when component unmounts
    return () => clearInterval(pollInterval)
  }, [fetchPrediction, processPrediction])

  // ---------------------------------------------------------------------------
  // ALERT DISMISS HANDLER
  // ---------------------------------------------------------------------------
  const dismissAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen grid-bg hex-pattern">
      
      {/* Floating alert toasts - fixed position top right */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        <AnimatePresence>
          {alerts.map(alert => (
            <AlertToast
              key={alert.id}
              alert={alert}
              onDismiss={() => dismissAlert(alert.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Top nav bar */}
      <Header connectionStatus={connectionStatus} />

      {/* Main dashboard content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        
        {/* Big threat status display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ThreatHero currentThreat={currentThreat} />
        </motion.div>

        {/* Stats cards row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StatsCards stats={stats} />
        </motion.div>

        {/* Two column layout - feed on left, pie chart on right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <LiveFeed classifications={classifications} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <DistributionChart distribution={distribution} />
          </motion.div>
        </div>

        {/* Timeline chart - full width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <TimeSeriesChart data={timeSeriesData} />
        </motion.div>
      </main>

      {/* Footer with connection status */}
      <Footer connectionStatus={connectionStatus} stats={stats} />
    </div>
  )
}

export default App
