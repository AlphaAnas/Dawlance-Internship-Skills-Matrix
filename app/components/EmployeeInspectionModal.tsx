"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, User, Award, TrendingUp, Calendar, Building2, Star, Target, Zap } from "lucide-react"
import { useTheme } from "./ThemeProvider"
import Button from "./Button"
import Chip from "./Chip"
import SkillIndicator from "./SkillIndicator"
import type { Employee } from "../types"

interface WorkHistoryItem {
  employee_name: string
  skill_name: string
  department_name: string
  machine_name: string
  skill_level: number
  from_date: string
  end_date: string
  days_worked: number
}

interface EmployeeInspectionModalProps {
  employee: Employee | null
  isOpen: boolean
  onClose: () => void
}

export default function EmployeeInspectionModal({ employee, isOpen, onClose }: EmployeeInspectionModalProps) {
  const { isDark } = useTheme()
  const [workHistory, setWorkHistory] = useState<WorkHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch work history when modal opens and employee changes
  useEffect(() => {
    if (employee && isOpen) {
      fetchWorkHistory()
    }
  }, [employee, isOpen])

  const fetchWorkHistory = async () => {

    // ```
    //     {
    //   "success": true,
    //   "data": [
    //     {
    //       "employee_name": "Hassan Raza",
    //       "skill_name": "Quality Inspection",
    //       "department_name": "Cooling Systems",
    //       "machine_name": "Compressor Tester",
    //       "skill_level": 4,
    //       "from_date": "2023-05-15T09:00:00.000Z",
    //       "end_date": "2024-05-15T17:00:00.000Z",
    //       "days_worked": 366
    //     }
    //   ]
    // }
        
    // ```
    if (!employee) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/all/workHistory?ids=${employee.id}`)
      const data = await response.json()

      if (data.success) {
        setWorkHistory(data.data)
        console.log("Work history fetched:", data.data)
      } else {
        console.error("Failed to fetch work history:", data.error)
        setWorkHistory([])
      }
    } catch (error) {
      console.error("Error fetching work history:", error)
      setWorkHistory([])
    } finally {
      setIsLoading(false)
    }
  }

  if (!employee) return null

  console.log("Inspecting Employee:", employee.skill_profile) // => { skills: [ 'Refrigeration Testing' ] } 
  const getSkillColor = (level: string) => {
    switch (level) {
      case "Highly Skilled":
        return "bg-emerald-600 text-white dark:bg-emerald-500"
      case "Skilled":
        return "bg-blue-600 text-white dark:bg-blue-500"
      case "Semi Skilled":
        return "bg-amber-600 text-white dark:bg-amber-500"
      case "Low Skilled":
        return "bg-red-600 text-white dark:bg-red-500"
      case "None":
        return "bg-gray-500 text-white dark:bg-gray-400"
      default:
        return "bg-gray-500 text-white dark:bg-gray-400"
    }
  }

  const calculateScore = (skills: Record<string, string>) => {
    const scoreMap = { 
      "None": 0,
      "Low Skilled": 1, 
      "Semi Skilled": 2, 
      "Skilled": 3, 
      "Highly Skilled": 4 
    }
    return Object.values(skills).reduce((total, level) => {
      return total + (scoreMap[level as keyof typeof scoreMap] || 0)
    }, 0)
  }

  const calculateAverageSkillLevel = (skills: Record<string, string>) => {
    const scoreMap = { 
      "None": 0,
      "Low Skilled": 1, 
      "Semi Skilled": 2, 
      "Skilled": 3, 
      "Highly Skilled": 4 
    }
    const scores = Object.values(skills).map((level) => scoreMap[level as keyof typeof scoreMap] || 0)
    if (scores.length === 0) return 0
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
    return Math.round(average * 10) / 10
  }

  const getSkillDistribution = (skills: Record<string, string>) => {
    const distribution = { 
      "Highly Skilled": 0, 
      "Skilled": 0, 
      "Semi Skilled": 0, 
      "Low Skilled": 0, 
      "None": 0 
    }
    Object.values(skills).forEach((level) => {
      distribution[level as keyof typeof distribution]++
    })
    return distribution
  }

  const totalSkills = Object.keys(employee.skill_profile?.skills || {}).length
  const totalScore = calculateScore(employee.skill_profile?.skills || {})
  const averageLevel = calculateAverageSkillLevel(employee.skill_profile?.skills || {})
  const skillDistribution = getSkillDistribution(employee.skill_profile?.skills || {})

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${
              isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className={`px-6 py-4 border-b ${
                isDark
                  ? "border-gray-700 bg-gradient-to-r from-gray-800 to-gray-750"
                  : "border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{employee.name}</h2>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Employee ID: {employee.id} • Individual Skills Inspection
                    </p>
                  </div>
                </div>
                <Button onClick={onClose} variant="ghost" size="sm" className="p-2">
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-8">
                {/* Stats Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 text-white">
                    <div className="flex items-center gap-3">
                      <Award className="h-8 w-8" />
                      <div>
                        <h3 className="text-2xl font-bold">{totalSkills}</h3>
                        <p className="text-blue-100 text-sm">Total Skills</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-4 text-white">
                    <div className="flex items-center gap-3">
                      <Zap className="h-8 w-8" />
                      <div>
                        <h3 className="text-2xl font-bold">{totalScore}</h3>
                        <p className="text-purple-100 text-sm">Total Score</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-4 text-white">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-8 w-8" />
                      <div>
                        <h3 className="text-2xl font-bold">{averageLevel}</h3>
                        <p className="text-emerald-100 text-sm">Avg Level</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-4 text-white">
                    <div className="flex items-center gap-3">
                      <Star className="h-8 w-8" />
                      <div>
                        <h3 className="text-2xl font-bold">{skillDistribution["Highly Skilled"]}</h3>
                        <p className="text-orange-100 text-sm">Highly Skilled</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Employee Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`p-6 rounded-xl border ${
                    isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      Employee Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-blue-600" />
                      <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        Department: <strong>Manufacturing</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        Active Since: <strong>Jan 15, 2023</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-600" />
                      <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        Performance: <strong>Excellent</strong>
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Work History Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`p-6 rounded-xl border ${
                    isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      Work History
                    </h3>
                  </div>

                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className={`ml-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        Loading work history...
                      </span>
                    </div>
                  ) : workHistory.length > 0 ? (
                    <div className="space-y-3">
                      {workHistory.slice(0, 5).map((record, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border ${
                            isDark ? "bg-gray-600/30 border-gray-500" : "bg-white border-gray-200"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                                  {record.skill_name}
                                </span>
                                <span className={`text-sm px-2 py-1 rounded ${
                                  record.skill_level >= 4 ? "bg-green-100 text-green-800" :
                                  record.skill_level >= 3 ? "bg-blue-100 text-blue-800" :
                                  record.skill_level >= 2 ? "bg-yellow-100 text-yellow-800" :
                                  "bg-red-100 text-red-800"
                                }`}>
                                  Level {record.skill_level}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <span>📍 {record.department_name}</span>
                                {record.machine_name && <span>🔧 {record.machine_name}</span>}
                                <span>📅 {record.days_worked} days</span>
                              </div>
                            </div>
                            <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                              <div>{new Date(record.from_date).toLocaleDateString()}</div>
                              <div className="text-xs">to</div>
                              <div>{new Date(record.end_date).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {workHistory.length > 5 && (
                        <div className={`text-center text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          ... and {workHistory.length - 5} more records
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`text-center py-8 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No work history found for this employee</p>
                    </div>
                  )}
                </motion.div>

                {/* Individual Skills Breakdown */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className={`p-6 rounded-xl border ${
                    isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      Individual Machine Skills ({totalSkills} total)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(employee.skill_profile?.skills || {}).map(([skill, level], index) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.05 }}
                        className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-lg ${
                          isDark
                            ? "bg-gray-600/50 border-gray-500 hover:bg-gray-600/70"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <SkillIndicator level={level as string} size={56} showTooltip={true} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                              {skill}
                            </h4>
                            <div className="mt-2">
                              <Chip label={level as string} className={getSkillColor(level as string)} />
                            </div>
                            <p className={`text-xs mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                              {level === "Highly Skilled" && "Expert level - Can train others"}
                              {level === "Skilled" && "Proficient - Works independently"}
                              {level === "Semi Skilled" && "Competent - Occasional guidance needed"}
                              {level === "Low Skilled" && "Basic - Requires supervision"}
                              {level === "None" && "No experience with this skill"}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Performance Insights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className={`p-6 rounded-xl border-2 ${
                    isDark
                      ? "bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30"
                      : "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <Star className="h-5 w-5 text-white" />
                    </div>
                    <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      Performance Insights
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className={`font-medium mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Strengths</h4>
                      <ul className="space-y-2">
                        {Object.entries(employee.skill_profile?.skills || {})
                          .filter(([, level]) => level === "Highly Skilled" || level === "Skilled")
                          .slice(0, 3)
                          .map(([skill, level]) => (
                            <li key={skill} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                {skill} ({level as string})
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className={`font-medium mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        Development Areas
                      </h4>
                      <ul className="space-y-2">
                        {Object.entries(employee.skill_profile?.skills || {})
                          .filter(([, level]) => level === "Low Skilled" || level === "Semi Skilled")
                          .slice(0, 3)
                          .map(([skill, level]) => (
                            <li key={skill} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                              <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                {skill} ({level as string})
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
