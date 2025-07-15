import React from 'react'

interface PieChartSkillIndicatorProps {
  level: string
  size?: number
}

const PieChartSkillIndicator: React.FC<PieChartSkillIndicatorProps> = ({ level, size = 64 }) => {
  const colors = {
    None: "#E5E7EB",
    "Low Skilled": "#EF4444",
    "Semi Skilled": "#F59E0B", 
    Skilled: "#3B82F6",
    "Highly Skilled": "#10B981",
  }
  
  const fillPercentages = {
    None: 0,
    "Low Skilled": 25,
    "Semi Skilled": 50,
    Skilled: 75,
    "Highly Skilled": 100,
  }
  
  const color = colors[level as keyof typeof colors] || colors.None
  const fillPercentage = fillPercentages[level as keyof typeof fillPercentages] || 0
  
  // Calculate the stroke-dasharray for the circle
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = `${(circumference * fillPercentage) / 100} ${circumference}`
  
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="4"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      
      {/* Center text */}
      <div 
        className="absolute inset-0 flex items-center justify-center text-white font-bold"
        style={{ fontSize: `${size * 0.2}px` }}
      >
        <span className="text-gray-700 dark:text-gray-300">
          {level === "None" ? "0%" :
           level === "Low Skilled" ? "25%" :
           level === "Semi Skilled" ? "50%" :
           level === "Skilled" ? "75%" : "100%"}
        </span>
      </div>
    </div>
  )
}

export default PieChartSkillIndicator