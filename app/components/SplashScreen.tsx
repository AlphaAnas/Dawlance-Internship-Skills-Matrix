"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "./ThemeProvider"

interface SplashScreenProps {
  show: boolean
}

export default function SplashScreen({ show }: SplashScreenProps) {
  const { isDark } = useTheme()

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`fixed inset-0 z-50 flex items-center justify-center ${
            isDark
              ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
              : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
          }`}
        >
          <div className="text-center">
            {/* Animated Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              <div
                className={`mx-auto w-24 h-24 rounded-2xl flex items-center justify-center ${
                  isDark
                    ? "bg-gradient-to-br from-blue-500 to-purple-600"
                    : "bg-gradient-to-br from-blue-600 to-purple-700"
                } shadow-2xl`}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="text-white text-3xl font-bold"
                >
                  ⚡
                </motion.div>
              </div>
            </motion.div>

            {/* Animated Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1
                className={`text-4xl md:text-5xl font-bold mb-4 ${
                  isDark
                    ? "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                    : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
                } bg-clip-text text-transparent`}
              >
                Skills Portal
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}
              >
                Empowering teams through skill management
              </motion.p>
            </motion.div>

            {/* Loading Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.4 }}
              className="mt-12"
            >
              <div className="flex justify-center space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.2, 1],
                      backgroundColor: [
                        isDark ? "#3B82F6" : "#2563EB",
                        isDark ? "#8B5CF6" : "#7C3AED",
                        isDark ? "#EC4899" : "#DB2777",
                        isDark ? "#3B82F6" : "#2563EB",
                      ],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.2,
                    }}
                    className="w-3 h-3 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
