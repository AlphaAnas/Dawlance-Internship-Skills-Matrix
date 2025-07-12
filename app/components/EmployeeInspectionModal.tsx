"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, User, Award, TrendingUp, Calendar, Building2, Star, Target, Zap } from "lucide-react"
import { useTheme } from "./ThemeProvider"
import Button from "./Button"
import Chip from "./Chip"
import SkillIndicator from "./SkillIndicator"
import type { Employee } from "../types"

interface EmployeeInspectionModalProps {
  employee: Employee | null
  isOpen: boolean
  onClose: () => void
}

export default function EmployeeInspectionModal({ employee, isOpen, onClose }: EmployeeInspectionModalProps) {
  const { isDark } = useTheme()

  if (!employee) return null

  const getSkillColor = (level: string) => {
    switch (level) {
      case "Advanced":
        return "bg-emerald-600 text-white dark:bg-emerald-500"
      case "High":
        return "bg-blue-600 text-white dark:bg-blue-500"
      case "Medium":
        return "bg-amber-600 text-white dark:bg-amber-500"
      case "Low":
        return "bg-red-600 text-white dark:bg-red-500"
      default:
        return "bg-gray-500 text-white dark:bg-gray-400"
    }
  }

  const calculateScore = (skills: Record<string, string>) => {
    const scoreMap = { Low: 1, Medium: 2, High: 3, Advanced: 4 }
    return Object.values(skills).reduce((total, level) => {
      return total + (scoreMap[level as keyof typeof scoreMap] || 0)
    }, 0)
  }

  const calculateAverageSkillLevel = (skills: Record<string, string>) => {
    const scoreMap = { Low: 1, Medium: 2, High: 3, Advanced: 4 }
    const scores = Object.values(skills).map((level) => scoreMap[level as keyof typeof scoreMap] || 0)
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
    return Math.round(average * 10) / 10
  }

  const getSkillDistribution = (skills: Record<string, string>) => {
    const distribution = { Advanced: 0, High: 0, Medium: 0, Low: 0, None: 0 }
    Object.values(skills).forEach((level) => {
      distribution[level as keyof typeof distribution]++
    })
    return distribution
  }

  const totalSkills = Object.keys(employee.skills).length
  const totalScore = calculateScore(employee.skills)
  const averageLevel = calculateAverageSkillLevel(employee.skills)
  const skillDistribution = getSkillDistribution(employee.skills)

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
                        <h3 className="text-2xl font-bold">{skillDistribution.Advanced}</h3>
                        <p className="text-orange-100 text-sm">Advanced Skills</p>
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
                    {Object.entries(employee.skills).map(([skill, level], index) => (
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
                            <SkillIndicator level={level} size={56} showTooltip={true} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                              {skill}
                            </h4>
                            <div className="mt-2">
                              <Chip label={level} className={getSkillColor(level)} />
                            </div>
                            <p className={`text-xs mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                              {level === "Advanced" && "Expert level - Can train others"}
                              {level === "High" && "Proficient - Works independently"}
                              {level === "Medium" && "Competent - Occasional guidance needed"}
                              {level === "Low" && "Basic - Requires supervision"}
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
                        {Object.entries(employee.skills)
                          .filter(([, level]) => level === "Advanced" || level === "High")
                          .slice(0, 3)
                          .map(([skill, level]) => (
                            <li key={skill} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                {skill} ({level})
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
                        {Object.entries(employee.skills)
                          .filter(([, level]) => level === "Low" || level === "Medium")
                          .slice(0, 3)
                          .map(([skill, level]) => (
                            <li key={skill} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                              <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                {skill} ({level})
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
